import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Mail, Lock, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please provide your registered email address.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.forgotPassword({ email });
      if (res.success) {
        addToast(res.message);
        if (res.devOtp) setDevOtp(res.devOtp);
        setStep(2);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.resetPassword({
        email,
        otp,
        password,
        confirmPassword,
      });

      if (res.success) {
        addToast('Password successfully reset. You may now sign in.');
        navigate('/login');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-luxury-950 flex items-center justify-center mx-auto border border-gold-500/40">
            <Key className="w-5 h-5 text-gold-400" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
            Security Assistance
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500">
            {step === 1
              ? 'Enter your account email to receive a secure recovery code.'
              : 'Enter the recovery code and your desired new password.'}
          </p>
        </div>

        {devOtp && (
          <div className="p-2.5 bg-gold-50 border border-gold-200 rounded text-center text-xs">
            <span className="text-[10px] uppercase font-bold text-gold-800">Test Recovery Code: </span>
            <strong className="font-mono text-luxury-950">{devOtp}</strong>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Account Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow disabled:opacity-50"
            >
              <span>{loading ? 'Dispatching...' : 'Send Recovery Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Security Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="w-full px-3 py-2 border border-gray-300 text-xs rounded font-mono tracking-widest text-center focus:outline-none focus:border-luxury-950 font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow disabled:opacity-50"
            >
              <span>{loading ? 'Updating...' : 'Confirm New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <Link to="/login" className="text-xs uppercase tracking-wider font-semibold text-gray-600 hover:text-black">
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
