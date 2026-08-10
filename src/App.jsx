import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/Assets/AssetList';
import AssetDetail from './pages/Assets/AssetDetail';

// ── Placeholder pages for Phase 2+ ───────────────────────────
const Placeholder = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
    <div style={{ fontSize: 48 }}>🚧</div>
    <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 22 }}>{title}</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>This module is coming in Phase 2.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
          },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* App (with layout shell) */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assets" element={<Layout><AssetList /></Layout>} />
        <Route path="/assets/:id" element={<Layout><AssetDetail /></Layout>} />
        <Route path="/users"       element={<Layout><Placeholder title="Users & Assignments" /></Layout>} />
        <Route path="/maintenance" element={<Layout><Placeholder title="Maintenance" /></Layout>} />
        <Route path="/locations"   element={<Layout><Placeholder title="Location Manager" /></Layout>} />
        <Route path="/reports"     element={<Layout><Placeholder title="Reports & Analytics" /></Layout>} />
        <Route path="/procurement" element={<Layout><Placeholder title="Procurement" /></Layout>} />
        <Route path="/settings"    element={<Layout><Placeholder title="Settings" /></Layout>} />
        <Route path="/notifications" element={<Layout><Placeholder title="Notifications" /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
