import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 animate-pulse">
          Confirming order with atelier...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      {/* Confirmation Banner */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-400 flex items-center justify-center mx-auto text-gold-600">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-700">
          Maison Acquisition Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Thank You For Your Patronage
        </h1>

        <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed font-light">
          Your order has been recorded and our master atelier in Biella is preparing your pieces with white-glove care. A confirmation dispatch has been sent to your email.
        </p>

        <div className="pt-2">
          <span className="text-xs text-gray-500">Order Reference: </span>
          <span className="text-sm font-mono font-bold text-luxury-950">
            {order?.orderNumber || id}
          </span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/order-tracking/${order?._id || id}`}
            className="w-full sm:w-auto px-6 py-3 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition shadow flex items-center justify-center space-x-2"
          >
            <span>Track Atelier Dispatch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-luxury-950 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gray-50 transition"
          >
            Continue Exploring
          </Link>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-950 pb-3 border-b border-gray-100">
            Order Pieces Summary
          </h2>

          <div className="divide-y divide-gray-100">
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
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
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

          <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between text-xs text-gray-600 gap-4">
            <div>
              <p className="font-semibold text-luxury-950 uppercase tracking-wider mb-1">
                Destination Address
              </p>
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.house}, {order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
            </div>

            <div className="text-right sm:text-right">
              <p className="font-semibold text-luxury-950 uppercase tracking-wider mb-1">
                Payment Details
              </p>
              <p>Method: <strong className="uppercase">{order.paymentMethod}</strong></p>
              <p>Payment Status: <strong>{order.paymentStatus}</strong></p>
              <p className="text-sm font-bold text-luxury-950 mt-2">
                Total Paid: {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
