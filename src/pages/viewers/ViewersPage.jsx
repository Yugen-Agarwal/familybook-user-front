import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { viewerApi } from '../../lib/api';
import { Plus, Trash2, Users, Copy, Eye, EyeOff } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useForm } from 'react-hook-form';

function CreateViewerForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [created, setCreated] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: viewerApi.create,
    onSuccess: ({ data }) => {
      setCreated(data.data);
      reset();
      onSuccess();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  if (created) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 mb-3">Viewer credential created. Share these details:</p>
          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
            <div>
              <p className="text-xs text-gray-500">Viewer ID</p>
              <p className="font-mono text-sm font-medium">{created.viewerId}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(created.viewerId); toast.success('Copied!'); }} className="text-gray-400 hover:text-gray-600">
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-amber-600 mt-3">⚠️ Share the password separately. It cannot be retrieved again.</p>
        </div>
        <button className="btn-secondary w-full" onClick={() => setCreated(null)}>Create Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(mutate)} className="space-y-4">
      <div>
        <label className="label">Label (optional)</label>
        <input className="input" placeholder="e.g. Spouse, Lawyer" {...register('label')} />
      </div>
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input
            className="input pr-10"
            type={showPass ? 'text' : 'password'}
            placeholder="Set a password for this viewer"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Viewer'}
      </button>
    </form>
  );
}

export default function ViewersPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [revoking, setRevoking] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['viewers'],
    queryFn: viewerApi.list,
  });

  const viewers = res?.data?.data || [];

  const revokeMutation = useMutation({
    mutationFn: viewerApi.revoke,
    onSuccess: () => {
      toast.success('Viewer access revoked');
      qc.invalidateQueries({ queryKey: ['viewers'] });
      setRevoking(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Revoke failed'),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Viewer Access</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Viewer
        </button>
      </div>

      <div className="card p-4 bg-blue-50 border-blue-100 text-sm text-blue-800">
        Viewers get read-only access to your family data. They cannot modify anything.
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : viewers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No viewers yet"
          description="Create viewer credentials to share read-only access"
          action={<button className="btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create Viewer</button>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Label</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Viewer ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {viewers.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{v.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.viewerId}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`badge ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {v.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {v.isActive && (
                      <button className="p-1.5 rounded hover:bg-red-50 text-red-500" onClick={() => setRevoking(v._id)}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Viewer Access" size="sm">
        <CreateViewerForm onSuccess={() => qc.invalidateQueries({ queryKey: ['viewers'] })} />
      </Modal>

      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        onConfirm={() => revokeMutation.mutate(revoking)}
        loading={revokeMutation.isPending}
        title="Revoke Access"
        message="This viewer will immediately lose access. Continue?"
      />
    </div>
  );
}
