import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Truck,
  Edit2,
  X,
} from 'lucide-react';

const ORDER_STATUSES = [
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { addToast } = useNotifications();

  // Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await adminAPI.getOrders(params);
      if (res.success) setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await adminAPI.updateOrderStatus(selectedOrder._id, {
        status: newStatus,
        note: statusNote,
      });

      if (res.success) {
        addToast(`Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Order Fulfillment
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Orders Management ({orders.length})
          </h1>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['All', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider font-semibold transition ${
                statusFilter === st
                  ? 'bg-luxury-950 text-gold-400'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number (e.g. NEX-2026-...)"
          className="w-full text-xs focus:outline-none tracking-wide"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Customer & Destination</th>
                <th className="py-3 px-4 font-semibold">Pieces</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-luxury-950">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(ord.createdAt)}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-luxury-950">{ord.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-gray-400">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{ord.orderItems?.length || 0} items</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-luxury-950">
                    {formatCurrency(ord.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        ord.paymentStatus === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentStatus} ({ord.paymentMethod.toUpperCase()})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-luxury-950 font-bold text-[10px] uppercase rounded">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenStatusModal(ord)}
                      className="p-1.5 bg-gray-100 hover:bg-luxury-950 hover:text-gold-400 text-gray-700 rounded transition inline-flex items-center space-x-1"
                      title="Update Delivery Status"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold uppercase">Update</span>
                    </button>
                    <Link
                      to={`/order-tracking/${ord._id}`}
                      className="p-1.5 text-gray-400 hover:text-black inline-block"
                      title="Inspect Tracking"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
                Update Status: #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                  Change Delivery Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white font-semibold"
                >
                  {ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                  Custom Status Note (Appears on Customer Live Tracker)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Package dispatched via private courier concierge"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="flex space-x-3 pt-3 border-t">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 bg-luxury-950 text-gold-400 font-bold uppercase tracking-widest rounded hover:bg-black transition"
                >
                  {updating ? 'Saving...' : 'Confirm Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 border border-gray-300 font-bold uppercase tracking-widest rounded text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
