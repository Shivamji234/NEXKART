const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getSearchSuggestions,
  getCategories,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/bestsellers', getBestSellers);
router.get('/suggestions', getSearchSuggestions);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

module.exports = router;
