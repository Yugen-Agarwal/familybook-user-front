import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setAuth(data.data.token, data.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });

  return (
    <AuthLayout title="Sign in" subtitle="Enter your credentials to continue">
      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-brand hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        No account?{' '}
        <Link to="/register" className="text-brand font-medium hover:underline">Register</Link>
      </p>
      <p className="text-center text-xs text-gray-400 mt-2">
        <Link to="/viewer/login" className="hover:underline">Login as Viewer</Link>
      </p>
    </AuthLayout>
  );
}
