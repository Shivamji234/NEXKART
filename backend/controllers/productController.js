const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with advanced filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      rating,
      inStock,
      discountOnly,
      featured,
      newArrival,
      bestSeller,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Search keyword
    if (keyword && keyword.trim()) {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { brand: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(keyword.trim(), 'i')] } },
        { sku: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
    }

    // Brand filter (supports comma-separated list)
    if (brand) {
      const brands = brand.split(',').map((b) => b.trim());
      query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (size) {
      const sizes = size.split(',').map((s) => s.trim());
      query.sizes = { $in: sizes };
    }

    // Color filter
    if (color) {
      const colors = color.split(',').map((c) => c.trim());
      query['colors.name'] = { $in: colors.map((c) => new RegExp(`^${c}$`, 'i')) };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // In-stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Discount filter
    if (discountOnly === 'true' || discountOnly === true) {
      query.discountPercentage = { $gt: 0 };
    }

    // Badges
    if (featured === 'true' || featured === true) query.isFeatured = true;
    if (newArrival === 'true' || newArrival === true) query.isNewArrival = true;
    if (bestSeller === 'true' || bestSeller === true) query.isBestSeller = true;

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-low-high' || sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high-low' || sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'highest-rated') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sort === 'most-popular' || sort === 'bestseller') {
      sortOptions = { isBestSeller: -1, numReviews: -1 };
    } else if (sort === 'biggest-discount') {
      sortOptions = { discountPercentage: -1 };
    } else if (sort === 'relevance' && keyword) {
      // Keep default or score
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Available facets for filters
    const availableBrands = await Product.distinct('brand', { isActive: true });
    const availableCategories = await Product.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      products,
      facets: {
        brands: availableBrands,
        categories: availableCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or SKU
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ sku: id.toUpperCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found with given identifier.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Related Products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category,
      isActive: true,
    })
      .limit(4)
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Featured Products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get New Arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Best Sellers
// @route   GET /api/products/bestsellers
// @access  Public
const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .limit(8)
      .sort({ numReviews: -1, rating: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Search Autocomplete / Suggestions
// @route   GET /api/products/suggestions
// @access  Public
const getSearchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(query.trim(), 'i');
    const products = await Product.find(
      { name: regex, isActive: true },
      { name: 1, category: 1, price: 1, images: { $slice: 1 } }
    ).limit(6);

    res.status(200).json({
      success: true,
      suggestions: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getSearchSuggestions,
  getCategories,
};
