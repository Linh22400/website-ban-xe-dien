# Test VNPay Integration - Quick Guide

## ✅ Đã hoàn thành

### Backend Setup
- ✅ VNPay controller tại `backend/src/api/payment/controllers/vnpay.ts`
- ✅ API routes tại `backend/src/api/payment/routes/vnpay.ts`
- ✅ Environment variables đã cấu hình trong `backend/.env`

### Frontend Setup
- ✅ VNPay helper tại `frontend/lib/vnpay.ts`
- ✅ PaymentGatewaySelector updated để redirect sang VNPay
- ✅ Success page tại `frontend/app/order/success/page.tsx`
- ✅ Failed page tại `frontend/app/checkout/payment-failed/page.tsx`

## 🧪 Cách Test VNPay

### 1. Kiểm tra Backend Environment

Đảm bảo `backend/.env` có đầy đủ:

```bash
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:1337/api/payment/vnpay/return
FRONTEND_URL=http://localhost:3000
```

### 2. Khởi động Backend và Frontend

```bash
# Terminal 1 - Backend
cd backend
npm run develop

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 3. Test Payment Flow

1. **Vào trang checkout:**
   - Truy cập http://localhost:3000/checkout
   - Thêm sản phẩm vào giỏ hàng nếu chưa có
   - Điền thông tin khách hàng

2. **Chọn VNPay:**
   - Ở bước chọn phương thức thanh toán
   - Chọn "VNPay QR" (giờ đã hiển thị luôn, không còn ẩn)
   - Click "Đặt hàng"

3. **Redirect sang VNPay:**
   - Trang sẽ tự động redirect sang VNPay sandbox
   - URL sẽ có dạng: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...`

4. **Thanh toán trên VNPay Sandbox:**
   
   **Thẻ test VNPay (Sandbox):**
   ```
   Số thẻ: 9704198526191432198
   Tên chủ thẻ: NGUYEN VAN A
   Ngày phát hành: 07/15
   Mật khẩu OTP: 123456
   ```
   
   Hoặc test các trường hợp khác:
   - **Thành công:** Số thẻ có prefix `9704`
   - **Không đủ tiền:** Số thẻ có prefix `9705`
   - **Lỗi khác:** Số thẻ có prefix `9706`

5. **Callback xử lý:**
   - Sau khi thanh toán, VNPay sẽ callback về backend
   - Backend sẽ xác minh chữ ký và cập nhật trạng thái đơn hàng
   - Redirect về:
     - **Thành công:** `/order/success?orderId=...`
     - **Thất bại:** `/checkout/payment-failed?orderId=...&code=...`

## 📝 Check Backend Logs

Khi test, xem logs trong terminal backend để debug:

```
# Logs khi tạo payment URL
VNPay Payment URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...

# Logs khi callback
Payment successful for order ORD-xxx
# hoặc
Payment failed for order ORD-xxx, code: 24
```

## 🔍 Debug Checklist

Nếu có lỗi, kiểm tra:

- [ ] Backend đang chạy ở port 1337
- [ ] Frontend đang chạy ở port 3000
- [ ] `.env` có đủ VNPAY_TMN_CODE và VNPAY_HASH_SECRET
- [ ] VNPAY_RETURN_URL đúng (backend URL + /api/payment/vnpay/return)
- [ ] FRONTEND_URL đúng
- [ ] Browser console không có lỗi
- [ ] Backend logs có hiển thị payment URL

## 📊 Xem Transaction Trong Strapi

1. Vào Strapi admin: http://localhost:1337/admin
2. Vào "Content Manager" > "Payment Transaction"
3. Kiểm tra transaction vừa tạo có:
   - Gateway: vnpay
   - Status: success hoặc failed
   - Gateway Response có đầy đủ thông tin

## 🚀 Deploy to Production

Khi deploy production:

1. **Đăng ký VNPay Production:**
   - Truy cập: https://vnpay.vn/dang-ky/
   - Chọn gói phù hợp (có phí)
   - Nhận TMN_CODE và HASH_SECRET production

2. **Update Environment Variables:**
   ```bash
   VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html  # Không có sandbox
   VNPAY_RETURN_URL=https://your-backend.com/api/payment/vnpay/return
   FRONTEND_URL=https://your-frontend.com
   ```

3. **Test trên môi trường thật:**
   - Sử dụng thẻ thật
   - Test các trường hợp: thành công, không đủ tiền, hủy giao dịch

## ⚠️ Lưu ý VNPay Sandbox

**VNPay đã thay đổi URL đăng ký sandbox:**
- ~~Old: https://sandbox.vnpayment.vn/devreg/~~ (deprecated)
- **New:** Liên hệ trực tiếp với VNPay để được cấp sandbox credentials

Nếu chưa có sandbox credentials:
1. Email: support@vnpay.vn
2. Hotline: 1900 5555 88
3. Yêu cầu: sandbox account để test integration

## 🎯 Expected Behavior

**VNPay Flow:**
```
User clicks "Đặt hàng" 
  → Frontend calls backend API /api/payment/vnpay/create
  → Backend generates VNPay URL with signature
  → Frontend redirects to VNPay page
  → User enters card info on VNPay
  → VNPay processes payment
  → VNPay redirects back to backend /api/payment/vnpay/return
  → Backend verifies signature & updates order
  → Backend redirects to frontend success/failed page
```

**COD/Bank Transfer Flow (không đổi):**
```
User clicks "Đặt hàng"
  → Frontend creates order
  → Shows confirmation (step 7)
```

## 📚 Related Files

- Backend Controller: `backend/src/api/payment/controllers/vnpay.ts`
- Frontend Helper: `frontend/lib/vnpay.ts`
- Payment Selector: `frontend/components/checkout/PaymentGatewaySelector.tsx`
- Success Page: `frontend/app/order/success/page.tsx`
- Failed Page: `frontend/app/checkout/payment-failed/page.tsx`

## 🐛 Common Issues

### Issue: "VNPay URL không được tạo"
- Check backend logs xem có lỗi gì
- Verify VNPAY_TMN_CODE và VNPAY_HASH_SECRET

### Issue: "Redirect về nhưng order không update"
- Check backend logs xem callback có đến không
- Verify chữ ký (vnp_SecureHash) đúng không

### Issue: "VNPay báo lỗi invalid signature"
- VNPAY_HASH_SECRET sai
- Hoặc parameters không sort đúng thứ tự

### Issue: "Không redirect được"
- Check CORS settings trong backend
- Verify FRONTEND_URL đúng
