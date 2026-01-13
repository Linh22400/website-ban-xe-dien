# Environment Configuration Guide

## Auto Environment Detection

### ✅ **Đã cấu hình tự động detect môi trường!**

Không cần sửa code khi chuyển đổi giữa local và production.

---

## Backend (Strapi)

**VNPay Return URL** tự động detect từ:
1. **Request Origin** header (ưu tiên cao nhất)
2. **FRONTEND_URL** trong .env
3. Fallback: `http://localhost:3000`

### Test Scenarios:

#### 🏠 **Test Local Full Stack**
```powershell
# Backend
cd backend
npm run develop

# Frontend (terminal mới)
cd frontend
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:1337
- VNPay redirect về: http://localhost:3000/checkout/vnpay-return ✅

#### 🌐 **Test Frontend Production + Backend Local**
```powershell
# Backend local
cd backend
npm run develop
```
- Frontend: https://www.xedienducduy.id.vn (production)
- Backend: http://localhost:1337 (local)
- VNPay redirect về: https://www.xedienducduy.id.vn/checkout/vnpay-return ✅

#### 🚀 **Production**
- Cả frontend và backend đều production
- Auto detect từ request origin
- VNPay redirect về production URL ✅

---

## Frontend (Next.js)

**Strapi API URL** tự động detect:
1. **NEXT_PUBLIC_STRAPI_URL** nếu có set
2. **NODE_ENV === 'development'** → `http://localhost:1337`
3. Production → `https://website-ban-xe-dien.onrender.com`

### Override API URL (Optional):

Create `.env.local` (local only, not committed):
```env
# Test với production API
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com

# Hoặc test với local API
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## CORS Configuration

Backend `.env` đã có CLIENT_URL với multiple domains:
```env
CLIENT_URL=http://localhost:3000,https://website-ban-xe-dien.vercel.app,https://xedienducduy.id.vn,https://www.xedienducduy.id.vn
```

✅ Cho phép request từ tất cả môi trường

---

## Test VNPay Flow:

### Scenario 1: Local Development
```powershell
# Terminal 1 - Backend
cd D:\website(banxedien)\backend
npm run develop

# Terminal 2 - Frontend  
cd D:\website(banxedien)\frontend
npm run dev
```

1. Mở http://localhost:3000
2. Thêm sản phẩm vào giỏ
3. Checkout → Chọn VNPay
4. VNPay redirect về http://localhost:3000/checkout/vnpay-return
5. ✅ Success!

### Scenario 2: Hybrid (Production Frontend + Local Backend)
```powershell
# Chỉ chạy backend local
cd D:\website(banxedien)\backend
npm run develop
```

1. Mở https://www.xedienducduy.id.vn
2. Frontend production sẽ gọi API về backend local
3. VNPay redirect về production URL
4. ✅ Success!

### Scenario 3: Full Production
- Deploy code lên production
- Auto detect tất cả URL
- ✅ Success!

---

## Debug Logging

### Backend Console:
```
Detected Frontend URL: http://localhost:3000
Request Origin: http://localhost:3000
```

### Check Return URL:
```
Return URL: http://localhost:3000/checkout/vnpay-return
```

---

## Không cần làm gì thêm!

✅ Code đã tự động adapt theo môi trường
✅ Chỉ cần start backend/frontend tương ứng
✅ VNPay tự động redirect đúng URL
