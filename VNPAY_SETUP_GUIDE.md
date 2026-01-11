# Hướng dẫn Setup Payment Gateway - Chi tiết từng bước

## Bước 1: Đăng ký VNPay Sandbox (5 phút) ✅

### 1.1 Truy cập trang đăng ký
```
🔗 https://sandbox.vnpayment.vn/devreg/
```

### 1.2 Điền form đăng ký
- **Email**: Email của bạn (để nhận thông tin)
- **Số điện thoại**: SĐT liên hệ
- **Tên công ty/cá nhân**: Xe Điện Đức Duy
- **Website**: xedienducduy.id.vn
- **Mô tả**: Website bán xe điện, xe đạp điện

### 1.3 Nhận email xác nhận
Trong vòng 5-10 phút, bạn sẽ nhận email với thông tin:
```
TMN_CODE: VNPAYxxxxxx (Mã merchant của bạn)
HASH_SECRET: xxxxxxxxxxxxxxxxxxxxxxxx (Secret key)
```

### 1.4 Cấu hình trong code

**Backend (.env):**
```bash
VNPAY_TMN_CODE=VNPAYxxxxxx
VNPAY_HASH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://website-ban-xe-dien.onrender.com/api/payment/vnpay/return
FRONTEND_URL=https://xedienducduy.id.vn
```

**Frontend (.env.production):**
```bash
NEXT_PUBLIC_STRAPI_URL=https://website-ban-xe-dien.onrender.com
```

---

## Bước 2: Tích hợp code vào Backend (30 phút)

### 2.1 Tạo Payment API structure

```bash
cd backend
mkdir -p src/api/payment/controllers
mkdir -p src/api/payment/routes
```

### 2.2 Copy code đã cung cấp
- ✅ `src/api/payment/controllers/vnpay.ts` (đã tạo sẵn)
- ✅ `src/api/payment/routes/vnpay.ts` (đã tạo sẵn)

### 2.3 Restart backend
```bash
npm run develop
```

### 2.4 Test API endpoint
```bash
# Test create payment
curl -X POST http://localhost:1337/api/payment/vnpay/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "TEST001",
    "amount": 100000,
    "orderInfo": "Test payment"
  }'

# Kết quả mong đợi: paymentUrl bắt đầu với https://sandbox.vnpayment.vn/...
```

---

## Bước 3: Update Frontend (20 phút)

### 3.1 Tạo helper function

**File: `frontend/lib/vnpay.ts`**
```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function createVNPayPayment(orderCode: string, amount: number, orderInfo: string) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/payment/vnpay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        amount,
        orderInfo,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create payment');
    }

    return result.data;
  } catch (error) {
    console.error('VNPay payment creation error:', error);
    throw error;
  }
}

export async function queryVNPayTransaction(orderCode: string) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/payment/vnpay/query?orderCode=${orderCode}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('VNPay query error:', error);
    throw error;
  }
}
```

### 3.2 Update PaymentGatewaySelector.tsx

Tìm function `handlePlaceOrder` và thêm logic cho VNPay:

```typescript
const handlePlaceOrder = async () => {
  setIsProcessing(true);
  setErrorMessage(null);
  
  try {
    const orderData = getOrderData();
    orderData.PreferredGateway = selectedGateway as any;

    // Create order first
    const result = await createOrder(orderData);

    if (result.data) {
      setCreatedOrder(result.data);

      // If VNPay selected, redirect to VNPay payment page
      if (selectedGateway === 'vnpay') {
        try {
          const vnpayPayment = await createVNPayPayment(
            result.data.OrderCode,
            depositAmount,
            `Thanh toan don hang ${result.data.OrderCode}`
          );
          
          // Redirect to VNPay
          window.location.href = vnpayPayment.paymentUrl;
          return; // Stop here, VNPay will handle the rest
        } catch (error) {
          console.error('VNPay payment error:', error);
          setErrorMessage('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
          return;
        }
      }

      // Other payment methods (Momo/Bank Transfer)
      if (selectedGateway === 'momo') {
        // Keep existing Momo QR code flow
        // ...existing code
      } else {
        // Bank transfer - go to success
        goToNextStep();
        setTimeout(() => goToNextStep(), 1500);
      }
    }
  } catch (error) {
    console.error('Order creation failed:', error);
    setErrorMessage('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
  } finally {
    setIsProcessing(false);
  }
};
```

### 3.3 Tạo Payment Success/Failed pages

**File: `frontend/app/order/success/page.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart
    localStorage.removeItem('cart');
    
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Thanh toán thành công!
          </h1>
          
          <p className="text-muted-foreground mb-2">
            Đơn hàng <span className="text-primary font-bold">#{orderId}</span> đã được xác nhận
          </p>
          
          <p className="text-muted-foreground mb-8">
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/account/orders"
              className="px-6 py-3 bg-primary text-black rounded-full font-bold hover:shadow-glow transition-all"
            >
              Xem đơn hàng
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 text-foreground rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
```

**File: `frontend/app/checkout/payment-failed/page.tsx`**
```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  '07': 'Giao dịch bị nghi ngờ. Vui lòng liên hệ ngân hàng.',
  '09': 'Thẻ chưa đăng ký Internet Banking.',
  '10': 'Xác thực sai quá 3 lần.',
  '11': 'Hết hạn chờ thanh toán.',
  '12': 'Thẻ bị khóa.',
  '13': 'Sai mật khẩu OTP.',
  '24': 'Giao dịch bị hủy.',
  '51': 'Tài khoản không đủ số dư.',
  '65': 'Vượt quá hạn mức giao dịch.',
  '75': 'Ngân hàng đang bảo trì.',
  '79': 'Nhập sai mật khẩu quá số lần quy định.',
  'invalid_signature': 'Chữ ký không hợp lệ.',
  'order_not_found': 'Không tìm thấy đơn hàng.',
  'system_error': 'Lỗi hệ thống.',
};

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const errorCode = searchParams.get('code') || searchParams.get('error') || '99';
  const errorMessage = ERROR_MESSAGES[errorCode] || 'Có lỗi xảy ra trong quá trình thanh toán.';

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Thanh toán thất bại
          </h1>
          
          {orderId && (
            <p className="text-muted-foreground mb-2">
              Đơn hàng <span className="text-primary font-bold">#{orderId}</span>
            </p>
          )}
          
          <p className="text-red-400 mb-2">
            Mã lỗi: {errorCode}
          </p>
          
          <p className="text-muted-foreground mb-8">
            {errorMessage}
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/checkout"
              className="px-6 py-3 bg-primary text-black rounded-full font-bold hover:shadow-glow transition-all"
            >
              Thử lại
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 text-foreground rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## Bước 4: Enable VNPay trên Production

### 4.1 Update PaymentGatewaySelector.tsx

Thay đổi điều kiện hiển thị VNPay:

```typescript
// Thay vì:
{!isProduction && (
  <div onClick={() => setSelectedGateway('vnpay')}>
    VNPay QR
  </div>
)}

// Đổi thành (bật cả production):
<div onClick={() => setSelectedGateway('vnpay')}>
  <div className="w-12 h-12 bg-[#005BAA] rounded-lg flex items-center justify-center shrink-0">
    <CreditCard className="w-6 h-6 text-white" />
  </div>
  <div className="flex-1">
    <SectionHeading>VNPay QR</SectionHeading>
    <p className="text-sm text-muted-foreground">
      Quét mã QR qua ứng dụng ngân hàng
    </p>
  </div>
  {selectedGateway === 'vnpay' && (
    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
      <Check className="w-4 h-4 text-black" />
    </div>
  )}
</div>
```

### 4.2 Update backend .env trên Render

Vào Render.com → Backend service → Environment:
```
VNPAY_TMN_CODE=VNPAYxxxxxx
VNPAY_HASH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://website-ban-xe-dien.onrender.com/api/payment/vnpay/return
VNPAY_IPN_URL=https://website-ban-xe-dien.onrender.com/api/payment/vnpay/ipn
FRONTEND_URL=https://xedienducduy.id.vn
```

---

## Bước 5: Test trên Sandbox

### 5.1 Thẻ test VNPay cung cấp

```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### 5.2 Quy trình test

1. Tạo đơn hàng trên website
2. Chọn "VNPay QR" 
3. Click "Thanh toán & Hoàn tất"
4. Redirect sang trang VNPay Sandbox
5. Chọn "Thanh toán qua thẻ ATM"
6. Nhập thông tin thẻ test
7. Nhập OTP: 123456
8. Xác nhận
9. Redirect về /order/success

### 5.3 Kiểm tra kết quả

- ✅ Order status = PAID
- ✅ PaymentTransaction được tạo
- ✅ Email confirmation được gửi (nếu có)

---

## Bước 6: Chuyển sang Production (Sau 2-3 tháng)

### 6.1 Chuẩn bị hồ sơ

**Cá nhân:**
- CMND/CCCD
- Giấy phép kinh doanh (nếu có)
- Thông tin tài khoản ngân hàng

**Doanh nghiệp:**
- Giấy phép kinh doanh
- Giấy phép thành lập
- Quyết định bổ nhiệm người đại diện
- Thông tin tài khoản doanh nghiệp

### 6.2 Đăng ký Production

```
🔗 https://vnpay.vn/dang-ky-merchant/
```

Điền form và gửi hồ sơ → Đợi 3-5 ngày → Nhận credentials production

### 6.3 Update credentials

```bash
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
VNPAY_TMN_CODE=<NEW_PRODUCTION_CODE>
VNPAY_HASH_SECRET=<NEW_PRODUCTION_SECRET>
```

---

## Tổng kết

✅ **Hiện tại (Development):**
- Dùng VNPay Sandbox - MIỄN PHÍ
- Test với thẻ giả
- Không giới hạn số lượng giao dịch

✅ **Tương lai (Production):**
- Chuyển sang VNPay Production
- Phí: 1.1% - 1.5%
- Thanh toán thực

🎉 **Bắt đầu ngay với Sandbox - Không mất phí!**
