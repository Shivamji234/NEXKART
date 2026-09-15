import React, { useState } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end space-y-2">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-950">
                NexKart Concierge
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-black rounded"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-gray-600 my-2 leading-relaxed">
            Need styling advice, order tracking, or payment assistance? Reach our team directly:
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {/* WhatsApp */}
            <a
              href="https://wa.me/917268927163?text=Hello%20NexKart%20Support%2C%20I%20need%20assistance%20with%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
            >
              <span>?? Chat on WhatsApp</span>
            </a>

            {/* Direct Call */}
            <a
              href="tel:+917268927163"
              className="w-full py-2 px-3 bg-luxury-950 hover:bg-black text-gold-400 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: +91 72689 27163</span>
            </a>

            {/* Email */}
            <a
              href="mailto:nexkart2.0@gmail.com"
              className="w-full py-2 px-3 border border-gray-200 hover:bg-gray-50 text-luxury-900 rounded-lg font-medium flex items-center justify-center space-x-1.5 transition text-[11px]"
            >
              <span>?? nexkart2.0@gmail.com</span>
            </a>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-2.5">
            Mon - Sat: 9:00 AM – 8:00 PM IST
          </p>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 sm:h-13 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center space-x-2 shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-white cursor-pointer"
        aria-label="Contact Customer Support & WhatsApp"
        title="Customer Support: +91 72689 27163"
      >
        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="text-xs font-bold tracking-wider">Helpline & WhatsApp</span>
      </button>
    </div>
  );
};
