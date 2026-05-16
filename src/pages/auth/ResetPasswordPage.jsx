import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { pendingUserId } = useAuthStore();
  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [showNew, setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!pendingUserId) {
      navigate('/forgot-password');
    }
  }, [pendingUserId, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm();
  const newPassword = watch('newPassword', '');
  const otpValue = watch('otp', '');

  // Step 1: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (data) => authApi.verifyOtp({ userId: pendingUserId, otp: data.otp, purpose: 'reset' }),
    onSuccess: () => {
      setStep(2);
      toast.success('OTP verified! Now set your new password.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Verification failed'),
  });

  // Step 2: Reset Password
  const resetMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset! Please login.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp({ userId: pendingUserId, purpose: 'reset' }),
    onSuccess: () => {
      toast.success('New OTP sent');
      setTimer(30);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not resend OTP'),
  });

  const handleStep1 = async (e) => {
    e.preventDefault();
    const isValid = await trigger('otp');
    if (isValid) {
      verifyOtpMutation.mutate({ otp: otpValue });
    }
  };

  const handleStep2 = (data) => {
    if (!pendingUserId) {
      toast.error('Session expired. Please start again.');
      navigate('/forgot-password');
      return;
    }
    resetMutation.mutate({ 
      userId: pendingUserId, 
      otp: otpValue, 
      newPassword: data.newPassword 
    });
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Verify OTP" : "Set New Password"} 
      subtitle={step === 1 ? "Enter the 6-digit code to continue" : "Create a secure password for your account"}
    >
      
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${step === 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-emerald-500 text-white'}`}>
          {step > 1 ? <CheckCircle2 size={16} /> : '1'}
        </div>
        <div className={`w-12 h-0.5 rounded-full ${step > 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${step === 2 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-gray-200 text-gray-500'}`}>
          2
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">OTP code <span className="text-red-500">*</span></label>
              <button
                type="button"
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending || timer > 0}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={resendMutation.isPending ? 'animate-spin' : ''} />
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
            <input
              className={`input text-center tracking-[.5em] font-bold text-2xl py-4 ${errors.otp ? 'border-red-500 bg-red-50/30' : ''}`}
              maxLength={6}
              placeholder="000000"
              autoFocus
              {...register('otp', { 
                required: 'OTP code is required',
                pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' }
              })}
            />
            {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-3.5" disabled={verifyOtpMutation.isPending}>
            {verifyOtpMutation.isPending ? 'Verifying…' : 'Verify & Continue'}
          </button>

          <div className="text-center">
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
              ← Use a different method
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit(handleStep2)} className="space-y-5">
          {/* New password */}
          <div>
            <label className="label">New password <span className="text-red-500">*</span></label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className={`input input-icon pr-11 ${errors.newPassword ? 'border-red-500 bg-red-50/30' : ''}`}
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                autoFocus
                {...register('newPassword', { 
                  required: 'New password is required', 
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  validate: {
                    uppercase: v => /[A-Z]/.test(v) || 'Must contain one uppercase letter',
                    number: v => /[0-9]/.test(v) || 'Must contain one number',
                    special: v => /[^A-Za-z0-9]/.test(v) || 'Must contain one special character'
                  }
                })}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                {[
                  { label: '8+ chars', ok: newPassword.length >= 8 },
                  { label: 'Uppercase', ok: /[A-Z]/.test(newPassword) },
                  { label: 'Number', ok: /\d/.test(newPassword) },
                  { label: 'Special', ok: /[^a-zA-Z0-9]/.test(newPassword) },
                ].map(c => (
                  <span key={c.label} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${c.ok ? 'text-emerald-500' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.ok ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    {c.label}
                  </span>
                ))}
              </div>
            )}
            {errors.newPassword && <p className="text-red-500 text-xs mt-2">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label className="label">Confirm password <span className="text-red-500">*</span></label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className={`input input-icon pr-11 ${errors.confirm ? 'border-red-500 bg-red-50/30' : ''}`}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirm', {
                  required: 'Please confirm your password',
                  validate: (v) => v === watch('newPassword') || 'Passwords do not match',
                })}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-2">{errors.confirm.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-3.5" disabled={resetMutation.isPending}>
            {resetMutation.isPending ? 'Resetting…' : 'Reset password'}
          </button>

          <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
            ← Back to OTP verification
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
         <span className="text-xs text-gray-400">Secure connection</span>
         <button type="button" onClick={() => navigate('/login')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
           Back to Login
         </button>
      </div>
    </AuthLayout>
  );
}
