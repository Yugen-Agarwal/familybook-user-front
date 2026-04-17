import { useQuery } from '@tanstack/react-query';
import { dataApi, viewerApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Users, ArrowUpRight, Activity, LogIn, KeyRound, Share2, Database, ShieldCheck, Clock, ChevronRight } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  LOGIN: { label: 'Login',  icon: LogIn,       color: 'bg-blue-50 text-blue-600' },
  OTP:   { label: 'OTP',   icon: KeyRound,     color: 'bg-amber-50 text-amber-600' },
  SHARE: { label: 'Access', icon: Share2,       color: 'bg-purple-50 text-purple-600' },
  DATA:  { label: 'Data',   icon: Database,     color: 'bg-emerald-50 text-emerald-600' },
  ADMIN: { label: 'Admin',  icon: ShieldCheck,  color: 'bg-red-50 text-red-500' },
};

function timeAgo(date) {
  const diff  = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: viewersRes } = useQuery({
    queryKey: ['viewers'],
    queryFn: viewerApi.list,
    enabled: user?.role === 'user',
  });

  const { data: activityRes, isLoading: loadingActivity } = useQuery({
    queryKey: ['user-activity-recent'],
    queryFn: () => dataApi.getActivity({ page: 1, limit: 6 }),
    enabled: user?.role === 'user',
  });

  const viewers  = viewersRes?.data?.data || [];
  const activity = activityRes?.data?.data || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title">
          {user?.role === 'viewer' || user?.role === 'owner'
            ? 'Shared Access'
            : `Good to see you, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        </h1>
        <p className="page-subtitle">
          {user?.role === 'viewer' ? 'Read-only access to shared family data'
           : user?.role === 'owner' ? 'Full access to shared family data'
           : "Here's your Family Book overview"}
        </p>
      </div>

      {/* Quick stats — user only */}
      {user?.role === 'user' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/viewers"
            className="stat-card group transition-all duration-200 border border-gray-100 no-underline"
            style={{ textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgb(16 185 129 / .10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}>
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{viewers.length}</p>
              <p className="text-sm text-gray-500 mt-0.5">Access Credentials</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </Link>

          <Link to="/activity"
            className="stat-card group transition-all duration-200 border border-gray-100 no-underline"
            style={{ textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgb(99 102 241 / .10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
              <Activity size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{activityRes?.data?.pagination?.total ?? '—'}</p>
              <p className="text-sm text-gray-500 mt-0.5">Total Events</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {user?.role === 'user' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest events on your account</p>
            </div>
            <Link to="/activity"
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {loadingActivity ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : !activity.length ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-indigo-300" />
              </div>
              <p className="text-gray-400 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activity.map((log) => {
                const cfg  = TYPE_CONFIG[log.type] || { label: log.type, icon: Clock, color: 'bg-gray-100 text-gray-500' };
                const Icon = cfg.icon;
                return (
                  <div key={log._id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{log.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(log.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
