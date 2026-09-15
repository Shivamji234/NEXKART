import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { formatCurrency } from '../utils/formatters';
import {
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Search,
} from 'lucide-react';

const CATEGORIES = ['All', 'Men', 'Women', 'Footwear', 'Accessories', 'Kids', 'Haute Horlogerie'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '40', '41', '42', '43', '44'];
const COLORS = ['Black', 'White', 'Navy', 'Camel', 'Gold', 'Charcoal', 'Brown'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'bestseller', label: 'Most Popular' },
  { value: 'biggest-discount', label: 'Privilege Discounts' },
];

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const newArrivalParam = searchParams.get('newArrival') === 'true';
  const bestSellerParam = searchParams.get('bestSeller') === 'true';
  const discountOnlyParam = searchParams.get('discountOnly') === 'true';

  // Filters State
  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(discountOnlyParam);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Data State
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [facets, setFacets] = useState({ brands: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Synchronize when searchParams change (e.g. clicking Men from nav)
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setKeyword(searchParams.get('keyword') || '');
    if (searchParams.get('discountOnly') === 'true') setDiscountOnly(true);
    setPage(1);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort: sortBy,
        };

        if (keyword) params.keyword = keyword;
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (selectedSize) params.size = selectedSize;
        if (selectedColor) params.color = selectedColor;
        if (inStockOnly) params.inStock = true;
        if (discountOnly) params.discountOnly = true;
        if (newArrivalParam) params.newArrival = true;
        if (bestSellerParam) params.bestSeller = true;

        const res = await productAPI.getProducts(params);
        if (res.success) {
          setProducts(res.products || []);
          setTotal(res.total || 0);
          setTotalPages(res.pages || 1);
          if (res.facets) setFacets(res.facets);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    page,
    sortBy,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    selectedSize,
    selectedColor,
    inStockOnly,
    discountOnly,
    keyword,
    newArrivalParam,
    bestSellerParam,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setInStockOnly(false);
    setDiscountOnly(false);
    setKeyword('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBrand ||
    minPrice ||
    maxPrice ||
    selectedSize ||
    selectedColor ||
    inStockOnly ||
    discountOnly ||
    keyword;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Banner Header */}
      <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            The Complete Atelier
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            {selectedCategory === 'All' ? 'All Luxury Creations' : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {total} pieces
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded text-xs font-semibold uppercase tracking-wider text-luxury-950 flex items-center space-x-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-white border border-gray-300 rounded px-2.5 sm:px-3 py-2 shadow-sm flex-1 sm:flex-initial">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 mr-1.5 font-medium flex-shrink-0">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-luxury-950 focus:outline-none cursor-pointer tracking-wide w-full"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mr-1">
            Active:
          </span>

          {keyword && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs text-gray-800">
              "{keyword}"
              <button onClick={() => setKeyword('')} className="ml-1.5 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs text-gray-800">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="ml-1.5 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs text-gray-800">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('')} className="ml-1.5 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSize && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs text-gray-800">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('')} className="ml-1.5 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedColor && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs text-gray-800">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor('')} className="ml-1.5 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {discountOnly && (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-red-100 text-xs text-red-800">
              Privilege Discounts
              <button onClick={() => setDiscountOnly(false)} className="ml-1.5 hover:text-red-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[11px] uppercase tracking-wider font-semibold text-gold-700 hover:text-gold-900 ml-2 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-gray-200">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-950">
              Maison Category
            </h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left text-xs py-1 transition ${
                    selectedCategory === cat
                      ? 'font-bold text-luxury-950 underline decoration-gold-500 decoration-2 underline-offset-4'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          {facets.brands?.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-950">
                Brands
              </h3>
              <div className="space-y-1.5">
                {facets.brands.map((b) => (
                  <label key={b} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="brandFilter"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                      className="text-luxury-950 focus:ring-0 rounded"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-950">
              Price Range (₹)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-luxury-950"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-luxury-950"
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-950">
              Available Sizes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    selectedSize === sz
                      ? 'bg-luxury-950 text-gold-400 border-luxury-950'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-950">
              Shade / Color
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    selectedColor === col
                      ? 'bg-luxury-950 text-gold-400 border-luxury-950'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-6 border-t border-gray-100">
            <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-gray-300 text-luxury-950 focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(e) => setDiscountOnly(e.target.checked)}
                className="rounded border-gray-300 text-luxury-950 focus:ring-0"
              />
              <span>Privilege Sale Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[3/4] bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-800">
                No matching creations discovered
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Adjust your filters or search keywords to explore alternative luxury pieces.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-luxury-800 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2 pt-6 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold uppercase tracking-wider text-luxury-950 hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 rounded text-xs font-semibold ${
                      page === pNum
                        ? 'bg-luxury-950 text-gold-400'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold uppercase tracking-wider text-luxury-950 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-950">
                Filter Creations
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(c);
                      setMobileFilterOpen(false);
                    }}
                    className={`block text-xs py-1 ${
                      selectedCategory === c ? 'font-bold text-black underline' : 'text-gray-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Price Range</h4>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1 border text-xs rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1 border text-xs rounded"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-widest font-semibold rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
