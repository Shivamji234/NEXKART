import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await addToCart(product, 1);
    await toggleWishlist(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
          Your Wishlist Is Empty
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Save your favorite couture garments and horological creations to inspect anytime.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-luxury-800 transition shadow-lg"
        >
          Explore Creations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
          Curated Favourites
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
          Saved Creations ({wishlist.length})
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const product = item.product || item;
          const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
          const currentPrice = hasDiscount ? product.discountPrice : product.price;

          return (
            <div
              key={product._id}
              className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-400 hover:text-red-600 rounded-full shadow transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold">
                    {product.brand}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="text-xs font-semibold text-luxury-950 hover:text-gold-700 line-clamp-1 mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs font-bold text-luxury-950 mt-1">
                    {formatCurrency(currentPrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={product.stock <= 0}
                  className="w-full py-2 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-luxury-800 transition flex items-center justify-center space-x-1 disabled:opacity-50"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock <= 0 ? 'Out of Stock' : 'Move to Bag'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
