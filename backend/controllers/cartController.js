const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper to calculate cart totals
const calculateTotals = (cart) => {
  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  let discountAmount = 0;
  if (cart.coupon && cart.coupon.code) {
    if (cart.coupon.discountType === 'percentage') {
      discountAmount = (subtotal * cart.coupon.discountValue) / 100;
      if (cart.coupon.maxDiscount && cart.coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, cart.coupon.maxDiscount);
      }
    } else if (cart.coupon.discountType === 'fixed') {
      discountAmount = Math.min(cart.coupon.discountValue, subtotal);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  // 5% luxury goods tax / GST
  const tax = Math.round(taxableAmount * 0.05);
  // Free luxury delivery above ₹2,999, else ₹250 standard
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 250;
  const grandTotal = Math.max(0, taxableAmount + tax + shipping);

  return {
    subtotal,
    discountAmount: Math.round(discountAmount),
    tax,
    shipping,
    grandTotal,
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size = '', color = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} pieces available in inventory.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const primaryImg = product.images.length > 0 ? product.images[0].url : '';

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Inventory limit is ${product.stock}.`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: primaryImg,
        price,
        size,
        color,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    await cart.populate('items.product');

    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Item added to your bag.',
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Item ID and quantity required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      const product = await Product.findById(item.product);
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available.`,
        });
      }
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated.',
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product');
    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from your bag.',
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.coupon = undefined;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      cart: {
        items: [],
        subtotal: 0,
        discountAmount: 0,
        tax: 0,
        shipping: 0,
        grandTotal: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon/apply
// @access  Private
const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your bag is empty.' });
    }

    let subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const validation = coupon.isValid(subtotal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    cart.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
    };

    await cart.save();
    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      message: `Promo code ${coupon.code} applied successfully!`,
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove applied coupon
// @route   DELETE /api/cart/coupon/remove
// @access  Private
const removeCoupon = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.coupon = undefined;
      await cart.save();
    }

    const totals = calculateTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Promo code removed.',
      cart: {
        _id: cart ? cart._id : null,
        items: cart ? cart.items : [],
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  calculateTotals,
};
