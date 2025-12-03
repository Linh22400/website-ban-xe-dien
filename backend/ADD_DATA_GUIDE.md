# 📝 Hướng Dẫn Thêm Dữ Liệu Vào Strapi

## Bước 1: Thêm Sản Phẩm Đầu Tiên

1. **Vào Content Manager:**
   - Click **Content Manager** trong sidebar
   - Click **Car Model**
   - Click **Create new entry**

2. **Điền thông tin Giant E-Bike Pro:**

```
✏️ Name: Giant E-Bike Pro
🔗 Slug: xe-dap-dien-giant (tự động)
🏢 Brand: Giant
🚲 Type: bicycle
💰 Price: 25000000
🔋 Range: 80
⚡ Top Speed: 25
🚀 Acceleration: 0
📝 Description: Xe đạp điện Giant với thiết kế hiện đại, phù hợp cho di chuyển trong thành phố.
⭐ Featured: ✓ (check)
```

3. **Thêm Colors (Click "Add an entry to colors"):**
   - Color 1: Name: `Đen Bóng`, Hex: `#000000`
   - Color 2: Name: `Trắng Ngọc`, Hex: `#ffffff`
   - Color 3: Name: `Xanh Dương`, Hex: `#0066cc`

4. **Specifications (JSON):**
```json
{
  "battery": "48V 10Ah",
  "motor": "250W",
  "weight": "22kg",
  "maxLoad": "120kg"
}
```

5. **Click Save** → **Click Publish**

---

## Bước 2: Thêm 3 Sản Phẩm Còn Lại

### VinFast Klara S
```
Name: VinFast Klara S
Slug: xe-may-dien-vinfast-klara
Brand: VinFast
Type: motorcycle
Price: 35000000
Range: 120
Top Speed: 50
Featured: ✓

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

### Trek Verve+ 3
```
Name: Trek Verve+ 3
Slug: xe-dap-dien-trek
Brand: Trek
Type: bicycle
Price: 32000000
Range: 90
Top Speed: 25

Colors:
- Xanh Lá: #228B22
- Xám Titan: #808080
```

### Yadea G5
```
Name: Yadea G5
Slug: xe-may-dien-yadea
Brand: Yadea
Type: motorcycle
Price: 28000000
Range: 100
Top Speed: 45

Colors:
- Xanh Ngọc: #00CED1
- Cam Năng Động: #FF6347
- Trắng Tinh Khôi: #ffffff
```

---

## Bước 3: Configure API Permissions

1. **Settings** (⚙️) → **Users & Permissions Plugin** → **Roles**
2. Click **Public**
3. **Permissions** → Scroll xuống **Car-model**:
   - ✓ `find`
   - ✓ `findOne`
4. **Lead**:
   - ✓ `create`
5. **Click Save** (góc trên phải)

---

## Bước 4: Test API

Mở browser mới:
```
http://localhost:1337/api/car-models?populate=*
```

Bạn sẽ thấy JSON với 4 sản phẩm!

---

**Sau khi hoàn thành, báo cho tôi biết để connect frontend!** ✅
