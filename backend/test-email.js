const nodemailer = require('nodemailer');

// Cấu hình Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: 'ln32587@gmail.com', // Email của bạn
        pass: 'vamb ugvk mcpb zsqg' // App Password từ .env
    },
    debug: true,
    logger: true
});

async function testEmail() {
    console.log('🔄 Đang thử gửi email qua Gmail (Port 465, SSL)...');
    try {
        await transporter.verify();
        console.log('✅ Kết nối đến server Gmail THÀNH CÔNG!');

        const info = await transporter.sendMail({
            from: 'ln32587@gmail.com',
            to: 'ln32587@gmail.com',
            subject: 'Test Gmail SMTP',
            text: 'Gmail App Password hoạt động tốt!',
            html: '<h3>Gmail SMTP Success!</h3>'
        });

        console.log('📧 Email đã được gửi:', info.messageId);
    } catch (error) {
        console.error('❌ LỖI GỬI MAIL:', error);
    }
}

testEmail();
