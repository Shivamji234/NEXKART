import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Award, Clock, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
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
        <p className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
          — The NexKart Founders & Concierge Atelier
        </p>
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
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Our Commitments
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
            The NexKart Promise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded border border-gray-200 shadow-sm space-y-3">
            <Sparkles className="w-6 h-6 text-gold-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950 font-serif">
              Masterful Materiality
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              We exclusively commission Mongolian double-faced cashmere, French vegetable-tanned boxcalf leather, and Swiss-certified movements crafted to endure across generations.
            </p>
          </div>

          <div className="bg-white p-8 rounded border border-gray-200 shadow-sm space-y-3">
            <ShieldCheck className="w-6 h-6 text-gold-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950 font-serif">
              Certified Provenance
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Every creation undergoes multi-stage cryptographic and physical authentication before receiving its bespoke NexKart seal of verification.
            </p>
          </div>

          <div className="bg-white p-8 rounded border border-gray-200 shadow-sm space-y-3">
            <Clock className="w-6 h-6 text-gold-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950 font-serif">
              White-Glove Care
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
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
    </div>
  );
};
