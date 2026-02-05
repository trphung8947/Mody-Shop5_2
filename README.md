# 🍯 Golden Taste - Trang Web Bán Hàng

## 📋 Mô Tả Dự Án

Đây là một trang web bán hàng đầy đủ chức năng với thiết kế hiện đại, responsive, và trải nghiệm người dùng tuyệt vời. Dự án sử dụng **HTML5**, **CSS3 (Tailwind CSS)**, và **JavaScript** để tạo ra một trang web bán mô hình và mật ong.

## ✨ Tính Năng Chính

### 1. **Cấu Trúc Multi-Page**
- ✅ **index.html** - Trang chủ (Home)
- ✅ **products.html** - Trang sản phẩm
- ✅ **reviews.html** - Trang đánh giá khách hàng
- ✅ **contact.html** - Trang liên hệ

### 2. **Navigation Bar (Header)**
- Logo bên trái
- Menu điều hướng ở giữa: Trang Chủ, Sản Phẩm, Đánh Giá, Liên Hệ
- Hiệu ứng hover trên các mục menu
- Nút "Mua Ngay" nổi bật
- Menu mobile responsive

### 3. **Trang Home**
- Hero Section với:
  - Text tiêu đề lớn bên trái
  - Hình ảnh sản phẩm nổi bật bên phải
  - Nền trang nhã (gradient vàng/cam)
  - Nút CTA (Call To Action)
- Phần tính năng nổi bật
- Phần khuyến mãi cuối cùng

### 4. **Trang Sản Phẩm**
- Grid layout với 4 cột (responsive)
- 8 sản phẩm mẫu với:
  - Hình ảnh (emoji minh họa)
  - Tên sản phẩm
  - Giá tiền
  - Xếp hạng sao
  - Nút "Thêm vào Giỏ"
- Bộ lọc và sắp xếp sản phẩm

### 5. **Trang Đánh Giá**
- Hiển thị xếp hạng tổng hợp
- 9 thẻ (card) nhận xét từ khách hàng
- Mỗi card có:
  - Avatar khách hàng
  - Tên và địa điểm
  - Số sao ⭐
  - Tiêu đề và nội dung đánh giá

### 6. **Trang Liên Hệ**
- Form nhập thông tin:
  - Họ và Tên
  - Email
  - Số điện thoại
  - Chủ đề
  - Nội dung tin nhắn
- Thông tin liên hệ (Địa chỉ, Điện thoại, Email, Giờ làm việc)
- Bản đồ nhúng Google Maps
- Phần FAQ (Câu hỏi thường gặp)

### 7. **Thiết Kế**
- ✅ Modern & Professional
- ✅ Responsive (tự động đẹp trên điện thoại, tablet, máy tính)
- ✅ Tone màu: Vàng/Cam + Trắng + Xám (nhã nhặn)
- ✅ Hiệu ứng hover mượt mà
- ✅ Animations mềm mại
- ✅ Footer đầy đủ thông tin

## 📁 Cấu Trúc File

```
EXEproject/
├── index.html          # Trang chủ
├── products.html       # Trang sản phẩm
├── reviews.html        # Trang đánh giá
├── contact.html        # Trang liên hệ
├── styles.css          # CSS chung
├── script.js           # JavaScript chung
└── README.md           # File này
```

## 🚀 Cách Sử Dụng

### 1. **Mở Trang Web**
- Mở file `index.html` bằng trình duyệt web bất kỳ
- Hoặc nhấp đúp vào file `index.html`

### 2. **Điều Hướng**
- Click vào các mục menu để chuyển sang trang khác
- Menu di động có sẵn cho thiết bị nhỏ

### 3. **Chức Năng Giỏ Hàng**
- Click "Thêm vào Giỏ" để thêm sản phẩm
- Dữ liệu giỏ được lưu trong localStorage
- Bấm "Mua Ngay" để xem trang sản phẩm

### 4. **Gửi Form Liên Hệ**
- Điền đầy đủ thông tin
- Click "Gửi Tin Nhắn"
- Sẽ hiện thông báo thành công

## 🛠️ Công Nghệ Sử Dụng

| Công Nghệ | Mục Đích | Phiên Bản |
|-----------|---------|----------|
| HTML5 | Cấu trúc trang | - |
| CSS3 | Styling | - |
| Tailwind CSS | Framework CSS | via CDN |
| JavaScript (Vanilla) | Tương tác | ES6+ |
| Google Maps API | Bản đồ nhúng | - |

## 🎨 Bảng Màu Chính

- **Vàng**: #eab308 (Logo, CTA, Highlights)
- **Cam**: #f97316 (Gradient, Accents)
- **Trắng**: #ffffff (Background, Cards)
- **Xám**: #1f2937 (Text, Footer)

## 📱 Responsive Design

- **Desktop**: Full layout tối ưu
- **Tablet**: 2-3 cột grid
- **Mobile**: 1 cột, menu folding

## 🔐 Tính Năng Bảo Mật & UX

- ✅ Form validation (email, yêu cầu nhập)
- ✅ Smooth animations
- ✅ Keyboard navigation support
- ✅ Accessible color contrast
- ✅ Mobile-friendly design
- ✅ localStorage for cart persistence

## 💡 Hướng Phát Triển Tiếp

Có thể thêm sau:
- Backend integration (Node.js, Python, PHP)
- Database (MySQL, MongoDB)
- Payment gateway (Stripe, Momo)
- User authentication
- Shopping cart advanced features
- Admin dashboard
- Analytics

## 📞 Thông Tin Liên Hệ (Demo)

- **Email**: info@goldentaste.com
- **Hotline**: 0123 456 789
- **Địa chỉ**: 123 Đường Nguyễn Huệ, Q1, TP.HCM

## 📝 Ghi Chú

- Tất cả dữ liệu sản phẩm đều là mô phỏng/mẫu
- Hình ảnh sử dụng emoji thay vì file hình ảnh
- Maps nhúng là demo
- Form gửi tin nhắn là frontend only (không gửi về server)

## 👨‍💻 Tác Giả

Tạo bởi Front-end Developer cho bài thi Checkpoint 3

---

**Happy Coding! 🚀🍯**
