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
- Mọi nội dung HTML từ bộ soạn thảo trực quan (WYSIWYG) đều được lọc sạch qua bộ hàm lọc bảo mật [sanitizeHtml](file:///g:/project/GIT%20liquid-automation/Media-Heona/utils/sanitizeHtml.ts) trước khi render qua `dangerouslySetInnerHTML`, triệt tiêu hoàn toàn nguy cơ Stored XSS.

### 2.2. Bảo mật Khóa API EmailJS & Tầng Gửi Lead
- Khóa công khai `VITE_EMAILJS_PUBLIC_KEY` được thiết kế chuyên biệt để hoạt động an toàn phía client.
- Dữ liệu form liên hệ gửi lên được cắt gọt giới hạn độ dài trường (clamp field size) để chống DoS tràn bộ nhớ, và trạng thái mặc định luôn bị ép về `New`.

### 2.3. Bảo mật Cơ sở Dữ liệu Supabase & Row Level Security (RLS)
- Áp dụng nguyên tắc Zero-Trust và `FORCE ROW LEVEL SECURITY` trên toàn bộ bảng.
- **Hàm định danh tập trung `public.is_admin()`:** Chỉ công nhận 2 email Quản trị viên trong Whitelist (`thienph.idpkey@gmail.com` và `heonamedia@gmail.com`).
- **Bảo vệ dữ liệu khách hàng (Privileged Projection View):** Bảng gốc `clients` bị thu hồi quyền đọc từ `anon`. Khách vãng lai chỉ có thể truy vấn qua View bảo mật `public_clients` (`security_invoker = false`), che giấu hoàn toàn các cột nhạy cảm (`phone`, `email`, `contact_person`, `notes`).
- **Khóa cứng Supabase Storage (`storage.objects`):** Chỉ cho phép `anon` đọc file từ bucket công khai (`media`). Toàn bộ quyền upload, chỉnh sửa, xóa file đều bị khóa chặt và chỉ dành riêng cho `is_admin()`.

### 2.4. Bảo mật Khu vực Quản trị (/admin/*)
- **Ẩn hoàn toàn điểm truy cập công khai (Stealth Mode):** Toàn bộ link hoặc nút bấm điều hướng vào `/admin` đã được loại bỏ khỏi giao diện người dùng. Nếu khách truy cập thông thường nhập thẳng `/admin` hoặc `/admin/login` trên thanh địa chỉ khi chưa xác thực, hệ thống lập tức tự động chuyển hướng (`redirect`) về trang chủ (`/`), ngăn ngừa hoàn toàn việc dò quét hoặc tấn công brute-force.
- **Cơ chế kích hoạt Đăng nhập Ẩn:** Quản trị viên sử dụng tổ hợp phím **`Ctrl + Shift + A`** (hoặc `Cmd + Shift + A` trên MacOS) để mở Modal xác thực bảo mật nội bộ.
- **Xác thực Google OAuth 2.0 & Danh sách Trắng (Email Whitelist):**
  - CMS tích hợp trực tiếp với Supabase Auth sử dụng Google OAuth 2.0.
  - Bắt buộc kiểm tra danh sách email quản trị viên được phép (`thienph.idpkey@gmail.com` và `heonamedia@gmail.com`). Bất kỳ tài khoản Google nào không nằm trong danh sách được cấp quyền sẽ bị từ chối và tự động đăng xuất ngay lập tức.
  - Gỡ bỏ hoàn toàn cụm nút chuyển quyền test ảo (mock switcher) để tránh nhầm lẫn hoặc lỗi hạ quyền sai lệch.
- **Content Security Policy (CSP):** Cấu hình chặt chẽ trong `vercel.json`, kiểm soát nguồn tải hình ảnh (`img-src` chỉ cho phép domain hệ thống, Supabase Storage, YouTube và Unsplash).