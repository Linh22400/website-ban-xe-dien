# ⚡ Tạo Nhanh Content Types

## 1. Tạo Car Model

**Content-Type Builder** → **+ Create new collection type**

```
Display name: Car Model
```

**Thêm các fields sau (click + Add another field):**

| Field Type | Name | Settings |
|------------|------|----------|
| Text | name | Required, Unique |
| UID | slug | Attached to: name, Required |
| Text | brand | Required |
| Enumeration | type | Values: `bicycle`, `motorcycle`, Required |
| Number | price | Decimal, Required |
| Number | range | Integer, Required |
| Number | topSpeed | Integer, Required |
| Text | description | Long text, Required |
| Boolean | featured | Default: false |
| Media | thumbnail | Single, Images only |

**Colors Component:**
- Click **Component** → **Create new component**
- Category: `product`, Name: `color`
- Add 2 fields:
  - Text: `name` (Required)
  - Text: `hex` (Required)
- ✓ Repeatable component

**Click Save** → Đợi rebuild

---

## 2. Tạo Lead

**+ Create new collection type**

```
Display name: Lead
```

**Thêm fields:**

| Field Type | Name | Settings |
|------------|------|----------|
| Text | name | Required |
| Email | email | Required |
| Text | phone | Required |
| Enumeration | type | Values: `test-drive`, `consultation`, `deposit`, Required |
| Text | model | - |
| Text | message | Long text |

**Click Save** → Đợi rebuild

---

## 3. Configure Permissions

**Settings** → **Roles** → **Public**

Bây giờ sẽ thấy:
- **CAR-MODEL**: ✓ find, ✓ findOne
- **LEAD**: ✓ create

**Click Save**

---

**Làm từng bước và báo khi xong!** ✅
