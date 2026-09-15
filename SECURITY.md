# Security Policy & Considerations - Heona Media

Tài liệu mô tả chính sách bảo mật, các rủi ro tiềm ẩn và giải pháp phòng vệ của website Heona Media.

---

## 1. Kiến trúc Bảo mật Tổng thể

Hệ thống Heona Media hoạt động theo mô hình Jamstack (Client-Side SPA kết hợp SSR Prerendering), mang lại bề mặt tấn công cực kỳ nhỏ (Zero Attack Surface) so với các CMS truyền thống như WordPress:
- **Không có Cơ sở dữ liệu SQL:** Miễn nhiễm hoàn toàn với các cuộc tấn công SQL Injection.
- **Không có Máy chủ Backend để bị chiếm quyền:** Hệ thống không duy trì server Node.js/PHP/Python chạy nền ở production. Các trang tĩnh được phân phối trực tiếp từ Edge CDN của Vercel.

---

## 2. Bảo mật Giao diện & Dữ liệu

### 2.1. Phòng chống Cross-Site Scripting (XSS)
- React tự động mã hóa (escape) toàn bộ dữ liệu chuỗi khi render ra JSX.
- Toàn bộ codebase **không sử dụng** `dangerouslySetInnerHTML` đối với bất kỳ nguồn dữ liệu không đáng tin cậy nào từ người dùng.

### 2.2. Bảo mật Khóa API EmailJS
- Khóa công khai `VITE_EMAILJS_PUBLIC_KEY` được thiết kế chuyên biệt để hoạt động an toàn phía client.
- Để phòng chống spam bot gửi tràn form, ban quản trị cấu hình Rate Limiting và Captcha trên bảng điều khiển quản trị EmailJS Dashboard.

### 2.3. Bảo mật Khu vực Quản trị (/admin/*)
- Giao diện Admin phục vụ công tác biên tập nội bộ. Trên môi trường production Vercel, khuyến nghị bật tính năng **Vercel Password Protection** hoặc giới hạn IP nội bộ cho tiền tố `/admin` để ngăn chặn truy cập trái phép.