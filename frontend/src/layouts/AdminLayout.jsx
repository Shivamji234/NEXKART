import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { ToastContainer } from '../components/Toast';
import { ShieldCheck, User } from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-950 text-white">
        <p className="text-xs uppercase tracking-widest text-gold-400 animate-pulse">
          Verifying Atelier Administrative Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-luxury-950">
            Administrative Access Restricted
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            This console is reserved exclusively for authorized NexKart Atelier personnel. Please sign in with administrator credentials.
          </p>
          <div className="pt-2">
            <Link
              to="/login?redirect=/admin/dashboard"
              className="inline-block px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded"
            >
              Sign In as Administrator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-luxury-950">
      <ToastContainer />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-3.5 flex items-center justify-between shadow-sm">
          <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
            NexKart Executive Control Panel
          </span>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <div className="w-7 h-7 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <span className="text-luxury-950">{user?.name} (Admin)</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
