# ARCHITECTURAL DECISION RECORDS (ADR) - HEONA MEDIA

Tài liệu lưu trữ các quyết định kiến trúc kỹ thuật quan trọng trong quá trình phát triển sản phẩm.

---

### ADR-001: Khởi tạo Tech Stack với Vite + React 18 + TypeScript + Tailwind CSS
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Quyết định:** Sử dụng Vite làm bundler chính, TypeScript kiểm soát kiểu dữ liệu và Tailwind CSS cho styling.

---

### ADR-002: Kiến trúc Quản trị Client-side LocalStorage DB (Zero-Infra)
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Cần hệ thống CMS quản trị nội bộ nhanh chóng, không tốn chi phí vận hành server hay cơ sở dữ liệu cloud phức tạp trong giai đoạn khởi đầu.
* **Quyết định:** Triển khai tầng dữ liệu trong `admin/services/db.ts` lưu trữ qua `localStorage`, trừu tượng hóa toàn bộ qua Service Class.
* **Hệ quả:** Hoạt động độc lập, chi phí 0đ, sẵn sàng chuyển đổi sang Supabase/API bất cứ khi nào có yêu cầu.

---

### ADR-003: Đồng bộ hóa Typography toàn hệ thống sang font Inter
* **Trạng thái:** Đã chấp thuận (Accepted - v1.4)
* **Bối cảnh:** Trước đây hệ thống kết hợp Montserrat cho tiêu đề và Inter cho nội dung, gây cảm giác tương phản gắt và mang hơi hướng futuristic không phù hợp với định vị Agency hiện đại, tinh gọn.
* **Quyết định:** Loại bỏ hoàn toàn Montserrat và font-mono khỏi index.html và tailwind.config.js; chỉ sử dụng duy nhất họ font **Inter**.

---

### ADR-004: Kiến trúc 2 Cột cho Case Study Editor (ProjectEditor)
* **Trạng thái:** Đã chấp thuận (Accepted - v1.4)
* **Bối cảnh:** Form biên tập Case Study dài và nhiều trường, người dùng khó hình dung sản phẩm thực tế khi nhập liệu.
* **Quyết định:** Bố trí layout 2 Cột trong container `max-w-[1440px]`:
  - Cột trái (299px sticky): Mục lục 8 phần và thanh đo tiến độ.
  - Cột giữa (minmax(0, 1fr)): Form soạn thảo nội dung.
  - Cột phải (300px sticky): Modal Preview toàn màn hình.

---

### ADR-005: Menu Nổi Ngón Tay Cái (Floating Dock Menu) trên Mobile
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Quyết định:** Sử dụng thanh Dock kính mờ cố định sát đáy màn hình di động thay cho menu Hamburger góc trên để tối ưu ngón cái (Thumb-zone UX).

---

### ADR-006: Bộ lọc Dự án Dạng Pill Tabs Gọn nhẹ
* **Trạng thái:** Đã chấp thuận (Accepted - v1.4)
* **Quyết định:** Chuyển đổi 4 card danh mục lớn tại `ProjectList.tsx` thành các tab viên thuốc (Pill tabs) nằm ngang, tiết kiệm 70% diện tích thẳng đứng.

---

### ADR-007: Bảo mật Supabase RLS Zero-Trust & View Chiếu Công Khai (public_clients)
* **Trạng thái:** Đã chấp thuận (Accepted - v1.5)
* **Bối cảnh:** CSDL Supabase lưu trữ thông tin nhạy cảm của khách hàng (`phone`, `email`, `notes`), cần ngăn chặn hoàn toàn việc rò rỉ dữ liệu qua anonymous SELECT.
* **Quyết định:**
  - Thiết lập hàm IAM tập trung `public.is_admin()` whitelist email quản trị viên.
  - Sử dụng View bảo mật `public_clients` (`security_invoker = false`) chỉ công khai trường cần thiết (`id, name, logo, industry, website, description, project_count`), thu hồi toàn bộ quyền đọc bảng gốc `clients` từ role `anon`.
  - Khóa toàn bộ quyền upload/sửa/xóa trên Supabase Storage `storage.objects` chỉ dành cho `is_admin()`.

---

### ADR-008: Trích xuất Thumbnail Tự động từ YouTube & Nới lỏng CSP có kiểm soát
* **Trạng thái:** Đã chấp thuận (Accepted - v1.5)
* **Bối cảnh:** Biên tập viên thường xuyên sử dụng video YouTube làm tư liệu bài viết, cần cách thức lấy ảnh bìa nhanh chóng không cần download thủ công.
* **Quyết định:** Tích hợp bộ parser regex trích xuất video ID (`youtube.com/watch`, `youtu.be`, `shorts`), tự động tải ảnh bìa chất lượng cao (`maxresdefault.jpg` fallback `hqdefault.jpg`), bổ sung `img-src` trong `vercel.json` cho phép tải ảnh từ domain `ytimg.com` và `youtube.com`.

---

### ADR-009: Cửa sổ Popup (Modal) cho Bài viết Blog Giữ nguyên Vị trí Cuộn & Dynamic URL
* **Trạng thái:** Đã chấp thuận (Accepted - v1.5)
* **Bối cảnh:** Việc chuyển trang toàn phần khi đọc bài viết blog làm mất vị trí cuộn và gây cảm giác nặng nề cho người duyệt bài.
* **Quyết định:** Khi người đọc bấm vào card bài viết, kích hoạt cửa sổ Popup (Modal) kính mờ trung tâm, khóa cuộn trang nền (`body overflow: hidden`), hỗ trợ phím ESC và bấm ngoài để đóng. Đồng bộ URL `/blog/:slug` qua history API đảm bảo chia sẻ link và SEO crawlability.

---

### ADR-010: Quản lý Logo Khách hàng Linh hoạt (WebP Upload + Link ảnh + Media Library)
* **Trạng thái:** Đã chấp thuận (Accepted - v1.5)
* **Bối cảnh:** Modal chỉnh sửa khách hàng trước đây thiếu ô nhập logo, và việc sử dụng `type="url"` gây lỗi HTML5 validation khi chọn ảnh đường dẫn nội bộ từ thư viện.
* **Quyết định:** Sử dụng `type="text"` cho ô nhập link ảnh, hỗ trợ xem trước ảnh tròn viền phát sáng, tích hợp tải tệp trực tiếp tự nén WebP và chọn ảnh 1-click từ `MediaPickerModal`.