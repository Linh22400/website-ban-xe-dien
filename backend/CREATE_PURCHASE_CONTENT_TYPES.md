# Hướng dẫn tạo Content Types cho Hệ thống Đặt cọc/Mua xe

## 📋 Tổng quan

Bạn cần tạo 4 content types/components sau trong Strapi:
1. **Showroom** (Đại lý bán hàng)
2. **Customer Details Component** (Thông tin khách hàng)
3. **Order** (Đơn hàng)
4. **Payment Transaction** (Giao dịch thanh toán)

**LƯU Ý**: Cần tạo theo đúng thứ tự trên vì các content type sau có quan hệ (relation) với content type trước.

---

## Bước 1: Tạo Showroom Content Type

### 1.1 Vào Content-Type Builder
1. Mở Strapi Admin: `http://localhost:1337/admin`
2. Click **Content-Type Builder** (biểu tượng hộp bên trái)
3. Click **Create new collection type**

### 1.2 Cấu hình cơ bản
- **Display name**: `Showroom`
- Click **Continue**

### 1.3 Thêm các fields

Thêm lần lượt các field sau (Click **Add another field** sau mỗi field):

#### Text Fields:
1. **Name** (Text - Short text)
   - Name: `Name`
   - Type: Short text
   - ✅ Required field

2. **Code** (Text - Short text)
   - Name: `Code`
   - Type: Short text
   - ✅ Unique field

3. **Address** (Text - Long text)
   - Name: `Address`
   - Type: Long text
   - ✅ Required field

4. **City** (Text - Short text)
   - Name: `City`
   - Type: Short text
   - ✅ Required field

5. **District** (Text - Short text)
   - Name: `District`
   - Type: Short text

6. **Phone** (Text - Short text)
   - Name: `Phone`
   - Type: Short text

7. **Email** (Email)
   - Name: `Email`
   - Type: Email

8. **Manager** (Text - Short text)
   - Name: `Manager`
   - Type: Short text

#### Number Fields:
9. **Latitude** (Number - Decimal)
   - Name: `Latitude`
   - Type: Decimal

10. **Longitude** (Number - Decimal)
    - Name: `Longitude`
    - Type: Decimal

#### JSON Field:
11. **WorkingHours** (JSON)
    - Name: `WorkingHours`
    - Type: JSON
    - Default value:
    ```json
    {
      "monday": "8:00 - 18:00",
      "tuesday": "8:00 - 18:00",
      "wednesday": "8:00 - 18:00",
      "thursday": "8:00 - 18:00",
      "friday": "8:00 - 18:00",
      "saturday": "8:00 - 17:00",
      "sunday": "9:00 - 17:00"
    }
    ```

12. **Inventory** (JSON)
    - Name: `Inventory`
    - Type: JSON
    - Default value: `{}`

#### Boolean Field:
13. **IsActive** (Boolean)
    - Name: `IsActive`
    - Type: Boolean
    - Default value: `true`

#### Media Field:
14. **Images** (Media)
    - Name: `Images`
    - Type: Multiple media
    - Allowed types: Images only

#### Rich Text Field:
15. **Description** (Rich text)
    - Name: `Description`
    - Type: Rich text

### 1.4 Advanced Settings
- Click **Advanced Settings** tab
- ✅ Enable **Draft & Publish**
- Click **Finish**
- Click **Save** (nút góc trên phải)

---

## Bước 2: Tạo Customer Details Component

### 2.1 Tạo Component Category
1. Trong **Content-Type Builder**, click **Create new component**
2. **Category**: Nhập `order` (tạo category mới)
3. **Name**: `CustomerDetails`
4. Click **Continue**

### 2.2 Thêm các fields

1. **FullName** (Text - Short text)
   - Name: `FullName`
   - ✅ Required field

2. **Phone** (Text - Short text)
   - Name: `Phone`
   - ✅ Required field
   - Regex: `^(84|0[3|5|7|8|9])+([0-9]{8})$`

3. **Email** (Email)
   - Name: `Email`
   - ✅ Required field

4. **IdCard** (Text - Short text)
   - Name: `IdCard`

5. **DeliveryAddress** (Text - Long text)
   - Name: `DeliveryAddress`
   - ✅ Required field

6. **City** (Text - Short text)
   - Name: `City`

7. **District** (Text - Short text)
   - Name: `District`

8. **Ward** (Text - Short text)
   - Name: `Ward`

### 2.3 Finish
- Click **Finish**
- Click **Save**

---

## Bước 3: Tạo Order Content Type

### 3.1 Create Collection Type
1. Click **Create new collection type**
2. **Display name**: `Order`
3. Click **Continue**

### 3.2 Thêm các fields

#### Text Fields:
1. **OrderCode** (Text - Short text)
   - Name: `OrderCode`
   - ✅ Required field
   - ✅ Unique field
   - Regex: `^DH\d{6,}$`

2. **SelectedColor** (Text - Short text)
   - Name: `SelectedColor`

3. **SelectedBattery** (Text - Short text)
   - Name: `SelectedBattery`

4. **Notes** (Text - Long text)
   - Name: `Notes`

5. **InternalNotes** (Text - Long text)
   - Name: `InternalNotes`

#### Enumeration Fields:
6. **Status** (Enumeration)
   - Name: `Status`
   - ✅ Required field
   - Values (nhập từng dòng):
     ```
     pending_payment
     deposit_paid
     processing
     ready_for_pickup
     completed
     cancelled
     refunded
     ```
   - Default value: `pending_payment`

7. **PaymentMethod** (Enumeration)
   - Name: `PaymentMethod`
   - ✅ Required field
   - Values:
     ```
     full_payment
     deposit
     installment
     ```

8. **PaymentStatus** (Enumeration)
   - Name: `PaymentStatus`
   - Values:
     ```
     pending
     partial
     completed
     failed
     refunded
     ```
   - Default value: `pending`

#### Number Fields (Decimal):
9. **BasePrice** (Number - Decimal)
   - Name: `BasePrice`
   - ✅ Required field

10. **Discount** (Number - Decimal)
    - Name: `Discount`
    - Default value: `0`

11. **RegistrationFee** (Number - Decimal)
    - Name: `RegistrationFee`
    - Default value: `0`

12. **LicensePlateFee** (Number - Decimal)
    - Name: `LicensePlateFee`
    - Default value: `0`

13. **TotalAmount** (Number - Decimal)
    - Name: `TotalAmount`
    - ✅ Required field

14. **DepositAmount** (Number - Decimal)
    - Name: `DepositAmount`
    - Default value: `0`

15. **RemainingAmount** (Number - Decimal)
    - Name: `RemainingAmount`

#### JSON Fields:
16. **SelectedGifts** (JSON)
    - Name: `SelectedGifts`
    - Default value: `[]`

17. **InstallmentPlan** (JSON)
    - Name: `InstallmentPlan`

18. **TrackingHistory** (JSON)
    - Name: `TrackingHistory`
    - Default value: `[]`

#### Date Fields:
19. **AppointmentDate** (Date - datetime)
    - Name: `AppointmentDate`
    - Type: datetime

20. **DeliveryDate** (Date - date)
    - Name: `DeliveryDate`
    - Type: date

21. **CompletedDate** (Date - datetime)
    - Name: `CompletedDate`
    - Type: datetime

#### Component Field:
22. **CustomerInfo** (Component)
    - Name: `CustomerInfo`
    - Component: `order.CustomerDetails`
    - Type: Single component
    - ✅ Required field

#### Relation Fields:
23. **VehicleModel** (Relation)
    - Name: `VehicleModel`
    - Relation type: Many to One
    - Target: Car Model
    - (Bên Car Model sẽ có field `orders` tự động)

24. **Customer** (Relation)
    - Name: `Customer`
    - Relation type: Many to One
    - Target: User (from: users-permissions)

25. **SelectedShowroom** (Relation)
    - Name: `SelectedShowroom`
    - Relation type: Many to One
    - Target: Showroom

#### Media Field:
26. **Documents** (Media)
    - Name: `Documents`
    - Type: Multiple media
    - Allowed types: Images, Files, Videos

### 3.3 Advanced Settings
- Click **Advanced Settings** tab
- ❌ KHÔNG enable Draft & Publish
- Click **Finish**
- Click **Save**

---

## Bước 4: Tạo Payment Transaction Content Type

### 4.1 Create Collection Type
1. Click **Create new collection type**
2. **Display name**: `PaymentTransaction`
3. Click **Continue**

### 4.2 Thêm các fields

#### Text Fields:
1. **TransactionId** (Text - Short text)
   - Name: `TransactionId`
   - ✅ Required field
   - ✅ Unique field

2. **Currency** (Text - Short text)
   - Name: `Currency`
   - Default value: `VND`

3. **RefundReason** (Text - Long text)
   - Name: `RefundReason`

#### Enumeration Fields:
4. **Gateway** (Enumeration)
   - Name: `Gateway`
   - ✅ Required field
   - Values:
     ```
     momo
     zalopay
     vnpay
     viettel_money
     visa
     mastercard
     bank_transfer
     ```

5. **Status** (Enumeration)
   - Name: `Status`
   - Values:
     ```
     pending
     processing
     success
     failed
     cancelled
     refunded
     ```
   - Default value: `pending`

#### Number Field:
6. **Amount** (Number - Decimal)
   - Name: `Amount`
   - ✅ Required field

#### Date Field:
7. **RefundedAt** (Date - datetime)
   - Name: `RefundedAt`

#### JSON Fields:
8. **GatewayResponse** (JSON)
   - Name: `GatewayResponse`

9. **Metadata** (JSON)
   - Name: `Metadata`

#### Relation Field:
10. **Order** (Relation)
    - Name: `Order`
    - Relation type: Many to One
    - Target: Order
    - Field name in "Order": `PaymentTransactions` (sẽ tự động tạo)

### 4.3 Advanced Settings
- Click **Advanced Settings** tab
- ❌ KHÔNG enable Draft & Publish
- Click **Finish**
- Click **Save**

---

## Bước 5: Cấu hình Permissions

### 5.1 Order Permissions
1. Vào **Settings** → **Roles** → **Public**
2. Mở rộng **Order**
3. ✅ Chọn:
   - `create` (để khách có thể tạo đơn hàng)
   - `find` (xem danh sách - sẽ filter theo user)
   - `findOne` (xem chi tiết một đơn)
4. Click **Save**

### 5.2 Authenticated Role
1. Vào **Authenticated** role
2. Mở rộng **Order**
3. ✅ Chọn:
   - `find`
   - `findOne`
   - `update` (để user có thể hủy đơn)
4. Click **Save**

### 5.3 Showroom Permissions
1. Vào **Public** role
2. Mở rộng **Showroom**
3. ✅ Chọn:
   - `find`
   - `findOne`
4. Click **Save**

### 5.4 Payment Transaction Permissions
- Không cần cấp quyền public (chỉ admin và API có quyền)

---

## Bước 6: Thêm dữ liệu mẫu

### 6.1 Thêm Showroom
1. Vào **Content Manager** → **Showroom**
2. Click **Create new entry**
3. Điền thông tin:
   ```
   Name: VinFast Hà Nội
   Code: HN01
   Address: 123 Phố Huế, Hai Bà Trưng, Hà Nội
   City: Hà Nội
   District: Hai Bà Trưng
   Latitude: 21.0285
   Longitude: 105.8542
   Phone: 024.3xxx.xxxx
   Email: hanoi@banxedien.com
   Manager: Nguyễn Văn A
   IsActive: true
   ```
4. Click **Save** và **Publish**

Lặp lại với thêm 2-3 showroom khác (TP.HCM, Đà Nẵng...)

---

## Bước 7: Test API

### 7.1 Test Showroom API
Mở browser hoặc Postman:
```
GET http://localhost:1337/api/showrooms?populate=*
```

Kết quả mong đợi:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "Name": "VinFast Hà Nội",
        "Code": "HN01",
        ...
      }
    }
  ]
}
```

### 7.2 Test Order Creation (sẽ test sau khi có custom controller)
```
POST http://localhost:1337/api/orders
```

---

## ✅ Checklist hoàn thành

- [ ] Đã tạo Showroom content type với tất cả fields
- [ ] Đã tạo Customer Details component
- [ ] Đã tạo Order content type với tất cả fields và relations
- [ ] Đã tạo Payment Transaction content type
- [ ] Đã cấu hình permissions cho Public và Authenticated roles
- [ ] Đã thêm ít nhất 2 showroom mẫu
- [ ] Đã test API showrooms thành công

---

## 🔧 Troubleshooting

### Lỗi "Cannot create relation"
- Đảm bảo content type đích đã được tạo trước
- Save và restart Strapi nếu cần

### Lỗi "Field already exists"
- Kiểm tra tên field không trùng lặp
- Xóa field cũ trước khi tạo lại

### Không thấy component trong dropdown
- Đảm bảo đã save component trước
- Refresh lại trang Content-Type Builder

---

## 📝 Ghi chú

- Sau khi tạo xong tất cả content types, Strapi sẽ tự động restart
- Các file schema sẽ được lưu trong `backend/src/api/`
- Nếu cần sửa sau, có thể edit trực tiếp trong Content-Type Builder
- Backup database thường xuyên trước khi thay đổi schema

---

**Bước tiếp theo**: Sau khi hoàn thành, chúng ta sẽ tạo custom API controllers để xử lý logic đặt cọc và thanh toán.
