import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AuditLogViewer() {
  const { auditLog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Multi-column filtering
  const filteredLogs = auditLog.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = filterAction === 'All' || log.action === filterAction;

    const logDate = new Date(log.timestamp);
    const matchesDateFrom = !dateFrom || logDate >= new Date(dateFrom);
    const matchesDateTo   = !dateTo   || logDate <= new Date(dateTo + 'T23:59:59');
    
    return matchesSearch && matchesAction && matchesDateFrom && matchesDateTo;
  });

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit_Log');
    XLSX.writeFile(workbook, `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Extract unique actions for the filter dropdown
  const uniqueActions = ['All', ...new Set(auditLog.map(l => l.action))];

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p className="page-subtitle">Track and review all system activities and changes.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="card table-container">
        {/* Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search actors, actions, or details..." 
              style={{ paddingLeft: 36 }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              className="form-input" 
              style={{ width: 'auto' }}
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
            >
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto' }}
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label="From date"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>to</span>
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto' }}
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label="To date"
            />
            {(dateFrom || dateTo) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Clear</button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ fontWeight: 500 }}>{log.actor}</td>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{log.role}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                    background: 'var(--border)', color: 'var(--text-primary)'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>{log.entity} <span style={{ opacity: 0.5, fontSize: 12 }}>({log.entityId})</span></td>
                <td style={{ fontSize: 13 }}>{log.details}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No audit logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
