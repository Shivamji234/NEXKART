import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);

      if (res.requiresVerification) {
        addToast(res.message, 'info');
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`);
        return;
      }

      if (res.success) {
        addToast(`Welcome back, ${res.user.name}.`);
        navigate(redirect);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-luxury-950 flex items-center justify-center mx-auto border border-gold-500/40">
            <span className="text-gold-400 font-serif font-bold text-lg">N</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
            Maison Identification
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Client Sign In
          </h2>
          <p className="text-xs text-gray-500">
            Access your private order history, wishlist, and bespoke atelier privileges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950 tracking-wide"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-gold-700 hover:underline tracking-wide"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950 tracking-wide"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Do not possess a NexKart membership?{' '}
            <Link to="/register" className="font-bold text-luxury-950 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
