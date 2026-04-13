import { BookOpen } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Family Book</h1>
          <p className="text-white/70 mt-1 text-sm">Your family's secure digital vault</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
