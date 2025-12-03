# 🔧 Hướng Dẫn Tạo Content Types Qua UI

Vì API không tự động đăng ký, chúng ta sẽ tạo Content Types trực tiếp qua Strapi UI.

## Bước 1: Tạo Car Model Content Type

1. **Vào Content-Type Builder:**
   - Click **Content-Type Builder** trong sidebar bên trái
   - Click **+ Create new collection type**

2. **Điền thông tin:**
   - Display name: `Car Model`
   - API ID (singular): `car-model`
   - API ID (plural): `car-models`
   - Click **Continue**

3. **Thêm Fields:**

### Field 1: Name (Text)
- Click **+ Add another field**
- Chọn **Text**
- Name: `name`
- Type: Short text
- ✓ Required field
- ✓ Unique field
- Click **Finish**

### Field 2: Slug (UID)
- **UID**
- Name: `slug`
- Attached field: `name`
- ✓ Required field
- Click **Finish**

### Field 3: Brand (Text)
- **Text**
- Name: `brand`
- ✓ Required field
- Click **Finish**

### Field 4: Type (Enumeration)
- **Enumeration**
- Name: `type`
- Values: `bicycle`, `motorcycle`
- Default value: `bicycle`
- ✓ Required field
- Click **Finish**

### Field 5: Price (Number)
- **Number**
- Name: `price`
- Number format: `decimal`
- ✓ Required field
- Click **Finish**

### Field 6: Range (Number)
- **Number**
- Name: `range`
- Number format: `integer`
- ✓ Required field
- Click **Finish**

### Field 7: Top Speed (Number)
- **Number**
- Name: `topSpeed`
- Number format: `integer`
- ✓ Required field
- Click **Finish**

### Field 8: Description (Text)
- **Text**
- Name: `description`
- Type: Long text
- ✓ Required field
- Click **Finish**

### Field 9: Featured (Boolean)
- **Boolean**
- Name: `featured`
- Default value: `false`
- Click **Finish**

### Field 10: Thumbnail (Media)
- **Media**
- Name: `thumbnail`
- Type: Single media
- Allowed types: Images
- Click **Finish**

### Field 11: Colors (Component)
- **Component**
- Name: `colors`
- Click **Create a new component**
- Category: `product`
- Name: `color`
- Click **Continue**

**Trong Color component, thêm 2 fields:**
1. **Text** - Name: `name`, Required
2. **Text** - Name: `hex`, Required

- ✓ Repeatable component
- Click **Finish**

4. **Click Save** (góc trên phải)

---

## Bước 2: Tạo Lead Content Type

1. **+ Create new collection type**
   - Display name: `Lead`
   - API ID: `lead`
   - Click **Continue**

2. **Thêm Fields:**
   - `name` - Text, Required
   - `email` - Email, Required
   - `phone` - Text, Required
   - `type` - Enumeration: `test-drive`, `consultation`, `deposit`, Required
   - `model` - Text
   - `message` - Long text
   - `status` - Enumeration: `new`, `contacted`, `qualified`, `converted`, `lost`

3. **Click Save**

---

## Bước 3: Configure Permissions

Sau khi tạo xong, Strapi sẽ tự động restart.

1. **Settings** → **Roles** → **Public**
2. Bây giờ bạn sẽ thấy:
   - **CAR-MODEL**: ✓ find, ✓ findOne
   - **LEAD**: ✓ create
3. **Click Save**

---

**Làm theo hướng dẫn này và báo cho tôi khi xong!** ✅
