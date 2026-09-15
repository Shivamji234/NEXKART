const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { createAndStoreOTP, verifyOTP } = require('../utils/otpService');
const { sendOTPEmail } = require('../utils/emailService');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexkart_luxury_jwt_super_secret_key_2026_fashion_grade', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user & trigger OTP
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, password.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Send fresh OTP for existing unverified user
        const { plainOtp } = await createAndStoreOTP(email, 'verification');
        await sendOTPEmail(email, plainOtp, 'Account Verification');
        return res.status(200).json({
          success: true,
          message: 'Account exists but unverified. A new verification OTP has been sent.',
          requiresVerification: true,
          email: existingUser.email,
          devOtp: process.env.NODE_ENV !== 'production' ? plainOtp : undefined,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      isVerified: false,
    });

    const { plainOtp } = await createAndStoreOTP(email, 'verification');
    await sendOTPEmail(email, plainOtp, 'Account Verification');

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify the OTP sent to your email.',
      requiresVerification: true,
      email: user.email,
      devOtp: process.env.NODE_ENV !== 'production' ? plainOtp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Registration OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyAccountOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      });
    }

    const verification = await verifyOTP(email, otp, 'verification');
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    user.isVerified = true;
    await user.save();

    // Create welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to NEXKART Maison',
      message: 'Your luxury membership has been verified. Discover our latest collections.',
      type: 'security',
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. Welcome to NexKart.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account with this email not found.',
      });
    }

    const { plainOtp } = await createAndStoreOTP(email, purpose);
    await sendOTPEmail(email, plainOtp, purpose === 'password_reset' ? 'Password Reset' : 'Account Verification');

    res.status(200).json({
      success: true,
      message: 'A fresh security OTP has been dispatched.',
      devOtp: process.env.NODE_ENV !== 'production' ? plainOtp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/mobile and password.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile: email.trim() }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact concierge.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    if (!user.isVerified) {
      const { plainOtp } = await createAndStoreOTP(user.email, 'verification');
      await sendOTPEmail(user.email, plainOtp, 'Account Verification');
      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: 'Your email has not been verified yet. An OTP has been sent to activate your account.',
        email: user.email,
        devOtp: process.env.NODE_ENV !== 'production' ? plainOtp : undefined,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Sign in successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Security practice: don't reveal user existence explicitly
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset OTP has been sent.',
      });
    }

    const { plainOtp } = await createAndStoreOTP(email, 'password_reset');
    await sendOTPEmail(email, plainOtp, 'Password Reset Request');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email.',
      email: user.email,
      devOtp: process.env.NODE_ENV !== 'production' ? plainOtp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const verification = await verifyOTP(email, otp, 'password_reset');
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    user.password = password;
    await user.save();

    await Notification.create({
      user: user._id,
      title: 'Security Alert: Password Updated',
      message: 'Your NexKart account password was successfully reset.',
      type: 'security',
    });

    res.status(200).json({
      success: true,
      message: 'Your password has been successfully updated. You may now sign in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    if (req.body.avatar) user.avatar = req.body.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match records.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyAccountOtp,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
};
