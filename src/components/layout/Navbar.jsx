import React from 'react';
import useStore, { BRANCHES } from '../../store/useStore';
import { Search, Sun, Moon, Bell, MapPin, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const {
    theme, toggleTheme,
    activeBranch, setActiveBranch,
    notificationCount,
    syncStatus,
    currentUser,
  } = useStore();

  const SyncIcon = () => {
    if (syncStatus === 'synced')  return <Wifi size={16} style={{ color: 'var(--status-active)' }} />;
    if (syncStatus === 'pending') return <RefreshCw size={16} style={{ color: 'var(--status-warning)', animation: 'spin 1s linear infinite' }} />;
    return <WifiOff size={16} style={{ color: 'var(--status-danger)' }} />;
  };

  const syncLabel = { synced: 'Synced', pending: 'Syncing…', error: 'Sync Failed' }[syncStatus];

  return (
    <header className="navbar" role="banner">
      {/* ── Left ─────────────────────────────────────────────── */}
      <div className="navbar-left">
        {/* Branch Selector */}
        <div className="branch-selector" aria-label="Branch selector">
          <MapPin size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
          <select
            id="branch-select"
            value={activeBranch}
            onChange={e => setActiveBranch(e.target.value)}
            aria-label="Select branch or location"
          >
            {BRANCHES.map(b => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Global Search */}
        <div className="navbar-search">
          <Search className="search-icon" size={15} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search assets, users, tags…"
            id="global-search"
            aria-label="Global search"
          />
        </div>
      </div>

      {/* ── Right ────────────────────────────────────────────── */}
      <div className="navbar-right">
        {/* Sync Status */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          title={syncLabel}
          aria-label={`Sync status: ${syncLabel}`}
        >
          <SyncIcon />
          <span style={{ color: 'var(--text-muted)' }}>{syncLabel}</span>
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark'
            ? <Sun size={16} />
            : <Moon size={16} />
          }
        </button>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="btn btn-ghost btn-icon notif-btn"
          aria-label={`Notifications — ${notificationCount} unread`}
          title="Notifications"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="notif-dot" aria-hidden="true" />
          )}
        </button>

        {/* User Avatar */}
        <div
          className="avatar avatar-sm"
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          aria-label={`User menu — ${currentUser.name}`}
          title={currentUser.name}
        >
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}
