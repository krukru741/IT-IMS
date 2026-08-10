import React from 'react';

/**
 * Status Badge
 * variant: 'active' | 'warning' | 'danger' | 'info' | 'neutral'
 */
export function Badge({ variant = 'neutral', children, dot = false }) {
  return (
    <span className={`badge ${variant}`} role="status">
      {dot && <span className={`status-dot ${variant}`} aria-hidden="true" />}
      {children}
    </span>
  );
}

/**
 * Status badge from asset status key
 */
export function StatusBadge({ status }) {
  const map = {
    ACTIVE:     { variant: 'active',  label: 'Active',      dot: true  },
    IN_REPAIR:  { variant: 'warning', label: 'In Repair',   dot: false },
    IN_STORAGE: { variant: 'neutral', label: 'In Storage',  dot: false },
    RETIRED:    { variant: 'danger',  label: 'Retired',     dot: false },
    DISPOSED:   { variant: 'neutral', label: 'Disposed',    dot: false },
  };
  const cfg = map[status] || map['ACTIVE'];
  return <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>;
}

export default Badge;
