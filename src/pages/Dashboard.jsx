import React from 'react';
import useStore, { BRANCHES } from '../store/useStore';
import KpiCard from '../components/ui/KpiCard';
import DonutChart from '../components/charts/DonutChart';
import ActivityFeed from '../components/charts/ActivityFeed';
import { mockKpiStats, assetStatusChartData, mockMaintenance } from '../data/mockData';
import {
  Package, UserCheck, AlertTriangle, Wrench,
  Plus, Upload, BarChart3, FileDown, Calendar,
} from 'lucide-react';

// ── Quick Action Button ────────────────────────────────────────
function QuickAction({ icon: Icon, label, onClick, color }) {
  return (
    <button className="quick-action-btn" onClick={onClick} id={`quick-action-${label.toLowerCase().replace(/\s+/g,'-')}`}>
      <div className="quick-action-icon" style={color ? { background: color } : {}}>
        <Icon size={16} />
      </div>
      <span>{label}</span>
    </button>
  );
}

// ── Upcoming Maintenance Card ──────────────────────────────────
function MaintenanceCard({ item }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px',
      background: 'var(--bg-input)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      marginBottom: 8,
    }}>
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
  const { activeBranch, getActiveBranchLabel } = useStore();
  const branchLabel = getActiveBranchLabel();

  const kpis = [
    {
      icon: Package,
      value: activeBranch === 'all' ? mockKpiStats.totalAssets : Math.round(mockKpiStats.totalAssets * 0.4),
      label: 'Total Assets',
      color: 'blue',
      trend: 'up',
      trendLabel: '+24 this month',
      sparkData: [1180, 1195, 1210, 1224, 1240, 1262, 1284],
      sparkColor: '#3B82F6',
    },
    {
      icon: UserCheck,
      value: activeBranch === 'all' ? mockKpiStats.activeAssignments : Math.round(mockKpiStats.activeAssignments * 0.4),
      label: 'Active Assignments',
      color: 'green',
      trend: 'up',
      trendLabel: '84% utilization',
      sparkData: [790, 805, 820, 831, 840, 843, 847],
      sparkColor: '#10B981',
    },
    {
      icon: AlertTriangle,
      value: mockKpiStats.expiringLicenses,
      label: 'Licenses Expiring (30d)',
      color: 'amber',
      trend: 'warn',
      trendLabel: '12 require action',
      sparkData: [5, 7, 8, 9, 10, 11, 12],
      sparkColor: '#F59E0B',
    },
    {
      icon: Wrench,
      value: activeBranch === 'all' ? mockKpiStats.underMaintenance : Math.round(mockKpiStats.underMaintenance * 0.4),
      label: 'Under Maintenance',
      color: 'red',
      trend: 'down',
      trendLabel: '3 overdue',
      sparkData: [30, 28, 26, 25, 24, 23, 23],
      sparkColor: '#EF4444',
    },
  ];

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
          <button className="btn btn-secondary btn-sm" id="export-dashboard">
            <FileDown size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" id="add-asset-btn">
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
            <DonutChart
              data={assetStatusChartData}
              title="Asset Status Breakdown"
              centerLabel="Assets"
            />
          </div>

          {/* Activity Feed */}
          <div className="card animate-fade-up stagger-3">
            <div className="card-header">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <span className="section-title">Recent Activity</span>
                <button className="btn btn-ghost btn-sm" id="view-all-activity">View All</button>
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
                <QuickAction icon={Plus}      label="Add New Asset"   color="linear-gradient(135deg,#4F46E5,#6366F1)" />
                <QuickAction icon={Upload}    label="Import from CSV" color="linear-gradient(135deg,#3B82F6,#60A5FA)" />
                <QuickAction icon={BarChart3} label="Generate Report" color="linear-gradient(135deg,#10B981,#34D399)" />
                <QuickAction icon={Wrench}    label="Log Maintenance" color="linear-gradient(135deg,#F59E0B,#FCD34D)" />
              </div>
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="card animate-fade-up stagger-2">
            <div className="card-header">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <span className="section-title">Upcoming Maintenance</span>
                <button className="btn btn-ghost btn-sm" id="view-all-maintenance">View All</button>
              </div>
            </div>
            <div className="card-body">
              {mockMaintenance.map(item => (
                <MaintenanceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* License Expiry Alert */}
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
                    12 Licenses Expiring Soon
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                    Adobe CC, Microsoft 365, and 10 others expire within 30 days.
                  </div>
                  <button className="btn btn-sm" id="view-licenses-btn" style={{
                    background: 'rgba(245,158,11,0.15)',
                    color: 'var(--status-warning)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 12,
                  }}>
                    View Licenses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
