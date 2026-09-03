# DECISIONS - HEONA MEDIA (Architecture Decision Records)

Tài liệu ghi lại các quyết định kiến trúc quan trọng (ADRs - Architecture Decision Records) đã được lựa chọn trong quá trình phát triển hệ thống.

---

### ADR-001: Lựa chọn Vite + React 18 + TypeScript làm Tech Stack chính
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Cần xây dựng website có tốc độ phản hồi cực nhanh, hiệu ứng mượt mà, dễ bảo trì và có độ ổn định cao.
* **Quyết định:** Sử dụng Vite (phiên bản 5) kết hợp React 18 và TypeScript thay vì Next.js hay Create React App.
* **Lý do:**
  - Vite cho tốc độ khởi động máy chủ và HMR (Hot Module Replacement) chỉ tính bằng mili-giây.
  - Dự án định hướng triển khai tĩnh (Static / SPA) trên Vercel Edge, không cần hạ tầng máy chủ Node.js phức tạp chạy SSR, tiết kiệm tối đa chi phí vận hành.
  - TypeScript đảm bảo kiểm soát chặt chẽ kiểu dữ liệu, giảm thiểu lỗi runtime.

---

### ADR-002: Sử dụng Vanilla Tailwind CSS thay vì thư viện UI Component bên thứ ba
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Website mang phong cách sáng tạo, truyền thông và công nghệ với các hiệu ứng thị giác đặc thù (Deep Dark Mode, Glassmorphism, Ambient Orbs, Custom Micro-interactions).
* **Quyết định:** Sử dụng Tailwind CSS thuần kết hợp CSS biến mở rộng trong `tailwind.config.js` và `index.css`, không sử dụng các UI kit đóng gói sẵn (như Ant Design, Material UI, Chakra UI).
* **Lý do:**
  - Các thư viện UI đóng gói sẵn thường mang phong cách văn phòng/doanh nghiệp tiêu chuẩn, khó tùy biến sâu hiệu ứng kính mờ và ánh sáng phát quang neon.
  - Thư viện ngoài làm tăng dung lượng bundle và thời gian dựng trang.
  - Tailwind cho phép kiểm soát 100% kích thước, khoảng cách và hành vi responsive trên từng breakpoint (`sm:`, `md:`, `lg:`).

---

### ADR-003: Quản lý SEO và Dữ liệu có cấu trúc Schema bằng React Helmet Async
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Website là trang SPA nhưng đòi hỏi điểm số SEO vượt trội trên Google Tìm kiếm và phải tối ưu hóa cho các công cụ trả lời AI (GEO/AIO - Perplexity, Gemini, ChatGPT).
* **Quyết định:** Đóng gói toàn bộ logic thẻ meta và cấu trúc JSON-LD vào component dùng chung `<SEO />`, sử dụng thư viện `react-helmet-async`.
* **Lý do:**
  - `react-helmet-async` khắc phục triệt để các rò rỉ bộ nhớ (memory leak) và cảnh báo React 18 concurrency so với `react-helmet` truyền thống.
  - Dễ dàng gắn các schema quan trọng (`Organization`, `WebSite`, `FAQPage`, `LocalBusiness`) trên từng trang cụ thể mà không làm gián đoạn luồng code chính.

---

### ADR-004: Thiết kế Menu di động dạng Floating Dock Menu cố định
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Người dùng truy cập bằng điện thoại thông minh chiếm hơn 75% lưu lượng. Menu thanh trượt truyền thống (Hamburger Drawer) yêu cầu người dùng phải vươn ngón tay lên góc trên cùng màn hình.
* **Quyết định:** Xây dựng component `<FloatingMenu />` dạng thanh dock nổi cố định ở mép dưới màn hình (`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]`).
* **Lý do:**
  - Tối ưu hoàn hảo cho thao tác một tay bằng ngón cái (Thumb-zone UX).
  - Kết hợp kính mờ Glassmorphism và viền sáng nhẹ tạo cảm giác hiện đại, tương tự trải nghiệm ứng dụng native trên iOS/Android.

---

### ADR-005: Chiến lược Tải ảnh tiến trình qua ProgressiveImage
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Các dự án và bài viết sử dụng nhiều hình ảnh sự kiện chất lượng cao, dễ gây hiện tượng nhảy giao diện (Cumulative Layout Shift) khi mạng chập chờn.
* **Quyết định:** Tạo component `<ProgressiveImage />` với hiệu ứng skeleton placeholder dạng shimmer và fade-in khi ảnh load xong.
* **Lý do:**
  - Nâng cao trải nghiệm thị giác ngay cả khi mạng chậm.
  - Đảm bảo điểm số Core Web Vitals (đặc biệt là tiêu chí CLS) luôn đạt chuẩn xanh của Google.

---

### ADR-006: Tích hợp EmailJS gửi form liên hệ phía Client
* **Trạng thái:** Đã chấp thuận (Accepted)
* **Bối cảnh:** Cần tiếp nhận thông tin đăng ký tư vấn và báo giá của khách hàng mà không cần dựng backend API riêng.
* **Quyết định:** Tích hợp trực tiếp `@emailjs/browser` vào trang `<Contact />`.
* **Lý do:**
  - Tiết kiệm chi phí duy trì máy chủ backend.
  - Dữ liệu liên hệ được chuyển tiếp tức thì về hòm thư điện tử của ban điều hành `heonamedia@gmail.com`.
