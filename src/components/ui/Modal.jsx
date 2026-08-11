import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', id }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const closeBtnRef = useRef(null);
  const triggerRef = useRef(null);

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
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Move focus into the modal
      requestAnimationFrame(() => closeBtnRef.current?.focus());

      const trapFocus = (e) => {
        if (e.key !== 'Tab' || !contentRef.current) return;
        const focusable = contentRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      };
      window.addEventListener('keydown', trapFocus);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', trapFocus);
        triggerRef.current?.focus();
      };
    }
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
        ref={contentRef}
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
              ref={closeBtnRef}
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Close modal"
              style={{ flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div style={{ overflow: 'auto', flex: 1, padding: '0' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 480px) {
          .modal-overlay { padding: 12px !important; align-items: flex-end !important; }
          .modal-content {
            max-width: 100% !important;
            max-height: 85vh !important;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0 !important;
            animation: modalInMobile 0.25s ease-out !important;
          }
        }
        @keyframes modalInMobile {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
