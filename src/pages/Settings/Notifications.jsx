import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import { mockActivity } from '../../data/mockData';
import { Bell, CheckCircle, AlertTriangle, ShieldAlert, Package, Wrench, Download, Settings, Box } from 'lucide-react';

export default function Notifications() {
  const { markNotificationsRead } = useStore();

  useEffect(() => {
    // Mark notifications as read when visiting this page
    markNotificationsRead();
  }, [markNotificationsRead]);

  const getIconForType = (type, color) => {
    switch (type) {
      case 'assign': return <CheckCircle size={16} color={color} />;
      case 'add': return <Package size={16} color={color} />;
      case 'repair': return <Wrench size={16} color={color} />;
      case 'warning': return <AlertTriangle size={16} color={color} />;
      case 'import': return <Download size={16} color={color} />;
      case 'retire': return <Box size={16} color={color} />;
      default: return <Bell size={16} color={color} />;
    }
  };

  return (
    <div className="page-container fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Recent system alerts and updates.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => {}}>
          <CheckCircle size={14} /> Mark all as read
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {mockActivity.map((act, index) => (
          <div 
            key={act.id} 
            style={{ 
              display: 'flex', 
              gap: 16, 
              padding: '16px 20px', 
              borderBottom: index < mockActivity.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'flex-start'
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: act.bgColor, flexShrink: 0
            }}>
              {getIconForType(act.type, act.color)}
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <div 
                style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 4 }}
                dangerouslySetInnerHTML={{ __html: act.text }} 
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {act.time}
              </div>
            </div>
            {/* Unread indicator (just mock some as unread if index < 2) */}
            {index < 2 && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--brand-primary)', marginTop: 8 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
