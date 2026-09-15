const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
};

// Store OTP securely (supports array of identifiers e.g. [email, mobile])
const createAndStoreOTP = async (identifiers, purpose = 'verification', existingOtp = null) => {
  const plainOtp = existingOtp || generateOTP();
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(plainOtp, salt);

  // Expire in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const list = Array.isArray(identifiers) ? identifiers : [identifiers];

  for (const id of list) {
    if (!id) continue;
    const cleanId = id.toString().trim().toLowerCase();
    // Remove previous unverified OTPs for this identifier and purpose
    await OTP.deleteMany({ identifier: cleanId, purpose });

    await OTP.create({
      identifier: cleanId,
      otpHash,
      purpose,
      expiresAt,
    });
  }

  return { plainOtp, expiresAt };
};

// Verify OTP
const verifyOTP = async (identifier, enteredOtp, purpose = 'verification') => {
  const record = await OTP.findOne({
    identifier: identifier.toLowerCase(),
    purpose,
  }).sort({ createdAt: -1 });

  if (!record) {
    return { success: false, message: 'No active OTP request found. Please request a new OTP.' };
  }

  if (new Date() > record.expiresAt) {
    await OTP.findByIdAndDelete(record._id);
    return { success: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (record.attempts >= 5) {
    await OTP.findByIdAndDelete(record._id);
    return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  const isMatch = await bcrypt.compare(enteredOtp.trim(), record.otpHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return {
      success: false,
      message: `Invalid OTP. You have ${5 - record.attempts} attempts remaining.`,
    };
  }

  // Delete once verified
  await OTP.findByIdAndDelete(record._id);
  return { success: true, message: 'OTP verified successfully.' };
};

module.exports = {
  generateOTP,
  createAndStoreOTP,
  verifyOTP,
};
