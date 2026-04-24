import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './AuthLayout';
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const validatePassword = (v) => {
  if (!v)                       return 'Password is required';
  if (v.length < 8)             return 'Password must be at least 8 characters, include uppercase, lowercase, number & special character';
  if (!/[A-Z]/.test(v))        return 'Password must include at least one uppercase letter (A-Z)';
  if (!/[a-z]/.test(v))        return 'Password must include at least one lowercase letter (a-z)';
  if (!/[0-9]/.test(v))        return 'Password must include at least one number (0-9)';
  if (!/[^A-Za-z0-9]/.test(v)) return 'Password must include at least one special character (!@#$...)';
  return true;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [done, setDone]         = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // redirect if already logged in
  if (token) return <Navigate to="/dashboard" replace />;

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => setDone(true),
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  if (done) {
    return (
      <AuthLayout title="Registration successful" subtitle="Your account has been created">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your account has been created successfully.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait for <span className="font-semibold text-indigo-600">admin approval</span> before you can login.
            </p>
          </div>
          <button onClick={() => navigate('/login')} className="btn-primary w-full">
            Go to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create account" subtitle="Join Family Book and secure your family's data">
      <form onSubmit={handleSubmit(mutate)} className="space-y-4">

        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="input input-icon" placeholder="John Doe"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="input input-icon" type="email" placeholder="you@example.com"
              {...register('email', {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })} />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Mobile number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="input input-icon" placeholder="10-digit mobile number" maxLength={10}
              {...register('mobile', {
                required: 'Mobile number is required',
                validate: v => /^\d{10}$/.test(v) || 'Enter a valid 10-digit mobile number',
              })}
              onKeyDown={e => {
                if (!/[\d]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))
                  e.preventDefault();
              }} />
          </div>
          {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input className="input input-icon pr-11" type={showPass ? 'text' : 'password'}
              placeholder="Create a strong password"
              {...register('password', { validate: validatePassword })} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full mt-2" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create account <ArrowRight size={15} />
            </span>
          )}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
