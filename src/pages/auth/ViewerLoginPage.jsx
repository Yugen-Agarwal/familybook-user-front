import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { viewerApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';

export default function ViewerLoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: viewerApi.login,
    onSuccess: ({ data }) => {
      setAuth(data.data.token, { role: 'viewer', name: 'Viewer' });
      toast.success('Viewer access granted');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Invalid credentials'),
  });

  return (
    <AuthLayout title="Viewer Login" subtitle="Read-only access to shared family data">
      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <div>
          <label className="label">Viewer ID</label>
          <input className="input" placeholder="viewer_xxxxxxxxxxxx" {...register('viewerId', { required: 'Viewer ID is required' })} />
          {errors.viewerId && <p className="text-red-500 text-xs mt-1">{errors.viewerId.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login as Viewer'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-brand hover:underline">Back to main login</Link>
      </p>
    </AuthLayout>
  );
}
