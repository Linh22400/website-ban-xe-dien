# 🚲 Xe Điện Xanh - Website Bán Xe Đạp & Xe Máy Điện

Website thương mại điện tử hiện đại cho việc bán xe đạp điện và xe máy điện, được xây dựng với Next.js 14, React Three Fiber, GSAP, và Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính Năng

### 🎨 Giao Diện & UX
- ✅ Thiết kế futuristic với dark theme
- ✅ Hoàn toàn responsive (mobile, tablet, desktop)
- ✅ Animations mượt mà với GSAP
- ✅ 3D Product Viewer với React Three Fiber
- ✅ Loading states & skeleton screens
- ✅ 404 error page tùy chỉnh

### 📄 Các Trang
- **Trang Chủ**: Hero section 3D, featured products, CTA
- **Sản Phẩm**: Danh sách sản phẩm với filter
- **Chi Tiết Sản Phẩm**: 3D configurator, color picker, specs
- **So Sánh**: So sánh tối đa 3 sản phẩm
- **Khuyến Mãi**: Các chương trình ưu đãi
- **Blog**: Tin tức & bài viết
- **Về Chúng Tôi**: Giới thiệu công ty
- **Liên Hệ**: Form đăng ký lái thử

### 🔍 SEO
- ✅ Sitemap.xml tự động
- ✅ Robots.txt
- ✅ JSON-LD structured data (Product, Organization, Article)
- ✅ Open Graph metadata
- ✅ Semantic HTML

### 🌐 Ngôn Ngữ
- ✅ Hoàn toàn tiếng Việt
- ✅ Giá bằng VNĐ (₫)
- ✅ Nội dung địa phương hóa

## 🚀 Bắt Đầu

### Yêu Cầu
- Node.js 18+ 
- npm hoặc yarn

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/your-username/xe-dien-xanh.git

# Di chuyển vào thư mục frontend
cd xe-dien-xanh/frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

### Build Production

```bash
npm run build
npm start
```

## 📁 Cấu Trúc Dự Án

```
frontend/
├── app/                      # Next.js App Router
│   ├── about/               # Trang về chúng tôi
│   ├── blog/                # Blog listing & detail
│   ├── cars/                # Sản phẩm listing & detail
│   ├── compare/             # So sánh sản phẩm
│   ├── contact/             # Form liên hệ
│   ├── promotions/          # Khuyến mãi
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Trang chủ
│   ├── not-found.tsx        # 404 page
│   ├── loading.tsx          # Global loading
│   ├── sitemap.ts           # SEO sitemap
│   └── robots.ts            # SEO robots.txt
├── components/
│   ├── 3d/
│   │   └── CarViewer.tsx    # 3D viewer component
│   ├── sections/
│   │   ├── Hero.tsx         # Hero section
│   │   ├── FeaturedModels.tsx
│   │   └── CarConfigurator.tsx
│   └── ui/
│       ├── Navbar.tsx       # Navigation
│       ├── Footer.tsx       # Footer
│       └── Skeletons.tsx    # Loading skeletons
├── lib/
│   ├── api.ts               # API functions & mock data
│   └── seo.ts               # SEO helpers (JSON-LD)
└── public/                  # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D**: React Three Fiber, Three.js
- **Animations**: GSAP, ScrollTrigger
- **UI**: Custom components

### Backend (Tùy chọn)
- **CMS**: Strapi
- **Database**: PostgreSQL
- **Media**: Cloudinary
- **API**: REST/GraphQL

## 📦 Sản Phẩm Mẫu

Website hiện có 4 sản phẩm mẫu:

1. **Giant E-Bike Pro** - Xe đạp điện (25 triệu VNĐ)
2. **VinFast Klara S** - Xe máy điện (35 triệu VNĐ)
3. **Trek Verve+ 3** - Xe đạp điện (32 triệu VNĐ)
4. **Yadea G5** - Xe máy điện (28 triệu VNĐ)

## 🔧 Cấu Hình

### Environment Variables

Tạo file `.env.local`:

```env
# Strapi Backend (Tùy chọn)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Site URL (cho SEO)
NEXT_PUBLIC_SITE_URL=https://xedienviet.com
```

### Thay Đổi Domain

Cập nhật domain trong các file sau:
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/seo.ts`

## 📚 Tài Liệu

- [DESIGN.md](../DESIGN.md) - Kiến trúc hệ thống
- [STRAPI_SETUP.md](../STRAPI_SETUP.md) - Hướng dẫn setup backend
- [STRAPI_INTEGRATION.md](../STRAPI_INTEGRATION.md) - Tích hợp API
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Hướng dẫn deploy

## 🚀 Deployment

Xem [DEPLOYMENT.md](../DEPLOYMENT.md) để biết hướng dẫn chi tiết.

### Quick Deploy với Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🤝 Đóng Góp

Contributions, issues và feature requests đều được chào đón!

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Tác Giả

**Xe Điện Xanh Team**
- Website: https://xedienviet.com
- Email: info@xedienviet.com

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star!
