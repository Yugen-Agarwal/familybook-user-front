import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Trash2, Lock, Table2, FileText, ChevronDown, Eye } from 'lucide-react';

const FIELD_TYPES = ['text', 'number', 'date', 'boolean', 'select'];

// Single field input
function FieldInput({ field, name, register, disabled }) {
  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <input type="checkbox" id={name} className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:opacity-50" disabled={disabled} {...register(name)} />
        <label htmlFor={name} className="text-sm text-gray-700 cursor-pointer">{field.label}</label>
      </div>
    );
  }
  if (field.type === 'select' && field.options?.length) {
    return (
      <select className="input disabled:bg-gray-50 disabled:text-gray-500" disabled={disabled} {...register(name)}>
        <option value="">Select…</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
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
  const [newCol, setNewCol] = useState({ label: '', type: 'text' });

  const { register, control, handleSubmit } = useForm({ defaultValues: { rows: existingRows } });
  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });

  const allFields = [
    ...form.fields,
    ...extraCols.map(c => ({ ...c, key: c.key || c.label.toLowerCase().replace(/\s+/g, '_') })),
  ];

  const addCol = () => {
    if (!newCol.label.trim()) return;
    const key = newCol.label.toLowerCase().replace(/\s+/g, '_');
    setExtraCols(prev => [...prev, { label: newCol.label, key, type: newCol.type }]);
    setNewCol({ label: '', type: 'text' });
    setShowAddCol(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => dataApi.create(payload),
    onSuccess: () => { toast.success('Saved!'); onSuccess?.(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const onSubmit = (values) => {
    mutate({
      formId:   form._id,
      category: form.title.toLowerCase().replace(/\s+/g, '_'),
      data:     { rows: values.rows, _extraCols: extraCols },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="px-4 py-3 border-t border-gray-100 bg-indigo-50/30 flex items-center gap-2 flex-wrap">
            <input className="input text-sm flex-1 min-w-[140px]" placeholder="Column name"
              value={newCol.label} onChange={e => setNewCol(p => ({ ...p, label: e.target.value }))} />
            <div className="relative">
              <select className="input text-sm w-28 appearance-none pr-6 cursor-pointer"
                value={newCol.type} onChange={e => setNewCol(p => ({ ...p, type: e.target.value }))}>
                {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button type="button" onClick={addCol}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
              Add
            </button>
            <button type="button" onClick={() => setShowAddCol(false)}
              className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
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
  const [newField, setNewField] = useState({ label: '', type: 'text' });

  const { register, handleSubmit } = useForm({
    defaultValues: existing?.data || {},
  });

  const addField = () => {
    if (!newField.label.trim()) return;
    const key = '_x_' + newField.label.toLowerCase().replace(/\s+/g, '_');
    setExtraFields(prev => [...prev, { label: newField.label, key, type: newField.type }]);
    setNewField({ label: '', type: 'text' });
    setShowAdd(false);
  };

  const removeExtra = (key) => setExtraFields(prev => prev.filter(f => f.key !== key));

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => dataApi.create(payload),
    onSuccess: () => { toast.success('Saved!'); onSuccess?.(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const onSubmit = (values) => {
    mutate({
      formId:   form._id,
      category: form.title.toLowerCase().replace(/\s+/g, '_'),
      data:     { ...values, _extraFields: extraFields },
    });
  };

  const allFields = [...form.fields, ...extraFields];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {form.description && <p className="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">{form.description}</p>}

      <div className="space-y-3">
        {allFields.map(f => (
          <div key={f.key} className="flex items-start gap-2">
            <div className="flex-1">
              <label className="label flex items-center gap-1.5">
                <Lock size={10} className="text-amber-400" /> {f.label}
              </label>
              <FieldInput field={f} name={f.key} register={register} disabled={isViewer} />
            </div>
            {/* Remove extra fields */}
            {f.key.startsWith('_x_') && !isViewer && (
              <button type="button" onClick={() => removeExtra(f.key)}
                className="mt-6 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add extra field */}
      {!isViewer && (
        <>
          {showAdd ? (
            <div className="flex items-center gap-2 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 flex-wrap">
              <input className="input text-sm flex-1 min-w-[140px]" placeholder="Field name"
                value={newField.label} onChange={e => setNewField(p => ({ ...p, label: e.target.value }))} />
              <div className="relative">
                <select className="input text-sm w-28 appearance-none pr-6 cursor-pointer"
                  value={newField.type} onChange={e => setNewField(p => ({ ...p, type: e.target.value }))}>
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button type="button" onClick={addField}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                Add
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
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
