import React, { useState } from 'react';
import { mockLocations } from '../../data/mockData';
import toast from 'react-hot-toast';
import { Building2, MapPin, ChevronRight, ChevronDown, Plus, Edit, Trash2, Layers, Home, GitBranch, DoorOpen } from 'lucide-react';

const TYPE_CONFIG = {
  organization: { icon: Home,      color: '#4F46E5', label: 'Organization' },
  branch:       { icon: GitBranch, color: '#3B82F6', label: 'Branch'       },
  building:     { icon: Building2, color: '#10B981', label: 'Building'     },
  floor:        { icon: Layers,    color: '#F59E0B', label: 'Floor'        },
  room:         { icon: DoorOpen,  color: '#8B5CF6', label: 'Room'        },
};

// ── Recursive Tree Node ──────────────────────────────────────────
function TreeNode({ node, depth = 0, onDragStart, onDrop }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [editing,  setEditing]  = useState(false);
  const [name,     setName]     = useState(node.name);
  const [isDragOver, setDragOver] = useState(false);

  const cfg     = TYPE_CONFIG[node.type] || TYPE_CONFIG.room;
  const Icon    = cfg.icon;
  const hasKids = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="tree-node"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('nodeId', node.id);
          e.dataTransfer.setData('nodeLabel', name);
          e.currentTarget.style.opacity = '0.5';
          if (onDragStart) onDragStart(node.id);
        }}
        onDragEnd={(e) => { e.currentTarget.style.opacity = '1'; }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          const draggedId = e.dataTransfer.getData('nodeId');
          if (draggedId && draggedId !== node.id && onDrop) {
            onDrop(draggedId, node.id);
          }
        }}
        style={{
          paddingLeft: depth * 20 + 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: `8px 12px 8px ${depth * 20 + 12}px`,
          borderRadius: 'var(--radius-md)',
          cursor: 'grab',
          transition: 'background-color var(--transition-fast), box-shadow 0.15s',
          userSelect: 'none',
          background: isDragOver ? 'rgba(79,70,229,0.12)' : 'transparent',
          boxShadow: isDragOver ? 'inset 0 0 0 2px rgba(79,70,229,0.5)' : 'none',
        }}
        onClick={() => hasKids && setExpanded(s => !s)}
        role={hasKids ? 'button' : undefined}
        aria-expanded={hasKids ? expanded : undefined}
        id={`tree-node-${node.id}`}
      >
        {/* Expand icon */}
        <span style={{ width: 16, flexShrink: 0, color: 'var(--text-muted)' }}>
          {hasKids
            ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)
            : null
          }
        </span>

        {/* Type icon */}
        <div style={{
          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
          background: `${cfg.color}18`, color: cfg.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} />
        </div>

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={e => e.key === 'Enter' && setEditing(false)}
              autoFocus
              style={{ height: 28, padding: '2px 8px', fontSize: 13 }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span style={{ fontSize: 13, fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 500, color: 'var(--text-primary)' }}>
              {name}
            </span>
          )}
          <span style={{
            marginLeft: 8, fontSize: 11,
            color: cfg.color, background: `${cfg.color}18`,
            padding: '1px 6px', borderRadius: 999, fontWeight: 500,
          }}>
            {cfg.label}
          </span>
        </div>

        {/* Asset count */}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 12, flexShrink: 0 }}>
          {node.assetCount?.toLocaleString()} assets
        </span>

        {/* Actions */}
        <div
          className="tree-node-actions"
          style={{ display: 'flex', gap: 4, flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', fontSize: 11 }}
            onClick={() => setEditing(true)}
            id={`edit-node-${node.id}`}
            aria-label={`Edit ${name}`}
          >
            <Edit size={11} />
          </button>
          {hasKids && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 8px', fontSize: 11 }}
              id={`add-child-${node.id}`}
              aria-label={`Add child to ${name}`}
            >
              <Plus size={11} />
            </button>
          )}
          {depth > 1 && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 8px', fontSize: 11, color: 'var(--status-danger)' }}
              id={`delete-node-${node.id}`}
              aria-label={`Delete ${name}`}
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasKids && expanded && (
        <div style={{ borderLeft: `1px dashed var(--border)`, marginLeft: depth * 20 + 22 }}>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onDragStart={onDragStart} onDrop={onDrop} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationManager() {
  const [search, setSearch] = useState('');
  const [dragInfo, setDragInfo] = useState(null);

  const handleDrop = (draggedId, targetId) => {
    toast.success(`Moved node under new parent`, { icon: '📦' });
  };

  // Summary stats
  const countByType = (nodes, type, count = 0) => {
    for (const n of nodes) {
      if (n.type === type) count++;
      if (n.children) count = countByType(n.children, type, count);
    }
    return count;
  };

  const stats = [
    { label: 'Branches',  value: countByType(mockLocations, 'branch'),   color: '#3B82F6' },
    { label: 'Buildings', value: countByType(mockLocations, 'building'),  color: '#10B981' },
    { label: 'Floors',    value: countByType(mockLocations, 'floor'),     color: '#F59E0B' },
    { label: 'Rooms',     value: countByType(mockLocations, 'room'),      color: '#8B5CF6' },
  ];

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Locations</span>
          </div>
          <h1 className="page-title">Location Manager</h1>
          <p className="page-subtitle">4-level hierarchy: Organization → Branch → Building/Floor → Room</p>
        </div>
        <button className="btn btn-primary btn-sm" id="add-branch-btn">
          <Plus size={14} /> Add Branch
        </button>
      </div>

      {/* Summary cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="card card-body" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
              color: s.color, lineHeight: 1,
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tree Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                background: `${cfg.color}18`, color: cfg.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={11} />
              </div>
              {cfg.label}
            </div>
          );
        })}
      </div>

      {/* Tree View */}
      <div className="card">
        <div className="card-header">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <span className="section-title">Location Hierarchy</span>
            <div style={{ position: 'relative' }}>
              <input
                id="location-search"
                className="form-input"
                style={{ paddingLeft: 32, width: 200, fontSize: 13 }}
                placeholder="Search locations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 0' }}>
          {mockLocations.map(node => (
            <TreeNode key={node.id} node={node} depth={0} onDragStart={id => setDragInfo(id)} onDrop={handleDrop} />
          ))}
        </div>
      </div>
    </div>
  );
}
