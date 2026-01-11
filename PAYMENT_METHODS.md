# Payment Integration Guide

## Các phương thức thanh toán đã tích hợp

Website banxedien.vn hiện hỗ trợ **5 phương thức thanh toán**:

### 1. **MoMo Wallet** 💰
- **Loại:** E-Wallet
- **Phí:** ~2-3% (Sandbox miễn phí test)
- **Trạng thái:** ✅ Hoạt động (Test credentials)
- **Đặc điểm:**
  - Thanh toán qua ví điện tử MoMo
  - Quét QR code hoặc nhập OTP
  - Test endpoint: https://test-payment.momo.vn
  - Credentials: Từ MoMo GitHub (momo-wallet/payment)

### 2. **VNPay QR** 💳
- **Loại:** Payment Gateway
- **Phí:** ~1.5-2.5%
- **Trạng thái:** ⏳ Chờ duyệt (Sandbox account)
- **Đặc điểm:**
  - Thanh toán qua QR code
  - Hỗ trợ tất cả ngân hàng nội địa
  - Cần tài khoản doanh nghiệp
  - Thời gian duyệt: 2-3 ngày làm việc

### 3. **Bank Transfer (Chuyển khoản)** 🏦
- **Loại:** Manual Transfer
- **Phí:** 100% MIỄN PHÍ ✅
- **Trạng thái:** ✅ Hoạt động
- **Đặc điểm:**
  - Khách chuyển khoản theo thông tin TK công ty
  - Upload ảnh chứng từ
  - Admin xác nhận thủ công
  - Phù hợp với xe hơi (giá trị cao)

**Ngân hàng hỗ trợ:**
- Vietcombank
- Techcombank
- MB Bank

### 4. **COD (Cash on Delivery)** 💵
- **Loại:** Cash Payment
- **Phí:** 100% MIỄN PHÍ ✅
- **Trạng thái:** ✅ Hoạt động
- **Đặc điểm:**
  - Thanh toán khi nhận xe
  - Tiền mặt hoặc quẹt thẻ tại showroom
  - Không cần xác nhận trước
  - Phù hợp khách hàng địa phương

### 5. **Deposit (Đặt cọc)** 📝
- **Loại:** Partial Payment
- **Phí:** Tùy phương thức thanh toán cọc
- **Trạng thái:** ✅ Hoạt động
- **Đặc điểm:**
  - Cọc 10-30% giá trị xe
  - Có thể dùng MoMo/VNPay/Bank Transfer
  - Còn lại thanh toán khi nhận xe
  - Giữ chỗ xe cho khách

---

## So sánh phương thức thanh toán

| Phương thức | Phí giao dịch | Thời gian xác nhận | Phù hợp với |
|------------|---------------|-------------------|-------------|
| **MoMo** | ~2-3% | Tức thì | Khách dùng ví MoMo |
| **VNPay** | ~1.5-2.5% | Tức thì | Khách có ngân hàng |
| **Bank Transfer** | MIỄN PHÍ | 1-24 giờ | Mọi khách hàng |
| **COD** | MIỄN PHÍ | Khi nhận xe | Khách địa phương |
| **Deposit** | Theo PT thanh toán | Tức thì/1-24h | Khách đặt cọc |

---

## Quy trình thanh toán

### MoMo / VNPay
1. Khách chọn xe → Checkout
2. Chọn MoMo/VNPay
3. Redirect sang trang thanh toán
4. Quét QR hoặc nhập OTP
5. Thanh toán thành công → Redirect về website
6. Đơn hàng tự động cập nhật "Đã thanh toán"

### Bank Transfer
1. Khách chọn xe → Checkout
2. Chọn "Chuyển khoản ngân hàng"
3. Hiển thị thông tin TK + Copy nhanh
4. Khách chuyển khoản
5. Upload ảnh chứng từ
6. Admin xác nhận → Đơn hàng "Đã thanh toán"

### COD
1. Khách chọn xe → Checkout
2. Chọn "Thanh toán khi nhận xe"
3. Xác nhận đơn hàng
4. Đến showroom → Thanh toán
5. Nhận xe

---

## Tự động hóa thanh toán

### Hiện tại (Manual)
- **Bank Transfer:** Admin xác nhận thủ công
- **COD:** Xác nhận tại showroom
- **Chi phí:** MIỄN PHÍ

### Nâng cao (API Integration)
Nếu muốn tự động 100% nhận diện chuyển khoản:

#### Option 1: Bank API (Có phí)
**Ngân hàng hỗ trợ:**
- **VCB (Vietcombank):** 500k-1tr/tháng
- **TPBank:** 800k-2tr/tháng
- **VietinBank:** 1-2tr/tháng

**Cách hoạt động:**
- API webhook → Backend nhận notification real-time
- Tự động match số tiền + nội dung chuyển khoản
- Auto xác nhận đơn hàng

**Yêu cầu:**
- Tài khoản doanh nghiệp
- Hợp đồng với ngân hàng
- GPKD, giấy tờ pháp lý

#### Option 2: Third-party (Casso, Sepay)
**Dịch vụ:**
- **Casso.vn:** 200k-500k/tháng
- **Sepay.vn:** 150k-400k/tháng

**Ưu điểm:**
- Dễ tích hợp, không cần hợp đồng ngân hàng
- Hỗ trợ nhiều ngân hàng
- API đơn giản

**Nhược điểm:**
- Vẫn có phí hàng tháng
- Phụ thuộc bên thứ 3

---

## Khuyến nghị

### Giai đoạn hiện tại (Startup/Test)
✅ **Sử dụng phương thức MIỄN PHÍ:**
1. **Bank Transfer + Manual verification**
2. **COD** (nếu có showroom)
3. **MoMo/VNPay Test** (để test chức năng)

### Khi có doanh thu ổn định
✅ **Nâng cấp lên Auto:**
1. Đăng ký Bank API (VCB, TPBank)
2. Hoặc dùng Casso/Sepay
3. Giữ lại COD cho khách hàng địa phương

---

## File cấu hình

### Backend (.env)
```bash
# MoMo (Test)
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn

# VNPay (Sandbox)
VNPAY_TMN_CODE=DMCSD6GC
VNPAY_HASH_SECRET=5W5VKOXKY0BGVAM7TV1M8NP4G2XSF9R8
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## API Endpoints

### MoMo
- `POST /api/payment/momo/create` - Tạo payment
- `GET /api/payment/momo/return` - Callback
- `POST /api/payment/momo/ipn` - Webhook
- `GET /api/payment/momo/test-success` - Test endpoint

### VNPay
- `POST /api/payment/vnpay/create` - Tạo payment
- `GET /api/payment/vnpay/return` - Callback
- `POST /api/payment/vnpay/ipn` - Webhook

### Bank Transfer
- `GET /api/payment/bank-transfer/bank-info` - Lấy thông tin TK
- `POST /api/payment/bank-transfer/upload-proof` - Upload chứng từ
- `POST /api/payment/bank-transfer/verify` - Admin xác nhận

---

## Troubleshooting

### MoMo: "Mã không tồn tại"
- QR code chỉ hoạt động với MoMo Sandbox App
- Dùng test endpoint: `/api/payment/momo/test-success?orderId=XXX`

### VNPay: "Website chưa được phê duyệt"
- Liên hệ VNPay: support@vnpay.vn
- Hotline: 1900 5555 88
- Thời gian duyệt: 2-3 ngày

### Bank Transfer: Upload failed
- Check file size (max 5MB)
- Format: PNG, JPG, JPEG
- Restart backend nếu lỗi

---

## Contact Support

- **VNPay:** support@vnpay.vn | 1900 5555 88
- **MoMo:** business@momo.vn | 1900 54 54 41
- **Bank API:** Liên hệ chi nhánh ngân hàng

---

**Last updated:** January 11, 2026
