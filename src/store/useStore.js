import { create } from 'zustand';
import { mockAssets, mockWorkOrders, mockMaintenanceLog } from '../data/mockData';

// ── Branch options ──────────────────────────────────────────────
export const BRANCHES = [
  { id: 'all',    label: 'All Locations',  icon: '🌐' },
  { id: 'cebu',   label: 'Cebu HQ',        icon: '🏢' },
  { id: 'manila', label: 'Manila Office',  icon: '🏙️' },
  { id: 'davao',  label: 'Davao Branch',   icon: '🏬' },
];

export const ROLES = {
  SUPER_ADMIN:  'Super Admin',
  IT_ADMIN:     'IT Admin / Technician',
  AUDITOR:      'Auditor / Inventory Clerk',
  DEPT_MANAGER: 'Dept. Manager',
  FINANCE:      'Finance / Procurement',
  EMPLOYEE:     'Standard Employee',
};

const MOCK_USER = {
  id: 'u001', name: 'Alex Reyes', initials: 'AR',
  email: 'alex.reyes@company.com', role: ROLES.SUPER_ADMIN,
  branch: 'cebu', avatar: null,
};

// ── Tag generator ───────────────────────────────────────────────
export const generateAssetTag = () =>
  `#AST-${String(Math.floor(Math.random() * 9000) + 1000)}`;

// ── Zustand Store ───────────────────────────────────────────────
const useStore = create((set, get) => ({
  // ── Theme ────────────────────────────────────────────────────
  theme: localStorage.getItem('ims-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ims-theme', next);
    set({ theme: next });
  },

  // ── Sidebar ──────────────────────────────────────────────────
  sidebarCollapsed: false,
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ── Branch ───────────────────────────────────────────────────
  activeBranch: localStorage.getItem('ims-branch') || 'all',
  setActiveBranch: (branchId) => {
    localStorage.setItem('ims-branch', branchId);
    set({ activeBranch: branchId });
  },
  getActiveBranchLabel: () => {
    const { activeBranch } = get();
    return BRANCHES.find(b => b.id === activeBranch)?.label || 'All Locations';
  },

  // ── Auth ─────────────────────────────────────────────────────
  currentUser: MOCK_USER,

  // ── Notifications ─────────────────────────────────────────────
  notificationCount: 5,
  markNotificationsRead: () => set({ notificationCount: 0 }),

  // ── Sync ─────────────────────────────────────────────────────
  syncStatus: 'synced',
  setSyncStatus: (status) => set({ syncStatus: status }),

  offlineQueue: [],
  addOfflineScan: (scanData) => {
    set(s => ({
      offlineQueue: [...s.offlineQueue, { ...scanData, timestamp: Date.now() }],
      syncStatus: 'offline'
    }));
  },
  flushOfflineQueue: () => {
    // Process the offlineQueue (e.g. updating assets to 'ACTIVE')
    set(s => {
      const updatedAssets = [...s.assets];
      s.offlineQueue.forEach(scan => {
        const a = updatedAssets.find(x => x.tag === scan.tag);
        if (a) {
          a.status = 'ACTIVE';
          a.lastUpdated = new Date().toISOString().split('T')[0];
        }
      });
      return {
        assets: updatedAssets,
        offlineQueue: [],
        syncStatus: 'synced'
      };
    });
  },

  // ── Assets (live store, initialized from mock) ───────────────
  assets: [...mockAssets],

  addAsset: (assetData) => {
    const newAsset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    set(s => ({ assets: [newAsset, ...s.assets] }));
    return newAsset;
  },

  importAssets: (newAssets) => {
    const formatted = newAssets.map((a, i) => ({
      ...a,
      id: `ast-imp-${Date.now()}-${i}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: a.status || 'ACTIVE',
    }));
    set(s => ({ assets: [...formatted, ...s.assets] }));
  },

  updateAsset: (id, updates) => {
    set(s => ({
      assets: s.assets.map(a => a.id === id
        ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : a
      ),
    }));
  },

  // ── Maintenance & Work Orders ────────────────────────────────
  workOrders: [...mockWorkOrders],
  maintenanceLogs: [...mockMaintenanceLog],
  
  completeWorkOrder: (id, logNotes) => {
    set(s => {
      const wo = s.workOrders.find(w => w.id === id);
      if (!wo) return s;

      const updatedWOs = s.workOrders.map(w =>
        w.id === id ? { ...w, status: 'Completed' } : w
      );

      const newLog = {
        id: `ml-${Date.now()}`,
        assetId: wo.assetId,
        date: new Date().toISOString().split('T')[0],
        type: wo.title,
        tech: wo.assignedTo,
        notes: logNotes,
        status: 'Completed',
      };

      const updatedAssets = s.assets.map(a =>
        a.id === wo.assetId ? { ...a, lastUpdated: new Date().toISOString().split('T')[0] } : a
      );

      return {
        workOrders: updatedWOs,
        maintenanceLogs: [newLog, ...s.maintenanceLogs],
        assets: updatedAssets,
      };
    });
  },

  updateWorkOrder: (id, updates) => {
    set(s => ({
      workOrders: s.workOrders.map(w => w.id === id ? { ...w, ...updates } : w)
    }));
  },
  // ── Draft Asset (in-progress form) ──────────────────────────
  draftAsset: null,
  setDraftAsset: (data) => {
    localStorage.setItem('ims-draft-asset', JSON.stringify(data));
    set({ draftAsset: data });
  },
  clearDraftAsset: () => {
    localStorage.removeItem('ims-draft-asset');
    set({ draftAsset: null });
  },
  loadDraftAsset: () => {
    const raw = localStorage.getItem('ims-draft-asset');
    if (raw) {
      try { set({ draftAsset: JSON.parse(raw) }); } catch {}
    }
  },

  // ── QR Scanner modal state ───────────────────────────────────
  qrScannerOpen: false,
  openQrScanner: ()  => set({ qrScannerOpen: true }),
  closeQrScanner: () => set({ qrScannerOpen: false }),

  // ── QR Print modal state ─────────────────────────────────────
  qrPrintAsset: null,
  openQrPrint: (asset) => set({ qrPrintAsset: asset }),
  closeQrPrint: ()     => set({ qrPrintAsset: null }),
}));

// Apply theme on load
const storedTheme = localStorage.getItem('ims-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', storedTheme);

export default useStore;
