import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await contactAPI.submit({ name, email, subject, message });
      if (res.success) {
        addToast(res.message);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
          Private Client Services
        </span>
        <h1 className="text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Contact The Atelier Concierge
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed font-light">
          Whether you desire bespoke tailoring advice, horological consultation, or order assistance, our specialists are at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Concierge Information */}
        <div className="bg-luxury-950 text-white p-8 rounded-lg space-y-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gold-400 font-serif">
              Maison Desks
            </h2>

            <div className="space-y-5 text-xs text-gray-300">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Client Inquiries</p>
                  <p className="text-gray-400 mt-0.5">concierge@nexkart.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Direct Concierge Hotline</p>
                  <p className="text-gray-400 mt-0.5">+91 (0) 22 4580 9000</p>
                  <p className="text-[10px] text-gray-500">Mon - Sat: 9:00 AM – 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Flagship Atelier Lounge</p>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">
                    Level 14, The Oberoi Chambers<br />
                    Nariman Point, Mumbai 400021
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-gray-400">
            <p>Private styling appointments can be scheduled via video consultation or at our bespoke salon.</p>
          </div>
        </div>

        {/* Right 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <MessageSquare className="w-5 h-5 text-gold-600" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-950">
              Transmit An Inquiry
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lord / Lady / Title"
                  className="w-full px-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full px-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Subject of Inquiry *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Bespoke Sizing Inquiry / Order Query"
                className="w-full px-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Message Content *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How may our concierge assist your acquisition today?"
                className="w-full px-3 py-2.5 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
