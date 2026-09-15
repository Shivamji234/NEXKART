const express = require('express');
const router = express.Router();
const {
  createProductReview,
  getProductReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createProductReview);

module.exports = router;
