import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Trash2, Lock, Table2, FileText, ChevronDown, Eye } from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text',    label: 'Text' },
  { value: 'number',  label: 'Number' },
  { value: 'date',    label: 'Date' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'select',  label: 'Dropdown' },
];

// Single field input
function FieldInput({ field, name, register, disabled }) {
  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-4">
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input type="radio" value="true" disabled={disabled}
            className="w-4 h-4 accent-emerald-500 cursor-pointer"
            {...register(name)} />
          <span className="text-sm font-medium text-gray-700">Yes</span>
        </label>
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input type="radio" value="false" disabled={disabled}
            className="w-4 h-4 accent-red-400 cursor-pointer"
            {...register(name)} />
          <span className="text-sm font-medium text-gray-700">No</span>
        </label>
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <select className="input disabled:bg-gray-50 disabled:text-gray-500" disabled={disabled} {...register(name)}>
        <option value="">Select…</option>
        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input className="input disabled:bg-gray-50 disabled:text-gray-500"
      disabled={disabled}
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
      placeholder={disabled ? 'No data' : `Enter ${field.label.toLowerCase()}`}
      {...register(name)} />
  );
}

// ── Table form ────────────────────────────────────────
function TableForm({ form, existing, onSuccess, isViewer }) {
  const existingRows = existing?.data?.rows || [{}];
  const [extraCols, setExtraCols] = useState(existing?.data?._extraCols || []);
  const [showAddCol, setShowAddCol] = useState(false);
  const [newCol, setNewCol] = useState({ label: '', key: '', type: 'text', options: '' });
  const [colErrors, setColErrors] = useState({});
  const colKeyAutoFilledRef = useRef(true);

  const { register, control, handleSubmit } = useForm({ defaultValues: { rows: existingRows } });
  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });

  const allFields = [
    ...form.fields,
    ...extraCols.map(c => ({ ...c, key: c.key || c.label.toLowerCase().replace(/\s+/g, '_') })),
  ];

  const addCol = () => {
    const errs = {};
    if (!newCol.label.trim()) errs.label = 'Column name is required';
    if (!newCol.key.trim()) errs.key = 'Key is required';
    else if (!/^[a-z0-9_]+$/.test(newCol.key)) errs.key = 'Only lowercase letters, numbers & _';
    else if (allFields.some(f => f.key === newCol.key))
      errs.key = 'Key already exists';
    if (newCol.type === 'select' && !newCol.options.trim()) errs.options = 'At least one option is required';
    if (Object.keys(errs).length) { setColErrors(errs); return; }
    setColErrors({});
    const options = newCol.type === 'select'
      ? newCol.options.split(',').map(o => o.trim()).filter(Boolean)
      : [];
    setExtraCols(prev => [...prev, { label: newCol.label, key: newCol.key, type: newCol.type, options }]);
    setNewCol({ label: '', key: '', type: 'text', options: '' });
    colKeyAutoFilledRef.current = true;
    setShowAddCol(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => dataApi.create(payload),
    onSuccess: () => { toast.success('Saved!'); onSuccess?.(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const onSubmit = (values) => {
    // Coerce boolean fields in each row
    const allCols = [...form.fields, ...extraCols];
    const rows = values.rows.map(row => {
      const r = { ...row };
      allCols.forEach(f => {
        if (f.type === 'boolean' && r[f.key] !== undefined) {
          r[f.key] = r[f.key] === 'true' ? true : r[f.key] === 'false' ? false : r[f.key];
        }
      });
      return r;
    });
    // Store extra col definitions inside data object, not alongside it
    const data = { rows };
    if (extraCols.length > 0) data._extraCols = extraCols;
    mutate({
      formId:   form._id,
      category: form.title.toLowerCase().replace(/\s+/g, '_'),
      data,
    });
  };

  // Block Enter from submitting the form anywhere
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-4">
      {form.description && <p className="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">{form.description}</p>}

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-400 w-8">#</th>
                {allFields.map(f => (
                  <th key={f.key} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 min-w-[130px]">
                    <div className="flex items-center gap-1">
                      <Lock size={9} className="text-amber-400" /> {f.label}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fields.map((row, ri) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 text-xs text-gray-400">{ri + 1}</td>
                  {allFields.map(f => (
                    <td key={f.key} className="px-2 py-1.5">
                      <FieldInput field={f} name={`rows.${ri}.${f.key}`} register={register} disabled={isViewer} />
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    {fields.length > 1 && !isViewer && (
                      <button type="button" onClick={() => remove(ri)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        {!isViewer && (
          <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-3 flex-wrap">
            <button type="button" onClick={() => append({})}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Plus size={13} /> Add Row
            </button>
            <span className="text-gray-200">|</span>
            <button type="button" onClick={() => setShowAddCol(!showAddCol)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              <Plus size={13} /> Add Column
            </button>
          </div>
        )}

        {/* Add column inline */}
        {showAddCol && (
          <div className="px-4 py-3 border-t border-gray-100 bg-indigo-50/30 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <input
                  className={`input text-sm w-full ${colErrors.label ? 'border-red-400 bg-red-50' : ''}`}
                  placeholder="Column name  e.g. Bank Name"
                  autoFocus
                  value={newCol.label}
                  onChange={e => {
                    const label = e.target.value;
                    const autoKey = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    setNewCol(p => colKeyAutoFilledRef.current ? { ...p, label, key: autoKey } : { ...p, label });
                    setColErrors(p => ({ ...p, label: '' }));
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCol(); } }} />
                {colErrors.label && <p className="text-red-500 text-xs mt-1">{colErrors.label}</p>}
              </div>
              <div className="w-28">
                <input
                  className={`input text-sm w-full font-mono ${colErrors.key ? 'border-red-400 bg-red-50' : ''}`}
                  placeholder="key_name"
                  value={newCol.key}
                  onChange={e => { colKeyAutoFilledRef.current = false; setNewCol(p => ({ ...p, key: e.target.value })); setColErrors(p => ({ ...p, key: '' })); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCol(); } }} />
                {colErrors.key && <p className="text-red-500 text-xs mt-1">{colErrors.key}</p>}
              </div>
              <div className="relative">
                <select className="input text-sm w-28 appearance-none pr-6 cursor-pointer"
                  value={newCol.type} onChange={e => { setNewCol(p => ({ ...p, type: e.target.value, options: '' })); setColErrors(p => ({ ...p, options: '' })); }}>
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button type="button" onClick={addCol}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                Add
              </button>
              <button type="button" onClick={() => { setShowAddCol(false); setColErrors({}); setNewCol({ label: '', key: '', type: 'text', options: '' }); colKeyAutoFilledRef.current = true; }}
                className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
            {newCol.type === 'select' && (
              <div>
                <input
                  className={`input text-xs w-full ${colErrors.options ? 'border-red-400 bg-red-50' : ''}`}
                  placeholder="Options comma-separated  e.g. BTC,ETH,SOL"
                  value={newCol.options}
                  onChange={e => { setNewCol(p => ({ ...p, options: e.target.value })); setColErrors(p => ({ ...p, options: '' })); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCol(); } }} />
                {colErrors.options && <p className="text-red-500 text-xs mt-1">{colErrors.options}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {!isViewer && (
        <div className="flex justify-end">
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}
    </form>
  );
}

// ── Record form ───────────────────────────────────────
function RecordForm({ form, existing, onSuccess, isViewer }) {
  const [extraFields, setExtraFields] = useState(existing?.data?._extraFields || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newField, setNewField] = useState({ label: '', key: '', type: 'text', options: '' });
  const [fieldErrs, setFieldErrs] = useState({});
  const keyAutoFilledRef = useRef(true); // tracks if key was auto-filled from label

  const { register, handleSubmit } = useForm({
    defaultValues: existing?.data || {},
  });

  const handleNewFieldLabelChange = (e) => {
    const label = e.target.value;
    setNewField(p => {
      const autoKey = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      // auto-fill key only if user hasn't manually edited it
      return keyAutoFilledRef.current ? { ...p, label, key: autoKey } : { ...p, label };
    });
    setFieldErrs(p => ({ ...p, label: '' }));
  };

  const handleNewFieldKeyChange = (e) => {
    keyAutoFilledRef.current = false; // user is manually editing key
    setNewField(p => ({ ...p, key: e.target.value }));
    setFieldErrs(p => ({ ...p, key: '' }));
  };

  const addField = () => {
    const errs = {};
    if (!newField.label.trim()) errs.label = 'Field name is required';
    if (!newField.key.trim()) errs.key = 'Key is required';
    else if (!/^[a-z0-9_]+$/.test(newField.key)) errs.key = 'Only lowercase letters, numbers & _';
    else if ([...form.fields, ...extraFields].some(f => f.key === newField.key))
      errs.key = 'Key already exists';
    if (newField.type === 'select' && !newField.options.trim()) errs.options = 'At least one option is required';
    if (Object.keys(errs).length) { setFieldErrs(errs); return; }
    setFieldErrs({});
    const key = newField.key;
    const options = newField.type === 'select'
      ? newField.options.split(',').map(o => o.trim()).filter(Boolean)
      : [];
    setExtraFields(prev => [...prev, { label: newField.label, key, type: newField.type, options }]);
    setNewField({ label: '', key: '', type: 'text', options: '' });
    keyAutoFilledRef.current = true;
    setShowAdd(false);
  };

  const removeExtra = (key) => setExtraFields(prev => prev.filter(f => f.key !== key));

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => dataApi.create(payload),
    onSuccess: () => { toast.success('Saved!'); onSuccess?.(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const onSubmit = (values) => {
    // Coerce boolean fields from string radio values to actual booleans
    const coerced = { ...values };
    [...form.fields, ...extraFields].forEach(f => {
      if (f.type === 'boolean' && coerced[f.key] !== undefined) {
        coerced[f.key] = coerced[f.key] === 'true' ? true : coerced[f.key] === 'false' ? false : coerced[f.key];
      }
    });
    // Store extra field definitions inside data object, not alongside it
    const data = { ...coerced };
    if (extraFields.length > 0) data._extraFields = extraFields;
    mutate({
      formId:   form._id,
      category: form.title.toLowerCase().replace(/\s+/g, '_'),
      data,
    });
  };

  // Block Enter from submitting the form anywhere
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const allFields = [...form.fields, ...extraFields];

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-4">
      {form.description && <p className="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">{form.description}</p>}

      <div className="space-y-0">
        {allFields.map((f, i) => (
          <div key={f.key}
            className={`flex items-start gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'} rounded-xl`}>
            <label className="flex items-start gap-1.5 text-sm font-semibold text-gray-500 flex-shrink-0 w-60 pt-2.5">
              <Lock size={10} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{f.label}</span>
            </label>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <FieldInput field={f} name={f.key} register={register} disabled={isViewer} />
              </div>
              {extraFields.some(ef => ef.key === f.key) && !isViewer && (
                <button type="button" onClick={() => removeExtra(f.key)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add extra field */}
      {!isViewer && (
        <>
          {showAdd ? (
            <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <input
                    className={`input text-sm w-full ${fieldErrs.label ? 'border-red-400 bg-red-50' : ''}`}
                    placeholder="Field name  e.g. Policy Number"
                    autoFocus
                    value={newField.label}
                    onChange={handleNewFieldLabelChange}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addField(); } }} />
                  {fieldErrs.label && <p className="text-red-500 text-xs mt-1">{fieldErrs.label}</p>}
                </div>
                <div className="w-32">
                  <input
                    className={`input text-sm w-full font-mono ${fieldErrs.key ? 'border-red-400 bg-red-50' : ''}`}
                    placeholder="key_name"
                    value={newField.key}
                    onChange={handleNewFieldKeyChange}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addField(); } }} />
                  {fieldErrs.key && <p className="text-red-500 text-xs mt-1">{fieldErrs.key}</p>}
                </div>
                <div className="relative">
                  <select className="input text-sm w-28 appearance-none pr-6 cursor-pointer"
                    value={newField.type} onChange={e => { setNewField(p => ({ ...p, type: e.target.value, options: '' })); setFieldErrs(p => ({ ...p, options: '' })); }}>
                    {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button type="button" onClick={addField}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                  Add
                </button>
                <button type="button" onClick={() => { setShowAdd(false); setFieldErrs({}); setNewField({ label: '', key: '', type: 'text', options: '' }); keyAutoFilledRef.current = true; }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
              </div>
              {newField.type === 'select' && (
                <div>
                  <input
                    className={`input text-xs w-full ${fieldErrs.options ? 'border-red-400 bg-red-50' : ''}`}
                    placeholder="Options comma-separated  e.g. BTC,ETH,SOL"
                    value={newField.options}
                    onChange={e => { setNewField(p => ({ ...p, options: e.target.value })); setFieldErrs(p => ({ ...p, options: '' })); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addField(); } }} />
                  {fieldErrs.options && <p className="text-red-500 text-xs mt-1">{fieldErrs.options}</p>}
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
              <Plus size={13} /> Add custom field
            </button>
          )}
        </>
      )}

      {!isViewer && (
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}
    </form>
  );
}

// ── Main ──────────────────────────────────────────────
export default function FormFiller({ form, existing, onSuccess }) {
  const { user } = useAuthStore();
  const isViewer = user?.role === 'viewer';

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {form.formType === 'table'
          ? <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"><Table2 size={12} /> Table</span>
          : <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"><FileText size={12} /> Record</span>
        }
        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
          <Lock size={10} /> All data encrypted
        </span>
        {isViewer && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
            <Eye size={12} /> Read-only Access
          </span>
        )}
        {existing && !isViewer && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 font-medium">Updating</span>}
      </div>

      {form.formType === 'table'
        ? <TableForm  form={form} existing={existing} onSuccess={onSuccess} isViewer={isViewer} />
        : <RecordForm form={form} existing={existing} onSuccess={onSuccess} isViewer={isViewer} />
      }
    </div>
  );
}
