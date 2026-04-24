import { Link } from 'react-router-dom';
import { Shield, Users, FileText, Lock, ArrowRight, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import logo from '../../assets/familybook.png';
import familyBg from '../../assets/family-bg.jpg';

const features = [
  { icon: FileText, title: 'Dynamic Forms', desc: 'Create custom forms to collect and organize family information with ease.', color: 'from-blue-500 to-indigo-600' },
  { icon: Shield,   title: 'Bank-Grade Security', desc: 'End-to-end encryption keeps your family data safe and private.', color: 'from-purple-500 to-violet-600' },
  { icon: Users,    title: 'Viewer Sharing', desc: 'Grant controlled access to family members with role-based permissions.', color: 'from-emerald-500 to-teal-600' },
  { icon: Lock,     title: 'OTP Verification', desc: 'Two-factor authentication ensures only you can access your account.', color: 'from-orange-500 to-amber-600' },
];

const stats = [
  { value: '10K+',  label: 'Families' },
  { value: '99.9%', label: 'Uptime' },
  { value: '256-bit', label: 'Encryption' },
  { value: '24/7',  label: 'Support' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={logo} alt="FamilyBook" className="h-16 w-16 object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight drop-shadow">Family Book</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/80 hover:text-white font-medium transition-colors">Features</a>
            <a href="#security" className="text-sm text-white/80 hover:text-white font-medium transition-colors">Security</a>
            <Link to="/terms-conditions" className="text-sm text-white/80 hover:text-white font-medium transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="text-sm text-white/80 hover:text-white font-medium transition-colors">Privacy</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-white/90 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-indigo-700 bg-white px-5 py-2.5 rounded-xl transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO — full screen bg image ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={familyBg}
            alt="Family"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay — bottom heavy so text pops */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(10,8,40,0.82) 0%, rgba(30,20,80,0.75) 40%, rgba(10,8,40,0.88) 100%)'
            }}
          />
          {/* Subtle color tint */}
          <div className="absolute inset-0 mix-blend-multiply"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', opacity: 0.45 }} />
        </div>

        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm mb-8">
              <Sparkles size={12} className="text-indigo-300" />
              Trusted by 10,000+ families across India
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              Your Family's{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Legacy
                </span>
              </span>
              <br />
              <span className="text-white/90">Secured Forever</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-12">
              Store, organize, and share your family's most important information — all in one beautifully secure platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="group flex items-center gap-3 text-base font-bold text-indigo-900 bg-white px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
              >
                Start for Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 text-base font-semibold text-white px-8 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Sign In <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map(({ value, label }) => (
                <div key={label}
                  className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-2xl font-extrabold text-white mb-0.5">{value}</p>
                  <p className="text-xs text-white/50 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything your family needs
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Powerful tools designed to keep your family's data organized, secure, and accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="group p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Section ── */}
      <section id="security" className="py-28 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Security First</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Your privacy is our{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  top priority
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Military-grade encryption and multi-factor authentication ensure your family's data is always protected.
              </p>
              <div className="space-y-4">
                {['AES-256 end-to-end encryption', 'OTP-based two-factor authentication', 'Role-based access control', 'Secure data storage & backups'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-indigo-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
                <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 w-72">
                  <div className="flex items-center gap-3 mb-6">
                    <img src={logo} alt="FamilyBook" className="w-10 h-10 object-contain" />
                    <div>
                      <p className="text-white font-bold text-sm">Family Book</p>
                      <p className="text-gray-500 text-xs">Security Dashboard</p>
                    </div>
                  </div>
                  {[
                    { label: 'Encryption',    status: 'Active',   color: 'text-emerald-400' },
                    { label: 'OTP Guard',     status: 'Enabled',  color: 'text-emerald-400' },
                    { label: 'Access Control',status: 'Strict',   color: 'text-blue-400' },
                    { label: 'Data Backup',   status: 'Daily',    color: 'text-purple-400' },
                  ].map(({ label, status, color }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                      <span className="text-gray-400 text-sm">{label}</span>
                      <span className={`text-xs font-bold ${color}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 overflow-hidden">
        {/* BG image again with heavy overlay */}
        <div className="absolute inset-0 z-0">
          <img src={familyBg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,8,40,0.90) 0%, rgba(49,46,129,0.88) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to secure your family's future?
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Join thousands of families who trust Family Book to keep their data safe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 text-base font-bold text-indigo-900 bg-white px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
            >
              Create Free Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="text-base font-semibold text-white/70 hover:text-white transition-colors">
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={logo} alt="FamilyBook" className="w-16 h-16 object-contain" />
              </div>
              <span className="text-white font-bold">Family Book</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
            <p>© 2026 Family Book. All rights reserved.</p>
            <p>Developed by <a href="https://itfuturz.in/#/home" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold">IT Futurz</a> · Powered by <span className="text-gray-300 font-medium">Progress Alliance</span></p>
          </div>
        </div>
      </footer>

    </div>
  );
}
