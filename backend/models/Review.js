const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating between 1 and 5 is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: 120,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000,
    },
    image: {
      type: String,
      default: '',
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isModerated: {
      type: Boolean,
      default: true, // auto-approve in seed / dev, admin can moderate
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user reviews a product once per purchase
reviewSchema.index({ user: 1, product: 1 });

module.exports = mongoose.model('Review', reviewSchema);
