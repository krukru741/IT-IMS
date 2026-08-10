import { create } from 'zustand';

// ─── Branch options ────────────────────────────────────────────
export const BRANCHES = [
  { id: 'all',    label: 'All Locations',  icon: '🌐' },
  { id: 'cebu',   label: 'Cebu HQ',        icon: '🏢' },
  { id: 'manila', label: 'Manila Office',  icon: '🏙️' },
  { id: 'davao',  label: 'Davao Branch',   icon: '🏬' },
];

// ─── User roles ────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  IT_ADMIN:    'IT Admin / Technician',
  AUDITOR:     'Auditor / Inventory Clerk',
  DEPT_MANAGER:'Dept. Manager',
  FINANCE:     'Finance / Procurement',
  EMPLOYEE:    'Standard Employee',
};

// ─── Mock authenticated user ───────────────────────────────────
const MOCK_USER = {
  id: 'u001',
  name: 'Alex Reyes',
  initials: 'AR',
  email: 'alex.reyes@company.com',
  role: ROLES.SUPER_ADMIN,
  branch: 'cebu',
  avatar: null,
};

// ─── Zustand Store ─────────────────────────────────────────────
const useStore = create((set, get) => ({
  // ── Theme ──────────────────────────────────────────────────
  theme: localStorage.getItem('ims-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ims-theme', next);
    set({ theme: next });
  },

  // ── Sidebar ────────────────────────────────────────────────
  sidebarCollapsed: false,
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ── Active Branch ──────────────────────────────────────────
  activeBranch: localStorage.getItem('ims-branch') || 'all',

  setActiveBranch: (branchId) => {
    localStorage.setItem('ims-branch', branchId);
    set({ activeBranch: branchId });
  },

  getActiveBranchLabel: () => {
    const { activeBranch } = get();
    return BRANCHES.find(b => b.id === activeBranch)?.label || 'All Locations';
  },

  // ── Authenticated User ─────────────────────────────────────
  currentUser: MOCK_USER,

  // ── Notifications ──────────────────────────────────────────
  notificationCount: 5,
  markNotificationsRead: () => set({ notificationCount: 0 }),

  // ── Sync Status (PWA placeholder) ─────────────────────────
  syncStatus: 'synced', // 'synced' | 'pending' | 'error'
}));

// ── Apply theme on initial load ────────────────────────────────
const storedTheme = localStorage.getItem('ims-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', storedTheme);

export default useStore;
