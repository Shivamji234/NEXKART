import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import { X, Heart, Star, Shield, ArrowRight, Minus, Plus } from 'lucide-react';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0]?.url || '');
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const inWish = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product, quantity, selectedSize, selectedColor);
    setAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black z-20 transition rounded-full bg-white/80"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="bg-gray-50 p-6 flex flex-col justify-between">
            <div className="aspect-[3/4] w-full rounded overflow-hidden bg-white shadow-inner">
              <img
                src={selectedImage || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images?.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-14 h-14 rounded border-2 overflow-hidden flex-shrink-0 ${
                      selectedImage === img.url ? 'border-luxury-950' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gold-600 font-semibold mb-1">
                {product.brand} &bull; {product.category}
              </p>
              <h2 className="text-xl font-medium text-luxury-950">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {product.rating} ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-luxury-950">
                  {formatCurrency(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mt-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">
                    Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                  </span>
                  <div className="flex space-x-2 mt-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          selectedColor === c.name ? 'border-luxury-950 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mt-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">
                    Select Size:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs rounded border uppercase font-medium tracking-wider transition ${
                          selectedSize === s
                            ? 'bg-luxury-950 text-gold-400 border-luxury-950'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center space-x-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-gray-600 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-1.5 text-gray-600 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-gray-500">
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || adding}
                className="flex-1 py-3 bg-luxury-950 text-gold-400 font-semibold tracking-wider text-xs uppercase rounded hover:bg-luxury-800 transition disabled:opacity-50"
              >
                {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded border transition ${
                  inWish ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-black'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="text-[11px] uppercase tracking-wider text-gray-600 hover:text-black font-semibold inline-flex items-center space-x-1"
              >
                <span>View Full Atelier Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
