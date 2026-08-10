import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema,
  getSpecTemplate, DEPARTMENTS, CATEGORIES,
} from '../../schemas/assetSchema';
import StepWizard from '../../components/ui/StepWizard';
import useStore, { BRANCHES, generateAssetTag } from '../../store/useStore';
import { mockUsers, mockAssets } from '../../data/mockData';
import {
  ArrowLeft, ArrowRight, Save, CheckCircle, Plus, Trash2,
  Package, DollarSign, MapPin, Cpu, FileText, Eye,
} from 'lucide-react';

// ── CATEGORIES imported from schemas ─────────────────────────
import { CATEGORIES as CAT_LIST } from '../../schemas/assetSchema';

const STEPS = [
  { id: 'basic',       label: 'Basic Info',        icon: Package    },
  { id: 'acquisition', label: 'Acquisition',        icon: DollarSign },
  { id: 'location',    label: 'Location',           icon: MapPin     },
  { id: 'specs',       label: 'Specifications',     icon: Cpu        },
  { id: 'docs',        label: 'Docs & Notes',       icon: FileText   },
  { id: 'review',      label: 'Review',             icon: Eye        },
];

const STEP_SCHEMAS = [
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, null,
];

// ── Field wrapper with label + error ────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span style={{ color: 'var(--status-danger)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: 'var(--status-danger)', marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Step 1: Basic Info ──────────────────────────────────────────
function Step1({ form }) {
  const { register, formState: { errors }, setValue, watch } = form;
  const category = watch('category');

  return (
    <div className="grid-2">
      <Field label="Asset Name" error={errors.name?.message} required>
        <input id="field-name" className="form-input" {...register('name')} placeholder="e.g. Dell Latitude 5530" />
      </Field>
      <Field label="Category" error={errors.category?.message} required>
        <select id="field-category" className="form-input" {...register('category')}>
          <option value="">Select category…</option>
          {CAT_LIST.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Brand" error={errors.brand?.message} required>
        <input id="field-brand" className="form-input" {...register('brand')} placeholder="e.g. Dell, HP, Apple" />
      </Field>
      <Field label="Model" error={errors.model?.message} required>
        <input id="field-model" className="form-input" {...register('model')} placeholder="e.g. Latitude 5530" />
      </Field>
      <Field label="Serial Number" error={errors.serial?.message} required>
        <input id="field-serial" className="form-input" {...register('serial')}
          placeholder="e.g. DL-2024-00291"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
        />
      </Field>
      <Field label="Asset Tag" error={errors.tag?.message} required>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="field-tag"
            className="form-input"
            {...register('tag')}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, flex: 1 }}
            placeholder="#AST-0000"
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            id="generate-tag-btn"
            onClick={() => setValue('tag', generateAssetTag())}
            title="Auto-generate tag"
          >
            ↻
          </button>
        </div>
      </Field>
    </div>
  );
}

// ── Step 2: Acquisition ──────────────────────────────────────────
function Step2({ form }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="grid-2">
      <Field label="Purchase Date" error={errors.purchaseDate?.message} required>
        <input id="field-purchase-date" type="date" className="form-input" {...register('purchaseDate')} />
      </Field>
      <Field label="Vendor / Supplier" error={errors.vendor?.message} required>
        <input id="field-vendor" className="form-input" {...register('vendor')} placeholder="e.g. Dell Philippines" />
      </Field>
      <Field label="Unit Cost (₱)" error={errors.purchaseCost?.message} required>
        <input id="field-cost" type="number" step="0.01" className="form-input" {...register('purchaseCost')} placeholder="0.00" />
      </Field>
      <Field label="PO Number" error={errors.poNumber?.message}>
        <input id="field-po" className="form-input" {...register('poNumber')} placeholder="e.g. PO-2024-0012"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
        />
      </Field>
      <Field label="Warranty Expiry" error={errors.warrantyExpiry?.message}>
        <input id="field-warranty" type="date" className="form-input" {...register('warrantyExpiry')} />
      </Field>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
        <input id="field-warranty-alert" type="checkbox" {...register('warrantyAlert')} style={{ width: 16, height: 16 }} />
        <label htmlFor="field-warranty-alert" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          Send alert 30 days before warranty expiry
        </label>
      </div>
    </div>
  );
}

// ── Step 3: Location & Assignment ───────────────────────────────
function Step3({ form }) {
  const { register, formState: { errors } } = form;
  return (
    <div className="grid-2">
      <Field label="Branch / Location" error={errors.branch?.message} required>
        <select id="field-branch" className="form-input" {...register('branch')}>
          <option value="">Select branch…</option>
          {BRANCHES.filter(b => b.id !== 'all').map(b => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Department" error={errors.department?.message} required>
        <select id="field-department" className="form-input" {...register('department')}>
          <option value="">Select department…</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Floor / Level" error={errors.floor?.message}>
        <input id="field-floor" className="form-input" {...register('floor')} placeholder="e.g. Floor 2" />
      </Field>
      <Field label="Room / Zone" error={errors.room?.message}>
        <input id="field-room" className="form-input" {...register('room')} placeholder="e.g. Room 204" />
      </Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Assign To (optional)" error={errors.assigneeId?.message}>
          <select id="field-assignee" className="form-input" {...register('assigneeId')}>
            <option value="">Unassigned</option>
            {mockUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

// ── Step 4: Dynamic Spec Builder ────────────────────────────────
function Step4({ form, category }) {
  const template = getSpecTemplate(category);
  const [specs, setSpecs] = useState(() =>
    template.reduce((acc, k) => ({ ...acc, [k]: '' }), {})
  );
  const [customKey,   setCustomKey]   = useState('');
  const [customValue, setCustomValue] = useState('');

  // Keep form in sync with specs state
  useEffect(() => {
    form.setValue('specs', specs);
  }, [specs]);

  // Reset spec keys when category changes
  useEffect(() => {
    const tmpl = getSpecTemplate(category);
    setSpecs(tmpl.reduce((acc, k) => ({ ...acc, [k]: '' }), {}));
  }, [category]);

  const updateSpec  = (key, val) => setSpecs(s => ({ ...s, [key]: val }));
  const removeSpec  = (key)      => setSpecs(s => { const n = { ...s }; delete n[key]; return n; });
  const addCustom   = ()         => {
    if (!customKey.trim()) return;
    setSpecs(s => ({ ...s, [customKey.trim()]: customValue }));
    setCustomKey(''); setCustomValue('');
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Spec fields for <strong style={{ color: 'var(--brand-primary)' }}>{category || 'selected category'}</strong>.
        Fields auto-populate based on category.
      </p>
      <div className="grid-2">
        {Object.entries(specs).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">{key}</label>
              <input
                id={`spec-${key.replace(/\s+/g, '-').toLowerCase()}`}
                className="form-input"
                value={val}
                onChange={e => updateSpec(key, e.target.value)}
                placeholder={`Enter ${key.toLowerCase()}…`}
              />
            </div>
            {!getSpecTemplate(category).includes(key) && (
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeSpec(key)}
                style={{ color: 'var(--status-danger)', marginBottom: 0 }} aria-label={`Remove ${key}`}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Custom field adder */}
      <div style={{
        marginTop: 16, padding: '12px 16px',
        background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          + Add Custom Spec Field
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="custom-spec-key"
            className="form-input"
            placeholder="Field name (e.g. GPU)"
            value={customKey}
            onChange={e => setCustomKey(e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            id="custom-spec-value"
            className="form-input"
            placeholder="Value"
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-primary btn-sm" id="add-spec-btn" onClick={addCustom}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Documents & Notes ────────────────────────────────────
function Step5({ form }) {
  const { register, formState: { errors } } = form;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Drop zone */}
      <div>
        <label className="form-label">Attachments</label>
        <div
          id="doc-drop-zone"
          style={{
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 32, textAlign: 'center', cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          role="button"
          tabIndex={0}
          aria-label="Upload documents"
        >
          <FileText size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>Click to upload</span> or drag & drop
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-disabled)', marginTop: 4 }}>
            PDF, JPG, PNG, DOCX — max 10MB each
          </p>
        </div>
      </div>

      {/* Notes */}
      <Field label="Notes / Remarks" error={errors.notes?.message}>
        <textarea
          id="field-notes"
          className="form-input"
          {...register('notes')}
          placeholder="Any additional notes about this asset, purchase history, or special instructions…"
          rows={5}
          style={{ resize: 'vertical', lineHeight: 1.7 }}
        />
      </Field>
    </div>
  );
}

// ── Step 6: Review ───────────────────────────────────────────────
function Step6({ data }) {
  const LABELS = {
    name: 'Asset Name', category: 'Category', brand: 'Brand', model: 'Model',
    serial: 'Serial No.', tag: 'Asset Tag', purchaseDate: 'Purchase Date',
    vendor: 'Vendor', purchaseCost: 'Unit Cost', poNumber: 'PO Number',
    warrantyExpiry: 'Warranty Expiry', branch: 'Branch',
    floor: 'Floor', room: 'Room', department: 'Department',
    assigneeId: 'Assignee', notes: 'Notes',
  };

  const assignee = mockUsers.find(u => u.id === data.assigneeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { title: 'Basic Information', keys: ['name','category','brand','model','serial','tag'] },
        { title: 'Acquisition',       keys: ['purchaseDate','vendor','purchaseCost','poNumber','warrantyExpiry'] },
        { title: 'Location',          keys: ['branch','floor','room','department'] },
      ].map(section => (
        <div key={section.title} className="card card-body" style={{ padding: '16px 20px' }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
              {section.title}
            </span>
          </div>
          <div className="spec-grid">
            {section.keys.filter(k => data[k]).map(k => (
              <div key={k} className="spec-item">
                <div className="spec-label">{LABELS[k] || k}</div>
                <div className="spec-value" style={
                  ['serial','tag','poNumber'].includes(k)
                    ? { fontFamily: 'var(--font-mono)', fontSize: 13 }
                    : {}
                }>
                  {k === 'purchaseCost' ? `₱${Number(data[k]).toLocaleString()}`
                    : k === 'assigneeId' ? (assignee?.name || data[k])
                    : data[k]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Specs preview */}
      {data.specs && Object.keys(data.specs).length > 0 && (
        <div className="card card-body" style={{ padding: '16px 20px' }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Specifications</span>
          </div>
          <div className="spec-grid">
            {Object.entries(data.specs).filter(([,v]) => v).map(([k, v]) => (
              <div key={k} className="spec-item">
                <div className="spec-label">{k}</div>
                <div className="spec-value">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.notes && (
        <div className="card card-body" style={{ padding: '16px 20px' }}>
          <div className="spec-label" style={{ marginBottom: 8 }}>Notes</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{data.notes}</p>
        </div>
      )}
    </div>
  );
}

// ── Main AssetForm Component ─────────────────────────────────────
export default function AssetForm() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = !!id;
  const { addAsset, updateAsset, setDraftAsset, clearDraftAsset, draftAsset, assets } = useStore();

  const existingAsset = isEdit
    ? (assets.find(a => a.id === id) || mockAssets.find(a => a.id === id))
    : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    if (isEdit && existingAsset) return { ...existingAsset };
    if (draftAsset) return draftAsset;
    return { tag: generateAssetTag() };
  });

  const schema = STEP_SCHEMAS[currentStep - 1];

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: formData,
    mode: 'onChange',
  });

  const category = form.watch('category');

  // Sync formData on step completion
  const saveStep = (stepData) => {
    const merged = { ...formData, ...stepData };
    setFormData(merged);
    return merged;
  };

  const nextStep = form.handleSubmit((stepData) => {
    const merged = saveStep(stepData);
    setDraftAsset(merged);
    if (currentStep < STEPS.length) {
      setCurrentStep(s => s + 1);
      form.reset({ ...merged });
    }
  });

  const prevStep = () => {
    const current = form.getValues();
    saveStep(current);
    setCurrentStep(s => s - 1);
    form.reset({ ...formData, ...current });
  };

  const handleSaveDraft = () => {
    const current = form.getValues();
    setDraftAsset({ ...formData, ...current });
    toast.success('Draft saved!');
  };

  const handleSubmit = () => {
    const finalData = { ...formData };
    const assignee  = mockUsers.find(u => u.id === finalData.assigneeId);

    const assetPayload = {
      ...finalData,
      assignedTo: assignee ? { id: assignee.id, name: assignee.name, initials: assignee.initials } : null,
      location:   BRANCHES.find(b => b.id === finalData.branch)?.label || finalData.branch,
      status:     'ACTIVE',
    };

    if (isEdit) {
      updateAsset(id, assetPayload);
      toast.success('Asset updated successfully!');
    } else {
      addAsset(assetPayload);
      toast.success('Asset registered successfully!');
    }

    clearDraftAsset();
    navigate('/assets');
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="animate-fade" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="breadcrumb-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/assets')}>Assets</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">{isEdit ? 'Edit Asset' : 'Add Asset'}</span>
          </div>
          <h1 className="page-title">{isEdit ? `Edit: ${existingAsset?.name}` : 'Register New Asset'}</h1>
          <p className="page-subtitle">Complete all steps. You can save a draft at any time.</p>
        </div>
        <button className="btn btn-secondary btn-sm" id="save-draft-btn" onClick={handleSaveDraft}>
          <Save size={14} /> Save Draft
        </button>
      </div>

      {/* Step Wizard */}
      <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
        <StepWizard steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <form onSubmit={(e) => { e.preventDefault(); isLastStep ? handleSubmit() : nextStep(e); }}>
        <div className="card card-body animate-fade" key={currentStep} style={{ marginBottom: 20, padding: '24px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 4,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {(() => { const Icon = STEPS[currentStep - 1].icon; return <Icon size={18} style={{ color: 'var(--brand-primary)' }} />; })()}
              {STEPS[currentStep - 1].label}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          {currentStep === 1 && <Step1 form={form} />}
          {currentStep === 2 && <Step2 form={form} />}
          {currentStep === 3 && <Step3 form={form} />}
          {currentStep === 4 && <Step4 form={form} category={category || formData.category} />}
          {currentStep === 5 && <Step5 form={form} />}
          {currentStep === 6 && <Step6 data={formData} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            id="prev-step-btn"
            onClick={currentStep === 1 ? () => navigate('/assets') : prevStep}
          >
            <ArrowLeft size={14} />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {!isLastStep ? (
              <button type="submit" className="btn btn-primary" id="next-step-btn">
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                id="submit-asset-btn"
                onClick={handleSubmit}
                style={{ background: 'linear-gradient(135deg,#10B981,#34D399)' }}
              >
                <CheckCircle size={14} />
                {isEdit ? 'Save Changes' : 'Register Asset'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
