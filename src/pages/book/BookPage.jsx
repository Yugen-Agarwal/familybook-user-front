import { useQuery } from '@tanstack/react-query';
import { dataApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, Lock, Eye } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

const BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace('/api', '');
function avatarSrc(a) {
  if (!a) return null;
  if (a.startsWith('data:') || a.startsWith('http')) return a;
  return `${BASE}${a}`;
}

function TableSection({ chapter }) {
  const rows = chapter.data?.rows || [];
  const extra = chapter.data?._extraCols || [];
  const cols = [
    ...chapter.fields,
    ...extra.map(c => ({ key: c.key || c.label.toLowerCase().replace(/\s+/g, '_'), label: c.label })),
  ];
  if (!rows.length) return <p className="text-sm text-gray-400 italic">No entries yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-indigo-100">
            <th className="text-left py-2 pr-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-8">#</th>
            {cols.map(c => (
              <th key={c.key} className="text-left py-2 pr-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
              <td className="py-2.5 pr-4 text-xs text-gray-300 font-medium">{i + 1}</td>
              {cols.map(c => (
                <td key={c.key} className="py-2.5 pr-6 text-gray-700">
                  {row[c.key] == null || row[c.key] === ''
                    ? <span className="text-gray-300">—</span>
                    : String(row[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordSection({ chapter }) {
  const data = chapter.data || {};
  const extra = chapter.data?._extraFields || [];
  const fields = [...chapter.fields, ...extra];
  if (!fields.length) return <p className="text-sm text-gray-400 italic">No fields.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
      {fields.map(f => (
        <div key={f.key} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</span>
          <span className="text-sm text-gray-800 font-medium">
            {data[f.key] == null || data[f.key] === ''
              ? <span className="text-gray-300 italic text-xs">—</span>
              : typeof data[f.key] === 'boolean'
                ? <span className={`text-xs font-bold ${data[f.key] ? 'text-emerald-600' : 'text-red-500'}`}>{data[f.key] ? 'Yes' : 'No'}</span>
                : String(data[f.key])}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BookPage() {
  const { user } = useAuthStore();
  const { data: res, isLoading } = useQuery({
    queryKey: ['book'],
    queryFn: dataApi.getBook,
  });
  const chapters = res?.data?.data || [];
  const avatar = avatarSrc(user?.avatar);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-0">

      {/* ── Cover ── */}
      <div className="rounded-3xl overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg,#1e2a5e 0%,#3f4bca 60%,#6366f1 100%)', boxShadow: '0 8px 40px rgba(30,42,94,0.25)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-0">

          {/* Left — avatar */}
          <div className="flex-shrink-0 flex items-center justify-center p-8 sm:p-10 sm:pr-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden flex items-center justify-center text-white text-4xl font-black border-4 border-white/20"
              style={{
                background: avatar ? 'transparent' : 'rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}>
              {avatar
                ? <img src={avatar} alt={user?.name} className="w-full h-full object-cover" />
                : initials}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch mx-8 my-8" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="sm:hidden h-px w-3/4 my-0" style={{ background: 'rgba(255,255,255,0.12)' }} />

          {/* Right — info */}
          <div className="flex-1 flex flex-col justify-center px-8 py-8 sm:pl-0 text-center sm:text-left">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Family Book</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{user?.name}</h1>
            {user?.email && (
              <p className="text-white/50 text-sm mt-1.5">{user.email}</p>
            )}
            {user?.mobile && (
              <p className="text-white/40 text-sm mt-0.5">{user.mobile}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}

      {/* ── Empty ── */}
      {!isLoading && chapters.length === 0 && (
        <div className="bg-white rounded-3xl text-center py-20 px-8"
          style={{ boxShadow: '0 2px 20px rgba(99,102,241,0.07)' }}>
          <BookOpen size={32} className="text-indigo-200 mx-auto mb-3" />
          <p className="font-bold text-gray-700 mb-1">Your book is empty</p>
          <p className="text-sm text-gray-400 mb-5">Fill some forms to see your data here</p>
          <Link to="/forms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', textDecoration: 'none' }}>
            <Eye size={14} /> Go to Forms
          </Link>
        </div>
      )}

      {/* ── Sections ── */}
      {!isLoading && chapters.length > 0 && (
        <div className="bg-white rounded-3xl overflow-hidden divide-y divide-gray-100"
          style={{ boxShadow: '0 2px 24px rgba(99,102,241,0.07)' }}>
          {chapters.map((ch, i) => (
            <section key={ch.formId} id={`section-${i}`} className="px-8 py-8">
              {/* Section title */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900">{ch.title}</h2>
                  {ch.description && <p className="text-xs text-gray-400 mt-0.5">{ch.description}</p>}
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-1">
                  {new Date(ch.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-indigo-100 via-indigo-50 to-transparent mb-5" />

              {/* Data */}
              {ch.formType === 'table'
                ? <TableSection chapter={ch} />
                : <RecordSection chapter={ch} />}
            </section>
          ))}

          {/* Footer */}
          <div className="px-8 py-5 flex items-center justify-between bg-gray-50/60">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <BookOpen size={11} className="text-indigo-300" />
              {chapters.length} section{chapters.length !== 1 ? 's' : ''} · Family Book
            </span>
            <Link to="/forms"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              style={{ textDecoration: 'none' }}>
              <Eye size={11} /> Update data
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
