const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  handleReturnRequest,
  getAllUsers,
  updateUserStatus,
  getAdminCoupons,
  createCoupon,
  deleteCoupon,
  getAdminReviews,
  deleteReview,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/return-status', handleReturnRequest);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Reviews
router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
