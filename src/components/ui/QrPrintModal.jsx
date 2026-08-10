import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from './Modal';
import { Printer, Download, X } from 'lucide-react';

const LABEL_SCALE = 3.8; // 2"×1" at 96dpi = 192×96px → scaled for screen preview
const LABEL_W = 192 * LABEL_SCALE;
const LABEL_H = 96  * LABEL_SCALE;

export default function QrPrintModal({ asset, onClose }) {
  const labelRef = useRef(null);
  if (!asset) return null;

  const assetUrl  = `https://ims.company.com/ast/${asset.id}`;
  const orgName   = 'IT IMS Co.';

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Screen UI ── */}
      <Modal
        isOpen={!!asset}
        onClose={onClose}
        title="Print QR Asset Label"
        id="qr-print-modal"
        size="md"
      >
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Sheet options */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['Single Label', '8-Up Sheet', '16-Up Sheet', '30-Up Sheet'].map(opt => (
              <button key={opt} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                {opt}
              </button>
            ))}
          </div>

          {/* Label Preview */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              Label Preview — 2" × 1" (Avery / Zebra format)
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                id="qr-label-preview"
                ref={labelRef}
                style={{
                  width:  LABEL_W,
                  height: LABEL_H,
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                {/* QR code */}
                <div style={{ flexShrink: 0 }}>
                  <QRCodeSVG
                    value={assetUrl}
                    size={LABEL_H - 24}
                    level="H"
                    includeMargin={false}
                    fgColor="#000"
                    bgColor="transparent"
                  />
                </div>
                {/* Text block */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#111',
                    letterSpacing: 1,
                  }}>
                    {asset.tag}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: '#333',
                    fontWeight: 600,
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {asset.category}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: '#999',
                    marginTop: 4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {orgName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR URL info */}
          <div style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            marginBottom: 20, fontSize: 12, fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}>
            Encodes: <span style={{ color: 'var(--brand-primary)' }}>{assetUrl}</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              <X size={14} /> Cancel
            </button>
            <button className="btn btn-primary" id="print-label-btn" onClick={handlePrint}>
              <Printer size={14} /> Print Label
            </button>
          </div>
        </div>
      </Modal>

      {/* ── @media print — only the label renders ── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #qr-label-print-target { display: flex !important; }
        }
      `}</style>

      {/* Hidden print target — injected outside modal */}
      <div id="qr-label-print-target" style={{ display: 'none' }}>
        <div style={{
          width: '2in', height: '1in',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '4mm',
          padding: '2mm 3mm',
          pageBreakAfter: 'avoid',
        }}>
          <QRCodeSVG value={assetUrl} size={80} level="H" includeMargin={false} fgColor="#000" />
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '8pt', fontWeight: 700 }}>{asset.tag}</div>
            <div style={{ fontSize: '7pt', fontWeight: 600 }}>{asset.name}</div>
            <div style={{ fontSize: '6pt', color: '#555' }}>{asset.category}</div>
            <div style={{ fontSize: '5pt', color: '#888', textTransform: 'uppercase' }}>{orgName}</div>
          </div>
        </div>
      </div>
    </>
  );
}
