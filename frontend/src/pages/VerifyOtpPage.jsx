import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ShieldCheck, ArrowRight, RotateCcw, Key } from 'lucide-react';

export const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();
  const { addToast } = useNotifications();

  const emailParam = searchParams.get('email') || '';
  const devOtpPassed = location.state?.devOtp;

  const [otp, setOtp] = useState(devOtpPassed || '');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      addToast('Please enter the 6-digit verification code.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(emailParam, otp);
      if (res.success) {
        addToast('Security verification confirmed. Welcome to NexKart.');
        navigate('/');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const res = await resendOtp(emailParam, 'verification');
      if (res.success) {
        addToast(res.message);
        if (res.devOtp) setOtp(res.devOtp);
        setCooldown(60);
        setCanResend(false);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-400 flex items-center justify-center mx-auto text-gold-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
            Security Verification
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Verify Your Identity
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            A 6-digit authentication code has been transmitted to <strong className="text-luxury-950">{emailParam}</strong>.
          </p>
        </div>

        {/* Development Helper Badge */}
        {otp && (
          <div className="p-3 bg-gold-50 border border-gold-200 rounded text-center space-y-1">
            <span className="text-[10px] font-bold text-gold-900 uppercase tracking-widest">
              Development Test Code Active
            </span>
            <p className="text-sm font-mono font-bold text-luxury-950 tracking-widest">{otp}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block text-center mb-2">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoFocus
              className="w-full text-center text-2xl font-mono tracking-[0.6em] py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-luxury-950 font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? 'Validating...' : 'Activate Membership'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 space-y-2">
          <p className="text-xs text-gray-500">Didn't receive your code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="text-xs font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-900 disabled:text-gray-400 transition inline-flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>{canResend ? 'Resend Security Code' : `Resend available in ${cooldown}s`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
