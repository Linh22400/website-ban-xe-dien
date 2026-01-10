# HƯỚNG DẪN DEPLOY WEBSITE LÊN xedienducduy.id.vn

**Domain hiện tại:** xedienducduy.id.vn (đang chạy WordPress test)  
**Deploy mới:** Next.js App (website xe điện)  
**Ngày:** 10/01/2026

---

## 🎯 TỔNG QUAN QUY TRÌNH

Bạn cần thực hiện **3 bước chính:**

1. **Deploy Frontend lên Vercel** (15 phút)
2. **Cập nhật Backend CORS** (5 phút)  
3. **Trỏ Domain về Vercel** (5-30 phút)

**Tổng thời gian:** 25-50 phút

---

## 📋 BƯỚC 1: DEPLOY FRONTEND LÊN VERCEL (15 phút)

### 1.1. Tạo tài khoản Vercel (nếu chưa có)

1. Truy cập: https://vercel.com/signup
2. Đăng ký bằng GitHub account (khuyến nghị)
3. Verify email

### 1.2. Push code lên GitHub (nếu chưa có)

```bash
# Nếu chưa có Git repository
cd "d:\website(banxedien)"

# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready - Security fixes completed"

# Tạo repository trên GitHub:
# - Truy cập https://github.com/new
# - Tên repo: website-xe-dien-duc-duy
# - Public hoặc Private
# - Không tick "Initialize with README" (vì đã có code)

# Link remote và push
git remote add origin https://github.com/[YOUR_USERNAME]/website-xe-dien-duc-duy.git
git branch -M main
git push -u origin main
```

### 1.3. Import Project vào Vercel

**Option A: Qua Vercel Dashboard (Dễ nhất)**

1. Đăng nhập Vercel: https://vercel.com/login
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Chọn repository vừa push (website-xe-dien-duc-duy)
5. Click "Import"

**Configure Project:**

```yaml
Framework Preset: Next.js (auto-detect ✅)
Root Directory: frontend/  # QUAN TRỌNG!
Build Command: npm run build (auto ✅)
Output Directory: .next (auto ✅)
Install Command: npm install (auto ✅)
```

6. Click "Environment Variables" để thêm:

```env
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
NEXT_PUBLIC_SITE_URL=https://xedienducduy.id.vn
```

7. Click "Deploy"

**Kết quả:** Vercel sẽ build và deploy (~2-3 phút)
- URL tạm: `https://[project-name]-[random].vercel.app`

---

## 📋 BƯỚC 2: CẬP NHẬT BACKEND CORS (5 phút)

### 2.1. Truy cập Render.com Dashboard

1. Đăng nhập: https://dashboard.render.com/
2. Chọn service: **website-ban-xe-dien**
3. Vào tab: **Environment**

### 2.2. Update CLIENT_URL

Tìm biến `CLIENT_URL` và sửa thành:

```env
CLIENT_URL=http://localhost:3000,https://website-ban-xe-dien.vercel.app,https://xedienducduy.id.vn
```

**Giải thích:**
- `http://localhost:3000` - Development local
- `https://website-ban-xe-dien.vercel.app` - Staging Vercel
- `https://xedienducduy.id.vn` - Production domain

### 2.3. Save & Restart

1. Click "Save Changes"
2. Backend sẽ tự động redeploy (~1 phút)
3. Chờ status "Live" màu xanh ✅

---

## 📋 BƯỚC 3: TRỎ DOMAIN VỀ VERCEL (5-30 phút)

### 3.1. Thêm Domain vào Vercel

1. Trong Vercel Project Dashboard
2. Vào tab "Settings" → "Domains"
3. Click "Add"
4. Nhập: `xedienducduy.id.vn`
5. Click "Add"

Vercel sẽ hiển thị hướng dẫn DNS:

```
Type: CNAME
Name: xedienducduy (hoặc @)
Value: cname.vercel-dns.com
```

### 3.2. Cập nhật DNS Records

**Quan trọng:** Bạn cần truy cập nơi quản lý domain (nơi mua domain)

#### Nếu domain mua tại Tên Miền Việt (vietnamdomain.vn):

1. Đăng nhập: https://vietnamdomain.vn/login
2. Vào "Quản lý tên miền"
3. Chọn domain: xedienducduy.id.vn
4. Click "Quản lý DNS"

**Xóa records cũ (WordPress):**
- Xóa A Record trỏ đến IP WordPress
- Xóa CNAME record cũ (nếu có)

**Thêm record mới:**

```
Type: CNAME
Host: @ (hoặc xedienducduy)
Points to: cname.vercel-dns.com
TTL: Auto (hoặc 3600)
```

**Nếu có www:**
```
Type: CNAME
Host: www
Points to: cname.vercel-dns.com
TTL: Auto
```

5. Click "Lưu" hoặc "Save"

#### Nếu domain mua tại nơi khác:

**Cloudflare:**
1. Dashboard → DNS → Records
2. Delete old A/CNAME records
3. Add: CNAME @ → cname.vercel-dns.com

**GoDaddy:**
1. My Products → Domains → DNS
2. Delete old records
3. Add: CNAME @ → cname.vercel-dns.com

**Namecheap:**
1. Domain List → Manage → Advanced DNS
2. Delete old records
3. Add: CNAME @ → cname.vercel-dns.com

### 3.3. Chờ DNS Propagation

- **Thời gian:** 5-30 phút (thường là 10-15 phút)
- **Kiểm tra:** `nslookup xedienducduy.id.vn`

```powershell
# Check DNS
nslookup xedienducduy.id.vn

# Nên thấy:
# Non-authoritative answer:
# Name:    cname.vercel-dns.com
# Address:  76.76.21.21 (hoặc IP Vercel khác)
```

### 3.4. Vercel Auto SSL

Sau khi DNS propagation xong (~5-10 phút):
- Vercel tự động issue SSL certificate (Let's Encrypt)
- Website sẽ có HTTPS tự động
- Status trong Vercel: "Valid Configuration" ✅

---

## ✅ BƯỚC 4: KIỂM TRA & VERIFY (10 phút)

### 4.1. Test Website

1. **Test domain:**
   - Truy cập: https://xedienducduy.id.vn
   - Kiểm tra homepage load đúng
   - Check không còn WordPress content

2. **Test các pages:**
   - https://xedienducduy.id.vn/about
   - https://xedienducduy.id.vn/cars
   - https://xedienducduy.id.vn/admin-login
   - https://xedienducduy.id.vn/contact

3. **Test API connection:**
   - Product pages load images từ Cloudinary ✅
   - Forms submit được (newsletter, contact) ✅
   - Cart và wishlist hoạt động ✅

### 4.2. Test Admin Features

1. Login admin: https://xedienducduy.id.vn/admin-login
2. Verify middleware hoạt động (redirect nếu chưa login)
3. Test admin dashboard
4. Test create/edit products

### 4.3. Security Checks

1. **SSL Certificate:**
   - Check: https://www.ssllabs.com/ssltest/
   - Nhập: xedienducduy.id.vn
   - Aim for: A or A+ rating

2. **Security Headers:**
   - Check: https://securityheaders.com/
   - Nhập: https://xedienducduy.id.vn
   - Verify headers present:
     - X-Frame-Options
     - X-Content-Type-Options
     - X-XSS-Protection
     - Referrer-Policy

3. **Performance:**
   - PageSpeed Insights: https://pagespeed.web.dev/
   - Nhập: https://xedienducduy.id.vn
   - Target: >90 Performance score

### 4.4. Mobile Testing

- Test trên điện thoại (Chrome/Safari)
- Check responsive design
- Test forms trên mobile
- Verify images load correctly

---

## 🔧 TROUBLESHOOTING

### ❌ Problem: "This site can't be reached"

**Nguyên nhân:** DNS chưa propagate
**Giải pháp:** 
- Đợi thêm 10-20 phút
- Clear DNS cache:
  ```powershell
  ipconfig /flushdns
  ```
- Test trên mobile data (không dùng WiFi)

### ❌ Problem: Vẫn thấy WordPress site cũ

**Nguyên nhân:** Browser cache hoặc DNS cache
**Giải pháp:**
- Hard refresh: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
- Clear browser cache
- Test incognito mode
- Đợi DNS propagate thêm

### ❌ Problem: "ERR_TOO_MANY_REDIRECTS"

**Nguyên nhân:** SSL/HTTPS redirect loop
**Giải pháp:**
- Kiểm tra Vercel có "Force HTTPS" enabled
- Xóa HTTPS redirect rules ở DNS provider (nếu có)

### ❌ Problem: API calls bị CORS error

**Nguyên nhân:** Chưa update CLIENT_URL ở backend
**Giải pháp:**
- Quay lại Bước 2
- Verify CLIENT_URL có chứa `https://xedienducduy.id.vn`
- Restart backend service

### ❌ Problem: Images không load

**Nguyên nhân:** Environment variable sai
**Giải pháp:**
- Vercel → Settings → Environment Variables
- Verify `NEXT_PUBLIC_STRAPI_URL` đúng
- Redeploy: Deployments → Latest → "Redeploy"

### ❌ Problem: SSL Certificate pending

**Nguyên nhân:** DNS chưa hoàn toàn resolve
**Giải pháp:**
- Đợi 5-10 phút nữa
- Verify DNS: `nslookup xedienducduy.id.vn`
- Vercel sẽ tự động issue khi DNS ready

---

## 📱 BƯỚC 5: POST-DEPLOYMENT (Optional)

### 5.1. Setup Google Analytics (Optional)

1. Tạo GA4 property: https://analytics.google.com/
2. Copy Measurement ID: `G-XXXXXXXXXX`
3. Thêm vào Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Redeploy

### 5.2. Setup Google Search Console

1. https://search.google.com/search-console/
2. Add property: `https://xedienducduy.id.vn`
3. Verify ownership (DNS TXT record hoặc HTML file)
4. Submit sitemap: `https://xedienducduy.id.vn/sitemap.xml`

### 5.3. Setup Error Tracking (Optional)

```bash
# Install Sentry
cd frontend
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# Follow wizard để setup
# Lấy DSN từ Sentry.io
# Add NEXT_PUBLIC_SENTRY_DSN to Vercel env vars
```

### 5.4. Setup Uptime Monitoring (Optional)

- **UptimeRobot:** https://uptimerobot.com/ (Free)
- **Pingdom:** https://www.pingdom.com/
- Monitor: `https://xedienducduy.id.vn`
- Alert khi downtime

---

## 📊 DEPLOYMENT SUMMARY

### ✅ Checklist hoàn chỉnh:

**Code & Build:**
- [x] Security fixes completed (9.2/10)
- [x] Build successful (50 routes)
- [x] 0 npm vulnerabilities
- [x] Middleware active

**Hosting:**
- [ ] GitHub repository created
- [ ] Vercel project imported
- [ ] Environment variables configured
- [ ] First deployment successful

**Domain:**
- [ ] DNS CNAME record added
- [ ] DNS propagation complete
- [ ] Vercel domain verified
- [ ] SSL certificate issued

**Backend:**
- [ ] CORS updated with production domain
- [ ] Backend restarted
- [ ] API connection tested

**Testing:**
- [ ] Homepage loads
- [ ] All pages accessible
- [ ] Forms work
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] SSL A+ rating
- [ ] Security headers present

---

## 🎯 QUICK REFERENCE

### Vercel CLI (Alternative method)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd "d:\website(banxedien)\frontend"
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? website-xe-dien-duc-duy
# - Directory? ./ (current)
# - Deploy? Yes

# Production deploy
vercel --prod
```

### Key URLs:

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com/
- **Domain Management:** https://[your-registrar].com
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com/
- **PageSpeed:** https://pagespeed.web.dev/

### Important Files:

- Frontend config: `frontend/.env.production`
- Next.js config: `frontend/next.config.ts`
- Middleware: `frontend/middleware.ts`
- Backend CORS: Render Environment Variables

---

## 💡 TIPS & BEST PRACTICES

### 1. Keep development and production separated

```env
# Development (.env.local)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Production (Vercel env vars)
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
```

### 2. Enable Vercel deployment protection

- Settings → Deployment Protection
- Enable password protection for preview deployments
- Protect production từ accidental overwrites

### 3. Setup automatic deployments

- Vercel tự động deploy khi push lên GitHub
- Main branch → Production
- Other branches → Preview deployments

### 4. Monitor performance

- Vercel Analytics (built-in)
- Google Analytics
- Lighthouse CI

### 5. Backup strategy

- Database: Supabase automatic backups ✅
- Code: Git version control ✅
- Environment vars: Document trong .env.example ✅

---

## 🚀 FINAL STEPS

### Thứ tự thực hiện (không nhầm lẫn):

1. ⚡ **Push code lên GitHub** (5 phút)
2. ⚡ **Import vào Vercel** (5 phút)
3. ⚡ **Configure environment variables** (2 phút)
4. ⚡ **Deploy** (3 phút - auto)
5. ⚡ **Update backend CORS** (2 phút)
6. ⚡ **Add domain to Vercel** (2 phút)
7. ⚡ **Update DNS CNAME** (5 phút)
8. ⏳ **Chờ DNS propagation** (10-30 phút)
9. ✅ **Verify & Test** (10 phút)

**Total active time:** 35 phút  
**Total wait time:** 10-30 phút  
**Total time:** 45-65 phút

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. **Vercel Support:** https://vercel.com/support
2. **Render Support:** https://render.com/docs
3. **Next.js Docs:** https://nextjs.org/docs/deployment
4. **Domain registrar support** (nơi mua domain)

---

**🎉 Chúc bạn deploy thành công!**

Sau khi hoàn thành, website sẽ live tại: **https://xedienducduy.id.vn** ✨
