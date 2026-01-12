# Production Payment Gateway Configuration Guide

## Tóm tắt

Hệ thống thanh toán MOMO và VNPAY **ĐÃ SẴN SÀNG** để test trên production với các điều kiện sau:

✅ **Đã hoàn thành:**
- Tất cả API endpoints sử dụng environment variables
- Không cần sửa code khi chuyển đổi giữa test/production
- Chỉ cần thay đổi biến môi trường trong file `.env`

## Cách Test Trên Production

### Option 1: Test Mode (Sandbox) - Khuyến nghị cho giai đoạn đầu

Giữ nguyên cấu hình hiện tại trong `.env`:

```bash
# VNPAY - Sandbox
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_TMN_CODE=DMCSD6GC
VNPAY_HASH_SECRET=5W5VKOXKY0BGVAM7TV1M8NP4G2XSF9R8
VNPAY_RETURN_URL=https://your-production-backend.com/api/payment/vnpay/return
VNPAY_IPN_URL=https://your-production-backend.com/api/payment/vnpay/ipn

# MOMO - Test
MOMO_ENDPOINT=https://test-payment.momo.vn
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_RETURN_URL=https://your-production-backend.com/api/payment/momo/return
MOMO_IPN_URL=https://your-production-backend.com/api/payment/momo/ipn

# Frontend
FRONTEND_URL=https://your-production-frontend.com
```

**Chỉ cần thay đổi:**
- `VNPAY_RETURN_URL` → URL backend production của bạn
- `VNPAY_IPN_URL` → URL backend production của bạn
- `MOMO_RETURN_URL` → URL backend production của bạn
- `MOMO_IPN_URL` → URL backend production của bạn
- `FRONTEND_URL` → URL frontend production của bạn

### Option 2: Production Mode - Khi đã có tài khoản merchant thật

#### VNPAY Production:

1. **Đăng ký merchant:** https://vnpay.vn/dang-ky-merchant
2. **Nhận credentials:** TMN_CODE và HASH_SECRET từ VNPay
3. **Cập nhật `.env`:**

```bash
# VNPAY - Production
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html  # Bỏ "sandbox"
VNPAY_TMN_CODE=<YOUR_PRODUCTION_TMN_CODE>
VNPAY_HASH_SECRET=<YOUR_PRODUCTION_HASH_SECRET>
VNPAY_RETURN_URL=https://your-production-backend.com/api/payment/vnpay/return
VNPAY_IPN_URL=https://your-production-backend.com/api/payment/vnpay/ipn
```

#### MOMO Production:

1. **Đăng ký merchant:** https://business.momo.vn/
2. **Nhận credentials:** PARTNER_CODE, ACCESS_KEY, SECRET_KEY
3. **Cập nhật `.env`:**

```bash
# MOMO - Production
MOMO_ENDPOINT=https://payment.momo.vn  # Bỏ "test-"
MOMO_PARTNER_CODE=<YOUR_PRODUCTION_PARTNER_CODE>
MOMO_ACCESS_KEY=<YOUR_PRODUCTION_ACCESS_KEY>
MOMO_SECRET_KEY=<YOUR_PRODUCTION_SECRET_KEY>
MOMO_RETURN_URL=https://your-production-backend.com/api/payment/momo/return
MOMO_IPN_URL=https://your-production-backend.com/api/payment/momo/ipn
```

## Checklist Để Test Trên Production

### Trước Khi Deploy:

- [ ] Đã có domain production (frontend + backend)
- [ ] Backend có HTTPS (bắt buộc cho IPN)
- [ ] Đã cập nhật `FRONTEND_URL` trong `.env`
- [ ] Đã cập nhật `CLIENT_URL` trong `.env` (thêm production domain)

### VNPAY:

- [ ] `VNPAY_RETURN_URL` trỏ đến production backend
- [ ] `VNPAY_IPN_URL` trỏ đến production backend với HTTPS
- [ ] `VNPAY_TMN_CODE` và `VNPAY_HASH_SECRET` đã điền đúng
- [ ] `VNPAY_URL` đúng (sandbox hoặc production tùy chế độ)

### MOMO:

- [ ] `MOMO_RETURN_URL` trỏ đến production backend
- [ ] `MOMO_IPN_URL` trỏ đến production backend với HTTPS
- [ ] `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY` đã điền đúng
- [ ] `MOMO_ENDPOINT` đúng (test hoặc production tùy chế độ)

### Sau Khi Deploy:

- [ ] Test tạo đơn hàng và thanh toán
- [ ] Kiểm tra redirect về frontend sau khi thanh toán
- [ ] Xem logs backend để đảm bảo IPN callback hoạt động
- [ ] Test với số thẻ test (nếu dùng sandbox)
- [ ] Kiểm tra order status được cập nhật đúng

## Test Cards (Sandbox Mode)

### VNPAY Sandbox:
- Số thẻ: `9704198526191432198`
- Tên: `NGUYEN VAN A`
- Ngày hết hạn: `07/15`
- OTP: `123456`

### MOMO Sandbox:
- Số điện thoại: Bất kỳ
- Mã OTP: `111111`

## Lưu Ý Quan Trọng

### 1. HTTPS là bắt buộc
IPN URLs phải là HTTPS khi production. Nếu backend chưa có SSL, sẽ không nhận được callback từ payment gateway.

### 2. Không cần sửa code
Tất cả endpoints đã sử dụng `process.env.*`, chỉ cần thay đổi `.env` file.

### 3. Chuyển đổi dễ dàng
Để chuyển từ test sang production:
```bash
# VNPAY
VNPAY_URL=https://sandbox.vnpayment.vn/...  # Test
VNPAY_URL=https://vnpayment.vn/...          # Production

# MOMO
MOMO_ENDPOINT=https://test-payment.momo.vn  # Test
MOMO_ENDPOINT=https://payment.momo.vn       # Production
```

### 4. Testing Strategy
1. **Local:** Test với localhost URLs
2. **Staging:** Test với staging domain + sandbox credentials
3. **Production:** 
   - Giai đoạn đầu: Production domain + sandbox credentials
   - Sau khi hoàn thiện: Production domain + production credentials

## Troubleshooting

### Lỗi: "Invalid signature" hoặc "97"
- Kiểm tra `VNPAY_HASH_SECRET` hoặc `MOMO_SECRET_KEY` có đúng không
- Đảm bảo không có space hoặc ký tự thừa trong secret

### Lỗi: Không nhận được IPN callback
- Kiểm tra `*_IPN_URL` có HTTPS không
- Kiểm tra firewall/security group có chặn request không
- Xem logs của payment gateway (nếu có dashboard)

### Lỗi: Redirect về frontend bị sai
- Kiểm tra `FRONTEND_URL` trong backend `.env`
- Đảm bảo frontend có route `/order/success?orderId=...`

## Kết Luận

✅ **Hệ thống ĐÃ SẴN SÀNG để test trên production**
✅ **KHÔNG CẦN sửa code**
✅ **Chỉ cần cập nhật file `.env` với production URLs và credentials**

Để bắt đầu test, chỉ cần:
1. Deploy backend lên production
2. Cập nhật URLs trong `.env` trên server production
3. Test thanh toán với test credentials (sandbox mode)
4. Sau khi ổn định, apply merchant account và chuyển sang production credentials
