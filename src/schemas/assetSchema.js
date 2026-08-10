import { z } from 'zod';

// ── Step 1: Basic Info ─────────────────────────────────────────
export const step1Schema = z.object({
  name:     z.string().min(2,  'Asset name must be at least 2 characters'),
  category: z.string().min(1,  'Please select a category'),
  brand:    z.string().min(1,  'Brand is required'),
  model:    z.string().min(1,  'Model is required'),
  serial:   z.string().min(3,  'Serial number must be at least 3 characters'),
  tag:      z.string().min(3,  'Asset tag is required'),
});

// ── Step 2: Acquisition ───────────────────────────────────────
export const step2Schema = z.object({
  purchaseDate:   z.string().min(1, 'Purchase date is required'),
  vendor:         z.string().min(1, 'Vendor name is required'),
  purchaseCost:   z.coerce.number({ invalid_type_error: 'Must be a number' })
                    .positive('Cost must be greater than 0'),
  poNumber:       z.string().optional(),
  warrantyExpiry: z.string().optional(),
  warrantyAlert:  z.boolean().optional(),
});

// ── Step 3: Location & Assignment ─────────────────────────────
export const step3Schema = z.object({
  branch:     z.string().min(1, 'Branch is required'),
  floor:      z.string().optional(),
  room:       z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  assigneeId: z.string().optional(),
});

// ── Step 4: Specs (dynamic key-value record) ──────────────────
export const step4Schema = z.object({
  specs: z.record(z.string(), z.string()).optional(),
});

// ── Step 5: Documents & Notes ─────────────────────────────────
export const step5Schema = z.object({
  notes: z.string().max(1000, 'Notes must be under 1000 characters').optional(),
});

// ── Full Asset Schema (union of all steps) ────────────────────
export const fullAssetSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

// ── Spec Field Templates per category ─────────────────────────
export const SPEC_TEMPLATES = {
  'Laptop':          ['CPU', 'RAM', 'Storage', 'OS', 'Display', 'Graphics', 'Battery Life'],
  'Desktop':         ['CPU', 'RAM', 'Storage', 'OS', 'Form Factor', 'Graphics'],
  'Server':          ['CPU', 'RAM', 'Storage', 'OS', 'Power Supply', 'Form Factor', 'RAID'],
  'Network Switch':  ['Ports', 'Speed', 'PoE', 'Management', 'Uplinks', 'VLAN Support'],
  'Router':          ['WAN Ports', 'LAN Ports', 'WiFi Standards', 'Max Throughput', 'VPN'],
  'UPS':             ['Capacity (VA)', 'Wattage', 'Runtime', 'Outlets', 'Management'],
  'Monitor':         ['Size', 'Resolution', 'Panel Type', 'Refresh Rate', 'Ports'],
  'Printer':         ['Print Speed', 'Resolution', 'Connectivity', 'Color/Mono', 'Paper Size'],
  'Phone':           ['OS', 'Storage', 'RAM', 'Display', 'Camera', 'Network'],
  'Tablet':          ['OS', 'Storage', 'RAM', 'Display', 'Connectivity', 'Battery'],
  'Software License':['License Type', 'Version', 'Seats', 'Platform', 'Activation Key'],
  'default':         ['Make', 'Model', 'Color', 'Condition', 'Notes'],
};

export const getSpecTemplate = (category) =>
  SPEC_TEMPLATES[category] || SPEC_TEMPLATES['default'];

export const CATEGORIES = Object.keys(SPEC_TEMPLATES).filter(k => k !== 'default');

// ── Departments List ──────────────────────────────────────────
export const DEPARTMENTS = [
  'IT', 'HR', 'Finance', 'Engineering', 'Design',
  'Marketing', 'Operations', 'Legal', 'Admin', 'Executive',
];
