import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import {
  Plus, Search, Filter, LayoutGrid, List,
  Upload, Download, QrCode, ArrowUpDown,
  ChevronLeft, ChevronRight, Laptop, Server, Printer, Monitor, Boxes,
  UserCheck, Trash2, Archive, X,
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Laptop': Laptop, 'Desktop': Monitor, 'Server': Server,
  'Printer': Printer, 'default': Boxes,
};

function CategoryIcon({ category, size = 16 }) {
  const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  return <Icon size={size} />;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const STATUS_OPTIONS = ['All', 'ACTIVE', 'IN_REPAIR', 'IN_STORAGE', 'RETIRED'];

export default function AssetList() {
  const navigate = useNavigate();
  const { activeBranch, assets } = useStore();
  const [view, setView]           = useState('table');   // 'table' | 'grid'
  const [search, setSearch]       = useState('');
  const [filterStatus, setStatus] = useState('All');
  const [filterCategory, setCat]  = useState('All');
  const [sortKey, setSortKey]     = useState('tag');
  const [sortDir, setSortDir]     = useState('asc');
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [selected, setSelected]   = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter & sort
  const filtered = useMemo(() => {
    let data = assets;
    if (activeBranch !== 'all') data = data.filter(a => a.branch === activeBranch);
    if (filterStatus !== 'All')   data = data.filter(a => a.status === filterStatus);
    if (filterCategory !== 'All') data = data.filter(a => a.category === filterCategory);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.serial.toLowerCase().includes(q) ||
        (a.assignedTo?.name || '').toLowerCase().includes(q)
      );
    }
    data = [...data].sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0);
    });
    return data;
  }, [assets, activeBranch, filterStatus, filterCategory, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleSelectAll = () => {
    setSelected(s => s.length === paged.length ? [] : paged.map(a => a.id));
  };

  const SortIcon = ({ col }) => (
    <ArrowUpDown
      size={12}
      style={{ opacity: sortKey === col ? 1 : 0.3, marginLeft: 4, flexShrink: 0 }}
    />
  );

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Assets</span>
          </div>
          <h1 className="page-title">All Assets</h1>
          <p className="page-subtitle">{filtered.length} assets found</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" id="import-csv-btn" onClick={() => navigate('/assets/import')}>
            <Upload size={14} /> Import
          </button>
          <button className="btn btn-secondary btn-sm" id="export-csv-btn">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" id="add-asset-list-btn" onClick={() => navigate('/assets/new')}>
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              id="asset-search"
              className="form-input"
              style={{ paddingLeft: 34, width: 260 }}
              placeholder="Search assets, tags, serials…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search assets"
            />
          </div>

          {/* Status filter */}
          <select
            id="status-filter"
            className="form-input"
            style={{ width: 'auto', paddingRight: 32 }}
            value={filterStatus}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>

          {/* Category filter */}
          <select
            id="category-filter"
            className="form-input"
            style={{ width: 'auto', paddingRight: 32 }}
            value={filterCategory}
            onChange={e => { setCat(e.target.value); setPage(1); }}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="toolbar-right">
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: 2 }}>
            <button
              id="table-view-btn"
              className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', borderRadius: 6 }}
              onClick={() => setView('table')}
              aria-label="Table view" aria-pressed={view === 'table'}
            >
              <List size={15} />
            </button>
            <button
              id="grid-view-btn"
              className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', borderRadius: 6 }}
              onClick={() => setView('grid')}
              aria-label="Grid view" aria-pressed={view === 'grid'}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions — sticky slide-up bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: selected.length > 0 ? 'all' : 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-card)',
          border: '1px solid rgba(79,70,229,0.4)',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          padding: '12px 24px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.25)',
          transform: selected.length > 0 ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-primary)', paddingRight: 8, borderRight: '1px solid var(--border)' }}>
            {selected.length} selected
          </span>
          <button className="btn btn-ghost btn-sm" id="bulk-assign" onClick={() => toast('Assign flow coming soon')}>
            <UserCheck size={13} /> Assign
          </button>
          <button className="btn btn-ghost btn-sm" id="bulk-qr" onClick={() => toast('Printing QR labels…')}>
            <QrCode size={13} /> Print QR
          </button>
          <button className="btn btn-ghost btn-sm" id="bulk-export" onClick={() => toast.success(`Exporting ${selected.length} assets…`)}>
            <Download size={13} /> Export
          </button>
          <button className="btn btn-ghost btn-sm" id="bulk-archive" onClick={() => { toast.success(`Archived ${selected.length} assets`); setSelected([]); }}>
            <Archive size={13} /> Archive
          </button>
          <button className="btn btn-danger btn-sm" id="bulk-delete" onClick={() => { toast.error(`Deleted ${selected.length} assets`); setSelected([]); }}>
            <Trash2 size={13} /> Delete
          </button>
          <button className="btn btn-ghost btn-icon btn-sm" style={{ marginLeft: 8 }} onClick={() => setSelected([])} aria-label="Clear selection">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="table-container">
          <table className="data-table" aria-label="Asset inventory table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selected.length === paged.length && paged.length > 0}
                    onChange={toggleSelectAll}
                    aria-label="Select all assets on page"
                  />
                </th>
                <th onClick={() => toggleSort('tag')} style={{ cursor: 'pointer' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>Tag <SortIcon col="tag" /></span>
                </th>
                <th onClick={() => toggleSort('name')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>Asset Name <SortIcon col="name" /></span>
                </th>
                <th>Category</th>
                <th onClick={() => toggleSort('brand')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>Brand / Model <SortIcon col="brand" /></span>
                </th>
                <th>Location</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th onClick={() => toggleSort('warrantyExpiry')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>Warranty <SortIcon col="warrantyExpiry" /></span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={10}>
                  <div className="empty-state" style={{ padding: '40px 0' }}>
                    <div className="empty-state-icon"><Boxes size={28} /></div>
                    <div className="empty-state-title">No assets found</div>
                    <div className="empty-state-text">Try adjusting your search or filters.</div>
                  </div>
                </td></tr>
              )}
              {paged.map(asset => (
                <tr key={asset.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(asset.id)}
                      onChange={() => toggleSelect(asset.id)}
                      aria-label={`Select ${asset.name}`}
                    />
                  </td>
                  <td>
                    <span className="asset-tag">{asset.tag}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: 'rgba(79,70,229,0.1)', color: 'var(--brand-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <CategoryIcon category={asset.category} size={14} />
                      </div>
                      <span
                        style={{ fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}
                        onClick={() => navigate(`/assets/${asset.id}`)}
                      >
                        {asset.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{asset.category}</td>
                  <td style={{ fontSize: 13 }}>{asset.brand} · <span style={{ color: 'var(--text-muted)' }}>{asset.model}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {asset.location}
                    {asset.room && <span> · {asset.room}</span>}
                  </td>
                  <td>
                    {asset.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={asset.assignedTo.name} size="sm" />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{asset.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-disabled)' }}>Unassigned</span>
                    )}
                  </td>
                  <td><StatusBadge status={asset.status} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(asset.warrantyExpiry) < new Date()
                      ? <span style={{ color: 'var(--status-danger)' }}>Expired</span>
                      : asset.warrantyExpiry
                    }
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      id={`view-asset-${asset.id}`}
                      onClick={() => navigate(`/assets/${asset.id}`)}
                      aria-label={`View ${asset.name}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="grid-3" style={{ gap: 16 }}>
          {paged.map(asset => (
            <div
              key={asset.id}
              className="card card-body"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/assets/${asset.id}`)}
              role="button"
              tabIndex={0}
              aria-label={`View ${asset.name}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: 'rgba(79,70,229,0.1)', color: 'var(--brand-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CategoryIcon category={asset.category} size={20} />
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>{asset.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{asset.brand} · {asset.category}</div>
              <span className="asset-tag">{asset.tag}</span>
              {asset.assignedTo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <Avatar name={asset.assignedTo.name} size="sm" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.assignedTo.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 16, flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            Show
            <select
              className="form-input"
              style={{ width: 'auto', padding: '4px 8px' }}
              value={pageSize}
              onChange={e => { setPageSize(+e.target.value); setPage(1); }}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            of <strong>{filtered.length}</strong> assets
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className="btn btn-secondary btn-sm"
              id="prev-page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                id={`page-btn-${i+1}`}
                onClick={() => setPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              id="next-page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


