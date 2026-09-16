import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { couponAPI } from '../services/api';
import {
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const CartPage = () => {
  const {
    items,
    totalItemsCount,
    subtotal,
    discountAmount,
    tax,
    shipping,
    grandTotal,
    coupon,
    updateQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    fetchCart,
  } = useCart();

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    if (fetchCart) {
      fetchCart();
    }
    couponAPI
      .getPublic()
      .then((res) => {
        if (res.success && res.coupons) {
          setAvailableCoupons(res.coupons);
        }
      })
      .catch((err) => console.log('Notice: coupons fetch', err.message));
  }, []);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e, codeOverride) => {
    if (e) e.preventDefault();
    const code = (codeOverride || couponCode).trim();
    if (!code) return;
    setCouponLoading(true);
    await applyCoupon(code);
    setCouponLoading(false);
    setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our seasonal haute couture and bespoke accessories to fill your bag.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-luxury-800 transition shadow-lg"
        >
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Order Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Shopping Bag ({totalItemsCount} {totalItemsCount === 1 ? 'Piece' : 'Pieces'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-600 transition"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {items.map((item) => {
              const productId = item.product?._id || item.product;
              return (
                <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded bg-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${productId}`}
                        className="text-xs sm:text-sm font-semibold text-luxury-950 hover:text-gold-700 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1 flex flex-wrap gap-2">
                        {item.size && <span>Size: <strong className="text-black">{item.size}</strong></span>}
                        {item.color && <span>Color: <strong className="text-black">{item.color}</strong></span>}
                      </div>
                      <p className="text-xs font-semibold text-luxury-900 mt-1 sm:mt-2">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Stepper & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="p-1.5 text-gray-600 hover:text-black"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 sm:px-3 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="p-1.5 text-gray-600 hover:text-black"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-luxury-950 min-w-[70px] sm:min-w-[80px] text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider text-gray-600 hover:text-black font-semibold"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Col: Summary & Checkout */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-luxury-950 pb-3 border-b border-gray-100">
              Order Privilege Summary
            </h2>

            {/* Coupon Box */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-gold-50 border border-gold-200 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gold-700" />
                  <div>
                    <p className="font-bold text-gold-900 tracking-wider">{coupon.code}</p>
                    <p className="text-[10px] text-gray-500">Savings: -{formatCurrency(discountAmount)}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-[11px] font-bold text-red-600 uppercase hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Promo Code (e.g. VIP, LUXURY20)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs uppercase tracking-wider focus:outline-none focus:border-luxury-950 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-luxury-800 transition disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
                {availableCoupons.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-gold-600" />
                      <span>Available Privileges (Tap to Apply):</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {availableCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(null, c.code)}
                          className="px-2 py-0.5 bg-gray-50 hover:bg-gold-50 border border-gray-200 text-[10px] font-mono font-semibold text-gray-800 rounded transition"
                        >
                          <Tag className="w-2.5 h-2.5 inline mr-1 text-gold-600" />
                          {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pricing details */}
            <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-luxury-950">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-700 font-semibold">
                  <span>Privilege Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST / Luxury Tax (5%)</span>
                <span className="font-semibold text-luxury-950">{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>White-Glove Courier Delivery</span>
                <span className="font-semibold text-luxury-950">
                  {shipping === 0 ? <span className="text-green-700 font-bold">Complimentary (FREE)</span> : formatCurrency(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-luxury-950 pt-3 border-t border-gray-200">
                <span>Total Amount Due</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-luxury-950 text-gold-400 font-semibold uppercase tracking-widest text-xs rounded hover:bg-black transition flex items-center justify-center space-x-2 shadow-xl"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantees */}
          <div className="bg-[#FAF8F5] rounded-xs p-5 border border-stone-200/80 space-y-3 text-xs text-stone-700">
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4 text-stone-800 flex-shrink-0" strokeWidth={1.25} />
              <span className="font-light">Complimentary insured delivery on all orders</span>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="w-4 h-4 text-stone-800 flex-shrink-0" strokeWidth={1.25} />
              <span className="font-light">14-day seamless concierge returns & exchanges</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-stone-800 flex-shrink-0" strokeWidth={1.25} />
              <span className="font-light">Secure 256-bit encrypted payment authorization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
