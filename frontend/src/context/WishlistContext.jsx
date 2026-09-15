import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotifications();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      const local = localStorage.getItem('nexkart_guest_wishlist');
      if (local) {
        try {
          setWishlist(JSON.parse(local));
        } catch (e) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.success) {
        setWishlist(res.wishlist || []);
      }
    } catch (err) {
      console.warn('Wishlist fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await wishlistAPI.toggleWishlist(productId);
        if (res.success) {
          setWishlist(res.wishlist);
          addToast(res.message);
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      // Guest wishlist
      const exists = wishlist.some((item) => (item._id || item) === productId);
      let updated;
      if (exists) {
        updated = wishlist.filter((item) => (item._id || item) !== productId);
        addToast('Removed from wishlist');
      } else {
        updated = [...wishlist, product];
        addToast('Added to wishlist');
      }
      setWishlist(updated);
      localStorage.setItem('nexkart_guest_wishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
