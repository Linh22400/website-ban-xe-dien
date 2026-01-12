# 🎯 Hệ thống Banner Link Tự Động

## Tổng quan

Hệ thống tự động hóa link cho banner, không cần hardcode từng trang. Banner sẽ tự động link đến đúng nội dung dựa trên **loại** và **đích đến**.

---

## 🎨 Các loại Banner

### 1. **Banner Khuyến Mãi** 🏷️
**Link Type:** `promotion`
**Target:** Slug khuyến mãi
**Ví dụ:**
- Input: `khuyen-mai-tet-2026`
- Output: `/promotions/khuyen-mai-tet-2026`
- Hiển thị: Trang khuyến mãi với danh sách SP giảm giá

**Khi nào dùng:**
- Banner giảm giá, flash sale
- Chương trình khuyến mãi theo tháng/mùa
- Sale đặc biệt (Black Friday, Tết...)

---

### 2. **Banner Sản Phẩm** 🚗
**Link Type:** `product`
**Target:** Slug sản phẩm
**Ví dụ:**
- Input: `tailg-xmen-plus`
- Output: `/cars/tailg-xmen-plus`
- Hiển thị: Trang chi tiết xe

**Khi nào dùng:**
- Ra mắt xe mới
- Đẩy bán sản phẩm cụ thể
- Sản phẩm độc quyền

---

### 3. **Banner Tin Tức** 📰
**Link Type:** `blog`
**Target:** Slug bài viết
**Ví dụ:**
- Input: `xe-dien-tailg-co-tot-khong`
- Output: `/blog/xe-dien-tailg-co-tot-khong`
- Hiển thị: Bài viết chi tiết

**Khi nào dùng:**
- Thông báo quan trọng
- Bài review, so sánh
- Tin tức ngành

---

### 4. **Banner Danh Mục** 📁
**Link Type:** `category`
**Target:** Query filter
**Ví dụ:**
- Input: `type=motorcycle&brand=TAILG`
- Output: `/cars?type=motorcycle&brand=TAILG`
- Hiển thị: Danh sách xe máy TAILG

**Quick Select có sẵn:**
- Tất cả xe máy điện
- Tất cả xe đạp điện
- Thương hiệu TAILG
- Xe dưới 15 triệu

**Khi nào dùng:**
- Quảng bá toàn bộ dòng xe
- Filter theo brand, giá, range
- Campaign brand

---

### 5. **Banner Bộ Sưu Tập** ⭐
**Link Type:** `collection`
**Target:** Collection slug
**Ví dụ:**
- Input: `xe-moi-2026`
- Output: `/cars?collection=xe-moi-2026`
- Hiển thị: Danh sách xe trong bộ sưu tập

**Collection có sẵn:**
- `xe-moi-2026` - Xe mới nhất 2026
- `xe-ban-chay` - Xe bán chạy
- `xe-gia-re` - Xe giá rẻ
- `xe-cao-cap` - Xe cao cấp

**Khi nào dùng:**
- Tổng hợp theo theme
- Xu hướng, trending
- Top picks

---

### 6. **Banner Form Đăng Ký** 📝
**Link Type:** `form`
**Target:** Form type
**Ví dụ:**
- Input: `lai-thu`
- Output: `/lai-thu`
- Hiển thị: Form đăng ký lái thử

**Form có sẵn:**
- `lai-thu` → /lai-thu
- `tu-van` → /contact?type=consultation
- `lien-he` → /contact

**Khi nào dùng:**
- Call-to-Action
- Lead generation
- Đăng ký dịch vụ

---

### 7. **Banner Tùy Chỉnh** 🔗
**Link Type:** `custom`
**Target:** URL hoặc path
**Ví dụ:**
- Input: `/compare`
- Output: `/compare`
- Hiển thị: Trang so sánh

**Khi nào dùng:**
- Link đặc biệt không thuộc các loại trên
- External URL
- Landing page riêng

---

## 📱 Cách sử dụng (Admin)

### Bước 1: Chọn loại banner
- Vào **Admin → Banner & Slide**
- Click **Thêm Banner**
- Chọn icon loại link (🏷️ 🚗 📰 📁 ⭐ 📝 🔗)

### Bước 2: Nhập đích đến
- **Quick Select:** Click chọn nhanh option có sẵn
- **Manual:** Nhập slug/query theo placeholder

### Bước 3: Xem preview
- System tự động generate link
- Hiển thị link cuối cùng
- Validation tự động

### Bước 4: Lưu & Test
- Click **Thêm Mới** hoặc **Cập Nhật**
- Test banner trên trang chủ
- Click banner → Redirect đến đúng trang

---

## 🔥 Ví dụ thực tế

### Case 1: Sale Tết 2026
```
Type: promotion
Target: khuyen-mai-tet-2026
→ Link: /promotions/khuyen-mai-tet-2026
→ Hiển thị: Trang khuyến mãi với countdown + danh sách SP sale
```

### Case 2: Ra mắt TAILG Xmen Plus
```
Type: product
Target: tailg-xmen-plus
→ Link: /cars/tailg-xmen-plus
→ Hiển thị: Trang chi tiết xe với đầy đủ thông tin
```

### Case 3: Đẩy bán toàn bộ xe TAILG
```
Type: category
Target: brand=TAILG
→ Link: /cars?brand=TAILG
→ Hiển thị: Tất cả xe TAILG
```

### Case 4: Top xe bán chạy năm
```
Type: collection
Target: xe-ban-chay
→ Link: /cars?collection=xe-ban-chay
→ Hiển thị: Xe có lượt mua nhiều
```

### Case 5: Campaign đăng ký lái thử
```
Type: form
Target: lai-thu
→ Link: /lai-thu
→ Hiển thị: Form đăng ký với calendar
```

---

## ⚙️ Kỹ thuật

### Components
- **SmartBannerLinkInput** - Component nhập link thông minh
- **resolveBannerLink()** - Resolve từ type+target → URL
- **validateBannerLink()** - Validate format

### Files
```
/lib/banner-link-resolver.ts          # Core logic
/components/admin/SmartBannerLinkInput.tsx  # Admin UI
/app/promotions/[slug]/page.tsx       # Promotion page
/app/admin/marketing/page.tsx         # Updated with Smart Input
```

---

## 🎯 Lợi ích

✅ **Tự động hóa:** Không cần tạo landing page riêng cho mỗi banner
✅ **Linh hoạt:** Thay đổi target dễ dàng mà không cần code
✅ **Validation:** Tự động kiểm tra format, không link sai
✅ **Preview:** Xem trước link trước khi save
✅ **Quick Select:** Chọn nhanh các option phổ biến
✅ **Mở rộng:** Dễ thêm link type mới

---

## 🚀 Tương lai

**Có thể thêm:**
- 🎁 Link type `bundle` - Combo sản phẩm
- 🏪 Link type `showroom` - Chi nhánh cụ thể
- 📦 Link type `accessories` - Phụ kiện
- 🎮 Link type `comparison` - So sánh sản phẩm
- 📊 Analytics tracking cho mỗi banner click

---

**Version:** 1.0.0
**Last updated:** January 13, 2026
