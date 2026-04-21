import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi, dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useDebounce } from '../../hooks/useDebounce';
import {
  FileText, ClipboardList, Table2, Pencil,
  Plus, Trash2, Settings, Eye, Search, SlidersHorizontal, X,
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import FormFiller from './FormFiller';
import UserFormBuilder from './UserFormBuilder';

function FormCard({ form, existing, isOwned, isViewer, onFill, onEdit, onDelete }) {
  const hasData = !!existing;
  return (
    <div className="card flex flex-col" style={{ boxShadow: '0 1px 4px rgb(0 0 0/.05)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)' }}>
          {form.formType === 'table'
            ? <Table2 size={19} className="text-indigo-500" />
            : <FileText size={19} className="text-indigo-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-tight truncate">{form.title}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className={`badge text-[10px] ${form.formType === 'table' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
              {form.formType === 'table' ? '⊞ Table' : '☰ Record'}
            </span>
            {form.ownedBy
              ? <span className="text-[10px] font-semibold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Mine</span>
              : <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Admin</span>
            }
          </div>
          {form.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{form.description}</p>}
        </div>
        {isOwned && (
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"><Settings size={14} /></button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <ClipboardList size={11} /> {form.fields?.length || 0} fields
        </span>
        {hasData && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Filled</span>}
      </div>

      <button
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        style={hasData
          ? { background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4338ca' }
          : { background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }
        }
        onClick={onFill}>
        {isViewer
          ? <><Eye size={14} /> View Details</>
          : hasData ? <><Pencil size={14} /> Update</> : <><Plus size={14} /> Fill Form</>}
      </button>
    </div>
  );
}

export default function FormsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isViewer = user?.role === 'viewer';

  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [filledFilter, setFilled] = useState(''); // '' | 'filled' | 'unfilled'
  const [filling,   setFilling]   = useState(null);
  const [building,  setBuilding]  = useState(false);
  const [editingForm, setEditingForm]   = useState(null);
  const [deletingForm, setDeletingForm] = useState(null);

  const debouncedSearch = useDebounce(search, 350);
  const hasFilters = !!(debouncedSearch || createdBy || filledFilter);

  const { data: formsRes, isLoading } = useQuery({
    queryKey: ['forms', { page, search: debouncedSearch, createdBy, filled: filledFilter }],
    queryFn: () => formsApi.getAll({
      page, limit: 12,
      search:    debouncedSearch || undefined,
      createdBy: createdBy       || undefined,
      filled:    filledFilter    || undefined,
    }),
  });

  const { data: submissionsRes } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => dataApi.getAll({ limit: 200 }),
    enabled: !isViewer,
  });

  const forms      = formsRes?.data?.data       || [];
  const pagination = formsRes?.data?.pagination;
  const submissions = submissionsRes?.data?.data || [];

  const submissionMap = {};
  submissions.forEach(s => { if (s.formId) submissionMap[s.formId.toString()] = s; });

  const deleteMutation = useMutation({
    mutationFn: formsApi.removeMy,
    onSuccess: () => {
      toast.success('Form deleted');
      qc.invalidateQueries({ queryKey: ['forms'] });
      setDeletingForm(null);
    },
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Forms</h1>
          <p className="page-subtitle">Fill forms or create your own</p>
        </div>
        {!isViewer && (
          <button onClick={() => setBuilding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
            <Plus size={16} /> Create My Form
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input input-icon py-2 text-sm"
          />
        </div>

        {/* Created By */}
        {!isViewer && (
          <div className="relative flex-shrink-0">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={createdBy}
              onChange={e => { setCreatedBy(e.target.value); setPage(1); }}
              className="pl-8 pr-4 py-2 rounded-xl border text-sm font-medium appearance-none cursor-pointer focus:outline-none transition-all"
              style={{
                borderColor:     createdBy ? '#6366f1' : '#e5e7eb',
                backgroundColor: createdBy ? '#eef2ff' : '#fff',
                color:           createdBy ? '#4338ca' : '#6b7280',
              }}
            >
              <option value="">All Forms</option>
              <option value="admin">By Admin</option>
              <option value="mine">My Forms</option>
            </select>
          </div>
        )}

        {/* Filled status */}
        {!isViewer && (
          <div className="relative flex-shrink-0">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={filledFilter}
              onChange={e => setFilled(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-xl border text-sm font-medium appearance-none cursor-pointer focus:outline-none transition-all"
              style={{
                borderColor:     filledFilter ? '#6366f1' : '#e5e7eb',
                backgroundColor: filledFilter ? '#eef2ff' : '#fff',
                color:           filledFilter ? '#4338ca' : '#6b7280',
              }}
            >
              <option value="">All Status</option>
              <option value="filled">Filled</option>
              <option value="unfilled">Not Filled</option>
            </select>
          </div>
        )}

        {hasFilters && (
          <button onClick={() => { setSearch(''); setCreatedBy(''); setFilled(''); setPage(1); }}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-2 rounded-lg hover:bg-red-50">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : forms.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={hasFilters ? 'No forms match your filters' : 'No forms available'}
          description={hasFilters ? 'Try adjusting your search' : 'No forms yet'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map(form => {
            const isOwned = form.ownedBy && form.ownedBy._id === user?._id || form.ownedBy?._id?.toString() === user?.id;
            return (
              <FormCard
                key={form._id}
                form={form}
                existing={submissionMap[form._id?.toString()]}
                isOwned={isOwned}
                isViewer={isViewer}
                onFill={() => setFilling({ form, existing: submissionMap[form._id?.toString()] })}
                onEdit={() => setEditingForm(form)}
                onDelete={() => setDeletingForm(form._id)}
              />
            );
          })}
        </div>
      )}

      <Pagination page={page} pages={pagination?.pages || 1} total={pagination?.total} onPage={setPage} />

      {/* Fill modal */}
      <Modal open={!!filling} onClose={() => setFilling(null)} title={filling?.form?.title}
        size={filling?.form?.formType === 'table' ? 'xl' : 'lg'}>
        {filling && (
          <FormFiller form={filling.form} existing={filling.existing}
            onSuccess={() => { setFilling(null); qc.invalidateQueries({ queryKey: ['my-submissions'] }); }} />
        )}
      </Modal>

      {/* Create / Edit my form */}
      <Modal open={building || !!editingForm} onClose={() => { setBuilding(false); setEditingForm(null); }}
        title={editingForm ? 'Edit My Form' : 'Create My Form'} size="xl">
        <UserFormBuilder
          initial={editingForm}
          onSuccess={() => { setBuilding(false); setEditingForm(null); qc.invalidateQueries({ queryKey: ['forms'] }); }} />
      </Modal>

      <ConfirmDialog open={!!deletingForm} onClose={() => setDeletingForm(null)}
        onConfirm={() => deleteMutation.mutate(deletingForm)} loading={deleteMutation.isPending}
        title="Delete Form" message="This will permanently delete your form. Continue?" />
    </div>
  );
}
