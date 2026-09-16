import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowRight,
  ChevronRight,
  Star,
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
    <div className="space-y-16 sm:space-y-20 pb-16 w-full overflow-hidden">
      {/* Hero Banner */}
      <section className="relative h-[82vh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="NexKart Haute Campaign"
            className="w-full h-full object-cover object-top filter brightness-[0.74]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/85 via-black/35 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#EBD9BE] text-[10px] tracking-[0.22em] uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Autumn / Winter 2026 &bull; Atelier Edit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-normal text-white max-w-4xl mx-auto leading-[1.08] tracking-tight">
            The Art of <span className="italic font-serif text-[#F0DECB]">Everyday Luxury</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 tracking-wide max-w-xl mx-auto font-light leading-relaxed">
            Hand-finished cashmere, Italian cordwainery, and certified horology — meticulously curated for those who value quiet craftsmanship over loud logos.
          </p>

          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/shop?category=Men"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#171615] text-[#FAF8F5] border border-stone-600/70 text-xs font-medium uppercase tracking-[0.18em] rounded-full hover:bg-black transition shadow-2xl hover:scale-105"
            >
              Explore Men's Edit &rarr;
            </Link>
            <Link
              to="/shop?category=Women"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-stone-950 text-xs font-medium uppercase tracking-[0.18em] rounded-full hover:bg-stone-100 transition shadow-2xl hover:scale-105"
            >
              Discover Women &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Human Concierge & Atelier Trust Strip */}
      <section className="border-y border-stone-200/80 bg-white/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">Artisan Provenance</span>
              <p className="text-[11px] text-stone-500 font-light">Small batch craftsmanship from certified master ateliers</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">White-Glove Delivery</span>
              <p className="text-[11px] text-stone-500 font-light">100% complimentary insured express transit pan-India</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">14-Day Doorstep Returns</span>
              <p className="text-[11px] text-stone-500 font-light">Complimentary return pickup directly from your residence</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">Personal Concierge</span>
              <p className="text-[11px] text-stone-500 font-light">Direct styling & sizing guidance via phone & WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-800">
            Curated Wardrobe
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900">
            Signature Collections
          </h2>
          <div className="w-10 h-0.5 bg-amber-700/60 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-52 sm:h-72 rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-center">
                <h3 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white font-serif group-hover:text-gold-400 transition">
                  {cat.name}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-gray-300 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition duration-300">
                  Discover &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-stone-200/80 pb-4">
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
            The Private Vault
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#FAF8F5]">
            Limited Studio Releases
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-light leading-relaxed">
            Individually numbered timepieces and hand-embossed leather creations commissioned in finite quantities. Once an edition is retired, it is never reissued.
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
              to="/shop?category=Haute%20Horlogerie"
              className="inline-block px-8 py-3.5 bg-[#EAE4DC] hover:bg-white text-stone-950 text-xs font-medium uppercase tracking-[0.18em] rounded-full transition shadow-lg hover:scale-105"
            >
              Access Limited Editions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-800">
            Patron Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900">
            Words from Our Patrons
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
              <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                "The Cashmere Overcoat has an exquisite drape and natural warmth. The packaging felt like a bespoke salon delivery — complete with a handwritten care note."
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Ananya Sharma</p>
                <p className="text-[10px] text-stone-500">New Delhi &bull; Verified Patron</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-stone-100 text-stone-700 font-medium rounded-full">
                Verified
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
              <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                "Ordered the Chronos skeleton timepiece. The horological finish is stunning and the movement runs with Swiss-grade precision. NexKart is setting a genuine benchmark."
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Vikramaditya Rathore</p>
                <p className="text-[10px] text-stone-500">Varanasi &bull; Verified Patron</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-stone-100 text-stone-700 font-medium rounded-full">
                Verified
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
              <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                "The Vachetta weekender bag has already collected compliments across three flights. The leather develops a rich, personal patina with every journey."
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">Rajesh Singhania</p>
                <p className="text-[10px] text-stone-500">Bengaluru &bull; Verified Patron</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-stone-100 text-stone-700 font-medium rounded-full">
                Verified
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
