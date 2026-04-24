import { Shield, Users, Lock } from 'lucide-react';
import familyBg from '../../assets/family-bg.jpg';
import logo from '../../assets/familybook.png';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="h-screen flex overflow-hidden selection:bg-indigo-100">

      {/* ── Left panel ── */}
      <div className="hidden md:flex md:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${familyBg})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(55,48,163,0.90) 0%, rgba(79,70,229,0.82) 40%, rgba(99,102,241,0.72) 100%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="FamilyBook" className="w-16 h-16 object-contain" />
          <span className="text-white font-bold text-xl tracking-tight">Family Book</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-3">Trusted by families</p>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">Your family's information,<br />secured forever.</h2>
            <p className="text-indigo-200 text-base leading-relaxed max-w-sm">Store, organize, and share your family's most important data — all in one beautifully secure place.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Lock, text: 'End-to-end encrypted data' },
              { icon: Shield, text: 'Role-based access control' },
              { icon: Users, text: 'Secure viewer sharing' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-1 mt-10">
          <p className="text-indigo-300 text-xs">
            Developed by <a href="https://itfuturz.in/#/home" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-bold transition-colors">IT Futurz</a>
          </p>
          <p className="text-indigo-300/60 text-[10px]">© 2026 Family Vault. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col relative" style={{ background: 'linear-gradient(145deg, #f0f1ff 0%, #f8f9ff 50%, #eef2ff 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.06), transparent 70%)', transform: 'translate(-30%, 30%)' }} />
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2.5 px-6 pt-6">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md border border-indigo-100">
            <img src={logo} alt="FamilyBook" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-lg text-gray-900">Family Book</span>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[400px]">

            {/* Heading */}
            <div className="mb-8 text-center">
              {/* Icon badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-white" style={{ boxShadow: '0 8px 24px rgba(79,70,229,0.2)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <img src={logo} alt="FamilyBook" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-[1.75rem] font-bold text-gray-900 tracking-tight leading-tight">{title}</h1>
              {subtitle && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{subtitle}</p>}
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 40px rgba(79,70,229,0.10), 0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />
              {children}
            </div>

            {/* Bottom branding */}
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-gray-400">Developed by <a href="https://itfuturz.in/#/home" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">IT Futurz</a></span>
              <span className="text-gray-300 text-[10px]">·</span>
              <span className="text-[10px] text-gray-400">Powered by <span className="font-semibold text-gray-600">Progress Alliance</span></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
