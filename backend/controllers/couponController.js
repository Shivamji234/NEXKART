const Coupon = require('../models/Coupon');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public (or Private)
const validateCoupon = async (req, res, next) => {
  try {
    const { code, amount = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      active: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    const validation = coupon.isValid(amount);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    let calculatedDiscount = 0;
    if (coupon.discountType === 'percentage') {
      calculatedDiscount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
      }
    } else {
      calculatedDiscount = Math.min(coupon.discountValue, amount);
    }

    res.status(200).json({
      success: true,
      message: `Coupon code '${coupon.code}' applied!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        calculatedDiscount: Math.round(calculatedDiscount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active coupons for checkout promotion
// @route   GET /api/coupons/public
// @access  Public
const getPublicCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      active: true,
      expirationDate: { $gt: new Date() },
    }).select('code description discountType discountValue minOrderValue maxDiscount');

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getPublicCoupons,
};
