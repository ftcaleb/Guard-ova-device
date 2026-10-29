// e2e/emergency-flow.cjs — end-to-end test of the emergency flow (Screens 7–9)
// Runs the real app on Expo web at 402 × 874 @3x (DESIGN-SPEC frame) and checks every
// requirement: hold-to-activate, countdown + cancel, wearable trigger, Emergency Active,
// call / view location / end with confirmation, and restore after the app closes.
// Screenshots + side-by-side comparisons with design/screens land in e2e/shots/ (git-ignored).
//
// Usage: npx expo start --web   (in another terminal), then:  npm run e2e:emergency [-- baseUrl]
// Note: Metro must watch files (don't start it with CI=1), or it serves a stale bundle.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:8081';
const OUT = path.join(__dirname, 'shots');
const REF = path.join(__dirname, '..', '..', 'design', 'screens');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function stored(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem('guardova-emergency');
    return raw ? JSON.parse(raw).state : null;
  });
}

const pending = [];
async function shot(page, name, ref) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  if (ref) pending.push({ file, name, ref });
}
async function composeAll(browser) {
  // side by side: reference left, app right
  const ctx = await browser.newContext({ viewport: { width: 2440, height: 2622 } });
  const p = await ctx.newPage();
  for (const { file, name, ref } of pending) {
    const a = 'data:image/png;base64,' + fs.readFileSync(path.join(REF, `${ref}.png`)).toString('base64');
    const b = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    await p.setContent(`<body style="margin:0;display:flex;gap:28px;background:#f0f"><img src="${a}"><img src="${b}"></body>`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, `${name}--vs-${ref}.png`) });
  }
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 3, hasTouch: false });
  const page = await context.newPage();
  const logs = [];
  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('[SOS]')) logs.push(t);
    if (m.type() === 'error' && !t.includes('[SOS]')) console.log('  console.error:', t.slice(0, 300));
  });
  page.on('pageerror', (e) => console.log('  pageerror:', e.message));

  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE);
  await page.getByText('Help is always within reach.').waitFor();

  // ── Screen 7: SOS Activation ────────────────────────────────────────────
  await page.getByRole('button', { name: 'Activate SOS' }).click(); // Home banner → /sos
  await page.waitForURL('**/sos');
  check('Home SOS banner opens SOS Activation (not the countdown)', page.url().endsWith('/sos'));
  await page.getByText('You don’t have to face it alone.').waitFor();
  await sleep(300);
  await shot(page, '50-sos-activation', '50-sos-activation');

  // ordinary tap
  await page.getByTestId('sos-activate').click();
  await sleep(2500);
  check('Ordinary tap on Activate SOS does NOT start the countdown',
    page.url().endsWith('/sos') && (await stored(page))?.incident == null);

  // short press (0.8 s) also does nothing
  const btn = page.getByTestId('sos-activate');
  const box = await btn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await sleep(800); await page.mouse.up();
  await sleep(1500);
  check('Short press (0.8 s) does NOT start the countdown', page.url().endsWith('/sos'));

  // hold
  await page.mouse.down(); await sleep(1700); await page.mouse.up();
  const heldAt = Date.now();
  await page.waitForURL('**/sos/countdown', { timeout: 3000 });
  check('Holding Activate SOS (1.7 s) starts the countdown', page.url().endsWith('/sos/countdown'));
  await page.getByText('Help is on its way.').waitFor();
  console.log(`      (countdown screen painted ${Date.now() - heldAt} ms after release)`);

  // ── Screen 8: Countdown, then cancel ───────────────────────────────────
  await page.getByText('Help is on its way.').waitFor();
  const firstNumber = await page.locator('text=/^[1-3]$/').first().textContent();
  // 3 s countdown: the first frame shows 3 unless the (dev, lazily loaded) route painted late.
  const endsAt = (await stored(page)).incident.countdownEndsAt;
  const expected = String(Math.max(1, Math.ceil((endsAt - Date.now()) / 1000)));
  check('Countdown starts at 3 and follows the deadline', endsAt - heldAt <= 3100 && firstNumber === expected,
    `saw ${firstNumber}, expected ${expected}`);
  await shot(page, '52-sos-countdown-3', '52-sos-countdown-3');
  await page.getByText(/notified in 2 seconds/).waitFor({ timeout: 1500 });
  check('Countdown says My Network will be notified',
    await page.getByText(/Your network will be notified in [1-3] seconds?\./).isVisible());
  const second = await page.locator('text=/^[1-3]$/').first().textContent();
  check('Countdown ticks down', second === '2', `saw ${second}`);
  await page.getByTestId('sos-cancel').click();
  await page.getByText('SOS cancelled. No alerts were sent.').waitFor();
  await sleep(300);
  await shot(page, '53-home-toast-sos-cancelled', '53-home-toast-sos-cancelled');
  await sleep(3000); // longer than the countdown would have taken
  let st = await stored(page);
  const cancelled = st.incidents.at(-1);
  check('Cancel returns Home with the toast', !page.url().includes('/sos') && !page.url().includes('/emergency'));
  check('Cancelled: no emergency raised, no alert sent', st.incident === null && cancelled.status === 'cancelled'
    && cancelled.deliveries.length === 0 && !cancelled.events.some((e) => e.type.startsWith('alert')));
  check('Cancellation is recorded with its events', cancelled.events.map((e) => e.type).join(',') === 'pressed,countdown_started,cancelled',
    cancelled.events.map((e) => e.type).join(','));

  // ── Wearable simulator → countdown → Emergency Active ──────────────────
  await page.getByRole('tab', { name: 'Device' }).click();
  await page.getByText('Simulate wearable button press').click();
  await page.waitForURL('**/sos/countdown');
  st = await stored(page);
  check('Wearable simulator starts the countdown (source: wearable)', st.incident?.source === 'wearable');
  await shot(page, '54-countdown-from-wearable', '54-countdown-from-wearable');
  await page.waitForURL('**/emergency', { timeout: 5000 });
  const elapsed = Date.now();
  check('Countdown expiry opens Emergency Active', page.url().endsWith('/emergency'));
  await page.getByText('You’re not alone.').waitFor();
  await sleep(400);
  await shot(page, '55-emergency-active', '55-emergency-active');
  check('Shows 4/4 trusted contacts notified', await page.getByText('4/4', { exact: true }).isVisible());
  check('Each member row says delivered', (await page.getByText('Emergency alert delivered').count()) === 4);
  st = await stored(page);
  check('Incident active with 4 delivered alerts', st.incident.status === 'active'
    && st.incident.deliveries.every((d) => d.status === 'delivered') && st.incident.membersNotified === 4);

  // full-length screenshot
  await page.setViewportSize({ width: 402, height: 1409 });
  await sleep(300);
  await page.screenshot({ path: path.join(OUT, '55-emergency-active--full.png') });
  await page.setViewportSize({ width: 402, height: 874 });

  // ── Restore after the app closes ───────────────────────────────────────
  await page.goto(BASE); // "relaunch" at Home
  await page.waitForURL('**/emergency', { timeout: 8000 });
  check('Relaunch during an emergency restores Emergency Active', page.url().endsWith('/emergency'));
  st = await stored(page);
  check('Restore is logged, alerts not re-sent', st.incident.events.some((e) => e.type === 'restored')
    && st.incident.events.filter((e) => e.type === 'alert_sent').length === 4);

  // ── Call emergency services ────────────────────────────────────────────
  await page.getByTestId('emergency-call').click();
  await page.getByText('Call emergency services', { exact: true }).last().waitFor();
  await sleep(300);
  await shot(page, '56-modal-call-emergency', '56-modal-call-emergency');
  await page.getByRole('button', { name: 'Demonstrate call' }).click();
  await page.getByText('Call action demonstrated. No real call was made.').waitFor();
  check('Call emergency services → demo modal → toast', true);

  // ── View location ──────────────────────────────────────────────────────
  await page.getByTestId('emergency-view-location').click();
  await page.waitForURL('**/map');
  check('View location opens Live Map', page.url().endsWith('/map'));
  await page.goto(BASE + '/emergency');
  await page.getByText('You’re not alone.').waitFor();

  // ── End emergency with confirmation ────────────────────────────────────
  await page.getByTestId('emergency-end').click();
  await page.getByText('Are you safe now?').waitFor();
  await sleep(300);
  await shot(page, '64-modal-end-emergency', '64-modal-end-emergency');
  await page.getByRole('button', { name: 'Keep emergency active' }).click();
  await sleep(500);
  check('“Keep emergency active” keeps it active', page.url().endsWith('/emergency') && (await stored(page)).incident?.status === 'active');
  await page.getByTestId('emergency-end').click();
  await page.getByRole('button', { name: 'Yes, I’m safe — end emergency' }).click();
  await page.getByText('Emergency ended. Your network has been notified that you’re safe.').waitFor();
  await sleep(300);
  await shot(page, '65-home-toast-emergency-ended', '65-home-toast-emergency-ended');
  st = await stored(page);
  check('Ended: incident resolved and saved with member count', st.incident === null
    && st.incidents.at(-1).status === 'resolved' && st.incidents.at(-1).membersNotified === 4);
  await page.goto(BASE);
  await sleep(2500);
  check('Relaunch after ending stays on Home', !page.url().includes('/emergency'));

  // ── Crash mid-countdown: countdown resumes, then fires ─────────────────
  await page.goto(BASE + '/sos');
  await page.getByTestId('sos-activate').waitFor();
  const b2 = await page.getByTestId('sos-activate').boundingBox();
  await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
  await page.mouse.down(); await sleep(1700); await page.mouse.up();
  await page.waitForURL('**/sos/countdown');
  await page.goto(BASE); // relaunch with ~3 s left
  await page.waitForURL('**/sos/countdown', { timeout: 5000 });
  check('Relaunch mid-countdown resumes the countdown', page.url().endsWith('/sos/countdown'));
  await page.waitForURL('**/emergency', { timeout: 6000 });
  check('Resumed countdown still raises the emergency', page.url().endsWith('/emergency'));
  await page.getByTestId('emergency-end').click();
  await page.getByRole('button', { name: 'Yes, I’m safe — end emergency' }).click();
  await sleep(500);

  // ── App closed during the countdown, reopened after it ran out ─────────
  await page.goto(BASE + '/device');
  await page.getByText('Simulate wearable button press').click();
  await page.waitForURL('**/sos/countdown');
  await page.goto('about:blank'); // app closed
  await sleep(4000);
  await page.goto(BASE);
  await page.waitForURL('**/emergency', { timeout: 8000 });
  st = await stored(page);
  check('Countdown that expired while closed raises the emergency on reopen',
    page.url().endsWith('/emergency') && st.incident.events.some((e) => e.type === 'activated' && e.details.trigger === 'restored'));
  await page.getByTestId('emergency-end').click();
  await page.getByRole('button', { name: 'Yes, I’m safe — end emergency' }).click();
  await sleep(300);

  // ── Activate immediately ───────────────────────────────────────────────
  await page.goto(BASE + '/device');
  await page.getByText('Simulate wearable button press').click();
  await page.waitForURL('**/sos/countdown');
  await page.getByTestId('sos-activate-now').click();
  await page.waitForURL('**/emergency', { timeout: 1500 });
  st = await stored(page);
  check('“Activate immediately” raises the emergency at once',
    st.incident.events.some((e) => e.type === 'activated' && e.details.trigger === 'immediate'));
  // second wearable press during an emergency must not start a new incident
  const idBefore = st.incident.id;
  await page.getByRole('tab', { name: 'Device' }).click();
  await page.getByText('Simulate wearable button press').click();
  await page.waitForURL('**/emergency');
  st = await stored(page);
  check('Wearable press during an emergency reopens it (no duplicate)', st.incident.id === idBefore
    && st.incident.events.filter((e) => e.type === 'activated').length === 1);

  fs.writeFileSync(path.join(OUT, 'sos-log.txt'), logs.join('\n'));
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} checks passed. ${logs.length} [SOS] log lines → e2e/shots/sos-log.txt`);
  await composeAll(browser);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
