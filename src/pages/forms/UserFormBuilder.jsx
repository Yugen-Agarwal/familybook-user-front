import { useRef, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi } from '../../lib/api';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Table2, FileText, Lock } from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text',    label: 'Text' },
  { value: 'number',  label: 'Number' },
  { value: 'date',    label: 'Date' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'select',  label: 'Dropdown' },
];

const FORM_TYPES = [
  { value: 'table',  icon: Table2,   title: 'Table',  desc: 'Multiple rows — like a list',      grad: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { value: 'record', icon: FileText, title: 'Record', desc: 'Single entry — like a document',   grad: 'linear-gradient(135deg,#10b981,#34d399)' },
];

function FieldRow({ index, total, control, register, errors, remove, move, fieldType }) {
  const type = useWatch({ control, name: `fields.${index}.type`, defaultValue: fieldType ?? 'text' });
  const fieldErrors = errors?.fields?.[index];

  return (
    <div className="rounded-xl border bg-gray-50/60 p-3 space-y-2 transition-all"
      style={{ borderColor: fieldErrors ? '#fca5a5' : '#f3f4f6' }}>
      <div className="flex items-start gap-2">

        {/* Grip + arrows */}
        <GripVertical size={14} className="text-gray-300 flex-shrink-0 mt-2.5 cursor-grab" />
        <div className="flex flex-col gap-0.5 flex-shrink-0 mt-1">
          <button type="button" disabled={index === 0} onClick={() => move(index, index - 1)}
            className="p-0.5 rounded hover:bg-gray-200 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronUp size={12} />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => move(index, index + 1)}
            className="p-0.5 rounded hover:bg-gray-200 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Label */}
        <div className="flex-1">
          <input className={`input text-sm w-full ${fieldErrors?.label ? 'border-red-400 bg-red-50' : ''}`}
            placeholder="Field label  e.g. Full Name"
            {...register(`fields.${index}.label`, { required: 'Label required' })} />
          {fieldErrors?.label && <p className="text-red-500 text-xs mt-1">{fieldErrors.label.message}</p>}
        </div>

        {/* Key */}
        <div className="w-32 self-start">
          <input className={`input text-sm w-full font-mono ${fieldErrors?.key ? 'border-red-400 bg-red-50' : ''}`}
            placeholder="key_name"
            {...register(`fields.${index}.key`, {
              required: 'Key required',
              pattern: { value: /^[a-z0-9_]+$/, message: 'lowercase & _ only' },
            })} />
          {fieldErrors?.key && <p className="text-red-500 text-xs mt-1">{fieldErrors.key.message}</p>}
        </div>

        {/* Type */}
        <div className="relative w-28 flex-shrink-0 self-start">
          <select className="input text-sm appearance-none pr-6 cursor-pointer"
            {...register(`fields.${index}.type`)}>
            {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Delete */}
        <button type="button" onClick={() => remove(index)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 self-start mt-0.5">
          <Trash2 size={14} />
        </button>
      </div>

      {type === 'select' && (
        <div className="pl-10 space-y-1">
          <input className={`input text-xs w-full ${fieldErrors?.options ? 'border-red-400 bg-red-50' : ''}`}
            placeholder="Options comma-separated  e.g. BTC,ETH,SOL"
            {...register(`fields.${index}.options`, {
              validate: v => (!v || !v.trim()) ? 'At least one option required for Dropdown' : true,
            })} />
          {fieldErrors?.options && <p className="text-red-500 text-xs">{fieldErrors.options.message}</p>}
        </div>
      )}
    </div>
  );
}

export default function UserFormBuilder({ initial, onSuccess }) {
  const isEdit = !!initial;

  const defaultValues = initial
    ? { ...initial, fields: initial.fields?.map(f => ({ ...f, options: Array.isArray(f.options) ? f.options.join(',') : (f.options || '') })) }
    : { title: '', description: '', formType: 'record', fields: [{ label: '', key: '', type: 'text', options: '' }] };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({ defaultValues });
  const { fields, append, remove, move } = useFieldArray({ control, name: 'fields' });
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
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Lock size={10} className="text-amber-400" /> All fields encrypted automatically
            </p>
          </div>
          <button type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => append({ label: '', key: '', type: 'text', options: '' })}>
            <Plus size={13} /> Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((f, i) => (
            <FieldRow
              key={f.id}
              index={i}
              total={fields.length}
              control={control}
              register={register}
              errors={errors}
              remove={remove}
              move={move}
              fieldType={f.type}
            />
          ))}
          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No fields yet — click "Add Field"
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:cursor-not-allowed transition-opacity"
          style={{
            background: isPending ? 'linear-gradient(135deg,#a5b4fc,#c4b5fd)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
            boxShadow:  isPending ? 'none' : '0 4px 14px rgba(99,102,241,0.25)',
            opacity:    isPending ? 0.6 : 1,
          }}>
          {isPending ? 'Saving…' : isEdit ? 'Update Form' : 'Create Form'}
        </button>
      </div>
    </form>
  );
}
