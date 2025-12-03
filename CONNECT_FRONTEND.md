# 🔗 Kết Nối Frontend với Strapi Backend

## Bước 1: Tạo Environment Variable

Tạo file `.env.local` trong thư mục `frontend`:

```bash
cd frontend
```

Tạo file `.env.local` với nội dung:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Trên Windows PowerShell:**
```powershell
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" > .env.local
```

**Hoặc tạo thủ công:**
- Tạo file mới tên `.env.local` trong `frontend/`
- Copy nội dung trên vào

## Bước 2: Restart Frontend Server

```bash
# Stop server hiện tại (Ctrl + C)
# Start lại
npm run dev
```

## Bước 3: Kiểm Tra Kết Nối

Mở http://localhost:3000

Bạn sẽ thấy:
- Trang chủ hiển thị sản phẩm từ Strapi
- Trang /cars hiển thị danh sách sản phẩm thật
- Click vào sản phẩm sẽ thấy chi tiết

## Troubleshooting

### Lỗi: Cannot connect to Strapi
- Kiểm tra Strapi đang chạy: http://localhost:1337
- Kiểm tra .env.local đã tạo đúng
- Restart frontend server

### Không thấy dữ liệu
- Kiểm tra API permissions (Public role)
- Test API: http://localhost:1337/api/car-models?populate=*

---

**Sau khi tạo .env.local và restart, báo cho tôi biết!** ✅
