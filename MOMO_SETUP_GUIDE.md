# MoMo Integration Guide

## 🚀 Quick Setup

### 1. Đăng ký MoMo Developer Account

1. **Truy cập:** https://developers.momo.vn/
2. **Đăng ký tài khoản** với email
3. **Chọn "Test Environment"** (sandbox miễn phí)
4. **Lấy credentials:**
   - Partner Code
   - Access Key
   - Secret Key

### 2. Cấu hình Backend

Thêm vào `backend/.env`:

```bash
# MoMo Configuration (Sandbox)
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE_HERE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY_HERE
MOMO_SECRET_KEY=YOUR_SECRET_KEY_HERE
MOMO_ENDPOINT=https://test-payment.momo.vn
MOMO_RETURN_URL=http://localhost:1337/api/payment/momo/return
MOMO_IPN_URL=http://localhost:1337/api/payment/momo/ipn
```

### 3. Test với MoMo Sandbox App

1. **Tải MoMo Sandbox App:**
   - Android: Tìm "MoMo Developer" trên Play Store
   - iOS: TestFlight link từ MoMo Developer

2. **Test account:** MoMo sẽ cung cấp test account trong email

3. **Test flow:**
   - Vào checkout
   - Chọn MoMo
   - Scan QR hoặc nhập số điện thoại test
   - Xác nhận thanh toán

## 📝 API Endpoints

Backend đã tạo:
- `POST /api/payment/momo/create` - Tạo payment URL
- `GET /api/payment/momo/return` - Callback từ MoMo
- `POST /api/payment/momo/ipn` - Webhook từ MoMo

## 🎯 Payment Flow

```
User chọn MoMo
  → Frontend gọi /api/payment/momo/create
  → Backend tạo request với signature
  → MoMo API trả về payment URL
  → Frontend redirect user sang MoMo
  → User thanh toán trên MoMo app/web
  → MoMo redirect về /api/payment/momo/return
  → Backend xác minh signature
  → Update order status
  → Redirect về success/failed page
```

## ✅ Test Credentials

MoMo sẽ gửi email với test credentials như:

```
Partner Code: MOMOXXX
Access Key: xxxxxxxx
Secret Key: xxxxxxxx
Test Phone: 0399999999
Test OTP: 123456
```

## 🔧 Troubleshooting

### "Invalid signature"
- Check SECRET_KEY đúng chưa
- Verify rawSignature format đúng thứ tự parameters

### "Partner not found"
- PARTNER_CODE sai hoặc chưa được kích hoạt
- Đảm bảo đang dùng test endpoint

### "Transaction failed"
- Test account chưa đủ tiền (nạp thêm trong sandbox)
- OTP sai (dùng 123456 cho sandbox)

## 📚 Documentation

- Official docs: https://developers.momo.vn/v3/
- API Reference: https://developers.momo.vn/v3/docs/payment/api/payment-api/
- Test app: https://developers.momo.vn/v3/docs/payment/test/
