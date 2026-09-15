import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ToastContainer } from '../components/Toast';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-luxury-900 w-full max-w-full overflow-x-hidden">
      <ToastContainer />
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
