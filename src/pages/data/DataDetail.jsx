export default function DataDetail({ record }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-gray-500">Category: </span>
          <span className="font-medium capitalize">{record.category}</span>
        </div>
        <div>
          <span className="text-gray-500">Created: </span>
          <span>{new Date(record.createdAt).toLocaleString()}</span>
        </div>
      </div>
      {record.encryptedFields?.length > 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          🔒 Encrypted fields: {record.encryptedFields.join(', ')}
        </p>
      )}
      <div>
        <p className="label">Data</p>
        <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-auto max-h-96 border">
          {JSON.stringify(record.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
