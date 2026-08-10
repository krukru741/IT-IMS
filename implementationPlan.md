# UI/UX Design Plan — IT Inventory Management System (IT IMS)
### **FINALIZED** — All Stakeholder Decisions Incorporated

> A comprehensive, enterprise-grade IT Asset Management platform built on a dark-first premium design system with PWA capabilities, granular RBAC, and multi-branch support.

---

## 🎯 Project Overview

The **IT Inventory Management System (IT IMS)** is a full-featured web-based platform for tracking IT assets across multiple organizational locations — covering hardware, software licenses, peripherals, and infrastructure. The system is designed for six distinct user roles, supports offline field audits via PWA, and provides rich reporting and procurement workflows.

---

## 👥 User Personas

| Persona | Role | Primary Goals |
|---|---|---|
| **Alex** | Super Admin / IT Admin | Full asset lifecycle, RBAC config, audit trails, bulk imports |
| **Maria** | Dept. Manager | View team assets, approve internal requests |
| **Carlos** | Standard Employee | View personal assignments, raise repair/transfer tickets |
| **Dana** | Finance / Procurement | Cost reports, depreciation, license cost analysis, PO tracking |
| **Rona** | Auditor / Inventory Clerk | Physical scanning audits, status updates, stock counting |
| **Ben** | IT Technician | Asset checkout, maintenance logging, QR printing |

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Role | Assets | Users | Reports | Settings | Audit | Requests |
|---|---|---|---|---|---|---|
| **Super Admin** | Full CRUD | Full CRUD | Full | Full | Full | Full |
| **IT Admin / Technician** | Read / Write | Read | Read | Limited | Read | Approve |
| **Auditor / Inv. Clerk** | Read + Status Update | Read (Team) | Read | None | Write | None |
| **Dept. Manager** | Read (Team) | Read (Team) | Team Reports | None | None | Submit / Approve |
| **Finance / Procurement** | Read + Export | None | Full Export | None | None | View PO |
| **Standard Employee** | Self Read | Self | None | None | None | Submit |

> **Implementation**: Enforce via `[data-role]` attribute on `<body>` — CSS hides UI sections not allowed for role. Backend API returns 403 for unauthorized endpoints.

---

## 🗂️ Information Architecture

```
IT IMS
├── 🏠 Dashboard
│   ├── KPI Cards (scoped by active branch)
│   ├── Asset Status Chart (Donut)
│   ├── Recent Activity Timeline
│   ├── Quick Actions Panel
│   ├── License Expiry Alerts
│   └── Low Stock / Critical Alerts
│
├── 📦 Assets
│   ├── All Assets (table + grid view)
│   ├── Hardware
│   │   ├── Computers / Laptops
│   │   ├── Servers
│   │   ├── Networking Equipment
│   │   └── Peripherals
│   ├── Software / Licenses
│   │   ├── Per-Seat / Dedicated
│   │   ├── Concurrent / Floating
│   │   └── Site / Organization-Wide
│   ├── Asset Detail View
│   │   ├── Overview Tab
│   │   ├── Assignment History Tab
│   │   ├── Maintenance Log Tab
│   │   └── Documents Tab
│   ├── Add / Edit Asset (step wizard)
│   └── QR Label Print Modal
│
├── 👤 Users & Assignments
│   ├── User Directory
│   ├── Assignment Matrix
│   └── User Asset Profile
│
├── 🔧 Maintenance
│   ├── Scheduled Maintenance
│   ├── Repair Requests
│   └── Maintenance History
│
├── 🏢 Locations (Multi-Branch)
│   ├── Organization Overview
│   ├── Region / Branch Manager
│   │   ├── Cebu HQ
│   │   ├── Manila Office
│   │   └── [+ Add Branch]
│   ├── Building / Floor Manager
│   └── Room / Zone Manager
│
├── 🏷️ Categories & Classifications
│   ├── Asset Categories
│   └── Departments
│
├── 📊 Reports & Analytics
│   ├── Asset Summary
│   ├── Depreciation Report
│   ├── License Compliance
│   ├── Assignment Report
│   └── Custom Report Builder
│
├── 🛒 Requests & Procurement
│   ├── Asset Request Form
│   ├── Request Queue (Admin)
│   └── Purchase Orders
│
├── 📥 Import / Export
│   ├── CSV Import Wizard (7-step)
│   └── Export Center
│
├── ⚙️ Settings
│   ├── System Configuration
│   ├── User Management & RBAC
│   ├── Notification Preferences
│   └── Audit Logs
│
└── 🔔 Notifications Center
```

---

## 🎨 Design System

### 1. Theme Architecture — Dual Theme (Dark Default + Light Toggle)

```css
/* Implemented via CSS Custom Properties on :root */

[data-theme="dark"] {
  --bg-surface:      #0F172A;
  --bg-card:         #1E2A3A;
  --bg-sidebar:      #1E293B;
  --text-primary:    #F1F5F9;
  --text-muted:      #94A3B8;
  --border:          #334155;
}

[data-theme="light"] {
  --bg-surface:      #F8FAFC;
  --bg-card:         #FFFFFF;
  --bg-sidebar:      #1E293B;   /* Sidebar stays dark-branded */
  --text-primary:    #0F172A;
  --text-muted:      #64748B;
  --border:          #E2E8F0;
}

/* Shared brand tokens — unchanged across themes */
--brand-primary:    #4F46E5;
--brand-hover:      #6366F1;
--accent-green:     #10B981;
--accent-amber:     #F59E0B;
--accent-red:       #EF4444;
--accent-blue:      #3B82F6;
```

**Toggle placement**: Top navbar, right cluster — sun/moon icon with smooth 300ms crossfade. System preference (`prefers-color-scheme`) sets default on first load, persisted via `localStorage`.

---

### 2. Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--brand-primary` | `#4F46E5` | `#4F46E5` | CTAs, active nav, focus rings |
| `--brand-hover` | `#6366F1` | `#4338CA` | Hover state for brand elements |
| `--bg-surface` | `#0F172A` | `#F8FAFC` | Page background |
| `--bg-card` | `#1E2A3A` | `#FFFFFF` | Card / panel backgrounds |
| `--bg-sidebar` | `#1E293B` | `#1E293B` | Navigation sidebar (always dark) |
| `--accent-green` | `#10B981` | `#059669` | Active / OK / In-Use status |
| `--accent-amber` | `#F59E0B` | `#D97706` | Warning / Expiring / Low stock |
| `--accent-red` | `#EF4444` | `#DC2626` | Error / Expired / Critical |
| `--accent-blue` | `#3B82F6` | `#2563EB` | Info / Informational links |
| `--text-primary` | `#F1F5F9` | `#0F172A` | Body and heading text |
| `--text-muted` | `#94A3B8` | `#64748B` | Metadata, captions |
| `--border` | `#334155` | `#E2E8F0` | Card borders, dividers |

---

### 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero | **Outfit** | 700 | 32–48px |
| Section Heading | **Outfit** | 600 | 20–28px |
| Card Title | **Outfit** | 600 | 16–18px |
| Body / Labels | **Inter** | 400 / 500 | 14–16px |
| Monospace (IDs, serial numbers, codes) | **JetBrains Mono** | 400 | 13px |
| Caption / Metadata | **Inter** | 400 | 12px |

---

### 4. Component Design Tokens

| Property | Value |
|---|---|
| Card border-radius | `12px` |
| Button border-radius | `8px` |
| Input border-radius | `8px` |
| Badge / pill border-radius | `999px` |
| Card shadow (dark) | `0 4px 24px rgba(0,0,0,0.35)` |
| Card shadow (light) | `0 2px 12px rgba(0,0,0,0.08)` |
| Glassmorphism overlay | `backdrop-filter: blur(12px); background: rgba(255,255,255,0.05)` |
| Transition (micro) | `0.15s ease-in-out` |
| Transition (panels) | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| Modal entrance | `scale(0.96) → scale(1) + fade, 250ms` |

---

## 🖼️ Screen-by-Screen UX Design

### Screen 1 — Login Page

- **Background**: Dark gradient mesh (`#0F172A → #1E293B`) with subtle animated floating particles (canvas-based, very low opacity)
- **Center card**: Glassmorphism (`blur(16px)`, `rgba(255,255,255,0.06)`, `1px solid rgba(255,255,255,0.1)`)
- **Logo** + "IT IMS" wordmark (Outfit 700) at top
- **Fields**: Email + Password with animated floating labels, show/hide password toggle
- **Options**: "Remember me" toggle + "Forgot password?" link (indigo)
- **CTA**: `Sign In` — full width, indigo gradient (`#4F46E5 → #6366F1`), subtle shimmer on hover
- **Light toggle**: Available even on login screen (top-right corner)

---

### Screen 2 — Dashboard

**Navbar** (64px, always visible):
```
[☰ Collapse]  [📍 Branch: Cebu HQ ▾]    [🔍 Global Search]    [📡 Sync Status]  [🌙/☀️]  [🔔]  [Avatar]
```

**Global Branch Selector** (dropdown):
- "All Locations" (Super Admin / IT Admin default)
- Region list: Cebu HQ, Manila Office, etc.
- Selecting a branch scopes ALL dashboard data, charts, and KPIs

**KPI Row (4 cards, staggered fade-in)**:

| Card | Icon | Metric | Visual |
|---|---|---|---|
| Total Assets | 📦 | `1,284` | Sparkline (7-day trend) |
| Active Assignments | 👤 | `847` | Progress ring (84% of assets) |
| Licenses Expiring | ⚠️ | `12` (in 30 days) | Amber warning pulse |
| Under Maintenance | 🔧 | `23` | Red count badge |

**Content Grid (2 columns)**:
- **Left 65%**: Asset Status Donut Chart (Active / In Storage / In Repair / Retired / Disposed) + Recent Activity Feed (timeline)
- **Right 35%**: Quick Actions (Add Asset, Run Audit, Generate Report, Import CSV), Maintenance upcoming list, Low-stock alerts

---

### Screen 3 — Asset List

**Top bar**:
```
[+ Add Asset]  [📷 Scan QR]  [⬇ Import]  [⬆ Export]   .... [🔍 Search]  [☰ Filter]  [⊞ Grid / ☰ Table toggle]
```

**Table View Columns**:
`Checkbox | Asset Tag | Name | Category | Brand/Model | Location | Assigned To | Status | Warranty | Actions`

**Grid View**: 3-column card grid — asset icon/photo, name, tag, status badge, assignee avatar

**Filter Sidebar** (collapsible, 280px):
- Status (multi-select checkboxes with colored dots)
- Category (tree select)
- Location (branch → floor → room cascading)
- Department
- Assigned / Unassigned toggle
- Date Range (purchase date / last updated)

**Bulk Actions Toolbar** (appears on row selection, slides up):
`Assign | Reassign | Print QR Labels | Export Selected | Archive | Delete`

---

### Screen 4 — Asset Detail Page

**Header**:
```
[Asset Photo / Category Icon]   Dell Latitude 5530
                                 Laptop  •  Cebu HQ, Room 204
                                 🟢 Active   SN: DL-2024-00291   TAG: #AST-8291
                     [Edit]  [Assign]  [Print QR]  [Report Issue]  [⋯ More]
```

**Tab Navigation**: `Overview | Assignment History | Maintenance Log | Documents`

**Overview Tab**:
- Two-column specs grid (Processor, RAM, Storage, OS, etc.)
- Purchase Info card (Date, Vendor, Cost, PO Number)
- Warranty timeline bar (Purchase → Expiry with today marker)
- Depreciation card (Book value + chart)
- Location breadcrumb: `Cebu HQ > Building A > Floor 2 > Room 204`

---

### Screen 5 — Add / Edit Asset (Step Wizard)

**Progress stepper** (top):
```
① Basic Info → ② Acquisition → ③ Location & Assignment → ④ Specs → ⑤ Documents & Notes → ⑥ Review
```

Each step validates before advancing. "Save as Draft" available at any step.

| Step | Key Fields |
|---|---|
| **1. Basic Info** | Name, Category (tree), Brand, Model, Serial No. (auto-format), Asset Tag (auto-generated, editable) |
| **2. Acquisition** | Purchase Date, Vendor, Unit Cost, PO Number, Warranty Expiry (date picker + auto-alert toggle) |
| **3. Location & Assignment** | Branch → Floor → Room cascade, Department, Assignee search (avatar picker) |
| **4. Specs** | Dynamic key-value spec builder (fields adapt to category: e.g. Laptop shows CPU/RAM/Storage, Network Device shows Port Count/Speed) |
| **5. Docs & Notes** | Drag-and-drop file upload (invoice, photos, warranty), Notes textarea with rich formatting |
| **6. Review** | Full summary card, Submit / Back / Save Draft buttons |

---

### Screen 6 — QR Label Print Modal

**Trigger**: "Print QR" button on Asset Detail or bulk selection

**Modal Layout**:
- Label preview (live, 2" × 1" proportion)
- Label contains:
  - QR code (vector, encodes asset permalink URL)
  - Asset Tag ID (`#AST-8291`) in JetBrains Mono
  - Asset Name (truncated)
  - Organization name + Category
- Print options: Single label / Sheet (8-up, 16-up, 30-up Avery)
- `@media print` CSS handles layout isolation

---

### Screen 7 — Mobile QR Scanner

**Entry Points**:
- Mobile: Floating Action Button (FAB, bottom-right, indigo, camera icon)
- Desktop: Top-nav scan icon (opens webcam modal)

**Scanner Flow**:
```
Tap FAB → Permission prompt (if first use) → 
Full-screen viewfinder with scanning frame overlay →
Green flash + haptic feedback on successful scan →
Instant redirect → Asset Detail Page
```

**Tech**: `html5-qrcode` library. Overlay UI: dark vignette with animated corner-bracket targeting frame.

---

### Screen 8 — Multi-Branch Location Manager

**Location Hierarchy**:
```
Organization (IT IMS Co.)
  └── Region/Branch (Cebu HQ)
        └── Building/Floor (Building A — Floor 2)
              └── Room/Zone (Room 204 — Server Room)
```

**UI**: Tree view with expand/collapse, inline add/rename/delete, drag-to-reorganize. Asset count badge on each node.

---

### Screen 9 — Software License Module

**Three license type cards** (tabbed or segmented control):

**Per-Seat / Dedicated**
- Table: User | Product | License Key | Assigned Date | Expiry
- Seat counter: `47 / 50 seats allocated` (progress bar, amber at >90%)

**Concurrent / Floating**
- Live counter: `12 / 30 concurrent sessions active`
- Session log with timestamp, user, workstation

**Site / Organization-Wide**
- Card per subscription: Vendor, Product, Annual Cost, Renewal Date, Contract Doc
- Renewal calendar widget

---

### Screen 10 — CSV Import Wizard

**7-Step Import Flow**:

| Step | Description |
|---|---|
| **1. Select Type** | Choose: Assets / Users / Software Licenses |
| **2. Download Template** | Download pre-formatted CSV / Excel template with field descriptions |
| **3. Upload File** | Drag-and-drop zone, supports `.csv`, `.xlsx`. Shows file size + row count on upload |
| **4. Field Mapping Engine** | Auto-maps column headers to DB fields (fuzzy match). Manual dropdown overrides for unmatched columns |
| **5. Validation Preview** | Spreadsheet-style table: rows with errors highlighted in red (duplicate serials, missing required fields, invalid formats). Fix-in-place option for minor edits |
| **6. Conflict Resolution** | If records exist, shows side-by-side: Existing vs. Incoming → User chooses Skip / Overwrite / Merge |
| **7. Import & Summary** | Progress bar → Success/Error summary card with downloadable error log |

---

### Screen 11 — Reports & Analytics

**Sidebar**: Report type list with icons
**Main Area**:
- Date range + branch filter (top)
- Chart + data table (main)
- Export toolbar: `PDF | Excel | CSV | Share Link`

**Available Reports**:
- Asset Summary (by category, status, location)
- Depreciation (straight-line, value over time)
- License Compliance (seat utilization, expiry calendar)
- Assignment History
- Audit Trail
- Custom Builder (drag-and-drop field selector)

---

### Screen 12 — Audit Log

- Searchable, filterable event table
- Columns: `Timestamp | Actor | Role | Action | Entity | Entity ID | IP Address | Details`
- Filters: Date range, Role, Action type, Branch
- Export to CSV

---

## 📐 Navigation System

### Sidebar (240px expanded / 48px collapsed)

```
╔══════════════════════╗
║  [⬡] IT IMS          ║
╠══════════════════════╣
║  🏠  Dashboard        ║
║  📦  Assets         ▸ ║
║  👤  Users           ║
║  🔧  Maintenance      ║
║  🏢  Locations       ║
║  📊  Reports          ║
║  🛒  Procurement      ║
╠══════════════════════╣
║  ⚙️  Settings         ║
║  🔔  Notifications 🔴3║
╠══════════════════════╣
║  [Avatar] Alex R.  ⏏ ║
╚══════════════════════╝
```

- Active item: Indigo left border (3px) + `rgba(79,70,229,0.15)` background fill
- Hover: `rgba(79,70,229,0.08)` tint + 0.15s ease
- Sub-menu: Slides open with height animation, 200ms ease

---

## ✨ Motion & Micro-Interaction Design

| Element | Animation |
|---|---|
| Page transitions | Fade + Y translate +8px → 0 (150ms ease-out) |
| Sidebar expand | Width 48px → 240px, 220ms cubic-bezier |
| Modal open | `scale(0.96) opacity(0) → scale(1) opacity(1)`, 250ms |
| KPI count-up | Odometer-style, 800ms ease-out |
| Chart draw | Animated from left/center, 600ms |
| Table row hover | `--bg-card` tint shift, 100ms |
| Toast notification | Slide-in from right + auto-dismiss with shrinking timer bar |
| Status badge (Critical) | Subtle infinite pulse (`box-shadow` radiate, 2s) |
| Theme toggle | 300ms crossfade, icon spins 180° |
| Scan success (QR) | Green flash overlay + ring expand animation |
| Stagger card load | 60ms delay between each card, slide-up + fade |
| FAB (mobile) | Scale 0 → 1 on mount, ripple on tap |

---

## 📱 Responsive Strategy

| Breakpoint | Layout |
|---|---|
| **Desktop** ≥1280px | Full sidebar (240px) + two-column content grids |
| **Tablet** 768–1279px | Icon-only sidebar (48px) + single-column content |
| **Mobile** <768px | Hidden sidebar + bottom nav bar (5 icons) + FAB scanner |

**Mobile Bottom Nav Icons**: Dashboard, Assets, Scan (center, elevated FAB), Reports, Profile

---

## ♿ Accessibility (WCAG 2.1 AA)

- All keyboard-navigable (logical Tab order, visible focus rings)
- ARIA roles, labels, and live regions on dynamic content
- Status indicators use icon + color (never color alone)
- `prefers-reduced-motion` respected — all animations disabled when set
- Minimum 4.5:1 contrast ratio (both themes verified)
- Screen-reader-friendly table markup (`<th scope="col/row">`)

---

## 🌐 PWA & Offline Mode

| Capability | Implementation |
|---|---|
| **Installable** | `manifest.json` with icons, `theme-color: #0F172A` |
| **Service Worker** | Cache-first for shell + assets, network-first for API |
| **Offline Audit** | Technician downloads active asset list → stored in **IndexedDB** |
| **QR Scan Offline** | Scanner writes scan events to local queue |
| **Background Sync** | On reconnect, SW flushes queue to server via Background Sync API |
| **Conflict Resolution** | Modal shows: `Local update (offline) vs. Server state` → user picks or merges |
| **Sync Indicator** | Top-nav "📡" icon: green (synced), amber (pending), red (failed) |

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React + Vite | SPA with fast HMR dev experience |
| **Styling** | Vanilla CSS + CSS Variables | Full design system with theme tokens |
| **Charts** | Recharts | KPI charts, reports, depreciation |
| **Icons** | Lucide React | Consistent icon set |
| **Fonts** | Google Fonts (Outfit, Inter, JetBrains Mono) | Typography system |
| **Animations** | CSS transitions + Framer Motion | Micro-interactions + page transitions |
| **QR Generate** | `qrcode.react` | Asset QR code generation & print |
| **QR Scanner** | `html5-qrcode` | Mobile/desktop camera scanner |
| **Forms** | React Hook Form + Zod | Multi-step wizard + validation |
| **Notifications** | React Hot Toast | Toast system |
| **PWA** | Vite PWA Plugin + Workbox | Service worker + offline |
| **Local Storage** | IndexedDB (via `idb`) | Offline audit queue |
| **State** | Zustand | Lightweight global state (user, branch, theme) |

---

## 📋 Delivery Roadmap

### Phase 1 — Foundation & Core (P0)
| Page / Component | Complexity |
|---|---|
| Design system + CSS tokens (both themes) | Medium |
| Login page | Low |
| Sidebar + Top Navbar layout shell | Medium |
| Dashboard (KPIs + charts + activity feed) | High |
| Asset List (table + filters + grid toggle) | High |
| Asset Detail page (all tabs) | High |

### Phase 2 — Asset Management (P1)
| Page / Component | Complexity |
|---|---|
| Add/Edit Asset (6-step wizard) | High |
| QR Label Print Modal | Medium |
| QR Scanner (mobile FAB + desktop modal) | Medium |
| Users & Assignments module | Medium |
| Multi-Branch Location Manager | Medium |

### Phase 3 — Intelligence & Compliance (P1)
| Page / Component | Complexity |
|---|---|
| Software License module (3 types) | High |
| Reports & Analytics (5 standard + custom builder) | High |
| CSV Import Wizard (7-step) | High |
| Maintenance module | Medium |
# UI/UX Design Plan — IT Inventory Management System (IT IMS)
### **FINALIZED** — All Stakeholder Decisions Incorporated

> A comprehensive, enterprise-grade IT Asset Management platform built on a dark-first premium design system with PWA capabilities, granular RBAC, and multi-branch support.

---

## 🎯 Project Overview

The **IT Inventory Management System (IT IMS)** is a full-featured web-based platform for tracking IT assets across multiple organizational locations — covering hardware, software licenses, peripherals, and infrastructure. The system is designed for six distinct user roles, supports offline field audits via PWA, and provides rich reporting and procurement workflows.

---

## 👥 User Personas

| Persona | Role | Primary Goals |
|---|---|---|
| **Alex** | Super Admin / IT Admin | Full asset lifecycle, RBAC config, audit trails, bulk imports |
| **Maria** | Dept. Manager | View team assets, approve internal requests |
| **Carlos** | Standard Employee | View personal assignments, raise repair/transfer tickets |
| **Dana** | Finance / Procurement | Cost reports, depreciation, license cost analysis, PO tracking |
| **Rona** | Auditor / Inventory Clerk | Physical scanning audits, status updates, stock counting |
| **Ben** | IT Technician | Asset checkout, maintenance logging, QR printing |

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Role | Assets | Users | Reports | Settings | Audit | Requests |
|---|---|---|---|---|---|---|
| **Super Admin** | Full CRUD | Full CRUD | Full | Full | Full | Full |
| **IT Admin / Technician** | Read / Write | Read | Read | Limited | Read | Approve |
| **Auditor / Inv. Clerk** | Read + Status Update | Read (Team) | Read | None | Write | None |
| **Dept. Manager** | Read (Team) | Read (Team) | Team Reports | None | None | Submit / Approve |
| **Finance / Procurement** | Read + Export | None | Full Export | None | None | View PO |
| **Standard Employee** | Self Read | Self | None | None | None | Submit |

> **Implementation**: Enforce via `[data-role]` attribute on `<body>` — CSS hides UI sections not allowed for role. Backend API returns 403 for unauthorized endpoints.

---

## 🗂️ Information Architecture

```
IT IMS
├── 🏠 Dashboard
│   ├── KPI Cards (scoped by active branch)
│   ├── Asset Status Chart (Donut)
│   ├── Recent Activity Timeline
│   ├── Quick Actions Panel
│   ├── License Expiry Alerts
│   └── Low Stock / Critical Alerts
│
├── 📦 Assets
│   ├── All Assets (table + grid view)
│   ├── Hardware
│   │   ├── Computers / Laptops
│   │   ├── Servers
│   │   ├── Networking Equipment
│   │   └── Peripherals
│   ├── Software / Licenses
│   │   ├── Per-Seat / Dedicated
│   │   ├── Concurrent / Floating
│   │   └── Site / Organization-Wide
│   ├── Asset Detail View
│   │   ├── Overview Tab
│   │   ├── Assignment History Tab
│   │   ├── Maintenance Log Tab
│   │   └── Documents Tab
│   ├── Add / Edit Asset (step wizard)
│   └── QR Label Print Modal
│
├── 👤 Users & Assignments
│   ├── User Directory
│   ├── Assignment Matrix
│   └── User Asset Profile
│
├── 🔧 Maintenance
│   ├── Scheduled Maintenance
│   ├── Repair Requests
│   └── Maintenance History
│
├── 🏢 Locations (Multi-Branch)
│   ├── Organization Overview
│   ├── Region / Branch Manager
│   │   ├── Cebu HQ
│   │   ├── Manila Office
│   │   └── [+ Add Branch]
│   ├── Building / Floor Manager
│   └── Room / Zone Manager
│
├── 🏷️ Categories & Classifications
│   ├── Asset Categories
│   └── Departments
│
├── 📊 Reports & Analytics
│   ├── Asset Summary
│   ├── Depreciation Report
│   ├── License Compliance
│   ├── Assignment Report
│   └── Custom Report Builder
│
├── 🛒 Requests & Procurement
│   ├── Asset Request Form
│   ├── Request Queue (Admin)
│   └── Purchase Orders
│
├── 📥 Import / Export
│   ├── CSV Import Wizard (7-step)
│   └── Export Center
│
├── ⚙️ Settings
│   ├── System Configuration
│   ├── User Management & RBAC
│   ├── Notification Preferences
│   └── Audit Logs
│
└── 🔔 Notifications Center
```

---

## 🎨 Design System

### 1. Theme Architecture — Dual Theme (Dark Default + Light Toggle)

```css
/* Implemented via CSS Custom Properties on :root */

[data-theme="dark"] {
  --bg-surface:      #0F172A;
  --bg-card:         #1E2A3A;
  --bg-sidebar:      #1E293B;
  --text-primary:    #F1F5F9;
  --text-muted:      #94A3B8;
  --border:          #334155;
}

[data-theme="light"] {
  --bg-surface:      #F8FAFC;
  --bg-card:         #FFFFFF;
  --bg-sidebar:      #1E293B;   /* Sidebar stays dark-branded */
  --text-primary:    #0F172A;
  --text-muted:      #64748B;
  --border:          #E2E8F0;
}

/* Shared brand tokens — unchanged across themes */
--brand-primary:    #4F46E5;
--brand-hover:      #6366F1;
--accent-green:     #10B981;
--accent-amber:     #F59E0B;
--accent-red:       #EF4444;
--accent-blue:      #3B82F6;
```

**Toggle placement**: Top navbar, right cluster — sun/moon icon with smooth 300ms crossfade. System preference (`prefers-color-scheme`) sets default on first load, persisted via `localStorage`.

---

### 2. Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--brand-primary` | `#4F46E5` | `#4F46E5` | CTAs, active nav, focus rings |
| `--brand-hover` | `#6366F1` | `#4338CA` | Hover state for brand elements |
| `--bg-surface` | `#0F172A` | `#F8FAFC` | Page background |
| `--bg-card` | `#1E2A3A` | `#FFFFFF` | Card / panel backgrounds |
| `--bg-sidebar` | `#1E293B` | `#1E293B` | Navigation sidebar (always dark) |
| `--accent-green` | `#10B981` | `#059669` | Active / OK / In-Use status |
| `--accent-amber` | `#F59E0B` | `#D97706` | Warning / Expiring / Low stock |
| `--accent-red` | `#EF4444` | `#DC2626` | Error / Expired / Critical |
| `--accent-blue` | `#3B82F6` | `#2563EB` | Info / Informational links |
| `--text-primary` | `#F1F5F9` | `#0F172A` | Body and heading text |
| `--text-muted` | `#94A3B8` | `#64748B` | Metadata, captions |
| `--border` | `#334155` | `#E2E8F0` | Card borders, dividers |

---

### 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero | **Outfit** | 700 | 32–48px |
| Section Heading | **Outfit** | 600 | 20–28px |
| Card Title | **Outfit** | 600 | 16–18px |
| Body / Labels | **Inter** | 400 / 500 | 14–16px |
| Monospace (IDs, serial numbers, codes) | **JetBrains Mono** | 400 | 13px |
| Caption / Metadata | **Inter** | 400 | 12px |

---

### 4. Component Design Tokens

| Property | Value |
|---|---|
| Card border-radius | `12px` |
| Button border-radius | `8px` |
| Input border-radius | `8px` |
| Badge / pill border-radius | `999px` |
| Card shadow (dark) | `0 4px 24px rgba(0,0,0,0.35)` |
| Card shadow (light) | `0 2px 12px rgba(0,0,0,0.08)` |
| Glassmorphism overlay | `backdrop-filter: blur(12px); background: rgba(255,255,255,0.05)` |
| Transition (micro) | `0.15s ease-in-out` |
| Transition (panels) | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| Modal entrance | `scale(0.96) → scale(1) + fade, 250ms` |

---

## 🖼️ Screen-by-Screen UX Design

### Screen 1 — Login Page

- **Background**: Dark gradient mesh (`#0F172A → #1E293B`) with subtle animated floating particles (canvas-based, very low opacity)
- **Center card**: Glassmorphism (`blur(16px)`, `rgba(255,255,255,0.06)`, `1px solid rgba(255,255,255,0.1)`)
- **Logo** + "IT IMS" wordmark (Outfit 700) at top
- **Fields**: Email + Password with animated floating labels, show/hide password toggle
- **Options**: "Remember me" toggle + "Forgot password?" link (indigo)
- **CTA**: `Sign In` — full width, indigo gradient (`#4F46E5 → #6366F1`), subtle shimmer on hover
- **Light toggle**: Available even on login screen (top-right corner)

---

### Screen 2 — Dashboard

**Navbar** (64px, always visible):
```
[☰ Collapse]  [📍 Branch: Cebu HQ ▾]    [🔍 Global Search]    [📡 Sync Status]  [🌙/☀️]  [🔔]  [Avatar]
```

**Global Branch Selector** (dropdown):
- "All Locations" (Super Admin / IT Admin default)
- Region list: Cebu HQ, Manila Office, etc.
- Selecting a branch scopes ALL dashboard data, charts, and KPIs

**KPI Row (4 cards, staggered fade-in)**:

| Card | Icon | Metric | Visual |
|---|---|---|---|
| Total Assets | 📦 | `1,284` | Sparkline (7-day trend) |
| Active Assignments | 👤 | `847` | Progress ring (84% of assets) |
| Licenses Expiring | ⚠️ | `12` (in 30 days) | Amber warning pulse |
| Under Maintenance | 🔧 | `23` | Red count badge |

**Content Grid (2 columns)**:
- **Left 65%**: Asset Status Donut Chart (Active / In Storage / In Repair / Retired / Disposed) + Recent Activity Feed (timeline)
- **Right 35%**: Quick Actions (Add Asset, Run Audit, Generate Report, Import CSV), Maintenance upcoming list, Low-stock alerts

---

### Screen 3 — Asset List

**Top bar**:
```
[+ Add Asset]  [📷 Scan QR]  [⬇ Import]  [⬆ Export]   .... [🔍 Search]  [☰ Filter]  [⊞ Grid / ☰ Table toggle]
```

**Table View Columns**:
`Checkbox | Asset Tag | Name | Category | Brand/Model | Location | Assigned To | Status | Warranty | Actions`

**Grid View**: 3-column card grid — asset icon/photo, name, tag, status badge, assignee avatar

**Filter Sidebar** (collapsible, 280px):
- Status (multi-select checkboxes with colored dots)
- Category (tree select)
- Location (branch → floor → room cascading)
- Department
- Assigned / Unassigned toggle
- Date Range (purchase date / last updated)

**Bulk Actions Toolbar** (appears on row selection, slides up):
`Assign | Reassign | Print QR Labels | Export Selected | Archive | Delete`

---

### Screen 4 — Asset Detail Page

**Header**:
```
[Asset Photo / Category Icon]   Dell Latitude 5530
                                 Laptop  •  Cebu HQ, Room 204
                                 🟢 Active   SN: DL-2024-00291   TAG: #AST-8291
                     [Edit]  [Assign]  [Print QR]  [Report Issue]  [⋯ More]
```

**Tab Navigation**: `Overview | Assignment History | Maintenance Log | Documents`

**Overview Tab**:
- Two-column specs grid (Processor, RAM, Storage, OS, etc.)
- Purchase Info card (Date, Vendor, Cost, PO Number)
- Warranty timeline bar (Purchase → Expiry with today marker)
- Depreciation card (Book value + chart)
- Location breadcrumb: `Cebu HQ > Building A > Floor 2 > Room 204`

---

### Screen 5 — Add / Edit Asset (Step Wizard)

**Progress stepper** (top):
```
① Basic Info → ② Acquisition → ③ Location & Assignment → ④ Specs → ⑤ Documents & Notes → ⑥ Review
```

Each step validates before advancing. "Save as Draft" available at any step.

| Step | Key Fields |
|---|---|
| **1. Basic Info** | Name, Category (tree), Brand, Model, Serial No. (auto-format), Asset Tag (auto-generated, editable) |
| **2. Acquisition** | Purchase Date, Vendor, Unit Cost, PO Number, Warranty Expiry (date picker + auto-alert toggle) |
| **3. Location & Assignment** | Branch → Floor → Room cascade, Department, Assignee search (avatar picker) |
| **4. Specs** | Dynamic key-value spec builder (fields adapt to category: e.g. Laptop shows CPU/RAM/Storage, Network Device shows Port Count/Speed) |
| **5. Docs & Notes** | Drag-and-drop file upload (invoice, photos, warranty), Notes textarea with rich formatting |
| **6. Review** | Full summary card, Submit / Back / Save Draft buttons |

---

### Screen 6 — QR Label Print Modal

**Trigger**: "Print QR" button on Asset Detail or bulk selection

**Modal Layout**:
- Label preview (live, 2" × 1" proportion)
- Label contains:
  - QR code (vector, encodes asset permalink URL)
  - Asset Tag ID (`#AST-8291`) in JetBrains Mono
  - Asset Name (truncated)
  - Organization name + Category
- Print options: Single label / Sheet (8-up, 16-up, 30-up Avery)
- `@media print` CSS handles layout isolation

---

### Screen 7 — Mobile QR Scanner

**Entry Points**:
- Mobile: Floating Action Button (FAB, bottom-right, indigo, camera icon)
- Desktop: Top-nav scan icon (opens webcam modal)

**Scanner Flow**:
```
Tap FAB → Permission prompt (if first use) → 
Full-screen viewfinder with scanning frame overlay →
Green flash + haptic feedback on successful scan →
Instant redirect → Asset Detail Page
```

**Tech**: `html5-qrcode` library. Overlay UI: dark vignette with animated corner-bracket targeting frame.

---

### Screen 8 — Multi-Branch Location Manager

**Location Hierarchy**:
```
Organization (IT IMS Co.)
  └── Region/Branch (Cebu HQ)
        └── Building/Floor (Building A — Floor 2)
              └── Room/Zone (Room 204 — Server Room)
```

**UI**: Tree view with expand/collapse, inline add/rename/delete, drag-to-reorganize. Asset count badge on each node.

---

### Screen 9 — Software License Module

**Three license type cards** (tabbed or segmented control):

**Per-Seat / Dedicated**
- Table: User | Product | License Key | Assigned Date | Expiry
- Seat counter: `47 / 50 seats allocated` (progress bar, amber at >90%)

**Concurrent / Floating**
- Live counter: `12 / 30 concurrent sessions active`
- Session log with timestamp, user, workstation

**Site / Organization-Wide**
- Card per subscription: Vendor, Product, Annual Cost, Renewal Date, Contract Doc
- Renewal calendar widget

---

### Screen 10 — CSV Import Wizard

**7-Step Import Flow**:

| Step | Description |
|---|---|
| **1. Select Type** | Choose: Assets / Users / Software Licenses |
| **2. Download Template** | Download pre-formatted CSV / Excel template with field descriptions |
| **3. Upload File** | Drag-and-drop zone, supports `.csv`, `.xlsx`. Shows file size + row count on upload |
| **4. Field Mapping Engine** | Auto-maps column headers to DB fields (fuzzy match). Manual dropdown overrides for unmatched columns |
| **5. Validation Preview** | Spreadsheet-style table: rows with errors highlighted in red (duplicate serials, missing required fields, invalid formats). Fix-in-place option for minor edits |
| **6. Conflict Resolution** | If records exist, shows side-by-side: Existing vs. Incoming → User chooses Skip / Overwrite / Merge |
| **7. Import & Summary** | Progress bar → Success/Error summary card with downloadable error log |

---

### Screen 11 — Reports & Analytics

**Sidebar**: Report type list with icons
**Main Area**:
- Date range + branch filter (top)
- Chart + data table (main)
- Export toolbar: `PDF | Excel | CSV | Share Link`

**Available Reports**:
- Asset Summary (by category, status, location)
- Depreciation (straight-line, value over time)
- License Compliance (seat utilization, expiry calendar)
- Assignment History
- Audit Trail
- Custom Builder (drag-and-drop field selector)

---

### Screen 12 — Audit Log

- Searchable, filterable event table
- Columns: `Timestamp | Actor | Role | Action | Entity | Entity ID | IP Address | Details`
- Filters: Date range, Role, Action type, Branch
- Export to CSV

---

## 📐 Navigation System

### Sidebar (240px expanded / 48px collapsed)

```
╔══════════════════════╗
║  [⬡] IT IMS          ║
╠══════════════════════╣
║  🏠  Dashboard        ║
║  📦  Assets         ▸ ║
║  👤  Users           ║
║  🔧  Maintenance      ║
║  🏢  Locations       ║
║  📊  Reports          ║
║  🛒  Procurement      ║
╠══════════════════════╣
║  ⚙️  Settings         ║
║  🔔  Notifications 🔴3║
╠══════════════════════╣
║  [Avatar] Alex R.  ⏏ ║
╚══════════════════════╝
```

- Active item: Indigo left border (3px) + `rgba(79,70,229,0.15)` background fill
- Hover: `rgba(79,70,229,0.08)` tint + 0.15s ease
- Sub-menu: Slides open with height animation, 200ms ease

---

## ✨ Motion & Micro-Interaction Design

| Element | Animation |
|---|---|
| Page transitions | Fade + Y translate +8px → 0 (150ms ease-out) |
| Sidebar expand | Width 48px → 240px, 220ms cubic-bezier |
| Modal open | `scale(0.96) opacity(0) → scale(1) opacity(1)`, 250ms |
| KPI count-up | Odometer-style, 800ms ease-out |
| Chart draw | Animated from left/center, 600ms |
| Table row hover | `--bg-card` tint shift, 100ms |
| Toast notification | Slide-in from right + auto-dismiss with shrinking timer bar |
| Status badge (Critical) | Subtle infinite pulse (`box-shadow` radiate, 2s) |
| Theme toggle | 300ms crossfade, icon spins 180° |
| Scan success (QR) | Green flash overlay + ring expand animation |
| Stagger card load | 60ms delay between each card, slide-up + fade |
| FAB (mobile) | Scale 0 → 1 on mount, ripple on tap |

---

## 📱 Responsive Strategy

| Breakpoint | Layout |
|---|---|
| **Desktop** ≥1280px | Full sidebar (240px) + two-column content grids |
| **Tablet** 768–1279px | Icon-only sidebar (48px) + single-column content |
| **Mobile** <768px | Hidden sidebar + bottom nav bar (5 icons) + FAB scanner |

**Mobile Bottom Nav Icons**: Dashboard, Assets, Scan (center, elevated FAB), Reports, Profile

---

## ♿ Accessibility (WCAG 2.1 AA)

- All keyboard-navigable (logical Tab order, visible focus rings)
- ARIA roles, labels, and live regions on dynamic content
- Status indicators use icon + color (never color alone)
- `prefers-reduced-motion` respected — all animations disabled when set
- Minimum 4.5:1 contrast ratio (both themes verified)
- Screen-reader-friendly table markup (`<th scope="col/row">`)

---

## 🌐 PWA & Offline Mode

| Capability | Implementation |
|---|---|
| **Installable** | `manifest.json` with icons, `theme-color: #0F172A` |
| **Service Worker** | Cache-first for shell + assets, network-first for API |
| **Offline Audit** | Technician downloads active asset list → stored in **IndexedDB** |
| **QR Scan Offline** | Scanner writes scan events to local queue |
| **Background Sync** | On reconnect, SW flushes queue to server via Background Sync API |
| **Conflict Resolution** | Modal shows: `Local update (offline) vs. Server state` → user picks or merges |
| **Sync Indicator** | Top-nav "📡" icon: green (synced), amber (pending), red (failed) |

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React + Vite | SPA with fast HMR dev experience |
| **Styling** | Vanilla CSS + CSS Variables | Full design system with theme tokens |
| **Charts** | Recharts | KPI charts, reports, depreciation |
| **Icons** | Lucide React | Consistent icon set |
| **Fonts** | Google Fonts (Outfit, Inter, JetBrains Mono) | Typography system |
| **Animations** | CSS transitions + Framer Motion | Micro-interactions + page transitions |
| **QR Generate** | `qrcode.react` | Asset QR code generation & print |
| **QR Scanner** | `html5-qrcode` | Mobile/desktop camera scanner |
| **Forms** | React Hook Form + Zod | Multi-step wizard + validation |
| **Notifications** | React Hot Toast | Toast system |
| **PWA** | Vite PWA Plugin + Workbox | Service worker + offline |
| **Local Storage** | IndexedDB (via `idb`) | Offline audit queue |
| **State** | Zustand | Lightweight global state (user, branch, theme) |

---

## 📋 Delivery Roadmap

### Phase 1 — Foundation & Core (P0)
| Page / Component | Complexity |
|---|---|
| Design system + CSS tokens (both themes) | Medium |
| Login page | Low |
| Sidebar + Top Navbar layout shell | Medium |
| Dashboard (KPIs + charts + activity feed) | High |
| Asset List (table + filters + grid toggle) | High |
| Asset Detail page (all tabs) | High |

### Phase 2 — Asset Management (P1)
| Page / Component | Complexity |
|---|---|
| Add/Edit Asset (6-step wizard) | High |
| QR Label Print Modal | Medium |
| QR Scanner (mobile FAB + desktop modal) | Medium |
| Users & Assignments module | Medium |
| Multi-Branch Location Manager | Medium |

### Phase 3 — Intelligence & Compliance (P1)
| Page / Component | Complexity |
|---|---|
| Software License module (3 types) | High |
| Reports & Analytics (5 standard + custom builder) | High |
| CSV Import Wizard (7-step) | High |
| Maintenance module | Medium |

### Phase 4 — Platform & Polish (P2)
| Page / Component | Complexity |
|---|---|
| Procurement / Requests module | Medium |
| Settings (RBAC editor, notifications) | Medium |
| PWA + offline audit mode | High |
| Audit Log viewer | Low |
| Full responsive/mobile polish | Medium |

---

## ✅ Finalized Decisions Summary

| # | Decision | Status |
|---|---|---|
| 1 | Dark default + light toggle via CSS custom properties | ✅ Finalized |
| 2 | 2"×1" QR thermal label print modal, `@media print` CSS | ✅ Finalized |
| 3 | WebRTC scanner via `html5-qrcode`, mobile FAB + desktop modal | ✅ Finalized |
| 4 | 4-level hierarchy (Org → Region → Floor → Room), global branch selector | ✅ Finalized |
| 5 | 6-role RBAC (Super Admin, IT Admin, Auditor, Dept Mgr, Finance, Employee) | ✅ Finalized |
| 6 | PWA + IndexedDB offline audit + Background Sync conflict resolution | ✅ Finalized |
| 7 | 7-step CSV Import Wizard with field mapping + validation preview | ✅ Finalized |
| 8 | 3-type license schema: Per-Seat / Concurrent / Site-Wide | ✅ Finalized |# UI/UX Design Plan — IT Inventory Management System (IT IMS)
### **FINALIZED** — All Stakeholder Decisions Incorporated

> A comprehensive, enterprise-grade IT Asset Management platform built on a dark-first premium design system with PWA capabilities, granular RBAC, and multi-branch support.

---

## 🎯 Project Overview

The **IT Inventory Management System (IT IMS)** is a full-featured web-based platform for tracking IT assets across multiple organizational locations — covering hardware, software licenses, peripherals, and infrastructure. The system is designed for six distinct user roles, supports offline field audits via PWA, and provides rich reporting and procurement workflows.

---

## 👥 User Personas

| Persona | Role | Primary Goals |
|---|---|---|
| **Alex** | Super Admin / IT Admin | Full asset lifecycle, RBAC config, audit trails, bulk imports |
| **Maria** | Dept. Manager | View team assets, approve internal requests |
| **Carlos** | Standard Employee | View personal assignments, raise repair/transfer tickets |
| **Dana** | Finance / Procurement | Cost reports, depreciation, license cost analysis, PO tracking |
| **Rona** | Auditor / Inventory Clerk | Physical scanning audits, status updates, stock counting |
| **Ben** | IT Technician | Asset checkout, maintenance logging, QR printing |

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Role | Assets | Users | Reports | Settings | Audit | Requests |
|---|---|---|---|---|---|---|
| **Super Admin** | Full CRUD | Full CRUD | Full | Full | Full | Full |
| **IT Admin / Technician** | Read / Write | Read | Read | Limited | Read | Approve |
| **Auditor / Inv. Clerk** | Read + Status Update | Read (Team) | Read | None | Write | None |
| **Dept. Manager** | Read (Team) | Read (Team) | Team Reports | None | None | Submit / Approve |
| **Finance / Procurement** | Read + Export | None | Full Export | None | None | View PO |
| **Standard Employee** | Self Read | Self | None | None | None | Submit |

> **Implementation**: Enforce via `[data-role]` attribute on `<body>` — CSS hides UI sections not allowed for role. Backend API returns 403 for unauthorized endpoints.

---

## 🗂️ Information Architecture

```
IT IMS
├── 🏠 Dashboard
│   ├── KPI Cards (scoped by active branch)
│   ├── Asset Status Chart (Donut)
│   ├── Recent Activity Timeline
│   ├── Quick Actions Panel
│   ├── License Expiry Alerts
│   └── Low Stock / Critical Alerts
│
├── 📦 Assets
│   ├── All Assets (table + grid view)
│   ├── Hardware
│   │   ├── Computers / Laptops
│   │   ├── Servers
│   │   ├── Networking Equipment
│   │   └── Peripherals
│   ├── Software / Licenses
│   │   ├── Per-Seat / Dedicated
│   │   ├── Concurrent / Floating
│   │   └── Site / Organization-Wide
│   ├── Asset Detail View
│   │   ├── Overview Tab
│   │   ├── Assignment History Tab
│   │   ├── Maintenance Log Tab
│   │   └── Documents Tab
│   ├── Add / Edit Asset (step wizard)
│   └── QR Label Print Modal
│
├── 👤 Users & Assignments
│   ├── User Directory
│   ├── Assignment Matrix
│   └── User Asset Profile
│
├── 🔧 Maintenance
│   ├── Scheduled Maintenance
│   ├── Repair Requests
│   └── Maintenance History
│
├── 🏢 Locations (Multi-Branch)
│   ├── Organization Overview
│   ├── Region / Branch Manager
│   │   ├── Cebu HQ
│   │   ├── Manila Office
│   │   └── [+ Add Branch]
│   ├── Building / Floor Manager
│   └── Room / Zone Manager
│
├── 🏷️ Categories & Classifications
│   ├── Asset Categories
│   └── Departments
│
├── 📊 Reports & Analytics
│   ├── Asset Summary
│   ├── Depreciation Report
│   ├── License Compliance
│   ├── Assignment Report
│   └── Custom Report Builder
│
├── 🛒 Requests & Procurement
│   ├── Asset Request Form
│   ├── Request Queue (Admin)
│   └── Purchase Orders
│
├── 📥 Import / Export
│   ├── CSV Import Wizard (7-step)
│   └── Export Center
│
├── ⚙️ Settings
│   ├── System Configuration
│   ├── User Management & RBAC
│   ├── Notification Preferences
│   └── Audit Logs
│
└── 🔔 Notifications Center
```

---

## 🎨 Design System

### 1. Theme Architecture — Dual Theme (Dark Default + Light Toggle)

```css
/* Implemented via CSS Custom Properties on :root */

[data-theme="dark"] {
  --bg-surface:      #0F172A;
  --bg-card:         #1E2A3A;
  --bg-sidebar:      #1E293B;
  --text-primary:    #F1F5F9;
  --text-muted:      #94A3B8;
  --border:          #334155;
}

[data-theme="light"] {
  --bg-surface:      #F8FAFC;
  --bg-card:         #FFFFFF;
  --bg-sidebar:      #1E293B;   /* Sidebar stays dark-branded */
  --text-primary:    #0F172A;
  --text-muted:      #64748B;
  --border:          #E2E8F0;
}

/* Shared brand tokens — unchanged across themes */
--brand-primary:    #4F46E5;
--brand-hover:      #6366F1;
--accent-green:     #10B981;
--accent-amber:     #F59E0B;
--accent-red:       #EF4444;
--accent-blue:      #3B82F6;
```

**Toggle placement**: Top navbar, right cluster — sun/moon icon with smooth 300ms crossfade. System preference (`prefers-color-scheme`) sets default on first load, persisted via `localStorage`.

---

### 2. Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--brand-primary` | `#4F46E5` | `#4F46E5` | CTAs, active nav, focus rings |
| `--brand-hover` | `#6366F1` | `#4338CA` | Hover state for brand elements |
| `--bg-surface` | `#0F172A` | `#F8FAFC` | Page background |
| `--bg-card` | `#1E2A3A` | `#FFFFFF` | Card / panel backgrounds |
| `--bg-sidebar` | `#1E293B` | `#1E293B` | Navigation sidebar (always dark) |
| `--accent-green` | `#10B981` | `#059669` | Active / OK / In-Use status |
| `--accent-amber` | `#F59E0B` | `#D97706` | Warning / Expiring / Low stock |
| `--accent-red` | `#EF4444` | `#DC2626` | Error / Expired / Critical |
| `--accent-blue` | `#3B82F6` | `#2563EB` | Info / Informational links |
| `--text-primary` | `#F1F5F9` | `#0F172A` | Body and heading text |
| `--text-muted` | `#94A3B8` | `#64748B` | Metadata, captions |
| `--border` | `#334155` | `#E2E8F0` | Card borders, dividers |

---

### 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero | **Outfit** | 700 | 32–48px |
| Section Heading | **Outfit** | 600 | 20–28px |
| Card Title | **Outfit** | 600 | 16–18px |
| Body / Labels | **Inter** | 400 / 500 | 14–16px |
| Monospace (IDs, serial numbers, codes) | **JetBrains Mono** | 400 | 13px |
| Caption / Metadata | **Inter** | 400 | 12px |

---

### 4. Component Design Tokens

| Property | Value |
|---|---|
| Card border-radius | `12px` |
| Button border-radius | `8px` |
| Input border-radius | `8px` |
| Badge / pill border-radius | `999px` |
| Card shadow (dark) | `0 4px 24px rgba(0,0,0,0.35)` |
| Card shadow (light) | `0 2px 12px rgba(0,0,0,0.08)` |
| Glassmorphism overlay | `backdrop-filter: blur(12px); background: rgba(255,255,255,0.05)` |
| Transition (micro) | `0.15s ease-in-out` |
| Transition (panels) | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| Modal entrance | `scale(0.96) → scale(1) + fade, 250ms` |

---

## 🖼️ Screen-by-Screen UX Design

### Screen 1 — Login Page

- **Background**: Dark gradient mesh (`#0F172A → #1E293B`) with subtle animated floating particles (canvas-based, very low opacity)
- **Center card**: Glassmorphism (`blur(16px)`, `rgba(255,255,255,0.06)`, `1px solid rgba(255,255,255,0.1)`)
- **Logo** + "IT IMS" wordmark (Outfit 700) at top
- **Fields**: Email + Password with animated floating labels, show/hide password toggle
- **Options**: "Remember me" toggle + "Forgot password?" link (indigo)
- **CTA**: `Sign In` — full width, indigo gradient (`#4F46E5 → #6366F1`), subtle shimmer on hover
- **Light toggle**: Available even on login screen (top-right corner)

---

### Screen 2 — Dashboard

**Navbar** (64px, always visible):
```
[☰ Collapse]  [📍 Branch: Cebu HQ ▾]    [🔍 Global Search]    [📡 Sync Status]  [🌙/☀️]  [🔔]  [Avatar]
```

**Global Branch Selector** (dropdown):
- "All Locations" (Super Admin / IT Admin default)
- Region list: Cebu HQ, Manila Office, etc.
- Selecting a branch scopes ALL dashboard data, charts, and KPIs

**KPI Row (4 cards, staggered fade-in)**:

| Card | Icon | Metric | Visual |
|---|---|---|---|
| Total Assets | 📦 | `1,284` | Sparkline (7-day trend) |
| Active Assignments | 👤 | `847` | Progress ring (84% of assets) |
| Licenses Expiring | ⚠️ | `12` (in 30 days) | Amber warning pulse |
| Under Maintenance | 🔧 | `23` | Red count badge |

**Content Grid (2 columns)**:
- **Left 65%**: Asset Status Donut Chart (Active / In Storage / In Repair / Retired / Disposed) + Recent Activity Feed (timeline)
- **Right 35%**: Quick Actions (Add Asset, Run Audit, Generate Report, Import CSV), Maintenance upcoming list, Low-stock alerts

---

### Screen 3 — Asset List

**Top bar**:
```
[+ Add Asset]  [📷 Scan QR]  [⬇ Import]  [⬆ Export]   .... [🔍 Search]  [☰ Filter]  [⊞ Grid / ☰ Table toggle]
```

**Table View Columns**:
`Checkbox | Asset Tag | Name | Category | Brand/Model | Location | Assigned To | Status | Warranty | Actions`

**Grid View**: 3-column card grid — asset icon/photo, name, tag, status badge, assignee avatar

**Filter Sidebar** (collapsible, 280px):
- Status (multi-select checkboxes with colored dots)
- Category (tree select)
- Location (branch → floor → room cascading)
- Department
- Assigned / Unassigned toggle
- Date Range (purchase date / last updated)

**Bulk Actions Toolbar** (appears on row selection, slides up):
`Assign | Reassign | Print QR Labels | Export Selected | Archive | Delete`

---

### Screen 4 — Asset Detail Page

**Header**:
```
[Asset Photo / Category Icon]   Dell Latitude 5530
                                 Laptop  •  Cebu HQ, Room 204
                                 🟢 Active   SN: DL-2024-00291   TAG: #AST-8291
                     [Edit]  [Assign]  [Print QR]  [Report Issue]  [⋯ More]
```

**Tab Navigation**: `Overview | Assignment History | Maintenance Log | Documents`

**Overview Tab**:
- Two-column specs grid (Processor, RAM, Storage, OS, etc.)
- Purchase Info card (Date, Vendor, Cost, PO Number)
- Warranty timeline bar (Purchase → Expiry with today marker)
- Depreciation card (Book value + chart)
- Location breadcrumb: `Cebu HQ > Building A > Floor 2 > Room 204`

---

### Screen 5 — Add / Edit Asset (Step Wizard)

**Progress stepper** (top):
```
① Basic Info → ② Acquisition → ③ Location & Assignment → ④ Specs → ⑤ Documents & Notes → ⑥ Review
```

Each step validates before advancing. "Save as Draft" available at any step.

| Step | Key Fields |
|---|---|
| **1. Basic Info** | Name, Category (tree), Brand, Model, Serial No. (auto-format), Asset Tag (auto-generated, editable) |
| **2. Acquisition** | Purchase Date, Vendor, Unit Cost, PO Number, Warranty Expiry (date picker + auto-alert toggle) |
| **3. Location & Assignment** | Branch → Floor → Room cascade, Department, Assignee search (avatar picker) |
| **4. Specs** | Dynamic key-value spec builder (fields adapt to category: e.g. Laptop shows CPU/RAM/Storage, Network Device shows Port Count/Speed) |
| **5. Docs & Notes** | Drag-and-drop file upload (invoice, photos, warranty), Notes textarea with rich formatting |
| **6. Review** | Full summary card, Submit / Back / Save Draft buttons |

---

### Screen 6 — QR Label Print Modal

**Trigger**: "Print QR" button on Asset Detail or bulk selection

**Modal Layout**:
- Label preview (live, 2" × 1" proportion)
- Label contains:
  - QR code (vector, encodes asset permalink URL)
  - Asset Tag ID (`#AST-8291`) in JetBrains Mono
  - Asset Name (truncated)
  - Organization name + Category
- Print options: Single label / Sheet (8-up, 16-up, 30-up Avery)
- `@media print` CSS handles layout isolation

---

### Screen 7 — Mobile QR Scanner

**Entry Points**:
- Mobile: Floating Action Button (FAB, bottom-right, indigo, camera icon)
- Desktop: Top-nav scan icon (opens webcam modal)

**Scanner Flow**:
```
Tap FAB → Permission prompt (if first use) → 
Full-screen viewfinder with scanning frame overlay →
Green flash + haptic feedback on successful scan →
Instant redirect → Asset Detail Page
```

**Tech**: `html5-qrcode` library. Overlay UI: dark vignette with animated corner-bracket targeting frame.

---

### Screen 8 — Multi-Branch Location Manager

**Location Hierarchy**:
```
Organization (IT IMS Co.)
  └── Region/Branch (Cebu HQ)
        └── Building/Floor (Building A — Floor 2)
              └── Room/Zone (Room 204 — Server Room)
```

**UI**: Tree view with expand/collapse, inline add/rename/delete, drag-to-reorganize. Asset count badge on each node.

---

### Screen 9 — Software License Module

**Three license type cards** (tabbed or segmented control):

**Per-Seat / Dedicated**
- Table: User | Product | License Key | Assigned Date | Expiry
- Seat counter: `47 / 50 seats allocated` (progress bar, amber at >90%)

**Concurrent / Floating**
- Live counter: `12 / 30 concurrent sessions active`
- Session log with timestamp, user, workstation

**Site / Organization-Wide**
- Card per subscription: Vendor, Product, Annual Cost, Renewal Date, Contract Doc
- Renewal calendar widget

---

### Screen 10 — CSV Import Wizard

**7-Step Import Flow**:

| Step | Description |
|---|---|
| **1. Select Type** | Choose: Assets / Users / Software Licenses |
| **2. Download Template** | Download pre-formatted CSV / Excel template with field descriptions |
| **3. Upload File** | Drag-and-drop zone, supports `.csv`, `.xlsx`. Shows file size + row count on upload |
| **4. Field Mapping Engine** | Auto-maps column headers to DB fields (fuzzy match). Manual dropdown overrides for unmatched columns |
| **5. Validation Preview** | Spreadsheet-style table: rows with errors highlighted in red (duplicate serials, missing required fields, invalid formats). Fix-in-place option for minor edits |
| **6. Conflict Resolution** | If records exist, shows side-by-side: Existing vs. Incoming → User chooses Skip / Overwrite / Merge |
| **7. Import & Summary** | Progress bar → Success/Error summary card with downloadable error log |

---

### Screen 11 — Reports & Analytics

**Sidebar**: Report type list with icons
**Main Area**:
- Date range + branch filter (top)
- Chart + data table (main)
- Export toolbar: `PDF | Excel | CSV | Share Link`

**Available Reports**:
- Asset Summary (by category, status, location)
- Depreciation (straight-line, value over time)
- License Compliance (seat utilization, expiry calendar)
- Assignment History
- Audit Trail
- Custom Builder (drag-and-drop field selector)

---

### Screen 12 — Audit Log

- Searchable, filterable event table
- Columns: `Timestamp | Actor | Role | Action | Entity | Entity ID | IP Address | Details`
- Filters: Date range, Role, Action type, Branch
- Export to CSV

---

## 📐 Navigation System

### Sidebar (240px expanded / 48px collapsed)

```
╔══════════════════════╗
║  [⬡] IT IMS          ║
╠══════════════════════╣
║  🏠  Dashboard        ║
║  📦  Assets         ▸ ║
║  👤  Users           ║
║  🔧  Maintenance      ║
║  🏢  Locations       ║
║  📊  Reports          ║
║  🛒  Procurement      ║
╠══════════════════════╣
║  ⚙️  Settings         ║
║  🔔  Notifications 🔴3║
╠══════════════════════╣
║  [Avatar] Alex R.  ⏏ ║
╚══════════════════════╝
```

- Active item: Indigo left border (3px) + `rgba(79,70,229,0.15)` background fill
- Hover: `rgba(79,70,229,0.08)` tint + 0.15s ease
- Sub-menu: Slides open with height animation, 200ms ease

---

## ✨ Motion & Micro-Interaction Design

| Element | Animation |
|---|---|
| Page transitions | Fade + Y translate +8px → 0 (150ms ease-out) |
| Sidebar expand | Width 48px → 240px, 220ms cubic-bezier |
| Modal open | `scale(0.96) opacity(0) → scale(1) opacity(1)`, 250ms |
| KPI count-up | Odometer-style, 800ms ease-out |
| Chart draw | Animated from left/center, 600ms |
| Table row hover | `--bg-card` tint shift, 100ms |
| Toast notification | Slide-in from right + auto-dismiss with shrinking timer bar |
| Status badge (Critical) | Subtle infinite pulse (`box-shadow` radiate, 2s) |
| Theme toggle | 300ms crossfade, icon spins 180° |
| Scan success (QR) | Green flash overlay + ring expand animation |
| Stagger card load | 60ms delay between each card, slide-up + fade |
| FAB (mobile) | Scale 0 → 1 on mount, ripple on tap |

---

## 📱 Responsive Strategy

| Breakpoint | Layout |
|---|---|
| **Desktop** ≥1280px | Full sidebar (240px) + two-column content grids |
| **Tablet** 768–1279px | Icon-only sidebar (48px) + single-column content |
| **Mobile** <768px | Hidden sidebar + bottom nav bar (5 icons) + FAB scanner |

**Mobile Bottom Nav Icons**: Dashboard, Assets, Scan (center, elevated FAB), Reports, Profile

---

## ♿ Accessibility (WCAG 2.1 AA)

- All keyboard-navigable (logical Tab order, visible focus rings)
- ARIA roles, labels, and live regions on dynamic content
- Status indicators use icon + color (never color alone)
- `prefers-reduced-motion` respected — all animations disabled when set
- Minimum 4.5:1 contrast ratio (both themes verified)
- Screen-reader-friendly table markup (`<th scope="col/row">`)

---

## 🌐 PWA & Offline Mode

| Capability | Implementation |
|---|---|
| **Installable** | `manifest.json` with icons, `theme-color: #0F172A` |
| **Service Worker** | Cache-first for shell + assets, network-first for API |
| **Offline Audit** | Technician downloads active asset list → stored in **IndexedDB** |
| **QR Scan Offline** | Scanner writes scan events to local queue |
| **Background Sync** | On reconnect, SW flushes queue to server via Background Sync API |
| **Conflict Resolution** | Modal shows: `Local update (offline) vs. Server state` → user picks or merges |
| **Sync Indicator** | Top-nav "📡" icon: green (synced), amber (pending), red (failed) |

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React + Vite | SPA with fast HMR dev experience |
| **Styling** | Vanilla CSS + CSS Variables | Full design system with theme tokens |
| **Charts** | Recharts | KPI charts, reports, depreciation |
| **Icons** | Lucide React | Consistent icon set |
| **Fonts** | Google Fonts (Outfit, Inter, JetBrains Mono) | Typography system |
| **Animations** | CSS transitions + Framer Motion | Micro-interactions + page transitions |
| **QR Generate** | `qrcode.react` | Asset QR code generation & print |
| **QR Scanner** | `html5-qrcode` | Mobile/desktop camera scanner |
| **Forms** | React Hook Form + Zod | Multi-step wizard + validation |
| **Notifications** | React Hot Toast | Toast system |
| **PWA** | Vite PWA Plugin + Workbox | Service worker + offline |
| **Local Storage** | IndexedDB (via `idb`) | Offline audit queue |
| **State** | Zustand | Lightweight global state (user, branch, theme) |

---

## 📋 Delivery Roadmap

### Phase 1 — Foundation & Core (P0)
| Page / Component | Complexity |
|---|---|
| Design system + CSS tokens (both themes) | Medium |
| Login page | Low |
| Sidebar + Top Navbar layout shell | Medium |
| Dashboard (KPIs + charts + activity feed) | High |
| Asset List (table + filters + grid toggle) | High |
| Asset Detail page (all tabs) | High |

### Phase 2 — Asset Management (P1)
| Page / Component | Complexity |
|---|---|
| Add/Edit Asset (6-step wizard) | High |
| QR Label Print Modal | Medium |
| QR Scanner (mobile FAB + desktop modal) | Medium |
| Users & Assignments module | Medium |
| Multi-Branch Location Manager | Medium |

### Phase 3 — Intelligence & Compliance (P1)
| Page / Component | Complexity |
|---|---|
| Software License module (3 types) | High |
| Reports & Analytics (5 standard + custom builder) | High |
| CSV Import Wizard (7-step) | High |
| Maintenance module | Medium |

### Phase 4 — Platform & Polish (P2)
| Page / Component | Complexity |
|---|---|
| Procurement / Requests module | Medium |
| Settings (RBAC editor, notifications) | Medium |
| PWA + offline audit mode | High |
| Audit Log viewer | Low |
| Full responsive/mobile polish | Medium |

---

## ✅ Finalized Decisions Summary

| # | Decision | Status |
|---|---|---|
| 1 | Dark default + light toggle via CSS custom properties | ✅ Finalized |
| 2 | 2"×1" QR thermal label print modal, `@media print` CSS | ✅ Finalized |
| 3 | WebRTC scanner via `html5-qrcode`, mobile FAB + desktop modal | ✅ Finalized |
| 4 | 4-level hierarchy (Org → Region → Floor → Room), global branch selector | ✅ Finalized |
| 5 | 6-role RBAC (Super Admin, IT Admin, Auditor, Dept Mgr, Finance, Employee) | ✅ Finalized |
| 6 | PWA + IndexedDB offline audit + Background Sync conflict resolution | ✅ Finalized |
| 7 | 7-step CSV Import Wizard with field mapping + validation preview | ✅ Finalized |
| 8 | 3-type license schema: Per-Seat / Concurrent / Site-Wide | ✅ Finalized |
### Phase 4 — Platform & Polish (P2)
| Page / Component | Complexity |
|---|---|
| Procurement / Requests module | Medium |
| Settings (RBAC editor, notifications) | Medium |
| PWA + offline audit mode | High |
| Audit Log viewer | Low |
| Full responsive/mobile polish | Medium |

---

## ✅ Finalized Decisions Summary

| # | Decision | Status |
|---|---|---|
| 1 | Dark default + light toggle via CSS custom properties | ✅ Finalized |
| 2 | 2"×1" QR thermal label print modal, `@media print` CSS | ✅ Finalized |
| 3 | WebRTC scanner via `html5-qrcode`, mobile FAB + desktop modal | ✅ Finalized |
| 4 | 4-level hierarchy (Org → Region → Floor → Room), global branch selector | ✅ Finalized |
| 5 | 6-role RBAC (Super Admin, IT Admin, Auditor, Dept Mgr, Finance, Employee) | ✅ Finalized |
| 6 | PWA + IndexedDB offline audit + Background Sync conflict resolution | ✅ Finalized |
| 7 | 7-step CSV Import Wizard with field mapping + validation preview | ✅ Finalized |
| 8 | 3-type license schema: Per-Seat / Concurrent / Site-Wide | ✅ Finalized |