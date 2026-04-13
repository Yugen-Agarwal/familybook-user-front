import { Lock } from 'lucide-react';

export default function FormDetail({ form }) {
  return (
    <div className="space-y-5">
      {form.description && <p className="text-gray-500 text-sm">{form.description}</p>}
      {form.sections?.map((section, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="font-medium text-sm">{section.sectionName}</h3>
          </div>
          <div className="divide-y">
            {section.fields?.map((field, j) => (
              <div key={j} className="px-4 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {field.encrypted && <Lock size={13} className="text-amber-500" />}
                  <span className="font-medium">{field.label}</span>
                  <span className="text-gray-400 text-xs">({field.key})</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="badge bg-gray-100 text-gray-600">{field.type}</span>
                  {field.required && <span className="badge bg-red-50 text-red-600">required</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
