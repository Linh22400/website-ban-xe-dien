# Hướng Dẫn: Thêm Ảnh Cho Từng Màu Xe

## Mục Đích
Cho phép mỗi màu xe có ảnh riêng thay vì chỉ dùng color overlay.

## Bước 1: Cập Nhật Strapi Schema

### Thêm Field Image vào Color Component

1. Mở **Strapi Admin** (http://localhost:1337/admin)
2. Vào **Content-Type Builder** (biểu tượng cờ lê)
3. Trong sidebar, tìm **COMPONENTS** → Click **product.color**
4. Click nút **Add another field to this component**
5. Chọn **Media**
6. Cấu hình:
   - **Name**: `image`
   - **Type**: **Single media**
   - **Allowed types**: Chỉ chọn **Images**
   - **Required field**: Không (optional)
7. Click **Finish**
8. Click **Save** ở góc trên bên phải
9. **Chờ Strapi restart** (khoảng 10-20 giây)

## Bước 2: Upload Ảnh Cho Từng Màu

### Ví dụ: VinFast Klara S

1. Vào **Content Manager** → **Car Model**
2. Click vào sản phẩm **VinFast Klara S**
3. Scroll xuống phần **Colors**
4. Với mỗi màu:
   - **Đỏ**: Upload ảnh xe màu đỏ vào field **Image**
   - **Đen**: Upload ảnh xe màu đen vào field **Image**
   - **Trắng**: Upload ảnh xe màu trắng vào field **Image**
5. Click **Save** và **Publish**

### Lặp lại cho các sản phẩm khác

Làm tương tự với:
- Giant E-Bike Pro
- Trek Verve+ 3
- Yadea G5

## Bước 3: Frontend Tự Động Nhận Diện

Code frontend đã sẵn sàng! Khi có ảnh màu:
- ✅ Hiển thị ảnh thật của màu đó
- ✅ Smooth transition 700ms
- ✅ Fallback về thumbnail nếu không có ảnh

Không cần sửa code gì thêm!

## Kiểm Tra

1. Vào trang chi tiết sản phẩm: `/cars/vin-fast-klara-s`
2. Click vào các màu khác nhau
3. Ảnh sẽ thay đổi theo màu đã upload

## Lưu Ý

- Nếu màu nào **không có ảnh** → Hiển thị thumbnail chính
- Nếu màu nào **có ảnh** → Hiển thị ảnh riêng
- Transition mượt mà 700ms
- Zoom vẫn hoạt động bình thường

## Nếu Không Muốn Upload Ảnh

Giữ nguyên như hiện tại - dùng color overlay CSS. Vẫn đẹp và mượt mà!
