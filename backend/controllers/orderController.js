const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Generate unique luxury order number e.g. NEX-2026-98765
const generateOrderNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `NEX-2026-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountAmount = 0,
      taxPrice = 0,
      shippingPrice = 0,
      totalPrice,
      couponApplied,
      paymentResult,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.mobile || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery address.' });
    }

    // COD limit validation (e.g., maximum ₹50,000 for COD for security)
    if (paymentMethod === 'cod' && totalPrice > 50000) {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery is limited to orders up to ₹50,000 for high-value security.',
      });
    }

    // Verify inventory stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found.`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Only ${product.stock} left.`,
        });
      }
    }

    // Deduct inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : (paymentResult ? 'Completed' : 'Pending'),
      paymentResult: paymentResult || undefined,
      itemsPrice,
      discountAmount,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponApplied,
      orderStatus: 'Confirmed',
      timeline: [
        {
          status: 'Confirmed',
          title: 'Order Placed & Confirmed',
          description: paymentMethod === 'cod'
            ? 'Order confirmed with Cash on Delivery payment.'
            : 'Payment authorized and verified. Atelier preparing your shipment.',
          timestamp: new Date(),
        },
      ],
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: undefined });

    // Send in-app notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Confirmed',
      message: `Your order #${orderNumber} of ₹${totalPrice.toLocaleString('en-IN')} is confirmed.`,
      type: 'order',
      data: { orderId: order._id.toString() },
    });

    // Send confirmation email
    sendOrderConfirmationEmail(req.user.email, order).catch((err) =>
      console.error('Email send err:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email mobile');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email mobile');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ensure customer can only access their own order unless admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access to this order is restricted.' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Customer requested cancellation' } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status.`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancellation = {
      isCancelled: true,
      reason,
      cancelledAt: new Date(),
    };

    order.timeline.push({
      status: 'Cancelled',
      title: 'Order Cancelled',
      description: `Order cancelled. Reason: ${reason}`,
      timestamp: new Date(),
    });

    // Restore inventory
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();

    await Notification.create({
      user: order.user,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled.`,
      type: 'order',
    });

    res.status(200).json({
      success: true,
      message: 'Order has been successfully cancelled and inventory restored.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Return for delivered order
// @route   POST /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, note } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please select a reason for return.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Returns can only be requested after successful delivery.',
      });
    }

    order.returnRequest = {
      status: 'Requested',
      reason,
      note: note || '',
      requestedAt: new Date(),
      refundStatus: 'Pending',
      refundAmount: order.totalPrice,
    };

    order.timeline.push({
      status: 'Return Requested',
      title: 'Return Request Initiated',
      description: `Return initiated for reason: ${reason}. Under concierge review.`,
      timestamp: new Date(),
    });

    await order.save();

    await Notification.create({
      user: req.user._id,
      title: 'Return Request Received',
      message: `Return request for order #${order.orderNumber} is under review.`,
      type: 'order',
    });

    res.status(200).json({
      success: true,
      message: 'Return request submitted. NexKart Concierge will process your request shortly.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
};
