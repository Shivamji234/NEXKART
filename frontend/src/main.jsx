import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('App Error caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FAF8F5', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>NEXKART MAISON</h1>
          <p style={{ color: '#D4AF37', fontSize: '14px', marginBottom: '24px' }}>A client session refresh is recommended.</p>
          <button onClick={() => { window.location.href = '/'; }} style={{ padding: '10px 24px', background: '#D4AF37', color: '#0A0A0A', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Reload NEXKART
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
