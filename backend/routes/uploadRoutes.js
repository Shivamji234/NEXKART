const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

// Use memory storage so we never store files on local server disks in production
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are permitted'), false);
    }
  },
});

// @desc    Upload product image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    // If Cloudinary credentials are configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key'
    ) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'nexkart/products',
            transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary',
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // If Cloudinary keys are not yet configured, return informative response
    return res.status(400).json({
      success: false,
      message:
        'Cloudinary credentials are not configured in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Please provide these or enter an external image URL.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
