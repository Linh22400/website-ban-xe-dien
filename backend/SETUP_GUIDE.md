# 🚀 Hướng Dẫn Setup Strapi Backend

## ✅ Đã Hoàn Thành

1. ✅ Strapi project created
2. ✅ Admin account created
3. ✅ Content Type schemas created:
   - `Car Model` - Sản phẩm xe điện
   - `Lead` - Khách hàng tiềm năng
   - `Color` component - Màu sắc

## 📋 Bước Tiếp Theo

### 1. Restart Strapi Server

Strapi cần restart để load schemas mới:

1. **Stop server hiện tại**: `Ctrl + C` trong terminal backend
2. **Start lại**: `npm run develop`
3. **Đợi server khởi động** và mở lại `http://localhost:1337/admin`

### 2. Kiểm Tra Content Types

Sau khi restart, bạn sẽ thấy trong sidebar bên trái:
- 📦 **Car Model** (Collection Type)
- 📝 **Lead** (Collection Type)

### 3. Thêm Dữ Liệu Mẫu

#### Tạo Car Model đầu tiên:

1. Click **Content Manager** → **Car Model** → **Create new entry**
2. Điền thông tin:

```
Name: Giant E-Bike Pro
Brand: Giant
Type: bicycle
Price: 25000000
Range: 80
Top Speed: 25
Acceleration: 0
Description: Xe đạp điện Giant với thiết kế hiện đại, phù hợp cho di chuyển trong thành phố.
Featured: ✓ (checked)

Colors (Add 3 colors):
  1. Name: Đen Bóng, Hex: #000000
  2. Name: Trắng Ngọc, Hex: #ffffff
  3. Name: Xanh Dương, Hex: #0066cc
```

3. Click **Save** → **Publish**

#### Tạo thêm 3 sản phẩm nữa:

**VinFast Klara S:**
```
Name: VinFast Klara S
Brand: VinFast
Type: motorcycle
Price: 35000000
Range: 120
Top Speed: 50
Description: Xe máy điện VinFast Klara S với công nghệ pin tiên tiến.
Colors: Đỏ Rượu (#8B0000), Trắng Ngọc Trai (#f5f5f5), Đen Huyền Bí (#1a1a1a)
```

**Trek Verve+ 3:**
```
Name: Trek Verve+ 3
Brand: Trek
Type: bicycle
Price: 32000000
Range: 90
Top Speed: 25
Colors: Xanh Lá (#228B22), Xám Titan (#808080)
```

**Yadea G5:**
```
Name: Yadea G5
Brand: Yadea
Type: motorcycle
Price: 28000000
Range: 100
Top Speed: 45
Colors: Xanh Ngọc (#00CED1), Cam Năng Động (#FF6347), Trắng (#ffffff)
```

### 4. Cấu Hình API Permissions

1. **Settings** (⚙️) → **Users & Permissions Plugin** → **Roles** → **Public**
2. **Permissions** → Expand **Car-model**:
   - ✓ `find` (GET all)
   - ✓ `findOne` (GET by ID)
3. **Permissions** → Expand **Lead**:
   - ✓ `create` (POST - cho contact form)
4. Click **Save**

### 5. Test API

Mở browser và test:
```
http://localhost:1337/api/car-models?populate=*
```

Bạn sẽ thấy JSON response với tất cả sản phẩm!

### 6. Connect Frontend

Sau khi có data, update frontend:

**File: `frontend/.env.local`**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**File: `frontend/lib/api.ts`**
- Uncomment Strapi API calls
- Comment out mock data

---

## 🎯 Checklist

- [ ] Restart Strapi server
- [ ] Verify Content Types xuất hiện
- [ ] Add 4 car models với data
- [ ] Configure API permissions (Public role)
- [ ] Test API endpoint
- [ ] Create `.env.local` trong frontend
- [ ] Update `lib/api.ts` để dùng real API

---

**Bạn đang ở bước nào? Hãy cho tôi biết nếu cần hỗ trợ!** 🚀
