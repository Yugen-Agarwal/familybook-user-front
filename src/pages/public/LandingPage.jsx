import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  Plus,
  Share2,
  ChevronDown,
  ChevronUp,
  Settings,
  LockKeyhole
} from 'lucide-react';
import logo from '../../assets/familybook.png';
import familyBg from '../../assets/family-bg.jpg';

const features = [
  { icon: FileText, title: 'Dynamic Records', desc: 'Create and organize custom records for assets, medical history, credentials, and family data with ease.', color: 'from-blue-500 to-indigo-600' },
  { icon: Shield,   title: 'Zero-Knowledge Security', desc: 'End-to-end client-side encryption ensures only you and authorized members can view details.', color: 'from-purple-500 to-violet-600' },
  { icon: Users,    title: 'Granular Sharing', desc: 'Grant role-based viewer or editor access to trusted family members with strict permissions.', color: 'from-emerald-500 to-teal-600' },
  { icon: Lock,     title: 'OTP Access Guard', desc: 'Every critical export or access is secured behind instant two-factor verification codes.', color: 'from-orange-500 to-amber-600' },
];

const stats = [
  { value: '10K+',  label: 'Active Families' },
  { value: '99.99%', label: 'Uptime Guard' },
  { value: '256-bit', label: 'AES Encryption' },
  { value: 'Instant',  label: 'OTP Verification' },
];

const faqs = [
  { q: "Is my family data visible to Family Book admins?", a: "No. We utilize zero-knowledge principles. Your confidential assets and credentials are encrypted on your device before saving, making it impossible for anyone else to read them." },
  { q: "What happens in case of an emergency?", a: "You can delegate secondary access (Viewer permissions) to trusted family members. They can view files and logs with their own secure login after OTP authorization." },
  { q: "Can I customize the details I want to store?", a: "Absolutely. Family Book provides dynamic forms allowing you to create custom fields for bank accounts, properties, insurance policies, and digital memories." },
  { q: "Is there a mobile application available?", a: "Yes! Family Book works beautifully across all devices, including responsive mobile browsers and desktop apps, ensuring your data is always at your fingertips." }
];

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState('vault'); // 'vault' | 'tree' | 'sharing'
  const [vaultDecrypted, setVaultDecrypted] = useState(false);
  const [otpToggle, setOtpToggle] = useState(true);
  const [strictAccessToggle, setStrictAccessToggle] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Simulated dynamic family members
  const [selectedMember, setSelectedMember] = useState('self'); // 'self' | 'father' | 'spouse'
  const memberDetails = {
    self: { name: 'Amit Sharma', role: 'Owner (You)', phone: '+91 98765 43210', email: 'amit@sharma.family', blood: 'O+' },
    father: { name: 'Rajesh Sharma', role: 'Editor', phone: '+91 98234 56789', email: 'rajesh@sharma.family', blood: 'B+' },
    spouse: { name: 'Neha Sharma', role: 'Viewer', phone: '+91 99123 45678', email: 'neha@sharma.family', blood: 'A+' },
  };

  return (
    <div className="min-h-screen bg-[#0B091A] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B091A]/60 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center p-1 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <img src={logo} alt="FamilyBook" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-tight">Family Book</span>
              <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">Legacy Vault</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 bg-white/5 border border-white/5 px-6 py-2 rounded-full backdrop-blur-md">
            <a href="#features" className="text-sm text-slate-300 hover:text-white font-medium transition-colors">Features</a>
            <a href="#security" className="text-sm text-slate-300 hover:text-white font-medium transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.03] active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 z-0">
          <img
            src={familyBg}
            alt="Family Background"
            className="w-full h-full object-cover object-center opacity-10 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B091A]/70 via-[#0B091A] to-[#0B091A]" />
          
          {/* Animated colorful glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] bg-indigo-600/20 animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] bg-purple-600/15 animate-float-delayed pointer-events-none" />
          <div className="absolute top-1/2 left-2/3 w-[250px] h-[250px] rounded-full blur-[90px] bg-cyan-500/10 animate-float pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm mb-8 animate-float">
              <Sparkles size={14} className="text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
              India's Premier Family Legacy Vault
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Secure Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                Family's Legacy
              </span>{' '}
              Forever.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mb-10">
              A highly secure, beautiful workspace to catalog assets, private documents, and medical details with controlled family sharing.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto group flex items-center justify-center gap-3 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 px-8 py-4 rounded-2xl shadow-xl shadow-indigo-900/40 hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
              >
                Create Secure Vault
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-slate-300 hover:text-white px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                Try Interactive Demo
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5">
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-indigo-400/80 font-medium uppercase tracking-wider mt-0.5">Encrypted</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">10K+</p>
                <p className="text-xs text-indigo-400/80 font-medium uppercase tracking-wider mt-0.5">Protected Families</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">256-Bit</p>
                <p className="text-xs text-indigo-400/80 font-medium uppercase tracking-wider mt-0.5">Security Protocol</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 rounded-[2.5rem] bg-indigo-500/10 blur-2xl z-0" />
            <div className="relative z-10 bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  vault.familybook.in
                </div>
              </div>

              {/* Mockup Body: Vault View */}
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Asset Registry</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Secure</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Mumbai Property Deed & Insurance</h4>
                  <p className="text-xs text-slate-400 mt-1">Shared with: Mother, Father</p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Credentials</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Secure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Family Locker Password</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded font-mono">••••••••••••</span>
                  </div>
                </div>

                {/* Simulated Decrypt interaction right in the Hero */}
                <div className="mt-6 p-4 bg-indigo-900/20 rounded-2xl border border-indigo-500/20 flex flex-col items-center text-center">
                  <LockKeyhole className="text-indigo-400 mb-2 animate-bounce" size={24} />
                  <p className="text-xs text-slate-300 font-medium">This vault is fully secured with AES-256</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Unlock credentials using the interactive preview below</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <section className="py-16 border-y border-white/5 bg-slate-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center group">
                <p className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block">{value}</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-28 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">Features Showcase</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              A Complete Vault Ecosystem
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mt-4">
              All properties, certificates, accounts, and credentials secured in a single unified dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group p-8 rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden glow-card"
              >
                {/* Glowing backdrop shape */}
                <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:opacity-25 blur-xl transition-opacity duration-300`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-md shadow-indigo-950/50 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY COMPONENT SHOWCASE ── */}
      <section id="security" className="py-28 relative overflow-hidden z-10 bg-[#0B091A]">
        {/* Animated radial shadows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Security description */}
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 block">Security Excellence</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Your private life remains{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  your custody.
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                With client-side zero-knowledge architecture, no passwords, secret keys, or custom credentials leave your device plain text.
              </p>

              <div className="space-y-4">
                {[
                  'AES-256 GCM client-side encryption standards',
                  'Instant SMS/Email based Two-Factor OTP Guards',
                  'Secure roles: Owners, Editors, Viewers',
                  'High availability cloud server infrastructure with periodic snapshots'
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle size={12} className="text-indigo-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Settings Card */}
            <div className="flex justify-center relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-3xl" />
              
              <div className="relative bg-slate-900/60 border border-white/10 rounded-3xl p-8 w-full max-w-sm backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <img src={logo} alt="FamilyBook" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Family Book</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Security Settings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <span className="text-slate-300 text-xs font-semibold">Encryption Engine</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active (AES)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <span className="text-slate-300 text-xs font-semibold">OTP Master Guard</span>
                    <span className="text-xs font-bold text-emerald-400">Enabled</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <span className="text-slate-300 text-xs font-semibold">Granular Sharing Level</span>
                    <span className="text-xs font-bold text-cyan-400">Role-Based</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <span className="text-slate-300 text-xs font-semibold">Cloud Backups</span>
                    <span className="text-xs font-bold text-purple-400">Auto Daily</span>
                  </div>
                </div>

                <div className="mt-6 text-center text-[10px] text-slate-500">
                  Secured by IT Futurz Encryption Protocol
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── CTA SECTION ── */}
      <section className="relative py-32 overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <img src={familyBg} alt="Family" className="w-full h-full object-cover object-center opacity-10 filter grayscale brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B091A] via-indigo-950/80 to-[#0B091A]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Begin Securing Your Family's Assets Today
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Zero setup fees. Zero risks. Create your secure vault profile in less than 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8 py-4 rounded-2xl shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
            >
              Get Started for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center text-base font-semibold text-slate-400 hover:text-white transition-colors py-4 px-8 border border-white/5 hover:border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              Sign In to Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center p-1 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <img src={logo} alt="FamilyBook" className="w-9 h-9 object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-base leading-tight">Family Book</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">Legacy Vault</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 Family Book. All rights reserved.</p>
            <p>
              Developed by{' '}
              <a href="https://itfuturz.in/#/home" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                IT Futurz
              </a>{' '}
              · Powered by{' '}
              <span className="text-slate-300 font-semibold">Progress Alliance</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
