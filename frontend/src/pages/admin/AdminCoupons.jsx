import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { Ticket, Plus, Trash2, X, Tag } from 'lucide-react';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 3000,
    maxDiscount: 2000,
    expirationDate: '',
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCoupons();
      if (res.success) setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: Number(formData.maxDiscount),
        expirationDate: formData.expirationDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      };

      const res = await adminAPI.createCoupon(payload);
      if (res.success) {
        addToast(`Privilege code '${payload.code}' generated.`);
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await adminAPI.deleteCoupon(id);
      addToast('Privilege code removed.');
      fetchCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Marketing & Privileges
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Promotional Coupons ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center space-x-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-gold-50 border border-gold-300 text-gold-900 font-mono font-bold text-sm tracking-wider rounded">
                  {c.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-light">{c.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Discount:</span>
                <strong className="text-luxury-950">
                  {c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Min Order Spend:</span>
                <span>{formatCurrency(c.minOrderValue)}</span>
              </div>
              {c.maxDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span>{formatCurrency(c.maxDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                <span>Expires:</span>
                <span>{formatDate(c.expirationDate)}</span>
              </div>
            </div>

            <button
              onClick={() => handleDeleteCoupon(c._id)}
              className="w-full py-1.5 border border-red-200 text-red-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-red-50 flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Coupon</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
                Generate Promotional Coupon
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. VIP25"
                  className="w-full px-3 py-2 border rounded font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 25% privilege discount on all outerwear"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Max Cap Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-luxury-950 text-gold-400 font-bold uppercase tracking-widest rounded hover:bg-black"
                >
                  Create Privilege
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 font-bold uppercase tracking-widest rounded text-gray-700"
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
