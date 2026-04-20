import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dataApi } from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import { SlidersHorizontal, Search, X, CalendarDays } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const TYPE_STYLES = {
  LOGIN: 'bg-blue-50 text-blue-700',
  OTP:   'bg-amber-50 text-amber-700',
  SHARE: 'bg-purple-50 text-purple-700',
  DATA:  'bg-emerald-50 text-emerald-700',
  ADMIN: 'bg-red-50 text-red-600',
};

export default function ActivityPage() {
  const [page, setPage]           = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch]       = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');

  const debouncedSearch = useDebounce(search, 400);
  const hasFilters = typeFilter || search || startDate || endDate;

  const clearAll = () => {
    setTypeFilter(''); setSearch('');
    setStartDate(''); setEndDate('');
    setPage(1);
  };

  const { data: res, isLoading } = useQuery({
    queryKey: ['user-activity', { page, type: typeFilter, search: debouncedSearch, startDate, endDate }],
    queryFn:  () => dataApi.getActivity({
      page, limit: 20,
      type:      typeFilter       || undefined,
      search:    debouncedSearch  || undefined,
      startDate: startDate        || undefined,
      endDate:   endDate          || undefined,
    }),
  });

  const logs       = res?.data?.data       || [];
  const pagination = res?.data?.pagination;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="page-title">Activity Log</h1>
        <p className="page-subtitle">Track all platform events and user actions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end">

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide pl-1">Search</span>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className="input input-icon"
              placeholder="Search action description..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide pl-1">Type</span>
          <div className="relative">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              className="pl-8 pr-4 py-2.5 rounded-xl border text-sm font-medium appearance-none cursor-pointer focus:outline-none transition-all"
              style={{
                borderColor:     typeFilter ? '#6366f1' : '#e5e7eb',
                backgroundColor: typeFilter ? '#eef2ff' : '#ffffff',
                color:           typeFilter ? '#4338ca' : '#6b7280',
                boxShadow:       typeFilter ? '0 0 0 2px rgba(99,102,241,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
              }}
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Types</option>
              {['LOGIN', 'OTP', 'SHARE', 'DATA', 'ADMIN'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide pl-1">Date Range</span>
          <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <CalendarDays size={13} className="text-gray-400 flex-shrink-0 ml-1" />
            <input
              type="date"
              className="text-sm font-medium border-0 outline-none bg-transparent cursor-pointer"
              style={{ color: startDate ? '#4338ca' : '#9ca3af', minWidth: 110 }}
              value={startDate}
              max={endDate || undefined}
              onChange={e => { setStartDate(e.target.value); setPage(1); }}
            />
            <span className="text-gray-300 text-sm font-medium">→</span>
            <input
              type="date"
              className="text-sm font-medium border-0 outline-none bg-transparent cursor-pointer"
              style={{ color: endDate ? '#4338ca' : '#9ca3af', minWidth: 110 }}
              value={endDate}
              min={startDate || undefined}
              onChange={e => { setEndDate(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-2.5 rounded-lg hover:bg-red-50"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Action</th>
                <th className="th">Type</th>
                <th className="th">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr key={log._id} className="tr-hover">
                  <td className="td font-medium text-gray-800">
                    {debouncedSearch ? (
                      <span dangerouslySetInnerHTML={{
                        __html: log.action.replace(
                          new RegExp(`(${debouncedSearch})`, 'gi'),
                          '<mark class="bg-yellow-100 text-yellow-800 rounded px-0.5">$1</mark>'
                        )
                      }} />
                    ) : log.action}
                  </td>
                  <td className="td">
                    <span className={`badge ${TYPE_STYLES[log.type] || 'bg-gray-100 text-gray-600'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="td text-gray-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString([], {
                      dateStyle: 'medium', timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-14 text-gray-400 text-sm">
                    {hasFilters ? 'No logs match your filters' : 'No activity yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} pages={pagination?.pages || 1} total={pagination?.total} onPage={setPage} />
    </div>
  );
}
