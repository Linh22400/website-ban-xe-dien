# HƯỚNG DẪN CẤU HÌNH DNS TẠI INET CHO xedienducduy.id.vn

**Domain:** xedienducduy.id.vn  
**Trỏ về:** Vercel (cname.vercel-dns.com)  
**Nhà cung cấp:** INET (inet.vn)  
**Ngày:** 10/01/2026

---

## 🎯 MỤC TIÊU

Xóa cấu hình WordPress cũ và trỏ domain về Vercel để website Next.js mới hoạt động.

---

## 📋 BƯỚC 1: ĐĂNG NHẬP VÀO INET

### 1.1. Truy cập trang quản lý

**URL:** https://inet.vn/  
Hoặc: https://my.inet.vn/clientarea.php

### 1.2. Đăng nhập

1. Nhập **Email** hoặc **Tên đăng nhập**
2. Nhập **Mật khẩu**
3. Click **"Đăng nhập"**

### 1.3. Vào quản lý tên miền

Sau khi đăng nhập:

1. Trên menu chính, click **"Tên Miền"** hoặc **"Domains"**
2. Danh sách tên miền sẽ hiện ra
3. Tìm domain: **xedienducduy.id.vn**
4. Click vào tên domain hoặc icon **"Quản lý"** / **"Manage"**

---

## 📋 BƯỚC 2: TRUY CẬP QUẢN LÝ DNS

### 2.1. Vào DNS Management

Trong trang quản lý domain **xedienducduy.id.vn**, tìm và click:

- **"Quản lý DNS"**
- Hoặc **"DNS Management"**
- Hoặc **"Nameservers"** → **"Use custom nameservers"** → **"Manage DNS"**

### 2.2. Xác nhận Nameservers

**Quan trọng:** Kiểm tra nameservers đang dùng

Nếu đang dùng **nameservers của INET:**
```
ns1.inet.vn
ns2.inet.vn
```
✅ Tiếp tục bước tiếp theo

Nếu đang dùng **nameservers khác** (VD: Cloudflare):
```
ns1.cloudflare.com
ns2.cloudflare.com
```
⚠️ Bạn cần đổi về nameservers INET hoặc cấu hình DNS tại Cloudflare (xem phần cuối)

---

## 📋 BƯỚC 3: XÓA RECORDS CŨ (WordPress)

### 3.1. Xem danh sách DNS Records hiện tại

Bạn sẽ thấy bảng DNS records với các cột:
- **Type** (Loại): A, CNAME, MX, TXT, v.v.
- **Name/Host** (Tên): @, www, mail, v.v.
- **Value/Points to** (Giá trị): IP hoặc domain
- **TTL**: Thời gian cache
- **Actions** (Hành động): Edit, Delete

### 3.2. Xác định records cần xóa

**Tìm và xóa các records này** (liên quan WordPress cũ):

#### ❌ **A Record trỏ đến IP WordPress:**
```
Type: A
Name: @ (hoặc blank)
Value: [IP của server WordPress cũ] (VD: 103.x.x.x)
```
→ **XÓA record này**

#### ❌ **A Record cho www (nếu có):**
```
Type: A
Name: www
Value: [IP của server WordPress cũ]
```
→ **XÓA record này**

#### ❌ **CNAME Record cũ (nếu có):**
```
Type: CNAME
Name: @ hoặc www
Value: [domain cũ]
```
→ **XÓA record này**

### 3.3. Các records NÊN GIỮ LẠI

✅ **MX Records** (Email):
```
Type: MX
Name: @ hoặc mail
Value: mail.xedienducduy.id.vn (hoặc mail server khác)
Priority: 10
```
→ **KHÔNG XÓA** (để email hoạt động)

✅ **TXT Records** (SPF, DKIM, DMARC):
```
Type: TXT
Name: @
Value: "v=spf1 ..." hoặc DKIM keys
```
→ **KHÔNG XÓA** (để email không bị spam)

✅ **Other subdomains** (nếu có):
```
Type: A/CNAME
Name: blog, shop, mail, ftp, v.v.
```
→ **KHÔNG XÓA** (trừ khi không dùng nữa)

### 3.4. Cách xóa records

1. Tìm record cần xóa trong danh sách
2. Click icon **"Xóa"** (🗑️) hoặc **"Delete"** hoặc **"Remove"**
3. Confirm: Click **"OK"** hoặc **"Xác nhận"**

**Lặp lại** cho tất cả A records và CNAME records liên quan @ và www

---

## 📋 BƯỚC 4: THÊM CNAME RECORD MỚI (Vercel)

### 4.1. Click "Thêm Record" / "Add Record"

Tìm button:
- **"Thêm bản ghi DNS"**
- **"Add DNS Record"**
- **"Add Record"**
- Hoặc icon dấu cộng **"+"**

### 4.2. Điền thông tin CNAME cho root domain (@)

**⚠️ LƯU Ý:** INET có thể không cho phép CNAME cho root (@). Trong trường hợp đó, xem phần 4.4 bên dưới.

**Nếu INET hỗ trợ CNAME flattening hoặc ALIAS:**

```
Type: CNAME (hoặc ALIAS)
Name: @ (hoặc để trống hoặc ghi "xedienducduy.id.vn")
Points to/Value: cname.vercel-dns.com
TTL: Auto (hoặc 3600)
```

Click **"Lưu"** / **"Save"** / **"Add"**

### 4.3. Thêm CNAME cho www subdomain

Click "Add Record" lần nữa:

```
Type: CNAME
Name: www
Points to/Value: cname.vercel-dns.com
TTL: Auto (hoặc 3600)
```

Click **"Lưu"** / **"Save"** / **"Add"**

### 4.4. ⚠️ FALLBACK: Nếu INET KHÔNG cho phép CNAME cho root

**Trường hợp:** INET báo lỗi "Cannot use CNAME for root domain" hoặc không có option ALIAS

**Giải pháp:** Dùng A Records trỏ đến IP của Vercel

#### Bước 1: Lấy IP của Vercel

```powershell
nslookup cname.vercel-dns.com
```

Kết quả sẽ cho bạn IP (VD: 76.76.21.21, 76.76.21.22, v.v.)

#### Bước 2: Thêm A Records

**A Record cho root:**
```
Type: A
Name: @ (hoặc để trống)
Value: 76.76.21.21
TTL: 3600
```

**A Record thứ 2 (nếu có nhiều IPs):**
```
Type: A
Name: @
Value: 76.76.21.22
TTL: 3600
```

**CNAME cho www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Lưu ý:** IP của Vercel có thể thay đổi. Nên dùng CNAME nếu có thể.

---

## 📋 BƯỚC 5: VERIFY CẤU HÌNH

### 5.1. Kiểm tra DNS Records sau khi lưu

Danh sách DNS records bây giờ nên có:

✅ **CNAME Record (tốt nhất):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

✅ **CNAME cho www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Hoặc A Records (nếu không dùng được CNAME):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

✅ **MX Records** (giữ nguyên - cho email)
✅ **TXT Records** (giữ nguyên - cho email SPF/DKIM)

### 5.2. Save/Apply Changes

- Một số panel cần click **"Apply Changes"** hoặc **"Save All"** ở cuối trang
- INET thường tự động save sau mỗi record

---

## 📋 BƯỚC 6: CHỜ DNS PROPAGATION

### 6.1. Thời gian chờ

- **Thời gian:** 5-30 phút (thường 10-15 phút)
- **TTL cũ:** Nếu TTL của records cũ là 3600 (1 giờ), có thể mất tới 1 giờ
- **Cache:** Browser và ISP cache DNS

### 6.2. Kiểm tra DNS propagation

**Cách 1: PowerShell (trên máy tính)**

```powershell
# Clear DNS cache trước
ipconfig /flushdns

# Check DNS
nslookup xedienducduy.id.vn

# Kết quả mong đợi:
# Non-authoritative answer:
# Name:    cname.vercel-dns.com
# Address:  76.76.21.21 (hoặc IP Vercel)
```

**Cách 2: Online DNS Checker**

Truy cập: https://dnschecker.org/

1. Nhập: `xedienducduy.id.vn`
2. Type: `A` hoặc `CNAME`
3. Click "Search"

Xem kết quả từ nhiều locations trên thế giới:
- ✅ Xanh lá: DNS đã update
- ❌ Đỏ: DNS chưa update
- ⏳ Chờ tất cả locations xanh

**Cách 3: Mobile Data (nhanh nhất)**

- Tắt WiFi
- Dùng 4G/5G
- Truy cập: https://xedienducduy.id.vn
- Nếu thấy website mới → DNS đã OK

### 6.3. Nếu DNS chưa update sau 30 phút

**Check lại INET:**
1. Login vào INET panel
2. Verify records đã save đúng
3. Check nameservers vẫn đang dùng ns1.inet.vn, ns2.inet.vn

**Flush tất cả cache:**
```powershell
# Flush DNS
ipconfig /flushdns

# Restart DNS Client service
net stop dnscache
net start dnscache
```

**Test từ máy khác:**
- Dùng máy khác hoặc mobile
- Để loại trừ cache issue

---

## 📋 BƯỚC 7: VERIFY SSL TRÊN VERCEL

### 7.1. Sau khi DNS propagate xong

1. Login vào Vercel: https://vercel.com/dashboard
2. Vào project: **website-xe-dien-duc-duy**
3. Settings → Domains
4. Tìm domain: **xedienducduy.id.vn**

### 7.2. Check domain status

Status nên hiển thị:
- ✅ **"Valid Configuration"** (màu xanh)
- 🔒 **SSL Certificate:** Issued by Let's Encrypt

**Nếu status là "Invalid Configuration":**
- ⏳ Đợi 5-10 phút nữa (DNS chưa fully propagate)
- 🔄 Click "Refresh" hoặc "Check Configuration"

**Nếu status là "Pending SSL":**
- ⏳ Vercel đang issue SSL certificate
- Thường mất 5-10 phút
- Refresh trang sau vài phút

### 7.3. Test website với HTTPS

Truy cập: **https://xedienducduy.id.vn**

✅ **Thành công nếu:**
- Website Next.js hiện ra (không còn WordPress)
- URL bar có icon khóa 🔒
- Không có warning "Not Secure"
- Homepage load với tất cả images/styles

❌ **Nếu thấy lỗi:**
- "NET::ERR_CERT_AUTHORITY_INVALID" → SSL chưa ready, đợi thêm
- "This site can't be reached" → DNS chưa propagate
- "ERR_TOO_MANY_REDIRECTS" → Check HTTPS settings trên INET

---

## 🔧 TROUBLESHOOTING INET-SPECIFIC

### ❌ Problem: "Không thể thêm CNAME cho root domain"

**Giải pháp:**

Option 1: Dùng A Records (như Bước 4.4)
```
Type: A
Name: @
Value: 76.76.21.21
```

Option 2: Chuyển sang Cloudflare DNS (free, hỗ trợ CNAME flattening)
1. Đăng ký Cloudflare: https://dash.cloudflare.com/sign-up
2. Add site: xedienducduy.id.vn
3. Cloudflare cho bạn 2 nameservers:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
4. Quay lại INET → Đổi nameservers của domain
5. Cấu hình DNS trên Cloudflare (xem phần dưới)

### ❌ Problem: Records không save được

**Nguyên nhân:** Domain status không active hoặc locked

**Giải pháp:**
1. Check domain status trong INET panel
2. Nếu "Locked" hoặc "Pending Transfer" → Unlock domain
3. Nếu "Expired" → Renew domain trước

### ❌ Problem: DNS update rất chậm (>1 giờ)

**Nguyên nhân:** TTL cũ cao (3600 hoặc 86400)

**Giải pháp:**
1. Đợi hết thời gian TTL cũ
2. Flush DNS nhiều lần:
   ```powershell
   ipconfig /flushdns
   ```
3. Test trên mobile data hoặc VPN

### ❌ Problem: Website vẫn hiện WordPress cũ

**Nguyên nhân:** Browser cache

**Giải pháp:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache:
   - Chrome: Ctrl + Shift + Delete → Clear cache
3. Incognito/Private mode
4. Test trên browser khác

### ❌ Problem: Email không hoạt động sau đổi DNS

**Nguyên nhân:** Xóa nhầm MX records

**Giải pháp:**
1. Thêm lại MX records:
   ```
   Type: MX
   Name: @
   Value: mail.xedienducduy.id.vn (hoặc mail server của bạn)
   Priority: 10
   TTL: 3600
   ```
2. Nếu không nhớ mail server, liên hệ INET support

---

## 🔄 ALTERNATIVE: SỬ DỤNG CLOUDFLARE DNS

### Tại sao nên dùng Cloudflare?

✅ **Ưu điểm:**
- CNAME flattening (cho phép CNAME cho root domain)
- Free SSL/TLS (proxy mode)
- CDN miễn phí (website nhanh hơn)
- DDoS protection
- Analytics
- Page Rules

### Cách chuyển sang Cloudflare:

#### Bước 1: Đăng ký Cloudflare

1. https://dash.cloudflare.com/sign-up
2. Đăng ký tài khoản miễn phí
3. Verify email

#### Bước 2: Add site

1. Dashboard → "Add a site"
2. Nhập: `xedienducduy.id.vn`
3. Plan: Chọn **"Free"** (miễn phí vĩnh viễn)
4. Click "Continue"

#### Bước 3: Cloudflare scan DNS records

- Cloudflare tự động scan và import DNS records hiện tại từ INET
- Review records, delete records không cần
- Click "Continue"

#### Bước 4: Lấy Cloudflare Nameservers

Cloudflare sẽ cho bạn 2 nameservers:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

Copy 2 nameservers này.

#### Bước 5: Đổi nameservers trên INET

1. Login INET
2. Vào domain: xedienducduy.id.vn
3. Tìm **"Nameservers"** hoặc **"DNS Management"**
4. Chọn **"Use custom nameservers"**
5. Xóa nameservers cũ (ns1.inet.vn, ns2.inet.vn)
6. Thêm nameservers mới:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
7. Click "Save"

#### Bước 6: Verify trên Cloudflare

1. Quay lại Cloudflare dashboard
2. Click "Done, check nameservers"
3. Cloudflare sẽ check (có thể mất vài phút đến 24 giờ)
4. Bạn sẽ nhận email khi nameservers active

#### Bước 7: Cấu hình DNS trên Cloudflare

Sau khi nameservers active:

1. Cloudflare Dashboard → DNS → Records
2. Delete records cũ (WordPress)
3. Add new records:

**CNAME cho root:**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: DNS only (grey cloud) ⚠️
TTL: Auto
```

**CNAME cho www:**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (grey cloud) ⚠️
TTL: Auto
```

⚠️ **QUAN TRỌNG:** Để "DNS only" (grey cloud), KHÔNG dùng "Proxied" (orange cloud) ban đầu

4. Click "Save"

#### Bước 8: Verify

- DNS propagate nhanh hơn với Cloudflare (5-10 phút)
- Check: https://xedienducduy.id.vn

#### Bước 9 (Optional): Enable Cloudflare Proxy

Sau khi website hoạt động ổn định:

1. Edit CNAME records
2. Chuyển "Proxy status" từ grey → **orange cloud** (Proxied)
3. Benefit:
   - CDN: Website nhanh hơn
   - DDoS protection
   - SSL từ Cloudflare (ngoài SSL của Vercel)

---

## 📊 CHECKLIST HOÀN TẤT

### ✅ Tại INET:

- [ ] Đăng nhập INET panel thành công
- [ ] Tìm thấy domain xedienducduy.id.vn
- [ ] Vào DNS Management
- [ ] Xóa A Records cũ (@)
- [ ] Xóa A Records cũ (www) nếu có
- [ ] Xóa CNAME records cũ nếu có
- [ ] GIỮ LẠI MX records (email)
- [ ] GIỮ LẠI TXT records (SPF/DKIM)
- [ ] Thêm CNAME mới: @ → cname.vercel-dns.com
- [ ] Thêm CNAME mới: www → cname.vercel-dns.com
- [ ] (Hoặc thêm A records nếu không dùng được CNAME)
- [ ] Save/Apply changes

### ✅ Verification:

- [ ] nslookup xedienducduy.id.vn → Trả về IP Vercel
- [ ] dnschecker.org → All green checks
- [ ] https://xedienducduy.id.vn → Website Next.js load
- [ ] SSL certificate active (khóa xanh 🔒)
- [ ] Test trên mobile
- [ ] Test forms (newsletter, contact)
- [ ] Test admin login
- [ ] Vercel domain status: "Valid Configuration"

### ✅ Post-deployment:

- [ ] Email vẫn hoạt động (nếu dùng email @xedienducduy.id.vn)
- [ ] Old WordPress không còn accessible
- [ ] https://www.xedienducduy.id.vn redirect về https://xedienducduy.id.vn
- [ ] Security headers check: https://securityheaders.com/
- [ ] SSL rating: https://www.ssllabs.com/ssltest/

---

## 📞 LIÊN HỆ HỖ TRỢ

### INET Support:

- **Website:** https://inet.vn/lien-he
- **Email:** support@inet.vn
- **Hotline:** 1900 2046
- **Ticket system:** Login INET → Support → New Ticket

### Vercel Support:

- **Docs:** https://vercel.com/docs
- **Help:** https://vercel.com/help
- **Community:** https://github.com/vercel/vercel/discussions

### Cloudflare Support (nếu dùng):

- **Docs:** https://developers.cloudflare.com/
- **Community:** https://community.cloudflare.com/
- **Status:** https://www.cloudflarestatus.com/

---

## 🎯 SUMMARY

### DNS Records cần có (Vercel):

**Cách 1: CNAME (Tốt nhất)**
```
CNAME @ cname.vercel-dns.com
CNAME www cname.vercel-dns.com
```

**Cách 2: A Records (Fallback)**
```
A @ 76.76.21.21
CNAME www cname.vercel-dns.com
```

### Timeline:

- ⚡ Cấu hình DNS: **5-10 phút**
- ⏳ DNS Propagation: **10-30 phút**
- ⏳ SSL Certificate: **5-10 phút** (sau DNS ready)
- **Total:** 20-50 phút

---

## 🎉 HOÀN TẤT!

Sau khi DNS propagate và SSL active, website của bạn sẽ live tại:

**🌐 https://xedienducduy.id.vn**

Chúc mừng bạn đã hoàn thành deployment! 🚀✨
