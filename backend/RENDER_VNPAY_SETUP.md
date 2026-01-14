# VNPay Production Configuration Guide

## ❌ Error: "VNPay configuration is missing"

**Nguyên nhân:** Backend production (Render) không có VNPay credentials.

File `.env` ở local KHÔNG được deploy lên Render - phải config qua dashboard.

---

## ✅ Cách fix trên Render:

### Bước 1: Truy cập Render Dashboard

1. Đi tới: https://dashboard.render.com/
2. Chọn service: **website-ban-xe-dien** (backend)
3. Click tab **Environment**

### Bước 2: Thêm VNPay Environment Variables

Click **Add Environment Variable** và thêm 3 biến sau:

#### 1. VNPAY_TMN_CODE
```
Key: VNPAY_TMN_CODE
Value: 9REXR668
```

#### 2. VNPAY_HASH_SECRET
```
Key: VNPAY_HASH_SECRET
Value: KY8KY6EQQPOH56NU5NO4FYVQ5I7XNCBZ
```

#### 3. VNPAY_URL
```
Key: VNPAY_URL
Value: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### Bước 3: Save và Deploy

1. Click **Save Changes**
2. Render sẽ tự động deploy lại backend
3. Đợi ~2-3 phút để deployment hoàn thành

---

## 🔍 Verify sau khi deploy:

### Test API endpoint:
```bash
curl https://website-ban-xe-dien.onrender.com/api/payment/vnpay/create \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "TEST123",
    "amount": 100000,
    "orderInfo": "Test payment"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/...",
    "txnRef": "TEST123_...",
    "amount": 100000
  }
}
```

---

## 📋 Checklist:

- [ ] Thêm `VNPAY_TMN_CODE` vào Render
- [ ] Thêm `VNPAY_HASH_SECRET` vào Render
- [ ] Thêm `VNPAY_URL` vào Render
- [ ] Click "Save Changes"
- [ ] Đợi deployment xong
- [ ] Test payment trên production website
- [ ] Check VNPay portal đã whitelist `https://www.xedienducduy.id.vn/checkout/vnpay-return`

---

## 🔐 Security Note:

**QUAN TRỌNG:** Không commit credentials vào Git!

File `.env` đã có trong `.gitignore` - credentials chỉ tồn tại:
- ✅ Local: `backend/.env` file
- ✅ Production: Render Environment Variables
- ❌ KHÔNG commit vào Git repository

---

## 📸 Screenshots Guide:

### Render Environment Variables UI:
```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│ Key                    │ Value                   │
├────────────────────────┼─────────────────────────┤
│ VNPAY_TMN_CODE        │ 9REXR668                │
│ VNPAY_HASH_SECRET     │ KY8KY6EQ... (hidden)    │
│ VNPAY_URL             │ https://sandbox...      │
│ ...other vars...       │                         │
└─────────────────────────────────────────────────┘
```

---

## 🚨 Troubleshooting:

### Lỗi vẫn xuất hiện sau khi thêm env vars:

1. **Check deployment log:**
   - Vào Render dashboard
   - Tab "Logs"
   - Xem có error khi start backend không

2. **Verify env vars:**
   ```bash
   # SSH vào Render (nếu có)
   echo $VNPAY_TMN_CODE
   echo $VNPAY_HASH_SECRET
   ```

3. **Manual redeploy:**
   - Click "Manual Deploy" → "Clear build cache & deploy"

4. **Check spelling:**
   - Đảm bảo key tên CHÍNH XÁC (case-sensitive)
   - `VNPAY_TMN_CODE` (không phải `vnpay_tmn_code`)

---

## ✅ Sau khi fix xong:

Test payment flow hoàn chỉnh:
1. Vào https://www.xedienducduy.id.vn
2. Thêm sản phẩm vào giỏ
3. Checkout → Chọn VNPay
4. Nếu không có error 500 → Success! 🎉
5. VNPay sẽ redirect tới sandbox payment page
