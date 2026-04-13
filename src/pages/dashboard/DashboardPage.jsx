import { useQuery } from '@tanstack/react-query';
import { dataApi, formsApi, viewerApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Database, FileText, Users } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: dataRes, isLoading: loadingData } = useQuery({
    queryKey: ['data', { page: 1, limit: 1 }],
    queryFn: () => dataApi.getAll({ page: 1, limit: 1 }),
  });

  const { data: formsRes, isLoading: loadingForms } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  });

  const { data: viewersRes } = useQuery({
    queryKey: ['viewers'],
    queryFn: viewerApi.list,
    enabled: user?.role === 'user',
  });

  const { data: recentData } = useQuery({
    queryKey: ['data', { page: 1, limit: 5 }],
    queryFn: () => dataApi.getAll({ page: 1, limit: 5 }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your Family Book</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Database} label="Data Entries" value={loadingData ? '...' : dataRes?.data?.pagination?.total} color="bg-blue-500" />
        <StatCard icon={FileText} label="Forms" value={loadingForms ? '...' : formsRes?.data?.data?.length} color="bg-green-500" />
        {user?.role === 'user' && (
          <StatCard icon={Users} label="Viewers" value={viewersRes?.data?.data?.length ?? '...'} color="bg-purple-500" />
        )}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold mb-4">Recent Entries</h2>
        {loadingData ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : recentData?.data?.data?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No data entries yet</p>
        ) : (
          <div className="divide-y">
            {recentData?.data?.data?.map((item) => (
              <div key={item._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{item.category}</p>
                  <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge badge-user">{item.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
