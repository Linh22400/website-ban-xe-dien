
export default {
  async afterCreate(event) {
    const { result } = event;
    const { strapi } = event as any; // Cast to access global strapi if needed, though it's global

    try {
      strapi.log.info('============== LEAD LIFECYCLE TRIGGERED ==============');
      strapi.log.info(`New Lead ID: ${result.id}, Email: ${result.email}, Type: ${result.type}`);

      const adminEmail = process.env.SMTP_USERNAME || 'camauducduy@gmail.com';
      const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USERNAME || 'no-reply@banxedien.com';

      // Robustly get email service
      const emailService = strapi.plugin('email')?.service('email') || strapi.plugins?.['email']?.services?.email;

      if (!emailService) {
        strapi.log.error('CRITICAL: Email plugin is NOT loaded. Cannot send email.');
        strapi.log.info('Available plugins:', Object.keys(strapi.plugins));
        return;
      }

      const isInstallment = result.message?.toLowerCase().includes('trả góp') || result.type === 'consultation';
      const emailSubject = isInstallment 
        ? `[Tư Vấn Trả Góp] ${result.name} - ${result.model}`
        : `[New Lead] ${result.type?.toUpperCase()} - ${result.name}`;

      // 1. Email to Admin
      try {
        strapi.log.info(`Attempting to send email to Admin: ${adminEmail}`);
        await emailService.send({
          to: adminEmail,
          from: fromEmail,
          subject: emailSubject,
          html: `
            <h3>New Lead Received</h3>
            <p><strong>Name:</strong> ${result.name}</p>
            <p><strong>Email:</strong> ${result.email}</p>
            <p><strong>Phone:</strong> ${result.phone}</p>
            <p><strong>Type:</strong> ${result.type} ${isInstallment ? '(Trả Góp)' : ''}</p>
            <p><strong>Model:</strong> ${result.model || 'N/A'}</p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                <strong>Message / Details:</strong><br/>
                <pre style="white-space: pre-wrap; font-family: sans-serif;">${result.message || 'No message'}</pre>
            </div>
            <p><strong>Status:</strong> ${result.statuses || 'pending'}</p>
            <p><strong>Created At:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          `,
        });
        strapi.log.info(`SUCCESS: Lead email sent to admin: ${adminEmail}`);
      } catch (adminErr) {
        strapi.log.error('ERROR sending lead email to admin:', adminErr);
      }

      // 2. Email to Customer (Auto-reply)
      if (result.email && !result.email.includes('no-email@provided.com')) {
        try {
          strapi.log.info(`Attempting to send auto-reply to Customer: ${result.email}`);
          let customerSubject = 'Xác nhận yêu cầu liên hệ - Xe Điện Đức Duy';
          let customerBodyContent = '';

          if (isInstallment) {
            customerSubject = 'Xác nhận yêu cầu Tư Vấn Trả Góp - Xe Điện Đức Duy';
            customerBodyContent = `
              <p>Chúng tôi đã nhận được yêu cầu <strong>Tư Vấn Trả Góp</strong> cho sản phẩm <strong>${result.model || 'xe điện'}</strong> của bạn.</p>
              <p>Dưới đây là thông tin dự toán bạn đã đăng ký:</p>
              <div style="background-color: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <pre style="white-space: pre-wrap; font-family: sans-serif; margin: 0; color: #1e3a8a;">${result.message}</pre>
              </div>
              <p><em>Lưu ý: Bảng tính trên chỉ mang tính chất tham khảo. Nhân viên tư vấn sẽ gọi điện lại để chốt hồ sơ chính xác nhất với các công ty tài chính (FE Credit, HD Saison...).</em></p>
            `;
          } else {
            customerBodyContent = `
              <p>Chúng tôi đã nhận được yêu cầu <strong>${getErrorTypeLabel(result.type)}</strong> của bạn.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>Lời nhắn:</strong></p>
                  <p>${result.message || 'Không có'}</p>
              </div>
            `;
          }

          await emailService.send({
            to: result.email,
            from: fromEmail,
            subject: customerSubject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h3 style="color: #2563eb;">Cảm ơn bạn đã liên hệ với Xe Điện Đức Duy!</h3>
                <p>Xin chào <strong>${result.name}</strong>,</p>
                ${customerBodyContent}
                <p>Đội ngũ tư vấn sẽ liên hệ lại với bạn qua số điện thoại <strong>${result.phone}</strong> trong thời gian sớm nhất (thường trong vòng 15-30 phút trong giờ làm việc).</p>
                <br/>
                <p>Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ Hotline: <strong>094 342 4787</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #6b7280; font-size: 14px;">Trân trọng,<br/>Đội ngũ Xe Điện Đức Duy</p>
              </div>
            `,
          });
          strapi.log.info(`SUCCESS: Lead auto-reply sent to customer: ${result.email}`);
        } catch (customerErr) {
          strapi.log.error('ERROR sending lead auto-reply to customer:', customerErr);
        }
      }
    } catch (err) {
      strapi.log.error('CRITICAL ERROR in lead lifecycle:', err);
    }
  },
};

function getErrorTypeLabel(type: string): string {
  switch (type) {
    case 'test-drive': return 'Lái Thử';
    case 'consultation': return 'Tư Vấn';
    case 'deposit': return 'Đặt Cọc';
    default: return 'Liên Hệ';
  }
}
