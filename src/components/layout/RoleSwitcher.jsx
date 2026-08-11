import React, { useState } from 'react';
import useStore, { ROLES } from '../../store/useStore';
import { ShieldAlert, ChevronUp, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const { currentUser, setCurrentUser } = useStore();
  const [open, setOpen] = useState(false);

  const rolesList = Object.values(ROLES);

  const handleRoleChange = (role) => {
    setCurrentUser({
      ...currentUser,
      role,
      name: role === ROLES.SUPER_ADMIN ? 'Alex Reyes' : `Test ${role}`,
    });
    setOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      zIndex: 9999,
      fontFamily: 'var(--font-body)',
    }}>
      {open && (
        <div className="card fade-in" style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: 12,
          width: 240,
          padding: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Switch Role (Testing)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {rolesList.map(r => (
              <button
                key={r}
                className={`btn btn-sm ${currentUser.role === r ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => handleRoleChange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className="btn btn-secondary"
        style={{ 
          borderRadius: 999, 
          padding: '8px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--brand-primary)',
        }}
        onClick={() => setOpen(!open)}
      >
        <ShieldAlert size={16} style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Role: {currentUser.role}</span>
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
}
