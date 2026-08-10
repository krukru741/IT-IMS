import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { mockMaintenance, mockLicenses } from '../../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Printer, BarChart2, PieChart as PieIcon, Activity, Grid } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const REPORTS = [
  { id: 'lifecycle',  label: 'Asset Lifecycle', icon: Activity },
  { id: 'depreciation', label: 'Depreciation',  icon: BarChart2 },
  { id: 'maintenance',label: 'Maintenance Costs', icon: WrenchIcon },
  { id: 'department', label: 'Dept. Allocations', icon: PieIcon },
  { id: 'software',   label: 'Software Compliance', icon: Grid },
];

function WrenchIcon({ size = 24, ...props }) { return <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>; }

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function ReportDashboard() {
  const { assets, activeBranch } = useStore();
  const [activeReport, setActiveReport] = useState('lifecycle');

  // Filter global assets by branch
  const filteredAssets = useMemo(() => {
    return activeBranch === 'all' ? assets : assets.filter(a => a.branch === activeBranch);
  }, [assets, activeBranch]);

  // ── Report 1: Asset Lifecycle ──────────────────────────────────
  const lifecycleData = useMemo(() => {
    const counts = { ACTIVE: 0, IN_STORAGE: 0, IN_REPAIR: 0, RETIRED: 0, DISPOSED: 0 };
    filteredAssets.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAssets]);

  // ── Report 2: Depreciation (Straight-line) ──────────────────────
  const depreciationData = useMemo(() => {
    // 3 yrs for Laptops/Phone, 5 for Servers/Switch/Router/Monitor, 7 for Printers/UPS/Other
    const getLifespan = (cat) => {
      if (['Laptop', 'Phone', 'Tablet'].includes(cat)) return 3;
      if (['Server', 'Network Switch', 'Router', 'Monitor'].includes(cat)) return 5;
      return 7;
    };

    const currentYear = new Date().getFullYear();
    
    return filteredAssets
      .filter(a => a.purchaseCost && a.purchaseDate)
      .map(a => {
        const purchaseYear = new Date(a.purchaseDate).getFullYear();
        const age = currentYear - purchaseYear;
        const lifespan = getLifespan(a.category);
        const annualDep = a.purchaseCost / lifespan;
        
        // 0% residual, so don't drop below 0
        const currentVal = Math.max(0, a.purchaseCost - (annualDep * age));
        const depAcc = Math.min(a.purchaseCost, annualDep * age);

        return {
          Tag: a.tag,
          Name: a.name,
          Category: a.category,
          PurchaseYear: purchaseYear,
          OriginalCost: a.purchaseCost,
          AccumulatedDep: depAcc,
          CurrentValue: currentVal,
        };
      });
  }, [filteredAssets]);

  // ── Report 4: Dept Allocations ─────────────────────────────────
  const deptData = useMemo(() => {
    const depts = {};
    filteredAssets.forEach(a => {
      if (a.department) {
        depts[a.department] = (depts[a.department] || 0) + 1;
      }
    });
    return Object.entries(depts).map(([name, value]) => ({ name, value }));
  }, [filteredAssets]);

  // ── Export Utility ─────────────────────────────────────────────
  const handleExport = (format) => {
    let data = [];
    let title = '';

    if (activeReport === 'lifecycle') {
      data = lifecycleData;
      title = 'Asset Lifecycle Report';
    } else if (activeReport === 'depreciation') {
      data = depreciationData.map(d => ({
        ...d,
        OriginalCost: `PHP ${d.OriginalCost.toFixed(2)}`,
        AccumulatedDep: `PHP ${d.AccumulatedDep.toFixed(2)}`,
        CurrentValue: `PHP ${d.CurrentValue.toFixed(2)}`
      }));
      title = 'Asset Depreciation Report';
    } else if (activeReport === 'department') {
      data = deptData;
      title = 'Department Allocation Report';
    } else {
      toast.error('Export not implemented for this report yet.');
      return;
    }

    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title.replace(/\s+/g, '_')}.csv`;
      link.click();
      toast.success('Exported to CSV');
    }
    
    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
      toast.success('Exported to Excel');
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(title, 14, 15);
      
      const headers = Object.keys(data[0]);
      const rows = data.map(obj => headers.map(h => obj[h]));
      
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        theme: 'striped', // light theme base
      });
      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
      toast.success('Exported to PDF');
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Reports</span>
          </div>
          <h1 className="page-title">Analytics & Reporting</h1>
          <p className="page-subtitle">Branch Filter Active: {activeBranch === 'all' ? 'All Locations' : activeBranch.toUpperCase()}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('csv')}>CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('excel')}>Excel</button>
          <button className="btn btn-primary btn-sm" onClick={() => handleExport('pdf')}><Download size={14}/> PDF</button>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '240px 1fr' }}>
        
        {/* Sidebar Nav */}
        <div className="card" style={{ padding: '16px 8px' }}>
          {REPORTS.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', border: 'none', background: activeReport === r.id ? 'var(--bg-sidebar-active)' : 'transparent',
                  color: activeReport === r.id ? 'var(--brand-primary)' : 'var(--text-primary)',
                  fontWeight: activeReport === r.id ? 600 : 500, fontSize: 13, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  textAlign: 'left'
                }}
                onClick={() => setActiveReport(r.id)}
              >
                <Icon size={16} /> {r.label}
              </button>
            )
          })}
        </div>

        {/* Content Pane */}
        <div className="card card-body" style={{ minHeight: 400 }}>
          <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', marginBottom: 24, color: 'var(--text-primary)' }}>
            {REPORTS.find(r => r.id === activeReport)?.label}
          </h2>

          {activeReport === 'lifecycle' && (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifecycleData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'var(--bg-sidebar-hover)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {lifecycleData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeReport === 'depreciation' && (
            <div className="table-container" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table className="data-table">
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)' }}>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Original Cost</th>
                    <th style={{ textAlign: 'right' }}>Acc. Dep.</th>
                    <th style={{ textAlign: 'right' }}>Current Value</th>
                  </tr>
                </thead>
                <tbody>
                  {depreciationData.map(d => (
                    <tr key={d.Tag}>
                      <td>{d.Tag}</td>
                      <td>{d.Name}</td>
                      <td>{d.Category}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₱{d.OriginalCost.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--status-danger)' }}>-₱{d.AccumulatedDep.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-primary)' }}>₱{d.CurrentValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReport === 'department' && (
            <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {deptData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {(activeReport === 'maintenance' || activeReport === 'software') && (
            <div className="empty-state">
              <div className="empty-state-icon"><BarChart2 size={24} /></div>
              <div className="empty-state-title">Report in Development</div>
              <div className="empty-state-text">This report is being finalized for Phase 4. Please use the other active reports.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
