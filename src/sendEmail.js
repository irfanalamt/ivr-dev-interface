import nodemailer from 'nodemailer';

const SMTP_SETTINGS = {
  host: process.env.SMTP_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(SMTP_SETTINGS);

async function sendEmail(to, subject, text) {
  const emailDetails = {
    from: `"IVR Studio"<${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(emailDetails);
    console.log('Email sent:', info.response, to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export default sendEmail;
