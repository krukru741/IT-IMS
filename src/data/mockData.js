// Mock data for IT IMS — Phase 1 demonstration

// ── Asset Statuses ──────────────────────────────────────────────
export const ASSET_STATUSES = {
  ACTIVE:      { label: 'Active',       variant: 'active',  dot: true },
  IN_REPAIR:   { label: 'In Repair',    variant: 'warning', dot: false },
  IN_STORAGE:  { label: 'In Storage',   variant: 'neutral', dot: false },
  RETIRED:     { label: 'Retired',      variant: 'danger',  dot: false },
  DISPOSED:    { label: 'Disposed',     variant: 'neutral', dot: false },
};

// ── Categories ──────────────────────────────────────────────────
export const CATEGORIES = [
  'Laptop', 'Desktop', 'Server', 'Monitor', 'Network Switch',
  'Router', 'UPS', 'Printer', 'Phone', 'Tablet', 'Software License',
];

// ── Mock Assets ─────────────────────────────────────────────────
export const mockAssets = [
  {
    id: 'ast-8291', tag: '#AST-8291', name: 'Dell Latitude 5530',
    category: 'Laptop', brand: 'Dell', model: 'Latitude 5530',
    serial: 'DL-2024-00291', status: 'ACTIVE',
    location: 'Cebu HQ', floor: 'Floor 2', room: 'Room 204',
    branch: 'cebu',
    assignedTo: { id: 'u002', name: 'Maria Santos', initials: 'MS' },
    department: 'HR', purchaseDate: '2024-01-15',
    purchaseCost: 68000, vendor: 'Dell Philippines',
    warrantyExpiry: '2027-01-15', poNumber: 'PO-2024-0012',
    specs: { CPU: 'Intel Core i7-1255U', RAM: '16GB DDR4', Storage: '512GB SSD', OS: 'Windows 11 Pro', Display: '15.6" FHD' },
    lastUpdated: '2026-08-08',
  },
  {
    id: 'ast-8292', tag: '#AST-8292', name: 'HP EliteBook 840 G9',
    category: 'Laptop', brand: 'HP', model: 'EliteBook 840 G9',
    serial: 'HP-2023-04512', status: 'ACTIVE',
    location: 'Cebu HQ', floor: 'Floor 1', room: 'Room 101',
    branch: 'cebu',
    assignedTo: { id: 'u003', name: 'Carlos Dela Cruz', initials: 'CD' },
    department: 'Engineering', purchaseDate: '2023-06-10',
    purchaseCost: 72000, vendor: 'HP Philippines',
    warrantyExpiry: '2026-06-10', poNumber: 'PO-2023-0041',
    specs: { CPU: 'Intel Core i5-1235U', RAM: '8GB DDR4', Storage: '256GB SSD', OS: 'Windows 11 Pro', Display: '14" FHD' },
    lastUpdated: '2026-07-30',
  },
  {
    id: 'ast-8293', tag: '#AST-8293', name: 'Cisco Catalyst 2960',
    category: 'Network Switch', brand: 'Cisco', model: 'Catalyst 2960',
    serial: 'CS-2022-00871', status: 'ACTIVE',
    location: 'Cebu HQ', floor: 'Floor 1', room: 'Server Room',
    branch: 'cebu',
    assignedTo: null,
    department: 'IT', purchaseDate: '2022-03-20',
    purchaseCost: 45000, vendor: 'Cisco Systems',
    warrantyExpiry: '2025-03-20', poNumber: 'PO-2022-0009',
    specs: { Ports: '48 x GbE', Uplinks: '4 x SFP', PoE: 'Yes', Management: 'Web + CLI' },
    lastUpdated: '2026-06-15',
  },
  {
    id: 'ast-8294', tag: '#AST-8294', name: 'Dell PowerEdge R750',
    category: 'Server', brand: 'Dell', model: 'PowerEdge R750',
    serial: 'DL-SRV-2023-002', status: 'ACTIVE',
    location: 'Cebu HQ', floor: 'Floor 1', room: 'Server Room',
    branch: 'cebu',
    assignedTo: null,
    department: 'IT', purchaseDate: '2023-01-05',
    purchaseCost: 350000, vendor: 'Dell Philippines',
    warrantyExpiry: '2028-01-05', poNumber: 'PO-2023-0003',
    specs: { CPU: '2x Intel Xeon Silver 4316', RAM: '128GB ECC', Storage: '4x 1.2TB SAS', OS: 'VMware ESXi 8.0' },
    lastUpdated: '2026-08-01',
  },
  {
    id: 'ast-8295', tag: '#AST-8295', name: 'Lenovo ThinkPad X1 Carbon',
    category: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 11',
    serial: 'LN-2024-00118', status: 'IN_REPAIR',
    location: 'Manila Office', floor: 'Floor 3', room: 'IT Office',
    branch: 'manila',
    assignedTo: { id: 'u004', name: 'Dana Reyes', initials: 'DR' },
    department: 'Finance', purchaseDate: '2024-02-28',
    purchaseCost: 89000, vendor: 'Lenovo Philippines',
    warrantyExpiry: '2027-02-28', poNumber: 'PO-2024-0027',
    specs: { CPU: 'Intel Core i7-1365U', RAM: '16GB LPDDR5', Storage: '1TB SSD', OS: 'Windows 11 Pro', Display: '14" 2.8K OLED' },
    lastUpdated: '2026-08-05',
  },
  {
    id: 'ast-8296', tag: '#AST-8296', name: 'Apple MacBook Pro 14"',
    category: 'Laptop', brand: 'Apple', model: 'MacBook Pro 14 M3 Pro',
    serial: 'AP-2024-00044', status: 'ACTIVE',
    location: 'Manila Office', floor: 'Floor 2', room: 'Design Studio',
    branch: 'manila',
    assignedTo: { id: 'u005', name: 'Rona Fuentes', initials: 'RF' },
    department: 'Design', purchaseDate: '2024-03-10',
    purchaseCost: 115000, vendor: 'Apple Philippines',
    warrantyExpiry: '2026-03-10', poNumber: 'PO-2024-0031',
    specs: { CPU: 'Apple M3 Pro (12-core)', RAM: '18GB Unified', Storage: '512GB SSD', OS: 'macOS Sonoma', Display: '14.2" Liquid Retina XDR' },
    lastUpdated: '2026-08-09',
  },
  {
    id: 'ast-8297', tag: '#AST-8297', name: 'HP LaserJet Pro M404n',
    category: 'Printer', brand: 'HP', model: 'LaserJet Pro M404n',
    serial: 'HP-PRT-2021-009', status: 'IN_STORAGE',
    location: 'Cebu HQ', floor: 'Floor 3', room: 'Storage Room',
    branch: 'cebu',
    assignedTo: null,
    department: 'Admin', purchaseDate: '2021-08-14',
    purchaseCost: 22000, vendor: 'HP Philippines',
    warrantyExpiry: '2024-08-14', poNumber: 'PO-2021-0066',
    specs: { PrintSpeed: '38 ppm', Resolution: '1200 x 1200 dpi', Connectivity: 'USB + Ethernet', Color: 'Monochrome' },
    lastUpdated: '2025-12-20',
  },
  {
    id: 'ast-8298', tag: '#AST-8298', name: 'APC Smart-UPS 1500VA',
    category: 'UPS', brand: 'APC', model: 'Smart-UPS SMT1500IC',
    serial: 'APC-2022-0034', status: 'ACTIVE',
    location: 'Cebu HQ', floor: 'Floor 1', room: 'Server Room',
    branch: 'cebu',
    assignedTo: null,
    department: 'IT', purchaseDate: '2022-09-01',
    purchaseCost: 38000, vendor: 'APC by Schneider',
    warrantyExpiry: '2025-09-01', poNumber: 'PO-2022-0078',
    specs: { Capacity: '1500VA / 1000W', Runtime: '~12 min at full load', Outlets: '8 IEC', Management: 'SmartConnect Cloud' },
    lastUpdated: '2026-07-20',
  },
];

// ── KPI Stats ───────────────────────────────────────────────────
export const mockKpiStats = {
  totalAssets:         1284,
  activeAssignments:   847,
  expiringLicenses:    12,
  underMaintenance:    23,
};

// ── Donut Chart Data ────────────────────────────────────────────
export const assetStatusChartData = [
  { name: 'Active',      value: 847,  color: '#10B981' },
  { name: 'In Storage',  value: 213,  color: '#64748B' },
  { name: 'In Repair',   value: 87,   color: '#F59E0B' },
  { name: 'Retired',     value: 112,  color: '#EF4444' },
  { name: 'Disposed',    value: 25,   color: '#475569' },
];

// ── Category Breakdown ──────────────────────────────────────────
export const categoryData = [
  { name: 'Laptops',    value: 412, color: '#4F46E5' },
  { name: 'Desktops',   value: 198, color: '#6366F1' },
  { name: 'Servers',    value: 34,  color: '#8B5CF6' },
  { name: 'Monitors',   value: 256, color: '#3B82F6' },
  { name: 'Network',    value: 89,  color: '#10B981' },
  { name: 'Others',     value: 295, color: '#64748B' },
];

// ── Activity Feed ───────────────────────────────────────────────
export const mockActivity = [
  {
    id: 'act-01', type: 'assign', color: '#10B981', bgColor: 'rgba(16,185,129,0.1)',
    text: '<strong>Dell Latitude 5530</strong> assigned to <strong>Maria Santos</strong>',
    time: '2 minutes ago',
  },
  {
    id: 'act-02', type: 'add', color: '#4F46E5', bgColor: 'rgba(79,70,229,0.1)',
    text: 'New asset <strong>Apple MacBook Pro 14"</strong> registered',
    time: '1 hour ago',
  },
  {
    id: 'act-03', type: 'repair', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)',
    text: '<strong>Lenovo ThinkPad X1</strong> moved to <strong>In Repair</strong>',
    time: '3 hours ago',
  },
  {
    id: 'act-04', type: 'warning', color: '#EF4444', bgColor: 'rgba(239,68,68,0.1)',
    text: 'License <strong>Adobe CC (15 seats)</strong> expires in <strong>14 days</strong>',
    time: '5 hours ago',
  },
  {
    id: 'act-05', type: 'import', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)',
    text: '<strong>47 assets</strong> imported from CSV by <strong>Alex Reyes</strong>',
    time: 'Yesterday, 4:22 PM',
  },
  {
    id: 'act-06', type: 'retire', color: '#64748B', bgColor: 'rgba(100,116,139,0.1)',
    text: '<strong>HP LaserJet M404n</strong> moved to <strong>In Storage</strong>',
    time: 'Yesterday, 2:10 PM',
  },
];

// ── Maintenance Items ───────────────────────────────────────────
export const mockMaintenance = [
  { id: 'm01', asset: 'Dell PowerEdge R750', type: 'Scheduled', date: '2026-08-15', tech: 'Ben Cruz', status: 'upcoming' },
  { id: 'm02', asset: 'Cisco Catalyst 2960', type: 'Inspection', date: '2026-08-18', tech: 'Alex Reyes', status: 'upcoming' },
  { id: 'm03', asset: 'APC Smart-UPS 1500VA', type: 'Battery Check', date: '2026-08-22', tech: 'Ben Cruz', status: 'upcoming' },
];

// ── Assignment History ──────────────────────────────────────────
export const mockAssignmentHistory = [
  { id: 'ah01', user: 'Maria Santos',      from: '2024-01-20', to: null,         duration: 'Current' },
  { id: 'ah02', user: 'Juan dela Cruz',    from: '2023-06-01', to: '2024-01-18', duration: '7 months' },
  { id: 'ah03', user: 'Rosa Mendoza',      from: '2022-11-10', to: '2023-05-28', duration: '6 months' },
];

// ── Maintenance Log ─────────────────────────────────────────────
export const mockMaintenanceLog = [
  {
    id: 'ml01', date: '2025-09-15', type: 'Repair', tech: 'Ben Cruz',
    notes: 'Replaced thermal paste, cleaned fan. Unit overheating resolved.', status: 'Completed',
  },
  {
    id: 'ml02', date: '2025-03-10', type: 'Inspection', tech: 'Alex Reyes',
    notes: 'Routine hardware inspection. All components functional. RAM upgraded to 16GB.', status: 'Completed',
  },
];
