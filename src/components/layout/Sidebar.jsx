import React from 'react';
import useStore, { PERMISSIONS } from '../../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, Wrench, MapPin,
  BarChart3, ShoppingCart, Settings, Bell, LogOut,
  ChevronLeft, ChevronRight, Boxes,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/',          section: 'main' },
  { label: 'Assets',       icon: Package,         path: '/assets',    section: 'main', badge: null },
  { label: 'Users',        icon: Users,           path: '/users',     section: 'main', permission: PERMISSIONS.CAN_MANAGE_USERS },
  { label: 'Maintenance',  icon: Wrench,          path: '/maintenance',section: 'main' },
  { label: 'Locations',    icon: MapPin,          path: '/locations', section: 'main' },
  { label: 'Reports',      icon: BarChart3,       path: '/reports',   section: 'main', permission: PERMISSIONS.CAN_VIEW_REPORTS },
  { label: 'Procurement',  icon: ShoppingCart,    path: '/procurement',section: 'main', permission: PERMISSIONS.CAN_APPROVE_PO },
];

const BOTTOM_ITEMS = [
  { label: 'Settings',     icon: Settings,        path: '/settings',  section: 'bottom', permission: PERMISSIONS.CAN_VIEW_SETTINGS },
  { label: 'Notifications',icon: Bell,            path: '/notifications', section: 'bottom', badgeKey: 'notification' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentUser, notificationCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const badgeCount = item.badgeKey === 'notification' ? notificationCount : item.badge;

    return (
      <div
        className={`nav-item ${active ? 'active' : ''}`}
        onClick={() => navigate(item.path)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate(item.path)}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        title={sidebarCollapsed ? item.label : undefined}
      >
        <span className="nav-item-icon">
          <Icon size={18} />
        </span>
        <span className="nav-item-label">{item.label}</span>
        {badgeCount > 0 && (
          <span className="nav-badge" aria-label={`${badgeCount} notifications`}>
            {badgeCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon" aria-hidden="true">
          <Boxes size={20} color="#fff" />
        </div>
        <span className="sidebar-brand-text">IT IMS</span>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {NAV_ITEMS.map(item => {
          if (item.permission && !useStore.getState().hasPermission(item.permission)) return null;
          return <NavItem key={item.path} item={item} />;
        })}

        <div className="divider" style={{ margin: '12px 8px' }} />
        <div className="sidebar-section-label">System</div>
        {BOTTOM_ITEMS.map(item => {
          if (item.permission && !useStore.getState().hasPermission(item.permission)) return null;
          return <NavItem key={item.path} item={item} />;
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-card" role="button" tabIndex={0} aria-label="User profile">
          <div className={`avatar avatar-sm`} aria-hidden="true"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}>
            {currentUser.initials}
          </div>
          <div className="user-info">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-role">{currentUser.role}</div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          className="btn btn-ghost btn-icon"
          style={{ width: '100%', marginTop: '8px', justifyContent: sidebarCollapsed ? 'center' : 'flex-end' }}
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={16} />
            : <><ChevronLeft size={16} /><span style={{ fontSize: 12, opacity: 0.7, marginLeft: 4 }}>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
