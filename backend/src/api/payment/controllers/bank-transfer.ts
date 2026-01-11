/**
 * Bank Transfer Payment - Backend Controller
 * Strapi CMS - src/api/payment/controllers/bank-transfer.ts
 * 
 * Miễn phí 100% - Khách upload ảnh chuyển khoản, Admin xác nhận
 */

export default {
  /**
   * POST /api/payment/bank-transfer/upload-proof
   * Upload ảnh chứng từ chuyển khoản
   * 
   * Body (FormData):
   * {
   *   "orderId": "DH123456",
   *   "amount": 3000000,
   *   "transferDate": "2026-01-11T10:30:00",
   *   "bankName": "Vietcombank",
   *   "accountNumber": "1234567890",
   *   "transferNote": "DH123456",
   *   "proofImage": File
   * }
   */
  async uploadProof(ctx) {
    try {
      const { orderId, amount, transferDate, bankName, accountNumber, transferNote } = ctx.request.body;

      // Validate required fields
      if (!orderId || !amount) {
        return ctx.badRequest('Missing required fields: orderId, amount');
      }

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderId },
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Get uploaded file (if using Strapi upload plugin)
      const files = ctx.request.files;
      let uploadedFileId = null;

      if (files && files.proofImage) {
        // Upload to Strapi media library
        const uploadService = strapi.plugin('upload').service('upload');
        const uploadedFiles = await uploadService.upload({
          data: {
            refId: order.id,
            ref: 'api::order.order',
            field: 'PaymentProof',
          },
          files: files.proofImage,
        });
        
        uploadedFileId = uploadedFiles[0]?.id;
      }

      // Update order với thông tin chuyển khoản
      const updatedOrder = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: {
          PaymentStatus: 'pending_verification', // Chờ admin xác nhận
          PaymentMethod: 'bank_transfer',
          PaymentProofData: {
            amount: Number(amount),
            transferDate: transferDate || new Date().toISOString(),
            bankName: bankName || '',
            accountNumber: accountNumber || '',
            transferNote: transferNote || '',
            uploadedAt: new Date().toISOString(),
            fileId: uploadedFileId,
          },
        },
      });

      return ctx.send({
        success: true,
        message: 'Upload ảnh chuyển khoản thành công. Vui lòng đợi admin xác nhận.',
        data: {
          orderId: updatedOrder.OrderCode,
          status: 'pending_verification',
        },
      });
    } catch (error) {
      console.error('Bank transfer upload error:', error);
      return ctx.internalServerError('Failed to upload payment proof');
    }
  },

  /**
   * POST /api/payment/bank-transfer/verify
   * Admin xác nhận thanh toán
   * 
   * Body:
   * {
   *   "orderId": "DH123456",
   *   "verified": true,
   *   "adminNote": "Đã nhận tiền"
   * }
   */
  async verifyPayment(ctx) {
    try {
      const { orderId, verified, adminNote } = ctx.request.body;

      if (!orderId || verified === undefined) {
        return ctx.badRequest('Missing required fields: orderId, verified');
      }

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderId },
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Update order status
      const newStatus = verified ? 'completed' : 'payment_failed';
      const newPaymentStatus = verified ? 'paid' : 'failed';

      const updatedOrder = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: {
          Status: newStatus,
          PaymentStatus: newPaymentStatus,
          AdminVerificationNote: adminNote || '',
          VerifiedAt: new Date().toISOString(),
        },
      });

      return ctx.send({
        success: true,
        message: verified ? 'Đơn hàng đã được xác nhận' : 'Đơn hàng bị từ chối',
        data: {
          orderId: updatedOrder.OrderCode,
          status: newStatus,
          paymentStatus: newPaymentStatus,
        },
      });
    } catch (error) {
      console.error('Bank transfer verification error:', error);
      return ctx.internalServerError('Failed to verify payment');
    }
  },

  /**
   * GET /api/payment/bank-transfer/bank-info
   * Lấy thông tin tài khoản ngân hàng để khách chuyển tiền
   */
  async getBankInfo(ctx) {
    // Thông tin tài khoản công ty (nên lưu trong settings hoặc config)
    const bankInfo = {
      banks: [
        {
          id: 'vcb',
          name: 'Vietcombank',
          accountNumber: '1234567890',
          accountName: 'CÔNG TY TNHH XE HƠI BANXEDIEN',
          branch: 'Chi nhánh Sài Gòn',
          logo: '/images/banks/vietcombank.png',
        },
        {
          id: 'tcb',
          name: 'Techcombank',
          accountNumber: '19036589999999',
          accountName: 'CÔNG TY TNHH XE HƠI BANXEDIEN',
          branch: 'Chi nhánh Hà Nội',
          logo: '/images/banks/techcombank.png',
        },
        {
          id: 'mbbank',
          name: 'MB Bank',
          accountNumber: '9876543210',
          accountName: 'CÔNG TY TNHH XE HƠI BANXEDIEN',
          branch: 'Chi nhánh Đà Nẵng',
          logo: '/images/banks/mbbank.png',
        },
      ],
      instructions: [
        'Chuyển khoản đúng số tiền được yêu cầu',
        'Nội dung chuyển khoản: Mã đơn hàng (VD: DH123456)',
        'Sau khi chuyển khoản, vui lòng chụp ảnh biên lai và upload',
        'Đơn hàng sẽ được xác nhận trong vòng 24h',
      ],
    };

    return ctx.send(bankInfo);
  },
};
