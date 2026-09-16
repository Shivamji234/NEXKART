import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Mail, Package, X, ChevronUp, MapPin } from 'lucide-react';
import nexkartMonogram from '../assets/nexkart-monogram.png';

export const VIPConciergeWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={widgetRef} className="fixed bottom-5 right-5 z-40">
      {/* Expanded Luxury Concierge Card */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[350px] bg-[#141312] text-[#FAF8F5] border border-stone-800 shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-xs p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-800/80 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1F1D1B] border border-amber-500/30 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                <img src={nexkartMonogram} alt="NX Crest" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-base tracking-wide text-[#FAF8F5] font-normal leading-tight">
                  VIP Concierge Desk
                </h3>
                <p className="text-[9.5px] uppercase tracking-[0.2em] text-amber-300/80 font-medium">
                  Atelier Liaison &bull; Varanasi
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 transition"
              aria-label="Close concierge"
            >
              <X className="w-4 h-4" strokeWidth={1.4} />
            </button>
          </div>

          {/* Live Studio Status Indicator */}
          <div className="bg-[#1C1A18] border border-stone-800/70 p-2.5 rounded-xs flex items-center justify-between text-[10.5px]">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-stone-200 font-medium">Desk Open (10:00 AM – 7:30 PM)</span>
            </div>
            <span className="text-stone-400 text-[10px] flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-amber-400/80" /> Mohansarai
            </span>
          </div>

          {/* Quick Direct Actions */}
          <div className="space-y-2 text-xs">
            {/* Direct WhatsApp Concierge */}
            <a
              href="https://wa.me/917268927163?text=Hello%20NexKart%20VIP%20Concierge%2C%20I%20would%20like%20assistance%20with%20a%20luxury%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2.5 bg-[#1F1D1B] hover:bg-[#272421] border border-amber-500/20 hover:border-amber-400/50 text-[#FAF8F5] transition duration-200 group rounded-xs"
            >
              <span className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" strokeWidth={1.4} />
                <span className="font-medium tracking-wide">Instant WhatsApp Concierge</span>
              </span>
              <span className="text-amber-300 text-[10px] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                Chat ↗
              </span>
            </a>

            {/* Direct Phone Helpline */}
            <a
              href="tel:+917268927163"
              className="flex items-center justify-between w-full px-3 py-2.5 bg-[#1A1917] hover:bg-[#242220] border border-stone-800 text-stone-300 hover:text-white transition duration-200 rounded-xs"
            >
              <span className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400/90" strokeWidth={1.4} />
                <span className="tracking-wide">Direct Helpline: +91 72689 27163</span>
              </span>
              <span className="text-[10px] uppercase text-stone-400">Call</span>
            </a>

            {/* Track Order Shortcut */}
            <Link
              to="/order-tracking"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-[#1A1917] hover:bg-[#242220] border border-stone-800 text-stone-300 hover:text-white transition duration-200 rounded-xs"
            >
              <span className="flex items-center space-x-2.5">
                <Package className="w-4 h-4 text-stone-400" strokeWidth={1.4} />
                <span className="tracking-wide">Live Order Tracking & Updates</span>
              </span>
              <span className="text-[10px] uppercase text-stone-400">Track →</span>
            </Link>

            {/* Email Support */}
            <a
              href="mailto:concierge@nexkart.com"
              className="flex items-center justify-between w-full px-3 py-2 bg-[#171614] hover:bg-[#201E1C] border border-stone-800/80 text-stone-400 hover:text-stone-200 transition duration-200 rounded-xs text-[11px]"
            >
              <span className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-stone-400" strokeWidth={1.4} />
                <span>concierge@nexkart.com</span>
              </span>
              <span className="text-[9.5px] uppercase text-stone-500">Email</span>
            </a>
          </div>

          {/* Micro Footer Note */}
          <div className="pt-2 border-t border-stone-800/60 text-[9.5px] text-stone-400 font-light leading-relaxed flex items-center justify-between">
            <span>Official Atelier &bull; Est. 2026</span>
            <span className="text-amber-300/80 font-serif italic">Pure Luxury Standard</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 bg-[#171615] hover:bg-[#22201D] text-[#FAF8F5] border border-amber-500/40 hover:border-amber-400 px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 group active:scale-95"
        aria-label="Open VIP Concierge Desk"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="font-medium text-[11px] tracking-[0.16em] uppercase text-amber-200 group-hover:text-amber-100">
          VIP Concierge
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-amber-300/80 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
      </button>
    </div>
  );
};
