const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

// @desc    Get comprehensive Admin Dashboard metrics & charts
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sales summary
    const salesAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = salesAggregation.length > 0 ? salesAggregation[0].totalRevenue : 0;

    // Order status counts
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const returnRequests = await Order.countDocuments({ 'returnRequest.status': 'Requested' });

    // Low stock inventory alert (less than 5 items)
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name sku stock price category images')
      .limit(6);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    // Monthly Sales Chart Data (last 6 months)
    const monthlyStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnRequests,
        lowStockCount,
      },
      lowStockProducts,
      recentOrders,
      recentUsers,
      monthlyStats,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PRODUCT MANAGEMENT ====================

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ORDER MANAGEMENT ====================

// @desc    Get all orders with filtering & search
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      query.orderNumber = { $regex: search.trim(), $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Completed';
    }

    const statusDescriptions = {
      Confirmed: 'Order confirmed and verified.',
      Processing: 'Handcrafted atelier is assembling and preparing items.',
      Packed: 'Carefully packaged in bespoke NexKart gift packaging.',
      Shipped: 'Handed to premium courier concierge. Dispatched for destination.',
      'Out for Delivery': 'Out with courier concierge for white-glove delivery today.',
      Delivered: 'Successfully delivered to customer.',
      Cancelled: 'Order cancelled.',
      Returned: 'Order items returned to atelier.',
    };

    order.timeline.push({
      status,
      title: `Order ${status}`,
      description: note || statusDescriptions[status] || `Order status updated to ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    // Notify customer
    await Notification.create({
      user: order.user,
      title: `Order Update: ${status}`,
      message: `Your order #${order.orderNumber} is now marked as ${status}.`,
      type: 'order',
      data: { orderId: order._id.toString() },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Reject Return Request
// @route   PUT /api/admin/orders/:id/return-status
// @access  Private/Admin
const handleReturnRequest = async (req, res, next) => {
  try {
    const { status, refundStatus } = req.body; // status: 'Approved' | 'Rejected'

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.returnRequest.status = status;
    order.returnRequest.processedAt = new Date();

    if (status === 'Approved') {
      order.orderStatus = 'Returned';
      order.returnRequest.refundStatus = refundStatus || 'Processed';
      order.timeline.push({
        status: 'Return Approved',
        title: 'Return Request Approved',
        description: 'Return request approved. Refund initiated to original payment source.',
        timestamp: new Date(),
      });

      // Restore inventory
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    } else {
      order.timeline.push({
        status: 'Return Rejected',
        title: 'Return Request Declined',
        description: 'Return request was not eligible according to Maison policy.',
        timestamp: new Date(),
      });
    }

    await order.save();

    await Notification.create({
      user: order.user,
      title: `Return Request ${status}`,
      message: `Your return request for #${order.orderNumber} was ${status.toLowerCase()}.`,
      type: 'order',
    });

    res.status(200).json({
      success: true,
      message: `Return request ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user active status / role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== COUPON MANAGEMENT ====================

// @desc    Get all coupons (admin)
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};

// ==================== REVIEW MODERATION ====================

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name sku images')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle review moderation / delete
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
