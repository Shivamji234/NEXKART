import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { productAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import nexkartLogoRich from '../assets/nexkart-logo-rich.png';
import { SellConsignModal } from './SellConsignModal';
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
  Phone,
  Mail,
  MessageSquare,
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
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Rotating Luxury Announcements
  const announcements = [
    {
      text: "Complimentary Insured Express Delivery Across India",
      tag: "✦ Free Express Shipping",
      link: "/policy/shipping",
    },
    {
      text: "VIP Concierge & Atelier Desk",
      tag: "+91 72689 27163",
      href: "https://wa.me/917268927163?text=Hello%20NexKart%20Concierge",
    },
    {
      text: "100% Certified Authentic Craftsmanship & Movements",
      tag: "✦ Verified Provenance",
      link: "/about",
    },
    {
      text: "Hassle-Free 14-Day Doorstep Returns & Exchanges",
      tag: "✦ Client Privilege",
      link: "/policy/returns",
    },
  ];
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

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
    { name: 'Watches', path: '/shop?keyword=watch' },
    { name: 'Jewelry', path: '/shop?subcategory=Jewelry' },
    { name: 'Glasses', path: '/shop?subcategory=Glasses' },
    { name: 'Grooming & Beauty', path: '/shop?subcategory=Grooming' },
    { name: 'Men', path: '/shop?category=Men' },
    { name: 'Women', path: '/shop?category=Women' },
    { name: 'Handbags', path: '/shop?category=Accessories' },
    { name: 'Vault Sale', path: '/shop?discountOnly=true', highlight: true },
  ];

  return (
    <>
      {/* Interactive Top Announcement Bar */}
      <div className="bg-[#171615] text-[#E7D9C3] py-2 px-3 text-center text-[10px] sm:text-[11px] tracking-wide uppercase font-medium border-b border-stone-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[20px]">
          <div className="transition-all duration-500 transform inline-flex items-center space-x-2 truncate">
            <span className="text-amber-400 font-serif">✦</span>
            {announcements[activeAnnouncement].link ? (
              <Link 
                to={announcements[activeAnnouncement].link}
                className="hover:text-white transition inline-flex items-center space-x-1.5"
              >
                <span className="text-stone-300 font-normal">{announcements[activeAnnouncement].text}</span>
                <span className="text-amber-300 underline underline-offset-2 decoration-amber-500/40 font-medium">
                  {announcements[activeAnnouncement].tag}
                </span>
              </Link>
            ) : (
              <a 
                href={announcements[activeAnnouncement].href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center space-x-1.5"
              >
                <span className="text-stone-300 font-normal">{announcements[activeAnnouncement].text}</span>
                <span className="text-amber-300 underline underline-offset-2 decoration-amber-500/40 font-medium">
                  {announcements[activeAnnouncement].tag}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/85 py-2 sm:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-[#FAF8F5] border-b border-stone-200/60 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-stone-800 hover:text-stone-950 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.3} />
            </button>

            {/* Official NX Luxury Brand Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0 py-0.5" aria-label="NEXKART Home">
              <img 
                src={nexkartLogoRich} 
                alt="NEXKART Luxury Atelier" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]" 
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
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

              {/* Luxepolis-Style Sell / Consign Button */}
              <button
                onClick={() => setSellModalOpen(true)}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-600/40 text-[10px] uppercase tracking-[0.16em] font-semibold rounded-xs transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Sell With Us</span>
                <span className="text-amber-600 text-[9px]">✦</span>
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle / Input */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1 sm:p-1.5 text-stone-800 hover:text-stone-950 transition"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={1.3} />
                </button>

                {/* Search Popup Dropdown */}
                {searchOpen && (
                  <div className="fixed inset-x-2 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 bg-white border border-stone-200 shadow-2xl p-4 rounded-xs z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Search cashmere, timepieces, boots..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full pl-3 pr-10 py-2 border border-stone-300 text-xs rounded-xs focus:outline-none focus:border-stone-900 tracking-wider"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 text-stone-500 hover:text-stone-900"
                      >
                        <Search className="w-4 h-4" strokeWidth={1.3} />
                      </button>
                    </form>

                    {/* Suggestions list */}
                    {suggestions.length > 0 && (
                      <div className="mt-3 border-t border-stone-100 pt-2 max-h-64 overflow-y-auto divide-y divide-stone-50">
                        {suggestions.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              navigate(`/product/${item._id}`);
                              setSearchOpen(false);
                              setSuggestions([]);
                            }}
                            className="flex items-center space-x-3 py-2 px-1 hover:bg-stone-50 cursor-pointer transition rounded-xs"
                          >
                            <img
                              src={item.images?.[0]?.url}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-xs bg-stone-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-stone-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-stone-500">{item.category}</p>
                            </div>
                            <span className="text-xs font-semibold text-stone-900">
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
                className="p-1.5 text-stone-800 hover:text-stone-950 transition relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.3} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-stone-900 text-stone-100 text-[8.5px] font-medium w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="p-1.5 text-stone-800 hover:text-stone-950 transition relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.3} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-stone-950 text-amber-200 text-[8.5px] font-medium w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Account Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1 p-1.5 text-stone-800 hover:text-stone-950 transition"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" strokeWidth={1.3} />
                  <ChevronDown className="w-3 h-3 text-stone-400" strokeWidth={1.3} />
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
            <div className="flex items-center justify-between pb-5 border-b border-stone-200">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center group py-0.5"
                aria-label="NEXKART Home"
              >
                <img 
                  src={nexkartLogoRich} 
                  alt="NEXKART Luxury Atelier" 
                  className="h-10 w-auto object-contain" 
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-950"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.3} />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs tracking-[0.18em] uppercase font-medium py-1.5 ${
                    link.highlight ? 'text-amber-800 font-semibold' : 'text-stone-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Sell / Consign Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSellModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-600/40 text-[11px] uppercase tracking-[0.16em] font-semibold rounded-xs text-center flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Sell & Consign Luxury</span>
                <span className="text-amber-700">✦</span>
              </button>

              <div className="border-t border-stone-200 pt-4 space-y-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-xs uppercase tracking-[0.16em] text-stone-800"
                >
                  <Heart className="w-4 h-4 mr-2" strokeWidth={1.3} />
                  Wishlist ({wishlistCount})
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-xs uppercase tracking-[0.16em] text-stone-800"
                    >
                      <User className="w-4 h-4 mr-2" strokeWidth={1.3} />
                      Account Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-xs uppercase tracking-[0.16em] text-stone-800"
                    >
                      <Package className="w-4 h-4 mr-2" strokeWidth={1.3} />
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-xs uppercase tracking-[0.16em] text-amber-800 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" strokeWidth={1.3} />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-xs uppercase tracking-[0.16em] text-red-600 pt-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" strokeWidth={1.3} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2.5 bg-stone-950 text-stone-100 text-[11px] uppercase tracking-widest rounded-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2.5 border border-stone-300 text-stone-900 text-[11px] uppercase tracking-widest rounded-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Direct Support Contacts */}
              <div className="border-t border-stone-200 pt-4 text-xs text-stone-600 space-y-2.5">
                <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-[0.18em]">Client Support & Concierge</p>
                <div>
                  <a
                    href="mailto:concierge@nexkart.com"
                    className="text-stone-900 font-medium hover:text-amber-800 flex items-center space-x-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.3} />
                    <span>concierge@nexkart.com</span>
                  </a>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <a
                    href="tel:+917268927163"
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xs font-mono text-[11px] font-medium flex items-center space-x-1.5 transition"
                  >
                    <Phone className="w-3 h-3 text-stone-700" strokeWidth={1.3} />
                    <span>Call Helpline</span>
                  </a>
                  <a
                    href="https://wa.me/917268927163?text=Hello%20NexKart%20Support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xs text-[11px] font-medium flex items-center space-x-1.5 transition"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" strokeWidth={1.3} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Consignment & Private Sell Appraisal Modal */}
      <SellConsignModal isOpen={sellModalOpen} onClose={() => setSellModalOpen(false)} />
    </>
  );
};
