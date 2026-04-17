import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { Mail, Phone } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('email'); // 'email' | 'mobile'
  const { setPendingUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: ({ data }) => {
      setPendingUser(data.data.userId);
      toast.success('OTP sent successfully');
      navigate('/reset-password');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  });

  const onSubmit = (data) => {
    mutate(method === 'email' ? { email: data.email } : { mobile: data.mobile });
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="We'll send an OTP to reset your password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Method toggle */}
        <div className="flex rounded-xl border border-gray-200 p-1 gap-1">
          <button type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              method === 'email'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Mail size={14} /> Email
          </button>
          <button type="button"
            onClick={() => setMethod('mobile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              method === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Phone size={14} /> Mobile
          </button>
        </div>

        {method === 'email' ? (
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className="input input-icon" type="email" placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
        ) : (
          <div>
            <label className="label">Mobile number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className="input input-icon" placeholder="10-digit mobile number" maxLength={10}
                {...register('mobile', {
                  required: 'Mobile is required',
                  validate: v => /^\d{10}$/.test(v) || 'Enter valid 10-digit number',
                })}
                onKeyDown={e => {
                  if (!/[\d]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))
                    e.preventDefault();
                }} />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send OTP'}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-gray-100 text-center">
        <Link to="/login" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
          ← Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
