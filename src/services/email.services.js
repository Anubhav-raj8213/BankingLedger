import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, userName) {
    const subject = 'Welcome to Our Service!';
    const text = `Hi ${userName},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nYBackend Ledger Team`;
    const html = `<p>Hi ${userName},</p><p>Thank you for registering with us! We're excited to have you on board.</p><p>Best regards,<br>Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendLoggedInEmail(userEmail, userName) {
    const subject = 'New Login Alert';
    const text = `Hi ${userName},\n\nWe noticed a new login to your account. If this was you, you can safely ignore this email. If you did not log in, please secure your account immediately.\n\nBest regards,\nYour Company Name`;
    const html = `<p>Hi ${userName},</p><p>We noticed a new login to your account. If this was you, you can safely ignore this email. If you did not log in, please secure your account immediately.</p><p>Best regards,<br>Your Company Name</p>`;
    await sendEmail(userEmail, subject, text, html);
}

export {
    sendRegistrationEmail,
    sendLoggedInEmail
}
