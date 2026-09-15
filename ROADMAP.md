# ROADMAP - HEONA MEDIA

Lộ trình phát triển sản phẩm, các hạng mục đã hoàn thành và kế hoạch tương lai của hệ thống HEONA MEDIA.

---

## 1. Đã hoàn thành (Completed Milestones)

### Phiên bản v1.4 (15/09/2026) - Đợt Tái cấu trúc Toàn diện Admin UI/UX
- [x] **Redesign Case Study Editor (ProjectEditor):**
  - Chuyển đổi sang cấu trúc 2 Cột cân đối: Mục lục cố định (299px) - Vùng soạn thảo trung tâm rộng thoáng - Modal Preview toàn màn hình.
  - Tăng độ rộng tổng thể container lên 1600px (+30% chiều ngang).
  - Bố cục Section 03 (Giải pháp): Lưới chọn dịch vụ và textarea chiến lược nằm song song 2 cột.
  - Bố cục Section 04 (Quy trình): Danh sách bước tiến hành hiển thị lưới 2 cột.
  - Sửa lỗi cập nhật chỉ số KPI bằng cơ chế cập nhật mảng bất biến (Immutable State).
  - Thêm huy hiệu cảnh báo Section 06 "★ Xuất hiện ở Trang chủ".
- [x] **Chuẩn hóa Hệ thống Font:** Loại bỏ triệt để font Montserrat và font-mono; toàn bộ hệ thống chuyển về **Inter**.
- [x] **Refine Dashboard & Navigation:**
  - Bỏ thanh 6 thẻ số liệu KPI rườm rà tại Dashboard.
  - Làm phẳng Sidebar Admin: Loại bỏ toàn bộ nhãn nhóm (NỘI DUNG, DỰ ÁN, HỆ THỐNG).
  - Đổi tên "Leads CRM" thành "Hộp thư" và "Người dùng & Quyền" thành "Admin Roles".
- [x] **Thu gọn Bộ lọc Dự án (ProjectList):** Chuyển từ 4 khối card cồng kềnh thành thanh pill tabs thanh lịch nằm ngang.

### Phiên bản v1.3 (08/09/2026) - Tối ưu hóa SEO & Audit An toàn
- [x] Triển khai hệ thống Schema JSON-LD đa tầng (`Organization`, `LocalBusiness`, `FAQPage`).
- [x] Tối ưu hóa điểm số Core Web Vitals và thiết lập cấu hình Prerender 15 static routes.

### Phiên bản v1.0 - v1.2 - Nền tảng Website & Quản trị Nội bộ
- [x] Xây dựng toàn bộ 7 trang công khai cốt lõi.
- [x] Phát triển Floating Dock Menu tối ưu ngón tay cái cho thiết bị di động.
- [x] Tích hợp EmailJS và hệ thống lưu trữ LocalStorage DB Service.

---

## 2. Kế hoạch Sắp tới (Upcoming Milestones)

- [ ] **Rich Text Editor Nâng cao:** Tích hợp TipTap hoặc Lexical cho phần soạn thảo nội dung bài viết chi tiết.
- [ ] **Tích hợp Cloud Media Storage:** Hỗ trợ tải ảnh trực tiếp lên Cloudinary hoặc Cloudflare R2 khi dung lượng vượt quá giới hạn trình duyệt.
- [ ] **Bộ kiểm thử Tự động:** Bổ sung Vitest cho unit tests và Playwright cho luồng kiểm thử E2E.
- [ ] **Phân trang Blog Công khai:** Hỗ trợ tải thêm hoặc chia trang khi số lượng bài viết vượt quá 20 bài.
- [ ] **Chuyển đổi Backend Linh hoạt:** Khi có yêu cầu, kích hoạt cổng Supabase / REST API thông qua tầng DB Service có sẵn.