import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showReset, setShowReset] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('OTP sent to your email');
      setShowReset(true);
    },
    onError: () => toast.error('Failed to send OTP'),
  });

  const { mutate: resetMutate, isPending: resetting } = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      setShowReset(false);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  });

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="card space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email || user?.mobile}</p>
            <span className={`badge mt-1 ${user?.role === 'viewer' ? 'badge-viewer' : 'badge-user'}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {user?.role !== 'viewer' && (
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-gray-500" />
            <h3 className="font-semibold">Change Password</h3>
          </div>

          {!showReset ? (
            <button
              className="btn-secondary"
              disabled={isPending}
              onClick={() => mutate({ email: user?.email, mobile: user?.mobile })}
            >
              {isPending ? 'Sending OTP...' : 'Send OTP to change password'}
            </button>
          ) : (
            <form
              onSubmit={handleSubmit((data) =>
                resetMutate({ userId: user?._id, otp: data.otp, newPassword: data.newPassword })
              )}
              className="space-y-4"
            >
              <div>
                <label className="label">OTP</label>
                <input className="input tracking-widest text-center" maxLength={6} placeholder="000000" {...register('otp', { required: true })} />
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
                  {...register('confirm', { validate: (v) => v === watch('newPassword') || 'Passwords do not match' })}
                />
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={resetting}>
                  {resetting ? 'Changing...' : 'Change Password'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowReset(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
