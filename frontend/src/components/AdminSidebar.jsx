import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  RotateCcw,
  Store,
  ShieldCheck,
} from 'lucide-react';

export const AdminSidebar = () => {
  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products & Stock', path: '/admin/products', icon: Package },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Accounts', path: '/admin/users', icon: Users },
    { name: 'Promotions & Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Returns & Refunds', path: '/admin/returns', icon: RotateCcw },
  ];

  return (
    <aside className="w-64 bg-luxury-950 text-white min-h-screen flex flex-col border-r border-white/10 flex-shrink-0">
      {/* Brand & Admin Badge */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-white/5 border border-gold-400/40 flex items-center justify-center">
            <span className="text-gold-400 font-serif font-bold text-base">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-widest text-white">NEXKART</span>
            <span className="text-[9px] tracking-widest text-gold-400 uppercase font-bold flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Atelier Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-3 rounded text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Storefront Link */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-gold-400 transition tracking-wider uppercase font-medium"
        >
          <Store className="w-4 h-4" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </aside>
  );
};
