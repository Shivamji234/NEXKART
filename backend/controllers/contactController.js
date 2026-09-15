const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit Contact Concierge form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      subject,
      message,
    });

    // Notify concierge in development/production
    sendEmail({
      to: email,
      subject: `NEXKART Concierge: Inquiry Received [${subject}]`,
      text: `Dear ${name},\n\nThank you for contacting the NexKart Client Concierge. We have received your message regarding "${subject}" and a luxury specialist will assist you shortly.\n\nWarm regards,\nNexKart Concierge`,
    }).catch((err) => console.error('Contact email error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our concierge will be in touch shortly.',
      contactId: contact._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };
