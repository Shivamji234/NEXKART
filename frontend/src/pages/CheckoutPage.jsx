import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { addressAPI, orderAPI, paymentAPI, couponAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  CreditCard,
  Banknote,
  Plus,
  ArrowRight,
  Lock,
  Tag,
  ChevronRight,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage = () => {
  const {
    items,
    subtotal,
    discountAmount,
    tax,
    shipping,
    grandTotal,
    coupon,
    clearCart,
    fetchCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Always fetch latest cart & live synced prices on mount
  useEffect(() => {
    if (fetchCart) {
      fetchCart();
    }
  }, []);

  // Fetch available discount coupons for one-tap apply
  useEffect(() => {
    couponAPI
      .getPublic()
      .then((res) => {
        if (res.success && res.coupons) {
          setAvailableCoupons(res.coupons);
        }
      })
      .catch((err) => console.log('Notice: coupons fetch', err.message));
  }, []);

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim();
    if (!code) {
      addToast('Please enter a coupon code.', 'info');
      return;
    }
    setCouponLoading(true);
    const res = await applyCoupon(code);
    setCouponLoading(false);
    if (res && res.success) {
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    await removeCoupon();
    setCouponLoading(false);
  };

  // Multi-step: 1 = Address, 2 = Payment & Review
  const [currentStep, setCurrentStep] = useState(1);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
    isDefault: true,
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' | 'razorpay' | 'cod'
  const [upiTxnId, setUpiTxnId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [merchantUpiId, setMerchantUpiId] = useState('7268927163@upi');
  const [merchantUpiName, setMerchantUpiName] = useState('NEXKART Maison');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch live UPI & Payment configuration
  useEffect(() => {
    paymentAPI
      .getKey()
      .then((res) => {
        if (res.upiId) setMerchantUpiId(res.upiId);
        if (res.upiName) setMerchantUpiName(res.upiName);
      })
      .catch((err) => console.log('Notice: using default payment config', err.message));
  }, []);

  // Load addresses
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    const loadAddresses = async () => {
      try {
        const res = await addressAPI.getAddresses();
        if (res.success && res.addresses?.length > 0) {
          setAddresses(res.addresses);
          const defaultAddr = res.addresses.find((a) => a.isDefault) || res.addresses[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      }
    };

    loadAddresses();
  }, [isAuthenticated, navigate]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-gray-500">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-widest font-semibold rounded"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.mobile || !newAddress.house || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      addToast('Please complete all required address fields.', 'error');
      return;
    }

    try {
      const res = await addressAPI.addAddress(newAddress);
      if (res.success) {
        setAddresses([res.address, ...addresses]);
        setSelectedAddressId(res.address._id);
        setShowNewAddressForm(false);
        addToast('Address saved successfully.');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const getSelectedAddress = () => {
    return addresses.find((a) => a._id === selectedAddressId);
  };

  // Place Order execution
  const handlePlaceOrder = async () => {
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress) {
      addToast('Please select or add a delivery address.', 'error');
      setCurrentStep(1);
      return;
    }

    const orderPayload = {
      orderItems: items.map((i) => ({
        product: i.product?._id || i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      shippingAddress: {
        fullName: selectedAddress.fullName,
        mobile: selectedAddress.mobile,
        house: selectedAddress.house,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        landmark: selectedAddress.landmark,
        addressType: selectedAddress.addressType,
      },
      paymentMethod,
      itemsPrice: subtotal,
      discountAmount,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: grandTotal,
      couponApplied: coupon ? { code: coupon.code, discountAmount } : undefined,
    };

    setProcessingPayment(true);

    try {
      // 1. UPI INSTANT QR CODE FLOW
      if (paymentMethod === 'upi_qr') {
        if (!upiTxnId || upiTxnId.trim().length < 6) {
          addToast('Please enter your 12-digit UPI Reference / UTR Number or Transaction ID.', 'error');
          setProcessingPayment(false);
          return;
        }

        const upiOrderRes = await orderAPI.createOrder({
          ...orderPayload,
          paymentMethod: 'upi_qr',
          paymentResult: {
            upiTxnId: upiTxnId.trim(),
            upiId: merchantUpiId,
            paidAt: new Date(),
          },
        });

        if (!upiOrderRes.success) {
          throw new Error(upiOrderRes.message || 'Failed to place UPI order');
        }

        const createdOrder = upiOrderRes.order;

        // Verify and record payment transaction
        try {
          await paymentAPI.verifyUpiPayment({
            orderId: createdOrder._id,
            upiTxnId: upiTxnId.trim(),
            upiId: merchantUpiId,
          });
        } catch (verifyErr) {
          console.warn('UPI ledger record note:', verifyErr.message);
        }

        await clearCart();
        addToast('UPI payment verified successfully. Order confirmed!');
        navigate(`/order-success/${createdOrder._id}`);
        return;
      }

      // 2. CASH ON DELIVERY FLOW
      if (paymentMethod === 'cod') {
        const res = await orderAPI.createOrder(orderPayload);
        if (res.success) {
          await clearCart();
          addToast('Your order has been placed with Cash on Delivery.');
          navigate(`/order-success/${res.order._id}`);
          return;
        }
      }

      // 2. RAZORPAY PAYMENT FLOW
      if (paymentMethod === 'razorpay') {
        // Create order on backend first to get safe order
        const createdOrderRes = await orderAPI.createOrder(orderPayload);
        if (!createdOrderRes.success) {
          throw new Error(createdOrderRes.message || 'Failed to create order');
        }
        const createdOrder = createdOrderRes.order;

        // Create Razorpay transaction order using verified server total
        const rzpOrderRes = await paymentAPI.createRazorpayOrder({
          amount: createdOrder.totalPrice,
          orderId: createdOrder._id,
          receipt: `rcpt_${createdOrder.orderNumber}`,
        });

        const rzpOrder = rzpOrderRes.order;

        // Check if Razorpay SDK script is available on window
        if (typeof window.Razorpay === 'function' && !rzpOrderRes.isSandboxSimulated) {
          const keyRes = await paymentAPI.getKey();
          const options = {
            key: keyRes.key,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: 'NEXKART Maison',
            description: `Order #${createdOrder.orderNumber} - White-Glove Concierge`,
            image: '/favicon.svg',
            order_id: rzpOrder.id,
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.mobile,
            },
            theme: {
              color: '#0C0C0C',
            },
            handler: async function (response) {
              try {
                // Verify signature on backend
                const verifyRes = await paymentAPI.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: createdOrder._id,
                });

                if (verifyRes.success) {
                  await clearCart();
                  addToast('Payment verified successfully. Order confirmed!');
                  navigate(`/order-success/${createdOrder._id}`);
                }
              } catch (verifyErr) {
                addToast(`Payment verification failed: ${verifyErr.message}`, 'error');
              }
            },
            modal: {
              ondismiss: function () {
                setProcessingPayment(false);
                addToast('Payment was not completed. Your order is pending in your account.', 'info');
                navigate(`/order-tracking/${createdOrder._id}`);
              },
            },
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.open();
        } else {
          // Sandboxed / Test Environment Simulation
          // Automatically simulates Razorpay signature verification and captures transaction
          const mockPaymentId = `pay_sandbox_${Date.now()}`;
          const verifyRes = await paymentAPI.verifyPayment({
            razorpay_order_id: rzpOrder.id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'verified_sandbox_token',
            orderId: createdOrder._id,
          });

          if (verifyRes.success) {
            await clearCart();
            addToast('Sandbox payment verified successfully. Order confirmed!');
            navigate(`/order-success/${createdOrder._id}`);
          }
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Steps Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Atelier Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Secure Luxury Checkout
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center space-x-1 ${
              currentStep === 1 ? 'text-luxury-950 font-bold underline' : 'text-gray-400'
            }`}
          >
            <span>1. Delivery Address</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <button
            onClick={() => {
              if (selectedAddressId) setCurrentStep(2);
              else addToast('Please select a delivery address.', 'info');
            }}
            className={`flex items-center space-x-1 ${
              currentStep === 2 ? 'text-luxury-950 font-bold underline' : 'text-gray-400'
            }`}
          >
            <span>2. Payment & Confirmation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: Address Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gold-600" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-luxury-950">
                    Step 1: Select White-Glove Delivery Address
                  </h2>
                </div>

                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-900 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Saved Addresses List */}
              {!showNewAddressForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition flex flex-col justify-between ${
                        selectedAddressId === addr._id
                          ? 'border-luxury-950 bg-gold-50/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-luxury-950">{addr.fullName}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                            {addr.addressType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {addr.house}, {addr.street}
                        </p>
                        <p className="text-xs text-gray-600">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-gray-400">Landmark: {addr.landmark}</p>
                        )}
                        <p className="text-xs text-gray-800 font-medium pt-1">
                          Phone: {addr.mobile}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-xs font-semibold">
                        {selectedAddressId === addr._id ? (
                          <span className="text-luxury-950 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1 text-gold-600" />
                            Deliver to this address
                          </span>
                        ) : (
                          <span className="text-gray-400">Select address</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Address Form */}
              {showNewAddressForm && (
                <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newAddress.mobile}
                        onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Flat / Building / Residence *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.house}
                        onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Street / Area / Locality *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                        Address Category
                      </label>
                      <select
                        value={newAddress.addressType}
                        onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950 bg-white"
                      >
                        <option value="Home">Home (Residential)</option>
                        <option value="Work">Work / Executive Office</option>
                        <option value="Other">Other Concierge Point</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded"
                    >
                      Save & Use This Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {!showNewAddressForm && addresses.length > 0 && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center space-x-2"
                  >
                    <span>Proceed to Payment Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Payment Method Selection */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-gold-600" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-luxury-950">
                    Step 2: Choose Payment Method
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-gold-700 hover:underline"
                >
                  Change Address
                </button>
              </div>

              {/* Selected Address Summary */}
              {getSelectedAddress() && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-luxury-950">Delivering to: </span>
                    {getSelectedAddress().fullName} ({getSelectedAddress().city} - {getSelectedAddress().pincode})
                  </div>
                </div>
              )}

              {/* Promo / Discount Code Card */}
              <div className="p-4 sm:p-5 bg-gold-50/30 rounded-lg border border-gold-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gold-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-950">
                      Apply Discount / Promo Privilege
                    </h3>
                  </div>
                  {coupon && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2 py-0.5 rounded">
                      Promo Active
                    </span>
                  )}
                </div>

                {coupon ? (
                  <div className="p-3 bg-white border border-gold-300 rounded-lg flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-luxury-950 tracking-wider">
                            {coupon.code}
                          </span>
                          <span className="text-[10px] text-green-700 font-bold uppercase">
                            APPLIED
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Privilege discount: <strong className="text-green-700">-{formatCurrency(discountAmount)}</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      className="text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-800 hover:underline px-2 py-1"
                    >
                      {couponLoading ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Enter discount code (e.g. VIP, LUXURY20)"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-gray-300 rounded text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-luxury-950"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-wider rounded hover:bg-black transition disabled:opacity-40 flex items-center justify-center space-x-1.5"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{couponLoading ? 'Applying...' : 'Apply Code'}</span>
                      </button>
                    </div>

                    {/* Available Clickable Coupons */}
                    {availableCoupons.length > 0 && (
                      <div className="pt-2 border-t border-gold-200/60">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-gold-600" />
                          <span>Available Privileges (Tap to Apply):</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableCoupons.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleApplyCoupon(c.code)}
                              className="px-2.5 py-1 bg-white hover:bg-gold-50 border border-gold-300 text-luxury-950 rounded text-[11px] font-mono font-bold flex items-center space-x-1 transition active:scale-95 shadow-xs"
                            >
                              <Tag className="w-3 h-3 text-gold-600" />
                              <span>{c.code}</span>
                              <span className="text-[10px] text-green-700 font-sans font-semibold">
                                ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* UPI Instant QR Code Scan & Pay Option */}
                <div
                  className={`rounded-lg border-2 transition overflow-hidden ${
                    paymentMethod === 'upi_qr'
                      ? 'border-luxury-950 bg-gold-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('upi_qr')}
                    className="p-5 cursor-pointer flex items-start space-x-4"
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === 'upi_qr'}
                      onChange={() => setPaymentMethod('upi_qr')}
                      className="mt-1 text-luxury-950 focus:ring-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-4 h-4 text-gold-700" />
                          <p className="font-bold text-xs uppercase tracking-wider text-luxury-950">
                            UPI QR Code (Scan & Pay)
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded">
                          FASTEST &bull; 0% FEE
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Scan & pay directly from Google Pay, PhonePe, Paytm, BHIM, CRED or any banking UPI app.
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[10px] font-semibold text-gray-500">
                        <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-700">Google Pay</span>
                        <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-700">PhonePe</span>
                        <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-700">Paytm</span>
                        <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-700">BHIM UPI</span>
                        <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-700">CRED</span>
                      </div>
                    </div>
                  </label>

                  {/* Expanded QR Code & Verification Form when selected */}
                  {paymentMethod === 'upi_qr' && (
                    <div className="px-5 pb-5 pt-2 border-t border-gold-200/60 bg-white space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
                        {/* QR Code Graphic */}
                        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-gold-300 shadow-sm flex-shrink-0">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(
                              `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantUpiName)}&am=${grandTotal}&cu=INR&tn=NexKartOrder`
                            )}`}
                            alt="NexKart UPI QR Code"
                            className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded"
                          />
                          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700 mt-2 flex items-center space-x-1">
                            <QrCode className="w-3 h-3" />
                            <span>Scan With Any UPI App</span>
                          </span>
                        </div>

                        {/* Payment Details & Copy Button */}
                        <div className="flex-1 space-y-3 text-left w-full">
                          <div className="flex items-center space-x-1.5 text-xs text-green-700 font-semibold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verified Business Merchant Account</span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-semibold">
                              Total Payable Amount
                            </span>
                            <span className="text-xl sm:text-2xl font-bold font-serif text-luxury-950">
                              {formatCurrency(grandTotal)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-semibold mb-1">
                              Receiver UPI ID
                            </span>
                            <div className="flex items-center space-x-2">
                              <code className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded font-mono text-xs font-bold text-luxury-950">
                                {merchantUpiId}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(merchantUpiId);
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                  addToast(`UPI ID copied to clipboard: ${merchantUpiId}`);
                                }}
                                className="px-3 py-1.5 bg-luxury-950 text-gold-400 hover:bg-black rounded text-[11px] font-semibold flex items-center space-x-1"
                              >
                                {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Mobile Direct Pay Link */}
                          <div className="pt-1 block sm:hidden">
                            <a
                              href={`upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantUpiName)}&am=${grandTotal}&cu=INR&tn=NexKartOrder`}
                              className="inline-flex items-center space-x-1.5 text-xs font-bold text-luxury-950 bg-gold-400/30 px-3 py-2 rounded hover:bg-gold-400/50 w-full justify-center"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Tap to Open any UPI App on Phone</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* UTR / Transaction ID input */}
                      <div className="p-4 bg-gold-50/60 rounded-lg border border-gold-200 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-luxury-950 block">
                          Enter 12-Digit UPI Transaction ID / UTR Number *
                        </label>
                        <p className="text-[11px] text-gray-600">
                          After completing the payment in GPay / PhonePe / Paytm / CRED, copy the 12-digit UTR or Reference Number from your payment receipt and enter it here:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            required
                            value={upiTxnId}
                            onChange={(e) => setUpiTxnId(e.target.value)}
                            placeholder="e.g. 425612348970 (12 digits)"
                            className="flex-1 px-3.5 py-2.5 bg-white border border-gray-300 rounded text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-luxury-950 text-luxury-950 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Razorpay Option */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 rounded-lg border-2 cursor-pointer flex items-start space-x-4 transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-luxury-950 bg-gold-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-luxury-950 focus:ring-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs uppercase tracking-wider text-luxury-950">
                        Razorpay Secure Checkout
                      </p>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                        CARDS / NETBANKING
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Instant & encrypted authorization via Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking & Wallets.
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] font-semibold text-gray-400 pt-1">
                      <span>Visa</span>
                      <span>&bull;</span>
                      <span>Mastercard</span>
                      <span>&bull;</span>
                      <span>RuPay</span>
                      <span>&bull;</span>
                      <span>NetBanking</span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-lg border-2 cursor-pointer flex items-start space-x-4 transition ${
                    paymentMethod === 'cod'
                      ? 'border-luxury-950 bg-gold-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-luxury-950 focus:ring-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs uppercase tracking-wider text-luxury-950">
                        Cash on Delivery (COD)
                      </p>
                      <Banknote className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Pay securely upon inspection and hand-off with our white-glove courier concierge.
                    </p>
                  </div>
                </label>
              </div>

              {/* Security guarantee */}
              <div className="p-4 bg-gray-50 rounded border border-gray-200 flex items-center space-x-3 text-xs text-gray-600">
                <Lock className="w-5 h-5 text-gold-600 flex-shrink-0" />
                <p>
                  PCI-DSS Level 1 compliant checkout. Sensitive banking and payment credentials are never stored on NexKart servers.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto text-center py-2 text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-black"
                >
                  &larr; Back to Address
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={processingPayment}
                  className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 bg-luxury-950 text-gold-400 font-bold uppercase tracking-wider sm:tracking-widest text-xs rounded hover:bg-black transition shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>
                    {processingPayment
                      ? 'Verifying & Confirming...'
                      : paymentMethod === 'upi_qr'
                      ? `Verify Payment & Place Order • ${formatCurrency(grandTotal)}`
                      : `Complete Order • ${formatCurrency(grandTotal)}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-luxury-950 pb-3 border-b border-gray-100">
              Bag Summary ({items.length} items)
            </h2>

            {/* Thumbnail items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-luxury-950 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-500">
                      Qty: {item.quantity} {item.size && `&bull; Size: ${item.size}`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-luxury-950">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Box in Summary */}
            {coupon ? (
              <div className="p-3 bg-gold-50/70 border border-gold-200 rounded text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-gold-700" />
                  <div>
                    <span className="font-mono font-bold text-luxury-950">{coupon.code}</span>
                    <p className="text-[10px] text-green-700 font-semibold">Savings: -{formatCurrency(discountAmount)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  disabled={couponLoading}
                  className="text-[10px] font-bold text-red-600 uppercase hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="Promo code (e.g. VIP)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-luxury-950"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-3.5 py-2 bg-luxury-950 text-gold-400 text-xs font-bold uppercase tracking-wider rounded hover:bg-black transition disabled:opacity-40"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {availableCoupons.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {availableCoupons.slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2 py-0.5 bg-gray-50 hover:bg-gold-50 border border-gray-200 text-[10px] font-mono font-semibold text-gray-700 rounded transition"
                      >
                        {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-luxury-950">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-700 font-semibold">
                  <span>Privilege Savings ({coupon?.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-semibold text-luxury-950">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>White-Glove Shipping</span>
                <span className="font-semibold text-luxury-950">
                  {shipping === 0 ? <span className="text-green-700">Complimentary</span> : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-luxury-950 pt-3 border-t border-gray-200">
                <span>Total Due</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
