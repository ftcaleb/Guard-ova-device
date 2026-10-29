// Guard'Ova — Global App Store (Zustand)
// Source: design/DESIGN-SPEC.md §11.3 (state variables)
// All demo data from design/reference-prototype/src/App.tsx

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_RETRY_BASE_MS,
  ALERT_RETRY_MAX_MS,
  SOS_COUNTDOWN_SECONDS,
} from '../config';
import { sendEmergencyAlert, sendEmergencyEnded } from '../data/alerts';
import {
  ActivationTrigger,
  Incident,
  IncidentEvent,
  SosSource,
  activate,
  addEvent,
  cancel,
  createCountdown,
  end,
  updateDelivery,
} from '../features/sos/incident';
import { logIncidentError, logIncidentEvent } from '../features/sos/log';

// ─── Member type ─────────────────────────────────────────────────────────────
export type AvatarColor = 'rose' | 'blue' | 'sage' | 'purple';
export type MemberStatus = 'Online' | 'Away' | 'Invited';

export interface Member {
  name: string;
  initials: string;
  relation: string;
  color: AvatarColor;
  status: MemberStatus;
}

// ─── Device state ─────────────────────────────────────────────────────────────
export type DeviceState = 'Connected' | 'Disconnected' | 'Low battery' | 'GPS unavailable';

// ─── App state ────────────────────────────────────────────────────────────────
export interface AppState {
  // Navigation (mirrors prototype screen variable)
  screen: string;
  setScreen: (s: string) => void;

  // Members (4 demo people, same as App.tsx)
  members: Member[];
  setMembers: (m: Member[]) => void;
  addMember: (m: Member) => void;
  removeMember: (name: string) => void;

  // Currently viewed member (for Profile / Alert screens)
  selectedMember: Member;
  setSelectedMember: (m: Member) => void;

  // Modal (string key or null)
  modal: string | null;
  setModal: (m: string | null) => void;

  // Toast message
  toast: string;
  setToast: (msg: string) => void;
  notify: (msg: string) => void;

  // Emergency active flag. Derived from `incident`; only the SOS actions below change it.
  emergency: boolean;

  // Network member responding flag (any member has tapped "I'm responding")
  responding: boolean;

  // Device state (Connected / Disconnected / Low battery / GPS unavailable)
  deviceState: DeviceState;
  setDeviceState: (s: DeviceState) => void;

  // Settings toggles
  shareLocation: boolean;
  setShareLocation: (v: boolean) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;

  // Invite form
  inviteName: string;
  setInviteName: (v: string) => void;
  invitePhone: string;
  setInvitePhone: (v: string) => void;

  // Onboarding step (0–2)
  onboardingStep: number;
  setOnboardingStep: (n: number) => void;

  // ─── Emergency flow (docs/architecture/SOS-FLOW.md) ─────────────────────────
  // The open incident (countdown or active). Persisted, so an emergency survives
  // the app being closed or crashing.
  incident: Incident | null;
  // Closed incidents, oldest first: resolved ones feed Incident History, cancelled
  // ones are kept as the record that an SOS was started and called off.
  incidents: Incident[];
  hasHydrated: boolean;

  /** Start the countdown. Idempotent: returns the open incident if there already is one. */
  startCountdown: (source: SosSource) => Incident;
  /** Cancel during the countdown. No alert is sent. Returns false if there was nothing to cancel. */
  cancelCountdown: () => boolean;
  /** Countdown finished or "Activate immediately". Safe to call twice. */
  activateEmergency: (trigger: ActivationTrigger) => boolean;
  /** Send (or re-send) every alert that is not delivered yet. Safe to call any time. */
  dispatchAlerts: () => void;
  /** "Yes, I'm safe — end emergency". */
  endEmergency: () => void;
  /** A network member tapped "I'm responding" (decision D16: mark that member). */
  respond: (memberName: string) => void;
  recordEmergencyCall: (placed: boolean) => void;
  /** Called once after the store is loaded from storage. */
  restoreIncident: () => 'none' | 'countdown' | 'active';
}

// ─── Initial demo members (exact copy from App.tsx) ───────────────────────────
const INITIAL_MEMBERS: Member[] = [
  { name: 'Mom',    initials: 'NM', relation: 'Family', color: 'rose',   status: 'Online' },
  { name: 'Thabo',  initials: 'TM', relation: 'Friend', color: 'blue',   status: 'Online' },
  { name: 'Kabelo', initials: 'KM', relation: 'Brother', color: 'sage',  status: 'Online' },
  { name: 'Lerato', initials: 'LM', relation: 'Friend', color: 'purple', status: 'Away'   },
];

// Web static rendering runs in Node, where there is no window/localStorage: persist
// nothing there and stay un-hydrated, so server and client both render the splash state.
const isServer = typeof window === 'undefined';
const serverStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

// Alerts currently being sent, keyed "<incident id>:<member>", so a second
// dispatchAlerts() while one is in flight never sends the same alert twice.
const inFlight = new Set<string>();
const retryDelay = (attempts: number) =>
  Math.min(ALERT_RETRY_MAX_MS, ALERT_RETRY_BASE_MS * 2 ** Math.max(0, attempts - 1));

// ─── Store ────────────────────────────────────────────────────────────────────
export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      // Every incident change goes through here: it keeps `emergency` in sync and
      // logs each new event exactly once.
      const commit = (next: Incident | null, previous: Incident | null = get().incident) => {
        if (next) {
          const seen = previous && previous.id === next.id ? previous.events.length : 0;
          next.events.slice(seen).forEach((e) => logIncidentEvent(next, e));
        }
        set({ incident: next, emergency: next?.status === 'active' });
      };
      const close = (closed: Incident) => {
        commit(closed);
        set((s) => ({ incident: null, emergency: false, incidents: [...s.incidents, closed] }));
      };
      const now = () => Date.now();
      const at = () => new Date().toISOString();

      const notifyEnded = (incidentId: string, attempt = 1) => {
        sendEmergencyEnded(incidentId).then(
          () => logIncidentEvent({ id: incidentId, status: 'resolved' }, { type: 'end_notified', at: at() }),
          (error) => {
            logIncidentError(incidentId, `notify network ended (attempt ${attempt})`, error);
            setTimeout(() => notifyEnded(incidentId, attempt + 1), retryDelay(attempt));
          },
        );
      };

      return {
        // Navigation
        screen: 'home',
        setScreen: (s) => set({ screen: s }),

        // Members
        members: INITIAL_MEMBERS,
        setMembers: (m) => set({ members: m }),
        addMember: (m) => set((state) => ({ members: [...state.members, m] })),
        removeMember: (name) =>
          set((state) => ({ members: state.members.filter((m) => m.name !== name) })),

        // Selected member
        selectedMember: INITIAL_MEMBERS[0],
        setSelectedMember: (m) => set({ selectedMember: m }),

        // Modal
        modal: null,
        setModal: (m) => set({ modal: m }),

        // Toast
        toast: '',
        setToast: (msg) => set({ toast: msg }),
        notify: (msg) => {
          set({ toast: msg });
          // Auto-dismiss after 4500 ms (matches prototype)
          setTimeout(() => {
            if (get().toast === msg) set({ toast: '' });
          }, 4500);
        },

        // Emergency
        emergency: false,

        // Responding
        responding: false,

        // Device
        deviceState: 'Connected',
        setDeviceState: (s) => set({ deviceState: s }),

        // Settings
        shareLocation: true,
        setShareLocation: (v) => set({ shareLocation: v }),
        notifications: true,
        setNotifications: (v) => set({ notifications: v }),

        // Invite
        inviteName: '',
        setInviteName: (v) => set({ inviteName: v }),
        invitePhone: '',
        setInvitePhone: (v) => set({ invitePhone: v }),

        // Onboarding
        onboardingStep: 0,
        setOnboardingStep: (n) => set({ onboardingStep: n }),

        // ─── Emergency flow ─────────────────────────────────────────────────────
        incident: null,
        incidents: [],
        hasHydrated: false,

        startCountdown: (source) => {
          const open = get().incident;
          if (open) return open;
          const incident = createCountdown(source, SOS_COUNTDOWN_SECONDS, now());
          commit(incident, null);
          return incident;
        },

        cancelCountdown: () => {
          const open = get().incident;
          const cancelled = open && cancel(open, now());
          if (!cancelled) return false;
          close(cancelled);
          get().notify('SOS cancelled. No alerts were sent.');
          return true;
        },

        activateEmergency: (trigger) => {
          const open = get().incident;
          const active = open && activate(open, get().members.map((m) => m.name), trigger, now());
          if (!active) return open?.status === 'active';
          commit(active);
          set({ responding: false });
          get().dispatchAlerts();
          return true;
        },

        dispatchAlerts: () => {
          const incident = get().incident;
          if (!incident || incident.status !== 'active') return;
          incident.deliveries
            .filter((d) => d.status !== 'delivered')
            .forEach((delivery) => {
              const key = `${incident.id}:${delivery.memberName}`;
              if (inFlight.has(key)) return;
              inFlight.add(key);
              const attempt = delivery.attempts + 1;
              const sent = get().incident!;
              commit(
                updateDelivery(sent, delivery.memberName, { attempts: attempt }, {
                  type: 'alert_sent',
                  at: at(),
                  details: { member: delivery.memberName, attempt },
                }),
              );
              sendEmergencyAlert({ incidentId: incident.id, memberName: delivery.memberName, attempt })
                .then((result) => {
                  if (!result.delivered) throw new Error(result.error ?? 'not delivered');
                  return result;
                })
                .then(
                  (result) => {
                    inFlight.delete(key);
                    const current = get().incident;
                    if (current?.id !== incident.id) return;
                    commit(
                      updateDelivery(current, delivery.memberName, {
                        status: 'delivered',
                        deliveredAt: result.deliveredAt ?? at(),
                      }, { type: 'alert_delivered', at: at(), details: { member: delivery.memberName } }),
                    );
                  },
                  (error) => {
                    inFlight.delete(key);
                    logIncidentError(incident.id, `alert ${delivery.memberName} (attempt ${attempt})`, error);
                    const current = get().incident;
                    if (current?.id !== incident.id || current.status !== 'active') return;
                    commit(
                      updateDelivery(current, delivery.memberName, { status: 'failed' }, {
                        type: 'alert_failed',
                        at: at(),
                        details: { member: delivery.memberName, attempt, error: String(error) },
                      }),
                    );
                    setTimeout(() => get().dispatchAlerts(), retryDelay(attempt));
                  },
                );
            });
        },

        endEmergency: () => {
          const open = get().incident;
          const resolved = open && end(open, now());
          if (!resolved) return;
          close(resolved);
          set({ responding: false, modal: null });
          get().notify('Emergency ended. Your network has been notified that you’re safe.');
          notifyEnded(resolved.id);
        },

        respond: (memberName) => {
          set({ responding: true });
          const open = get().incident;
          if (!open || open.status !== 'active') return;
          const delivery = open.deliveries.find((d) => d.memberName === memberName);
          if (!delivery || delivery.respondingAt) return;
          commit(
            updateDelivery(open, memberName, { respondingAt: at() }, {
              type: 'responding',
              at: at(),
              details: { member: memberName },
            }),
          );
        },

        recordEmergencyCall: (placed) => {
          const open = get().incident;
          const event: IncidentEvent = { type: 'call_emergency_services', at: at(), details: { placed } };
          if (open) commit(addEvent(open, event));
        },

        restoreIncident: () => {
          const open = get().incident;
          if (!open) return 'none';
          commit(addEvent(open, { type: 'restored', at: at(), details: { status: open.status } }));
          // The user pressed SOS and never cancelled: if the countdown ran out while the
          // app was closed, the emergency goes out now (see OPEN-QUESTIONS decisions log).
          if (open.status === 'countdown' && now() >= open.countdownEndsAt) {
            get().activateEmergency('restored');
          } else if (open.status === 'active') {
            get().dispatchAlerts();
          }
          return get().incident?.status === 'active' ? 'active' : 'countdown';
        },
      };
    },
    {
      name: 'guardova-emergency',
      version: 1,
      storage: createJSONStorage(() => (isServer ? serverStorage : AsyncStorage)),
      // Only the emergency flow is persisted; everything else is demo data.
      partialize: (s) => ({ incident: s.incident, incidents: s.incidents, responding: s.responding }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return { ...current, ...p, emergency: p.incident?.status === 'active' };
      },
      onRehydrateStorage: () => () => {
        if (!isServer) useStore.setState({ hasHydrated: true });
      },
    },
  ),
);
