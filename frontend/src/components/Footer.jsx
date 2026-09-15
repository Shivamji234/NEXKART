import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { ArrowRight, Shield, Award, Clock, Sparkles } from 'lucide-react';

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
      <div className="border-b border-white/10 py-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Artisanal Craftsmanship</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Finest European & Asian textiles</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-gold-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">White-Glove Delivery</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Express insured door-to-door transit</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-gold-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Guaranteed Authenticity</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">100% verified certified provenance</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-gold-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">14-Day Atelier Returns</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Complimentary pick-up & exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-white/5 border border-gold-500/40 flex items-center justify-center">
                <span className="text-gold-400 font-serif font-bold text-sm">N</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase">
                NEXKART
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              NexKart is a modern luxury e-commerce platform created to make premium online shopping simpler, faster and more enjoyable. Combining architectural aesthetics, trusted shopping experiences, and smart technology to discover exquisite products effortlessly.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p><strong className="text-gray-200">Customer Support:</strong> nexkart2.0@gmail.com</p>
              <p><strong className="text-gray-200">Helpline / WhatsApp:</strong> +91 72689 27163</p>
              <p><strong className="text-gray-200">Studio:</strong> Near Mohansarai, Varanasi, Uttar Pradesh</p>
              <p className="text-[11px] text-gray-500">Mon - Sat: 9:00 AM – 8:00 PM IST (All India Support)</p>
            </div>
          </div>

          {/* Maison Collections */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
              Maison
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/shop?category=Men" className="hover:text-white transition">Men's Wardrobe</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition">Women's Couture</Link></li>
              <li><Link to="/shop?category=Footwear" className="hover:text-white transition">Footwear & Cordwainery</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white transition">Leather Goods & Bags</Link></li>
              <li><Link to="/shop?category=Haute Horlogerie" className="hover:text-white transition">Haute Horlogerie</Link></li>
              <li><Link to="/shop?newArrival=true" className="hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition">Contact Concierge</Link></li>
              <li><Link to="/about" className="hover:text-white transition">The NexKart Story</Link></li>
              <li><Link to="/policies/faq" className="hover:text-white transition">Client FAQ</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-white transition">Return & Exchange</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Maison Gazette
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to receive private invitations to runway debuts, limited editions, and private collector trunk shows.
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

        {/* Bottom Bar: Payments & Copyright */}
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} NEXKART Private Limited. Crafted for luxury connoisseurs.</p>
          <div className="flex items-center space-x-3 text-[10px] tracking-wider uppercase text-gray-400">
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
