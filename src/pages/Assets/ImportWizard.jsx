import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import useStore, { BRANCHES } from '../../store/useStore';
import StepWizard from '../../components/ui/StepWizard';
import { UploadCloud, CheckCircle, AlertTriangle, ArrowRight, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'upload',   label: 'Upload File' },
  { id: 'mapping',  label: 'Field Mapping' },
  { id: 'validate', label: 'Validation' },
  { id: 'review',   label: 'Review & Import' }
];

const DB_SCHEMA = [
  { key: 'tag', label: 'Asset Tag (Required)', required: true },
  { key: 'name', label: 'Asset Name (Required)', required: true },
  { key: 'category', label: 'Category', required: true },
  { key: 'brand', label: 'Brand', required: false },
  { key: 'model', label: 'Model', required: false },
  { key: 'serial', label: 'Serial Number', required: false },
  { key: 'branch', label: 'Branch ID', required: false },
  { key: 'location', label: 'Location', required: false },
  { key: 'purchaseCost', label: 'Purchase Cost', required: false },
];

export default function ImportWizard() {
  const navigate = useNavigate();
  const { importAssets, assets } = useStore();
  const [step, setStep] = useState(0);

  // File & Raw Data
  const [file, setFile] = useState(null);
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);

  // Mapping
  // mapping[dbKey] = rawHeaderKey
  const [mapping, setMapping] = useState({});

  // Validation Data
  const [parsedAssets, setParsedAssets] = useState([]);
  const [errors, setErrors] = useState([]);

  const fileInputRef = useRef(null);

  // ── Step 1: File Upload & Parse ──────────────────────────────
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    
    if (ext === 'csv') {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]);
            setRawHeaders(headers);
            setRawData(results.data);
            autoMapFields(headers);
            setStep(1);
          } else {
            toast.error('CSV file is empty');
          }
        },
        error: () => toast.error('Error parsing CSV'),
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 1) {
          const headers = data[0];
          const rows = XLSX.utils.sheet_to_json(ws);
          setRawHeaders(headers);
          setRawData(rows);
          autoMapFields(headers);
          setStep(1);
        } else {
          toast.error('Excel file is empty');
        }
      };
      reader.readAsBinaryString(uploadedFile);
    } else {
      toast.error('Unsupported file format. Please use .csv or .xlsx');
    }
  };

  // Heuristic fuzzy matching
  const autoMapFields = (headers) => {
    const newMap = {};
    DB_SCHEMA.forEach(schemaField => {
      const dbKey = schemaField.key.toLowerCase();
      // Look for exact match or substring match
      const match = headers.find(h => {
        const headerStr = h.toLowerCase().replace(/[^a-z0-9]/g, '');
        return headerStr === dbKey || headerStr.includes(dbKey) || dbKey.includes(headerStr);
      });
      if (match) newMap[schemaField.key] = match;
    });
    setMapping(newMap);
  };

  // ── Step 2: Mapping ──────────────────────────────────────────
  const handleMappingChange = (dbKey, rawHeader) => {
    setMapping(prev => ({ ...prev, [dbKey]: rawHeader }));
  };

  const finalizeMapping = () => {
    // Check required fields
    const missingReq = DB_SCHEMA.filter(s => s.required && !mapping[s.key]);
    if (missingReq.length > 0) {
      toast.error(`Please map required fields: ${missingReq.map(s => s.label).join(', ')}`);
      return;
    }

    // Convert rawData to normalized parsedAssets based on mapping
    const normalized = rawData.map(row => {
      const asset = {};
      Object.entries(mapping).forEach(([dbKey, rawHeader]) => {
        asset[dbKey] = row[rawHeader] || '';
      });
      // Convert cost to number
      if (asset.purchaseCost) {
        asset.purchaseCost = parseFloat(String(asset.purchaseCost).replace(/[^0-9.-]+/g, '')) || 0;
      }
      return asset;
    });

    setParsedAssets(normalized);
    validateData(normalized);
    setStep(2);
  };

  // ── Step 3: Validation ───────────────────────────────────────
  const validateData = (data) => {
    const errs = [];
    const existingSerials = new Set(assets.map(a => a.serial).filter(Boolean));
    const currentSerials = new Set();
    const existingTags = new Set(assets.map(a => a.tag).filter(Boolean));
    const currentTags = new Set();

    data.forEach((row, idx) => {
      const rowErrors = {};
      
      // Required checks
      if (!row.tag) rowErrors.tag = 'Asset tag missing';
      else if (existingTags.has(row.tag)) rowErrors.tag = 'Duplicate Tag in DB';
      else if (currentTags.has(row.tag)) rowErrors.tag = 'Duplicate Tag in File';
      if (row.tag) currentTags.add(row.tag);

      if (!row.name) rowErrors.name = 'Name missing';
      if (!row.category) rowErrors.category = 'Category missing';

      // Serial check
      if (row.serial) {
        if (existingSerials.has(row.serial)) rowErrors.serial = 'Duplicate Serial in DB';
        else if (currentSerials.has(row.serial)) rowErrors.serial = 'Duplicate Serial in File';
        currentSerials.add(row.serial);
      }

      if (Object.keys(rowErrors).length > 0) {
        errs.push({ rowIndex: idx, errors: rowErrors });
      }
    });

    setErrors(errs);
  };

  const handleCellEdit = (rowIndex, key, value) => {
    const updated = [...parsedAssets];
    updated[rowIndex][key] = value;
    setParsedAssets(updated);
    // Re-validate silently
    validateData(updated);
  };

  // ── Step 4: Import ───────────────────────────────────────────
  const handleImport = () => {
    if (errors.length > 0) {
      toast.error('Please fix validation errors before importing');
      return;
    }
    importAssets(parsedAssets);
    toast.success(`Successfully imported ${parsedAssets.length} assets`);
    navigate('/assets');
  };


  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Assets</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Import Wizard</span>
          </div>
          <h1 className="page-title">Bulk Import Assets</h1>
        </div>
      </div>

      <StepWizard steps={STEPS} currentStep={step} />

      <div className="card" style={{ marginTop: 24 }}>
        
        {/* STEP 0: Upload */}
        {step === 0 && (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div 
              style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <UploadCloud size={48} style={{ color: 'var(--brand-primary)', marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>Click or Drag to Upload</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Supports .csv and .xlsx files</p>
            </div>
          </div>
        )}

        {/* STEP 1: Mapping */}
        {step === 1 && (
          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Map CSV Columns to Database Fields</h3>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Database Field</th>
                    <th>Required</th>
                    <th>CSV Column Header</th>
                  </tr>
                </thead>
                <tbody>
                  {DB_SCHEMA.map(schema => (
                    <tr key={schema.key}>
                      <td style={{ fontWeight: 500 }}>{schema.label}</td>
                      <td>
                        {schema.required ? <span style={{ color: 'var(--status-danger)', fontSize: 12, fontWeight: 700 }}>Yes</span> : <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>No</span>}
                      </td>
                      <td>
                        <select
                          className="form-input"
                          value={mapping[schema.key] || ''}
                          onChange={e => handleMappingChange(schema.key, e.target.value)}
                        >
                          <option value="">-- Ignore --</option>
                          {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-primary" onClick={finalizeMapping}>Continue <ArrowRight size={14}/></button>
            </div>
          </div>
        )}

        {/* STEP 2: Validation */}
        {step === 2 && (
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Data Validation Preview
              </h3>
              {errors.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--status-danger)', fontSize: 13, fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '6px 12px', borderRadius: 999 }}>
                  <AlertTriangle size={14} /> {errors.length} rows have errors
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--status-active)', fontSize: 13, fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 999 }}>
                  <CheckCircle size={14} /> All rows valid
                </div>
              )}
            </div>
            
            <div className="table-container" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table className="data-table">
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
                  <tr>
                    <th>Row</th>
                    {DB_SCHEMA.map(s => (
                      <th key={s.key}>{s.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedAssets.map((asset, idx) => {
                    const rowErr = errors.find(e => e.rowIndex === idx)?.errors || {};
                    return (
                      <tr key={idx} style={{ background: Object.keys(rowErr).length > 0 ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                        <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                        {DB_SCHEMA.map(s => {
                          const hasErr = !!rowErr[s.key];
                          return (
                            <td key={s.key} style={{ padding: '4px 12px' }}>
                              <input
                                className="form-input"
                                style={{ 
                                  height: 28, fontSize: 12, padding: '2px 8px',
                                  borderColor: hasErr ? 'var(--status-danger)' : 'var(--border)',
                                  background: hasErr ? 'rgba(239,68,68,0.1)' : 'transparent',
                                }}
                                value={asset[s.key]}
                                onChange={e => handleCellEdit(idx, s.key, e.target.value)}
                                title={rowErr[s.key]}
                              />
                              {hasErr && <div style={{ fontSize: 10, color: 'var(--status-danger)', marginTop: 2 }}>{rowErr[s.key]}</div>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back to Mapping</button>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(3)}
                disabled={errors.length > 0}
              >
                Continue <ArrowRight size={14}/>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', textAlign: 'center' }}>Ready to Import</h3>
            
            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
              <CheckCircle size={48} style={{ color: 'var(--status-active)', margin: '0 auto 16px' }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                {parsedAssets.length} Assets
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                All records have passed validation and are ready to be ingested into the database.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, gap: 16 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" onClick={handleImport}>
                <Save size={14} /> Confirm & Import
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
