
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true',
    },
    debug: true,
    logger: true
});

console.log('Testing email configuration...');
console.log('User:', process.env.SMTP_USERNAME);
console.log('Pass length:', process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : 0);

const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USERNAME,
    to: process.env.SMTP_USERNAME, // Send to self
    subject: 'Test Email from Node Script',
    text: 'If you receive this, SMTP is working correctly.',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
