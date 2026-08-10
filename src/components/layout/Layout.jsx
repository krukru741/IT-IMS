import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SyncManager from './SyncManager';
import useStore from '../../store/useStore';

export default function Layout({ children }) {
  const { sidebarCollapsed } = useStore();

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
    </div>
  );
}
