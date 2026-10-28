// Guard'Ova — Global App Store (Zustand)
// Source: design/DESIGN-SPEC.md §11.3 (state variables)
// All demo data from design/reference-prototype/src/App.tsx

import { create } from 'zustand';

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

  // SOS countdown (ticks 5 → 0)
  countdown: number;
  setCountdown: (n: number) => void;

  // Emergency active flag
  emergency: boolean;
  setEmergency: (v: boolean) => void;

  // Network member responding flag
  responding: boolean;
  setResponding: (v: boolean) => void;

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

  // Incident history (ISO date strings)
  incidents: string[];
  addIncident: (date: string) => void;

  // Onboarding step (0–2)
  onboardingStep: number;
  setOnboardingStep: (n: number) => void;

  // Computed actions
  endEmergency: () => void;
  startSOS: () => void;
}

// ─── Initial demo members (exact copy from App.tsx) ───────────────────────────
const INITIAL_MEMBERS: Member[] = [
  { name: 'Mom',    initials: 'NM', relation: 'Family', color: 'rose',   status: 'Online' },
  { name: 'Thabo',  initials: 'TM', relation: 'Friend', color: 'blue',   status: 'Online' },
  { name: 'Kabelo', initials: 'KM', relation: 'Brother', color: 'sage',  status: 'Online' },
  { name: 'Lerato', initials: 'LM', relation: 'Friend', color: 'purple', status: 'Away'   },
];

// ─── Store ────────────────────────────────────────────────────────────────────
export const useStore = create<AppState>((set, get) => ({
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

  // Countdown
  countdown: 5,
  setCountdown: (n) => set({ countdown: n }),

  // Emergency
  emergency: false,
  setEmergency: (v) => set({ emergency: v }),

  // Responding
  responding: false,
  setResponding: (v) => set({ responding: v }),

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

  // Incidents
  incidents: [],
  addIncident: (date) =>
    set((state) => ({ incidents: [...state.incidents, date] })),

  // Onboarding
  onboardingStep: 0,
  setOnboardingStep: (n) => set({ onboardingStep: n }),

  // Actions
  endEmergency: () => {
    const { addIncident, setEmergency, setModal, notify } = get();
    addIncident(new Date().toLocaleString());
    setEmergency(false);
    setModal(null);
    notify("Emergency ended. Your network has been notified that you're safe.");
  },

  startSOS: () => {
    set({ countdown: 5, screen: 'countdown' });
  },
}));

