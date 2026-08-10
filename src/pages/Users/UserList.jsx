import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockData';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import useStore from '../../store/useStore';
import { Search, Plus, Filter, Users, Package, Mail, Building } from 'lucide-react';

const ROLE_COLORS = {
  'Super Admin':            'info',
  'IT Admin / Technician':  'active',
  'Auditor / Inv. Clerk':   'neutral',
  'Dept. Manager':          'warning',
  'Finance / Procurement':  'neutral',
  'Standard Employee':      'neutral',
};

// ── Assignment Matrix ──────────────────────────────────────────
const ASSET_CATEGORIES = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Other'];

function AssignmentMatrix({ users, assets }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" aria-label="User-asset assignment matrix">
        <thead>
          <tr>
            <th style={{ minWidth: 160 }}>User</th>
            {ASSET_CATEGORIES.map(c => <th key={c} style={{ textAlign: 'center' }}>{c}</th>)}
            <th style={{ textAlign: 'center' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.status === 'active').map(u => {
            const userAssets = assets.filter(a => a.assignedTo?.id === u.id);
            const counts = ASSET_CATEGORIES.reduce((acc, cat) => {
              acc[cat] = userAssets.filter(a => a.category === cat || (cat === 'Other' && !ASSET_CATEGORIES.slice(0,-1).includes(a.category))).length;
              return acc;
            }, {});
            const total = userAssets.length;

            return (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.department}</div>
                    </div>
                  </div>
                </td>
                {ASSET_CATEGORIES.map(cat => (
                  <td key={cat} style={{ textAlign: 'center' }}>
                    {counts[cat] > 0
                      ? <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 24, height: 24, borderRadius: '50%',
                          background: 'rgba(79,70,229,0.12)', color: 'var(--brand-primary)',
                          fontSize: 12, fontWeight: 700,
                        }}>{counts[cat]}</span>
                      : <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>—</span>
                    }
                  </td>
                ))}
                <td style={{ textAlign: 'center' }}>
                  {total > 0
                    ? <span className="badge info">{total}</span>
                    : <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>0</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function UserList() {
  const navigate = useNavigate();
  const { assets } = useStore();
  const [search, setSearch]   = useState('');
  const [roleFilter, setRole] = useState('All');
  const [activeTab, setTab]   = useState('directory'); // 'directory' | 'matrix'

  const roles = ['All', ...new Set(mockUsers.map(u => u.role))];

  const filtered = useMemo(() => {
    let data = mockUsers;
    if (roleFilter !== 'All') data = data.filter(u => u.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return data;
  }, [search, roleFilter]);

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Users</span>
          </div>
          <h1 className="page-title">Users & Assignments</h1>
          <p className="page-subtitle">{mockUsers.length} users · {mockUsers.filter(u => u.status === 'active').length} active</p>
        </div>
        <button className="btn btn-primary btn-sm" id="invite-user-btn">
          <Plus size={14} /> Invite User
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          id="tab-directory"
          className={`tab-item ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setTab('directory')}
        >
          <Users size={14} /> Directory
        </button>
        <button
          id="tab-matrix"
          className={`tab-item ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setTab('matrix')}
        >
          <Package size={14} /> Assignment Matrix
        </button>
      </div>

      {activeTab === 'directory' && (
        <>
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  id="user-search"
                  className="form-input"
                  style={{ paddingLeft: 34, width: 240 }}
                  placeholder="Search users…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                id="role-filter"
                className="form-input"
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={e => setRole(e.target.value)}
              >
                {roles.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>)}
              </select>
            </div>
          </div>

          {/* User Grid */}
          <div className="grid-3" style={{ gap: 16 }}>
            {filtered.map(user => {
              const assigned = assets.filter(a => a.assignedTo?.id === user.id);
              return (
                <div
                  key={user.id}
                  className="card card-body"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/users/${user.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${user.name}`}
                  id={`user-card-${user.id}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Avatar name={user.name} size="lg" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{user.name}</div>
                      <Badge variant={ROLE_COLORS[user.role] || 'neutral'} style={{ marginTop: 4 }}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="divider" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Mail size={12} /> {user.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Building size={12} /> {user.department}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Package size={12} />
                      <span style={{ color: assigned.length ? 'var(--text-primary)' : 'var(--text-disabled)' }}>
                        {assigned.length} asset{assigned.length !== 1 ? 's' : ''} assigned
                      </span>
                    </div>
                  </div>
                  {user.status === 'inactive' && (
                    <Badge variant="danger" style={{ marginTop: 10 }}>Inactive</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'matrix' && (
        <div className="card">
          <div className="card-header">
            <span className="section-title">Asset Assignment Matrix</span>
          </div>
          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <AssignmentMatrix users={mockUsers} assets={assets} />
          </div>
        </div>
      )}
    </div>
  );
}
