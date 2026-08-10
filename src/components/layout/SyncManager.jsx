import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { Wifi, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SyncManager() {
  const { offlineQueue, flushOfflineQueue, setSyncStatus } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
      if (useStore.getState().offlineQueue.length > 0) {
        setIsOpen(true);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setSyncStatus]);

  const handleSync = () => {
    setSyncStatus('pending');
    // Simulate network delay
    setTimeout(() => {
      flushOfflineQueue();
      toast.success('Successfully synced offline changes to the server.');
      setIsOpen(false);
    }, 1500);
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all offline scans? This action cannot be undone.')) {
      useStore.setState({ offlineQueue: [] });
      setSyncStatus('synced');
      setIsOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Connection Restored"
      size="md"
    >
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Wifi size={48} style={{ color: 'var(--status-active)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            You are back online
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            You have <strong style={{ color: 'var(--brand-primary)' }}>{offlineQueue.length}</strong> offline action(s) queued for synchronization.
          </p>
        </div>

        <div className="table-container" style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 24 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Action Type</th>
                <th>Asset / Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {offlineQueue.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>QR Scan</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{item.tag}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(item.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(245,158,11,0.1)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, marginBottom: 24 }}>
          <AlertTriangle size={20} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            Review your offline changes before syncing. If there are conflicts, the server's version will take precedence.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleDiscard}>
            Discard Changes
          </button>
          <button className="btn btn-primary" onClick={handleSync}>
            <RefreshCw size={14} /> Sync Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
