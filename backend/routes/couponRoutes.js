const express = require('express');
const router = express.Router();
const { validateCoupon, getPublicCoupons } = require('../controllers/couponController');

router.post('/validate', validateCoupon);
router.get('/public', getPublicCoupons);

module.exports = router;
