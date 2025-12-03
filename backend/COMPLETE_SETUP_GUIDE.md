# 📘 Hướng Dẫn Đầy Đủ - Tạo Content Types Trong Strapi

## 🎯 Mục Tiêu
Tạo 2 Content Types cho website xe điện:
1. **Car Model** - Quản lý sản phẩm xe đạp điện và xe máy điện
2. **Lead** - Quản lý khách hàng tiềm năng từ form liên hệ

---

## 📋 BƯỚC 1: Tạo Car Model Content Type

### 1.1. Khởi Tạo Content Type

1. Mở Strapi Admin Panel: `http://localhost:1337/admin`
2. Click **Content-Type Builder** trong sidebar bên trái
3. Click **+ Create new collection type**
4. Điền thông tin:
   - **Display name**: `Car Model`
   - **API ID (singular)**: `car-model` (tự động)
   - **API ID (plural)**: `car-models` (tự động)
5. Click **Continue**

### 1.2. Thêm Fields Cho Car Model

#### Field 1: Name (Tên sản phẩm)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `name`
- **Type**: Short text
- **Advanced Settings**:
  - ✅ Required field
  - ✅ Unique field
- Click **Finish**

#### Field 2: Slug (URL thân thiện)
- Click **+ Add another field**
- Chọn **UID**
- **Name**: `slug`
- **Attached field**: `name`
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 3: Brand (Thương hiệu)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `brand`
- **Type**: Short text
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 4: Type (Loại xe)
- Click **+ Add another field**
- Chọn **Enumeration**
- **Name**: `type`
- **Values** (nhập từng dòng):
  ```
  bicycle
  motorcycle
  ```
- **Default value**: `bicycle`
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 5: Price (Giá)
- Click **+ Add another field**
- Chọn **Number**
- **Name**: `price`
- **Number format**: `decimal`
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 6: Range (Quãng đường)
- Click **+ Add another field**
- Chọ **Number**
- **Name**: `range`
- **Number format**: `integer`
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 7: Top Speed (Tốc độ tối đa)
- Click **+ Add another field**
- Chọn **Number**
- **Name**: `topSpeed`
- **Number format**: `integer`
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 8: Acceleration (Gia tốc)
- Click **+ Add another field**
- Chọn **Number**
- **Name**: `acceleration`
- **Number format**: `decimal`
- **Default value**: `0`
- Click **Finish**

#### Field 9: Description (Mô tả)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `description`
- **Type**: Long text
- **Advanced Settings**:
  - ✅ Required field
- Click **Finish**

#### Field 10: Thumbnail (Hình ảnh)
- Click **+ Add another field**
- Chọn **Media**
- **Name**: `thumbnail`
- **Type**: Single media
- **Allowed types of media**: ✅ Images only
- Click **Finish**

#### Field 11: Model 3D (File 3D)
- Click **+ Add another field**
- Chọn **Media**
- **Name**: `model3D`
- **Type**: Single media
- **Allowed types of media**: ✅ Files
- Click **Finish**

#### Field 12: Featured (Nổi bật)
- Click **+ Add another field**
- Chọn **Boolean**
- **Name**: `featured`
- **Default value**: `false`
- Click **Finish**

#### Field 13: Specifications (Thông số kỹ thuật)
- Click **+ Add another field**
- Chọn **JSON**
- **Name**: `specifications`
- Click **Finish**

#### Field 14: Colors (Màu sắc) - COMPONENT
- Click **+ Add another field**
- Chọn **Component**
- **Name**: `colors`
- Click **Create a new component**

**Tạo Color Component:**
1. **Category**: `product`
2. **Name**: `color`
3. Click **Continue**

**Thêm fields cho Color component:**

**Field 1 trong Color: name**
- Click **+ Add another field to this component**
- Chọn **Text**
- **Name**: `name`
- **Type**: Short text
- **Advanced Settings**: ✅ Required field
- Click **Finish**

**Field 2 trong Color: hex**
- Click **+ Add another field to this component**
- Chọn **Text**
- **Name**: `hex`
- **Type**: Short text
- **Advanced Settings**: 
  - ✅ Required field
  - **Regex pattern**: `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`
- Click **Finish**

**Quay lại Car Model:**
- **Component type**: ✅ Repeatable component
- Click **Finish**

### 1.3. Lưu Car Model
- Click **Save** ở góc trên phải
- Đợi Strapi rebuild (khoảng 20-30 giây)
- Bạn sẽ thấy thông báo "Successfully saved"

---

## 📋 BƯỚC 2: Tạo Lead Content Type

### 2.1. Khởi Tạo Content Type

1. Vẫn trong **Content-Type Builder**
2. Click **+ Create new collection type**
3. Điền thông tin:
   - **Display name**: `Lead`
   - **API ID (singular)**: `lead`
   - **API ID (plural)**: `leads`
4. Click **Continue**

### 2.2. Thêm Fields Cho Lead

#### Field 1: Name (Họ tên)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `name`
- **Type**: Short text
- **Advanced Settings**: ✅ Required field
- Click **Finish**

#### Field 2: Email
- Click **+ Add another field**
- Chọn **Email**
- **Name**: `email`
- **Advanced Settings**: ✅ Required field
- Click **Finish**

#### Field 3: Phone (Số điện thoại)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `phone`
- **Type**: Short text
- **Advanced Settings**: ✅ Required field
- Click **Finish**

#### Field 4: Type (Loại yêu cầu)
- Click **+ Add another field**
- Chọn **Enumeration**
- **Name**: `type`
- **Values** (nhập từng dòng):
  ```
  test-drive
  consultation
  deposit
  ```
- **Default value**: `test-drive`
- **Advanced Settings**: ✅ Required field
- Click **Finish**

#### Field 5: Model (Sản phẩm quan tâm)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `model`
- **Type**: Short text
- Click **Finish**

#### Field 6: Message (Lời nhắn)
- Click **+ Add another field**
- Chọn **Text**
- **Name**: `message`
- **Type**: Long text
- Click **Finish**

#### Field 7: Status (Trạng thái)
- Click **+ Add another field**
- Chọn **Enumeration**
- **Name**: `status`
- **Values** (nhập từng dòng):
  ```
  new
  contacted
  qualified
  converted
  lost
  ```
- **Default value**: `new`
- Click **Finish**

### 2.3. Lưu Lead
- Click **Save** ở góc trên phải
- Đợi Strapi rebuild (khoảng 20-30 giây)

---

## 🔐 BƯỚC 3: Configure API Permissions

### 3.1. Vào Settings
1. Click **Settings** (⚙️) trong sidebar
2. Click **Users & Permissions Plugin**
3. Click **Roles**
4. Click **Public**

### 3.2. Enable Permissions

**Scroll xuống và tìm:**

#### CAR-MODEL (hoặc API::CAR-MODEL.CAR-MODEL)
- ✅ `find` - Cho phép lấy danh sách tất cả xe
- ✅ `findOne` - Cho phép lấy chi tiết 1 xe

#### LEAD (hoặc API::LEAD.LEAD)
- ✅ `create` - Cho phép tạo lead mới (từ contact form)

### 3.3. Lưu Permissions
- Click **Save** ở góc trên phải
- Đợi lưu thành công

---

## ✅ BƯỚC 4: Kiểm Tra API

### 4.1. Test API Endpoint

Mở browser mới và truy cập:
```
http://localhost:1337/api/car-models?populate=*
```

**Kết quả mong đợi:**
```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

Nếu thấy JSON như trên → **THÀNH CÔNG!** ✅

Nếu thấy lỗi 403 Forbidden → Kiểm tra lại permissions

---

## 📝 BƯỚC 5: Thêm Dữ Liệu Mẫu

### 5.1. Vào Content Manager
1. Click **Content Manager** trong sidebar
2. Click **Car Model**
3. Click **Create new entry**

### 5.2. Thêm Sản Phẩm Đầu Tiên: Giant E-Bike Pro

```
Name: Giant E-Bike Pro
Slug: xe-dap-dien-giant (tự động)
Brand: Giant
Type: bicycle
Price: 25000000
Range: 80
Top Speed: 25
Acceleration: 0
Description: Xe đạp điện Giant với thiết kế hiện đại, phù hợp cho di chuyển trong thành phố.
Featured: ✅ (check)
```

**Colors** (Click "Add an entry to colors" 3 lần):
1. Name: `Đen Bóng`, Hex: `#000000`
2. Name: `Trắng Ngọc`, Hex: `#ffffff`
3. Name: `Xanh Dương`, Hex: `#0066cc`

**Specifications** (JSON):
```json
{
  "battery": "48V 10Ah",
  "motor": "250W",
  "weight": "22kg",
  "maxLoad": "120kg"
}
```

**Lưu:**
- Click **Save**
- Click **Publish**

### 5.3. Thêm 3 Sản Phẩm Còn Lại

#### VinFast Klara S
```
Name: VinFast Klara S
Slug: xe-may-dien-vinfast-klara
Brand: VinFast
Type: motorcycle
Price: 35000000
Range: 120
Top Speed: 50
Acceleration: 0
Description: Xe máy điện VinFast Klara S với công nghệ pin tiên
tiến, thiết kế sang trọng.
Featured: ✅

Colors:
- Đỏ Rượu: #8B0000
- Trắng Ngọc Trai: #f5f5f5
- Đen Huyền Bí: #1a1a1a

Specifications:
{
  "battery": "60V 28Ah",
  "motor": "1200W",
  "weight": "95kg",
  "maxLoad": "150kg"
}
```

#### Trek Verve+ 3
```
Name: Trek Verve+ 3
Slug: xe-dap-dien-trek
Brand: Trek
Type: bicycle
Price: 32000000
Range: 90
Top Speed: 25
Acceleration: 0
Description: Xe đạp điện Trek cao cấp với hệ thống trợ lực thông minh.
Featured: ❌

Colors:
- Xanh Lá: #228B22
- Xám Titan: #808080

Specifications:
{
  "battery": "500Wh",
  "motor": "250W Bosch",
  "weight": "24kg",
  "maxLoad": "136kg"
}
```

#### Yadea G5
```
Name: Yadea G5
Slug: xe-may-dien-yadea
Brand: Yadea
Type: motorcycle
Price: 28000000
Range: 100
Top Speed: 45
Acceleration: 0
Description: Xe máy điện Yadea G5 - Giải pháp di chuyển xanh, tiết kiệm cho gia đình.
Featured: ❌

Colors:
- Xanh Ngọc: #00CED1
- Cam Năng Động: #FF6347
- Trắng Tinh Khôi: #ffffff

Specifications:
{
  "battery": "60V 20Ah",
  "motor": "800W",
  "weight": "85kg",
  "maxLoad": "150kg"
}
```

---

## 🔗 BƯỚC 6: Kết Nối Frontend

### 6.1. Tạo Environment Variable

Tạo file `frontend/.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 6.2. Test API Từ Frontend

Mở browser:
```
http://localhost:1337/api/car-models?populate=*
```

Bạn sẽ thấy 4 sản phẩm đã thêm!

---

## ✅ Checklist Hoàn Thành

- [ ] Tạo Car Model content type với 14 fields
- [ ] Tạo Color component với 2 fields
- [ ] Tạo Lead content type với 7 fields
- [ ] Configure permissions (Public role)
- [ ] Test API endpoint
- [ ] Thêm 4 sản phẩm mẫu
- [ ] Tạo .env.local trong frontend
- [ ] Verify API trả về data

---

## 🆘 Troubleshooting

### Không thấy Car-Model/Lead trong Permissions?
- Đảm bảo đã click **Save** sau khi tạo content type
- Đợi Strapi rebuild xong (20-30 giây)
- Refresh trang Settings

### API trả về 403 Forbidden?
- Kiểm tra lại permissions đã enable `find` và `findOne`
- Click **Save** trong Permissions settings

### Không thấy dữ liệu trong API?
- Đảm bảo đã **Publish** các entries (không chỉ Save)
- Thêm `?populate=*` vào URL để lấy relations

---

**Chúc bạn thành công!** 🎉
