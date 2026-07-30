# NKS Electric - E-Commerce Platform

Dự án website thương mại điện tử chuyên cung cấp thiết bị điện, năng lượng mặt trời, đèn hàng hải.

## Hướng dẫn cài đặt Database & Khởi chạy (Dành cho môi trường thực tế)

Dự án này sử dụng **SQLite** với **Prisma ORM**. Để khởi chạy ứng dụng lần đầu, hãy làm theo các bước sau:

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Cài đặt Database
Lệnh này sẽ tạo file database `prisma/dev.db` dựa trên cấu trúc `schema.prisma`.
```bash
npx prisma db push
```

### 3. Tạo dữ liệu mẫu (Seeding)
Lệnh này sẽ tạo các tài khoản admin, danh mục, sản phẩm mẫu và đơn hàng mẫu vào database.
```bash
npm run seed
```

**Tài khoản Admin (sau khi seed):**
- **Email:** `nguyenkhang@shop`
- **Mật khẩu:** `Kgg@123456`
- **Quyền:** `SUPER_ADMIN`

### 4. Khởi chạy Server
```bash
npm run dev
# Hoặc build cho production
npm run build && npm run start
```
Truy cập: `http://localhost:3000`

## Tính năng Quản Trị
Trang quản trị (Admin Panel) được ẩn tại đường dẫn `/admin`.
- Bạn cần đăng nhập bằng tài khoản `SUPER_ADMIN` hoặc các tài khoản nhân sự được cấp quyền.
- Hỗ trợ xuất/backup Database trực tiếp tại Cài đặt.
- Phân quyền nhân sự theo cấu trúc cấp bậc (Cấp cao mới được tạo cấp thấp).
