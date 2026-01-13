# VNPay Configuration Checklist

## ⚠️ Lỗi "Sai chữ ký" - Nguyên nhân và giải pháp

### ✅ Đã kiểm tra:
- [x] Thuật toán HMAC-SHA512: **ĐÚNG**
- [x] SignData format: **ĐÚNG**  
- [x] Signature value: **ĐÚNG** (verified độc lập)

### ❌ Vấn đề có thể là:

## 1. Return URL chưa được whitelist

**Bước kiểm tra:**
1. Login: https://sandbox.vnpayment.vn/
2. Vào **Cấu hình** → **URL Cấu hình**
3. Kiểm tra **Return URL** đã thêm:
   - `http://localhost:3000/checkout/vnpay-return`
   - HOẶC `https://www.xedienducduy.id.vn/checkout/vnpay-return`

**⚠️ QUAN TRỌNG:** VNPay có thể KHÔNG chấp nhận localhost cho merchant thật.

**Giải pháp:**
- Thêm production URL: `https://www.xedienducduy.id.vn/checkout/vnpay-return`
- Test trên production thay vì local

---

## 2. Hash Secret có ký tự ẩn

**Bước kiểm tra:**
1. Vào VNPay portal
2. Copy Hash Secret MỚI (click icon copy nếu có)
3. Paste vào text editor (Notepad++)
4. Check length = 32 characters CHÍNH XÁC
5. Không có space, tab, newline ở đầu/cuối

**Test trong PowerShell:**
```powershell
cd D:\website(banxedien)\backend
$secret = "KY8KY6EQQPOH56NU5NO4FYVQ5I7XNCBZ"
Write-Host "Length: $($secret.Length)"
Write-Host "Hex: $([System.BitConverter]::ToString([System.Text.Encoding]::UTF8.GetBytes($secret)))"
```

**Expected output:**
```
Length: 32
Hex: 4B-59-38-4B-59-36-45-51-51-50-4F-48-35-36-4E-55-35-4E-4F-34-46-59-56-51-35-49-37-58-4E-43-42-5A
```

---

## 3. TMN Code không khớp

**Bước kiểm tra:**
1. Đảm bảo TMN Code và Hash Secret từ **CÙNG** merchant account
2. Không mix credentials từ nhiều account
3. Copy lại CẢ 2 từ portal cùng lúc

---

## 4. Merchant Status

**Bước kiểm tra:**
1. Vào VNPay portal
2. Check **Trạng thái tài khoản**: Phải là **Đã kích hoạt**
3. Check **Môi trường**: Sandbox hoặc Production

---

## 🔧 Giải pháp ngay lập tức:

### **Option 1: Test với production URL** (Khuyến nghị)

Update `.env`:
```env
# Dùng production URL thay vì localhost
FRONTEND_URL=https://www.xedienducduy.id.vn
```

Restart backend và test trên production website.

### **Option 2: Re-copy credentials**

1. Login VNPay portal
2. Vào Cấu hình
3. Copy lại CHÍNH XÁC:
   - TMN Code (Terminal ID)
   - Hash Secret Key
4. Paste vào `.env`
5. Restart backend

### **Option 3: Liên hệ VNPay support**

Nếu tất cả đã đúng mà vẫn lỗi:
- Email: hotrovnpay@vnpay.vn
- Phone: 1900 55 55 77
- Cung cấp:
  - TMN Code: 9REXR668
  - Error: "Sai chữ ký" (code 70)
  - SignData từ log

---

## 📊 Test Case để verify:

```javascript
// Run in Node.js
const crypto = require('crypto');

const SECRET = 'KY8KY6EQQPOH56NU5NO4FYVQ5I7XNCBZ';
const DATA = 'vnp_Amount=10000000&vnp_Command=pay&vnp_CreateDate=20260113120000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Test&vnp_OrderType=other&vnp_ReturnUrl=https://www.xedienducduy.id.vn/checkout/vnpay-return&vnp_TmnCode=9REXR668&vnp_TxnRef=TEST123&vnp_Version=2.1.0';

const hmac = crypto.createHmac('sha512', SECRET);
const signature = hmac.update(Buffer.from(DATA, 'utf-8')).digest('hex');

console.log('Signature:', signature);
```

Nếu VNPay vẫn báo sai với test case này → Hash Secret hoặc TMN Code bị sai.

---

## ✅ Next Steps:

1. **Whitelist return URL** trong VNPay portal (ưu tiên production URL)
2. **Re-copy credentials** từ portal
3. **Test với production URL** thay vì localhost
4. Nếu vẫn lỗi → Contact VNPay support với log chi tiết
