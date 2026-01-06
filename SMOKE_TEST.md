# Smoke test (Strapi public endpoints)

Mục tiêu: kiểm tra nhanh các endpoint public quan trọng sau khi siết bảo mật/anti-spam:
- Newsletter subscribe
- OTP send/verify + `my-orders`
- Order tracking (lookup)
- Payment create/status

Script chạy được trên Windows PowerShell.

## 1) Chuẩn bị

- Chạy Strapi backend (local/staging):
  - Trong thư mục `backend`: `npm run develop` (hoặc `npm run start` ở production)
- Xác định base URL (ví dụ local): `http://localhost:1337`

## 2) Chạy smoke test

### 2.1 Newsletter (an toàn, không cần OTP)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -StrapiUrl "http://localhost:1337"
```

### 2.2 OTP (khuyến nghị chạy trên non-production)

- Non-production: có thể dùng `-SendOtp` để script tự lấy `mockOtp` từ response.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -StrapiUrl "http://localhost:1337" -Phone "0912345678" -SendOtp
```

- Production: **không** trả `mockOtp`. Bạn phải tự nhập OTP thật qua `-Otp`.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -StrapiUrl "https://your-strapi-domain" -Phone "0912345678" -Otp "123456"
```

Script sẽ verify OTP và gọi `GET /api/orders/my-orders` bằng JWT nhận được.

### 2.3 Tracking + Payment (cần có đơn thật)

Bạn cần `OrderCode` và `Phone` đúng theo đơn trong DB.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -StrapiUrl "http://localhost:1337" -Phone "0912345678" -OrderCode "DH123456789" 
```

### 2.4 Test rate-limit (chỉ chạy trên staging/local)

- Gửi liên tiếp newsletter (2 lần nhanh) để quan sát `429 Retry-After`.
- Gửi tracking sai SĐT để đảm bảo trả `404` và không leak tồn tại.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -StrapiUrl "http://localhost:1337" -Phone "0912345678" -OrderCode "DH123456789" -TestRateLimit
```

## 3) Biến môi trường (tuỳ chọn)

Bạn có thể set env thay vì truyền tham số:
- `STRAPI_URL`
- `SMOKE_EMAIL`
- `SMOKE_PHONE`
- `SMOKE_OTP`
- `SMOKE_ORDER_CODE`

Ví dụ:

```powershell
$env:STRAPI_URL="http://localhost:1337";
$env:SMOKE_PHONE="0912345678";
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1 -SendOtp
```

## 4) Kỳ vọng kết quả

- `[PASS]` với status `200`
- `[WARN]` với status `429` (bình thường khi test throttle/rate-limit)
- Tracking sai SĐT: kỳ vọng `404` (không leak mã đơn tồn tại)

Nếu gặp `[FAIL]`:
- Kiểm tra Strapi đang chạy và đúng URL
- Kiểm tra custom routes vẫn đăng ký (OTP/tracking/payment/newsletter)
- Kiểm tra permissions/role của `users-permissions` (đặc biệt JWT issue và `authenticated` role)
