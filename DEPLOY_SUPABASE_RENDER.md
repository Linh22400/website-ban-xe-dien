# 🚀 HƯỚNG DẪN DEPLOY STRAPI LÊN RENDER VỚI SUPABASE

## ✅ Checklist Trước Khi Deploy

- [ ] Đã tạo Supabase project
- [ ] Đã lấy được DATABASE_URL từ Supabase
- [ ] Đã test connect local với Supabase
- [ ] Đã có tài khoản Render

---

## 📝 BƯỚC 1: Setup Supabase

### 1.1. Tạo Project
1. Vào https://supabase.com
2. New Project → Điền:
   - **Name**: banxedien
   - **Password**: [TẠO PASSWORD MẠNH - LƯU LẠI]
   - **Region**: Singapore
3. Chờ 2-3 phút

### 1.2. Lấy Connection String
1. Settings → Database → Connection string → **"Transaction"** mode
2. Copy chuỗi dạng:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
3. Thay `[YOUR-PASSWORD]` bằng password đã tạo

⚠️ **QUAN TRỌNG**: Phải dùng **Transaction mode** (port 6543), KHÔNG dùng Session mode (port 5432) vì Render có giới hạn connections.

**Hoặc thêm pooling vào URL thông thường:**
```
postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### 1.3. Test Local với Supabase
```bash
cd backend

# Tạo file .env.local (test)
cp .env .env.local

# Sửa .env.local:
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Test chạy
npm run develop
```

Nếu Strapi khởi động OK → Connection thành công! ✅

---

## 📝 BƯỚC 2: Deploy Backend lên Render

### 2.1. Tạo Web Service trên Render

1. Vào https://render.com → Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect Git repository (GitHub/GitLab):
   - Repository: `your-repo/website(banxedien)`
   - Branch: `main`

### 2.2. Cấu hình Build

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm run start
```

**Environment:**
- Node

**Root Directory:**
- `backend` (hoặc để trống nếu muốn)

### 2.3. Thêm Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Copy từ file `.env` local:

```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

APP_KEYS=9pi1i8hGwAOImKo0aKc2gw==,bM2XzVgx6JCm5VKaFIcUPA==,43+Jgt8i5X96BzeHGFMYqQ==,3NokKjlnzX2+GmB6wyEPdQ==
API_TOKEN_SALT=24trgeqWhgJ6F2wIG2ilWw==
ADMIN_JWT_SECRET=xmq+NIZLi3xQ2RXZkJU/Ig==
TRANSFER_TOKEN_SALT=UgaVdD7J5YZqhIknGUkdfA==
ENCRYPTION_KEY=//DkBePHbfO0hWFYza+9rQ==
JWT_SECRET=8fuUTvOyOrM7qaCrqwgr5A==

DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=5

CLOUDINARY_NAME=divcyhzdk
CLOUDINARY_KEY=727885263212775
CLOUDINARY_SECRET=mqpUm5r4QzhLfF-g__4_JrfPw9w

CLIENT_URL=https://your-frontend-domain.vercel.app
```

⚠️ **QUAN TRỌNG**: 
- Thay `DATABASE_URL` bằng **Transaction pooling URL** từ Supabase (port 6543)
- KHÔNG dùng direct connection (port 5432) trên production
- Thay `CLIENT_URL` bằng domain frontend của bạn

### 2.4. Deploy

1. Click **"Create Web Service"**
2. Chờ build (5-10 phút)
3. Check logs xem có lỗi không

---

## 📝 BƯỚC 3: Migrate Data

### Option 1: Tạo Mới Qua Admin UI (Khuyên dùng)

1. Truy cập: `https://your-backend.onrender.com/admin`
2. Tạo admin account
3. Thêm data thủ công qua Content Manager

### Option 2: Import từ Local (Nâng cao)

```bash
# Export từ local SQLite
cd backend
npm run strapi export -- --file backup

# Chuyển sang Postgres + Supabase
# Update .env với DATABASE_URL Supabase
npm run develop

# Import data
npm run strapi import -- --file backup.tar.gz
```

---

## 📝 BƯỚC 4: Kết Nối Frontend

Update frontend `.env.production`:

```
NEXT_PUBLIC_STRAPI_URL=https://your-backend.onrender.com
```

Deploy frontend lên Vercel:
```bash
cd frontend
vercel --prod
```

---

## 🔧 Troubleshooting

### Lỗi: "Connection timeout" hoặc "ENETUNREACH"
- ✅ **PHẢI dùng Transaction pooling URL** (port 6543), không dùng port 5432
- ✅ Vào Supabase → Settings → Database → Connection string → **Transaction mode**
- ✅ Check DATABASE_SSL=true
- ✅ Check DATABASE_SSL_REJECT_UNAUTHORIZED=false
- ✅ Set DATABASE_POOL_MAX=5 (giảm xuống nếu vẫn lỗi)

**Lấy đúng URL:**
```
Settings → Database → Connection string → Chọn "Transaction" (port 6543)
```

### Lỗi: "Too many connections"
- Supabase free tier giới hạn connections
- Đảm bảo dùng Transaction pooling mode
- Giảm DATABASE_POOL_MAX=2
- Thêm `?pgbouncer=true` vào connection string

### Lỗi: "Module not found"
- Check `cd backend` trong build command
- Check dependencies trong package.json

### Backend chạy nhưng không truy cập được
- Check PORT=1337
- Check Render expose port đúng

---

## ✅ Kiểm Tra Deploy Thành Công

1. Backend health: `https://your-backend.onrender.com/_health`
2. Admin login: `https://your-backend.onrender.com/admin`
3. API test: `https://your-backend.onrender.com/api/car-models`
4. Frontend connect: Check homepage load được data

---

## 💡 Tips

1. **Free tier Render**: Service sẽ sleep sau 15 phút không dùng
   - First request sau sleep sẽ chậm (~30s)
   - Dùng cron job ping mỗi 10 phút để keep alive

2. **Supabase Free Tier**:
   - 500 MB storage
   - Pause sau 7 ngày không active
   - Keep alive bằng cách access thường xuyên

3. **Cloudinary**: Đã setup sẵn, không cần thay đổi

4. **Logs**: 
   - Render logs: Dashboard → Service → Logs
   - Supabase logs: Dashboard → Logs

---

## 📞 Support

Nếu gặp lỗi, check:
1. Render build logs
2. Supabase connection string
3. Environment variables spelling
4. Database SSL config
