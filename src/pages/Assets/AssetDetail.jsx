import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssets, mockAssignmentHistory, mockMaintenanceLog } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import {
  ArrowLeft, Edit, UserCheck, QrCode, AlertTriangle, MoreHorizontal,
  MapPin, Tag, Calendar, DollarSign, Cpu,
  Wrench, FileText, Info,
} from 'lucide-react';

const TABS = [
  { id: 'overview',    label: 'Overview',           icon: Info },
  { id: 'assignments', label: 'Assignment History', icon: UserCheck },
  { id: 'maintenance', label: 'Maintenance Log',    icon: Wrench },
  { id: 'documents',   label: 'Documents',          icon: FileText },
];

// ── Spec Grid Item ─────────────────────────────────────────────
function SpecItem({ label, value, mono }) {
  return (
    <div className="spec-item">
      <div className="spec-label">{label}</div>
      <div className="spec-value" style={mono ? { fontFamily: 'var(--font-mono)', fontSize: 13 } : {}}>
        {value || <span style={{ color: 'var(--text-disabled)' }}>—</span>}
      </div>
    </div>
  );
}

// ── Overview Tab ───────────────────────────────────────────────
function OverviewTab({ asset }) {
  const warrantyDays = Math.ceil(
    (new Date(asset.warrantyExpiry) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const warrantyPercent = Math.max(0, Math.min(100,
    (warrantyDays / (3 * 365)) * 100
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Specs */}
      <div className="card card-body">
        <div className="section-header">
          <span className="section-title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Cpu size={16} style={{ color: 'var(--brand-primary)' }} /> Technical Specifications
          </span>
        </div>
        <div className="spec-grid">
          {Object.entries(asset.specs).map(([k, v]) => (
            <SpecItem key={k} label={k} value={v} />
          ))}
        </div>
      </div>

      {/* Acquisition Info */}
      <div className="card card-body">
        <div className="section-header">
          <span className="section-title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <DollarSign size={16} style={{ color: 'var(--brand-primary)' }} /> Acquisition Details
          </span>
        </div>
        <div className="spec-grid">
          <SpecItem label="Purchase Date" value={asset.purchaseDate} />
          <SpecItem label="Vendor" value={asset.vendor} />
          <SpecItem label="Purchase Cost" value={`₱${asset.purchaseCost.toLocaleString()}`} />
          <SpecItem label="PO Number" value={asset.poNumber} mono />
          <SpecItem label="Department" value={asset.department} />
          <SpecItem label="Warranty Expiry" value={asset.warrantyExpiry} />
        </div>

        {/* Warranty Timeline */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>Warranty Status</span>
            <span style={{ color: warrantyDays > 0 ? 'var(--status-active)' : 'var(--status-danger)', fontWeight: 600 }}>
              {warrantyDays > 0 ? `${warrantyDays} days remaining` : 'Expired'}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${warrantyPercent}%`,
              background: warrantyDays > 180
                ? 'var(--status-active)'
                : warrantyDays > 30
                  ? 'var(--status-warning)'
                  : 'var(--status-danger)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card card-body">
        <div className="section-header">
          <span className="section-title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <MapPin size={16} style={{ color: 'var(--brand-primary)' }} /> Location
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[asset.location, asset.floor, asset.room].filter(Boolean).map((loc, i, arr) => (
            <React.Fragment key={loc}>
              <span style={{
                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                background: 'rgba(79,70,229,0.08)', color: 'var(--brand-primary)',
                fontSize: 13, fontWeight: 500,
              }}>{loc}</span>
              {i < arr.length - 1 && (
                <span style={{ color: 'var(--text-muted)' }}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Assignment History Tab ────────────────────────────────────
function AssignmentsTab() {
  return (
    <div className="card">
      <div className="table-container">
        <table className="data-table" aria-label="Assignment history table">
          <thead>
            <tr>
              <th>Assigned To</th>
              <th>From</th>
              <th>To</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {mockAssignmentHistory.map(h => (
              <tr key={h.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={h.user} size="sm" />
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{h.user}</span>
                    {!h.to && (
                      <span className="badge active" style={{ marginLeft: 4 }}>
                        <span className="status-dot active" />Current
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{h.from}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {h.to || <span style={{ color: 'var(--status-active)' }}>Present</span>}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{h.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Maintenance Log Tab ────────────────────────────────────────
function MaintenanceTab() {
  return (
    <div className="maintenance-timeline">
      {mockMaintenanceLog.map(log => (
        <div className="maintenance-entry" key={log.id}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'rgba(79,70,229,0.1)', color: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Wrench size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{log.type}</span>
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>by {log.tech}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge active">{log.status}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{log.date}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{log.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Documents Tab ─────────────────────────────────────────────
function DocumentsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Drop Zone */}
      <div style={{
        border: '2px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color var(--transition-fast)',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        role="button"
        tabIndex={0}
        aria-label="Upload documents"
      >
        <FileText size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>Click to upload</span>
          {' '}or drag & drop
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-disabled)', marginTop: 4 }}>
          PDF, JPG, PNG, DOCX up to 10MB
        </div>
      </div>
      <div className="empty-state" style={{ padding: '24px 0' }}>
        <div className="empty-state-title">No documents attached</div>
        <div className="empty-state-text">Upload invoices, warranties, or photos above.</div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const asset = mockAssets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <div className="empty-state-icon"><AlertTriangle size={28} /></div>
        <div className="empty-state-title">Asset not found</div>
        <div className="empty-state-text">The asset ID "{id}" does not exist.</div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/assets')}>
          Back to Assets
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      {/* Back */}
      <button
        className="btn btn-ghost btn-sm"
        id="back-to-assets"
        onClick={() => navigate('/assets')}
        style={{ marginBottom: 16 }}
        aria-label="Back to asset list"
      >
        <ArrowLeft size={14} /> Back to Assets
      </button>

      {/* Asset Header Card */}
      <div className="asset-detail-header animate-fade-up">
        <div className="asset-icon-large" aria-hidden="true">
          <Cpu size={32} />
        </div>

        <div className="asset-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 className="asset-detail-name">{asset.name}</h1>
            <StatusBadge status={asset.status} />
          </div>

          <div className="asset-meta">
            <div className="asset-meta-item">
              <Tag size={13} aria-hidden="true" />
              <span className="asset-serial">{asset.tag}</span>
            </div>
            <div className="asset-meta-item">
              <span className="asset-serial">{asset.serial}</span>
            </div>
            <div className="asset-meta-item">
              <MapPin size={13} aria-hidden="true" />
              <strong>{asset.location}</strong>
              {asset.room && <span>· {asset.room}</span>}
            </div>
            {asset.assignedTo && (
              <div className="asset-meta-item">
                <UserCheck size={13} aria-hidden="true" />
                <Avatar name={asset.assignedTo.name} size="sm" />
                <strong>{asset.assignedTo.name}</strong>
              </div>
            )}
            <div className="asset-meta-item">
              <Calendar size={13} aria-hidden="true" />
              <span>Updated {asset.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" id="edit-asset-btn" aria-label="Edit asset">
            <Edit size={14} /> Edit
          </button>
          <button className="btn btn-secondary btn-sm" id="assign-asset-btn" aria-label="Assign asset">
            <UserCheck size={14} /> Assign
          </button>
          <button className="btn btn-secondary btn-sm" id="print-qr-btn" aria-label="Print QR label">
            <QrCode size={14} /> Print QR
          </button>
          <button className="btn btn-danger btn-sm" id="report-issue-btn" aria-label="Report issue">
            <AlertTriangle size={14} /> Report Issue
          </button>
          <button className="btn btn-ghost btn-icon" id="more-actions-btn" aria-label="More actions">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" aria-label="Asset detail sections">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              <Icon size={14} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="animate-fade"
        key={activeTab}
      >
        {activeTab === 'overview'    && <OverviewTab asset={asset} />}
        {activeTab === 'assignments' && <AssignmentsTab />}
        {activeTab === 'maintenance' && <MaintenanceTab />}
        {activeTab === 'documents'   && <DocumentsTab />}
      </div>
    </div>
  );
}


