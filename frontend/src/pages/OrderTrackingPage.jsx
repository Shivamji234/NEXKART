import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { OrderTimeline } from '../components/OrderTimeline';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNotifications } from '../context/NotificationContext';
import {
  Package,
  Printer,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const { addToast } = useNotifications();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [cancelling, setCancelling] = useState(false);

  // Return Modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Size / fit issue');
  const [returnNote, setReturnNote] = useState('');
  const [returning, setReturning] = useState(false);

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

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await orderAPI.cancelOrder(order._id, cancelReason);
      if (res.success) {
        addToast('Order has been cancelled and inventory released.');
        setOrder(res.order);
        setShowCancelModal(false);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestReturn = async () => {
    try {
      setReturning(true);
      const res = await orderAPI.requestReturn(order._id, {
        reason: returnReason,
        note: returnNote,
      });
      if (res.success) {
        addToast('Return request submitted. Concierge will review your request.');
        setOrder(res.order);
        setShowReturnModal(false);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setReturning(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 animate-pulse">
          Fetching atelier dispatch records...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Order Record Not Found
        </h2>
        <p className="text-xs text-gray-500">Please check your order number or reference link.</p>
        <Link
          to="/account/orders"
          className="inline-block px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-widest font-semibold rounded"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['Pending', 'Confirmed', 'Processing', 'Packed'].includes(order.orderStatus);
  const canReturn = order.orderStatus === 'Delivered' && order.returnRequest?.status === 'None';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <Link
          to="/account/orders"
          className="text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-black flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 rounded text-xs uppercase tracking-wider font-semibold text-luxury-950 hover:bg-gray-50 flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded text-xs uppercase tracking-wider font-semibold hover:bg-red-50 flex items-center space-x-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}

          {canReturn && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 bg-luxury-950 text-gold-400 rounded text-xs uppercase tracking-wider font-semibold hover:bg-black flex items-center space-x-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Return</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Live Tracker Component */}
      <OrderTimeline order={order} />

      {/* Pieces & Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-950 pb-3 border-b border-gray-100">
          Order Items & Pricing
        </h3>

        <div className="divide-y divide-gray-100">
          {order.orderItems?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-16 object-cover rounded bg-gray-100 flex-shrink-0"
                />
                <div>
                  <Link
                    to={`/product/${item.product}`}
                    className="text-xs font-semibold text-luxury-950 hover:text-gold-700"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                    Quantity: {item.quantity} {item.size && `&bull; Size: ${item.size}`}{' '}
                    {item.color && `&bull; Color: ${item.color}`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-luxury-950">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing totals */}
        <div className="border-t border-gray-100 pt-4 max-w-xs ml-auto space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.itemsPrice)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-gold-700">
              <span>Privilege Discount ({order.couponApplied?.code})</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST / Tax</span>
            <span>{formatCurrency(order.taxPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'Complimentary' : formatCurrency(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-luxury-950 pt-2 border-t">
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-luxury-950">
              Cancel Order #{order.orderNumber}
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you wish to cancel this order? If payment was completed, a full refund will be reversed to your account.
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border border-gray-300 text-xs rounded"
              >
                <option value="Changed my mind">Changed my mind</option>
                <option value="Ordered incorrect size / variant">Ordered incorrect size / variant</option>
                <option value="Found alternative creation">Found alternative creation</option>
                <option value="Delivery duration too long">Delivery duration too long</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-red-700"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReturnModal(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-luxury-950">
              Request Atelier Return
            </h3>
            <p className="text-xs text-gray-600">
              NexKart offers a complimentary 14-day return privilege. Pieces must remain unworn with security tags intact.
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Return Reason *</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-2 border border-gray-300 text-xs rounded"
              >
                <option value="Size / fit issue">Size / fit issue</option>
                <option value="Fabric / material preference">Fabric / material preference</option>
                <option value="Defect or blemish noticed">Defect or blemish noticed</option>
                <option value="Received incorrect piece">Received incorrect piece</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Additional Note (Optional)</label>
              <textarea
                rows={3}
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="Provide any details for the atelier concierge..."
                className="w-full p-2 border border-gray-300 text-xs rounded"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleRequestReturn}
                disabled={returning}
                className="flex-1 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-black"
              >
                {returning ? 'Submitting...' : 'Submit Return Request'}
              </button>
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
