import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import useStore, { BRANCHES } from '../store/useStore';
import KpiCard from '../components/ui/KpiCard';
import DonutChart from '../components/charts/DonutChart';
import ActivityFeed from '../components/charts/ActivityFeed';
import { mockLicenses } from '../data/mockData';
import {
  Package, UserCheck, AlertTriangle, Wrench,
  Plus, Upload, BarChart3, FileDown, Calendar, Boxes,
} from 'lucide-react';

const STATUS_COLORS = {
  ACTIVE: { label: 'Active', color: '#10B981' },
  IN_STORAGE: { label: 'In Storage', color: '#64748B' },
  IN_REPAIR: { label: 'In Repair', color: '#F59E0B' },
  RETIRED: { label: 'Retired', color: '#EF4444' },
  DISPOSED: { label: 'Disposed', color: '#475569' },
};

// ── Quick Action Button ────────────────────────────────────────
function QuickAction({ icon: Icon, label, onClick, color }) {
  return (
    <button
      className="quick-action-btn"
      onClick={onClick}
      id={`quick-action-${label.toLowerCase().replace(/\s+/g, '-')}`}
      aria-label={label}
    >
      <div className="quick-action-icon" style={color ? { background: color } : {}}>
        <Icon size={16} />
      </div>
      <span>{label}</span>
    </button>
  );
}

// ── Upcoming Maintenance Card ──────────────────────────────────
function MaintenanceCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => onClick && e.key === 'Enter' && onClick()}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px',
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        marginBottom: 8,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--transition-fast)',
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-md)',
        background: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Wrench size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.asset}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {item.type} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <Calendar size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { assets, workOrders, activeBranch, getActiveBranchLabel } = useStore();
  const branchLabel = getActiveBranchLabel();

  // ── Live-scoped asset list (actually respects activeBranch now) ──
  const filteredAssets = useMemo(() => {
    return activeBranch === 'all' ? assets : assets.filter(a => a.branch === activeBranch);
  }, [assets, activeBranch]);

  const activeAssignments = useMemo(
    () => filteredAssets.filter(a => a.assignedTo).length,
    [filteredAssets]
  );

  const underMaintenance = useMemo(
    () => workOrders.filter(w => w.status !== 'Completed').length,
    [workOrders]
  );

  const expiringLicenses = useMemo(() => {
    const all = [...mockLicenses.perSeat, ...mockLicenses.concurrent, ...mockLicenses.siteWide];
    return all.filter(l => l.status === 'expiring');
  }, []);

  // ── Donut chart now derives from real, branch-scoped asset data ──
  const statusChartData = useMemo(() => {
    const counts = { ACTIVE: 0, IN_STORAGE: 0, IN_REPAIR: 0, RETIRED: 0, DISPOSED: 0 };
    filteredAssets.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_COLORS[key].label,
      value,
      color: STATUS_COLORS[key].color,
    }));
  }, [filteredAssets]);

  // ── Upcoming maintenance, sorted, matched to real assets ─────────
  const upcomingMaintenance = useMemo(() => {
    return [...workOrders]
      .filter(w => w.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map(w => ({
        id: w.id, asset: w.assetName, type: w.title,
        date: w.dueDate, assetId: w.assetId,
      }));
  }, [workOrders]);

  const kpis = [
    {
      icon: Package,
      value: filteredAssets.length,
      label: 'Total Assets',
      color: 'blue',
      trend: 'up',
      trendLabel: `${filteredAssets.length} in ${branchLabel}`,
      sparkData: [1180, 1195, 1210, 1224, 1240, 1262, filteredAssets.length || 1284],
      sparkColor: '#3B82F6',
    },
    {
      icon: UserCheck,
      value: activeAssignments,
      label: 'Active Assignments',
      color: 'green',
      trend: 'up',
      trendLabel: filteredAssets.length
        ? `${Math.round((activeAssignments / filteredAssets.length) * 100)}% utilization`
        : 'No assets yet',
      sparkData: [790, 805, 820, 831, 840, 843, activeAssignments || 847],
      sparkColor: '#10B981',
    },
    {
      icon: AlertTriangle,
      value: expiringLicenses.length,
      label: 'Licenses Expiring (30d)',
      color: 'amber',
      trend: expiringLicenses.length > 0 ? 'warn' : undefined,
      trendLabel: expiringLicenses.length > 0 ? `${expiringLicenses.length} require action` : 'All clear',
      sparkData: [5, 7, 8, 9, 10, 11, expiringLicenses.length || 1],
      sparkColor: '#F59E0B',
    },
    {
      icon: Wrench,
      value: underMaintenance,
      label: 'Under Maintenance',
      color: 'red',
      trend: underMaintenance > 0 ? 'down' : undefined,
      trendLabel: `${workOrders.filter(w => w.status === 'Escalated').length} escalated`,
      sparkData: [30, 28, 26, 25, 24, 23, underMaintenance || 1],
      sparkColor: '#EF4444',
    },
  ];

  // ── Handlers ──────────────────────────────────────────────────
  const handleExport = () => {
    if (filteredAssets.length === 0) {
      toast.error('No assets to export for this branch.');
      return;
    }
    const csv = Papa.unparse(filteredAssets.map(a => ({
      Tag: a.tag, Name: a.name, Category: a.category, Status: a.status,
      Location: a.location, AssignedTo: a.assignedTo?.name || 'Unassigned',
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `assets_${activeBranch}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Dashboard export ready');
  };

  const goToAssetForMaintenance = (item) => {
    if (item.assetId) navigate(`/assets/${item.assetId}`);
    else toast('Asset not found for this work order.');
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Dashboard</span>
          </div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview for <strong style={{ color: 'var(--brand-primary)' }}>{branchLabel}</strong>
            &nbsp;— {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" id="export-dashboard" onClick={handleExport}>
            <FileDown size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" id="add-asset-btn" onClick={() => navigate('/assets/new')}>
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Asset Status Chart */}
          <div className="card card-body animate-fade-up stagger-2">
            {filteredAssets.length > 0 ? (
              <DonutChart
                data={statusChartData}
                title="Asset Status Breakdown"
                centerLabel="Assets"
              />
            ) : (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div className="empty-state-icon"><Boxes size={24} /></div>
                <div className="empty-state-title">No assets in {branchLabel}</div>
                <div className="empty-state-text">Add or import assets to see the breakdown here.</div>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="card animate-fade-up stagger-3">
            <div className="card-header">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <span className="section-title">Recent Activity</span>
                <button className="btn btn-ghost btn-sm" id="view-all-activity" onClick={() => navigate('/notifications')}>
                  View All
                </button>
              </div>
            </div>
            <div className="card-body">
              <ActivityFeed limit={6} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick Actions */}
          <div className="card animate-fade-up stagger-1">
            <div className="card-header">
              <span className="section-title">Quick Actions</span>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <QuickAction icon={Plus} label="Add New Asset" color="linear-gradient(135deg,#4F46E5,#6366F1)" onClick={() => navigate('/assets/new')} />
                <QuickAction icon={Upload} label="Import from CSV" color="linear-gradient(135deg,#3B82F6,#60A5FA)" onClick={() => navigate('/assets/import')} />
                <QuickAction icon={BarChart3} label="Generate Report" color="linear-gradient(135deg,#10B981,#34D399)" onClick={() => navigate('/reports')} />
                <QuickAction icon={Wrench} label="Log Maintenance" color="linear-gradient(135deg,#F59E0B,#FCD34D)" onClick={() => navigate('/maintenance')} />
              </div>
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="card animate-fade-up stagger-2">
            <div className="card-header">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <span className="section-title">Upcoming Maintenance</span>
                <button className="btn btn-ghost btn-sm" id="view-all-maintenance" onClick={() => navigate('/maintenance')}>
                  View All
                </button>
              </div>
            </div>
            <div className="card-body">
              {upcomingMaintenance.length > 0 ? (
                upcomingMaintenance.map(item => (
                  <MaintenanceCard key={item.id} item={item} onClick={() => goToAssetForMaintenance(item)} />
                ))
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                  No maintenance scheduled.
                </p>
              )}
            </div>
          </div>

          {/* License Expiry Alert */}
          {expiringLicenses.length > 0 && (
            <div className="card animate-fade-up stagger-3" style={{
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.04)',
            }}>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'rgba(245,158,11,0.15)', color: 'var(--status-warning)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--status-warning)', fontSize: 14, marginBottom: 4 }}>
                      {expiringLicenses.length} License{expiringLicenses.length !== 1 ? 's' : ''} Expiring Soon
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                      {expiringLicenses.slice(0, 2).map(l => l.name).join(', ')}
                      {expiringLicenses.length > 2 && ` and ${expiringLicenses.length - 2} other${expiringLicenses.length - 2 !== 1 ? 's' : ''}`}
                      {' '}expire within 30 days.
                    </div>
                    <button
                      className="btn btn-sm" id="view-licenses-btn"
                      onClick={() => navigate('/licenses')}
                      style={{
                        background: 'rgba(245,158,11,0.15)',
                        color: 'var(--status-warning)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 12,
                      }}
                    >
                      View Licenses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}