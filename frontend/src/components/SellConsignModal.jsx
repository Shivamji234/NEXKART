import React, { useState } from 'react';
import { X, ShieldCheck, Upload, MessageSquare, Check, ArrowRight } from 'lucide-react';
import nexkartMonogram from '../assets/nexkart-monogram.png';

export const SellConsignModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    brand: '',
    category: 'Watches',
    modelName: '',
    condition: 'Pristine (With Box & Papers)',
    expectedPrice: '',
    fullName: '',
    phone: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Open WhatsApp with pre-filled details for instant concierge appraisal
    const text = encodeURIComponent(
      `Hello NexKart Concierge, I would like an appraisal to sell/consign my luxury item:\n\n` +
      `• Brand: ${formData.brand}\n` +
      `• Category: ${formData.category}\n` +
      `• Model / Item: ${formData.modelName}\n` +
      `• Condition: ${formData.condition}\n` +
      `• Expected Value: ₹${formData.expectedPrice}\n` +
      `• Client: ${formData.fullName} (${formData.city})\n` +
      `• Phone: ${formData.phone}`
    );
    window.open(`https://wa.me/917268927163?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#141312] text-[#FAF8F5] border border-stone-800 rounded-xs p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={1.3} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b border-stone-800">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#1C1A18] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-inner">
            <img src={nexkartMonogram} alt="NX" className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.26em] text-amber-300/90 font-medium">
            Atelier Private Valuation
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-white uppercase tracking-wider">
            Sell & Consign Your Luxury
          </h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto font-light leading-relaxed">
            Turn your authentic pre-owned timepieces, fine leather bags, or designer jewelry into immediate capital. 100% verified payouts & free insured doorstep pickup.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10.5px]">
                Brand Name *
              </label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Rolex, Louis Vuitton, Cartier"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
              />
            </div>

            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10.5px]">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Watches">Luxury Watches & Timepieces</option>
                <option value="Bags">Handbags & Small Leather Goods</option>
                <option value="Apparel">Designer Apparel & Outerwear</option>
                <option value="Jewelry">Fine Jewelry & Precious Stones</option>
                <option value="Accessories">Sunglasses & Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10.5px]">
                Model / Item Name *
              </label>
              <input
                type="text"
                name="modelName"
                placeholder="e.g. Submariner Date, Neverfull MM"
                required
                value={formData.modelName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
              />
            </div>

            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10.5px]">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Pristine (With Box & Papers)">Pristine / Unworn (With Box & Papers)</option>
                <option value="Excellent (With Original Box)">Excellent / Like New (With Box)</option>
                <option value="Very Good (Pre-Loved)">Very Good / Gently Used</option>
                <option value="Vintage Collectible">Vintage Collectible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10.5px]">
              Expected Price (₹ INR) *
            </label>
            <input
              type="number"
              name="expectedPrice"
              placeholder="e.g. 150000"
              required
              value={formData.expectedPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600 font-mono"
            />
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10px]">
                Your Name *
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10px]">
                WhatsApp / Phone *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 tracking-wider uppercase text-[10px]">
                City / State *
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Delhi, Mumbai"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-[#1C1A18] border border-stone-700 text-stone-200 rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
              />
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#1A1816] p-3 rounded-xs border border-stone-800 space-y-1.5 text-[10.5px] text-stone-300">
            <div className="flex items-center space-x-2 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium">Direct Atelier Valuation &bull; Zero Hidden Deductions</span>
            </div>
            <p className="text-stone-400 font-light pl-5">
              Submit your request to instantly connect with our senior appraiser via WhatsApp for photos and serial number inspection.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.2em] rounded-xs transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect with Appraiser on WhatsApp &rarr;</span>
          </button>
        </form>
      </div>
    </div>
  );
};
