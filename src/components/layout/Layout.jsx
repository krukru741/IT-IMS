import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SyncManager from './SyncManager';
import RoleSwitcher from './RoleSwitcher';
import useStore from '../../store/useStore';
import { ScanLine } from 'lucide-react';

export default function Layout({ children }) {
  const { sidebarCollapsed, openQrScanner } = useStore();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar />
        <main className="page-content" id="main-content" role="main">
          {children}
        </main>
      </div>
      <SyncManager />
      <RoleSwitcher />

      {/* Mobile FAB — QR Scanner (visible only on mobile via CSS) */}
      <button
        className="fab-mobile"
        onClick={openQrScanner}
        aria-label="Scan QR code"
        title="Scan QR"
      >
        <ScanLine size={22} color="#fff" />
      </button>
    </div>
  );
}
