const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Add product review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, image } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, title, and comment.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.',
      });
    }

    // Check verified purchase
    const orderWithProduct = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
    });

    const isVerifiedPurchase = Boolean(orderWithProduct);

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      image: image || '',
      verifiedPurchase: isVerifiedPurchase,
      isModerated: true,
    });

    // Recalculate product rating
    const reviews = await Review.find({ product: productId, isModerated: true });
    product.numReviews = reviews.length;
    product.rating = Number(
      (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId, isModerated: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductReview,
  getProductReviews,
};
