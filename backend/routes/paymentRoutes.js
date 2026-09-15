const express = require('express');
const router = express.Router();
const {
  getPaymentKey,
  createRazorpayOrder,
  verifyPayment,
  verifyUpiPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/key', getPaymentKey);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/verify-upi', protect, verifyUpiPayment);

module.exports = router;
