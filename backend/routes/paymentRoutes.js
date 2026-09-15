const express = require('express');
const router = express.Router();
const {
  getPaymentKey,
  createRazorpayOrder,
  verifyPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/key', getPaymentKey);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
