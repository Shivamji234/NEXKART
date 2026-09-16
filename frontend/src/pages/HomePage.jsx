import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { SellConsignModal } from '../components/SellConsignModal';
import { useNotifications } from '../context/NotificationContext';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowRight,
  ChevronRight,
  Star,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';

export const HomePage = () => {
  const { addToast } = useNotifications();
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [curationFilter, setCurationFilter] = useState('All');
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    addToast(`✦ Privilege code ${code} copied! Enjoy 10% off at checkout.`, 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Limited Edition Drop Countdown timer (simulated 48 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 54, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [arrivalsRes, bestRes, catsRes] = await Promise.all([
          productAPI.getProducts({ limit: 40, sort: 'newest' }),
          productAPI.getBestSellers(),
          productAPI.getCategories(),
        ]);

        if (arrivalsRes.success) setNewArrivals(arrivalsRes.products || []);
        if (bestRes.success) setBestSellers(bestRes.products || []);
        if (catsRes.success) setCategories(catsRes.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 w-full overflow-hidden">
      {/* Hero Banner - Luxepolis-Style Certified Luxury */}
      <section className="relative h-[85vh] min-h-[520px] sm:min-h-[620px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=85"
            alt="NexKart Certified Luxury"
            className="w-full h-full object-cover object-center filter brightness-[0.68]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-black/40 to-black/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-amber-500/30 text-[#EBD9BE] text-[10px] tracking-[0.24em] uppercase font-medium">
            <span className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current mr-1" />
              <span>4.9 / 5 Authenticity Rating</span>
            </span>
            <span className="text-stone-500">&bull;</span>
            <span>Certified Luxury Destination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-white max-w-3xl mx-auto leading-[1.12] tracking-tight">
            The Gold Standard of <span className="italic font-serif text-[#F0DECB]">Certified Luxury</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 tracking-wide max-w-2xl mx-auto font-light leading-relaxed">
            India's most trusted atelier for certified authentic timepieces, designer handbags, and fine Italian leather goods. Hand-inspected with 2-Year Movement Warranty & Buy-Back Assurance.
          </p>

          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              to="/shop?keyword=watch"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FAF8F5] text-stone-950 text-xs font-semibold uppercase tracking-[0.18em] rounded-full hover:bg-white transition shadow-2xl hover:scale-105"
            >
              Explore Timepieces &rarr;
            </Link>
            <Link
              to="/shop?category=Accessories"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#171615] text-[#FAF8F5] border border-stone-600/80 text-xs font-semibold uppercase tracking-[0.18em] rounded-full hover:bg-black transition shadow-2xl hover:scale-105"
            >
              Luxury Handbags &rarr;
            </Link>
            <button
              onClick={() => setSellModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold uppercase tracking-[0.18em] rounded-full transition shadow-xl hover:scale-105 cursor-pointer"
            >
              Sell / Consign Luxury ✦
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Privilege Invitation Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-[#171615] text-[#FAF8F5] border border-amber-500/30 rounded-xs p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="hidden sm:flex w-9 h-9 rounded-full bg-[#24211E] border border-amber-500/30 items-center justify-center text-amber-300 font-serif text-sm">
              ✦
            </div>
            <div>
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <span className="text-[10px] uppercase tracking-[0.24em] text-amber-300 font-medium">Patron Privilege</span>
                <span className="text-stone-600">&bull;</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest">Limited Release</span>
              </div>
              <p className="text-xs sm:text-sm font-light text-stone-200 mt-0.5">
                Enjoy <strong className="text-[#FAF8F5] font-medium">10% Off</strong> on your selection with code{' '}
                <span className="font-mono text-amber-300 font-medium tracking-wider bg-[#22201D] px-1.5 py-0.5 rounded-xs border border-amber-500/20">ATELIER10</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopyCode('ATELIER10')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#22201D] hover:bg-[#2C2925] text-amber-200 border border-amber-500/40 hover:border-amber-400 rounded-full text-[10.5px] uppercase tracking-[0.16em] font-medium transition duration-200 active:scale-95 group shadow-sm flex-shrink-0 cursor-pointer"
          >
            <span>{copiedCode ? '✦ Copied to Clipboard!' : 'Copy Code ATELIER10'}</span>
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-6 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Luxepolis-Style Top Category Tiles with Direct WhatsApp Consultation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="text-center space-y-2 mb-8 sm:mb-10">
          <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-amber-800">
            Certified Curations
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 uppercase tracking-wider">
            Shop Top Categories
          </h2>
          <p className="text-xs text-stone-500 font-light max-w-md mx-auto">
            100% verified authentic creations backed by multi-point physical appraisal
          </p>
          <div className="w-12 h-0.5 bg-amber-700/50 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Watches */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?keyword=watch" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                alt="Pre-Owned & Fine Watches"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Rolex &bull; Cartier &bull; Omega
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Pre-Owned & Fine Watches
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  Certified chronographs with 2-year movement warranty, physical appraisal, & original papers.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?keyword=watch" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Watches &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20would%20like%20to%20discuss%20buying%20or%20selling%20luxury%20watches."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tile 2: Fine Jewelry & Gold */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?subcategory=Jewelry" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
                alt="Fine Jewelry & Gold"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Cartier &bull; Bvlgari &bull; 18K Gold
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Fine Jewelry & Gold
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  18K hallmarked bangles, pavé diamond rings, and precious gemstone creations.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?subcategory=Jewelry" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Jewelry &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20am%20interested%20in%20certified%20fine%20jewelry%20and%20gold%20pieces."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tile 3: Glasses & Eyewear */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?subcategory=Glasses" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Eyewear & Sunglasses"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Prada &bull; Tom Ford &bull; Polarized
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Luxury Eyewear & Glasses
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  Beta-titanium aviators, handcrafted Italian acetate frames, & polarized Carl Zeiss optics.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?subcategory=Glasses" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Eyewear &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20designer%20eyewear%20and%20sunglasses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tile 4: Men's Grooming & Cologne */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?subcategory=Grooming" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
                alt="Men's Grooming & Fragrance"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Tom Ford &bull; Creed &bull; Niche Oud
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Men's Grooming & Fragrance
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  Handcrafted aftershave balms, rare oud wood oils, & artisanal Millésime scents.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?subcategory=Grooming" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Grooming &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20am%20inquiring%20about%20luxury%20grooming%20and%20fragrances."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tile 5: Beauty & Makeup */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?subcategory=Beauty%20%26%20Makeup" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Beauty & Haute Skincare"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Dior &bull; Chanel &bull; Haute Skincare
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Beauty & Haute Skincare
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  Regenerating Rose de Granville elixirs, couture lip pairings, & revitalizing crèmes.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?subcategory=Beauty%20%26%20Makeup" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Beauty &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20would%20like%20details%20on%20luxury%20beauty%20and%20skincare."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tile 6: Handbags & Leather */}
          <div className="group bg-white rounded-xs border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link to="/shop?category=Accessories" className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
                alt="Haute Handbags & Leather"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-amber-300 text-[9px] uppercase tracking-widest font-medium rounded-xs backdrop-blur-xs">
                Louis Vuitton &bull; Chanel &bull; Gucci
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
              <div>
                <h3 className="font-serif text-base uppercase tracking-wider text-stone-900 group-hover:text-amber-900 transition">
                  Luxury Handbags & Leather
                </h3>
                <p className="text-[11px] text-stone-500 font-light mt-1">
                  Full-grain Tuscan weekender bags, totes, and cross-body silhouettes.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Link to="/shop?category=Accessories" className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800">
                  Explore Handbags &rarr;
                </Link>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Concierge%2C%20I%20am%20interested%20in%20luxury%20handbags%20and%20leather%20goods."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxepolis Signature Trust Architecture: Shop With Confidence */}
      <section className="bg-white border-y border-stone-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-medium">
              The NexKart Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 uppercase tracking-widest">
              Shop With Confidence
            </h2>
            <p className="text-xs text-stone-500 font-light max-w-lg mx-auto">
              India's premier certified luxury marketplace — 100% peace of mind on every order.
            </p>
            <div className="w-10 h-0.5 bg-amber-700/60 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-900">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                100% Certified Authenticity
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Every timepiece, bag, and garment is physically certified and appraised by master horologists before dispatch.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-900">
                <Award className="w-6 h-6" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                Pristine Condition Guaranteed
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Vetted against strict luxury standards, complete with original box, documentation, and atelier certificates.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-900">
                <Truck className="w-6 h-6" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                Insured Pan-India Express
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                100% complimentary doorstep delivery with real-time transit insurance and tamper-evident security packaging.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-900">
                <RotateCcw className="w-6 h-6" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 font-medium">
                14-Day Returns & Buy-Back
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Complimentary doorstep pickup for exchanges, plus guaranteed buyback privileges on certified timepieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Coveted Luxury Houses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-8">
          <span className="text-[10px] uppercase tracking-[0.28em] text-stone-500 font-medium">
            Premier Maisons & Horology
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 uppercase tracking-widest">
            Most Coveted Houses
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Rolex', tag: 'Certified Horology', query: 'watch' },
            { name: 'Cartier', tag: 'Timepieces & Jewelry', query: 'watch' },
            { name: 'Louis Vuitton', tag: 'Leather & Travel', query: 'bag' },
            { name: 'Chanel', tag: 'Haute Couture', query: 'coat' },
            { name: 'Bottega Veneta', tag: 'Intrecciato Leather', query: 'bag' },
            { name: 'Gucci', tag: 'Italian Luxury', query: 'shirt' },
          ].map((house) => (
            <Link
              key={house.name}
              to={`/shop?keyword=${encodeURIComponent(house.query)}`}
              className="p-5 bg-white border border-stone-200 hover:border-amber-600/60 rounded-xs text-center transition-all duration-300 hover:shadow-md group flex flex-col items-center justify-center space-y-1"
            >
              <span className="font-serif text-base sm:text-lg font-normal tracking-[0.18em] text-stone-950 group-hover:text-amber-900 uppercase transition">
                {house.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 font-light">
                {house.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Luxepolis Signature Feature: Sell & Consign With Us Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs overflow-hidden bg-[#171615] text-white border border-stone-800 grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full w-fit text-amber-300 text-[10px] tracking-[0.24em] uppercase font-medium">
              <span>✦ Seller Privilege &bull; Consign With Us</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#FAF8F5] leading-tight">
              Sell More, Earn More. <br />
              <span className="italic text-amber-200/90 font-serif">Consign Your Luxury With Us.</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
              Own an authentic pre-loved Rolex, Omega, Cartier, or designer Louis Vuitton bag? Our Varanasi atelier offers instant professional appraisals, zero hidden fees, and doorstep insured collection across India.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setSellModalOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-xs transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Request Instant Appraisal &rarr;</span>
              </button>
              <a
                href="https://wa.me/917268927163?text=Hello%20NexKart%2C%20I%20would%20like%20to%20consign%20or%20sell%20a%20luxury%20item."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white border border-white/20 text-xs font-semibold uppercase tracking-[0.18em] rounded-xs transition text-center flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chat with Appraiser</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-stone-900">
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80"
              alt="Luxury horology appraisal"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Section with Interactive Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-800">
              Direct from the Atelier
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 mt-1">
              Fresh Seasonal Arrivals
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-medium uppercase tracking-[0.15em] text-stone-800 hover:text-amber-800 inline-flex items-center space-x-1 mt-2 sm:mt-0 transition"
          >
            <span>View Full Selection</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.3} />
          </Link>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'All', label: 'All Curations' },
            { id: 'Watches', label: 'Watches' },
            { id: 'Jewelry', label: 'Jewelry' },
            { id: 'Glasses', label: 'Glasses & Eyewear' },
            { id: 'Grooming', label: 'Grooming & Fragrance' },
            { id: 'Beauty', label: 'Beauty & Makeup' },
            { id: 'Men', label: "Men's Edit" },
            { id: 'Women', label: "Women's Edit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurationFilter(tab.id)}
              className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                curationFilter === tab.id
                  ? 'bg-[#171615] text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-stone-200/70 rounded-xs" />
                <div className="h-4 bg-stone-200/70 rounded-xs w-3/4" />
                <div className="h-4 bg-stone-200/70 rounded-xs w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {(curationFilter === 'All'
              ? newArrivals
              : newArrivals.filter((p) => {
                  const cat = (p.category || '').toLowerCase();
                  const sub = (p.subcategory || '').toLowerCase();
                  const name = (p.name || '').toLowerCase();
                  const tags = (p.tags || []).join(' ').toLowerCase();
                  const filt = curationFilter.toLowerCase();
                  if (filt === 'watches') return cat.includes('watch') || cat.includes('horlogerie') || name.includes('chronograph') || name.includes('watch') || tags.includes('watch');
                  if (filt === 'jewelry') return sub.includes('jewelry') || name.includes('bangle') || name.includes('ring') || name.includes('bracelet') || tags.includes('jewelry');
                  if (filt === 'glasses') return sub.includes('glasses') || name.includes('sunglasses') || name.includes('glasses') || name.includes('aviator') || tags.includes('eyewear');
                  if (filt === 'grooming') return sub.includes('grooming') || name.includes('shave') || name.includes('beard') || name.includes('aventus') || name.includes('oud') || tags.includes('grooming');
                  if (filt === 'beauty') return sub.includes('beauty') || name.includes('dior') || name.includes('chanel') || name.includes('crème') || name.includes('lip') || tags.includes('beauty');
                  return cat === filt;
                })
            ).slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Lookbook Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs overflow-hidden bg-[#171615] text-white grid grid-cols-1 lg:grid-cols-2 shadow-xl border border-stone-800">
          <div className="p-8 sm:p-14 lg:p-18 flex flex-col justify-center space-y-4 sm:space-y-6">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-amber-300">
              The Winter 2026 Lookbook
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal leading-tight text-[#FAF8F5]">
              Quiet Confidence, Handcrafted Precision.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Commissioned in finite, numbered batches across master workshops. Every creation honors decades of tailoring heritage, bespoke proportions, and authentic provenance.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#EAE4DC] hover:bg-white text-stone-950 text-xs font-medium uppercase tracking-[0.18em] rounded-full transition shadow-md"
              >
                <span>Explore The Lookbook</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.3} />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full bg-stone-900">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial model in cashmere"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-800">
              Client Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 mt-1">
              Most Desired Pieces
            </h2>
          </div>
          <Link
            to="/shop?bestSeller=true"
            className="text-xs font-medium uppercase tracking-[0.15em] text-stone-800 hover:text-amber-800 inline-flex items-center space-x-1 mt-2 sm:mt-0 transition"
          >
            <span>View All Favorites</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.3} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Limited Edition Drop Banner with Countdown */}
      <section className="bg-[#171615] text-white py-14 sm:py-18 border-y border-stone-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 sm:space-y-6">
          <span className="px-3.5 py-1 bg-amber-400/10 text-amber-300 text-[10px] font-medium uppercase tracking-[0.25em] rounded-full border border-amber-400/20">
            Collector's Vault
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#FAF8F5]">
            Limited Edition Drops
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-light leading-relaxed">
            Individually numbered timepieces and handcrafted leather pieces produced in small, finite runs. Once an edition sells out, it is permanently retired.
          </p>

          {/* Countdown Clock in refined ivory & brass */}
          <div className="flex justify-center items-center space-x-3 sm:space-x-5 pt-2">
            <div className="w-16 sm:w-20 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xs">
              <span className="text-xl sm:text-2xl font-mono font-medium text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <p className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">Hours</p>
            </div>
            <span className="text-lg font-light text-stone-500">:</span>
            <div className="w-16 sm:w-20 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xs">
              <span className="text-xl sm:text-2xl font-mono font-medium text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <p className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">Mins</p>
            </div>
            <span className="text-lg font-light text-stone-500">:</span>
            <div className="w-16 sm:w-20 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xs">
              <span className="text-xl sm:text-2xl font-mono font-medium text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <p className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">Secs</p>
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <Link
              to="/shop?discountOnly=true"
              className="inline-block px-8 py-3.5 bg-[#EAE4DC] hover:bg-white text-stone-950 text-xs font-medium uppercase tracking-[0.18em] rounded-full transition shadow-lg hover:scale-105"
            >
              Explore Limited Drops &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials - Authentic Indian Luxury Patrons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-800">
            Real Customer Experiences &bull; भारत भर से रिव्यूज
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900">
            What Our Customers Say
          </h2>
          <div className="w-10 h-0.5 bg-amber-700/60 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-7 sm:p-8 rounded-xs border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex text-amber-500 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={1.2} />
                ))}
              </div>
              <p className="text-xs text-stone-700 font-normal leading-relaxed">
                "Main pehle online high-end luxury kharidne me thodi hesitant thi, par Cashmere overcoat aur silk shirt ki fabric quality dekh kar dil khush ho gaya! Delhi me complimentary insured delivery sirf 2 din me deliver ho gayi. Packaging ekdum royal thi jaise kisi luxury flagship boutique se aayi ho. 100% recommended!"
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Ananya Sharma</p>
                <p className="text-[10px] text-stone-500">South Extension, New Delhi &bull; Verified Patron</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium rounded-full">
                ✓ Verified
              </span>
            </div>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-xs border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex text-amber-500 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={1.2} />
                ))}
              </div>
              <p className="text-xs text-stone-700 font-normal leading-relaxed">
                "Banaras atelier se skeleton automatic watch order ki thi aur same-day dispatch ho gaya! Dial aur movement ka weight bilkul solid hai. Authorized service center me inspect karwaya toh 100% genuine movement nikla. Luxury wooden box, certificate aur serial number matching tha — sach me kamaal ka experience!"
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Vikramaditya Rathore</p>
                <p className="text-[10px] text-stone-500">Sigra, Varanasi &bull; Verified Collector</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium rounded-full">
                ✓ Verified
              </span>
            </div>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-xs border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex text-amber-500 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={1.2} />
                ))}
              </div>
              <p className="text-xs text-stone-700 font-normal leading-relaxed">
                "Tuscan full-grain leather weekender bag mangwaya tha. Original leather ki rich fragrance aur heavy brass zips lajawab hain, bilkul international standard. Frequent business travel ke liye cabin storage me perfect fit hota hai. Doorstep free delivery aur authenticity guarantee ke sath aaya — full paisa vasool!"
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Rajesh Singhania</p>
                <p className="text-[10px] text-stone-500">Indiranagar, Bengaluru &bull; Verified Buyer</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium rounded-full">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Consignment & Private Sell Appraisal Modal */}
      <SellConsignModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />
    </div>
  );
};
