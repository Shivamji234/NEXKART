import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { ArrowRight, Shield, Award, Clock, Sparkles, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useNotifications();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Welcome to NexKart Privileges. Check your inbox for your 10% welcome code.');
    setEmail('');
  };

  return (
    <footer className="bg-luxury-950 text-white border-t border-white/10 mt-20">
      {/* Value Proposition Bar */}
      <div className="border-b border-white/10 py-8 sm:py-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded bg-white/5 border border-white/10 text-gold-400 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Artisanal Craftsmanship</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Finest European & Asian textiles</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded bg-white/5 border border-white/10 text-gold-400 flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">White-Glove Delivery</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Express insured door-to-door transit</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded bg-white/5 border border-white/10 text-gold-400 flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Guaranteed Authenticity</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">100% verified certified provenance</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded bg-white/5 border border-white/10 text-gold-400 flex-shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">14-Day Atelier Returns</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Complimentary pick-up & exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Manifesto */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xs bg-[#1F1D1B] border border-stone-700/60 flex items-center justify-center">
                <span className="text-[#E7D9C3] font-serif font-bold text-sm">N</span>
              </div>
              <span className="font-serif text-2xl font-normal tracking-[0.24em] text-white uppercase">
                NEXKART
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pr-2 sm:pr-6 font-light">
              NexKart was founded with an artisan spirit: uniting understated luxury, verified provenance, and attentive personal concierge care to make fine online shopping effortless and deeply rewarding.
            </p>
            <div className="pt-2 text-xs text-stone-300 space-y-1.5 font-light">
              <p>
                <strong className="text-stone-100 font-medium">Client Concierge:</strong>{' '}
                <a
                  href="mailto:nexkart2.0@gmail.com"
                  className="text-amber-300 hover:text-white transition underline decoration-amber-400/40 underline-offset-2"
                  title="Send email to NexKart Customer Support"
                >
                  nexkart2.0@gmail.com
                </a>
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <strong className="text-stone-100 font-medium">Helpline &bull; WhatsApp:</strong>
                <a
                  href="tel:+917268927163"
                  className="text-amber-300 hover:text-white transition underline decoration-amber-400/40 underline-offset-2 font-medium"
                  title="Call NexKart Helpline"
                >
                  +91 72689 27163
                </a>
                <span className="text-stone-600">&bull;</span>
                <a
                  href="https://wa.me/917268927163?text=Hello%20NexKart%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition hover:underline"
                  title="Chat directly on WhatsApp"
                >
                  <span>WhatsApp Concierge ↗</span>
                </a>
              </div>
              <p><strong className="text-stone-100 font-medium">Studio:</strong> Near Mohansarai, Varanasi, Uttar Pradesh — 221302</p>
              <p className="text-[11px] text-stone-400">Mon - Sat: 9:00 AM – 8:00 PM IST (Pan-India Support)</p>
            </div>
          </div>

          {/* Maison Collections */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300 mb-4 font-serif">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300 font-light">
              <li><Link to="/shop?category=Men" className="hover:text-white transition">Men's Wardrobe</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition">Women's Couture</Link></li>
              <li><Link to="/shop?category=Footwear" className="hover:text-white transition">Footwear & Cordwainery</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white transition">Leather Goods & Bags</Link></li>
              <li><Link to="/shop?category=Haute Horlogerie" className="hover:text-white transition">Haute Horlogerie</Link></li>
              <li><Link to="/shop?newArrival=true" className="hover:text-white transition">New Seasonal Releases</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300 mb-4 font-serif">
              Client Services
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300 font-light">
              <li><Link to="/contact" className="hover:text-white transition">Contact Concierge</Link></li>
              <li><Link to="/about" className="hover:text-white transition">The NexKart Story</Link></li>
              <li><Link to="/policies/faq" className="hover:text-white transition">Client FAQ</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-white transition">Shipping & Delivery</Link></li>
              <li><Link to="/policies/returns" className="hover:text-white transition">Returns & Doorstep Exchange</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300 font-serif">
              The Atelier Gazette
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Receive private invitations to seasonal previews, limited collector drops, and private salon trunk shows.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#141414] border border-white/20 text-xs px-3 py-2.5 text-white placeholder-gray-500 rounded focus:outline-none focus:border-gold-500 tracking-wider"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold-600 hover:bg-gold-500 text-luxury-950 font-bold rounded transition flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500">By subscribing you agree to our Privacy Policy.</p>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Payments, Copyright & Socials */}
        <div className="border-t border-white/10 mt-12 sm:mt-14 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 text-center md:text-left">
          <div className="space-y-1.5">
            <p>&copy; {new Date().getFullYear()} NEXKART Private Limited. Crafted for luxury connoisseurs.</p>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-xs">
              <span className="text-gray-400 font-medium">Follow Us:</span>
              <a
                href="https://www.instagram.com/nexkartstore2.0?utm_source=qr&stkn=d3VpejdoZTcwaGdz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <span className="text-gray-700">&bull;</span>
              <a
                href="https://www.youtube.com/@nexkart-store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-red-500 hover:text-red-400 transition"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[10px] tracking-wider uppercase text-gray-400">
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">UPI</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Razorpay</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Visa</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Mastercard</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">NetBanking</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Cash On Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
