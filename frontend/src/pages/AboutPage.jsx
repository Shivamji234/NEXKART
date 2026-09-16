import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, MapPin, Mail } from 'lucide-react';
import founderImg from '../assets/founder.jpg';

export const AboutPage = () => {
  const [showFounderModal, setShowFounderModal] = useState(false);

  // Close modal on Escape key press and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowFounderModal(false);
    };
    if (showFounderModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showFounderModal]);

  return (
    <div className="space-y-20 pb-16">
      {/* Editorial Header */}
      <section className="relative h-[60vh] min-h-[420px] bg-luxury-950 flex items-center justify-center text-center text-white px-4">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="NexKart Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-400">
            The Maison Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-widest font-serif leading-tight">
            Crafting The Standard Of Everyday Luxury
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 tracking-wider uppercase font-light max-w-2xl mx-auto">
            Simplicity &bull; Architectural Proportion &bull; Unyielding Quality
          </p>
        </div>
      </section>

      {/* Core Brand Manifesto from prompt */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="w-12 h-0.5 bg-gold-500 mx-auto" />
        <blockquote className="font-serif text-xl sm:text-2xl text-luxury-950 leading-relaxed font-normal">
          &ldquo;NexKart is a modern luxury e-commerce platform created to make premium online shopping simpler, faster and more enjoyable. Our goal is to combine elegant design, trusted shopping experiences and smart technology so customers can discover products effortlessly while saving valuable time.&rdquo;
        </blockquote>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
            — The NexKart Founders & Concierge Atelier
          </p>

          {/* Interactive Founder Link / Button */}
          <div className="pt-3 flex flex-col items-center justify-center space-y-2">
            <button
              type="button"
              onClick={() => setShowFounderModal(true)}
              className="group inline-flex items-center space-x-3 px-6 py-2.5 rounded-full border border-stone-800 bg-[#171615] hover:bg-stone-900 text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
              title="Click to view Founder Profile & Vision"
            >
              <span className="text-amber-300/90 font-serif italic text-xs">Atelier Founder</span>
              <span className="text-stone-600">&bull;</span>
              <span className="font-serif tracking-[0.24em] text-white font-normal">
                SHIVAM PANDEY
              </span>
              <span className="text-[9.5px] uppercase tracking-wider text-amber-300 border-b border-amber-400/40 pb-0.5 group-hover:border-amber-300 transition ml-1">
                View Dossier &rarr;
              </span>
            </button>
            <p className="text-[11px] text-stone-500 tracking-wider">
              (Click above to view Founder Profile & Vision)
            </p>
          </div>
        </div>
      </section>

      {/* Numerical Pillars */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-luxury-950">100%</span>
              <p className="text-xs uppercase tracking-wider text-gray-500">Verified Provenance</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-luxury-950">28+</span>
              <p className="text-xs uppercase tracking-wider text-gray-500">Master Ateliers</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-luxury-950">2-4</span>
              <p className="text-xs uppercase tracking-wider text-gray-500">Days White-Glove Transit</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-luxury-950">14k+</span>
              <p className="text-xs uppercase tracking-wider text-gray-500">Satisfied Patrons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-medium">
            Our Commitments
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-widest text-stone-900">
            The NexKart Promise
          </h2>
          <div className="w-10 h-0.5 bg-amber-700/60 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <div className="relative pl-6 border-l-2 border-stone-200 hover:border-amber-700/80 transition-colors space-y-3">
            <span className="font-serif text-3xl font-light text-stone-400/90 italic">01</span>
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-stone-900 font-serif">
              Masterful Materiality
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              We exclusively commission Mongolian double-faced cashmere, French vegetable-tanned boxcalf leather, and Swiss-certified movements crafted to endure across generations.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-stone-200 hover:border-amber-700/80 transition-colors space-y-3">
            <span className="font-serif text-3xl font-light text-stone-400/90 italic">02</span>
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-stone-900 font-serif">
              Certified Provenance
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Every creation undergoes multi-stage cryptographic and physical authentication before receiving its bespoke NexKart seal of verification.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-stone-200 hover:border-amber-700/80 transition-colors space-y-3">
            <span className="font-serif text-3xl font-light text-stone-400/90 italic">03</span>
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-stone-900 font-serif">
              White-Glove Care
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Enjoy tailored delivery scheduling, 14-day doorstep collection for exchanges, and round-the-clock client concierge consultation.
            </p>
          </div>
        </div>

        <div className="pt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition shadow-xl"
          >
            <span>Explore The Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Founder Pop-up Modal */}
      {showFounderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowFounderModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#121212] border border-gold-500/50 rounded-2xl p-6 sm:p-8 text-white shadow-2xl shadow-gold-500/15 overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Gold Glow Background */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-gold-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowFounderModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.3} />
            </button>

            {/* Modal Body */}
            <div className="relative z-10 text-center space-y-5">
              {/* Founder Photo */}
              <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44">
                <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-amber-700/80 via-stone-400 to-amber-600/80 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-[#121212] p-1">
                    <img
                      src={founderImg}
                      alt="Shivam Pandey - Founder of NexKart"
                      className="w-full h-full object-cover rounded-full shadow-inner"
                      onError={(e) => {
                        e.currentTarget.src = '/shivam-pandey.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Founder Name & Designation */}
              <div className="space-y-1.5 pt-1">
                <div className="inline-flex items-center px-3.5 py-1 bg-stone-900/90 border border-stone-700 rounded-full text-[9px] uppercase font-medium tracking-[0.28em] text-amber-200">
                  <span>Founder &bull; Atelier Director</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] text-[#FAF8F5] pt-2 uppercase">
                  SHIVAM PANDEY
                </h2>
                <p className="text-xs text-amber-300/90 font-light tracking-widest uppercase">
                  Founder & CEO &bull; NexKart
                </p>
                <p className="text-xs text-stone-400 flex items-center justify-center space-x-1.5 pt-0.5 font-light">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.3} />
                  <span>Varanasi, Uttar Pradesh, India</span>
                </p>
              </div>

              {/* Founder Note / Vision */}
              <div className="p-4 bg-white/5 rounded-xs border border-white/10 text-left space-y-2">
                <p className="text-xs text-stone-300 leading-relaxed font-serif italic">
                  &ldquo;NexKart was envisioned to combine timeless luxury with modern simplicity. Every collection, every artisan partnership, and every order is treated with personal dedication and perfection.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-stone-400">
                  <span className="font-serif tracking-widest text-amber-300">— Shivam Pandey</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Founder, NexKart</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href="mailto:nexkart2.0@gmail.com?subject=Inquiry%20for%20Shivam%20Pandey%20-%20NexKart%20Founder"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#FAF8F5] hover:bg-white text-stone-950 text-xs font-medium uppercase tracking-[0.16em] rounded-xs transition shadow-md"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-800" strokeWidth={1.3} />
                  <span>Contact Founder Office</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowFounderModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium uppercase tracking-[0.16em] rounded-xs border border-white/15 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
