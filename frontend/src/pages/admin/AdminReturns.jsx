import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { RotateCcw, Check, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminReturns = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getOrders();
      if (res.success) {
        // Filter orders that have return requests
        const returnOrders = (res.orders || []).filter(
          (o) => o.returnRequest && o.returnRequest.status !== 'None'
        );
        setOrders(returnOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleDecision = async (orderId, status) => {
    try {
      const res = await adminAPI.handleReturn(orderId, {
        status,
        refundStatus: status === 'Approved' ? 'Processed' : 'None',
      });
      if (res.success) {
        addToast(`Return request ${status.toLowerCase()} successfully.`);
        fetchReturns();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Post-Sale Atelier Services
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Returns & Refund Requests ({orders.length})
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center space-y-2 text-xs text-gray-500">
            <RotateCcw className="w-8 h-8 mx-auto text-gray-300" />
            <p className="font-semibold uppercase tracking-wider text-luxury-950">
              No Return Requests Pending
            </p>
            <p>All client orders remain fulfilled in satisfactory status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Return Reason & Note</th>
                  <th className="py-3 px-4 font-semibold">Refund Amount</th>
                  <th className="py-3 px-4 font-semibold">Return Status</th>
                  <th className="py-3 px-4 font-semibold">Refund Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Concierge Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-luxury-950">
                      <Link to={`/order-tracking/${ord._id}`} className="hover:underline text-gold-700">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-luxury-950">{ord.shippingAddress?.fullName}</p>
                      <p className="text-[10px] text-gray-400">{ord.shippingAddress?.mobile}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-luxury-900">{ord.returnRequest?.reason}</p>
                      {ord.returnRequest?.note && (
                        <p className="text-[11px] text-gray-500 italic mt-0.5">
                          "{ord.returnRequest.note}"
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-luxury-950">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.returnRequest?.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : ord.returnRequest?.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {ord.returnRequest?.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-gray-700">
                        {ord.returnRequest?.refundStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {ord.returnRequest?.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => handleDecision(ord._id, 'Approved')}
                            className="px-2.5 py-1 bg-green-700 text-white rounded text-[10px] uppercase font-bold hover:bg-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(ord._id, 'Rejected')}
                            className="px-2.5 py-1 border border-red-300 text-red-600 rounded text-[10px] uppercase font-bold hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
