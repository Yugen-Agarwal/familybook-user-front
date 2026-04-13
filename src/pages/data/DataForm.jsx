import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataApi } from '../../lib/api';

const SENSITIVE_FIELDS = ['bankDetails', 'personalNotes', 'insuranceData', 'documents'];

export default function DataForm({ initial, onSuccess }) {
  const isEdit = !!initial;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category: initial?.category || 'general',
      jsonData: initial?.data ? JSON.stringify(initial.data, null, 2) : '{\n  \n}',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      isEdit ? dataApi.update(initial._id, payload) : dataApi.create(payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Entry updated' : 'Entry created');
      onSuccess();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed'),
  });

  const onSubmit = (values) => {
    let parsed;
    try {
      parsed = JSON.parse(values.jsonData);
    } catch {
      toast.error('Invalid JSON in data field');
      return;
    }
    mutate({ category: values.category, data: parsed, sensitiveFields: SENSITIVE_FIELDS });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Category</label>
        <select className="input" {...register('category', { required: true })}>
          <option value="general">General</option>
          <option value="family">Family</option>
          <option value="assets">Assets</option>
          <option value="insurance">Insurance</option>
          <option value="documents">Documents</option>
        </select>
      </div>
      <div>
        <label className="label">Data (JSON)</label>
        <p className="text-xs text-gray-400 mb-1">
          Sensitive fields (bankDetails, personalNotes, insuranceData, documents) are auto-encrypted.
        </p>
        <textarea
          className="input font-mono text-xs"
          rows={14}
          {...register('jsonData', { required: 'Data is required' })}
        />
        {errors.jsonData && <p className="text-red-500 text-xs mt-1">{errors.jsonData.message}</p>}
      </div>
      <div className="flex justify-end gap-3">
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}
