import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Pencil, Trash2, Database, Search, SlidersHorizontal } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import DataForm from './DataForm';
import DataDetail from './DataDetail';

const CATEGORY_COLORS = {
  family:    'bg-violet-100 text-violet-700',
  assets:    'bg-amber-100 text-amber-700',
  insurance: 'bg-blue-100 text-blue-700',
  documents: 'bg-emerald-100 text-emerald-700',
  general:   'bg-gray-100 text-gray-600',
};

export default function DataPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isViewer = user?.role === 'viewer';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['data', { page, search, category }],
    queryFn: () => dataApi.getAll({ page, limit: 10, search, category }),
  });

  const records = res?.data?.data || [];
  const pagination = res?.data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: dataApi.remove,
    onSuccess: () => {
      toast.success('Entry deleted');
      qc.invalidateQueries({ queryKey: ['data'] });
      setDeleting(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Family Data</h1>
          <p className="page-subtitle">Manage your encrypted family records</p>
        </div>
        {!isViewer && (
          <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Entry
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input input-icon"
            placeholder="Search entries…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            className="input input-icon w-auto pr-4 appearance-none cursor-pointer"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All categories</option>
            <option value="family">Family</option>
            <option value="assets">Assets</option>
            <option value="insurance">Insurance</option>
            <option value="documents">Documents</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No entries yet"
            description="Start adding your family data"
            action={!isViewer && (
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add Entry
              </button>
            )}
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Category</th>
                <th className="th hidden md:table-cell">Created</th>
                <th className="th hidden md:table-cell">Updated</th>
                <th className="th w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((r) => (
                <tr key={r._id} className="tr-hover">
                  <td className="td">
                    <button
                      className="flex items-center gap-2.5 group"
                      onClick={() => setViewing(r)}
                    >
                      <span className={`badge ${CATEGORY_COLORS[r.category] || 'badge-gray'} capitalize`}>
                        {r.category}
                      </span>
                    </button>
                  </td>
                  <td className="td text-gray-400 hidden md:table-cell">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="td text-gray-400 hidden md:table-cell">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1 justify-end">
                      {!isViewer && (
                        <>
                          <button
                            className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand transition-colors"
                            onClick={() => { setEditing(r); setShowForm(true); }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => setDeleting(r._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} pages={pagination?.pages || 1} onPage={setPage} />

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Entry' : 'New Entry'} size="lg">
        <DataForm
          initial={editing}
          onSuccess={() => { setShowForm(false); setEditing(null); qc.invalidateQueries({ queryKey: ['data'] }); }}
        />
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Entry Details" size="lg">
        {viewing && <DataDetail record={viewing} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting)}
        loading={deleteMutation.isPending}
        title="Delete Entry"
        message="This action cannot be undone. Are you sure?"
      />
    </div>
  );
}
