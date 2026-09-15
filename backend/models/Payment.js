const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'upi_qr'],
      required: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    upiTxnId: {
      type: String,
      index: true,
    },
    upiId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Created', 'Authorized', 'Captured', 'Failed', 'Refunded'],
      default: 'Created',
    },
    errorDetails: {
      code: String,
      description: String,
      source: String,
      step: String,
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
