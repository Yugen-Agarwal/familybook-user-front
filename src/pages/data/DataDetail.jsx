import { Lock, Calendar, Tag } from 'lucide-react';

export default function DataDetail({ record }) {
  return (
    <div className="space-y-5">
      {/* Meta */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Tag size={13} className="text-brand" />
          <span className="capitalize font-medium text-gray-700">{record.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Calendar size={13} className="text-brand" />
          <span>{new Date(record.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Encrypted notice */}
      {record.encryptedFields?.length > 0 && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
          <Lock size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Encrypted fields: <span className="font-semibold">{record.encryptedFields.join(', ')}</span>
          </p>
        </div>
      )}

      {/* JSON data */}
      <div>
        <p className="label">Data</p>
        <pre className="bg-gray-950 text-emerald-400 rounded-xl p-4 text-xs overflow-auto max-h-96 font-mono leading-relaxed">
          {JSON.stringify(record.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
