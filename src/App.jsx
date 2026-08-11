import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/Assets/AssetList';
import AssetDetail from './pages/Assets/AssetDetail';
import AssetForm from './pages/Assets/AssetForm';
import ImportWizard from './pages/Assets/ImportWizard';
import UserList from './pages/Users/UserList';
import LocationManager from './pages/Locations/LocationManager';
import LicenseList from './pages/Licenses/LicenseList';
import MaintenanceList from './pages/Maintenance/MaintenanceList';
import ReportDashboard from './pages/Reports/ReportDashboard';
import ProcurementQueue from './pages/Procurement/ProcurementQueue';
import AuditLogViewer from './pages/Settings/AuditLogViewer';
import Notifications from './pages/Settings/Notifications';
import SyncManager from './components/layout/SyncManager';

// Placeholder for Phase 3+ modules
const Placeholder = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
    <div style={{ fontSize: 48 }}>🚧</div>
    <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 22 }}>{title}</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>This module is coming in Phase 3.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Phase 1 — Core ── */}
        <Route path="/"            element={<Layout><Dashboard /></Layout>} />
        <Route path="/assets"      element={<Layout><AssetList /></Layout>} />
        <Route path="/assets/new"  element={<Layout><AssetForm /></Layout>} />
        <Route path="/assets/import" element={<Layout><ImportWizard /></Layout>} />
        <Route path="/assets/:id"  element={<Layout><AssetDetail /></Layout>} />
        <Route path="/assets/:id/edit" element={<Layout><AssetForm /></Layout>} />

        {/* Phase 2 ── */}
        <Route path="/users"       element={<Layout><UserList /></Layout>} />
        <Route path="/locations"   element={<Layout><LocationManager /></Layout>} />
        <Route path="/licenses"    element={<Layout><LicenseList /></Layout>} />

        {/* Phase 3 ── */}
        <Route path="/maintenance" element={<Layout><MaintenanceList /></Layout>} />
        <Route path="/reports"     element={<Layout><ReportDashboard /></Layout>} />
        <Route path="/procurement" element={<Layout><ProcurementQueue /></Layout>} />
        <Route path="/settings"    element={<Layout><AuditLogViewer /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
