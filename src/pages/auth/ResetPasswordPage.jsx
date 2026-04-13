import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { pendingUserId } = useAuthStore();
  const { register, handleSubmit, watch } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset! Please login.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  });

  const onSubmit = (data) => {
    mutate({ userId: pendingUserId, otp: data.otp, newPassword: data.newPassword });
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter the OTP and your new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">OTP Code</label>
          <input className="input text-center tracking-widest" maxLength={6} placeholder="000000" {...register('otp', { required: true })} />
        </div>
        <div>
          <label className="label">New Password</label>
          <input className="input" type="password" placeholder="Min 8 characters" {...register('newPassword', { required: true, minLength: 8 })} />
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input
            className="input"
            type="password"
            placeholder="Repeat password"
            {...register('confirm', {
              validate: (v) => v === watch('newPassword') || 'Passwords do not match',
            })}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}
