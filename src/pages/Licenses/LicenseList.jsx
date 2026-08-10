import React, { useState } from 'react';
import { mockLicenses } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import {
  Users, RefreshCw, Globe, AlertTriangle, CheckCircle,
  Monitor, Clock, Calendar, DollarSign, Key, FileText, Plus,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_MAP = {
  active:   { variant: 'active',  label: 'Active'   },
  expiring: { variant: 'warning', label: 'Expiring' },
  expired:  { variant: 'danger',  label: 'Expired'  },
  full:     { variant: 'info',    label: 'At Capacity' },
};

// ── Seat utilization bar ─────────────────────────────────────────
function SeatBar({ allocated, total, label }) {
  const pct  = total > 0 ? (allocated / total) * 100 : 0;
  const color = pct >= 100 ? 'var(--status-danger)'
    : pct >= 85 ? 'var(--status-warning)'
    : 'var(--status-active)';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>{label || 'Seat Usage'}</span>
        <span style={{ color, fontWeight: 600 }}>{allocated} / {total} seats ({Math.round(pct)}%)</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

// ── Per-Seat License Card ────────────────────────────────────────
function PerSeatCard({ lic }) {
  const status = STATUS_MAP[lic.status] || STATUS_MAP.active;
  const daysLeft = Math.ceil((new Date(lic.expiry) - new Date()) / (1000 * 60 * 60 * 24));
  const unallocated = lic.totalSeats - lic.allocatedSeats;

  return (
    <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            {lic.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lic.vendor}</div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <SeatBar allocated={lic.allocatedSeats} total={lic.totalSeats} />

      <div className="spec-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        <div className="spec-item">
          <div className="spec-label">Cost / Seat</div>
          <div className="spec-value" style={{ fontSize: 13 }}>₱{lic.costPerSeat.toLocaleString()}</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Annual Total</div>
          <div className="spec-value" style={{ fontSize: 13 }}>₱{lic.annualTotal.toLocaleString()}</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Unallocated</div>
          <div className="spec-value" style={{ fontSize: 13, color: unallocated === 0 ? 'var(--status-danger)' : 'var(--status-active)' }}>
            {unallocated} seat{unallocated !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} />
          Expires {lic.expiry}
          {daysLeft < 30 && daysLeft > 0 && (
            <span style={{ color: 'var(--status-warning)', fontWeight: 600, marginLeft: 4 }}>
              ({daysLeft}d left)
            </span>
          )}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }} id={`manage-seats-${lic.id}`}>
            Manage Seats
          </button>
          <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }} id={`renew-${lic.id}`}>
            Renew
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Concurrent License Card ──────────────────────────────────────
function ConcurrentCard({ lic }) {
  const status   = STATUS_MAP[lic.status] || STATUS_MAP.active;
  const usagePct = Math.round((lic.activeSessions / lic.maxConcurrent) * 100);
  const daysLeft = Math.ceil((new Date(lic.expiry) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            {lic.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lic.vendor}</div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Live session counter */}
      <div style={{
        background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: usagePct > 80
            ? 'rgba(239,68,68,0.1)' : 'rgba(79,70,229,0.1)',
          color: usagePct > 80 ? 'var(--status-danger)' : 'var(--brand-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, flexDirection: 'column', lineHeight: 1,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>{lic.activeSessions}</span>
          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>live</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{lic.activeSessions}</strong> active of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{lic.maxConcurrent}</strong> max concurrent sessions ({usagePct}%)
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${usagePct}%`,
              background: usagePct > 80 ? 'var(--status-danger)' : 'var(--brand-primary)',
              borderRadius: 'var(--radius-full)',
            }} />
          </div>
        </div>
      </div>

      {/* Active sessions table */}
      {lic.sessions.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Active Sessions
          </div>
          {lic.sessions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)', marginBottom: 4, fontSize: 12,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--status-active)',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>{s.user}</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{s.workstation}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.since}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        <span>Annual: ₱{lic.annualCost.toLocaleString()} · Expires {lic.expiry}
          {daysLeft < 30 && <span style={{ color: 'var(--status-warning)', marginLeft: 4, fontWeight: 600 }}>({daysLeft}d left)</span>}
        </span>
        <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }} id={`renew-concurrent-${lic.id}`}>Renew</button>
      </div>
    </div>
  );
}

// ── Site-Wide License Card ───────────────────────────────────────
function SiteWideCard({ lic }) {
  const status   = STATUS_MAP[lic.status] || STATUS_MAP.active;
  const daysLeft = Math.ceil((new Date(lic.renewalDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
            {lic.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lic.vendor}</div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)',
        borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13,
      }}>
        <Globe size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-secondary)' }}>{lic.coverage}</span>
      </div>

      <div className="spec-grid" style={{ gap: 10 }}>
        <div className="spec-item">
          <div className="spec-label">Annual Cost</div>
          <div className="spec-value" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            ₱{lic.annualCost.toLocaleString()}
          </div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Renewal Date</div>
          <div className="spec-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            {lic.renewalDate}
            {daysLeft < 90 && daysLeft > 0 && (
              <span style={{ color: 'var(--status-warning)', marginLeft: 6, fontFamily: 'var(--font-body)', fontSize: 12 }}>
                ({daysLeft}d)
              </span>
            )}
          </div>
        </div>
        <div className="spec-item">
          <div className="spec-label">PO Number</div>
          <div className="spec-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{lic.poNumber}</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Contract Doc</div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '2px 8px', marginTop: -2 }} id={`view-contract-${lic.id}`}>
            <FileText size={11} /> {lic.contractDoc}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }} id={`edit-sitelic-${lic.id}`}>Edit</button>
        <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }} id={`renew-sitelic-${lic.id}`}>Schedule Renewal</button>
      </div>
    </div>
  );
}

// ── Cost Chart ───────────────────────────────────────────────────
function CostChart() {
  const all = [
    ...mockLicenses.perSeat.map(l => ({ name: l.name.split(' ').slice(0,2).join(' '), cost: l.annualTotal, type: 'Per-Seat' })),
    ...mockLicenses.concurrent.map(l => ({ name: l.name.split(' ').slice(0,2).join(' '), cost: l.annualCost, type: 'Concurrent' })),
    ...mockLicenses.siteWide.map(l => ({ name: l.name.split(' ').slice(0,2).join(' '), cost: l.annualCost, type: 'Site-Wide' })),
  ].sort((a, b) => b.cost - a.cost);

  return (
    <div className="card card-body" style={{ marginBottom: 20 }}>
      <div className="section-header"><span className="section-title">Annual License Cost Breakdown</span></div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={all} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barSize={28}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
            tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={v => `₱${v.toLocaleString()}`}
            contentStyle={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, fontSize: 12, color: 'var(--text-primary)',
            }}
          />
          <Bar dataKey="cost" radius={[6,6,0,0]}>
            {all.map((e, i) => (
              <Cell key={i} fill={
                e.type === 'Per-Seat' ? '#4F46E5'
                : e.type === 'Concurrent' ? '#10B981'
                : '#F59E0B'
              } />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
        {[['Per-Seat','#4F46E5'],['Concurrent','#10B981'],['Site-Wide','#F59E0B']].map(([t,c]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function LicenseList() {
  const [activeTab, setTab] = useState('per-seat');

  const totalAnnual =
    mockLicenses.perSeat.reduce((s, l) => s + l.annualTotal, 0) +
    mockLicenses.concurrent.reduce((s, l) => s + l.annualCost, 0) +
    mockLicenses.siteWide.reduce((s, l) => s + l.annualCost, 0);

  const expiring = [
    ...mockLicenses.perSeat,
    ...mockLicenses.concurrent,
    ...mockLicenses.siteWide,
  ].filter(l => l.status === 'expiring').length;

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Software Licenses</span>
          </div>
          <h1 className="page-title">Software & License Management</h1>
          <p className="page-subtitle">Track all software licenses across Per-Seat, Concurrent, and Site-Wide types</p>
        </div>
        <button className="btn btn-primary btn-sm" id="add-license-btn">
          <Plus size={14} /> Add License
        </button>
      </div>

      {/* KPI */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Licenses',     value: mockLicenses.perSeat.length + mockLicenses.concurrent.length + mockLicenses.siteWide.length, color: 'blue', icon: Key },
          { label: 'Per-Seat Licenses',  value: mockLicenses.perSeat.length,     color: 'blue',  icon: Users },
          { label: 'Concurrent Licenses',value: mockLicenses.concurrent.length,  color: 'green', icon: RefreshCw },
          { label: 'Expiring Soon',      value: expiring,                         color: 'amber', icon: AlertTriangle },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`kpi-card ${kpi.color}`}>
              <div className={`kpi-icon-wrap ${kpi.color}`}><Icon size={20} /></div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Cost bar */}
      <CostChart />

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'per-seat',   icon: Users,      label: `Per-Seat / Dedicated (${mockLicenses.perSeat.length})` },
          { id: 'concurrent', icon: RefreshCw,  label: `Concurrent / Floating (${mockLicenses.concurrent.length})` },
          { id: 'site-wide',  icon: Globe,      label: `Site / Org-Wide (${mockLicenses.siteWide.length})` },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`license-tab-${tab.id}`}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Per-Seat */}
      {activeTab === 'per-seat' && (
        <div className="grid-2 animate-fade" style={{ gap: 16 }}>
          {mockLicenses.perSeat.map(lic => <PerSeatCard key={lic.id} lic={lic} />)}
        </div>
      )}

      {/* Concurrent */}
      {activeTab === 'concurrent' && (
        <div className="grid-2 animate-fade" style={{ gap: 16 }}>
          {mockLicenses.concurrent.map(lic => <ConcurrentCard key={lic.id} lic={lic} />)}
        </div>
      )}

      {/* Site-Wide */}
      {activeTab === 'site-wide' && (
        <div className="grid-2 animate-fade" style={{ gap: 16 }}>
          {mockLicenses.siteWide.map(lic => <SiteWideCard key={lic.id} lic={lic} />)}
        </div>
      )}
    </div>
  );
}
