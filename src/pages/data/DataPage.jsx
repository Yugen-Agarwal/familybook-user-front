import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Pencil, Trash2, Database, Search } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import DataForm from './DataForm';
import DataDetail from './DataDetail';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Family Data</h1>
        {!isViewer && (
          <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Entry
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="input w-auto" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          <option value="family">Family</option>
          <option value="assets">Assets</option>
          <option value="insurance">Insurance</option>
          <option value="documents">Documents</option>
          <option value="general">General</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No entries yet"
            description="Start adding your family data"
            action={!isViewer && <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Entry</button>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button className="font-medium text-brand hover:underline capitalize" onClick={() => setViewing(r)}>
                      {r.category}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {!isViewer && (
                        <>
                          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500" onClick={() => { setEditing(r); setShowForm(true); }}>
                            <Pencil size={15} />
                          </button>
                          <button className="p-1.5 rounded hover:bg-red-50 text-red-500" onClick={() => setDeleting(r._id)}>
                            <Trash2 size={15} />
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

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Entry' : 'Add Entry'} size="lg">
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
