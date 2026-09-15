import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';

export const PolicyPages = () => {
  const { type = 'faq' } = useParams();

  const renderContent = () => {
    switch (type) {
      case 'shipping':
        return (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <h2 className="text-lg font-bold text-luxury-950 uppercase tracking-widest font-serif">
              White-Glove Shipping & Delivery Policy
            </h2>
            <p>
              At NEXKART, all luxury pieces are dispatched through specialized temperature-controlled courier networks, accompanied by full transit insurance and signature verification upon handoff.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Complimentary Tier</h3>
            <p>
              All orders qualify for 100% complimentary white-glove insured transit across all Indian pin codes, with expedited arrival scheduled within 2 to 4 business days.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Packaging</h3>
            <p>
              Every garment arrives encased in breathable bespoke garment bags with custom cedar hangers, sealed with the embossed NexKart ribbon.
            </p>
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <h2 className="text-lg font-bold text-luxury-950 uppercase tracking-widest font-serif">
              Atelier Returns & Exchange Privilege
            </h2>
            <p>
              NexKart extends a 14-day complimentary returns privilege from the date of confirmed delivery. Pieces must be in their pristine, original unworn condition with all fabric care and cryptographic security tags attached.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">How to Initiate</h3>
            <p>
              Navigate to your account under <strong className="text-luxury-950">Orders History</strong>, select the delivered order, and choose <strong className="text-luxury-950">Request Return</strong>. Our courier concierge will schedule a convenient doorstep pickup.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Refund Timeline</h3>
            <p>
              Upon receipt and inspection by our master atelier, refunds are processed within 48 hours directly to your original payment method.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <h2 className="text-lg font-bold text-luxury-950 uppercase tracking-widest font-serif">
              Maison Privacy & Data Safeguards
            </h2>
            <p>
              Your privacy is paramount. NexKart employs 256-bit SSL encryption, tokenized authentication, and strict PCI-DSS Level 1 compliance for all payment processing.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Zero Payment Credential Storage</h3>
            <p>
              We never store sensitive credit card credentials, CVV codes, or UPI security PINs on our servers. All transaction verifications take place over cryptographic signatures.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Client Confidentiality</h3>
            <p>
              We do not sell, license, or monetize your purchasing history or personal identifiers to third-party marketing brokers.
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <h2 className="text-lg font-bold text-luxury-950 uppercase tracking-widest font-serif">
              Terms & Conditions of Service
            </h2>
            <p>
              By accessing and acquiring creations from the NexKart platform, you acknowledge and adhere to our luxury client charter and terms of service.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Product Authenticity & Limitation</h3>
            <p>
              All products listed are authentic creations manufactured in accordance with rigorous quality standards. Due to limited artisan runs, quantities may be capped per client account.
            </p>
            <h3 className="text-xs font-bold uppercase text-luxury-950">Jurisdiction</h3>
            <p>
              All transactions and customer service disputes are governed in accordance with the laws of the Republic of India.
            </p>
          </div>
        );

      case 'faq':
      default:
        return (
          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <h2 className="text-lg font-bold text-luxury-950 uppercase tracking-widest font-serif">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-bold text-luxury-950 uppercase tracking-wide">
                  How can I track my order in real-time?
                </h3>
                <p className="mt-1 text-gray-600">
                  You can track your dispatch timeline by clicking <strong className="text-luxury-950">Order History</strong> in your account dropdown, or visiting the dedicated tracking page provided in your confirmation email.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-bold text-luxury-950 uppercase tracking-wide">
                  What payment methods are supported?
                </h3>
                <p className="mt-1 text-gray-600">
                  We support Razorpay encrypted payments including UPI (Google Pay, PhonePe, Paytm), all major Credit/Debit cards, Net Banking, and Cash on Delivery (COD up to ₹50,000).
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-bold text-luxury-950 uppercase tracking-wide">
                  How does the 14-day return privilege work?
                </h3>
                <p className="mt-1 text-gray-600">
                  You can submit a return request directly from your delivered order page. Our courier concierge will schedule complimentary white-glove doorstep collection.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-bold text-luxury-950 uppercase tracking-wide">
                  Are promotional codes applicable on all items?
                </h3>
                <p className="mt-1 text-gray-600">
                  Active promotional codes such as <strong className="text-luxury-950">LUXURY20</strong> and <strong className="text-luxury-950">FIRST10</strong> can be applied in your shopping bag or during checkout provided the minimum order requirement is satisfied.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 text-xs">
        <Link
          to="/policies/faq"
          className={`px-4 py-2 rounded uppercase tracking-wider font-semibold transition ${
            type === 'faq' ? 'bg-luxury-950 text-gold-400' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          FAQ
        </Link>
        <Link
          to="/policies/shipping"
          className={`px-4 py-2 rounded uppercase tracking-wider font-semibold transition ${
            type === 'shipping' ? 'bg-luxury-950 text-gold-400' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Shipping Policy
        </Link>
        <Link
          to="/policies/returns"
          className={`px-4 py-2 rounded uppercase tracking-wider font-semibold transition ${
            type === 'returns' ? 'bg-luxury-950 text-gold-400' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Returns & Exchanges
        </Link>
        <Link
          to="/policies/privacy"
          className={`px-4 py-2 rounded uppercase tracking-wider font-semibold transition ${
            type === 'privacy' ? 'bg-luxury-950 text-gold-400' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Privacy Policy
        </Link>
        <Link
          to="/policies/terms"
          className={`px-4 py-2 rounded uppercase tracking-wider font-semibold transition ${
            type === 'terms' ? 'bg-luxury-950 text-gold-400' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Terms of Service
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};
