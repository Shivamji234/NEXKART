import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { productAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Bell,
  MapPin,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const res = await productAPI.getSuggestions(searchQuery.trim());
        if (res.success) {
          setSuggestions(res.suggestions || []);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSuggestions([]);
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Men', path: '/shop?category=Men' },
    { name: 'Women', path: '/shop?category=Women' },
    { name: 'Footwear', path: '/shop?category=Footwear' },
    { name: 'Accessories', path: '/shop?category=Accessories' },
    { name: 'Kids', path: '/shop?category=Kids' },
    { name: 'New Arrivals', path: '/shop?newArrival=true' },
    { name: 'Privilege Sale', path: '/shop?discountOnly=true', highlight: true },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {/* Top Announcement Bar */}
      <div className="bg-[#171615] text-[#E7D9C3] py-2 px-3 text-center text-[10.5px] sm:text-[11px] tracking-wide uppercase font-medium border-b border-stone-800 overflow-hidden">
        <span className="inline-flex items-center space-x-2 truncate max-w-full justify-center">
          <span className="text-amber-300">✦</span>
          <span>Complimentary Insured Delivery Across India</span>
          <span className="text-stone-600">&bull;</span>
          <span>Support:{' '}
            <a href="mailto:nexkart2.0@gmail.com" className="hover:text-white underline decoration-amber-500/50 underline-offset-2 transition">
              nexkart2.0@gmail.com
            </a>
          </span>
          <span className="hidden md:inline text-stone-600">&bull;</span>
          <span className="hidden md:inline">Concierge:{' '}
            <a href="tel:+917268927163" className="hover:text-white underline decoration-amber-500/50 underline-offset-2 transition">
              +91 72689 27163
            </a>
          </span>
        </span>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/85 py-2.5 sm:py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-[#FAF8F5] border-b border-stone-200/60 py-3.5 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-stone-900 hover:text-amber-800 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#171615] flex items-center justify-center border border-stone-700/60 shadow-xs group-hover:border-amber-600/70 transition">
                <span className="text-[#E7D9C3] font-serif font-bold text-sm sm:text-base">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-2xl font-normal tracking-[0.24em] text-stone-950 uppercase leading-none">
                  NEXKART
                </span>
                <span className="text-[7.5px] sm:text-[8px] tracking-[0.32em] text-stone-500 uppercase font-medium mt-0.5">
                  Atelier &bull; Est. 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11.5px] tracking-[0.16em] uppercase font-medium transition-colors duration-200 relative group py-1 ${
                    link.highlight
                      ? 'text-amber-800 hover:text-amber-900 font-semibold'
                      : 'text-stone-800 hover:text-stone-950'
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle / Input */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1 sm:p-1.5 text-luxury-800 hover:text-luxury-950 transition"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search Popup Dropdown */}
                {searchOpen && (
                  <div className="fixed inset-x-2 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 bg-white border border-gray-200 shadow-2xl p-4 rounded z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Search cashmere, timepieces, boots..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950 tracking-wider"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 text-gray-500 hover:text-luxury-950"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Suggestions list */}
                    {suggestions.length > 0 && (
                      <div className="mt-3 border-t border-gray-100 pt-2 max-h-64 overflow-y-auto divide-y divide-gray-50">
                        {suggestions.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              navigate(`/product/${item._id}`);
                              setSearchOpen(false);
                              setSuggestions([]);
                            }}
                            className="flex items-center space-x-3 py-2 px-1 hover:bg-gray-50 cursor-pointer transition rounded"
                          >
                            <img
                              src={item.images?.[0]?.url}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded bg-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-luxury-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-500">{item.category}</p>
                            </div>
                            <span className="text-xs font-semibold text-luxury-900">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-1.5 text-luxury-800 hover:text-luxury-950 transition relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="p-1.5 text-luxury-800 hover:text-luxury-950 transition relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-950 text-gold-400 border border-gold-500/40 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Account Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 p-1.5 text-luxury-800 hover:text-luxury-950 transition"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-xl rounded py-2 z-50 text-xs">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-luxury-950 truncate">{user?.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                          {isAdmin && (
                            <span className="mt-1 inline-block px-1.5 py-0.5 bg-gold-100 text-gold-700 text-[9px] font-bold rounded">
                              ADMIN ACCESS
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-gold-700 font-semibold hover:bg-gold-50 transition"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Admin Console
                          </Link>
                        )}

                        <Link
                          to="/account/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          Order History
                        </Link>
                        <Link
                          to="/account/addresses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          Saved Addresses
                        </Link>
                        <Link
                          to="/account/notifications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Bell className="w-4 h-4 mr-2 text-gray-400" />
                          Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </Link>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2 space-y-1">
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block text-center py-2 px-4 bg-luxury-950 text-gold-400 font-medium tracking-wider uppercase text-[11px] rounded hover:bg-luxury-800 transition"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block text-center py-2 px-4 border border-gray-300 text-luxury-900 font-medium tracking-wider uppercase text-[11px] rounded hover:bg-gray-50 transition"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FAF9F6] border-r border-gray-200 z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl font-bold tracking-widest text-luxury-950 uppercase"
              >
                NEXKART
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-wider uppercase font-medium py-1.5 ${
                    link.highlight ? 'text-gold-600 font-semibold' : 'text-luxury-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-sm uppercase tracking-wider text-luxury-800"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist ({wishlistCount})
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-sm uppercase tracking-wider text-luxury-800"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-sm uppercase tracking-wider text-luxury-800"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-sm uppercase tracking-wider text-gold-600 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-sm uppercase tracking-wider text-red-600 pt-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 bg-luxury-950 text-gold-400 text-xs uppercase tracking-widest rounded"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 border border-gray-400 text-luxury-950 text-xs uppercase tracking-widest rounded"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Direct Support Contacts */}
              <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Client Support & Helpline</p>
                <div>
                  <a
                    href="mailto:nexkart2.0@gmail.com"
                    className="text-luxury-900 font-medium hover:text-gold-600 block"
                  >
                    ✉️ nexkart2.0@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <a
                    href="tel:+917268927163"
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-luxury-950 rounded font-mono text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <span>📞 Call Helpline</span>
                  </a>
                  <a
                    href="https://wa.me/917268927163?text=Hello%20NexKart%20Support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
