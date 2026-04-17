import { Lock, Hash, Type } from 'lucide-react';

const TYPE_ICONS = {
  text: Type,
  number: Hash,
};

export default function FormDetail({ form }) {
  return (
    <div className="space-y-5">
      {form.description && (
        <p className="text-gray-500 text-sm bg-gray-50 px-4 py-3 rounded-xl">{form.description}</p>
      )}
      {form.sections?.map((section, i) => (
        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-800">{section.sectionName}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {section.fields?.map((field, j) => (
              <div key={j} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {field.encrypted && <Lock size={13} className="text-amber-500 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{field.label}</p>
                    <p className="text-xs text-gray-400 font-mono">{field.key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-gray">{field.type}</span>
                  {field.required && <span className="badge badge-red">required</span>}
                  {field.encrypted && <span className="badge badge-yellow">encrypted</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
