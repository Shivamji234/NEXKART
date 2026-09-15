import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Package, ArrowRight, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';

export const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((o) => o.orderStatus === filter);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 animate-pulse">
          Loading order archive...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Atelier Portfolio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Order History ({orders.length})
          </h1>
        </div>

        {/* Filter by status */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['All', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider font-semibold transition ${
                filter === st
                  ? 'bg-luxury-950 text-gold-400'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-16 text-center space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold uppercase tracking-wider text-luxury-950">
            No Orders Recorded
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You currently have no orders matching the selected filter in your account.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 hover:border-gray-300 transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-luxury-950">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                        isDelivered
                          ? 'bg-green-100 text-green-800'
                          : isCancelled
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gold-100 text-gold-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-50">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded bg-gray-100"
                        />
                        <div>
                          <p className="text-xs font-semibold text-luxury-950">{item.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">
                            Qty: {item.quantity} {item.size && `&bull; Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-luxury-950">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer bar */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-gray-500">Total: </span>
                    <span className="text-sm font-bold text-luxury-950">
                      {formatCurrency(order.totalPrice)}
                    </span>
                    <span className="text-gray-400 ml-2">({order.paymentMethod.toUpperCase()})</span>
                  </div>

                  <Link
                    to={`/order-tracking/${order._id}`}
                    className="px-5 py-2 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Track Order Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
