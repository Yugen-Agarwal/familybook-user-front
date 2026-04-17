import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi } from '../../lib/api';
import { Plus, Trash2, GripVertical, ChevronDown, Table2, FileText, Lock } from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text',    label: 'Text' },
  { value: 'number',  label: 'Number' },
  { value: 'date',    label: 'Date' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'select',  label: 'Dropdown' },
];

const FORM_TYPES = [
  { value: 'table',  icon: Table2,   title: 'Table',  desc: 'Multiple rows — like a list', grad: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { value: 'record', icon: FileText, title: 'Record', desc: 'Single entry — like a document', grad: 'linear-gradient(135deg,#10b981,#34d399)' },
];

export default function UserFormBuilder({ initial, onSuccess }) {
  const isEdit = !!initial;

  const defaultValues = initial
    ? { ...initial, fields: initial.fields?.map(f => ({ ...f, options: Array.isArray(f.options) ? f.options.join(',') : (f.options || '') })) }
    : { title: '', description: '', formType: 'record', fields: [{ label: '', key: '', type: 'text', options: '' }] };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const selectedType = watch('formType');

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => isEdit ? formsApi.updateMy(initial._id, data) : formsApi.createMy(data),
    onSuccess: () => { toast.success(isEdit ? 'Form updated' : 'Form created'); onSuccess(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed'),
  });

  const onSubmit = (values) => {
    mutate({
      ...values,
      fields: values.fields.map(f => ({
        ...f,
        key: f.key || f.label.toLowerCase().replace(/\s+/g, '_'),
        options: f.options ? f.options.split(',').map(o => o.trim()).filter(Boolean) : [],
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Form type */}
      <div>
        <label className="label">Form Type</label>
        <div className="grid grid-cols-2 gap-3">
          {FORM_TYPES.map(ft => {
            const Icon = ft.icon;
            const selected = selectedType === ft.value;
            return (
              <label key={ft.value}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selected ? 'border-indigo-400 bg-indigo-50/40' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <input type="radio" value={ft.value} className="sr-only" {...register('formType')} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: selected ? ft.grad : '#f3f4f6' }}>
                  <Icon size={18} className={selected ? 'text-white' : 'text-gray-400'} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${selected ? 'text-gray-900' : 'text-gray-500'}`}>{ft.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ft.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Title + Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Form Title <span className="text-red-400">*</span></label>
          <input className="input" placeholder="e.g. Crypto Wallets"
            {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="label">Description <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
          <input className="input" placeholder="Brief description" {...register('description')} />
        </div>
      </div>

      {/* Fields */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="label mb-0">Fields</label>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Lock size={10} className="text-amber-400" /> All fields encrypted automatically</p>
          </div>
          <button type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => append({ label: '', key: '', type: 'text', options: '' })}>
            <Plus size={13} /> Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((f, i) => {
            const type = watch(`fields.${i}.type`);
            return (
              <div key={f.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                  <input className="input text-sm flex-1" placeholder="Field label"
                    {...register(`fields.${i}.label`, { required: true })} />
                  <div className="relative w-28 flex-shrink-0">
                    <select className="input text-sm appearance-none pr-6 cursor-pointer"
                      {...register(`fields.${i}.type`)}>
                      {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button type="button" onClick={() => remove(i)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                {type === 'select' && (
                  <div className="pl-6">
                    <input className="input text-xs" placeholder="Options comma-separated  e.g. BTC,ETH,SOL"
                      {...register(`fields.${i}.options`)} />
                  </div>
                )}
              </div>
            );
          })}
          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No fields yet — click "Add Field"
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>
          {isPending ? 'Saving…' : isEdit ? 'Update Form' : 'Create Form'}
        </button>
      </div>
    </form>
  );
}
