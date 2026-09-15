import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowRight,
  Shield,
  Sparkles,
  Award,
  ChevronRight,
  Star,
  Quote,
} from 'lucide-react';

export const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
          productAPI.getNewArrivals(),
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
    <div className="space-y-20 pb-16">
      {/* Hero Banner */}
      <section className="relative h-[88vh] min-h-[580px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="NexKart Haute Campaign"
            className="w-full h-full object-cover object-top filter brightness-[0.78]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-950/80 via-black/30 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-400 text-[10px] uppercase tracking-[0.3em] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn / Winter Couture Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] uppercase font-serif text-white max-w-4xl mx-auto leading-tight">
            The New Standard Of Everyday Luxury
          </h1>

          <p className="text-xs sm:text-sm text-gray-200 tracking-[0.2em] uppercase max-w-2xl mx-auto font-light leading-relaxed">
            Impeccable Italian tailoring, featherlight cashmere, and horological masterpieces curated for connoisseurs.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop?category=Men"
              className="w-full sm:w-auto px-8 py-3.5 bg-luxury-950 text-gold-400 border border-gold-500/40 text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-black transition shadow-2xl"
            >
              Explore Men
            </Link>
            <Link
              to="/shop?category=Women"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-luxury-950 text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-gray-100 transition shadow-2xl"
            >
              Discover Women
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            Curated Maisons
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Signature Categories
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-72 rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-white font-serif group-hover:text-gold-400 transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-300 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition duration-300">
                  Discover &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">
              Fresh From The Atelier
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-semibold uppercase tracking-wider text-luxury-900 hover:text-gold-700 inline-flex items-center space-x-1 mt-2 sm:mt-0 transition"
          >
            <span>View All New Releases</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
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
        <div className="relative rounded-xl overflow-hidden bg-luxury-950 text-white grid grid-cols-1 lg:grid-cols-2 shadow-2xl">
          <div className="p-8 sm:p-14 lg:p-20 flex flex-col justify-center space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-400">
              The Winter 2026 Lookbook
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider font-serif leading-tight">
              Quiet Elegance, Uncompromised Quality.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              Crafted in limited runs across heritage ateliers in Biella, Northampton, and Geneva. Each piece reflects decades of mastery, timeless proportion, and discreet luxury.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?category=Men"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gold-600 hover:bg-gold-500 text-luxury-950 text-xs font-semibold uppercase tracking-widest rounded transition"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial model in cashmere"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">
              Most Coveted
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?bestSeller=true"
            className="text-xs font-semibold uppercase tracking-wider text-luxury-900 hover:text-gold-700 inline-flex items-center space-x-1 mt-2 sm:mt-0 transition"
          >
            <span>View All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <section className="bg-luxury-950 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-gold-500/30">
            Exclusive Collector Vault
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-widest font-serif">
            Limited Edition Drops
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto font-light">
            Individually numbered timepieces and hand-embossed leather creations available in finite quantities. Once retired, never reproduced.
          </p>

          {/* Countdown Clock */}
          <div className="flex justify-center items-center space-x-4 pt-2">
            <div className="w-16 sm:w-20 p-3 bg-white/5 border border-white/10 rounded">
              <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Hours</p>
            </div>
            <span className="text-xl font-bold text-gray-500">:</span>
            <div className="w-16 sm:w-20 p-3 bg-white/5 border border-white/10 rounded">
              <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Mins</p>
            </div>
            <span className="text-xl font-bold text-gray-500">:</span>
            <div className="w-16 sm:w-20 p-3 bg-white/5 border border-white/10 rounded">
              <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Secs</p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/shop?category=Haute%20Horlogerie"
              className="inline-block px-8 py-3 bg-gold-600 hover:bg-gold-500 text-luxury-950 text-xs font-semibold uppercase tracking-widest rounded transition"
            >
              Access The Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            Client Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            Distinguished Patrons
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "The Cashmere Overcoat is unmatched in its drape and thermal comfort. The white-glove packaging and handwritten note made unboxing feel like a personal couture fitting."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-luxury-950">Lady Victoria S.</p>
                <p className="text-[10px] text-gray-500">London &bull; Verified Client</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-gold-100 text-gold-800 font-semibold rounded">
                Patron
              </span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "Ordered the Chronos skeleton watch. Horological precision is flawless, keeping within COSC standards. NexKart is revolutionizing high-end luxury shopping in India."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-luxury-950">Vikramaditya R.</p>
                <p className="text-[10px] text-gray-500">Mumbai &bull; Verified Client</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-gold-100 text-gold-800 font-semibold rounded">
                Patron
              </span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "The Vachetta weekender bag has already collected compliments on three transatlantic journeys. Exceptional leather quality that gets better with every trip."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-luxury-950">Marcus Chen</p>
                <p className="text-[10px] text-gray-500">Singapore &bull; Verified Client</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-gold-100 text-gold-800 font-semibold rounded">
                Patron
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
    </div>
  );
};
