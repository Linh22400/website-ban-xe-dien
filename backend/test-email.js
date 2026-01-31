const nodemailer = require('nodemailer');

// Cấu hình Brevo giống hệt trong plugins.ts
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: 'a13a6b001@smtp-brevo.com',
        pass: 'FOYwDBVbXayGNZkC' // Mật khẩu bạn đã cung cấp
    },
    debug: true, // Hiện log chi tiết
    logger: true // Hiện log chi tiết
});

async function testEmail() {
    console.log('🔄 Đang thử gửi email qua Brevo (Port 465, SSL)...');
    try {
        // 1. Verify connection configuration
        await transporter.verify();
        console.log('✅ Kết nối đến server Brevo THÀNH CÔNG!');

        // 2. Send test email
        const info = await transporter.sendMail({
            from: 'ln32587@gmail.com', // Email này PHẢI được verify trong Brevo > Senders
            to: 'ln32587@gmail.com', // Gửi cho chính mình để test
            subject: 'Test Brevo SMTP from Local',
            text: 'Nếu bạn nhận được email này, nghĩa là tài khoản Brevo đã hoạt động tốt!',
            html: '<h3>Kết nối SMTP Brevo thành công!</h3><p>Tài khoản của bạn đã có thể gửi mail.</p>'
        });

        console.log('📧 Email đã được gửi:', info.messageId);
        console.log('🔗 URL xem trước (nếu có):', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ LỖI GỬI MAIL:');
        console.error(error);

        if (error.code === 'EAUTH') {
            console.log('\n⚠️  LỖI XÁC THỰC (Authentication):');
            console.log('- Kiểm tra lại xem tài khoản Brevo đã được kích hoạt chưa?');
            console.log('- Bạn có cần hoàn tất hồ sơ công ty (Company Profile) trên Brevo không?');
            console.log('- Email người gửi (from) đã được verify trong Brevo chưa?');
        }
    }
}

testEmail();
