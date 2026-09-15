import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotifications();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState('specs');

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes, relRes] = await Promise.all([
          productAPI.getProductById(id),
          reviewAPI.getProductReviews(id).catch(() => ({ reviews: [] })),
          productAPI.getRelatedProducts(id).catch(() => ({ products: [] })),
        ]);

        if (prodRes.success && prodRes.product) {
          const p = prodRes.product;
          setProduct(p);
          setActiveImage(p.images?.[0]?.url || '');
          setSelectedSize(p.sizes?.[0] || '');
          setSelectedColor(p.colors?.[0]?.name || '');
          setQuantity(1);

          // Update recently viewed in localStorage
          const localViewed = JSON.parse(localStorage.getItem('nexkart_recently_viewed') || '[]');
          const filtered = localViewed.filter((item) => item._id !== p._id);
          const updated = [p, ...filtered].slice(0, 4);
          localStorage.setItem('nexkart_recently_viewed', JSON.stringify(updated));
          setRecentlyViewed(filtered.slice(0, 4));
        }

        if (revRes.reviews) setReviews(revRes.reviews);
        if (relRes.products) setRelated(relRes.products);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950">
          Creation Not Found
        </h2>
        <p className="text-xs text-gray-500">
          The creation you are searching for is currently not available in our digital atelier.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-widest font-semibold rounded"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = async (goToCheckout = false) => {
    setAdding(true);
    await addToCart(product, quantity, selectedSize, selectedColor);
    setAdding(false);
    if (goToCheckout) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in to submit a client review.', 'info');
      navigate('/login');
      return;
    }

    if (!reviewTitle || !reviewComment) {
      addToast('Please provide both a review title and comment.', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewAPI.createReview({
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        addToast('Thank you for your valuable feedback.');
        setReviews([res.review, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500 flex flex-wrap items-center gap-1.5 sm:space-x-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-luxury-950 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Interactive Multi-Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-sm group">
            <img
              src={activeImage || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-crosshair"
            />
            {hasDiscount && (
              <span className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-2.5 py-1 bg-red-800 text-white text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-bold rounded">
                {product.discountPercentage}% Privilege Saving
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images?.length > 1 && (
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded border-2 overflow-hidden flex-shrink-0 transition ${
                    activeImage === img.url
                      ? 'border-luxury-950 ring-2 ring-gold-400/40'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gold-700 uppercase tracking-[0.2em] font-semibold">
              <span className="truncate max-w-[70%]">{product.brand} &bull; SKU: {product.sku}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Shareable link copied to clipboard.');
                }}
                className="text-gray-400 hover:text-black flex items-center space-x-1 flex-shrink-0"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[10px] lowercase">share</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold uppercase tracking-wider text-luxury-950 font-serif mt-2">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 sm:space-x-3 mt-3">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {product.rating} &bull; {product.numReviews || 0} Reviews
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-baseline gap-2 sm:gap-4 border-y border-gray-100 py-3 sm:py-4">
              <span className="text-2xl sm:text-3xl font-bold text-luxury-950">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs font-semibold text-red-700 bg-red-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
                  Save {formatCurrency(product.price - product.discountPrice)}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Color Shade: <span className="font-normal text-gray-500">{selectedColor}</span>
                </span>
                <div className="flex space-x-2.5 mt-2.5">
                  {product.colors.map((col, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === col.name ? 'border-luxury-950 scale-110 shadow' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Select Size:
                  </span>
                  <span className="text-[11px] text-gray-500 underline cursor-pointer">
                    Bespoke Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5 mt-2.5">
                  {product.sizes.map((sz, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs rounded border uppercase font-medium tracking-wider transition ${
                        selectedSize === sz
                          ? 'bg-luxury-950 text-gold-400 border-luxury-950 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock Status */}
            <div className="mt-6 flex items-center space-x-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-300 rounded bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-600 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-gray-600 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Available in Atelier ({product.stock} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={product.stock <= 0 || adding}
                  className="flex-1 py-3.5 bg-luxury-950 text-gold-400 font-semibold tracking-widest text-xs uppercase rounded hover:bg-black transition shadow-lg disabled:opacity-50"
                >
                  {product.stock <= 0 ? 'Sold Out' : adding ? 'Adding...' : 'Add to Bag'}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded border transition ${
                    inWish ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={product.stock <= 0 || adding}
                className="w-full py-3.5 bg-gold-600 text-luxury-950 font-bold tracking-widest text-xs uppercase rounded hover:bg-gold-500 transition shadow disabled:opacity-50"
              >
                Instant Buy Now
              </button>
            </div>
          </div>

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-6 border-t border-gray-100 text-center">
            <div className="p-1 sm:p-2 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-gold-600" />
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-luxury-950 tracking-wider leading-tight">White-Glove Delivery</p>
            </div>
            <div className="p-1 sm:p-2 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-gold-600" />
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-luxury-950 tracking-wider leading-tight">14-Day Atelier Return</p>
            </div>
            <div className="p-1 sm:p-2 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-gold-600" />
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-luxury-950 tracking-wider leading-tight">Certified Provenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Atelier Accordion Tabs */}
      <div className="border-t border-gray-200 pt-10 max-w-4xl mx-auto space-y-4">
        {/* Specs Accordion */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <button
            onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
            className="w-full p-4 text-left font-bold uppercase tracking-wider text-xs flex justify-between items-center bg-gray-50"
          >
            <span>Material, Craftsmanship & Specifications</span>
            {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openAccordion === 'specs' && (
            <div className="p-5 bg-white text-xs space-y-3">
              {product.specifications?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-gray-100 py-1.5">
                      <span className="text-gray-500 font-medium">{spec.key}</span>
                      <span className="text-luxury-950 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Hand-finished with authentic luxury materials.</p>
              )}
            </div>
          )}
        </div>

        {/* Shipping & Returns Accordion */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <button
            onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
            className="w-full p-4 text-left font-bold uppercase tracking-wider text-xs flex justify-between items-center bg-gray-50"
          >
            <span>Complimentary Shipping & Returns</span>
            {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openAccordion === 'shipping' && (
            <div className="p-5 bg-white text-xs space-y-3 text-gray-600 leading-relaxed">
              <p><strong>Delivery:</strong> {product.shippingInfo}</p>
              <p><strong>Returns:</strong> {product.returnInfo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="border-t border-gray-200 pt-12 max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
              Patron Reviews ({reviews.length})
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600">Overall Rating: {product.rating} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Write a review form */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-950">
            Submit Your Assessment
          </h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Rating
              </span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="p-1 text-gold-500"
                  >
                    <Star
                      className={`w-5 h-5 ${num <= reviewRating ? 'fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Review Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Masterful Drapery and Quality"
                className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                Detailed Feedback
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on the craftsmanship, fit, and materials..."
                className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-luxury-800 transition disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Post Client Review'}
            </button>
          </form>
        </div>

        {/* Existing reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">
              Be the first distinguished patron to review this creation.
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-5 bg-white rounded border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-luxury-950">
                      {rev.userName || rev.user?.name || 'Verified Patron'}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{formatDate(rev.createdAt)}</span>
                </div>

                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                <h4 className="text-xs font-semibold text-luxury-950">{rev.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 pt-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-gold-600 font-semibold">
              Complete Your Ensemble
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
              Related Creations
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="border-t border-gray-200 pt-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
              Previously Inspected
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest text-luxury-950 font-serif">
              Recently Viewed
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
