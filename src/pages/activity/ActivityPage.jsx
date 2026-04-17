import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dataApi } from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import {
  LogIn, KeyRound, Share2, Database, ShieldCheck,
  SlidersHorizontal, Clock
} from 'lucide-react';

const TYPE_CONFIG = {
  LOGIN: {
    label: 'Login',
    icon:  LogIn,
    color: 'bg-blue-50 text-blue-700',
    dot:   'bg-blue-500',
  },
  OTP: {
    label: 'OTP',
    icon:  KeyRound,
    color: 'bg-amber-50 text-amber-700',
    dot:   'bg-amber-500',
  },
  SHARE: {
    label: 'Access',
    icon:  Share2,
    color: 'bg-purple-50 text-purple-700',
    dot:   'bg-purple-500',
  },
  DATA: {
    label: 'Data',
    icon:  Database,
    color: 'bg-emerald-50 text-emerald-700',
    dot:   'bg-emerald-500',
  },
  ADMIN: {
    label: 'Admin',
    icon:  ShieldCheck,
    color: 'bg-red-50 text-red-600',
    dot:   'bg-red-500',
  },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function ActivityPage() {
  const [page, setPage]       = useState(1);
  const [typeFilter, setType] = useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['user-activity', { page, type: typeFilter }],
    queryFn: () => dataApi.getActivity({ page, limit: 20, type: typeFilter }),
  });

  const logs       = res?.data?.data || [];
  const pagination = res?.data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <p className="page-subtitle">Everything that happened on your account</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <div className="relative">
          <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select className="input input-icon w-auto pr-4 appearance-none cursor-pointer"
            value={typeFilter} onChange={e => { setType(e.target.value); setPage(1); }}>
            <option value="">All activity</option>
            <option value="LOGIN">Login</option>
            <option value="OTP">OTP</option>
            <option value="SHARE">Access / Share</option>
            <option value="DATA">Data changes</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !logs.length ? (
        <div className="card text-center py-14">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <Clock size={24} className="text-indigo-300" />
          </div>
          <p className="text-gray-500 text-sm font-medium">No activity yet</p>
          <p className="text-gray-400 text-xs mt-1">Your account events will appear here</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {logs.map((log, i) => {
              const cfg  = TYPE_CONFIG[log.type] || { label: log.type, icon: Clock, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
              const Icon = cfg.icon;

              return (
                <div key={log._id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`badge ${cfg.color} text-[10px]`}>{cfg.label}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-medium text-gray-500">{timeAgo(log.createdAt)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Pagination page={page} pages={pagination?.pages || 1} total={pagination?.total} onPage={setPage} />
    </div>
  );
}
