import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { pendingUserId } = useAuthStore();
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

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
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

  const onSubmit = (data) => {
    if (!pendingUserId) {
      toast.error('Session expired. Please start again.');
      navigate('/forgot-password');
      return;
    }
    mutate({ userId: pendingUserId, otp: data.otp, newPassword: data.newPassword });
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter the OTP and choose a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* OTP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">OTP code</label>
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
            className="input text-center tracking-[.5em] font-bold text-lg"
            maxLength={6}
            placeholder="000000"
            {...register('otp', { 
              required: 'OTP code is required',
              pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' }
            })}
          />
          {errors.otp && <p className="text-red-500 text-xs mt-1.5">{errors.otp.message}</p>}
        </div>

        {/* New password */}
        <div>
          <label className="label">New password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className="input input-icon pr-11"
              type={showNew ? 'text' : 'password'}
              placeholder="Min 8 characters, uppercase, number & symbol"
              {...register('newPassword', { 
                required: 'New password is required', 
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                validate: {
                  uppercase: v => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
                  number: v => /[0-9]/.test(v) || 'Must contain at least one number',
                  special: v => /[^A-Za-z0-9]/.test(v) || 'Must contain at least one special character'
                }
              })}
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs mt-1.5">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="label">Confirm password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className="input input-icon pr-11"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
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
          {errors.confirm && <p className="text-red-500 text-xs mt-1.5">{errors.confirm.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Resetting…' : 'Reset password'}
        </button>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Back
          </button>
          <button type="button" onClick={() => navigate('/login')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Go to Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
