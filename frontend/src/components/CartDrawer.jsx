import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    totalItemsCount,
    subtotal,
    discountAmount,
    tax,
    shipping,
    grandTotal,
    coupon,
    isCartOpen,
    closeCartDrawer,
    updateQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCode.trim());
    setCouponLoading(false);
    setCouponCode('');
  };

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-gray-200">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-luxury-950" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-luxury-950">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-champagne-light border-b border-champagne-dark/30">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-[11px] text-luxury-800 tracking-wide">
                Add <span className="font-bold text-luxury-950">{formatCurrency(amountNeededForFreeShipping)}</span> more to unlock <span className="font-semibold text-gold-700">Complimentary White-Glove Delivery</span>.
              </p>
            ) : (
              <p className="text-[11px] text-green-800 font-medium tracking-wide">
                You have unlocked <span className="font-bold">Complimentary White-Glove Delivery</span>!
              </p>
            )}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gold-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-gray-100 text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-800">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Explore our curated seasonal collections and elevate your everyday wardrobe.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="mt-2 px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold tracking-widest uppercase rounded hover:bg-luxury-800 transition"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => {
                const productId = item.product?._id || item.product;
                return (
                  <div key={item._id} className="pt-4 first:pt-0 flex space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/product/${productId}`}
                            onClick={closeCartDrawer}
                            className="text-xs font-medium text-luxury-950 hover:text-gold-700 line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span>&bull;</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button
                            onClick={() => updateQty(item._id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-[11px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-luxury-950">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-gray-200 space-y-3">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-gold-50 border border-gold-200 rounded text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3.5 h-3.5 text-gold-700" />
                    <span className="font-semibold text-gold-900 tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      (-{formatCurrency(discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] uppercase font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Privilege Code (e.g. LUXURY20)"
                    className="flex-1 px-3 py-1.5 border border-gray-300 text-xs rounded uppercase tracking-wider focus:outline-none focus:border-luxury-950"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-1.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-luxury-800 transition disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-luxury-950">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold-700 font-medium">
                    <span>Privilege Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-luxury-950">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="font-medium text-luxury-950">
                    {shipping === 0 ? <span className="text-green-700 font-semibold">Complimentary</span> : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-luxury-950 pt-2 border-t border-gray-200">
                  <span>Total Due</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-luxury-950 text-gold-400 font-semibold uppercase tracking-widest text-xs rounded hover:bg-luxury-800 transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                className="w-full py-2 text-center text-xs uppercase tracking-wider text-gray-600 hover:text-black font-semibold"
              >
                View Detailed Bag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
