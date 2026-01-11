# Hướng dẫn tích hợp Payment Gateway cho Production

## Tình trạng hiện tại

**Code hiện tại đang dùng:**
- ✅ QR code test (mock) cho development
- ✅ Chuyển khoản ngân hàng (manual)
- ⚠️ MoMo và VNPay chỉ bật ở development mode

**Flow thanh toán:**
1. User chọn payment method (full/deposit/installment)
2. User chọn payment gateway (MoMo/VNPay/Bank Transfer)
3. Tạo order → Hiển thị QR code → Poll payment status
4. Success → Redirect

---

## So sánh các Payment Gateway ở Việt Nam

### 1. **VNPay** (Khuyên dùng cho bắt đầu)

**Ưu điểm:**
- ✅ **MIỄN PHÍ đăng ký Sandbox** (test environment)
- ✅ Hỗ trợ QR code, thẻ ATM, thẻ quốc tế, ví điện tử
- ✅ Tài liệu API đầy đủ tiếng Việt
- ✅ Không cần giấy phép kinh doanh để test Sandbox
- ✅ Phí thấp khi lên production: 1.1% - 1.5%

**Nhược điểm:**
- ⚠️ Cần đăng ký doanh nghiệp để lên production
- ⚠️ Thời gian duyệt hồ sơ: 3-5 ngày làm việc

**Phí production:**
- QR VNPay: 1.1%
- Thẻ ATM nội địa: 1.2%
- Thẻ Visa/Master: 1.5%

**Link đăng ký Sandbox:**
- 🔗 https://sandbox.vnpayment.vn/devreg/
- Chỉ cần email và thông tin cá nhân

---

### 2. **MoMo**

**Ưu điểm:**
- ✅ Phổ biến với người dùng trẻ
- ✅ Có Sandbox miễn phí
- ✅ API đơn giản
- ✅ Hỗ trợ App2App (mở app MoMo tự động)

**Nhược điểm:**
- ⚠️ Chỉ dùng ví MoMo (không hỗ trợ thẻ ngân hàng)
- ⚠️ Cần GPKD để đăng ký production
- ⚠️ Phí cao hơn VNPay: 2.5% - 3%

**Phí production:**
- Giao dịch thông thường: 2.5%
- Giao dịch nhỏ (< 500k): 3%

**Link đăng ký Sandbox:**
- 🔗 https://developers.momo.vn/
- Đăng ký partner, chọn "Test Environment"

---

### 3. **ZaloPay**

**Ưu điểm:**
- ✅ Tích hợp hệ sinh thái Zalo
- ✅ Có Sandbox

**Nhược điểm:**
- ⚠️ Ít phổ biến hơn MoMo và VNPay
- ⚠️ API phức tạp hơn
- ⚠️ Phí tương đương MoMo: 2.5%

---

### 4. **PayOS** (Casso/PayOS - Startup Việt Nam)

**Ưu điểm:**
- ✅ **ĐƠN GIẢN NHẤT** cho người mới
- ✅ Không cần GPKD để bắt đầu
- ✅ Chỉ cần tài khoản ngân hàng cá nhân
- ✅ Webhook tự động
- ✅ Phí thấp: 1000đ/giao dịch

**Nhược điểm:**
- ⚠️ Chỉ hỗ trợ chuyển khoản ngân hàng (không có thẻ)
- ⚠️ Giới hạn giao dịch cho tài khoản cá nhân

**Link:**
- 🔗 https://payos.vn/
- Đăng ký ngay bằng số điện thoại

---

## Khuyến nghị cho giai đoạn phát triển

### **Giải pháp tốt nhất: VNPay Sandbox + PayOS**

#### **Giai đoạn 1: Development & Testing (Hiện tại - 1 tháng)**
```
✅ VNPay Sandbox (Free)
   - Test QR code payment
   - Test thẻ ATM/Visa
   - Không giới hạn số lượng giao dịch

✅ PayOS Personal (Free - 1000đ/tx)
   - Test chuyển khoản thực
   - Webhook tự động
   - Không cần GPKD
```

#### **Giai đoạn 2: Beta Launch (1-3 tháng)**
```
✅ PayOS Business (1000đ/tx)
   - Chuyển khoản ngân hàng thực
   - Không giới hạn giao dịch
   - Chỉ cần CMND/CCCD

✅ VNPay Production (chờ duyệt)
   - Chuẩn bị hồ sơ GPKD
   - Đăng ký merchant
```

#### **Giai đoạn 3: Full Production (3+ tháng)**
```
✅ VNPay Production (1.1% - 1.5%)
   - QR code, ATM, Visa/Master
   - Đầy đủ tính năng

✅ MoMo Production (2.5%)
   - Cho user thích dùng ví MoMo
```

---

## Hướng dẫn đăng ký từng bước

### 1. VNPay Sandbox (Làm NGAY - 5 phút)

**Bước 1:** Truy cập https://sandbox.vnpayment.vn/devreg/

**Bước 2:** Đăng ký với thông tin:
```
- Email
- Số điện thoại
- Tên website: xedienducduy.id.vn
- Mô tả: Website bán xe điện
```

**Bước 3:** Nhận thông tin từ email:
```
TMN_CODE: VNPAYXXXX (Mã merchant)
HASH_SECRET: XXXXXXXXXXXXXX (Secret key)
API_URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

**Bước 4:** Lưu vào file `.env.local`:
```bash
# VNPay Sandbox
VNPAY_TMN_CODE=VNPAYXXXX
VNPAY_HASH_SECRET=XXXXXXXXXXXXXX
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://xedienducduy.id.vn/api/payment/vnpay/return
```

---

### 2. PayOS (Làm NGAY - 10 phút)

**Bước 1:** Truy cập https://payos.vn/

**Bước 2:** Đăng ký với số điện thoại

**Bước 3:** Kết nối tài khoản ngân hàng:
```
- Chọn ngân hàng (VCB, ACB, MB, TP Bank, v.v.)
- Nhập số tài khoản
- Xác thực OTP
```

**Bước 4:** Tạo webhook:
```
Webhook URL: https://xedienducduy.id.vn/api/payment/payos/webhook
Secret Key: (PayOS tự sinh)
```

**Bước 5:** Lưu vào `.env.local`:
```bash
# PayOS
PAYOS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_CHECKSUM_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Code Implementation

### Backend API Routes cần tạo

#### 1. VNPay Payment Creation
```typescript
// backend/src/api/payment/routes/vnpay.ts
import crypto from 'crypto';
import querystring from 'querystring';

export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/vnpay/create',
      handler: 'vnpay.createPayment',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/payment/vnpay/return',
      handler: 'vnpay.handleReturn',
      config: {
        auth: false,
      },
    },
  ],
};
```

#### 2. VNPay Controller
```typescript
// backend/src/api/payment/controllers/vnpay.ts
export default {
  async createPayment(ctx) {
    const { orderId, amount, orderInfo } = ctx.request.body;
    
    const vnpUrl = process.env.VNPAY_URL;
    const vnpTmnCode = process.env.VNPAY_TMN_CODE;
    const vnpHashSecret = process.env.VNPAY_HASH_SECRET;
    const returnUrl = process.env.VNPAY_RETURN_URL;
    
    const date = new Date();
    const createDate = formatDate(date);
    const orderId = date.getTime().toString();
    
    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay uses smallest unit
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ctx.request.ip,
      vnp_CreateDate: createDate,
    };
    
    // Sort and create secure hash
    vnpParams = sortObject(vnpParams);
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams['vnp_SecureHash'] = signed;
    
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnpParams, { encode: false });
    
    ctx.send({ paymentUrl });
  },
  
  async handleReturn(ctx) {
    let vnpParams = ctx.query;
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];
    
    vnpParams = sortObject(vnpParams);
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    if (secureHash === signed) {
      const orderId = vnpParams['vnp_TxnRef'];
      const responseCode = vnpParams['vnp_ResponseCode'];
      
      if (responseCode === '00') {
        // Payment success - update order status
        await strapi.entityService.update('api::order.order', orderId, {
          data: { paymentStatus: 'PAID' }
        });
        ctx.redirect(`${process.env.FRONTEND_URL}/order/success?orderId=${orderId}`);
      } else {
        ctx.redirect(`${process.env.FRONTEND_URL}/order/failed?orderId=${orderId}`);
      }
    } else {
      ctx.redirect(`${process.env.FRONTEND_URL}/order/failed`);
    }
  }
};
```

### Frontend Integration

#### Update PaymentGatewaySelector.tsx
```typescript
// Thay thế mock QR code bằng real VNPay
const handleVNPayPayment = async () => {
  const response = await fetch(`${STRAPI_URL}/api/payment/vnpay/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderCode,
      amount: depositAmount,
      orderInfo: `Thanh toan don hang ${orderCode}`,
    }),
  });
  
  const { paymentUrl } = await response.json();
  window.location.href = paymentUrl; // Redirect to VNPay
};
```

---

## Chi phí dự tính

### Giai đoạn Development (0 - 3 tháng)
- VNPay Sandbox: **MIỄN PHÍ**
- PayOS Personal: **MIỄN PHÍ** (chỉ 1000đ/giao dịch)
- **Tổng: 0đ/tháng**

### Giai đoạn Beta (3 - 6 tháng)
- PayOS Business: **1000đ/giao dịch**
- Dự tính 100 đơn/tháng: **100,000đ/tháng**

### Giai đoạn Production (6+ tháng)
- VNPay: **1.1% - 1.5%**
  - Đơn 30 triệu: 330k - 450k phí
  - 100 đơn/tháng: 33 - 45 triệu phí
- MoMo: **2.5%**
  - Đơn 30 triệu: 750k phí
  - 100 đơn/tháng: 75 triệu phí

---

## Checklist triển khai

### ✅ Week 1: Setup Sandbox (Làm ngay)
- [ ] Đăng ký VNPay Sandbox
- [ ] Đăng ký PayOS
- [ ] Test QR code generation
- [ ] Test webhook

### ✅ Week 2-3: Code Integration
- [ ] Tạo VNPay API routes
- [ ] Update frontend payment flow
- [ ] Test end-to-end trên sandbox
- [ ] Test trên mobile

### ✅ Week 4: Beta Launch
- [ ] Deploy PayOS lên production
- [ ] Monitor transactions
- [ ] Collect user feedback

### ✅ Month 2-3: Production Readiness
- [ ] Chuẩn bị hồ sơ GPKD
- [ ] Đăng ký VNPay production
- [ ] Chờ duyệt (3-5 ngày)
- [ ] Triển khai VNPay production

---

## Câu hỏi thường gặp

**Q: Có thể dùng miễn phí mãi được không?**
A: VNPay Sandbox miễn phí mãi, nhưng chỉ dùng để test. PayOS free cho đến khi bạn muốn scale lớn.

**Q: Cần giấy phép gì để bắt đầu?**
A: Sandbox không cần gì. Production cần GPKD hoặc ĐKKD.

**Q: Làm sao biết user đã thanh toán?**
A: VNPay và PayOS đều có webhook/IPN để thông báo real-time.

**Q: Có rủi ro gì khi dùng PayOS?**
A: PayOS là startup Việt Nam, nhưng đã có hàng nghìn merchant sử dụng. Chỉ dùng cho chuyển khoản, an toàn hơn là tự làm.

**Q: Nên bắt đầu với cái nào?**
A: Bắt đầu với **VNPay Sandbox** để test, và **PayOS** để có payment thực ngay trong development.

---

## Kết luận

**TL;DR - Làm ngay hôm nay:**

1. ✅ Đăng ký **VNPay Sandbox** (5 phút) → Test QR payment
2. ✅ Đăng ký **PayOS** (10 phút) → Test chuyển khoản thực
3. ✅ Code integration (1-2 tuần) → Deploy
4. ⏳ Sau 2-3 tháng → Đăng ký VNPay production

**Chi phí: 0đ cho 3 tháng đầu!** 🎉
