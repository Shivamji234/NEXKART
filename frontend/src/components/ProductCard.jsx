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
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden border border-stone-200/75 hover:border-stone-400/80 transition-all duration-500 hover:shadow-[0_12px_32px_rgba(23,22,21,0.06)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Overlay container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB]">
        <Link to={`/product/${product._id}`}>
          <img
            src={isHovered ? secondaryImg : primaryImg}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </Link>

        {/* Minimalist Editorial Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-[#1C1A18]/90 backdrop-blur-sm text-[#EFEBE4] text-[8.5px] sm:text-[9px] font-medium uppercase tracking-[0.16em] rounded-xs shadow-xs">
              New In
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-[#8E7145] text-white text-[8.5px] sm:text-[9px] font-medium uppercase tracking-[0.16em] rounded-xs shadow-xs">
              Curator's Pick
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-stone-800/90 text-amber-200 text-[8.5px] sm:text-[9px] font-medium uppercase tracking-[0.16em] rounded-xs shadow-xs">
              {product.discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            inWish
              ? 'bg-white text-rose-600 shadow-md scale-105'
              : 'bg-white/85 text-stone-800 hover:bg-white hover:text-rose-500 shadow-xs'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 px-3 bg-white text-stone-900 text-[10.5px] font-medium tracking-[0.14em] uppercase rounded-xs hover:bg-stone-100 transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>Preview</span>
            </button>
          )}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0 || adding}
            className="flex-1 py-2 px-3 bg-[#1C1A18] text-[#EFEBE4] text-[10.5px] font-medium tracking-[0.14em] uppercase rounded-xs hover:bg-[#2C2926] transition flex items-center justify-center space-x-1 shadow-sm disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>{product.stock <= 0 ? 'Sold Out' : adding ? 'Adding...' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] text-stone-500 uppercase tracking-[0.16em] mb-1.5">
            <span className="truncate max-w-[65%] font-medium">{product.brand || 'NexKart Atelier'}</span>
            <div className="flex items-center text-amber-600 space-x-0.5 flex-shrink-0">
              <Star className="w-3 h-3 fill-current text-amber-500" />
              <span className="font-medium text-[10px] text-stone-800">{product.rating || 5.0}</span>
              <span className="text-stone-400 text-[9px]">({product.numReviews || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-serif text-sm font-normal text-stone-900 hover:text-amber-900 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 min-w-0">
            <span className="text-sm font-semibold text-stone-900 truncate tracking-tight">
              {formatCurrency(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through truncate font-light">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0 || adding}
            className="lg:hidden p-2 rounded-xs bg-[#1C1A18] text-[#EFEBE4] hover:bg-black transition active:scale-95 disabled:opacity-40 flex-shrink-0"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
