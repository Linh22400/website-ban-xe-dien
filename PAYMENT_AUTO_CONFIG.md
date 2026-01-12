# 🎉 Thanh Toán Tự Động Hoạt Động Ở Cả Local và Production

## ✅ Đã Hoàn Thành

Hệ thống thanh toán **MOMO**, **VNPAY**, và **Chuyển khoản ngân hàng** giờ đây tự động hoạt động ở cả môi trường local và production **KHÔNG CẦN SỬA CODE**.

## 🚀 Cách Hoạt Động

### Trước Đây (Phải sửa code mỗi lần):
```env
# Local
VNPAY_RETURN_URL=http://localhost:1337/api/payment/vnpay/return
MOMO_RETURN_URL=http://localhost:1337/api/payment/momo/return

# Production (phải đổi manually)
VNPAY_RETURN_URL=https://backend.com/api/payment/vnpay/return
MOMO_RETURN_URL=https://backend.com/api/payment/momo/return
```

### Bây Giờ (Tự động!):
```env
# Local - Để trống, tự động detect
BACKEND_URL=

# Production - Chỉ cần set 1 biến
BACKEND_URL=https://your-backend.com
```

**Return URLs và IPN URLs tự động được generate:**
- Local: `http://localhost:1337/api/payment/{gateway}/return`
- Production: `https://your-backend.com/api/payment/{gateway}/return`

## 📝 Hướng Dẫn Sử Dụng

### 1. Chạy Local (Development)

File `.env` hiện tại **ĐÃ SẴN SÀNG**, chỉ cần:

```bash
cd backend
npm run develop
```

✅ BACKEND_URL trống → Tự động dùng `http://localhost:1337`
✅ VNPAY/MOMO return URLs tự động: `http://localhost:1337/api/payment/.../return`

### 2. Deploy Production

**Bước 1: Cập nhật `.env` trên production server**

```env
# Backend URL - QUAN TRỌNG!
BACKEND_URL=https://your-backend-domain.com

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Client URLs
CLIENT_URL=https://your-frontend-domain.com

# Payment credentials (giữ nguyên hoặc dùng production credentials)
VNPAY_TMN_CODE=YOUR_CODE
VNPAY_HASH_SECRET=YOUR_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

MOMO_PARTNER_CODE=YOUR_CODE
MOMO_ACCESS_KEY=YOUR_KEY
MOMO_SECRET_KEY=YOUR_SECRET
MOMO_ENDPOINT=https://test-payment.momo.vn
```

**Bước 2: Deploy và chạy**

```bash
npm run build
npm start
```

✅ BACKEND_URL đã set → Dùng production domain
✅ Return URLs tự động: `https://your-backend.com/api/payment/.../return`

### 3. Test Trên Production

**Với Sandbox Credentials (khuyến nghị đầu tiên):**
- Giữ nguyên `VNPAY_URL=...sandbox...`
- Giữ nguyên `MOMO_ENDPOINT=...test-payment...`
- Test với thẻ test

**Khi Có Production Credentials:**
- Đổi `VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html`
- Đổi `MOMO_ENDPOINT=https://payment.momo.vn`
- Dùng thẻ thật

## 🔧 File Đã Được Chỉnh Sửa

### 1. `backend/.env`
```env
# Thêm biến BACKEND_URL (để trống cho local)
BACKEND_URL=

# Xóa các biến cũ (không cần nữa):
# VNPAY_RETURN_URL=...  ❌ Removed
# VNPAY_IPN_URL=...     ❌ Removed
# MOMO_RETURN_URL=...   ❌ Removed
# MOMO_IPN_URL=...      ❌ Removed
```

### 2. `backend/src/api/payment/controllers/vnpay.ts`
```typescript
// Trước:
const returnUrl = process.env.VNPAY_RETURN_URL;

// Sau (tự động):
const backendUrl = process.env.BACKEND_URL || `${ctx.request.protocol}://${ctx.request.host}`;
const returnUrl = `${backendUrl}/api/payment/vnpay/return`;
```

### 3. `backend/src/api/payment/controllers/momo.ts`
```typescript
// Trước:
const redirectUrl = process.env.MOMO_RETURN_URL;
const ipnUrl = process.env.MOMO_IPN_URL;

// Sau (tự động):
const backendUrl = process.env.BACKEND_URL || `${ctx.request.protocol}://${ctx.request.host}`;
const redirectUrl = `${backendUrl}/api/payment/momo/return`;
const ipnUrl = `${backendUrl}/api/payment/momo/ipn`;
```

## ✨ Lợi Ích

1. ✅ **Không cần sửa code** khi chuyển môi trường
2. ✅ **Tự động detect** local vs production
3. ✅ **1 file .env** cho cả 2 môi trường
4. ✅ **Dễ dàng test** trên nhiều domain khác nhau
5. ✅ **An toàn hơn** - không hardcode URLs

## 📋 Checklist Deployment

### Local Development
- [x] BACKEND_URL để trống
- [x] FRONTEND_URL=http://localhost:3000
- [x] Sandbox credentials
- [x] Test endpoints work

### Production
- [ ] Set BACKEND_URL=https://your-backend.com
- [ ] Set FRONTEND_URL=https://your-frontend.com
- [ ] Update CLIENT_URL với production domain
- [ ] Test với sandbox credentials trước
- [ ] Sau đó chuyển sang production credentials

## 🧪 Test Nhanh

### 1. Test Local
```bash
# Terminal 1: Backend
cd backend
npm run develop

# Terminal 2: Test API
curl -X POST http://localhost:1337/api/payment/vnpay/create \
  -H "Content-Type: application/json" \
  -d '{"orderCode":"TEST001","amount":100000,"orderInfo":"Test order"}'
```

Kết quả sẽ có return URL: `http://localhost:1337/api/payment/vnpay/return`

### 2. Test Production
```bash
# Sau khi deploy, test:
curl -X POST https://your-backend.com/api/payment/vnpay/create \
  -H "Content-Type: application/json" \
  -d '{"orderCode":"TEST001","amount":100000,"orderInfo":"Test order"}'
```

Kết quả sẽ có return URL: `https://your-backend.com/api/payment/vnpay/return`

## 🎯 Kết Luận

🎉 **HOÀN TOÀN TỰ ĐỘNG!**
- Chỉ cần set `BACKEND_URL` cho production
- Để trống cho local development
- Không cần sửa code khi deploy
- Hoạt động với VNPAY, MOMO, và mọi payment gateway khác

**Hệ thống giờ đây production-ready và developer-friendly! 🚀**
