# Feature Specifications - Heona Media

Tài liệu danh mục tính năng chi tiết của hệ thống Heona Media (Public Website & Admin Content OS).

---

## 1. Tính năng Website Công khai (Public Website Features)

### 1.1. Trải nghiệm Thị giác Đỉnh cao (WOW Experience)
- **Deep Dark Mode & Ambient Glow:** Nền tối huyền bí kết hợp ánh sáng phó quang neon tinh tế (Tím `#6f3aff` và Hồng/Cam).
- **Glassmorphism:** Thẻ card kính mờ với hiệu ứng phản chiếu viền sáng mềm mại khi rê chuột.
- **Progressive Image Loading:** Khung placeholder shimmer xám đen trong khi tải ảnh gốc, ngăn chặn hiện tượng nhảy bố cục (CLS = 0).

### 1.2. Floating Dock Menu (Thumb-Zone Mobile UX)
- Thanh điều hướng nổi cố định sát đáy màn hình trên thiết bị di động (`lg:hidden`).
- Tích hợp hiệu ứng làm mờ nền kính viền tím, thao tác tiện lợi hoàn toàn bằng ngón cái.
- Hỗ trợ phản hồi trạng thái trang đang đứng theo thời gian thực.

### 1.3. Hồ sơ Dự án Thực chiến (Case Study Showcase)
- Phân loại rõ ràng theo 3 mũi nhọn: `Expert Spotlight`, `School Story`, `Event to Content`.
- Trình bày toàn diện: Bối cảnh, thách thức, mục tiêu, giải pháp Heona, quy trình thực hiện, các con số KPI định lượng (ví dụ: `2M+ views`, `100+ clips`), đánh giá của khách hàng và thư viện hình ảnh thực tế.

### 1.4. Tối ưu hóa SEO & Generative AI Search (AIO / GEO)
- Thẻ OpenGraph động, ảnh thumbnail chuẩn tỷ lệ 1.91:1.
- Hệ thống Schema JSON-LD đa tầng: `Organization`, `LocalBusiness`, `WebSite`, `FAQPage`. Hỗ trợ các công cụ tìm kiếm AI (ChatGPT, Perplexity, Gemini) trích xuất câu trả lời trực tiếp.

### 1.5. Form Liên hệ Không cần Backend (EmailJS Integration)
- Khách hàng điền thông tin tư vấn/báo giá được gửi trực tiếp về email điều hành `heonamedia@gmail.com` qua SDK EmailJS, đồng thời lưu vào Hộp thư quản trị.

---

## 2. Tính năng Quản trị Nội bộ (Admin Content OS Features)

### 2.1. Dashboard Tinh gọn & Trọng tâm
- Lời chào cá nhân hóa theo tài khoản đăng nhập.
- Khối **"Việc cần xử lý ngay"** nêu bật các bài viết đang chờ duyệt hoặc leads mới chưa liên hệ.
- Bảng tổng hợp nội dung vừa cập nhật với thao tác nhanh: Sửa, Xem trước, Nhân bản bài viết, Xóa.

### 2.2. Case Study Editor Chuyên nghiệp (ProjectEditor)
- **Kiến trúc 2 Cột Hiện đại:**
  - Cột 1 (299px sticky): Mục lục số hóa 8 phần kèm thanh tiến độ "Hoàn thiện X/8 phần" và checklist hợp lệ.
  - Cột 2 (Vùng soạn thảo trung tâm rộng thoáng): Nhập liệu 8 khối thông tin bài bản không bị gò bó.
  - Cột 3 (300px sticky): Modal Xem trước chi tiết khi bấm nút Xem trước (ảnh bìa, tiêu đề, danh mục, dịch vụ, chỉ số KPI, testimonial).
- **Section 03 (Giải pháp):** Bố cục 2 cột song song (Lưới nút chọn dịch vụ + Textarea chiến lược).
- **Section 04 (Quy trình):** Các bước tiến hành hiển thị lưới 2 cột gọn gàng.
- **Section 05 (KPIs):** Nhập liệu con số định lượng với cơ chế cập nhật bất biến (Immutable State).
- **Section 06 (Testimonial):** Gắn cờ xuất hiện trang chủ.
- **Section 08 (SEO Preview):** Mô phỏng trực quan kết quả tìm kiếm trên Google (SERP Preview).

### 2.3. Hộp thư Khách hàng (Leads CRM)
- Tiếp nhận và gắn thẻ trạng thái xử lý cho từng liên hệ: `New`, `Contacted`, `Qualified`, `Closed`.

### 2.4. Thư viện Đa phương tiện (Media Library)
- Kho lưu trữ ảnh tập trung, hỗ trợ chọn nhanh vào bài viết qua component `MediaPickerModal`.