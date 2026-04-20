import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import {
  Lock, Mail, Phone, ShieldCheck, Eye, EyeOff,
  KeyRound, MessageSquare, CheckCircle2, ArrowRight,
  ChevronLeft, RefreshCw, Edit2, User, Save
} from 'lucide-react';

function ChangeWithPassword({ onDone }) {
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const { mutate, isPending } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => { toast.success('Password changed!'); onDone(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <form onSubmit={handleSubmit(({ confirm, ...data }) => mutate(data))} className="space-y-4">
      <div>
        <label className="label">Current password</label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input input-icon pr-11" type={showCur ? 'text' : 'password'} placeholder="Your current password"
            {...register('currentPassword', { required: 'Required' })} />
          <button type="button" onClick={() => setShowCur(!showCur)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCur ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
      </div>
      <div>
        <label className="label">New password</label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input input-icon pr-11" type={showNew ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, num & symbol"
            {...register('newPassword', { 
              required: 'Required', 
              minLength: { value: 8, message: 'Min 8 characters' },
              validate: {
                uppercase: v => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
                number: v => /[0-9]/.test(v) || 'Must contain at least one number',
                special: v => /[^A-Za-z0-9]/.test(v) || 'Must contain at least one special character'
              }
            })} />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input input-icon pr-11" type={showConfirm ? 'text' : 'password'} placeholder="Repeat new password"
            {...register('confirm', { 
              required: 'Required',
              validate: v => v === watch('newPassword') || 'Passwords do not match' 
            })} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          {isPending ? 'Saving…' : <><CheckCircle2 size={15} /> Update Password</>}
        </button>
        <button type="button" className="btn-secondary" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

function ChangeWithOTP({ user, onDone }) {
  const hasBoth   = !!(user?.mobile && user?.email);
  const [channel, setChannel]     = useState(user?.mobile ? 'mobile' : 'email');
  const [step, setStep]           = useState('send');
  const [showNew, setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer]         = useState(0);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const sendMutation = useMutation({
    mutationFn: (payload) => authApi.forgotPassword(payload),
    onSuccess: () => { toast.success('OTP sent!'); setStep('verify'); setTimer(30); },
    onError:   (err) => toast.error(err.response?.data?.message || 'Failed to send OTP'),
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp({ userId: user?.id, purpose: 'reset' }),
    onSuccess: () => { toast.success('New OTP sent'); setTimer(30); },
    onError:   (err) => toast.error(err.response?.data?.message || 'Could not resend OTP'),
  });

  const resetMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => { toast.success('Password changed!'); onDone(); },
    onError:   (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleSend = () => {
    const payload = channel === 'mobile' ? { mobile: user.mobile } : { email: user.email };
    sendMutation.mutate(payload);
  };

  if (step === 'send') return (
    <div className="space-y-4">

      {/* Channel selector — only shown when user has both */}
      {hasBoth ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Send OTP via</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Mobile option */}
            <button
              type="button"
              onClick={() => setChannel('mobile')}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 text-left"
              style={{
                borderColor:     channel === 'mobile' ? '#6366f1' : '#e5e7eb',
                backgroundColor: channel === 'mobile' ? '#eef2ff' : '#fff',
                boxShadow:       channel === 'mobile' ? '0 0 0 3px rgba(99,102,241,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: channel === 'mobile' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f3f4f6' }}>
                <Phone size={15} style={{ color: channel === 'mobile' ? '#fff' : '#9ca3af' }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold" style={{ color: channel === 'mobile' ? '#4338ca' : '#374151' }}>Mobile</p>
                <p className="text-[11px] text-gray-400 truncate">{user.mobile}</p>
              </div>
              {channel === 'mobile' && (
                <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#6366f1' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </button>

            {/* Email option */}
            <button
              type="button"
              onClick={() => setChannel('email')}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 text-left"
              style={{
                borderColor:     channel === 'email' ? '#6366f1' : '#e5e7eb',
                backgroundColor: channel === 'email' ? '#eef2ff' : '#fff',
                boxShadow:       channel === 'email' ? '0 0 0 3px rgba(99,102,241,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: channel === 'email' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f3f4f6' }}>
                <Mail size={15} style={{ color: channel === 'email' ? '#fff' : '#9ca3af' }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold" style={{ color: channel === 'email' ? '#4338ca' : '#374151' }}>Email</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
              {channel === 'email' && (
                <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#6366f1' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Single channel — just show info */
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl">
          <ShieldCheck size={15} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-indigo-700">
            <p className="font-semibold mb-0.5">OTP will be sent to:</p>
            {user?.mobile
              ? <p className="flex items-center gap-1.5"><Phone size={11} /> {user.mobile}</p>
              : <p className="flex items-center gap-1.5"><Mail  size={11} /> {user.email}</p>
            }
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSend}
          disabled={sendMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
        >
          {sendMutation.isPending ? 'Sending…' : <><ArrowRight size={15} /> Send OTP</>}
        </button>
        <button className="btn-secondary" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(d => resetMutation.mutate({ userId: user?.id, otp: d.otp, newPassword: d.newPassword }))} className="space-y-4">
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-2.5 rounded-xl">
        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
        <p className="text-xs text-emerald-700">
          OTP sent to your {channel === 'mobile' ? `mobile (${user?.mobile})` : `email (${user?.email})`}.
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">OTP code</label>
          {timer > 0 && <span className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
            <RefreshCw size={10} className="animate-spin" /> Resend in {timer}s
          </span>}
        </div>
        <input className="input text-center tracking-[.5em] font-bold text-xl" maxLength={6} placeholder="000000"
          {...register('otp', { required: true, minLength: 6 })} />
      </div>
      <div>
        <label className="label">New password</label>
        <div className="relative">
          <input className="input pr-11" type={showNew ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, num & symbol"
            {...register('newPassword', { 
              required: true, 
              minLength: 8,
              validate: {
                uppercase: v => /[A-Z]/.test(v) || 'One uppercase required',
                number: v => /[0-9]/.test(v) || 'One number required',
                special: v => /[^A-Za-z0-9]/.test(v) || 'One special character required'
              }
            })} />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className="label">Confirm password</label>
        <div className="relative">
          <input className="input pr-11" type={showConfirm ? 'text' : 'password'} placeholder="Repeat new password"
            {...register('confirm', { 
              required: true,
              validate: v => v === watch('newPassword') || 'Passwords do not match' 
            })} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={resetMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          {resetMutation.isPending ? 'Saving…' : <><CheckCircle2 size={15} /> Change Password</>}
        </button>
        <button 
          type="button" 
          className="btn-secondary flex items-center gap-2" 
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending || timer > 0}
        >
          {resendMutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : 'Resend OTP'}
        </button>
      </div>
    </form>
  );
}

function EditProfile({ user, onDone }) {
  const { setAuth, token } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email, mobile: user?.mobile }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ data }) => {
      toast.success('Profile updated successfully!');
      setAuth(token, data.data.user);
      onDone();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  return (
    <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-3.5 mt-2">
      <div>
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1.5 block">Full Name</label>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input pl-9 py-2 text-sm" placeholder="Your Name"
            {...register('name', { required: 'Name is required', minLength: 2 })} />
        </div>
        {errors.name && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.name.message}</p>}
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1.5 block">Email Address</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input pl-9 py-2 text-sm" type="email" placeholder="you@example.com"
            {...register('email')} />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1.5 block">Mobile Number</label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input pl-9 py-2 text-sm" placeholder="10-digit number" maxLength="10"
            {...register('mobile', {
              pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' }
            })}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
        </div>
        {errors.mobile && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.mobile.message}</p>}
      </div>

      <div className="flex gap-2 pt-3">
        <button type="submit" disabled={isPending}
          className="flex-1 w-full justify-center flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-xs font-semibold disabled:opacity-60 transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#4338ca,#6366f1)', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
          {isPending ? 'Saving…' : <><Save size={14} /> Save</>}
        </button>
        <button type="button" className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-[0.98]" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [pwMethod, setPwMethod] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="space-y-6">

      {/* ── Profile card ── */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#4338ca,#6366f1)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <span className={`badge ${user?.role === 'viewer' ? 'badge-viewer' : 'badge-user'}`}>{user?.role}</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {user?.email && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail size={13} className="text-indigo-400" /> {user.email}
              </span>
            )}
            {user?.mobile && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Phone size={13} className="text-indigo-400" /> {user.mobile}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Two column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Account details */}
        <div className="card">
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Details</p>
            {user?.role !== 'viewer' && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors">
                <Edit2 size={14} />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <EditProfile user={user} onDone={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-0">
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email',     value: user?.email || '—' },
                { label: 'Mobile',    value: user?.mobile || '—' },
                { label: 'Role',      value: user?.role, badge: true },
              ].map((row, i, arr) => (
                <div key={row.label}
                  className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.label}</span>
                  {row.badge
                    ? <span className={`badge ${user?.role === 'viewer' ? 'badge-viewer' : 'badge-user'}`}>{row.value}</span>
                    : <span className="text-sm text-gray-700 font-medium text-right max-w-[180px] break-all">{row.value}</span>
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security */}
        {user?.role !== 'viewer' && (
          <div className="lg:col-span-2 card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)' }}>
                <Lock size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Security</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your password</p>
              </div>
            </div>

            {!pwMethod ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: 'current', icon: KeyRound, title: 'Current Password',
                    desc: 'Enter your existing password to change it',
                    bg: 'linear-gradient(135deg,#6366f1,#818cf8)',
                    shadow: 'rgba(99,102,241,0.3)',
                  },
                  {
                    key: 'otp', icon: MessageSquare, title: 'Send OTP',
                    desc: `Verify via OTP sent to your ${[user?.mobile && 'mobile', user?.email && 'email'].filter(Boolean).join(' & ') || 'registered contact'}`,
                    bg: 'linear-gradient(135deg,#10b981,#34d399)',
                    shadow: 'rgba(16,185,129,0.3)',
                  },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button key={m.key} onClick={() => setPwMethod(m.key)}
                      className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all duration-200 text-left w-full group"
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.10)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: m.bg, boxShadow: `0 6px 16px ${m.shadow}` }}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{m.title}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <button onClick={() => setPwMethod(null)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 mb-5 transition-colors font-medium">
                  <ChevronLeft size={14} /> Back to options
                </button>
                {pwMethod === 'current' && <ChangeWithPassword onDone={() => setPwMethod(null)} />}
                {pwMethod === 'otp'     && <ChangeWithOTP user={user} onDone={() => setPwMethod(null)} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
