# Tài Liệu Tính Năng Đã Triển Khai

> **Dự án**: Website bán xe điện TAILG  
> **Ngày hoàn thành**: 26/12/2025  
> **Tổng số tính năng**: 5 Priority Features

---

## 📋 Tổng Quan

Dự án đã hoàn thành **5 tính năng ưu tiên** để nâng cao trải nghiệm khách hàng và tính năng của website bán xe điện TAILG, bao gồm:

1. ✅ **Review & Rating System** - Hệ thống đánh giá và nhận xét
2. ✅ **Trade-in Program** - Chương trình thu cũ đổi mới
3. ✅ **Service Booking System** - Đặt lịch bảo dưỡng/sửa chữa
4. ✅ **Notification System** - Hệ thống thông báo realtime
5. ✅ **Enhanced ROI Calculator & Comparison** - Máy tính ROI và so sánh TCO

---

## 🎯 Task 1: Review & Rating System

### Mục đích
Cho phép khách hàng đánh giá và nhận xét về sản phẩm, xây dựng lòng tin và cung cấp thông tin cho người mua tiềm năng.

### Backend Files

#### 1. Schema
**File**: `backend/src/api/review/content-types/review/schema.json`
- **Thuộc tính chính**:
  - `Rating`: 1-5 sao (required)
  - `Title`: Tiêu đề đánh giá
  - `Comment`: Nội dung chi tiết
  - `VerifiedPurchase`: Boolean - kiểm tra có mua hàng thực tế không
  - `IsApproved`: Boolean - admin duyệt trước khi hiển thị
  - `HelpfulCount`: Số người thấy hữu ích
  - `Images`: Media uploads (max 5 ảnh)
- **Relations**:
  - `Customer` → User (manyToOne)
  - `CarModel` → Car-Model (manyToOne)
  - `Order` → Order (manyToOne) - để verify purchase

#### 2. Controller
**File**: `backend/src/api/review/controllers/review.ts`
- **Methods**:
  - `create()`: Tạo review mới
    - Kiểm tra duplicate (1 user chỉ review 1 xe 1 lần)
    - Tự động verify nếu user đã mua xe đó
    - Set `IsApproved = false` (cần admin duyệt)
  - `findByCarModel()`: Lấy reviews theo xe
    - Trả về danh sách reviews đã approved
    - Tính rating statistics (average, distribution)
    - Pagination: 10 reviews/page
  - `markHelpful()`: Tăng HelpfulCount
    - Chỉ auth user mới mark được
    - Có thể implement track "đã mark" để tránh spam

#### 3. Routes
**File**: `backend/src/api/review/routes/custom-review.ts`
- `POST /reviews/create` - Tạo review (auth required)
- `GET /reviews/car-model/:id` - Lấy reviews theo xe
- `POST /reviews/:id/helpful` - Mark helpful (auth required)

### Frontend Files

#### 1. RatingStars Component
**File**: `frontend/components/product/RatingStars.tsx`
- **Props**:
  - `rating`: number (0-5)
  - `maxRating`: number (default 5)
  - `size`: 'sm' | 'md' | 'lg'
  - `showNumber`: boolean
  - `interactive`: boolean (cho input mode)
  - `onChange`: (rating) => void
- **Features**:
  - Display mode: Hiển thị sao vàng theo rating
  - Input mode: Click để chọn rating
  - Half-star support cho display
  - Responsive size

#### 2. ReviewList Component
**File**: `frontend/components/product/ReviewList.tsx`
- **Features**:
  - Rating distribution chart (bar chart % theo từng mức sao)
  - Average rating lớn với RatingStars
  - Danh sách reviews với:
    - Avatar + tên reviewer
    - Rating stars + tiêu đề
    - Verified purchase badge (✓ Đã mua hàng)
    - Comment content
    - Images gallery (grid layout)
    - Helpful button với count
    - Timestamp (relative time)
  - Pagination (Load more)
  - Empty state khi chưa có review

#### 3. ReviewForm Component
**File**: `frontend/components/product/ReviewForm.tsx`
- **Form fields**:
  - Rating: Interactive stars (required)
  - Title: Text input
  - Comment: Textarea (required)
  - Images: Upload max 5 ảnh
- **Validation**:
  - Required fields
  - Rating 1-5
  - Comment min length
- **Features**:
  - Preview uploaded images
  - Remove image
  - Submit with loading state
  - Success/error messages
  - Auth check (redirect to login if not logged in)

### Integration
- **Trang chi tiết sản phẩm**: `frontend/components/sections/CarConfigurator.tsx`
  - Section "Đánh Giá Từ Khách Hàng"
  - ReviewForm (collapsed by default, expand to write)
  - ReviewList (hiển thị tất cả reviews)

### API Endpoints
```
POST   /api/reviews/create                    # Tạo review mới
GET    /api/reviews/car-model/:id             # Lấy reviews theo xe
        ?page=1&pageSize=10
POST   /api/reviews/:id/helpful               # Mark helpful
```

---

## 🔄 Task 2: Trade-in Program

### Mục đích
Cho phép khách hàng định giá xe cũ để thu cũ đổi mới, tăng conversion rate và tạo nguồn xe cũ cho showroom.

### Backend Files

#### 1. Schema
**File**: `backend/src/api/trade-in/content-types/trade-in/schema.json`
- **Thông tin xe cũ**:
  - `VehicleBrand`: Hãng xe
  - `VehicleModel`: Model/tên xe
  - `PurchaseYear`: Năm mua
  - `CurrentMileage`: Số km đã chạy
  - `Condition`: enum [excellent, good, fair, poor]
  - `BatteryHealth`: 0-100%
  - `HasAccidents`: Boolean
  - `HasModifications`: Boolean
  - `AdditionalNotes`: Text
- **Thông tin định giá**:
  - `EstimatedValue`: Giá ước tính (VNĐ)
  - `Status`: enum [pending, reviewed, approved, rejected, completed]
  - `AdminNotes`: Ghi chú từ admin
  - `AppraisalValue`: Giá thẩm định cuối cùng từ admin
- **Images**: Upload max 10 ảnh (toàn cảnh, chi tiết, battery, v.v.)
- **Relations**:
  - `User` → User
  - `InterestedInModel` → Car-Model (xe muốn đổi)

#### 2. Controller
**File**: `backend/src/api/trade-in/controllers/trade-in.ts`
- **Methods**:
  - `create()`: Tạo trade-in request
    - Gọi calculateEstimatedValue() để tính giá ước tính
    - Set status = 'pending'
  - `findByUser()`: Lấy danh sách trade-ins của user
    - Pagination
    - Sort by newest first
  - `updateStatus()`: Admin cập nhật status + appraisal value
  - `calculateEstimatedValue()`: **Thuật toán tính giá**
    ```javascript
    baseValue = 10,000,000 VNĐ (base cho xe điện)
    
    // 1. Depreciation by age (10%/year, max 50%)
    age = currentYear - purchaseYear
    ageDepreciation = min(age * 0.10, 0.50)
    
    // 2. Condition multiplier
    conditionMultipliers = {
      excellent: 1.0,
      good: 0.85,
      fair: 0.65,
      poor: 0.45
    }
    
    // 3. Mileage deduction (1% per 1000km over 5000km, max 30%)
    if (mileage > 5000) {
      mileageDeduction = min((mileage - 5000) / 1000 * 0.01, 0.30)
    }
    
    // 4. Battery health multiplier
    batteryMultiplier = batteryHealth / 100
    
    // 5. Accidents deduction (-20%)
    accidentDeduction = hasAccidents ? 0.20 : 0
    
    // 6. Modifications deduction (-10%)
    modDeduction = hasModifications ? 0.10 : 0
    
    // Final calculation
    value = baseValue 
          * (1 - ageDepreciation)
          * conditionMultipliers[condition]
          * (1 - mileageDeduction)
          * batteryMultiplier
          * (1 - accidentDeduction)
          * (1 - modDeduction)
    ```

#### 3. Routes
**File**: `backend/src/api/trade-in/routes/custom-trade-in.ts`
- `POST /trade-ins/create` - Tạo trade-in request (auth)
- `GET /trade-ins/user/my-trade-ins` - Lấy danh sách của user (auth)
- `PUT /trade-ins/:id/status` - Admin cập nhật status (admin only)

### Frontend Files

#### 1. TradeInForm Component
**File**: `frontend/components/forms/TradeInForm.tsx`
- **Form sections**:
  - Thông tin xe cũ:
    - Brand, Model, Year
    - Mileage (km)
    - Condition (select: Xuất sắc/Tốt/Khá/Kém)
    - Battery health (slider 0-100%)
    - Checkboxes: Có tai nạn, Có độ xe
  - Xe muốn đổi: Select từ danh sách xe hiện có
  - Upload ảnh: 10 slots với preview
  - Ghi chú thêm: Textarea
- **Features**:
  - Real-time value estimation (gọi API calculate)
  - Hiển thị giá ước tính lớn, nổi bật
  - Validation tất cả fields
  - Image preview với remove
  - Loading states
- **Submit**: POST /trade-ins/create

#### 2. TradeInList Component
**File**: `frontend/components/account/TradeInList.tsx`
- **Display**:
  - Card layout cho từng trade-in
  - Thông tin xe: Brand, Model, Year, Mileage
  - Status badge với màu:
    - Pending: Yellow
    - Reviewed: Blue
    - Approved: Green
    - Rejected: Red
    - Completed: Gray
  - Estimated value vs Appraisal value
  - Admin notes (nếu có)
  - Timestamp
  - View images button (modal gallery)
- **Pagination**: 10 per page
- **Empty state**: "Chưa có yêu cầu thu cũ đổi mới"

### Pages
1. **`frontend/app/trade-in/page.tsx`** - Landing page + Form
   - Hero section giới thiệu chương trình
   - TradeInForm component
   - Benefits section
   - How it works steps

2. **`frontend/app/account/trade-ins/page.tsx`** - User dashboard
   - TradeInList component
   - Filter by status
   - Sort options

### API Endpoints
```
POST   /api/trade-ins/create                  # Tạo trade-in request
GET    /api/trade-ins/user/my-trade-ins       # Lấy danh sách của user
        ?page=1&pageSize=10
PUT    /api/trade-ins/:id/status              # Admin update (admin only)
        body: { status, appraisalValue, adminNotes }
POST   /api/trade-ins/calculate-value         # Tính giá ước tính
        body: { purchaseYear, mileage, condition, batteryHealth, hasAccidents, hasModifications }
```

---

## 🔧 Task 3: Service Booking System

### Mục đích
Cho phép khách hàng đặt lịch bảo dưỡng, sửa chữa tại showroom, tăng doanh thu dịch vụ sau bán hàng.

### Backend Files

#### 1. Schema
**File**: `backend/src/api/service-booking/content-types/service-booking/schema.json`
- **Service types** (enum):
  - `maintenance` - Bảo dưỡng định kỳ
  - `repair` - Sửa chữa
  - `battery-replacement` - Thay thế pin
  - `inspection` - Kiểm tra tổng quát
  - `warranty` - Bảo hành
  - `emergency` - Khẩn cấp
- **Booking info**:
  - `ServiceType`: enum (required)
  - `ServiceDate`: Date (required)
  - `ServiceTime`: String (HH:mm format)
  - `Description`: Text - mô tả vấn đề
  - `EstimatedCost`: Number (VNĐ)
  - `Status`: enum [pending, confirmed, in-progress, completed, cancelled]
  - `Notes`: Admin notes
  - `ActualCost`: Number - chi phí thực tế sau khi hoàn thành
- **Relations**:
  - `User` → User
  - `VehicleModel` → Car-Model
  - `Showroom` → Showroom

#### 2. Controller
**File**: `backend/src/api/service-booking/controllers/service-booking.ts`
- **Methods**:
  - `create()`: Tạo booking mới
    - Validate date (không được trong quá khứ)
    - Check slot availability
    - Estimate cost based on service type
    - Set status = 'pending'
  - `findByUser()`: Lấy bookings của user
    - Filter by status
    - Pagination
    - Sort by date (upcoming first)
  - `getAvailableSlots()`: Lấy time slots khả dụng
    - Input: date, showroomId
    - Return: Array of available time slots
    - Logic:
      ```javascript
      // Working hours: 9 AM - 5 PM
      allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      
      // Get bookings for that date + showroom
      bookedSlots = await getBookedSlots(date, showroomId)
      
      // Filter out booked slots
      availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot))
      ```
  - `estimateCost()`: Ước tính chi phí
    ```javascript
    const costEstimates = {
      'maintenance': 200000,      // 200k
      'repair': 500000,           // 500k
      'battery-replacement': 3000000, // 3M
      'inspection': 100000,       // 100k
      'warranty': 0,              // Free
      'emergency': 800000         // 800k
    }
    ```
  - `updateStatus()`: Admin/staff cập nhật status

#### 3. Routes
**File**: `backend/src/api/service-booking/routes/custom-service-booking.ts`
- `POST /service-bookings/create` - Tạo booking (auth)
- `GET /service-bookings/user/my-bookings` - Lấy bookings của user (auth)
- `GET /service-bookings/available-slots` - Lấy slots khả dụng
  - Query: `date`, `showroomId`
- `POST /service-bookings/estimate-cost` - Ước tính chi phí
  - Body: `{ serviceType }`
- `PUT /service-bookings/:id/status` - Update status (staff/admin)

### Frontend Files

#### 1. ServiceBookingForm Component
**File**: `frontend/components/forms/ServiceBookingForm.tsx`
- **Form fields**:
  - Service type: Radio buttons với icon + mô tả
  - Vehicle model: Select từ xe của user (hoặc input manual)
  - Showroom: Select từ danh sách showrooms
  - Service date: Date picker (không cho chọn quá khứ)
  - Service time: Select từ available slots (gọi API real-time)
  - Description: Textarea
  - Estimated cost: Hiển thị auto khi chọn service type
- **Features**:
  - Dynamic time slot loading khi chọn date + showroom
  - Cost estimation preview
  - Validation
  - Disabled dates/times
  - Success redirect to booking list

#### 2. ServiceBookingList Component
**File**: `frontend/components/account/ServiceBookingList.tsx`
- **Display**:
  - Card layout với service type icon
  - Vehicle model
  - Showroom name + address
  - Date & time (formatted)
  - Status badge:
    - Pending: Yellow "Chờ xác nhận"
    - Confirmed: Blue "Đã xác nhận"
    - In-progress: Orange "Đang thực hiện"
    - Completed: Green "Hoàn thành"
    - Cancelled: Red "Đã hủy"
  - Description + Notes
  - Cost: Estimated vs Actual
  - Actions:
    - Cancel button (if pending/confirmed)
    - View details
- **Filter tabs**: All | Upcoming | Completed | Cancelled
- **Pagination**: 10 per page

### Pages
1. **`frontend/app/services/page.tsx`** - Landing page + Form
   - Hero: Giới thiệu dịch vụ bảo dưỡng
   - Service types grid (6 types với icon + description)
   - ServiceBookingForm
   - Why choose us section
   - Contact info

2. **`frontend/app/account/services/page.tsx`** - User dashboard
   - ServiceBookingList component
   - Quick book button

### API Endpoints
```
POST   /api/service-bookings/create           # Tạo booking
GET    /api/service-bookings/user/my-bookings # Lấy bookings của user
        ?page=1&pageSize=10&status=pending
GET    /api/service-bookings/available-slots  # Lấy time slots
        ?date=2025-12-26&showroomId=1
POST   /api/service-bookings/estimate-cost    # Ước tính chi phí
        body: { serviceType }
PUT    /api/service-bookings/:id/status       # Update status
        body: { status, notes, actualCost }
```

---

## 🔔 Task 4: Notification System

### Mục đích
Thông báo real-time cho khách hàng về orders, service bookings, trade-ins, promotions, v.v.

### Backend Files

#### 1. Schema
**File**: `backend/src/api/notification/content-types/notification/schema.json`
- **Notification Types** (14 types):
  - `order-created` - Đơn hàng được tạo
  - `order-confirmed` - Đơn hàng được xác nhận
  - `order-shipped` - Đơn hàng đang giao
  - `order-delivered` - Đã giao hàng
  - `order-cancelled` - Đơn hàng bị hủy
  - `service-confirmed` - Lịch dịch vụ được xác nhận
  - `service-reminder` - Nhắc lịch dịch vụ (1 ngày trước)
  - `service-completed` - Hoàn thành dịch vụ
  - `trade-in-appraised` - Xe đã được thẩm định
  - `trade-in-accepted` - Chấp nhận trade-in
  - `promotion` - Khuyến mãi mới
  - `review-response` - Admin phản hồi review
  - `maintenance-reminder` - Nhắc bảo dưỡng định kỳ
  - `general` - Thông báo chung
- **Fields**:
  - `Type`: enum (required)
  - `Title`: String (required)
  - `Message`: Text (required)
  - `IsRead`: Boolean (default false)
  - `Link`: String - URL để view detail
  - `Data`: JSON - metadata linh hoạt
  - `EmailSent`: Boolean
  - `EmailSentAt`: DateTime
- **Relations**:
  - `User` → User (required)
  - `RelatedOrder` → Order (optional)
  - `RelatedService` → Service-Booking (optional)
  - `RelatedTradeIn` → Trade-In (optional)

#### 2. Controller
**File**: `backend/src/api/notification/controllers/notification.ts`
- **Methods**:
  - `create()`: Tạo notification
    - Required: userId, type, title, message
    - Optional: link, data, relatedOrder, relatedService, relatedTradeIn
  - `findByUser()`: Lấy notifications của user
    - Query params:
      - `page`: default 1
      - `pageSize`: default 20
      - `unreadOnly`: boolean (filter unread)
    - Sort: newest first
    - Return: { notifications, page, pageSize, total, totalPages }
  - `markAsRead()`: Đánh dấu 1 notification đã đọc
    - Validate ownership
    - Set IsRead = true
  - `markAllAsRead()`: Đánh dấu tất cả unread thành read
    - Bulk update
    - Return count updated
  - `getUnreadCount()`: Đếm số notifications chưa đọc
    - Return: { count: number }
  - `deleteNotification()`: Xóa notification
    - Validate ownership
- **Helper Function** (export để dùng ở controllers khác):
  ```javascript
  export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      link?: string,
      data?: any,
      relatedOrder?: number,
      relatedService?: number,
      relatedTradeIn?: number
    }
  )
  ```

#### 3. Routes
**Standard**: `backend/src/api/notification/routes/notification.ts`
- CRUD routes cho admin

**Custom**: `backend/src/api/notification/routes/custom-notification.ts`
- `GET /notifications/user/my-notifications` - User notifications (paginated)
- `GET /notifications/user/unread-count` - Badge count
- `PUT /notifications/:id/read` - Mark single as read
- `PUT /notifications/user/mark-all-read` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

### Frontend Files

#### 1. NotificationBell Component
**File**: `frontend/components/common/NotificationBell.tsx`
- **Features**:
  - Bell icon với badge (red circle với số unread)
  - Click mở dropdown
  - Dropdown:
    - Width: 400px
    - Max height: 600px (scrollable)
    - Z-index: 20
    - Click outside to close
  - Hiển thị 10 notifications gần nhất
  - Item format:
    - Type icon (emoji)
    - Title (bold)
    - Message (truncated)
    - Timestamp (relative: "5 phút trước")
    - Visual: Unread có bg blue-50
    - Actions: Mark as read, Delete, View detail (link)
  - Footer: "Xem tất cả" link to /account/notifications
  - Bulk action: "Đánh dấu tất cả đã đọc" button
- **Real-time Updates**:
  - Polling mỗi 30 giây để fetch unread count
  - useEffect with interval, cleanup on unmount
  - Auto refetch khi dropdown mở
- **State**:
  - `notifications`: Array
  - `unreadCount`: Number
  - `isOpen`: Boolean
  - `loading`: Boolean

#### 2. NotificationCenter Component
**File**: `frontend/components/account/NotificationCenter.tsx`
- **Full page management**:
  - Header: Title + "Đánh dấu tất cả đã đọc" button
  - Filter tabs: All | Unread
  - Notification cards:
    - Type icon (Package, Wrench, RefreshCw, Calendar, MessageSquare, Bell)
    - Color coding:
      - Order: Blue
      - Service: Purple
      - Trade-in: Green
      - Reminder: Orange
      - Review: Pink
      - General: Gray
    - Title + Message (full text)
    - Timestamp (localized vi-VN)
    - Visual: Unread có border blue-300 + bg blue-50
    - Actions: Mark as read button, Delete button, View detail link
  - Pagination: 20 per page
    - Previous/Next buttons
    - Page indicator: "Trang 1 / 5"
  - Empty states
  - Loading states
- **State**:
  - `notifications`: Array
  - `page`: Number
  - `totalPages`: Number
  - `filter`: 'all' | 'unread'
  - `loading`: Boolean

#### 3. Integration
**File**: `frontend/components/ui/Navbar.tsx`
- Added NotificationBell between ThemeToggle and ShoppingCart
- Position: Right side action icons
- Only visible when user is authenticated (checked inside component)

### Pages
**`frontend/app/account/notifications/page.tsx`**
- Metadata: Title, description
- Layout: Header + NotificationCenter component

### API Endpoints
```
# User endpoints (auth required)
GET    /api/notifications/user/my-notifications  # Paginated list
        ?page=1&pageSize=20&unreadOnly=false
GET    /api/notifications/user/unread-count      # Badge counter
PUT    /api/notifications/:id/read                # Mark single read
PUT    /api/notifications/user/mark-all-read     # Bulk mark read
DELETE /api/notifications/:id                     # Delete notification

# Admin endpoints
POST   /api/notifications                         # Create notification
GET    /api/notifications                         # List all (admin)
GET    /api/notifications/:id                     # Get single
DELETE /api/notifications/:id                     # Admin delete
```

### Usage Examples (for developers)

**Trigger notification when order confirmed**:
```javascript
// In backend/src/api/order/controllers/order.ts
import { createNotification } from '../../notification/controllers/notification';

// After confirming order
await createNotification(
  userId,
  'order-confirmed',
  'Đơn hàng đã được xác nhận',
  `Đơn hàng #${orderId} đã được xác nhận và đang được xử lý.`,
  {
    link: `/account/orders/${orderId}`,
    relatedOrder: orderId
  }
);
```

**Service reminder (cron job)**:
```javascript
// In scheduled task
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const upcomingBookings = await getBookingsForDate(tomorrow);

for (const booking of upcomingBookings) {
  await createNotification(
    booking.userId,
    'service-reminder',
    'Nhắc lịch bảo dưỡng',
    `Bạn có lịch hẹn vào ngày mai lúc ${booking.serviceTime} tại ${booking.showroom.name}`,
    {
      link: `/account/services/${booking.id}`,
      relatedService: booking.id
    }
  );
}
```

---

## 💰 Task 5: Enhanced ROI Calculator & Comparison

### Mục đích
Giúp khách hàng đưa ra quyết định thông minh bằng cách so sánh chi phí tổng thể (TCO) xe điện vs xe xăng, phân tích ROI và tác động môi trường.

### Components (Frontend Only - No Backend)

#### 1. ROICalculator Component
**File**: `frontend/components/calculators/ROICalculator.tsx`
- **Input Fields**:
  - **Xe điện**:
    - Giá xe điện (VNĐ) - default 15M
    - Giá điện (VNĐ/kWh) - default 2,500
  - **Xe xăng**:
    - Giá xe xăng (VNĐ) - default 30M
    - Giá xăng (VNĐ/lít) - default 25,000
  - **Sử dụng chung**:
    - Quãng đường mỗi ngày (km) - default 30
    - Thời gian sử dụng (năm) - default 5
- **Calculation Logic**:
  ```javascript
  // ELECTRIC VEHICLE
  totalKm = dailyKm * 365 * years
  evConsumption = 0.015 kWh/km
  evElectricity = totalKm * evConsumption * electricityRate
  evMaintenance = 500,000 VNĐ/year * years
  evInsurance = 1,000,000 VNĐ/year * years
  evTotal = electricPrice + evElectricity + evMaintenance + evInsurance
  
  // GASOLINE VEHICLE
  gasolineConsumption = 2.5 liters/100km
  gasolineFuel = (totalKm / 100) * gasolineConsumption * gasolinePrice
  gasolineMaintenance = 2,000,000 VNĐ/year * years
  gasolineInsurance = 1,500,000 VNĐ/year * years
  gasolineTotal = gasolinePrice + gasolineFuel + gasolineMaintenance + gasolineInsurance
  
  // SAVINGS & BREAK-EVEN
  savings = gasolineTotal - evTotal
  monthlySavings = (gasolineFuel - evElectricity + gasolineMaintenance - evMaintenance) / (years * 12)
  priceDifference = electricPrice - gasolinePrice
  breakEvenMonths = priceDifference / monthlySavings (if priceDifference > 0)
  ```
- **Display Output**:
  - 3 summary cards:
    - Tổng chi phí xe điện (green gradient)
    - Tổng chi phí xe xăng (orange gradient)
    - Tiết kiệm được (blue gradient)
  - Break-even banner:
    - "Xe điện rẻ hơn ngay từ đầu!" (if negative difference)
    - "Sau X tháng, bạn sẽ bắt đầu tiết kiệm" (if positive)
  - Detailed breakdown (2 columns):
    - Xe điện: Purchase, Electricity, Maintenance, Insurance
    - Xe xăng: Purchase, Fuel, Maintenance, Insurance
  - Environmental impact preview:
    - CO2 saved (kg)
    - 0% toxic emissions
    - 100% clean energy

#### 2. TCOChart Component
**File**: `frontend/components/calculators/TCOChart.tsx`
- **Library**: Recharts
- **Props**: electricPrice, gasolinePrice, electricityRate, gasolineRate, dailyKm, years
- **Chart 1: Cumulative Cost Over Time** (Line Chart)
  - X-axis: Months (0 to years * 12)
  - Y-axis: Cumulative cost (VNĐ, formatted as millions)
  - 2 lines:
    - Green: Electric vehicle cumulative cost
    - Orange: Gasoline vehicle cumulative cost
  - Break-even point marker:
    - Blue dot với label "Hòa vốn"
    - Highlight khi 2 đường giao nhau
  - Data calculation:
    ```javascript
    // Generate monthly data
    for (month = 0; month <= years * 12; month++) {
      if (month === 0) {
        evCumulative = electricPrice
        gasolineCumulative = gasolinePrice
      } else {
        evCumulative += monthlyEvCost
        gasolineCumulative += monthlyGasolineCost
      }
      data.push({ month, evCost: evCumulative, gasolineCost: gasolineCumulative })
    }
    ```
- **Chart 2: Cost Breakdown Comparison** (Bar Chart)
  - Categories: Mua xe, Năng lượng, Bảo dưỡng, Bảo hiểm
  - 2 bars per category:
    - Green: Electric
    - Orange: Gasoline
  - Y-axis: Cost (VNĐ, millions)
  - Shows clear comparison of each cost component
- **Chart 3: Savings Over Time** (Area Line Chart)
  - X-axis: Months
  - Y-axis: Savings (VNĐ)
  - Blue line: Cumulative savings (gasolineCost - evCost)
  - Gradient fill under line
  - Footer: Total savings after X years (large number)
- **Responsive**: ResponsiveContainer, height 300-400px per chart

#### 3. EnvironmentalImpact Component
**File**: `frontend/components/calculators/EnvironmentalImpact.tsx`
- **Props**: dailyKm, years
- **Calculations**:
  ```javascript
  totalKm = dailyKm * 365 * years
  
  // CO2 emissions
  gasolineCO2PerKm = 0.12 kg (120g)
  electricCO2PerKm = 0.05 kg (50g from VN power grid)
  co2Saved = (gasolineCO2PerKm - electricCO2PerKm) * totalKm
  
  // Trees equivalent (1 tree absorbs ~20kg CO2/year)
  treesEquivalent = (co2Saved / 20) rounded
  
  // Fuel saved
  gasolineConsumption = 2.5 liters/100km
  fuelSaved = (totalKm / 100) * gasolineConsumption
  
  // Air pollutants avoided
  noxSaved = totalKm * 0.0002 kg
  pmSaved = totalKm * 0.00005 kg  // PM2.5/PM10
  coSaved = totalKm * 0.001 kg    // Carbon monoxide
  ```
- **Display Sections**:
  1. **Main Impact** (2 cards):
     - CO2 reduction card (green):
       - Large number: X kg CO2 saved
       - Comparison: Gasoline emits X kg vs Electric X kg
     - Trees equivalent card (blue):
       - Large number: X trees
       - Description: "Tương đương trồng X cây trong Y năm"
  2. **Fuel Saved** (4 metrics):
     - Liters of gasoline saved (orange)
     - 0% fossil fuel (blue)
     - 100% clean energy (green)
     - Money saved on fuel (purple)
  3. **Air Pollutants Avoided** (3 cards):
     - NOx (red): Gây bệnh hô hấp
     - PM (yellow): Gây ung thư phổi
     - CO (orange): Gây ngộ độc
     - Each shows grams avoided
  4. **Benefits Summary** (gradient card):
     - 5 bullet points:
       - Zero direct emissions
       - Reduce noise pollution (70% quieter)
       - High energy efficiency (77% vs 20%)
       - Net Zero 2050 contribution
       - Protect community health
  5. **Call to Action** (white card):
     - Message về đóng góp môi trường

#### 4. TCOComparison Component
**File**: `frontend/components/compare/TCOComparison.tsx`
- **Purpose**: So sánh TCO của nhiều xe cùng lúc (dành cho trang Compare)
- **Props**: cars (Array of Car objects)
- **Input Section** (same as ROICalculator):
  - Daily km, years, electricity rate, gasoline price
  - Calculate button
- **Results Display**:
  - **Best Value Banner**: Highlight xe có tổng chi phí thấp nhất (green gradient, 🏆)
  - **Comparison Cards** (grid layout):
    - Each car gets a card
    - Best value card has green border + ring
    - Card content:
      - Car name
      - Total cost over X years (large blue number)
      - Monthly cost
      - Breakdown: Purchase, Energy, Maintenance, Insurance
      - Savings vs gasoline equivalent (green box):
        - "Tiết kiệm X VNĐ" hoặc "Chi phí thêm X VNĐ"
        - Percentage
  - **Comparison Table**:
    - Columns: Xe, Giá mua, Năng lượng, Bảo dưỡng, Tổng cộng, Tiết kiệm
    - Rows: Each car
    - Best value row has green background
    - Icons: Zap (electric) or Fuel (gasoline)
  - **Summary Box** (blue):
    - Total distance over X years
    - Cost savings facts
    - Energy efficiency comparison
- **Calculation**:
  - Same TCO formula as ROICalculator
  - Compare each car against equivalent gasoline vehicle (30M VNĐ base)
  - Sort by total cost (lowest first)

### Pages

#### 1. Calculator Standalone Page
**File**: `frontend/app/calculator/page.tsx`
- **Metadata**:
  - Title: "Máy Tính ROI - So Sánh Chi Phí Xe Điện & Xe Xăng | TAILG"
  - Description: SEO optimized
  - Keywords: ROI, TCO, so sánh xe điện xe xăng
- **Layout**:
  - Hero header: Title + description
  - ROICalculator component
  - EnvironmentalImpact component (with default values: 30km/day, 5 years)
  - Info box: Disclaimer về tính toán
- **URL**: `/calculator`

### Integrations

#### 1. Car Detail Page
**File**: `frontend/components/sections/CarConfigurator.tsx`
- **Section**: "Phân Tích Chi Phí Tổng Thể (TCO)"
- **Components**:
  1. ROICalculator (interactive form)
  2. TCOChart (với giá xe từ props)
     - electricPrice = car.price
     - gasolinePrice = 30M (default)
     - Các params khác: default values
  3. EnvironmentalImpact (default 30km/day, 5 years)
- **Position**: Sau Reviews section, trước Sticky Action Bar
- **Background**: bg-gray-50 để phân biệt

#### 2. Compare Page
**File**: `frontend/app/compare/page.tsx`
- **Condition**: Hiển thị khi có >= 2 xe để compare
- **Section**: "So Sánh Chi Phí Tổng Thể (TCO)"
- **Component**: TCOComparison với cars prop
- **Position**: Sau ComparisonTable
- **Layout**: Full width container

### Key Features
- **No Backend Required**: Tất cả tính toán trên client-side
- **Real-time Calculation**: Update ngay khi thay đổi inputs
- **Interactive Charts**: Hover to see details, responsive
- **Comprehensive Analysis**: Cost + Environment + ROI
- **Comparison Support**: Multiple vehicles side-by-side
- **Realistic Assumptions**:
  - EV consumption: 15 Wh/km (realistic for electric scooters)
  - Gasoline consumption: 2.5L/100km (average scooter)
  - Maintenance costs based on industry averages
  - CO2 from VN electricity grid: ~50g/km
  - Gasoline direct emissions: ~120g/km

---

## 📊 Tổng Kết Files

### Backend Files (24 files)

#### Reviews
- `backend/src/api/review/content-types/review/schema.json`
- `backend/src/api/review/controllers/review.ts`
- `backend/src/api/review/routes/review.ts`
- `backend/src/api/review/routes/custom-review.ts`
- `backend/src/api/review/services/review.ts`

#### Trade-ins
- `backend/src/api/trade-in/content-types/trade-in/schema.json`
- `backend/src/api/trade-in/controllers/trade-in.ts`
- `backend/src/api/trade-in/routes/trade-in.ts`
- `backend/src/api/trade-in/routes/custom-trade-in.ts`
- `backend/src/api/trade-in/services/trade-in.ts`

#### Service Bookings
- `backend/src/api/service-booking/content-types/service-booking/schema.json`
- `backend/src/api/service-booking/controllers/service-booking.ts`
- `backend/src/api/service-booking/routes/service-booking.ts`
- `backend/src/api/service-booking/routes/custom-service-booking.ts`
- `backend/src/api/service-booking/services/service-booking.ts`

#### Notifications
- `backend/src/api/notification/content-types/notification/schema.json`
- `backend/src/api/notification/controllers/notification.ts`
- `backend/src/api/notification/routes/notification.ts`
- `backend/src/api/notification/routes/custom-notification.ts`
- `backend/src/api/notification/services/notification.ts`

### Frontend Files (27 files)

#### Review Components
- `frontend/components/product/RatingStars.tsx`
- `frontend/components/product/ReviewList.tsx`
- `frontend/components/product/ReviewForm.tsx`

#### Trade-in Components & Pages
- `frontend/components/forms/TradeInForm.tsx`
- `frontend/components/account/TradeInList.tsx`
- `frontend/app/trade-in/page.tsx`
- `frontend/app/account/trade-ins/page.tsx`

#### Service Booking Components & Pages
- `frontend/components/forms/ServiceBookingForm.tsx`
- `frontend/components/account/ServiceBookingList.tsx`
- `frontend/app/services/page.tsx`
- `frontend/app/account/services/page.tsx`

#### Notification Components & Pages
- `frontend/components/common/NotificationBell.tsx`
- `frontend/components/account/NotificationCenter.tsx`
- `frontend/app/account/notifications/page.tsx`

#### Calculator Components & Pages
- `frontend/components/calculators/ROICalculator.tsx`
- `frontend/components/calculators/TCOChart.tsx`
- `frontend/components/calculators/EnvironmentalImpact.tsx`
- `frontend/components/compare/TCOComparison.tsx`
- `frontend/app/calculator/page.tsx`

#### Integrations (Modified)
- `frontend/components/ui/Navbar.tsx` (Added NotificationBell)
- `frontend/components/sections/CarConfigurator.tsx` (Added ROI Calculator section)
- `frontend/app/compare/page.tsx` (Added TCO Comparison)

---

## 🔧 Ghi Chú Kỹ Thuật

### TypeScript Fixes Applied
1. **Strapi v5 Entity Service Type Issues**:
   - Added `@ts-ignore` annotations for all `strapi.entityService.create/findMany/update/delete` calls
   - Reason: Strapi v5 type definitions không match với actual API
   - Location: Tất cả backend controllers

2. **Auth Context Property**:
   - Changed from `jwt` to `token` trong `useAuth()` hook
   - Files affected: TradeInForm, TradeInList, ServiceBookingForm, ServiceBookingList, ReviewForm
   - Reason: AuthContext type definition uses `token` property

3. **Recharts Formatter Types**:
   - Formatter functions accept `value: number | undefined`
   - Added undefined checks: `value ? formatValue(value) : ''`
   - Location: TCOChart component tooltips

4. **Car ID Types**:
   - Car.id is `string` (from Strapi document ID)
   - TCOResult interface uses `carId: string` not `number`
   - Conversion: `String(car.id)` when mapping

### Dependencies Added
```json
{
  "recharts": "^2.x.x"  // For interactive charts in TCO analysis
}
```

### Environment Variables (if needed)
```env
# No additional env vars needed
# All calculations are client-side for Task 5
```

### Database Migrations
- No migrations needed (Strapi auto-generates tables from schemas)
- Strapi will create:
  - `reviews` table
  - `trade_ins` table
  - `service_bookings` table
  - `notifications` table
  - Junction tables for relations

### Real-time Approach
- **Polling** (not WebSocket/SSE)
- Interval: 30 seconds
- Reason: Simpler implementation, sufficient for notifications
- Location: NotificationBell component useEffect

### Future Improvements (Not Implemented)
1. **Email Notifications**: Schema có EmailSent field nhưng chưa implement SMTP
2. **Push Notifications**: Browser push API integration
3. **WebSocket**: Real-time notifications thay vì polling
4. **Review Images Optimization**: Compress/resize trước khi upload
5. **Trade-in Image Recognition**: AI để auto-detect vehicle condition
6. **Service Slot Overbooking**: Multiple bookings per slot (staff capacity)
7. **Advanced ROI**: Include battery replacement cost, resale value, incentives
8. **Environmental Dashboard**: Track collective CO2 savings của tất cả customers

---

## 📝 Cách Sử Dụng Tài Liệu Này

### For Developers
- **Adding Features**: Tham khảo structure và patterns đã dùng
- **Bug Fixing**: Check API endpoints và data flow
- **Integration**: Xem usage examples (ví dụ: createNotification helper)

### For Project Managers
- **Feature Overview**: Section đầu mỗi task
- **Progress Tracking**: Checkmarks ✅ indicate completion
- **File References**: Biết files nào liên quan đến tính năng nào

### For Testers
- **API Endpoints**: Test từng endpoint với params/body documented
- **User Flows**: Hiểu được journey của user qua các tính năng
- **Edge Cases**: Validation rules, permissions, constraints

### For Future Maintenance
- **Quick Reference**: Tìm file cần sửa theo task
- **Dependencies**: Biết component nào phụ thuộc component nào
- **Calculations**: Công thức tính toán ROI, trade-in value, v.v.

---

## 🎓 Best Practices Learned

1. **Modular Structure**: Mỗi task tách biệt rõ ràng (API, Components, Pages)
2. **Reusable Components**: RatingStars, NotificationBell có thể dùng ở nhiều nơi
3. **Helper Functions**: createNotification() export để dùng cross-controllers
4. **Type Safety**: TypeScript interfaces cho tất cả data structures
5. **User Experience**: Loading states, empty states, error handling
6. **Real-time Updates**: Polling cho notifications, auto-refresh data
7. **Responsive Design**: Mobile-first, grid layouts, responsive charts
8. **SEO Optimization**: Metadata cho mọi pages
9. **Accessibility**: Proper labels, ARIA attributes (can be improved)
10. **Documentation**: Inline comments, clear naming conventions

---

**Tài liệu này được tạo tự động vào 26/12/2025**  
**Liên hệ**: Developer team để cập nhật hoặc đóng góp

