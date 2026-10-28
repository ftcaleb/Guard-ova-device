/**
 * Renders every screen/state of the Guard'Ova reference prototype at iPhone 402x874 pt @3x.
 * Also writes: <OUT>/layout/<state>.json (computed layout of every element) and <OUT>/fonts-used.json.
 *
 *   cd design/reference-prototype && npm i && npm run dev        # serves http://localhost:5173
 *   npm i -D playwright && npx playwright install chromium        # once, at the repo root
 *   node design/tools/capture-reference.cjs                       # -> design/screens-baseline/
 *   URL=http://localhost:8081/ OUT=qa/app node design/tools/capture-reference.cjs   # same flow against another URL
 *
 * The clock is frozen after load (page.clock.install) so timers (SOS countdown, toast auto-dismiss) are deterministic.
 * Selectors are the prototype's CSS classes / visible text. To drive the React Native (web) build with the same
 * steps, give the RN components matching testIDs or reuse the text-based clicks.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.env.OUT || 'design/screens-baseline';
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.URL || 'http://localhost:5173/';
const log = [];

(async () => {
  const browser = await chromium.launch();

  async function fresh() {
    const page = await browser.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 3 });
    page.on('pageerror', e => console.log('PAGEERROR', e.message));
    await page.goto(URL);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.waitForTimeout(300);
    await page.clock.install();
    return page;
  }
  async function settle(page) {
    await page.waitForTimeout(450);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
  }
  // click a button (or selector) whose text contains `text`
  async function click(page, text, sel = 'button', nth = 0) {
    const ok = await page.evaluate(([t, s, n]) => {
      const els = [...document.querySelectorAll(s)].filter(b => b.textContent.replace(/\s+/g, ' ').trim().includes(t));
      if (!els[n]) return false; els[n].click(); return true;
    }, [text, sel, nth]);
    if (!ok) throw new Error('Not found: ' + text + ' in ' + sel);
    await settle(page);
  }
  async function tab(page, name) { await click(page, name, '.mobile-nav button'); }
  async function shot(page, name, desc, { full = true, viewport = true } = {}) {
    await collectFonts(page);
    await dumpLayout(page, name);
    if (viewport) { await page.screenshot({ path: `${OUT}/${name}.png` }); }
    if (full) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      if (h > 880) { await page.screenshot({ path: `${OUT}/${name}--full.png`, fullPage: true }); log.push({ name, desc, full: true }); return; }
    }
    log.push({ name, desc, full: false });
  }


  const fontUse = {};
  async function collectFonts(page) {
    const rows = await page.evaluate(() => {
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = walker.nextNode())) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        if (el.closest('.sidebar')) continue;
        out.push([cs.fontFamily.split(',')[0].replace(/['"]/g,''), cs.fontSize, cs.fontWeight, cs.letterSpacing, cs.lineHeight, el.tagName.toLowerCase() + (el.className && typeof el.className==='string' ? '.'+el.className.split(' ')[0] : '')]);
      }
      // SVG text in the map
      document.querySelectorAll('svg text').forEach(t => { const cs = getComputedStyle(t); out.push([cs.fontFamily.split(',')[0].replace(/['"]/g,''), cs.fontSize, cs.fontWeight, cs.letterSpacing, 'svg', 'svg-text']); });
      return out;
    });
    for (const r of rows) { const k = r.slice(0,3).join('|'); fontUse[k] = fontUse[k] || new Set(); fontUse[k].add(r[5]); }
  }


  const LAYOUT = (process.env.LAYOUT || OUT + '/layout'); fs.mkdirSync(LAYOUT, { recursive: true });
  async function dumpLayout(page, name) {
    const data = await page.evaluate(() => {
      const KEEP = ['display','position','flexDirection','alignItems','justifyContent','flexWrap','gap','rowGap','columnGap',
        'paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft',
        'fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform','textAlign','color',
        'backgroundColor','backgroundImage','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
        'borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','borderTopStyle','borderBottomStyle',
        'borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius',
        'boxShadow','opacity','transform','filter','backdropFilter','overflow','zIndex','whiteSpace','textOverflow','stroke','strokeWidth','fill'];
      const DEFAULTS = { display:'block', position:'static', flexDirection:'row', alignItems:'normal', justifyContent:'normal', flexWrap:'nowrap',
        gap:'normal', rowGap:'normal', columnGap:'normal', paddingTop:'0px', paddingRight:'0px', paddingBottom:'0px', paddingLeft:'0px',
        marginTop:'0px', marginRight:'0px', marginBottom:'0px', marginLeft:'0px', textTransform:'none', textAlign:'start',
        backgroundColor:'rgba(0, 0, 0, 0)', backgroundImage:'none', borderTopWidth:'0px', borderRightWidth:'0px', borderBottomWidth:'0px', borderLeftWidth:'0px',
        borderTopStyle:'none', borderBottomStyle:'none', borderTopLeftRadius:'0px', borderTopRightRadius:'0px', borderBottomRightRadius:'0px', borderBottomLeftRadius:'0px',
        boxShadow:'none', opacity:'1', transform:'none', filter:'none', backdropFilter:'none', overflow:'visible', zIndex:'auto', whiteSpace:'normal', textOverflow:'clip',
        letterSpacing:'normal' };
      const sy = window.scrollY;
      const out = [];
      const all = document.querySelectorAll('body *');
      const ids = new Map();
      let idx = 0;
      for (const el of all) {
        if (el.closest('.sidebar') || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        ids.set(el, idx);
        const st = {};
        for (const k of KEEP) { const v = cs[k]; if (v === undefined || v === '' ) continue; if (DEFAULTS[k] !== undefined && DEFAULTS[k] === v) continue;
          if (['borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'].includes(k) && cs[k.replace('Color','Width')] === '0px') continue;
          if (['borderTopStyle','borderBottomStyle'].includes(k) && cs[k.replace('Style','Width')] === '0px') continue;
          if (['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign'].includes(k) && el.parentElement && getComputedStyle(el.parentElement)[k] === v && !el.childNodes.length) continue;
          if (['stroke','strokeWidth','fill'].includes(k) && el.tagName.toLowerCase() !== 'svg') continue;
          st[k] = v; }
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g,' ').trim();
        const cls = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
        out.push({ i: idx++, tag: el.tagName.toLowerCase(), cls: cls || undefined, text: own || undefined,
          aria: el.getAttribute('aria-label') || undefined,
          parent: ids.has(el.parentElement) ? ids.get(el.parentElement) : undefined,
          x: +r.left.toFixed(2), y: +(r.top + sy).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), style: st });
      }
      return { viewport: { w: innerWidth, h: innerHeight }, scrollHeight: document.documentElement.scrollHeight, elements: out };
    });
    fs.writeFileSync(`${LAYOUT}/${name}.json`, JSON.stringify(data));
  }

  let p;

  // ---------- Onboarding ----------
  p = await fresh();
  await tab(p, 'Settings'); await click(p, 'How Guard');
  await shot(p, '01-welcome-step1', 'Welcome / onboarding, step 1 of 3 (wearable)');
  await click(p, 'Continue'); await shot(p, '02-welcome-step2', 'Welcome / onboarding, step 2 of 3 (network ring)');
  await click(p, 'Continue'); await shot(p, '03-welcome-step3', 'Welcome / onboarding, step 3 of 3 (shield) – button reads "Enter my safety space"');
  await p.close();

  // ---------- Home ----------
  p = await fresh();
  await settle(p);
  await shot(p, '10-home', 'Home / Overview – default state (safe, device connected, 4/5 network)');
  await p.close();

  // ---------- Device ----------
  p = await fresh();
  await tab(p, 'Device');
  await shot(p, '20-device-connected', 'My Device – Connected (normal)');
  for (const [state, slug] of [['Disconnected', 'disconnected'], ['Low battery', 'low-battery'], ['GPS unavailable', 'gps-unavailable']]) {
    await p.selectOption('#device-state', state); await settle(p);
    await shot(p, `21-device-${slug}`, `My Device – "${state}" warning state (amber pill + warning box + changed values)`);
    await tab(p, 'Home');
    await shot(p, `22-home-device-${slug}`, `Home – device card in "${state}" state`);
    await tab(p, 'Device');
  }
  await p.selectOption('#device-state', 'Connected'); await settle(p);
  await click(p, 'Test device');
  await shot(p, '23-device-toast-test-passed', 'My Device – toast after "Test device"', { full: false });
  await p.close();

  p = await fresh();
  await tab(p, 'Device'); await click(p, 'Device settings');
  await shot(p, '24-modal-device-preferences', 'Modal – Device preferences', { full: false });
  await p.close();

  // ---------- Network ----------
  p = await fresh();
  await tab(p, 'Network');
  await shot(p, '30-network', 'My Network – 4/5 members, Add member tile');
  await click(p, 'Mom', '.member-tile');
  await shot(p, '31-profile-mom-online', 'Member profile – Mom (Online)');
  await click(p, 'Back to My Network');
  await click(p, 'Lerato', '.member-tile');
  await shot(p, '32-profile-lerato-away', 'Member profile – Lerato (Away, amber pill)');
  await click(p, 'Call Lerato');
  await shot(p, '33-modal-call-member', 'Modal – Call member (demo)', { full: false });
  await p.close();

  p = await fresh();
  await tab(p, 'Network'); await click(p, 'Add member', '.member-tile');
  await shot(p, '34-modal-invite-empty', 'Modal – Invite a trusted person (empty form)', { full: false });
  await p.fill('#invite-name', 'Nomsa Dlamini'); await p.fill('#invite-phone', '+27 82 123 4567');
  await p.focus('#invite-phone');
  await shot(p, '35-modal-invite-filled', 'Modal – Invite form filled in (focus ring on input)', { full: false });
  await click(p, 'Send invitation');
  await shot(p, '35b-modal-invite-validation-bug', 'PROTOTYPE BUG – name field pattern rejects every name, so the form never submits. Do NOT replicate (see README)', { full: false });
  await p.evaluate(() => document.getElementById('invite-name').removeAttribute('pattern'));
  await click(p, 'Send invitation');
  await shot(p, '36-network-full-5of5', 'My Network – 5/5 after invite (intended behaviour: no Add tile, new "Invited" member) + toast');
  await p.evaluate(() => { const b = document.querySelector('.toast button'); b && b.click(); }); await settle(p);
  await click(p, 'Nomsa', '.member-tile');
  await shot(p, '37-profile-invited', 'Member profile – invited member ("Invitation pending")');
  await tab(p, 'Home');
  await shot(p, '38-home-network-5of5', 'Home – network card at 5/5');
  await p.close();

  // ---------- Map ----------
  p = await fresh();
  await tab(p, 'Map');
  await shot(p, '40-live-map', 'Live Map – normal (member markers + member list)');
  await p.close();

  // ---------- SOS flow ----------
  p = await fresh();
  await click(p, 'Activate SOS', '.sos-button');
  await shot(p, '50-sos-activation', 'SOS Activation (before countdown)');
  await click(p, 'Activate SOS', '.danger-button');
  await shot(p, '51-sos-countdown-5', 'SOS Countdown – 5 seconds (orb pulses)');
  await p.clock.runFor(1000); await p.waitForTimeout(200);
  await p.clock.runFor(1000); await p.waitForTimeout(200);
  await shot(p, '52-sos-countdown-3', 'SOS Countdown – 3 seconds');
  await click(p, 'Cancel SOS');
  await shot(p, '53-home-toast-sos-cancelled', 'Home – toast after cancelling SOS', { full: false });
  await p.close();

  p = await fresh();
  await tab(p, 'Device'); await click(p, 'Simulate wearable button press');
  await shot(p, '54-countdown-from-wearable', 'SOS Countdown triggered from the wearable (same screen)', { full: false });
  await click(p, 'Activate immediately');
  await shot(p, '55-emergency-active', 'Emergency Active – alerts delivered');
  await click(p, 'Call emergency services');
  await shot(p, '56-modal-call-emergency', 'Modal – Call emergency services (112 note)', { full: false });
  await click(p, '', '.modal-close');
  await click(p, 'Preview a network member');
  await shot(p, '57-member-alert', 'Member Alert – what Mom sees ("I’m responding" not yet tapped)');
  await click(p, 'Call Siyabonga');
  await shot(p, '58-modal-call-siyabonga', 'Modal – Call Siyabonga', { full: false });
  await click(p, '', '.modal-close');
  await click(p, 'I’m responding');
  await shot(p, '59-member-alert-responding', 'Member Alert – after "I’m responding" (green button + toast)');
  await p.evaluate(() => { const b = document.querySelector('.toast button'); b && b.click(); }); await settle(p);
  await click(p, 'Return to your view');
  await shot(p, '60-emergency-someone-responding', 'Emergency Active – Mom shows "Responding · On their way"');
  await tab(p, 'Home');
  await shot(p, '61-home-emergency', 'Home – during an active emergency (rose safety card)');
  await tab(p, 'Map');
  await shot(p, '62-live-map-emergency', 'Live Map – during an emergency (red marker, emergency copy)');
  await p.click('.notification-button'); await settle(p);
  await shot(p, '63-modal-notifications-emergency', 'Modal – Notifications during emergency ("View active emergency")', { full: false });
  await click(p, 'View active emergency');
  await click(p, 'End emergency');
  await shot(p, '64-modal-end-emergency', 'Modal – Are you safe now?', { full: false });
  await click(p, 'Yes, I’m safe');
  await shot(p, '65-home-toast-emergency-ended', 'Home – back to safe + toast "Emergency ended…"', { full: false });
  await p.evaluate(() => { const b = document.querySelector('.toast button'); b && b.click(); });
  await p.evaluate(() => { const b=[...document.querySelectorAll('.sidebar .nav-item')].find(x=>x.textContent.includes('Incident History')); b.click(); });
  await settle(p);
  await shot(p, '71-history-with-incident', 'Incident History – with one resolved incident');
  await p.close();

  // ---------- History empty ----------
  p = await fresh();
  await p.evaluate(() => { const b=[...document.querySelectorAll('.sidebar .nav-item')].find(x=>x.textContent.includes('Incident History')); b.click(); });
  await settle(p);
  await shot(p, '70-history-empty', 'Incident History – empty state (no mobile tab; reached from desktop sidebar)');
  await p.close();

  // ---------- Settings ----------
  p = await fresh();
  await tab(p, 'Settings');
  await shot(p, '80-settings', 'Settings – both toggles on');
  await p.click('[aria-label="Share my location"]'); await settle(p);
  await shot(p, '81-settings-toggle-off', 'Settings – "Share my location" toggled off');
  await click(p, '', '.remove-member', 1);
  await shot(p, '82-modal-remove-member', 'Modal – Remove member (Thabo)', { full: false });
  await click(p, 'Remove from My Network');
  await shot(p, '83-settings-member-removed', 'Settings – after removing a member (3/5) + toast');
  await p.close();

  // ---------- Notifications (normal) ----------
  p = await fresh();
  await p.click('.notification-button'); await settle(p);
  await shot(p, '90-modal-notifications', 'Modal – Notifications (normal)', { full: false });
  await p.close();


  // ---------- Transparent illustration assets ----------
  const ASSETS = OUT + '/assets'; fs.mkdirSync(ASSETS, { recursive: true });
  const clear = 'html,body,.app-shell,main,.card,.welcome-layout,.welcome-visual{background:transparent!important;border-color:transparent!important;box-shadow:none!important}';
  for (const scale of [1, 2, 3]) {
    const b2 = await browser.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: scale });
    await b2.goto(URL); await b2.evaluate(() => document.fonts.ready); await b2.addStyleTag({ content: clear }); await b2.waitForTimeout(300);
    const sfx = scale === 1 ? '' : `@${scale}x`;
    await b2.locator('.device-card .wearable-scene').screenshot({ path: `${ASSETS}/wearable-home-card${sfx}.png`, omitBackground: true });
    await b2.evaluate(() => [...document.querySelectorAll('.mobile-nav button')].find(b=>b.textContent.includes('Device')).click()); await b2.waitForTimeout(500);
    await b2.locator('.device-product > .wearable-scene').screenshot({ path: `${ASSETS}/wearable-device-screen${sfx}.png`, omitBackground: true });
    await b2.evaluate(() => [...document.querySelectorAll('.mobile-nav button')].find(b=>b.textContent.includes('Settings')).click()); await b2.waitForTimeout(400);
    await b2.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.textContent.includes('How Guard')).click()); await b2.waitForTimeout(500);
    await b2.locator('.welcome-visual').screenshot({ path: `${ASSETS}/wearable-welcome${sfx}.png`, omitBackground: true });
    await b2.close();
  }
  const fu = Object.entries(fontUse).map(([k, v]) => { const [family, size, weight] = k.split('|'); return { family, size: parseFloat(size), weight: +weight, usedBy: [...v].slice(0, 6) }; }).sort((a, b) => a.family.localeCompare(b.family) || a.size - b.size || a.weight - b.weight);
  fs.writeFileSync(OUT + '/fonts-used.json', JSON.stringify(fu, null, 2));

  fs.writeFileSync(OUT + '/_captures.json', JSON.stringify(log, null, 2));
  console.log('captured', log.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
