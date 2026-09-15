import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexkart_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      if (res.requiresVerification || res.requiresOtp) {
        return res; // Prompt to verify OTP
      }
      localStorage.setItem('nexkart_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    return await authAPI.register(userData);
  };

  const verifyOtp = async (email, otp, purpose = 'verification') => {
    const res = await authAPI.verifyOtp({ email, otp, purpose });
    if (res.success && res.token) {
      localStorage.setItem('nexkart_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const resendOtp = async (email, purpose) => {
    return await authAPI.resendOtp({ email, purpose });
  };

  const logout = () => {
    localStorage.removeItem('nexkart_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...res.user }));
    }
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
