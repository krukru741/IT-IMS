import React from 'react';
import useStore, { PERMISSIONS } from '../../store/useStore';
import { ShoppingCart, CheckCircle, Clock, PackagePlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProcurementQueue() {
  const { requisitions, updateRequisition, hasPermission, setDraftAsset } = useStore();
  const navigate = useNavigate();

  const canApprove = hasPermission(PERMISSIONS.CAN_APPROVE_PO);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Submitted': return <Clock size={14} style={{ color: 'var(--accent-amber)' }} />;
      case 'Dept Approved': return <CheckCircle size={14} style={{ color: 'var(--accent-blue)' }} />;
      case 'PO Created': return <ShoppingCart size={14} style={{ color: 'var(--brand-primary)' }} />;
      case 'Fulfilled': return <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getStatusBadge = (status) => {
    let bg = 'var(--border)';
    let color = 'var(--text-primary)';
    
    if (status === 'Submitted') { bg = 'rgba(245,158,11,0.1)'; color = 'var(--accent-amber)'; }
    if (status === 'Dept Approved') { bg = 'rgba(59,130,246,0.1)'; color = 'var(--accent-blue)'; }
    if (status === 'PO Created') { bg = 'rgba(79,70,229,0.1)'; color = 'var(--brand-primary)'; }
    if (status === 'Fulfilled') { bg = 'rgba(16,185,129,0.1)'; color = 'var(--accent-green)'; }

    return (
      <span style={{ 
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: bg, color, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500
      }}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const advanceStatus = (req) => {
    if (!canApprove) {
      toast.error('You do not have permission to approve purchase orders.');
      return;
    }

    let nextStatus = '';
    let poNumber = req.poNumber;
    
    if (req.status === 'Submitted') nextStatus = 'Dept Approved';
    else if (req.status === 'Dept Approved') {
      nextStatus = 'PO Created';
      poNumber = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
    }
    else if (req.status === 'PO Created') nextStatus = 'Fulfilled';

    if (nextStatus) {
      updateRequisition(req.id, { status: nextStatus, poNumber });
      toast.success(`Request advanced to ${nextStatus}`);
    }
  };

  const convertToAsset = (req) => {
    // Pre-populate Add Asset Wizard
    setDraftAsset({
      name: req.item,
      purchaseDate: new Date().toISOString().split('T')[0],
      vendor: req.vendor,
      cost: req.estimatedCost,
      poNumber: req.poNumber,
    });
    navigate('/assets/new');
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Procurement & Requests</h1>
          <p className="page-subtitle">Manage purchase orders and employee asset requests.</p>
        </div>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item / Request</th>
              <th>Department</th>
              <th>Requested By</th>
              <th>Est. Cost</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map(req => (
              <tr key={req.id}>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{req.poNumber || req.id}</td>
                <td style={{ fontWeight: 500 }}>{req.item}</td>
                <td>{req.department}</td>
                <td>{req.requestedBy}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>${req.estimatedCost.toFixed(2)}</td>
                <td>{req.vendor}</td>
                <td>{getStatusBadge(req.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {req.status !== 'Fulfilled' && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => advanceStatus(req)}
                        disabled={!canApprove}
                        style={{ opacity: canApprove ? 1 : 0.5 }}
                      >
                        Advance Status
                      </button>
                    )}
                    {req.status === 'Fulfilled' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => convertToAsset(req)}
                        title="Convert to Asset"
                      >
                        <PackagePlus size={14} /> Add Asset
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {requisitions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
