import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', id }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Trap focus & prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = { sm: 400, md: 560, lg: 720, xl: 900, '2xl': 1100 };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      id={id}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'var(--bg-overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          width: '100%',
          maxWidth: widths[size] || widths.md,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <h2 id={`${id}-title`} style={{
              fontFamily: 'var(--font-display)', fontSize: 17,
              fontWeight: 700, color: 'var(--text-primary)',
            }}>
              {title}
            </h2>
            <button
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Close modal"
              style={{ flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ overflow: 'auto', flex: 1, padding: '0' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
