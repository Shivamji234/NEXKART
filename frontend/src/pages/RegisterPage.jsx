import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Password confirmation does not match.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must contain at least 6 characters.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);

      if (res.success) {
        addToast(res.message);
        // Navigate to OTP verification page
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email.toLowerCase())}`, {
          state: { devOtp: res.devOtp },
        });
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-luxury-950 flex items-center justify-center mx-auto border border-gold-500/40">
            <span className="text-gold-400 font-serif font-bold text-lg">N</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
            Atelier Membership
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Create Account
          </h2>
          <p className="text-xs text-gray-500">
            Join the NexKart luxury circle to enjoy white-glove delivery, private sales, and order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Lord Julian Sterling"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="julian@domain.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Mobile Contact Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Password (Min. 6 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Membership...' : 'Register & Verify Security OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Already possess an account?{' '}
            <Link to="/login" className="font-bold text-luxury-950 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
