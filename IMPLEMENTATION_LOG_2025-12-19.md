
## 10.x (tiếp) - Siết bảo mật tránh lộ dữ liệu (Order endpoints)

### 10.x.1 - Harden `GET /api/orders/code/:code` để chống dò mã đơn & lộ PII
- Trước đây endpoint này `populate: ['CustomerInfo', ...]` và không yêu cầu xác minh -> rủi ro **order enumeration** và **lộ thông tin cá nhân**.
- Đã đổi sang:
  - Bắt buộc `phone` (query param) để xác minh người tra cứu.
  - Rate-limit theo IP + theo mã đơn (dùng chung logic như `trackOrder`).
  - Không phân biệt "mã đúng nhưng sai SĐT" (đều trả 404) để tránh leak tồn tại.
  - Chỉ trả về payload tối thiểu (không trả `CustomerInfo`).

### 10.x.2 - Khoá `POST /api/orders/:id/status` tránh bị public chỉnh trạng thái
- Custom route trước đây không có auth/policy -> có thể bị gọi không xác thực.
- Đã:
  - Set `auth: true` cho route.
  - Trong controller `updateStatus`: yêu cầu user đăng nhập và role dạng admin (role name/type có chứa `admin`).

### 10.x.3 - Đồng bộ frontend & giảm log nhạy cảm
- `getOrderByCode(orderCode)` đổi sang yêu cầu thêm `phone` và gọi endpoint đã siết.
- Gỡ debug log dump dữ liệu đơn hàng trong hàm admin `getOrderById`.
- Ở checkout, log "Submitting order" chỉ bật ở non-production để tránh lộ PII trên console người dùng.

### 10.x.4 - Cập nhật UI/UX OTP (không gợi ý OTP cố định) + hiển thị lỗi rate-limit
- Xoá hint "Nhập 123456" trên form OTP (OTP hiện là ngẫu nhiên/expiry).
- `sendOtp`/`verifyOtp` ở frontend chuyển sang parse message từ backend và throw lỗi rõ ràng (đặc biệt trường hợp 429 có `retryAfterSec`).

### 10.x.5 - Chặn mass-assignment khi tạo đơn + trả `my-orders` dạng safe payload
- `POST /api/orders` (create order): chỉ whitelist field được phép từ client; không cho client tự set `Customer`, `InternalNotes`, `Statuses`, `PaymentStatus`, giá tiền...
- Nếu user đã đăng nhập (OTP/member) thì tự gắn `Customer = ctx.state.user.id` để `my-orders` hoạt động đúng.
- `GET /api/orders/my-orders`: trả danh sách đơn dạng safe payload (không trả `InternalNotes` / `TrackingHistory`).

### 10.x.6 - Giảm bề mặt tấn công: gỡ custom routes thừa
- Gỡ `GET /api/orders/code/:code` và `POST /api/orders/:id/status` khỏi custom routes (không còn cần thiết; tracking + core CRUD đã đủ).

# Nhật ký triển khai (2025-12-19)

Mục tiêu: áp dụng các tối ưu SEO/SSR/ISR đã đề xuất cho website bán xe đạp điện/xe máy điện, đồng thời ghi lại thay đổi để dễ nhìn lại.

## 1) Chuyển trang sản phẩm sang SSR/ISR

### 1.1 Trang danh sách `/cars`
- Trước đây: [frontend/app/cars/page.tsx](frontend/app/cars/page.tsx) là client component, fetch dữ liệu bằng `useEffect`.
- Sau khi làm:
  - Đổi [frontend/app/cars/page.tsx](frontend/app/cars/page.tsx) thành **server component** để fetch dữ liệu ở server (SSR/ISR).
  - Tách phần UI tương tác (filter drawer, pagination, skeleton…) sang **client component** mới:
    - [frontend/app/cars/CarsPageClient.tsx](frontend/app/cars/CarsPageClient.tsx)

Lợi ích:
- SEO tốt hơn (HTML có dữ liệu sẵn).
- Tốc độ tải tốt hơn nhờ cache ISR.

### 1.2 Trang chi tiết `/cars/[slug]`
- Trước đây: [frontend/app/cars/[slug]/page.tsx](frontend/app/cars/[slug]/page.tsx) là client component, có nhiều `console.log` debug.
- Sau khi làm:
  - Đổi sang **server component** + `export const revalidate = 60`.
  - Tính discount từ promotions ở server.
  - `ProductSchema` dùng `NEXT_PUBLIC_SITE_URL` để tránh hardcode.

## 2) Tối ưu fetch/caching trong `lib/api.ts`

File: [frontend/lib/api.ts](frontend/lib/api.ts)

- Thêm helper `getDefaultFetchOptions()`:
  - Nếu chạy ở server: dùng `next: { revalidate: ... }`.
  - Nếu chạy ở client: dùng `cache: 'no-store'`.
- Áp dụng helper cho các hàm quan trọng: `getCars`, `getCarBySlug`, `getRelatedCars`, `getCarsBySlugs`, `getFeaturedCars`, `getCarById`.
- Bỏ `console.log` debug ở `getArticleBySlug`.
- Bỏ fallback `Math.random()` để tránh id thay đổi; thay bằng id ổn định dựa trên `id/documentId/slug`.

## 3) Sitemap/Robots động + dùng biến môi trường

### 3.1 Sitemap
File: [frontend/app/sitemap.ts](frontend/app/sitemap.ts)
- Trước đây: hardcode slug cho cars/blog.
- Sau khi làm:
  - Sinh sitemap **động** từ Strapi:
    - `/api/car-models?fields[0]=slug`
    - `/api/articles?fields[0]=Slug`
  - Có hàm `fetchAllSlugs()` để tự phân trang.
  - Dùng `NEXT_PUBLIC_SITE_URL` thay vì hardcode.

### 3.2 Robots
File: [frontend/app/robots.ts](frontend/app/robots.ts)
- Dùng `NEXT_PUBLIC_SITE_URL` để tạo link sitemap.

## 4) Blog dùng ISR thay vì force-dynamic

- [frontend/app/blog/page.tsx](frontend/app/blog/page.tsx)
- [frontend/app/blog/[slug]/page.tsx](frontend/app/blog/[slug]/page.tsx)

Thay đổi:
- Bỏ `dynamic = 'force-dynamic'`.
- Bật `revalidate = 60`.

## 5) Chuẩn hoá metadata trong layout

File: [frontend/app/layout.tsx](frontend/app/layout.tsx)
- `openGraph.url` dùng `NEXT_PUBLIC_SITE_URL` để tránh hardcode.
- `html lang="vi"` vì website tiếng Việt.

## 6) Sửa link tin tức trên homepage

File: [frontend/components/sections/LatestNews.tsx](frontend/components/sections/LatestNews.tsx)

- Sửa route từ `/tin-tuc` → `/blog` để tránh link 404 (project hiện dùng App Router route `/blog`).

## 7) Giảm noise log khi build (Strapi offline)

File: [frontend/lib/api.ts](frontend/lib/api.ts)

- Thêm cơ chế nhận biết phase `next build` (qua `process.env.NEXT_PHASE`).
- Khi build mà Strapi không chạy (ECONNREFUSED), sẽ **không in `console.error`** cho các fetch public (`getArticles`, `getPromotions`, `getCarsWithMeta`, `getArticleBySlug`) để log CI sạch hơn.

## 8) Chuẩn hoá `isFeatured` vs `featured` (tránh lệch schema Strapi)

File: [frontend/lib/api.ts](frontend/lib/api.ts)

- `getFeaturedCars()` dùng filter `$or` để lấy xe nổi bật theo cả 2 field: `isFeatured` hoặc `featured`.
- `transformStrapiCar()` map `isFeatured` từ nhiều biến thể (`isFeatured/IsFeatured/featured/Featured`).

## 9) Chuẩn hoá quan hệ Promotion ↔ CarModel (Strapi many-to-many)

Files:
- [backend/src/api/promotion/content-types/promotion/schema.json](backend/src/api/promotion/content-types/promotion/schema.json)
- [backend/src/api/car-model/content-types/car-model/schema.json](backend/src/api/car-model/content-types/car-model/schema.json)

Thay đổi:
- Đổi `promotion.car_models` từ `oneToMany` → `manyToMany` và thêm `inversedBy: "promotions"`.
- Thêm field `car-model.promotions` (many-to-many) với `mappedBy: "car_models"`.

Ghi chú triển khai:
- Cần restart Strapi để schema được load lại.
- Nếu database đang có dữ liệu cũ, kiểm tra lại liên kết xe trong Promotion sau khi restart (tuỳ cách Strapi sync schema trong môi trường của bạn).

---

## Checklist sau khi merge/deploy

1. Tạo/đặt biến môi trường ở frontend:
   - `NEXT_PUBLIC_STRAPI_URL`
   - `NEXT_PUBLIC_SITE_URL`
2. Test nhanh:
   - `/cars` hiển thị sản phẩm và lọc/sort hoạt động.
   - `/cars/[slug]` hiển thị đúng dữ liệu + khuyến mãi.
   - `/sitemap.xml` có đủ URL (cars + blog).
   - `/robots.txt` trỏ đúng sitemap theo domain.

## Gợi ý bước tiếp theo

- (Đã làm) Nâng cấp phân trang `/cars` để lấy `meta.pagination.pageCount/total` từ Strapi (chuẩn xác số trang):
  - Thêm `getCarsWithMeta()` trong [frontend/lib/api.ts](frontend/lib/api.ts) để trả về `{ cars, pagination }`.
  - Cập nhật [frontend/app/cars/page.tsx](frontend/app/cars/page.tsx) và [frontend/app/cars/CarsPageClient.tsx](frontend/app/cars/CarsPageClient.tsx) để dùng `pagination.pageCount` thay vì heuristic.
- Chuẩn hoá field `isFeatured` vs `featured` trong Strapi để tránh trùng.
- Chuẩn hoá Promotion ↔ CarModel (cân nhắc many-to-many nếu cần).

---

## 10) Cứng hoá luồng thương mại (mua xe) cho sát thực tế

Mục tiêu: tránh lệch với schema Strapi hiện tại (Order chỉ hỗ trợ 1 `VehicleModel`), đồng thời giảm rủi ro bảo mật và sai số tính tiền.

### 10.1 Ép “1 đơn = 1 xe” ở frontend
Files:
- [frontend/lib/cart-context.tsx](frontend/lib/cart-context.tsx)
- [frontend/app/cart/page.tsx](frontend/app/cart/page.tsx)
- [frontend/app/checkout/page.tsx](frontend/app/checkout/page.tsx)

Thay đổi:
- Khi add xe mới vào giỏ mà đã có xe khác: hỏi xác nhận để thay thế (tránh multi-item mà backend không xử lý được).
- Quantity luôn tối đa 1; nếu legacy localStorage còn > 1 item thì chặn checkout và hướng dẫn quay lại giỏ.

### 10.2 Tính giá/khuyến mãi/VAT ở backend khi tạo đơn
File: [backend/src/api/order/controllers/order.ts](backend/src/api/order/controllers/order.ts)

Thay đổi:
- Khi tạo đơn: backend tự tìm Promotion đang active + chưa hết hạn + có liên kết với xe và lấy `discountPercent` lớn nhất.
- Tính `discount`, `priceAfterDiscount`, `vat = 10%`, `totalAmount`.
- Online flow không cộng phí trước bạ/biển số vào thanh toán (set = 0) vì thường xử lý riêng khi đăng ký.
- Tính `depositAmount` “thực tế”:
  - Đặt cọc: cố định 3,000,000 (nhưng không vượt quá total)
  - Thanh toán đủ: = total
  - Trả góp: tạm tính 30% total
- Trả thêm `meta.pricing` trong response để frontend có thể hiển thị breakdown đồng nhất.

### 10.3 Cứng hoá Payment API: verify theo orderCode + phone, tắt mock confirm ở production
Files:
- [backend/src/api/payment/controllers/payment.ts](backend/src/api/payment/controllers/payment.ts)
- [backend/src/api/payment/services/payment.ts](backend/src/api/payment/services/payment.ts)

Thay đổi:
- `/payments/create`: yêu cầu `{ orderCode, phone }` và chỉ tạo payment nếu phone khớp với đơn.
- `/payments/status/:id`: yêu cầu query `orderCode` + `phone` trước khi trả trạng thái.
- `/payments/mock-confirm`: bị chặn khi `NODE_ENV=production`.
- Số tiền của payment ưu tiên dùng `DepositAmount` (fallback `TotalAmount`) để đúng “đặt cọc”.

### 10.4 Cập nhật frontend theo payment verify
Files:
- [frontend/lib/order-api.ts](frontend/lib/order-api.ts)
- [frontend/components/checkout/PaymentModal.tsx](frontend/components/checkout/PaymentModal.tsx)
- [frontend/components/checkout/PaymentGatewaySelector.tsx](frontend/components/checkout/PaymentGatewaySelector.tsx)
- [frontend/components/checkout/OrderSuccess.tsx](frontend/components/checkout/OrderSuccess.tsx)
- [frontend/components/account/OrderItem.tsx](frontend/components/account/OrderItem.tsx)

Thay đổi:
- PaymentModal dùng `orderCode + phone` để tạo/poll/confirm payment.
- Ở production chỉ bật “Chuyển khoản ngân hàng” (tắt MoMo/VNPay) để tránh chọn gateway chưa tích hợp.
- UI ưu tiên hiển thị `DepositAmount/TotalAmount` từ backend thay vì tự tính lại.

Ghi chú thêm:
- Ở bước hiển thị QR, amount sẽ ưu tiên lấy từ `result.data.DepositAmount` hoặc `meta.pricing.depositAmount` sau khi tạo đơn (tránh lệch so với tạm tính ở client).

### 10.5 Dọn text hardcode khuyến mãi
File: [frontend/components/checkout/PaymentMethodSelector.tsx](frontend/components/checkout/PaymentMethodSelector.tsx)

Thay đổi:
- Bỏ text cố định “Ưu đãi giảm 5% (đã áp dụng)” → chuyển sang thông điệp chung “Ưu đãi theo chương trình hiện hành (nếu có)”.

### 10.6 Giảm rủi ro lộ OTP/PII qua API
File: [backend/src/api/order/controllers/order.ts](backend/src/api/order/controllers/order.ts)

Thay đổi:
- `sendOtp`: không trả `mockOtp` về client nữa (tránh lộ mã).
- `trackOrder`: giảm log chứa số điện thoại/chi tiết dữ liệu nhạy cảm.

### 10.7 Chống spam OTP (rate-limit/throttle)
File: [backend/src/api/order/controllers/order.ts](backend/src/api/order/controllers/order.ts)

Thay đổi:
- `sendOtp`:
  - Limit theo IP: tối đa 10 lần / 10 phút, và chống bấm liên tục (cooldown 10 giây).
  - Limit theo số điện thoại: tối đa 3 lần / 10 phút, cooldown 60 giây.
  - Khi bị chặn: trả HTTP `429` + header `Retry-After`.
- `verifyOtp`:
  - Limit theo số điện thoại: tối đa 10 lần / 10 phút, cooldown 2 giây.
  - Khi bị chặn: trả HTTP `429` + header `Retry-After`.

Ghi chú:
- Đây là rate-limit **in-memory** (nhanh, không cần Redis/plugin). Nếu deploy nhiều instance, mỗi instance sẽ có bộ đếm riêng; khi cần scale lớn, nên chuyển sang Redis-based rate-limit.

### 10.8 OTP ngẫu nhiên + hết hạn + one-time-use
File: [backend/src/api/order/controllers/order.ts](backend/src/api/order/controllers/order.ts)

Thay đổi:
- `sendOtp`:
  - Sinh OTP ngẫu nhiên 6 chữ số.
  - OTP có hạn 5 phút và mỗi lần gửi sẽ ghi đè OTP cũ.
  - Non-production: trả thêm `mockOtp` để test nhanh.
  - Production: không trả OTP về client (chuẩn bị cho tích hợp SMS provider).
- `verifyOtp`:
  - Check OTP theo số điện thoại + hạn.
  - Sai tối đa 5 lần cho 1 OTP thì khoá và yêu cầu gửi OTP mới.
  - OTP đúng sẽ bị xoá (one-time-use).

  ### 10.9 Chống dò mã đơn qua tra cứu (rate-limit + không leak tồn tại)
  File: [backend/src/api/order/controllers/order.ts](backend/src/api/order/controllers/order.ts)

  Thay đổi:
  - `trackOrder` (`/order-tracking/lookup`):
    - Rate-limit theo IP: tối đa 30 lần / phút + cooldown 1 giây.
    - Rate-limit theo mã đơn: tối đa 10 lần / 10 phút + cooldown 3 giây.
    - Khi vượt limit: trả HTTP `429` + `Retry-After`.
    - Nếu sai số điện thoại: trả `Order not found` (404) thay vì báo “sai SĐT” để tránh leak việc mã đơn có tồn tại.
