import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi } from '../../lib/api';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const FIELD_TYPES = ['text', 'number', 'date', 'file', 'select', 'boolean'];

function FieldRow({ sectionIndex, fieldIndex, register, remove }) {
  return (
    <div className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
      <GripVertical size={16} className="text-gray-300 mt-2 flex-shrink-0" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
        <input className="input" placeholder="Label" {...register(`sections.${sectionIndex}.fields.${fieldIndex}.label`, { required: true })} />
        <input className="input" placeholder="Key (snake_case)" {...register(`sections.${sectionIndex}.fields.${fieldIndex}.key`, { required: true })} />
        <select className="input" {...register(`sections.${sectionIndex}.fields.${fieldIndex}.type`)}>
          {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" {...register(`sections.${sectionIndex}.fields.${fieldIndex}.required`)} />
            Required
          </label>
          <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" {...register(`sections.${sectionIndex}.fields.${fieldIndex}.encrypted`)} />
            Encrypt
          </label>
          <button type="button" onClick={() => remove(fieldIndex)} className="text-red-400 hover:text-red-600 ml-auto">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ sectionIndex, register, control, removeSection }) {
  const { fields, append, remove } = useFieldArray({ control, name: `sections.${sectionIndex}.fields` });

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          className="input flex-1"
          placeholder="Section name"
          {...register(`sections.${sectionIndex}.sectionName`, { required: true })}
        />
        <button type="button" onClick={() => removeSection(sectionIndex)} className="text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((f, fi) => (
          <FieldRow key={f.id} sectionIndex={sectionIndex} fieldIndex={fi} register={register} remove={remove} />
        ))}
      </div>
      <button
        type="button"
        className="btn-secondary text-xs"
        onClick={() => append({ label: '', key: '', type: 'text', required: false, encrypted: false })}
      >
        <Plus size={14} /> Add Field
      </button>
    </div>
  );
}

export default function FormBuilder({ initial, onSuccess }) {
  const isEdit = !!initial;

  const { register, handleSubmit, control } = useForm({
    defaultValues: initial || {
      title: '',
      description: '',
      sections: [{ sectionName: '', fields: [{ label: '', key: '', type: 'text', required: false, encrypted: false }] }],
    },
  });

  const { fields: sections, append: addSection, remove: removeSection } = useFieldArray({ control, name: 'sections' });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => isEdit ? formsApi.update(initial._id, data) : formsApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Form updated' : 'Form created');
      onSuccess();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed'),
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Form Title</label>
          <input className="input" placeholder="e.g. Family Insurance" {...register('title', { required: true })} />
        </div>
        <div>
          <label className="label">Description</label>
          <input className="input" placeholder="Optional description" {...register('description')} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Sections</h3>
          <button type="button" className="btn-secondary text-xs" onClick={() => addSection({ sectionName: '', fields: [] })}>
            <Plus size={14} /> Add Section
          </button>
        </div>
        {sections.map((s, si) => (
          <SectionBlock key={s.id} sectionIndex={si} register={register} control={control} removeSection={removeSection} />
        ))}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update Form' : 'Create Form'}
        </button>
      </div>
    </form>
  );
}
