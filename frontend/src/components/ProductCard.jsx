import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const inWish = isInWishlist(product._id);
  const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800';
  const secondaryImg = product.images?.[1]?.url || primaryImg;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Overlay container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={isHovered ? secondaryImg : primaryImg}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-luxury-950 text-gold-400 text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-gold-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
              BESTSELLER
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-red-800 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            inWish
              ? 'bg-white text-red-600 shadow-md'
              : 'bg-white/80 text-luxury-900 hover:bg-white hover:text-red-500 shadow-sm'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-current text-red-600' : ''}`} />
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 px-3 bg-white/95 text-luxury-950 text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-white transition flex items-center justify-center space-x-1 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0 || adding}
            className="flex-1 py-2 px-3 bg-luxury-950 text-gold-400 border border-gold-500/30 text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-luxury-800 transition flex items-center justify-center space-x-1 shadow-md disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock <= 0 ? 'Sold Out' : adding ? 'Adding...' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-widest mb-1">
            <span>{product.brand}</span>
            <div className="flex items-center text-gold-600 space-x-0.5">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-[10px] text-gray-700">{product.rating || 5.0}</span>
              <span className="text-gray-400 text-[10px]">({product.numReviews || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="text-xs font-medium text-luxury-900 hover:text-gold-700 transition line-clamp-1 tracking-wide">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-sm font-semibold text-luxury-950">
            {formatCurrency(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
