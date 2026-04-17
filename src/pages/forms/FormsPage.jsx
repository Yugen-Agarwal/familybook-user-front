import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formsApi, dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { FileText, ClipboardList, Table2, Pencil, Plus, Trash2, Settings, Eye, User } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
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
          {form.formType === 'table' ? <Table2 size={19} className="text-indigo-500" /> : <FileText size={19} className="text-indigo-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 leading-tight truncate">{form.title}</h3>
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
        <span className={`badge text-[10px] ${form.formType === 'table' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
          {form.formType === 'table' ? '⊞ Table' : '☰ Record'}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <ClipboardList size={11} /> {form.fields?.length || 0} fields
        </span>
        {hasData && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Filled</span>}
      </div>

      <button className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        style={hasData
          ? { background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4338ca' }
          : { background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }
        }
        onClick={onFill}>
        {isViewer ? <><Eye size={14} /> View Details</> : (hasData ? <><Pencil size={14} /> Update</> : <><Plus size={14} /> Fill Form</>)}
      </button>
    </div>
  );
}

export default function FormsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isViewer = user?.role === 'viewer';

  const [filling,   setFilling]   = useState(null);
  const [building,  setBuilding]  = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [deletingForm, setDeletingForm] = useState(null);

  const { data: adminFormsRes, isLoading: loadingAdmin } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  });

  const { data: myFormsRes, isLoading: loadingMy } = useQuery({
    queryKey: ['my-forms'],
    queryFn: formsApi.getMy,
    enabled: !isViewer,
  });

  const { data: submissionsRes } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => dataApi.getAll({ limit: 200 }),
    enabled: !isViewer,
  });

  const adminForms = adminFormsRes?.data?.data || [];
  const myForms    = myFormsRes?.data?.data    || [];
  const submissions = submissionsRes?.data?.data || [];

  const submissionMap = {};
  submissions.forEach(s => { if (s.formId) submissionMap[s.formId.toString()] = s; });

  const deleteMutation = useMutation({
    mutationFn: formsApi.removeMy,
    onSuccess: () => { toast?.success?.('Form deleted'); qc.invalidateQueries({ queryKey: ['my-forms'] }); setDeletingForm(null); },
    onError: () => {},
  });

  const isLoading = loadingAdmin || loadingMy;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Forms</h1>
          <p className="page-subtitle">Fill forms or create your own</p>
        </div>
        {!isViewer && (
          <button onClick={() => setBuilding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
            <Plus size={16} /> Create My Form
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Admin forms */}
          {adminForms.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">From Administrator</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminForms.map(form => (
                  <FormCard key={form._id} form={form} existing={submissionMap[form._id?.toString()]}
                    isOwned={false} isViewer={isViewer}
                    onFill={() => setFilling({ form, existing: submissionMap[form._id?.toString()] })} />
                ))}
              </div>
            </div>
          )}

          {/* My forms */}
          {!isViewer && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">My Forms</p>
              {myForms.length === 0 ? (
                <div className="card text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                    <FileText size={20} className="text-indigo-300" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No personal forms yet</p>
                  <p className="text-gray-400 text-xs mt-1">Create your own form to track custom data</p>
                  <button onClick={() => setBuilding(true)}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                    <Plus size={14} /> Create My Form
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myForms.map(form => (
                    <FormCard key={form._id} form={form} existing={submissionMap[form._id?.toString()]}
                      isOwned={true} isViewer={isViewer}
                      onFill={() => setFilling({ form, existing: submissionMap[form._id?.toString()] })}
                      onEdit={() => setEditingForm(form)}
                      onDelete={() => setDeletingForm(form._id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {adminForms.length === 0 && (isViewer || myForms.length === 0) && (
            <EmptyState icon={FileText} title="No forms available" description="No forms yet" />
          )}
        </>
      )}

      {/* Fill modal */}
      <Modal open={!!filling} onClose={() => setFilling(null)} title={filling?.form?.title}
        size={filling?.form?.formType === 'table' ? 'xl' : 'lg'}>
        {filling && (
          <FormFiller form={filling.form} existing={filling.existing}
            onSuccess={() => { setFilling(null); qc.invalidateQueries({ queryKey: ['my-submissions'] }); }} />
        )}
      </Modal>

      {/* Create my form modal */}
      <Modal open={building || !!editingForm} onClose={() => { setBuilding(false); setEditingForm(null); }}
        title={editingForm ? 'Edit My Form' : 'Create My Form'} size="xl">
        <UserFormBuilder
          initial={editingForm}
          onSuccess={() => { setBuilding(false); setEditingForm(null); qc.invalidateQueries({ queryKey: ['my-forms'] }); }} />
      </Modal>

      <ConfirmDialog open={!!deletingForm} onClose={() => setDeletingForm(null)}
        onConfirm={() => deleteMutation.mutate(deletingForm)} loading={deleteMutation.isPending}
        title="Delete Form" message="This will permanently delete your form and its data. Continue?" />
    </div>
  );
}
