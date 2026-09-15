const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'Please provide SKU'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    video: {
      type: String,
      default: '',
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, default: '#000000' },
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    shippingInfo: {
      type: String,
      default: 'Complimentary signature white-glove delivery within 2-4 business days. Delivered in bespoke NexKart packaging.',
    },
    returnInfo: {
      type: String,
      default: 'Complimentary 14-day returns and exchanges. Items must be in unworn, pristine condition with security tags intact.',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save validation: ensure discountPrice is strictly less than price
productSchema.pre('save', function (next) {
  if (this.price !== undefined) {
    if (this.discountPrice >= this.price || this.discountPrice <= 0) {
      this.discountPrice = 0;
      this.discountPercentage = 0;
    } else if (this.discountPrice > 0 && this.discountPrice < this.price) {
      this.discountPercentage = Math.round(((this.price - this.discountPrice) / this.price) * 100);
    }
  }
  next();
});

// Compound text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text',
  subcategory: 'text',
  tags: 'text',
});

module.exports = mongoose.model('Product', productSchema);
