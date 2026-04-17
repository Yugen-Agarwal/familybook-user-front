import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { viewerApi } from '../../lib/api';
import { Plus, Trash2, Users, Copy, Eye, EyeOff, CheckCircle2, Info, UserCheck, RefreshCw, Mail, Search, SlidersHorizontal, Pencil } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useForm } from 'react-hook-form';

const TYPE_CONFIG = {
  viewer: {
    label: 'Viewer',
    desc:  'Read-only access',
    color: 'bg-gray-100 text-gray-600',
    border: 'border-gray-200',
    icon:  Eye,
  },
};

function ViewerForm({ viewer, onSuccess }) {
  const isEdit = !!viewer;
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ 
    defaultValues: isEdit 
      ? { email: viewer.email, mobile: viewer.mobile || '', type: viewer.type, name: viewer.name } 
      : { type: 'viewer' } 
  });
  const [showPass, setShowPass] = useState(false);
  const [created, setCreated]   = useState(null);
  const selectedType = watch('type');

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => isEdit ? viewerApi.update(viewer._id, data) : viewerApi.create(data),
    onSuccess: ({ data }) => { 
      if (!isEdit && data.data) setCreated(data.data); 
      reset(); 
      onSuccess(); 
      if (isEdit) toast.success('Updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'}`),
  });

  if (created) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
          <CheckCircle2 size={16} />
          <p className="text-sm font-medium">Credential created successfully</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Share these details</p>
          <div className="flex items-center justify-between bg-white rounded-lg px-3.5 py-3 border border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Login Email</p>
              <p className="text-sm font-semibold text-gray-800">{created.email}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(created.email); toast.success('Copied!'); }}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
              <Copy size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${TYPE_CONFIG[created.type]?.color}`}>
              {TYPE_CONFIG[created.type]?.label}
            </span>
            <span className="text-xs text-gray-400">{TYPE_CONFIG[created.type]?.desc}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs">Share the password separately — it cannot be retrieved again. {isEdit ? '' : 'User will need this to login.'}</p>
        </div>
        <button className="btn-secondary w-full" onClick={() => setCreated(null)}>Create another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(mutate)} className="space-y-4">
      {/* Type selector (Hidden now since only viewer is allowed) */}
      <input type="hidden" value="viewer" {...register('type')} />

      {/* Name */}
      <div>
        <label className="label">Full Name</label>
        <div className="relative">
          <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input input-icon" placeholder="e.g. Family Member"
            {...register('name', { required: 'Name is required' })} />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="label">Email address</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input input-icon" type="email" placeholder="visitor@example.com"
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })} />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="label">Mobile Number</label>
        <div className="relative">
          <RefreshCw size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input 
            className="input input-icon" 
            placeholder="e.g. 9876543210"
            maxLength="10"
            {...register('mobile', {
              pattern: { value: /^\d{10}$/, message: 'Must be exactly 10 digits' },
            })} 
            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); }}
          />
        </div>
        {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="label">{isEdit ? 'New Password (keep blank to stay same)' : 'Password'}</label>
        <div className="relative">
          <input className="input pr-10" type={showPass ? 'text' : 'password'} placeholder={isEdit ? 'Leave blank if not changing' : 'Set a password'}
            {...register('password', { required: !isEdit && 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? (isEdit ? 'Updating…' : 'Creating…') : (isEdit ? 'Update info' : 'Create credential')}
      </button>
    </form>
  );
}

export default function ViewersPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [revoking, setRevoking]     = useState(null);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [confirmingType, setConfirmingType] = useState(null); // { id, newType }
  const [viewingAccount, setViewingAccount] = useState(null);
  const [editingViewer, setEditingViewer] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['viewers'],
    queryFn: viewerApi.list,
  });

  const allViewers = res?.data?.data || [];

  // Client-side filter
  const viewers = allViewers.filter(v => {
    const matchType   = !typeFilter || v.type === typeFilter;
    const matchSearch = !search || v.email?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const revokeMutation = useMutation({
    mutationFn: viewerApi.revoke,
    onSuccess: () => { toast.success('Credential revoked'); qc.invalidateQueries({ queryKey: ['viewers'] }); setRevoking(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => viewerApi.toggle(id),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['viewers'] }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-gray-900">Access Credentials</h1>
          <p className="page-subtitle">Manage who can access your family data</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowCreate(true)} 
        >
          <Plus size={16} /> Create Credential
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input input-icon"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : viewers.length === 0 ? (
        <EmptyState icon={Users} title="No credentials yet"
          description="Create credentials to share access to your family data"
          action={<button className="btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create Credential</button>} />
      ) : (
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Contact</th>
                <th className="th">Type</th>
                <th className="th hidden md:table-cell">Created</th>
                <th className="th">Status</th>
                <th className="th w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {viewers.map((v) => {
                const cfg = TYPE_CONFIG[v.type] || TYPE_CONFIG.viewer;
                const Icon = cfg.icon;
                return (
                  <tr key={v._id} className="tr-hover">
                    <td className="td">
                      <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                    </td>
                    <td className="td">
                      <p className="text-sm text-gray-700">{v.email || '—'}</p>
                      <p className="text-[10px] text-gray-400">{v.mobile || '—'}</p>
                    </td>

                    {/* Type with change button */}
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${cfg.color} flex items-center gap-1`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </div>
                    </td>

                    <td className="td text-gray-400 text-xs hidden md:table-cell">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>

                    {/* Active toggle */}
                    <td className="td">
                      <button onClick={() => toggleMutation.mutate(v._id)}
                        className={`relative w-9 h-5 rounded-full transition-all duration-300 flex-shrink-0 group ${v.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'bg-gray-200'}`}
                        disabled={toggleMutation.isPending}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${v.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </td>

                    <td className="td text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <button onClick={() => setViewingAccount(v)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Info">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setEditingViewer(v)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Info">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setRevoking(v._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Revoke">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Access Credential" size="sm">
        <ViewerForm onSuccess={() => { qc.invalidateQueries({ queryKey: ['viewers'] }); setShowCreate(false); }} />
      </Modal>

      <Modal open={!!editingViewer} onClose={() => setEditingViewer(null)} title="Edit Access Credential" size="sm">
        <ViewerForm viewer={editingViewer} onSuccess={() => { qc.invalidateQueries({ queryKey: ['viewers'] }); setEditingViewer(null); }} />
      </Modal>

      <ConfirmDialog open={!!revoking} onClose={() => setRevoking(null)}
        onConfirm={() => revokeMutation.mutate(revoking)} loading={revokeMutation.isPending}
        title="Revoke Credential" message="This credential will immediately lose access. This cannot be undone." />



      <Modal open={!!viewingAccount} onClose={() => setViewingAccount(null)} title="Account Information" size="sm">
        {viewingAccount && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-2 border-b border-gray-50">
               <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                 <Users size={32} />
               </div>
               <h3 className="font-bold text-gray-900 text-lg">{viewingAccount.name}</h3>
               <p className="text-sm text-gray-500 font-medium">{viewingAccount.email || viewingAccount.mobile}</p>
               {viewingAccount.email && viewingAccount.mobile && (
                 <p className="text-[11px] text-gray-400 font-medium">{viewingAccount.mobile}</p>
               )}
               <span className={`badge ${TYPE_CONFIG[viewingAccount.type]?.color} mt-1`}>
                 {TYPE_CONFIG[viewingAccount.type]?.label} Account
               </span>
            </div>

            <div className="grid gap-4">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Type Description</p>
                <p className="text-sm text-gray-600 font-medium">{TYPE_CONFIG[viewingAccount.type]?.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${viewingAccount.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <p className="text-sm text-gray-700 font-semibold">{viewingAccount.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date Created</p>
                  <p className="text-sm text-gray-700 font-semibold">{new Date(viewingAccount.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Permission Scope</p>
                <ul className="text-xs text-gray-500 space-y-1 pt-1">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full" /> No permission to edit/delete</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full" /> Can only view shared forms</li>
                </ul>
              </div>
            </div>

            <button className="btn-secondary w-full" onClick={() => setViewingAccount(null)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
