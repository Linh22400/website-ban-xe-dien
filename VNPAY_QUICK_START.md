# Checklist Setup VNPay - Tóm tắt nhanh

## ✅ Bước 1: Đăng ký VNPay Sandbox (5 phút)

1. Truy cập: https://sandbox.vnpayment.vn/devreg/
2. Điền form:
   - Email: (email của bạn)
   - SĐT: (số điện thoại)
   - Website: xedienducduy.id.vn
   - Mô tả: Website bán xe điện
3. Check email → Nhận **TMN_CODE** và **HASH_SECRET**

---

## ✅ Bước 2: Cấu hình Backend (2 phút)

### 2.1 Thêm vào `.env` (backend):
```bash
# VNPay Sandbox
VNPAY_TMN_CODE=VNPAYxxxxxx  # Thay bằng code bạn nhận được
VNPAY_HASH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx  # Thay bằng secret bạn nhận được
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://website-ban-xe-dien.onrender.com/api/payment/vnpay/return
VNPAY_IPN_URL=https://website-ban-xe-dien.onrender.com/api/payment/vnpay/ipn
FRONTEND_URL=https://xedienducduy.id.vn
```

### 2.2 Restart backend:
```bash
cd backend
npm run develop
# hoặc nếu đã deploy: Render sẽ tự restart khi thêm env vars
```

---

## ✅ Bước 3: Test API (1 phút)

### Test endpoint tạo payment:
```bash
curl -X POST https://website-ban-xe-dien.onrender.com/api/payment/vnpay/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "TEST001",
    "amount": 100000,
    "orderInfo": "Test payment"
  }'
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "txnRef": "TEST001_1234567890",
    "amount": 100000
  }
}
```

---

## ✅ Bước 4: Cập nhật Frontend (15 phút)

### 4.1 Tạo file helper `lib/vnpay.ts`:
```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function createVNPayPayment(
  orderCode: string, 
  amount: number, 
  orderInfo: string
) {
  const response = await fetch(`${STRAPI_URL}/api/payment/vnpay/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderCode, amount, orderInfo }),
  });
  
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || 'Payment failed');
  return result.data;
}
```

### 4.2 Update `PaymentGatewaySelector.tsx`:

Tìm function `handlePlaceOrder`, thêm logic VNPay:

```typescript
// Sau khi tạo order thành công
if (selectedGateway === 'vnpay') {
  try {
    const vnpayPayment = await createVNPayPayment(
      result.data.OrderCode,
      depositAmount,
      `Thanh toan don hang ${result.data.OrderCode}`
    );
    
    // Redirect to VNPay payment page
    window.location.href = vnpayPayment.paymentUrl;
    return;
  } catch (error) {
    console.error('VNPay error:', error);
    setErrorMessage('Không thể tạo thanh toán. Vui lòng thử lại.');
  }
}
```

### 4.3 Bật VNPay trên production:

Trong `PaymentGatewaySelector.tsx`, xóa điều kiện `!isProduction`:

```typescript
// Thay vì:
{!isProduction && (
  <div>VNPay QR</div>
)}

// Đổi thành:
<div onClick={() => setSelectedGateway('vnpay')}>
  VNPay QR
</div>
```

---

## ✅ Bước 5: Test trên Sandbox (2 phút)

### Thẻ test VNPay:
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456
```

### Quy trình:
1. Tạo đơn hàng trên website
2. Chọn "VNPay QR"
3. Click "Thanh toán"
4. Redirect sang VNPay Sandbox
5. Chọn "Thanh toán qua thẻ ATM"
6. Nhập thông tin thẻ test
7. Nhập OTP: **123456**
8. Xác nhận → Redirect về `/order/success`

---

## 📋 Tóm tắt những gì đã có sẵn:

✅ **Backend code:**
- ✅ `backend/src/api/payment/controllers/vnpay.ts` - VNPay controller
- ✅ `backend/src/api/payment/routes/vnpay.ts` - VNPay routes
- ✅ `backend/src/api/payment/controllers/index.ts` - Export controllers
- ✅ `backend/src/api/payment/routes/index.ts` - Export routes

✅ **API Endpoints available:**
- `POST /api/payment/vnpay/create` - Tạo payment URL
- `GET /api/payment/vnpay/return` - Callback sau thanh toán
- `POST /api/payment/vnpay/ipn` - Webhook từ VNPay
- `GET /api/payment/vnpay/query` - Query transaction status

---

## ⚠️ Cần làm thêm:

1. **Import helper vào frontend** (lib/vnpay.ts)
2. **Update PaymentGatewaySelector.tsx** để gọi VNPay
3. **Tạo success/failed pages** (optional - có thể dùng trang hiện tại)
4. **Deploy và test** trên production

---

## 💡 Câu trả lời câu hỏi của bạn:

> Tôi chỉ cần đăng ký và lấy TMN_CODE, HASH_SECRET, cấu hình vào env là được đúng không?

**Trả lời:** 

✅ **Backend**: Đúng! Chỉ cần:
1. Đăng ký VNPay Sandbox
2. Lấy credentials (TMN_CODE, HASH_SECRET)
3. Thêm vào `.env` backend
4. Restart backend
→ **API endpoint đã hoạt động ngay!**

⚠️ **Frontend**: Còn thiếu vài bước nhỏ:
1. Tạo file `lib/vnpay.ts` (helper function)
2. Update `PaymentGatewaySelector.tsx` (gọi API VNPay)
3. Bật VNPay trên production (xóa check `!isProduction`)

**Tổng thời gian:** ~25 phút để hoàn thiện toàn bộ

---

## 🚀 Triển khai Production

Khi muốn chuyển sang Production VNPay (sau 2-3 tháng):

1. Đăng ký Production: https://vnpay.vn/dang-ky-merchant/
2. Đợi duyệt hồ sơ (3-5 ngày)
3. Nhận credentials mới
4. Update `.env`:
   ```bash
   VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
   VNPAY_TMN_CODE=<production_code>
   VNPAY_HASH_SECRET=<production_secret>
   ```
5. Deploy → Thanh toán thực!

---

## 📞 Support

Gặp vấn đề? Kiểm tra:
- ✅ `.env` đã có đủ biến chưa?
- ✅ Backend đã restart chưa?
- ✅ API endpoint `/api/payment/vnpay/create` có hoạt động không?
- ✅ Frontend đã import và gọi đúng function chưa?

**VNPay Sandbox Support:** https://sandbox.vnpayment.vn/apis/docs/
