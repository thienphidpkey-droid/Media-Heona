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

### 2.2. Bảo mật Form Khách Hàng Tiềm Năng (Leads CRM) & Gửi Lead Đa Kênh
- **Khóa công khai `VITE_EMAILJS_PUBLIC_KEY`**: Được thiết kế an toàn phía client, tích hợp honeypot ẩn chống bot tự động.
- **Chuẩn hóa Canonical Schema (`service_interested`)**: Đồng bộ 100% giữa Database Schema, RLS Policies và Client Types (`leads.service_interested`), ngăn chặn hoàn toàn lỗi PostgreSQL 42703 dẫn đến hủy transaction hàng loạt.
- **Kiểm soát Tần suất & Chống Spam Database Trigger (`trg_lead_rate_limit`)**:
  - Chống spam gửi lặp: chặn gửi cùng số điện thoại hoặc email trong vòng 5 phút (ERRCODE: `23505`).
  - Rate limiting toàn cục: giới hạn tối đa 15 lead công khai / 10 phút để bảo vệ bảng leads khỏi nguy cơ DoS flooding và tràn bộ nhớ.
  - Kiểm tra định dạng Regex Email và Số điện thoại ngay tại tầng DB trước khi cho phép INSERT.
- **Xử lý Đa Kênh (Dual-Channel Delivery Fallback)**: Form liên hệ tại `/contact` gửi song song qua Supabase Cloud và EmailJS với `Promise.allSettled`. Chỉ báo thành công khi ít nhất 1 kênh nhận dữ liệu; nếu cả 2 kênh đều gián đoạn, hiển thị thông báo lỗi rõ ràng kèm số điện thoại Hotline/Zalo để khách hàng không bị thất lạc liên lạc.
- **Bảo vệ Dữ liệu Định danh Cá nhân (Zero PII Leakage in Browser)**:
  - Khách vãng lai gửi form liên hệ không bị ghi đè thông tin PII vào `localStorage`.
  - Quản trị viên sau khi làm việc khi nhấn Đăng xuất (`logout()`) sẽ lập tức xóa sạch toàn bộ bộ nhớ tạm Leads, Activity Logs và Notifications khỏi trình duyệt.

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