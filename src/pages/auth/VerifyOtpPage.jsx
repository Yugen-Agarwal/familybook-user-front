import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { ShieldCheck } from 'lucide-react';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { pendingUserId } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      toast.success('Account verified! Please login.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Invalid OTP'),
  });

  const onSubmit = (data) => mutate({ userId: pendingUserId, otp: data.otp, purpose: 'verify' });

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we sent you">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
          <ShieldCheck size={26} className="text-brand" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">OTP code</label>
          <input
            className="input text-center text-2xl tracking-[.5em] font-bold"
            maxLength={6}
            placeholder="000000"
            {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Verifying…' : 'Verify account'}
        </button>
      </form>
    </AuthLayout>
  );
}
