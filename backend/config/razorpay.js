const Razorpay = require('razorpay');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.warn('[Razorpay] Keys not set in environment. Running in mock/sandbox mode.');
  }

  return new Razorpay({
    key_id: key_id || 'rzp_test_placeholder',
    key_secret: key_secret || 'placeholder_secret',
  });
};

module.exports = { getRazorpayInstance };
