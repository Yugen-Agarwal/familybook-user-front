import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setPendingUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      setPendingUser(data.data.userId);
      toast.success('OTP sent to your email');
      navigate('/verify-otp');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  return (
    <AuthLayout title="Create account" subtitle="Join Family Book today">
      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input" placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@example.com" {...register('email')} />
        </div>
        <div>
          <label className="label">Mobile (optional)</label>
          <input className="input" placeholder="+91XXXXXXXXXX" {...register('mobile')} />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Min 8 characters"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
