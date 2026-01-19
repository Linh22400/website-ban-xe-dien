
/**
 * Email Templates for Order Notifications
 */

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getPaymentMethodLabel = (method: string) => {
    switch (method) {
        case 'full_payment': return 'Thanh toán toàn bộ';
        case 'deposit': return 'Đặt cọc';
        case 'installment': return 'Trả góp';
        default: return method;
    }
};

export const getGatewayLabel = (gateway: string) => {
    switch (gateway) {
        case 'payos': return 'Mã QR / Chuyển khoản (PayOS)';
        case 'vnpay': return 'VNPAY (Thẻ/QR)';
        case 'momo': return 'Ví MoMo';
        case 'bank_transfer': return 'Chuyển khoản ngân hàng thủ công';
        case 'cod': return 'Thanh toán khi nhận hàng (COD)';
        default: return gateway || 'Chưa chọn';
    }
};

export const generateOrderEmail = (order: any) => {
    const {
        OrderCode,
        CustomerInfo,
        VehicleModel,
        SelectedColor,
        SelectedBattery,
        TotalAmount,
        DepositAmount,
        RemainingAmount,
        PaymentMethod,
        PreferredGateway,
        createdAt,
        OrderItems
    } = order;

    const orderDate = new Date(createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const isDeposit = PaymentMethod === 'deposit';
    const isInstallment = PaymentMethod === 'installment';
    
    // Determine Payment Instructions based on Gateway
    let paymentInstructions = '';
    
    // If online payment (PayOS/VNPAY/MoMo), usually they are redirected. 
    // If they haven't paid yet (pending), remind them.
    if (['payos', 'vnpay', 'momo'].includes(PreferredGateway)) {
        paymentInstructions = `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #007bff;">
                <h3 style="margin-top: 0; color: #0056b3;">Thông tin thanh toán</h3>
                <p>Bạn đã chọn thanh toán qua <strong>${getGatewayLabel(PreferredGateway)}</strong>.</p>
                <p>Nếu bạn chưa hoàn tất thanh toán, vui lòng kiểm tra lại trình duyệt hoặc liên hệ CSKH để được hỗ trợ lại link thanh toán.</p>
            </div>
        `;
    } else if (PreferredGateway === 'bank_transfer') {
        paymentInstructions = `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
                <h3 style="margin-top: 0; color: #1e7e34;">Thông tin chuyển khoản</h3>
                <p>Vui lòng chuyển khoản theo thông tin sau:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Ngân hàng:</strong> MB Bank (Quân Đội)</li>
                    <li><strong>Số tài khoản:</strong> 9999999999</li>
                    <li><strong>Chủ tài khoản:</strong> CONG TY XE DIEN</li>
                    <li><strong>Nội dung CK:</strong> ${OrderCode}</li>
                    <li><strong>Số tiền:</strong> ${formatCurrency(isDeposit ? DepositAmount : TotalAmount)}</li>
                </ul>
            </div>
        `;
    } else {
         paymentInstructions = `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #6c757d;">
                <h3 style="margin-top: 0; color: #545b62;">Phương thức thanh toán</h3>
                <p>Bạn đã chọn: <strong>${getGatewayLabel(PreferredGateway)}</strong></p>
                <p>Nhân viên tư vấn sẽ liên hệ sớm nhất để hướng dẫn chi tiết.</p>
            </div>
        `;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng ${OrderCode}</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Xác Nhận Đơn Hàng</h1>
            <p style="margin: 5px 0 0; opacity: 0.8;">Cảm ơn bạn đã đặt hàng tại Website Bán Xe Điện</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <p>Xin chào <strong>${CustomerInfo.FullName}</strong>,</p>
            <p>Đơn hàng <strong>#${OrderCode}</strong> của bạn đã được tiếp nhận thành công vào lúc ${orderDate}.</p>

            <!-- Order Details -->
            <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px; font-size: 18px;">Chi tiết đơn hàng</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                ${OrderItems && OrderItems.length > 0 ? 
                    OrderItems.map((item: any) => {
                        const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url;
                        return `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px 0; width: 60px;">
                                ${imageUrl ? `<img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : ''}
                            </td>
                            <td style="padding: 10px 10px;">
                                <div style="font-weight: bold;">${item.name} <span style="font-weight: normal; color: #666;">x${item.quantity || 1}</span></div>
                                ${item.type === 'vehicle' ? `
                                <div style="font-size: 12px; color: #666;">
                                    Màu: ${item.colorName || 'Tiêu chuẩn'}
                                </div>` : ''}
                            </td>
                            <td style="padding: 10px 0; text-align: right; font-weight: bold;">
                                ${formatCurrency(item.price * (item.quantity || 1))}
                            </td>
                        </tr>
                    `;
                    }).join('')
                : `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px 0; width: 60px;">
                        ${VehicleModel?.thumbnail?.url ? `<img src="${VehicleModel.thumbnail.url}" alt="Product" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : ''}
                    </td>
                    <td style="padding: 10px 10px;">
                        <div style="font-weight: bold;">${VehicleModel?.name || 'Sản phẩm'}</div>
                        <div style="font-size: 12px; color: #666;">
                            Màu: ${SelectedColor || 'Tiêu chuẩn'} <br>
                            Pin: ${SelectedBattery || 'Tiêu chuẩn'}
                        </div>
                    </td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">
                        ${formatCurrency(order.BasePrice)}
                    </td>
                </tr>
                `}
            </table>

            <!-- Financials -->
            <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 15px;">
                <table style="width: 100%; font-size: 14px;">
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Giá niêm yết:</td>
                        <td style="text-align: right;">${formatCurrency(order.BasePrice)}</td>
                    </tr>
                    ${order.Discount > 0 ? `
                    <tr>
                        <td style="padding: 5px 0; color: #28a745;">Khuyến mãi:</td>
                        <td style="text-align: right; color: #28a745;">-${formatCurrency(order.Discount)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 5px 0; color: #666;">VAT (10%):</td>
                        <td style="text-align: right;">(Đã bao gồm)</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 16px;">
                        <td style="padding: 10px 0; border-top: 1px solid #eee;">Tổng cộng:</td>
                        <td style="text-align: right; border-top: 1px solid #eee; color: #d32f2f;">${formatCurrency(TotalAmount)}</td>
                    </tr>
                </table>

                ${(isDeposit || isInstallment) ? `
                <div style="background-color: #fff3cd; padding: 10px; border-radius: 4px; margin-top: 15px; font-size: 14px; border: 1px solid #ffeeba;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Số tiền cần đặt cọc/trả trước:</span>
                        <span style="font-weight: bold;">${formatCurrency(DepositAmount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Số tiền còn lại:</span>
                        <span style="font-weight: bold;">${formatCurrency(RemainingAmount)}</span>
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Payment Info -->
            ${paymentInstructions}

            <!-- Customer Info -->
            <div style="margin-top: 30px;">
                <h3 style="font-size: 16px; margin-bottom: 10px;">Thông tin nhận hàng</h3>
                <p style="margin: 5px 0; font-size: 14px;">
                    <strong>Người nhận:</strong> ${CustomerInfo.FullName}<br>
                    <strong>Số điện thoại:</strong> ${CustomerInfo.Phone}<br>
                    <strong>Địa chỉ:</strong> ${CustomerInfo.Address || 'Nhận tại showroom'}<br>
                    <strong>Email:</strong> ${CustomerInfo.Email || 'Không có'}<br>
                    ${order.Notes ? `<strong>Ghi chú:</strong> ${order.Notes}` : ''}
                </p>
            </div>

            <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ hotline: <strong>1900 xxxx</strong></p>
                <p>&copy; ${new Date().getFullYear()} Website Bán Xe Điện. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return {
        subject: `[${OrderCode}] Xác nhận đơn hàng thành công`,
        text: `Xin chào ${CustomerInfo.FullName}, đơn hàng #${OrderCode} của bạn đã được đặt thành công. Tổng tiền: ${formatCurrency(TotalAmount)}.`,
        html
    };
};
