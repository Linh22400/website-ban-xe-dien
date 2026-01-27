export default {
  async afterCreate(event) {
    const { result } = event;

    try {
      const adminEmail = process.env.SMTP_USERNAME || 'camauducduy@gmail.com';
      const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USERNAME || 'no-reply@banxedien.com';

      // 1. Email to Admin
      try {
        await strapi.plugins['email'].services.email.send({
          to: adminEmail,
          from: fromEmail,
          subject: `[New Lead] ${result.type.toUpperCase()} - ${result.name}`,
          html: `
            <h3>New Lead Received</h3>
            <p><strong>Name:</strong> ${result.name}</p>
            <p><strong>Email:</strong> ${result.email}</p>
            <p><strong>Phone:</strong> ${result.phone}</p>
            <p><strong>Type:</strong> ${result.type}</p>
            <p><strong>Model:</strong> ${result.model || 'N/A'}</p>
            <p><strong>Message:</strong> ${result.message || 'No message'}</p>
            <p><strong>Status:</strong> ${result.statuses}</p>
            <p><strong>Created At:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          `,
        });
        strapi.log.info(`Lead email sent to admin: ${adminEmail}`);
      } catch (adminErr) {
        strapi.log.error('Error sending lead email to admin:', adminErr);
      }

      // 2. Email to Customer (Auto-reply)
      if (result.email) {
        try {
          await strapi.plugins['email'].services.email.send({
            to: result.email,
            from: fromEmail,
            subject: 'Xác nhận yêu cầu liên hệ - Xe Điện Đức Duy',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h3 style="color: #2563eb;">Cảm ơn bạn đã liên hệ với Xe Điện Đức Duy!</h3>
                <p>Xin chào <strong>${result.name}</strong>,</p>
                <p>Chúng tôi đã nhận được yêu cầu <strong>${getErrorTypeLabel(result.type)}</strong> của bạn.</p>
                <p>Đội ngũ tư vấn sẽ liên hệ lại với bạn qua số điện thoại <strong>${result.phone}</strong> trong thời gian sớm nhất (thường trong vòng 24h làm việc).</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>Thông tin bạn đã gửi:</strong></p>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li><strong>Sản phẩm quan tâm:</strong> ${result.model || 'Không xác định'}</li>
                    <li><strong>Lời nhắn:</strong> ${result.message || 'Không có'}</li>
                  </ul>
                </div>

                <p>Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ Hotline: <strong>094 342 4787</strong></p>
                <br/>
                <p style="color: #6b7280; font-size: 14px;">Trân trọng,<br/>Đội ngũ Xe Điện Đức Duy</p>
              </div>
            `,
          });
          strapi.log.info(`Lead auto-reply sent to customer: ${result.email}`);
        } catch (customerErr) {
          strapi.log.error('Error sending lead auto-reply to customer:', customerErr);
        }
      }
    } catch (err) {
      strapi.log.error('Critical error in lead lifecycle:', err);
    }
  },
};

function getErrorTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'test-drive': 'Lái thử xe',
    'consultation': 'Tư vấn sản phẩm',
    'deposit': 'Đặt cọc xe'
  };
  return map[type] || type;
}
