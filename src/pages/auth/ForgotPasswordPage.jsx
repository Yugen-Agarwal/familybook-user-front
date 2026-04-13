import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('OTP sent if account exists');
      navigate('/reset-password');
    },
    onError: () => toast.error('Something went wrong'),
  });

  return (
    <AuthLayout title="Forgot password" subtitle="We'll send an OTP to reset your password">
      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@example.com" {...register('email', { required: true })} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-brand hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
