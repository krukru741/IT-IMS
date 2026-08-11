import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from './Modal';
import { Camera, CameraOff, ScanLine, X } from 'lucide-react';

export default function QrScanner({ isOpen, onClose, onScan }) {
  const [status,  setStatus]  = useState('idle');  // idle | loading | scanning | error | no-camera
  const [errMsg,  setErrMsg]  = useState('');
  const scannerRef = useRef(null);
  const READER_ID  = 'qr-scanner-reader';

  useEffect(() => {
    if (!isOpen) return;

    let qr = null;
    setStatus('loading');

    const start = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          setStatus('no-camera');
          return;
        }

        qr = new Html5Qrcode(READER_ID);
        scannerRef.current = qr;

        await qr.start(
          { facingMode: 'environment' },
          { fps: 12, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
          (decoded) => {
            // Success
            qr.stop().catch(() => {});
            onScan(decoded);
            onClose();
          },
          () => { /* scan attempt errors — ignore */ }
        );
        setStatus('scanning');
      } catch (err) {
        if (err.toString().includes('permission')) {
          setErrMsg('Camera permission denied. Please allow camera access and try again.');
        } else {
          setErrMsg(err.message || 'Could not start camera.');
        }
        setStatus('error');
      }
    };

    start();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      setStatus('idle');
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scan Asset QR Code"
      id="qr-scanner-modal"
      size="sm"
    >
      <div style={{ padding: '20px 24px 24px' }}>
        {/* Viewfinder */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: '#000',
          minHeight: 280,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* html5-qrcode mounts here */}
          <div
            id={READER_ID}
            style={{ width: '100%', minHeight: 280 }}
          />

          {/* Scanning bracket overlay */}
          {status === 'scanning' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 220, height: 220, position: 'relative',
              }}>
                {/* Corner brackets */}
                {[
                  { top: 0,    left: 0,    borderTop: '3px solid var(--brand-primary)', borderLeft: '3px solid var(--brand-primary)' },
                  { top: 0,    right: 0,   borderTop: '3px solid var(--brand-primary)', borderRight: '3px solid var(--brand-primary)' },
                  { bottom: 0, left: 0,    borderBottom: '3px solid var(--brand-primary)', borderLeft: '3px solid var(--brand-primary)' },
                  { bottom: 0, right: 0,   borderBottom: '3px solid var(--brand-primary)', borderRight: '3px solid var(--brand-primary)' },
                ].map((style, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 28, height: 28, ...style,
                  }} />
                ))}
                {/* Scan line */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: '50%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--brand-primary), transparent)',
                  animation: 'scanline 1.8s ease-in-out infinite',
                }} />
              </div>
            </div>
          )}

          {/* Loading state */}
          {status === 'loading' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff', fontSize: 14,
            }}>
              <Camera size={32} style={{ opacity: 0.6 }} />
              Requesting camera…
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              background: 'var(--bg-surface)',
              padding: 24, textAlign: 'center',
            }}>
              <CameraOff size={36} style={{ color: 'var(--status-danger)' }} />
              <p style={{ color: 'var(--status-danger)', fontWeight: 600, fontSize: 14 }}>Camera Error</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{errMsg}</p>
            </div>
          )}

          {/* No camera */}
          {status === 'no-camera' && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: 24, textAlign: 'center', minHeight: 280,
            }}>
              <CameraOff size={36} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No Camera Detected</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Connect a camera or use a mobile device.</p>
            </div>
          )}
        </div>

        {/* Instruction */}
        {status === 'scanning' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontSize: 13, color: 'var(--brand-primary)', marginBottom: 16,
          }}>
            <ScanLine size={16} />
            Point the camera at an asset QR label to scan
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} id="close-scanner-btn">
            <X size={14} /> Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%, 100% { transform: translateY(-80px); opacity: 0.4; }
          50%       { transform: translateY(80px);  opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}
