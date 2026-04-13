import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import FormBuilder from './FormBuilder';
import FormDetail from './FormDetail';

export default function FormsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isUser = user?.role === 'user';

  const [showBuilder, setShowBuilder] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  });

  const forms = res?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: formsApi.remove,
    onSuccess: () => {
      toast.success('Form deleted');
      qc.invalidateQueries({ queryKey: ['forms'] });
      setDeleting(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Forms</h1>
        {isUser && (
          <button className="btn-primary" onClick={() => { setEditing(null); setShowBuilder(true); }}>
            <Plus size={16} /> Create Form
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : forms.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No forms yet"
          description={isUser ? 'Create your first dynamic form' : 'No forms available'}
          action={isUser && (
            <button className="btn-primary" onClick={() => setShowBuilder(true)}>
              <Plus size={16} /> Create Form
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <div key={form._id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewing(form)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{form.title}</h3>
                  {form.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{form.description}</p>}
                  <p className="text-xs text-gray-400 mt-2">{form.sections?.length} section(s)</p>
                </div>
                {isUser && (
                  <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500" onClick={() => { setEditing(form); setShowBuilder(true); }}>
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-red-50 text-red-500" onClick={() => setDeleting(form._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showBuilder} onClose={() => { setShowBuilder(false); setEditing(null); }} title={editing ? 'Edit Form' : 'Create Form'} size="xl">
        <FormBuilder
          initial={editing}
          onSuccess={() => { setShowBuilder(false); setEditing(null); qc.invalidateQueries({ queryKey: ['forms'] }); }}
        />
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title} size="lg">
        {viewing && <FormDetail form={viewing} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting)}
        loading={deleteMutation.isPending}
        title="Delete Form"
        message="This will permanently delete the form. Continue?"
      />
    </div>
  );
}
