import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { Ticket, Plus, Trash2, X, Tag, Clock, Calendar, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';

// Helper to convert Date to YYYY-MM-DDTHH:mm for datetime-local input
const toDateTimeLocalValue = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Default expiration: 7 days from now at 23:59
const getDefaultExpiration = (days = 7) => {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  d.setHours(23, 59, 0, 0);
  return toDateTimeLocalValue(d);
};

// Calculate remaining time or expired status
const getRemainingTimeText = (expirationDate) => {
  const now = new Date();
  const exp = new Date(expirationDate);
  const diffMs = exp.getTime() - now.getTime();
  if (diffMs <= 0) return { expired: true, text: 'Expired' };
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return { expired: false, text: `Expires in ${diffMins}m` };
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return { expired: false, text: `Expires in ${diffHours}h ${diffMins % 60}m` };
  const diffDays = Math.floor(diffHours / 24);
  return { expired: false, text: `Expires in ${diffDays}d ${diffHours % 24}h` };
};

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [editExpirationDate, setEditExpirationDate] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'fixed',
    discountValue: 250,
    minOrderValue: 0,
    maxDiscount: 250,
    expirationDate: getDefaultExpiration(7),
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
      const isFixed = formData.discountType === 'fixed';
      const discVal = Number(formData.discountValue);
      const expDate = formData.expirationDate
        ? new Date(formData.expirationDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: discVal,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: isFixed ? discVal : (Number(formData.maxDiscount) || 0),
        expirationDate: expDate,
      };

      const res = await adminAPI.createCoupon(payload);
      if (res.success) {
        addToast(`Privilege code '${payload.code}' generated with expiry.`);
        setIsModalOpen(false);
        setFormData({
          code: '',
          description: '',
          discountType: 'fixed',
          discountValue: 250,
          minOrderValue: 0,
          maxDiscount: 250,
          expirationDate: getDefaultExpiration(7),
        });
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleOpenEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setEditExpirationDate(toDateTimeLocalValue(coupon.expirationDate));
    setEditActive(coupon.active !== false);
    setEditModalOpen(true);
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCoupon) return;
    try {
      setSavingEdit(true);
      const expDate = editExpirationDate
        ? new Date(editExpirationDate).toISOString()
        : selectedCoupon.expirationDate;

      const res = await adminAPI.updateCoupon(selectedCoupon._id, {
        expirationDate: expDate,
        active: editActive,
      });

      if (res.success) {
        addToast(`Coupon '${selectedCoupon.code}' expiry updated successfully!`);
        setEditModalOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update coupon', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this coupon?')) return;
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
          <p className="text-xs text-gray-500 mt-0.5">
            Configure discount codes, flat reductions, and precise expiration date & time limits.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              expirationDate: getDefaultExpiration(7),
            }));
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center space-x-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => {
          const timeInfo = getRemainingTimeText(c.expirationDate);
          const isExpired = timeInfo.expired;
          const isActive = c.active !== false && !isExpired;

          return (
            <div
              key={c._id}
              className={`bg-white rounded-lg border p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                isExpired
                  ? 'border-red-200 bg-red-50/10'
                  : !c.active
                  ? 'border-gray-200 opacity-70'
                  : 'border-gray-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-gold-50 border border-gold-300 text-gold-900 font-mono font-bold text-sm tracking-wider rounded">
                    {c.code}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {!c.active ? (
                      <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        Disabled
                      </span>
                    ) : isExpired ? (
                      <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Expired</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}

                    {isActive && (
                      <span className="text-[10px] font-semibold text-gold-800 bg-gold-50/80 border border-gold-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{timeInfo.text}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-light min-h-[1.5rem]">
                  {c.description || (
                    <span className="italic text-gray-400">No description provided</span>
                  )}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <strong className="text-luxury-950 font-semibold">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Min Order Spend:</span>
                  <span>{c.minOrderValue > 0 ? formatCurrency(c.minOrderValue) : 'No minimum'}</span>
                </div>
                {c.discountType === 'percentage' && c.maxDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <span>{formatCurrency(c.maxDiscount)}</span>
                  </div>
                )}
                <div
                  className={`flex justify-between items-center pt-2 mt-1 border-t text-[11px] ${
                    isExpired ? 'text-red-700 font-semibold' : 'text-gray-600'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gold-600" />
                    <span>Expires At:</span>
                  </span>
                  <span className="font-medium">{formatDate(c.expirationDate)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(c)}
                  className="py-1.5 border border-gold-300 text-luxury-950 bg-gold-50/50 hover:bg-gold-100 text-xs font-semibold uppercase tracking-wider rounded transition flex items-center justify-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gold-700" />
                  <span>Extend Expiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(c._id)}
                  className="py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider rounded transition flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-gold-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
                  Generate Promotional Coupon
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. VIP250"
                  className="w-full px-3 py-2 border rounded font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Flat ₹250 exclusive privilege discount"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData({
                        ...formData,
                        discountType: newType,
                        discountValue: newType === 'fixed' ? 250 : 15,
                        maxDiscount: newType === 'fixed' ? 250 : 2000,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded bg-white font-medium"
                  >
                    <option value="fixed">Fixed Amount (₹ Off)</option>
                    <option value="percentage">Percentage (% Off)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                    {formData.discountType === 'percentage' ? 'Discount % *' : 'Flat Discount ₹ *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 250'}
                    className="w-full px-3 py-2 border rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Min Order Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="0 for any order"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  {formData.discountType === 'percentage' ? (
                    <>
                      <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Max Cap Discount (₹)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                        placeholder="e.g. 2000"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </>
                  ) : (
                    <div className="bg-gold-50/60 p-2 rounded border border-gold-200 text-luxury-900 mt-1">
                      <p className="text-[10px] font-bold text-gold-900 uppercase">Flat ₹{formData.discountValue || 0} Off</p>
                      <p className="text-[9px] text-gray-500 leading-tight">Deducted directly from cart</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expiration Date & Timing Control */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-luxury-950 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    <span>Expire Timing (Date & Time Limit) *</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Coupon stops working after this</span>
                </div>

                <input
                  type="datetime-local"
                  required
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded font-mono text-xs bg-white focus:ring-1 focus:ring-gold-500"
                />

                {/* Quick Expiry Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-medium mr-1">Quick Presets:</span>
                  {[
                    { label: '+24h Flash', hours: 24 },
                    { label: '+3 Days', days: 3 },
                    { label: '+7 Days', days: 7 },
                    { label: '+30 Days', days: 30 },
                    { label: '+90 Days', days: 90 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        let targetDate;
                        if (preset.hours) {
                          targetDate = new Date(Date.now() + preset.hours * 60 * 60 * 1000);
                        } else {
                          targetDate = new Date(Date.now() + preset.days * 24 * 60 * 60 * 1000);
                          targetDate.setHours(23, 59, 0, 0);
                        }
                        setFormData({ ...formData, expirationDate: toDateTimeLocalValue(targetDate) });
                      }}
                      className="px-2 py-1 text-[10px] font-semibold bg-white hover:bg-gold-50 hover:text-gold-900 border border-gray-200 rounded shadow-2xs transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-luxury-950 text-gold-400 font-bold uppercase tracking-widest rounded hover:bg-black transition"
                >
                  Create Privilege
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 font-bold uppercase tracking-widest rounded text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Extend Expiry Modal */}
      {editModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
                  Update Expiration Timing
                </h3>
              </div>
              <button onClick={() => setEditModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleUpdateCoupon} className="space-y-4 text-xs">
              <div className="p-3 bg-gold-50/50 border border-gold-200 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Coupon Code</span>
                  <strong className="text-sm font-mono text-luxury-950 font-bold">{selectedCoupon.code}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Discount</span>
                  <span className="text-xs font-bold text-luxury-950">
                    {selectedCoupon.discountType === 'percentage'
                      ? `${selectedCoupon.discountValue}%`
                      : formatCurrency(selectedCoupon.discountValue)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                  New Expiration Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={editExpirationDate}
                  onChange={(e) => setEditExpirationDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded font-mono text-xs bg-white focus:ring-1 focus:ring-gold-500"
                />

                {/* Quick Extend Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-400 font-medium mr-1">Extend By:</span>
                  {[
                    { label: '+24 Hours', hours: 24 },
                    { label: '+3 Days', days: 3 },
                    { label: '+7 Days', days: 7 },
                    { label: '+30 Days', days: 30 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        let base = new Date();
                        const currentEdit = new Date(editExpirationDate);
                        if (!isNaN(currentEdit.getTime()) && currentEdit > base) {
                          base = currentEdit;
                        }
                        let targetDate;
                        if (preset.hours) {
                          targetDate = new Date(base.getTime() + preset.hours * 60 * 60 * 1000);
                        } else {
                          targetDate = new Date(base.getTime() + preset.days * 24 * 60 * 60 * 1000);
                          targetDate.setHours(23, 59, 0, 0);
                        }
                        setEditExpirationDate(toDateTimeLocalValue(targetDate));
                      }}
                      className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-gold-50 hover:text-gold-900 border border-gray-200 rounded transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded bg-gray-50">
                <div>
                  <span className="text-[11px] font-bold text-luxury-950 block">Coupon Status</span>
                  <span className="text-[10px] text-gray-500">Enable or disable this coupon code</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex space-x-3 pt-3 border-t">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 bg-luxury-950 text-gold-400 font-bold uppercase tracking-widest rounded hover:bg-black transition disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Expiry Time'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 font-bold uppercase tracking-widest rounded text-gray-700 hover:bg-gray-50 transition"
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
