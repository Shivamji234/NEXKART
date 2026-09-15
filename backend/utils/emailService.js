const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD &&
    process.env.EMAIL_PASSWORD !== 'your_app_specific_password' &&
    process.env.EMAIL_PASSWORD !== 'devpassword'
  ) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"NEXKART Luxury Concierge" <concierge@nexkart.com>',
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email] Dispatched to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[Email] Nodemailer delivery error: ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  // Fallback in development only (Strictly NEVER log OTP or secrets in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log('----------------------------------------------------');
    console.log(`[DEV EMAIL SIMULATION] To: ${to}`);
    console.log(`[DEV EMAIL SIMULATION] Subject: ${subject}`);
    console.log(`[DEV EMAIL SIMULATION] Body: ${text || html}`);
    console.log('----------------------------------------------------');
  }
  return { success: true, simulated: true };
};

const sendOTPEmail = async (email, otp, purpose = 'Account Verification') => {
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background-color: #0A0A0A; color: #FFFFFF; border: 1px solid #222222; border-radius: 4px;">
      <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #222222;">
        <h1 style="font-size: 26px; font-weight: 300; letter-spacing: 6px; margin: 0; color: #E5C07B;">NEXKART</h1>
        <p style="font-size: 11px; letter-spacing: 3px; color: #888888; text-transform: uppercase; margin-top: 5px;">Maison de Luxe</p>
      </div>
      <div style="padding: 30px 0; text-align: center;">
        <h2 style="font-size: 18px; font-weight: 400; letter-spacing: 1px; color: #FFFFFF; margin-bottom: 10px;">${purpose}</h2>
        <p style="font-size: 14px; color: #A0A0A0; line-height: 1.6; margin-bottom: 25px;">
          Please use the security code below to complete your authentication. This code remains valid for 10 minutes.
        </p>
        <div style="background-color: #141414; border: 1px solid #333333; display: inline-block; padding: 16px 36px; border-radius: 4px; margin: 15px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #E5C07B; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #666666; margin-top: 25px;">
          If you did not request this security code, please ignore this email or contact the NexKart Client Concierge.
        </p>
      </div>
      <div style="border-top: 1px solid #222222; padding-top: 20px; text-align: center; font-size: 11px; color: #555555;">
        &copy; ${new Date().getFullYear()} NEXKART Private Limited. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `NEXKART Security Code: ${otp}`,
    text: `Your NEXKART verification code is: ${otp}. Valid for 10 minutes.`,
    html,
  });
};

const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background-color: #0A0A0A; color: #FFFFFF; border: 1px solid #222222; border-radius: 4px;">
      <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #222222;">
        <h1 style="font-size: 26px; font-weight: 300; letter-spacing: 6px; margin: 0; color: #E5C07B;">NEXKART</h1>
        <p style="font-size: 11px; letter-spacing: 3px; color: #888888; text-transform: uppercase; margin-top: 5px;">Maison de Luxe</p>
      </div>
      <div style="padding: 25px 0;">
        <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF;">Order Confirmed</h2>
        <p style="font-size: 13px; color: #888888;">Order Reference: <strong style="color: #E5C07B;">${order.orderNumber}</strong></p>
        <p style="font-size: 14px; color: #CCCCCC; line-height: 1.6;">
          Thank you for your acquisition. Your order has been placed successfully and our white-glove atelier is now preparing your pieces.
        </p>
        <div style="margin: 20px 0; border: 1px solid #222222; padding: 15px; border-radius: 4px; background: #121212;">
          <p style="margin: 5px 0; font-size: 14px; color: #E5C07B;">Total Amount: ₹${order.totalPrice.toLocaleString('en-IN')}</p>
          <p style="margin: 5px 0; font-size: 13px; color: #AAAAAA;">Payment Method: ${order.paymentMethod.toUpperCase()}</p>
          <p style="margin: 5px 0; font-size: 13px; color: #AAAAAA;">Status: ${order.orderStatus}</p>
        </div>
      </div>
      <div style="border-top: 1px solid #222222; padding-top: 20px; text-align: center; font-size: 11px; color: #555555;">
        &copy; ${new Date().getFullYear()} NEXKART Private Limited. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmation - ${order.orderNumber} | NEXKART`,
    text: `Thank you for your order ${order.orderNumber}. Total: ₹${order.totalPrice}. Status: ${order.orderStatus}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendOrderConfirmationEmail,
};
