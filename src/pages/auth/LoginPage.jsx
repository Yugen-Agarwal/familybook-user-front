import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react';

// ── Step 1: Credentials ───────────────────────────────
function CredentialsStep({ onOTPSent }) {
  const [showPass, setShowPass] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'mobile'
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      if (data.data.requiresOTP) {
        toast.success(`OTP sent to your ${loginMethod === 'email' ? 'email' : 'mobile'}`);
        onOTPSent(data.data.userId, loginMethod);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });

  const onSubmit = (values) => {
    const payload = { password: values.password };
    if (loginMethod === 'email') payload.email = values.email;
    else payload.mobile = values.mobile;
    mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => { setLoginMethod('email'); reset(); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Email address
        </button>
        <button
          onClick={() => { setLoginMethod('mobile'); reset(); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${loginMethod === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Mobile number
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {loginMethod === 'email' ? (
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className="input input-icon" type="email" placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
        ) : (
          <div>
            <label className="label">Mobile number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className="input input-icon" placeholder="10-digit number" maxLength="10"
                {...register('mobile', { 
                  required: 'Mobile is required',
                  pattern: { value: /^\d{10}$/, message: 'Enter valid 10-digit number' }
                })} 
                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" disabled={isPending} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="input input-icon pr-11" type={showPass ? 'text' : 'password'} placeholder="••••••••"
              {...register('password', { required: 'Password is required' })} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full mt-1" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              Verifying…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Continue <ArrowRight size={15} />
            </span>
          )}
        </button>

        <div className="mt-5 pt-5 border-t border-gray-100 space-y-3 text-center">
          <p className="text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Create one</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

// ── Step 2: OTP Verify ────────────────────────────────
function OTPStep({ userId, channel, onBack }) {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [timer, setTimer] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authApi.verifyLoginOtp({ ...data, userId }),
    onSuccess: ({ data }) => {
      setAuth(data.data.token, data.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Invalid OTP'),
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp({ userId, purpose: 'login', channel }),
    onSuccess: () => {
      toast.success('New OTP sent');
      setTimer(30);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not resend OTP'),
  });

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 px-4 py-3.5 rounded-xl">
        <ShieldCheck size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-indigo-800">
            Check your {channel === 'mobile' ? 'mobile' : 'email'}
          </p>
          <p className="text-xs text-indigo-600 mt-0.5">
            We've sent a 6-digit OTP to verify your login via {channel === 'mobile' ? 'SMS' : 'email'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutate({ otp: data.otp }))} className="space-y-4">
        <div>
          <label className="label">Enter OTP</label>
          <input
            className="input text-center tracking-[.5em] font-bold text-2xl"
            maxLength={6}
            placeholder="000000"
            autoFocus
            {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
          />
          {errors.otp && <p className="text-red-500 text-xs mt-1.5">Please enter the 6-digit OTP</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              Verifying…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Verify & Login <ArrowRight size={15} />
            </span>
          )}
        </button>
      </form>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <button
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending || timer > 0}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={resendMutation.isPending ? 'animate-spin' : ''} />
          {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}

// ── Main LoginPage ────────────────────────────────────
export default function LoginPage() {
  const [step, setStep]       = useState('credentials');
  const [userId, setUserId]   = useState(null);
  const [channel, setChannel] = useState('email'); // 'email' | 'mobile'

  const handleOTPSent = (uid, ch) => {
    setUserId(uid);
    setChannel(ch);
    setStep('otp');
  };

  return (
    <AuthLayout
      title={step === 'otp' ? 'Verify your identity' : 'Welcome back'}
      subtitle={step === 'otp'
        ? `Enter the OTP sent to your ${channel === 'mobile' ? 'mobile number' : 'email'}`
        : 'Sign in to your Family Book account'}
    >
      {step === 'credentials'
        ? <CredentialsStep onOTPSent={handleOTPSent} />
        : <OTPStep userId={userId} channel={channel} onBack={() => setStep('credentials')} />
      }
    </AuthLayout>
  );
}
