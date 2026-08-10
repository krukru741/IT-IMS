import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Plus, Search, Calendar, CheckCircle, AlertCircle, Wrench, MoreHorizontal, FileText } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'Scheduled':   { color: 'var(--status-neutral)',  icon: Calendar,    bg: 'var(--bg-input)' },
  'In Progress': { color: 'var(--brand-primary)',   icon: Wrench,      bg: 'rgba(79,70,229,0.1)' },
  'Completed':   { color: 'var(--status-active)',   icon: CheckCircle, bg: 'rgba(16,185,129,0.1)' },
  'Escalated':   { color: 'var(--status-danger)',   icon: AlertCircle, bg: 'rgba(239,68,68,0.1)' },
};

const PRIORITY_COLORS = {
  'Low':    'neutral',
  'Medium': 'warning',
  'High':   'danger',
};

export default function MaintenanceList() {
  const navigate = useNavigate();
  const { workOrders, updateWorkOrder, completeWorkOrder } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = workOrders.filter(wo => {
    if (filter !== 'All' && wo.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        wo.title.toLowerCase().includes(q) ||
        wo.assetName.toLowerCase().includes(q) ||
        wo.assignedTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (id, newStatus, assetName) => {
    if (newStatus === 'Completed') {
      // Simulate completing a work order and adding log notes
      const notes = window.prompt(`Enter resolution notes for ${assetName}:`, 'Resolved issue as requested.');
      if (notes !== null) {
        completeWorkOrder(id, notes);
        toast.success(`Work order completed. Added to ${assetName}'s history.`);
      }
    } else {
      updateWorkOrder(id, { status: newStatus });
      toast.success(`Work order updated to ${newStatus}`);
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Maintenance & Work Orders</span>
          </div>
          <h1 className="page-title">Work Orders</h1>
          <p className="page-subtitle">Manage maintenance requests, repairs, and inspections.</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={14} /> New Work Order
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              className="form-input"
              style={{ paddingLeft: 34, width: 240 }}
              placeholder="Search work orders…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-input"
            style={{ width: 'auto' }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title & Asset</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => {
                const Cfg = STATUS_CONFIG[wo.status];
                const Icon = Cfg.icon;
                return (
                  <tr key={wo.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {wo.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span
                          style={{ color: 'var(--brand-primary)', cursor: 'pointer' }}
                          onClick={() => navigate(`/assets/${wo.assetId}`)}
                        >
                          {wo.assetName}
                        </span>
                        <span>·</span>
                        <span>{wo.id}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={PRIORITY_COLORS[wo.priority]}>{wo.priority}</Badge>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: Cfg.bg, color: Cfg.color, fontSize: 12, fontWeight: 500 }}>
                        <Icon size={12} /> {wo.status}
                      </div>
                    </td>
                    <td>{wo.assignedTo}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{wo.dueDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-input"
                        style={{ padding: '2px 8px', fontSize: 12, width: 120, height: 28, display: 'inline-block' }}
                        value={wo.status}
                        onChange={(e) => handleStatusChange(wo.id, e.target.value, wo.assetName)}
                        disabled={wo.status === 'Completed'}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Escalated">Escalated</option>
                        <option value="Completed">Complete ✓</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No work orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
