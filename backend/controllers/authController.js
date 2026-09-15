const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { createAndStoreOTP, verifyOTP } = require('../utils/otpService');
const { sendOTPEmail, sendOTPSMS } = require('../utils/emailService');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexkart_luxury_jwt_super_secret_key_2026_fashion_grade', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user & trigger OTP to both Email & Phone
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

    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile.trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Send fresh OTP for existing unverified user to both email and phone
        const { plainOtp } = await createAndStoreOTP([cleanEmail, existingUser.mobile || cleanMobile], 'verification');
        await sendOTPEmail(cleanEmail, plainOtp, 'Account Verification');
        if (existingUser.mobile || cleanMobile) {
          sendOTPSMS(existingUser.mobile || cleanMobile, plainOtp, 'Account Verification').catch(() => {});
        }
        return res.status(200).json({
          success: true,
          message: 'Account exists but unverified. A new verification OTP has been sent to your email and phone number.',
          requiresVerification: true,
          email: existingUser.email,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      mobile: cleanMobile,
      password,
      isVerified: false,
    });

    const { plainOtp } = await createAndStoreOTP([cleanEmail, cleanMobile], 'verification');
    await sendOTPEmail(cleanEmail, plainOtp, 'Account Verification');
    if (cleanMobile) {
      sendOTPSMS(cleanMobile, plainOtp, 'Account Verification').catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. A 6-digit security code has been sent to your email and phone number.',
      requiresVerification: true,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Registration / Login OTP and authenticate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyAccountOtp = async (req, res, next) => {
  try {
    const { email, mobile, otp, purpose = 'verification' } = req.body;
    const identifier = (email || mobile || '').trim();

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email or mobile number and authentication OTP are required.',
      });
    }

    // Find user by either email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }],
    });

    // Verify OTP for primary identifier
    let verification = await verifyOTP(identifier, otp, purpose);

    // If failed, try user's alternate identifier (mobile if email, or email if mobile)
    if (!verification.success && user) {
      const otherId = user.email.toLowerCase() === identifier.toLowerCase() ? user.mobile : user.email;
      if (otherId) {
        verification = await verifyOTP(otherId, otp, purpose);
      }
    }

    // Cross-purpose fallback (login vs verification)
    if (!verification.success && purpose === 'verification') {
      verification = await verifyOTP(identifier, otp, 'login');
      if (!verification.success && user && user.mobile) {
        verification = await verifyOTP(user.mobile, otp, 'login');
      }
    } else if (!verification.success && purpose === 'login') {
      verification = await verifyOTP(identifier, otp, 'verification');
      if (!verification.success && user && user.mobile) {
        verification = await verifyOTP(user.mobile, otp, 'verification');
      }
    }

    if (!verification.success) {
      return res.status(400).json(verification);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    user.isVerified = true;
    await user.save();

    // Create welcome notification if first time
    await Notification.create({
      user: user._id,
      title: 'Security Notice: Authentication Verified',
      message: 'You have successfully signed in with two-factor security verification.',
      type: 'security',
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Identity authenticated successfully. Welcome to NexKart.',
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

// @desc    Resend OTP via Brevo to both Email & Phone
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email, mobile, purpose = 'verification' } = req.body;
    const query = (email || mobile || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Email address or mobile number is required.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: query.toLowerCase() }, { mobile: query }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    const { plainOtp } = await createAndStoreOTP([user.email, user.mobile], purpose);
    const purposeTitle =
      purpose === 'password_reset'
        ? 'Password Reset'
        : purpose === 'login'
        ? 'Sign-In Authentication'
        : 'Account Verification';

    await sendOTPEmail(user.email, plainOtp, purposeTitle);
    if (user.mobile) {
      sendOTPSMS(user.mobile, plainOtp, purposeTitle).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: 'A fresh security OTP has been dispatched to your email and mobile number.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user credentials & trigger Brevo OTP to both Email & Phone
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

    // Generate login authentication OTP and dispatch to both Email and Phone
    const { plainOtp } = await createAndStoreOTP([user.email, user.mobile], 'login');
    try {
      await sendOTPEmail(user.email, plainOtp, 'Sign-In Authentication');
    } catch (emailErr) {
      console.error('[Auth] Failed to dispatch OTP email via Brevo:', emailErr.message);
    }
    if (user.mobile) {
      sendOTPSMS(user.mobile, plainOtp, 'Sign-In Authentication').catch(() => {});
    }

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      requiresVerification: true,
      message: 'A 6-digit security code has been sent to your email and registered mobile number.',
      email: user.email,
      mobile: user.mobile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request OTP to both Email & Phone
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address or mobile number.',
      });
    }

    const query = email.trim();
    const user = await User.findOne({
      $or: [{ email: query.toLowerCase() }, { mobile: query }],
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset OTP has been sent.',
      });
    }

    const { plainOtp } = await createAndStoreOTP([user.email, user.mobile], 'password_reset');
    await sendOTPEmail(user.email, plainOtp, 'Password Reset Request');
    if (user.mobile) {
      sendOTPSMS(user.mobile, plainOtp, 'Password Reset Request').catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email and mobile number.',
      email: user.email,
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
    if (req.body.email && req.body.email.trim().toLowerCase() !== user.email) {
      const cleanEmail = req.body.email.trim().toLowerCase();
      const exists = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'This email address is already in use by another account.' });
      }
      user.email = cleanEmail;
    }
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
