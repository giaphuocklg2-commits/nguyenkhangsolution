# 📘 Hướng Dẫn & Tài Liệu API NKS Electric ERP

Tài liệu này tổng hợp toàn bộ các API Endpoints (v1) được phân chia rõ ràng theo 2 nhóm: **Khách Hàng (User/Client)** và **Quản Trị Viên (Admin/Staff)**.

---

# 🌐 NÓM 1: CLIENT / USER ENDPOINTS (Dành Cho Khách Hàng)

## 🛒 1. Mua Hàng & Tạo Đơn Hàng (Checkout)
- **URL**: `POST /api/v1/orders`
- **Mô tả**: Khách hàng tạo đơn đặt hàng mới trên website.
- **Request Body (JSON)**:
  ```json
  {
    "customerName": "Nguyễn Văn A",
    "phone": "0987654321",
    "email": "nguyenvana@gmail.com",
    "address": "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    "notes": "Giao hàng giờ hành chính",
    "items": [
      {
        "productId": "clx...",
        "quantity": 2
      }
    ]
  }
  ```
- **Response Success (201)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "clx_order_123",
      "orderCode": "NKS-89A7B6C",
      "qrToken": "clx_qr_token_456",
      "totalAmount": 118000000,
      "status": "PENDING",
      "trackingUrl": "/order/clx_qr_token_456",
      "message": "Đặt hàng thành công! Seller sẽ liên hệ bạn để xác nhận đơn."
    }
  }
  ```

---

## 🔍 2. Tra Cứu Đơn Hàng (Order Tracking & Lookup)

### 2.1. Tra cứu nhanh qua Mã Đơn Hàng hoặc Số Điện Thoại
- **URL**: `GET /api/v1/orders/track`
- **Query Params**:
  - `?code=NKS-89A7B6C` (Tra cứu theo Mã đơn hàng)
  - `?phone=0987654321` (Tra cứu tất cả đơn của Số điện thoại)
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "clx_order_123",
        "orderCode": "NKS-89A7B6C",
        "customerName": "Nguyễn Văn A",
        "phone": "0987654321",
        "status": "SHIPPING",
        "totalAmount": 118000000,
        "items": [...],
        "trackingHistory": [
          { "status": "PENDING", "note": "Đã nhận đơn", "createdAt": "2026-07-28T06:00:00.000Z" },
          { "status": "SHIPPING", "note": "Đang giao hàng", "createdAt": "2026-07-28T08:00:00.000Z" }
        ]
      }
    ]
  }
  ```

### 2.2. Chi Tiết Đơn Hàng qua Mã Đơn / QR Token / Order ID
- **URL**: `GET /api/v1/orders/[idOrCodeOrQrToken]`
- **Mô tả**: Dùng cho trang hiển thị chi tiết khi quét mã QR Code trên hóa đơn hoặc link tracking `/order/[qrToken]`.
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "clx_order_123",
      "orderCode": "NKS-89A7B6C",
      "qrToken": "clx_qr_token_456",
      "customerName": "Nguyễn Văn A",
      "phone": "0987654321",
      "address": "123 Nguyễn Văn Cừ",
      "status": "DELIVERED",
      "items": [...],
      "trackingHistory": [...],
      "warrantyRequests": [...]
    }
  }
  ```

### 2.3. Khách Hàng Yêu Cầu Hủy Đơn Hàng
- **URL**: `DELETE /api/v1/orders/[id]`
- **Request Body (JSON)**:
  ```json
  {
    "reason": "Đổi ý muốn mua gói lớn hơn",
    "updatedBy": "Khách hàng"
  }
  ```
- **Response (200)**: `{ "success": true, "message": "Đã hủy đơn hàng" }`

---

## 🛠️ 3. Gửi Yêu Cầu Bảo Hành (Submit Warranty Request)
- **URL**: `POST /api/v1/warranty`
- **Mô tả**: Khách hàng điền form gửi yêu cầu bảo hành sản phẩm.
- **Request Body (JSON)**:
  ```json
  {
    "orderCode": "NKS-89A7B6C",
    "phone": "0987654321",
    "reason": "Inverter không lên nguồn",
    "description": "Bị cúp điện đột ngột sau đó bật không thấy đèn báo",
    "images": ["/uploads/img_baohanh1.jpg"]
  }
  ```
- **Response Success (201)**:
  ```json
  {
    "success": true,
    "data": { "id": "clx_warranty_99", "status": "PENDING" },
    "message": "Yêu cầu bảo hành đã được gửi. Chúng tôi sẽ liên hệ bạn sớm nhất."
  }
  ```
- **Ghi chú**: Ngay khi khách gửi yêu cầu, hệ thống sẽ tự động bật **Popup Cảnh Báo Bảo Hành** cho tất cả Admin / Nhân viên khi truy cập trang Admin.

---

## 🎟️ 4. Mã Giảm Giá Đang Khuyến Mãi (Active Coupons)
- **URL**: `GET /api/v1/coupons/active`
- **Mô tả**: Lấy danh sách các mã giảm giá thực tế còn hạn để hiển thị ra Trang Chủ và Trang Chi Tiết Sản Phẩm.
- **Response (200)**:
  ```json
  [
    {
      "id": "clx_coupon_1",
      "code": "FREE50K",
      "description": "Giảm 50.000đ cho mọi đơn",
      "discountAmount": 50000,
      "minOrderValue": 500000,
      "endDate": "2026-12-31T23:59:59.000Z"
    }
  ]
  ```

---

## 🛍️ 5. Xem Sản Phẩm & Danh Mục (Public Products)
- **Danh sách sản phẩm**: `GET /api/v1/products?limit=20&category=inverter&search=5kwp`
- **Chi tiết sản phẩm**: `GET /api/v1/products/[id]`
- **Danh mục sản phẩm**: `GET /api/v1/categories`

---

## 📢 6. Thông Báo Popup Trang Chủ (User Popup)
- **URL**: `GET /api/v1/announcements?type=USER_POPUP`
- **Mô tả**: Lấy thông báo khuyến mãi / sự kiện để bật Modal Popup giữa màn hình cho khách vừa vào web.

---

# 🔐 NHÓM 2: ADMIN & STAFF ENDPOINTS (Dành Cho Quản Trị)

## 🔑 1. Đăng Nhập / Đăng Xuất Admin
- `POST /api/v1/staff/login` -> Body: `{ "email": "admin@nks-electric.vn", "password": "..." }`
- `POST /api/v1/staff/logout`

## 👥 2. Quản Lý Nhân Sự (Staff Management)
- `GET /api/v1/staff`
- `POST /api/v1/staff`
- `PUT /api/v1/staff/[id]`
- `DELETE /api/v1/staff/[id]`

## 📦 3. Quản Lý Sản Phẩm & Upload File Ảnh
- `POST /api/v1/products`
- `PUT /api/v1/products/[id]`
- `DELETE /api/v1/products/[id]`
- `POST /api/v1/upload` (Form Data Multipart: `file`)

## 🛒 4. Quản Lý & Đổi Trạng Thái Đơn Hàng
- `GET /api/v1/orders?status=PENDING&search=...`
- `PUT /api/v1/orders/[id]` -> Body: `{ "status": "CONFIRMED", "note": "Đã gọi xác nhận", "updatedBy": "Nguyễn Văn A" }`

## 🎟️ 5. Quản Lý Mã Giảm Giá
- `GET /api/v1/admin/coupons`
- `POST /api/v1/admin/coupons`
- `PUT /api/v1/admin/coupons/[id]`
- `DELETE /api/v1/admin/coupons/[id]`

## 📢 6. Quản Lý Thông Báo Hệ Thống (Announcements)
- `GET /api/v1/announcements?type=USER_POPUP|STAFF_POPUP|COMPANY_BELL`
- `POST /api/v1/announcements`
- `PUT /api/v1/announcements/[id]`
- `DELETE /api/v1/announcements/[id]`

## 🔑 7. Quản Lý API Keys (External App Integrations)
- `GET /api/v1/apikeys`
- `POST /api/v1/apikeys`
- `DELETE /api/v1/apikeys?id=...`

## 📊 8. Thống Kê & Analytics
- `GET /api/v1/analytics/overview`
