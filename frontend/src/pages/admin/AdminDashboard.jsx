import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStockProducts || [];

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Executive Analytics
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Atelier Management Console
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Real-time platform synchronization active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>
            <div className="p-2 rounded bg-gold-50 text-gold-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-luxury-950 font-mono">
            {formatCurrency(stats.totalRevenue || 0)}
          </p>
          <span className="text-[10px] text-green-700 font-semibold">
            Captured & Verified Orders
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Total Acquisitions
            </span>
            <div className="p-2 rounded bg-blue-50 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-luxury-950 font-mono">
            {stats.totalOrders || 0}
          </p>
          <div className="flex space-x-2 text-[10px] text-gray-500">
            <span>{stats.pendingOrders || 0} Pending</span>
            <span>&bull;</span>
            <span>{stats.deliveredOrders || 0} Delivered</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Active Creations
            </span>
            <div className="p-2 rounded bg-purple-50 text-purple-700">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-luxury-950 font-mono">
            {stats.totalProducts || 0}
          </p>
          <span className="text-[10px] text-gray-500">Across 6 Luxury Maisons</span>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Registered Patrons
            </span>
            <div className="p-2 rounded bg-emerald-50 text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-luxury-950 font-mono">
            {stats.totalUsers || 0}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">Verified Client Accounts</span>
        </div>
      </div>

      {/* Action alerts: Low stock and return requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-luxury-950">
                Low Inventory Alerts ({stats.lowStockCount || 0})
              </h2>
            </div>
            <Link to="/admin/products" className="text-xs font-semibold text-gold-700 hover:underline">
              Manage Stock
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStock.length === 0 ? (
              <p className="text-xs text-gray-500 py-3">All product inventories are well-stocked.</p>
            ) : (
              lowStock.map((prod) => (
                <div key={prod._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.images?.[0]?.url}
                      alt={prod.name}
                      className="w-10 h-12 object-cover rounded bg-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-luxury-950 truncate max-w-[200px]">{prod.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">{prod.sku}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded">
                    Only {prod.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Returns & Quick Navigation */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-luxury-950">
                  Return Requests Pending ({stats.returnRequests || 0})
                </h2>
              </div>
              <Link to="/admin/returns" className="text-xs font-semibold text-gold-700 hover:underline">
                Review Returns
              </Link>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-4">
              There are currently <strong className="text-luxury-950">{stats.returnRequests || 0}</strong> client return requests awaiting atelier inspection and refund approval.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/admin/orders"
              className="w-full py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition flex items-center justify-center space-x-2"
            >
              <span>Inspect All Customer Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-luxury-950">
            Recent Client Orders
          </h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-gold-700 hover:underline">
            View All ({stats.totalOrders || 0})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 border-y border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-luxury-950">
                    <Link to={`/admin/orders`} className="hover:underline text-gold-700">
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-luxury-950">{ord.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-gray-400">{ord.shippingAddress?.mobile}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(ord.createdAt)}</td>
                  <td className="py-3 px-4 font-semibold text-luxury-950">
                    {formatCurrency(ord.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-luxury-950 font-bold text-[10px] uppercase rounded">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        ord.paymentStatus === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
