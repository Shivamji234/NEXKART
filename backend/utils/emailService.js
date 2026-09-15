const nodemailer = require('nodemailer');

/**
 * Dispatches email using Brevo (Sendinblue) v3 REST API
 * Highly reliable on cloud platforms like Render & Vercel (avoids SMTP port blocks)
 */
const sendViaBrevoAPI = async ({ to, subject, html, text }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === 'your_brevo_api_key' || apiKey === 'devpassword') {
    return null;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'nexkart2.0@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'NEXKART Maison';

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text || '',
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey.trim(),
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();
    if (!response.ok) {
      const errMsg = resData.message || JSON.stringify(resData);
      console.error(`[Brevo API Error] Status ${response.status}: ${errMsg}`);
      throw new Error(`Brevo Delivery Error: ${errMsg}`);
    }

    console.log(`[Brevo API] Dispatched email to ${to}, MessageId: ${resData.messageId}`);
    return { success: true, messageId: resData.messageId, provider: 'brevo-api' };
  } catch (err) {
    console.error(`[Brevo API Exception]: ${err.message}`);
    throw err;
  }
};

/**
 * Transporter fallback for Brevo SMTP (smtp-relay.brevo.com) or standard SMTP
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || (process.env.BREVO_API_KEY ? 'smtp-relay.brevo.com' : null);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD || process.env.BREVO_API_KEY;

  if (host && user && pass && pass !== 'your_app_specific_password' && pass !== 'devpassword') {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

/**
 * Unified sendEmail with Brevo priority
 */
const sendEmail = async ({ to, subject, html, text }) => {
  // 1. Try Brevo REST API first (recommended for Render & Netlify)
  try {
    const brevoResult = await sendViaBrevoAPI({ to, subject, html, text });
    if (brevoResult) {
      return brevoResult;
    }
  } catch (brevoErr) {
    console.warn(`[Email] Brevo API delivery failed, attempting SMTP fallback: ${brevoErr.message}`);
  }

  // 2. Try Nodemailer / Brevo SMTP
  const transporter = createTransporter();
  if (transporter) {
    try {
      const senderFrom = process.env.EMAIL_FROM || `"${process.env.BREVO_SENDER_NAME || 'NEXKART Maison'}" <${process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'nexkart2.0@gmail.com'}>`;
      const info = await transporter.sendMail({
        from: senderFrom,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email] SMTP dispatched to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (error) {
      console.error(`[Email] Nodemailer delivery error: ${error.message}`);
      if (process.env.NODE_ENV === 'production' && process.env.BREVO_API_KEY) {
        throw error;
      }
    }
  }

  // 3. Fallback in development only (Simulate safely)
  if (process.env.NODE_ENV !== 'production' || !process.env.BREVO_API_KEY) {
    console.log('----------------------------------------------------');
    console.log(`[EMAIL DISPATCH SIMULATION] Provider: Brevo/DevFallback`);
    console.log(`[EMAIL DISPATCH SIMULATION] To: ${to}`);
    console.log(`[EMAIL DISPATCH SIMULATION] Subject: ${subject}`);
    console.log(`[EMAIL DISPATCH SIMULATION] Text: ${text}`);
    console.log('----------------------------------------------------');
  }
  return { success: true, simulated: true };
};

const sendOTPEmail = async (email, otp, purpose = 'Account Verification') => {
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 580px; margin: auto; padding: 40px 24px; background-color: #0C0C0C; color: #FFFFFF; border: 1px solid #2A2A2A; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #1E1E1E;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background-color: #1A1A1A; border: 1px solid #D4AF37; border-radius: 6px; margin-bottom: 12px;">
          <span style="color: #D4AF37; font-family: serif; font-size: 22px; font-weight: bold;">N</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 600; letter-spacing: 5px; margin: 0; color: #F5F5F5; text-transform: uppercase;">NEXKART</h1>
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin-top: 4px; font-weight: 600;">Maison de Luxe &bull; Security Concierge</p>
      </div>

      <div style="padding: 32px 0; text-align: center;">
        <span style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px; color: #D4AF37; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 16px;">
          ${purpose}
        </span>
        <h2 style="font-size: 19px; font-weight: 500; letter-spacing: 0.5px; color: #FFFFFF; margin: 0 0 12px 0;">
          Authenticate Your Sign-In
        </h2>
        <p style="font-size: 13px; color: #A8A8A8; line-height: 1.6; margin: 0 auto 24px auto; max-width: 440px;">
          Please use the confidential 6-digit security code below to complete your authentication. This code remains active for 10 minutes.
        </p>

        <div style="background: linear-gradient(135deg, #161616 0%, #1A1A1A 100%); border: 1px solid #D4AF37; display: inline-block; padding: 18px 42px; border-radius: 6px; margin: 8px 0 20px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
          <span style="font-size: 34px; font-weight: 700; letter-spacing: 12px; color: #D4AF37; font-family: 'Courier New', monospace; margin-left: 12px;">${otp}</span>
        </div>

        <p style="font-size: 12px; color: #777777; margin-top: 18px; line-height: 1.5;">
          For your safety, never share this code with anyone. NexKart personnel will never ask for your authentication code.
        </p>
      </div>

      <div style="border-top: 1px solid #1E1E1E; padding-top: 24px; text-align: center; font-size: 11px; color: #666666; line-height: 1.6;">
        <p style="margin: 0 0 4px 0;">Dispatched via Brevo Secure Authentication Gateway</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} NEXKART Private Limited. Near Mohansarai, Varanasi, Uttar Pradesh — 221302.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `NEXKART Security Code: ${otp} — ${purpose}`,
    text: `Your NEXKART authentication code is: ${otp}. Valid for 10 minutes. If you did not request this, please disregard.`,
    html,
  });
};

const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 580px; margin: auto; padding: 40px 24px; background-color: #0C0C0C; color: #FFFFFF; border: 1px solid #2A2A2A; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #1E1E1E;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background-color: #1A1A1A; border: 1px solid #D4AF37; border-radius: 6px; margin-bottom: 12px;">
          <span style="color: #D4AF37; font-family: serif; font-size: 22px; font-weight: bold;">N</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 600; letter-spacing: 5px; margin: 0; color: #F5F5F5; text-transform: uppercase;">NEXKART</h1>
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin-top: 4px; font-weight: 600;">Maison de Luxe</p>
      </div>
      <div style="padding: 28px 0;">
        <h2 style="font-size: 20px; font-weight: 500; color: #FFFFFF; margin-bottom: 6px;">Order Confirmed</h2>
        <p style="font-size: 13px; color: #888888; margin-top: 0;">Order Reference: <strong style="color: #D4AF37;">${order.orderNumber}</strong></p>
        <p style="font-size: 13px; color: #CCCCCC; line-height: 1.6;">
          Thank you for your acquisition. Your order has been placed successfully and our white-glove atelier is preparing your pieces with bespoke packaging.
        </p>
        <div style="margin: 20px 0; border: 1px solid #2A2A2A; padding: 18px; border-radius: 6px; background: #141414;">
          <p style="margin: 6px 0; font-size: 14px; color: #D4AF37; font-weight: 600;">Total Amount: ₹${order.totalPrice.toLocaleString('en-IN')}</p>
          <p style="margin: 6px 0; font-size: 13px; color: #AAAAAA;">Payment Method: ${order.paymentMethod.toUpperCase()}</p>
          <p style="margin: 6px 0; font-size: 13px; color: #AAAAAA;">Status: ${order.orderStatus}</p>
        </div>
      </div>
      <div style="border-top: 1px solid #1E1E1E; padding-top: 20px; text-align: center; font-size: 11px; color: #666666;">
        &copy; ${new Date().getFullYear()} NEXKART Private Limited. Near Mohansarai, Varanasi, Uttar Pradesh.
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
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
