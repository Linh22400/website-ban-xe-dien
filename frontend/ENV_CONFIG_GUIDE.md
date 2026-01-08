# ⚙️ Hướng Dẫn Cấu Hình Environment Variables

## 📁 Các File Môi Trường

### `.env.local` - Local Development (Đang dùng)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### `.env.production` - Production Build
```env
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
```

---

## 🔄 Chuyển Đổi Giữa Local và Production

### Cách 1: Sửa File `.env.local`

**Để test LOCAL (Strapi chạy ở localhost:1337):**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Để test PRODUCTION API:**
```env
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
```

### Cách 2: Dùng 2 File Riêng (Khuyến nghị)

**Tạo file `.env.development` cho local:**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Tạo file `.env.production` cho production:**
```env
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
```

Next.js sẽ tự động chọn đúng file khi chạy:
- `npm run dev` → dùng `.env.development`
- `npm run build` → dùng `.env.production`

---

## 🚀 Commands Để Chạy

### Local Development (với local Strapi):
```powershell
# Terminal 1: Chạy Strapi
cd backend
npm run develop

# Terminal 2: Chạy Frontend
cd frontend
npm run dev
```

### Test với Production API:
```powershell
# Chỉ cần sửa .env.local thành production URL
cd frontend
npm run dev
```

---

## ✅ Checklist Để Local Hoạt Động

- [ ] Strapi đang chạy ở `http://localhost:1337`
- [ ] File `frontend/.env.local` có `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
- [ ] Đã enable Public permissions trong Strapi Admin
- [ ] Test API: `http://localhost:1337/api/car-models?populate=*`
- [ ] Frontend có thể fetch data

---

## 🔍 Test API Connection

### Test từ PowerShell:
```powershell
# Test local Strapi
Invoke-RestMethod -Uri "http://localhost:1337/api/car-models?populate=*" -Method Get

# Test production Strapi
Invoke-RestMethod -Uri "https://website-ban-xe-dien.onrender.com/api/car-models?populate=*" -Method Get
```

### Test từ Browser Console:
```javascript
// Test local
fetch('http://localhost:1337/api/car-models?populate=*')
  .then(r => r.json())
  .then(console.log)

// Test production
fetch('https://website-ban-xe-dien.onrender.com/api/car-models?populate=*')
  .then(r => r.json())
  .then(console.log)
```

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch" hoặc CORS error
**Nguyên nhân:** Strapi chưa chạy hoặc CORS chưa cấu hình

**Giải pháp:**
1. Kiểm tra Strapi đang chạy: `http://localhost:1337/admin`
2. Xem file `backend/config/middlewares.ts` đã có origin `http://localhost:3000`

### Lỗi: "403 Forbidden"
**Nguyên nhân:** Chưa enable permissions

**Giải pháp:**
Vào Strapi Admin → Settings → Roles → Public → Enable find/findOne cho các collections

### Data không hiển thị
**Nguyên nhân:** Content chưa publish hoặc chưa có data

**Giải pháp:**
1. Vào Content Manager
2. Kiểm tra content đã được **Publish** (không còn Draft)
3. Chạy lại script import nếu cần

---

## 📝 File Priority (Next.js)

Next.js load environment variables theo thứ tự:
1. `.env.local` (ưu tiên cao nhất, không commit)
2. `.env.development` hoặc `.env.production` (tùy NODE_ENV)
3. `.env` (default cho tất cả)

**Khuyến nghị:** Dùng `.env.local` cho local development
