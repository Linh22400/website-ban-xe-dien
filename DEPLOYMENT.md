# 🚀 Hướng Dẫn Deploy - Xe Điện Xanh

Hướng dẫn chi tiết để deploy website lên production.

## 📋 Tổng Quan

- **Frontend**: Vercel (khuyến nghị) hoặc Netlify
- **Backend**: Render, Railway, hoặc DigitalOcean
- **Database**: PostgreSQL (managed service)
- **Media**: Cloudinary

## 🎯 Option 1: Deploy Frontend Only (Khuyến Nghị Cho Demo)

### Vercel Deployment

#### Bước 1: Chuẩn Bị

```bash
# Đảm bảo code đã commit
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Bước 2: Deploy lên Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"Add New Project"**
4. Import repository của bạn
5. Cấu hình:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Environment Variables** (tùy chọn):
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

7. Click **"Deploy"**

#### Bước 3: Cấu Hình Domain (Tùy chọn)

1. Vào **Settings** → **Domains**
2. Thêm custom domain của bạn
3. Cập nhật DNS records theo hướng dẫn

#### Bước 4: Cập Nhật SEO URLs

Sau khi có domain, cập nhật các file:

**`app/sitemap.ts`**:
```typescript
const baseUrl = 'https://your-actual-domain.com'
```

**`app/robots.ts`**:
```typescript
sitemap: 'https://your-actual-domain.com/sitemap.xml'
```

**`lib/seo.ts`**:
```typescript
url: 'https://your-actual-domain.com'
```

Commit và push lại, Vercel sẽ tự động redeploy.

---

## 🔧 Option 2: Deploy Full Stack (Frontend + Backend)

### A. Deploy Backend (Strapi)

#### Option 2A: Render

1. **Tạo PostgreSQL Database**
   - Vào [render.com](https://render.com)
   - Create **New PostgreSQL**
   - Lưu lại **Internal Database URL**

2. **Deploy Strapi**
   - Create **New Web Service**
   - Connect repository
   - Cấu hình:
     ```
     Build Command: cd backend && npm install && npm run build
     Start Command: cd backend && npm start
     ```
   
   - **Environment Variables**:
     ```
     NODE_ENV=production
     DATABASE_CLIENT=postgres
     DATABASE_URL=<your-postgres-url>
     APP_KEYS=<random-string-1>,<random-string-2>
     API_TOKEN_SALT=<random-string>
     ADMIN_JWT_SECRET=<random-string>
     JWT_SECRET=<random-string>
     
     # Cloudinary
     CLOUDINARY_NAME=<your-cloudinary-name>
     CLOUDINARY_KEY=<your-key>
     CLOUDINARY_SECRET=<your-secret>
     ```

   - Generate random strings:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```

3. **Setup Strapi**
   - Truy cập `https://your-app.onrender.com/admin`
   - Tạo admin account
   - Import data hoặc tạo content

#### Option 2B: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**:
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables** qua Railway dashboard

### B. Deploy Frontend với Backend

#### Bước 1: Cập Nhật Environment Variables trên Vercel

```
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
```

#### Bước 2: Cập Nhật CORS trên Strapi

**`backend/config/middlewares.js`**:
```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://your-frontend.vercel.app'],
    },
  },
];
```

#### Bước 3: Redeploy

Commit changes và push, cả Vercel và Render sẽ tự động deploy.

---

## 📊 Checklist Deploy

### Pre-Deployment

- [ ] Test build locally: `npm run build && npm start`
- [ ] Kiểm tra tất cả environment variables
- [ ] Cập nhật domain trong SEO files
- [ ] Test responsive trên mobile/tablet
- [ ] Kiểm tra performance với Lighthouse
- [ ] Verify tất cả links hoạt động

### Post-Deployment

- [ ] Test website trên production URL
- [ ] Verify sitemap.xml: `https://your-domain.com/sitemap.xml`
- [ ] Verify robots.txt: `https://your-domain.com/robots.txt`
- [ ] Test form submissions
- [ ] Kiểm tra 3D viewer hoạt động
- [ ] Test trên nhiều browsers (Chrome, Firefox, Safari)
- [ ] Submit sitemap lên Google Search Console

---

## 🔍 SEO Setup

### Google Search Console

1. Truy cập [search.google.com/search-console](https://search.google.com/search-console)
2. Add property với domain của bạn
3. Verify ownership
4. Submit sitemap: `https://your-domain.com/sitemap.xml`

### Google Analytics (Tùy chọn)

1. Tạo GA4 property
2. Thêm tracking code vào `app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Out of memory"**
- Tăng Node memory limit:
  ```json
  // package.json
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
  ```

### Runtime Errors

**Images không load**
- Kiểm tra `next.config.ts` có cấu hình `remotePatterns`
- Verify image URLs accessible

**API calls fail**
- Kiểm tra CORS settings trên backend
- Verify `NEXT_PUBLIC_STRAPI_URL` đúng
- Check network tab trong DevTools

---

## 📈 Performance Optimization

### Vercel Settings

- Enable **Edge Functions** cho API routes
- Enable **Image Optimization**
- Enable **Incremental Static Regeneration** (ISR)

### Caching Strategy

```typescript
// app/cars/page.tsx
export const revalidate = 3600 // Revalidate mỗi 1 giờ
```

---

## 🔒 Security

### Environment Variables

- ❌ **KHÔNG BAO GIỜ** commit `.env.local`
- ✅ Sử dụng Vercel Environment Variables
- ✅ Rotate secrets định kỳ

### Headers Security

**`next.config.ts`**:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

---

## 📞 Support

Nếu gặp vấn đề khi deploy:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Deployment](https://nextjs.org/docs/deployment)
3. Check [Strapi Deployment](https://docs.strapi.io/dev-docs/deployment)

---

**Chúc bạn deploy thành công! 🎉**
