import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotifications();

  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync cart when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      const localCart = localStorage.getItem('nexkart_guest_cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (parsed.items && parsed.items.length > 0) {
            (async () => {
              for (const gi of parsed.items) {
                const pid = gi.product?._id || gi.product;
                if (pid) {
                  try {
                    await cartAPI.addToCart({
                      productId: pid,
                      quantity: gi.quantity || 1,
                      size: gi.size || '',
                      color: gi.color || '',
                    });
                  } catch (e) {
                    console.warn('Guest cart item merge notice:', e.message);
                  }
                }
              }
              localStorage.removeItem('nexkart_guest_cart');
              fetchCart();
            })();
            return;
          }
        } catch (e) {
          localStorage.removeItem('nexkart_guest_cart');
        }
      }
      fetchCart();
    } else {
      // Load guest cart from localStorage
      const localCart = localStorage.getItem('nexkart_guest_cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          setItems(parsed.items || []);
          calculateGuestTotals(parsed.items || [], parsed.coupon || null);
        } catch (e) {
          setItems([]);
        }
      } else {
        setItems([]);
        calculateGuestTotals([], null);
      }
    }
  }, [isAuthenticated]);

  const calculateGuestTotals = (cartItems, appliedCoupon) => {
    let sub = 0;
    cartItems.forEach((i) => {
      const prod = i.product;
      let effectivePrice = i.price;
      if (prod && typeof prod === 'object' && prod.price !== undefined) {
        effectivePrice = (prod.discountPrice > 0 && prod.discountPrice < prod.price)
          ? prod.discountPrice
          : prod.price;
        i.price = effectivePrice;
      }
      sub += effectivePrice * i.quantity;
    });

    let disc = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        disc = (sub * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
          disc = Math.min(disc, appliedCoupon.maxDiscount);
        }
      } else if (appliedCoupon.discountType === 'fixed') {
        disc = Math.min(appliedCoupon.discountValue, sub);
      }
    }

    const taxable = Math.max(0, sub - disc);
    const calculatedTax = Math.round(taxable * 0.05);
    const calculatedShipping = 0; // Complimentary delivery on all orders (₹0 Free Shipping)
    const total = Math.max(0, taxable + calculatedTax + calculatedShipping);

    setSubtotal(sub);
    setDiscountAmount(Math.round(disc));
    setTax(calculatedTax);
    setShipping(calculatedShipping);
    setGrandTotal(total);
    setCoupon(appliedCoupon);

    // Save guest cart in localStorage
    if (!isAuthenticated) {
      localStorage.setItem(
        'nexkart_guest_cart',
        JSON.stringify({ items: cartItems, coupon: appliedCoupon })
      );
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
        setSubtotal(res.cart.subtotal || 0);
        setDiscountAmount(res.cart.discountAmount || 0);
        setTax(res.cart.tax || 0);
        setShipping(res.cart.shipping || 0);
        setGrandTotal(res.cart.grandTotal || 0);
        setCoupon(res.cart.coupon || null);
      }
    } catch (err) {
      console.warn('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = '', color = '') => {
    const selectedSize = size || (product.sizes?.length > 0 ? product.sizes[0] : '');
    const selectedColor = color || (product.colors?.length > 0 ? product.colors[0].name : '');
    const price = (product.discountPrice > 0 && product.discountPrice < product.price)
      ? product.discountPrice
      : product.price;
    const image = product.images?.[0]?.url || '';

    if (isAuthenticated) {
      try {
        const res = await cartAPI.addToCart({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        });

        if (res.success) {
          setItems(res.cart.items);
          setSubtotal(res.cart.subtotal);
          setDiscountAmount(res.cart.discountAmount);
          setTax(res.cart.tax);
          setShipping(res.cart.shipping);
          setGrandTotal(res.cart.grandTotal);
          setCoupon(res.cart.coupon);
          addToast(`${product.name} added to your luxury bag.`);
          setIsCartOpen(true);
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      // Guest cart
      const existingIndex = items.findIndex(
        (i) =>
          (i.product?._id || i.product) === product._id &&
          i.size === selectedSize &&
          i.color === selectedColor
      );

      let updated = [...items];
      if (existingIndex > -1) {
        updated[existingIndex].quantity += Number(quantity);
      } else {
        updated.push({
          _id: `guest_${Date.now()}`,
          product,
          name: product.name,
          image,
          price,
          size: selectedSize,
          color: selectedColor,
          quantity: Number(quantity),
        });
      }

      setItems(updated);
      calculateGuestTotals(updated, coupon);
      addToast(`${product.name} added to your bag.`);
      setIsCartOpen(true);
    }
  };

  const updateQty = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateCartItem({ itemId, quantity });
        if (res.success) {
          setItems(res.cart.items);
          setSubtotal(res.cart.subtotal);
          setDiscountAmount(res.cart.discountAmount);
          setTax(res.cart.tax);
          setShipping(res.cart.shipping);
          setGrandTotal(res.cart.grandTotal);
          setCoupon(res.cart.coupon);
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      let updated = items
        .map((item) => (item._id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      setItems(updated);
      calculateGuestTotals(updated, coupon);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeFromCart(itemId);
        if (res.success) {
          setItems(res.cart.items);
          setSubtotal(res.cart.subtotal);
          setDiscountAmount(res.cart.discountAmount);
          setTax(res.cart.tax);
          setShipping(res.cart.shipping);
          setGrandTotal(res.cart.grandTotal);
          setCoupon(res.cart.coupon);
          addToast('Item removed from your bag.');
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      const updated = items.filter((item) => item._id !== itemId);
      setItems(updated);
      calculateGuestTotals(updated, coupon);
      addToast('Item removed from your bag.');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        setItems([]);
        setSubtotal(0);
        setDiscountAmount(0);
        setTax(0);
        setShipping(0);
        setGrandTotal(0);
        setCoupon(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      setItems([]);
      calculateGuestTotals([], null);
      localStorage.removeItem('nexkart_guest_cart');
    }
  };

  const applyCoupon = async (code) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.applyCoupon(code);
        if (res.success) {
          setCoupon(res.cart.coupon);
          setSubtotal(res.cart.subtotal);
          setDiscountAmount(res.cart.discountAmount);
          setTax(res.cart.tax);
          setShipping(res.cart.shipping);
          setGrandTotal(res.cart.grandTotal);
          addToast(res.message);
          return { success: true };
        }
      } catch (err) {
        addToast(err.message, 'error');
        return { success: false, message: err.message };
      }
    } else {
      addToast('Please sign in to apply promotional privileges.', 'info');
      return { success: false, message: 'Please sign in' };
    }
  };

  const removeCoupon = async () => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeCoupon();
        if (res.success) {
          setCoupon(null);
          setSubtotal(res.cart.subtotal);
          setDiscountAmount(res.cart.discountAmount);
          setTax(res.cart.tax);
          setShipping(res.cart.shipping);
          setGrandTotal(res.cart.grandTotal);
          addToast('Promo code removed.');
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      calculateGuestTotals(items, null);
    }
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        discountAmount,
        tax,
        shipping,
        grandTotal,
        coupon,
        isCartOpen,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer: () => setIsCartOpen(true),
        closeCartDrawer: () => setIsCartOpen(false),
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
