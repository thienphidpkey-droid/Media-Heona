# Component Catalog - Heona Media

Tài liệu tra cứu cấu trúc, phân loại và vai trò của các components trong hệ thống Heona Media.

---

## 1. Components Giao diện Công khai (Public Website Components)

Thư mục: `components/`

| Component | Đường dẫn | Chức năng chính |
|---|---|---|
| **Layout** | `components/Layout.tsx` | Khung bao ngoài, chứa tech-grid canvas, ambient light orbs, header và floating dock menu. |
| **Header** | `components/Header.tsx` | Thanh điều hướng phía trên dành cho Desktop & Tablet (logo, menu links, CTA tư vấn). |
| **FloatingMenu** | `components/FloatingMenu.tsx` | Thanh điều hướng dạng Dock nổi cố định dưới đáy màn hình trên Mobile/Tablet (`z-[9999]`), tối ưu ngón tay cái. |
| **Footer** | `components/Footer.tsx` | Chân trang với thông tin pháp lý, mạng xã hội, bản đồ và chứng nhận. |
| **SEO** | `components/SEO.tsx` | Inject thẻ meta động (Title, Description, OG, Twitter) và mã cấu trúc JSON-LD Schema. |
| **Card** | `components/Card.tsx` | Khung thẻ kính mờ (Glassmorphism), viền sáng nhẹ và hiệu ứng hover glow neon. |
| **Section** | `components/Section.tsx` | Khung chuẩn hóa container, padding và tiêu đề cho từng phân đoạn nội dung. |
| **ProgressiveImage** | `components/ProgressiveImage.tsx` | Bộ hiển thị hình ảnh tối ưu với skeleton placeholder dạng shimmer, chống giật khung hình (CLS). |

---

## 2. Components Quản trị Nội bộ (Admin CMS Components)

Thư mục: `admin/components/`

| Component | Đường dẫn | Chức năng chính |
|---|---|---|
| **AdminLayout** | `admin/components/layout/AdminLayout.tsx` | Khung quản trị toàn diện: Top navbar dính (h-16), sidebar phẳng danh mục (w-64 desktop), mobile drawer và global search modal. |
| **MediaPickerModal** | `admin/components/MediaPickerModal.tsx` | Modal pop-up chọn nhanh hình ảnh từ kho Media Library hoặc tải ảnh mới. |
| **ContentCalendar** | `admin/components/ContentCalendar.tsx` | Lịch trực quan hiển thị kế hoạch các bài viết và dự án đã lên lịch xuất bản. |
| **Toast** | `admin/components/Toast.tsx` | Hệ thống thông báo trạng thái nổi (Alert feedback: Success / Error / Warning). |

---

## 3. Các Trang Quản trị (Admin Pages)

Thư mục: `admin/pages/`

| Trang | File | Vai trò |
|---|---|---|
| **Dashboard** | `admin/pages/Dashboard.tsx` | Bức tranh tổng quan: Lời chào cá nhân hóa, khối việc cần xử lý ngay, bảng nội dung cập nhật gần đây. |
| **Case Study Editor** | `admin/pages/projects/ProjectEditor.tsx` | Bộ soạn thảo Case Study chuyên nghiệp 2 Cột: Mục lục cố định (299px), Form 8 phần chi tiết, Modal Preview toàn màn hình. |
| **Project List** | `admin/pages/projects/ProjectList.tsx` | Danh sách dự án với bộ lọc pill tabs gọn nhẹ theo nhóm dịch vụ mũi nhọn, tìm kiếm tức thì. |
| **Article Editor** | `admin/pages/articles/ArticleEditor.tsx` | Soạn thảo bài viết chuyên sâu: SEO tags, Heona CTA block, xuất bản hẹn giờ. |
| **Article List** | `admin/pages/articles/ArticleList.tsx` | Quản lý danh sách bài viết theo chuyên mục, trạng thái và tác giả. |
| **Media Library** | `admin/pages/media/MediaLibrary.tsx` | Kho tài nguyên đa phương tiện với chức năng upload, phân loại và copy URL nhanh. |
| **Leads Inbox (Hộp thư)** | `admin/pages/leads/LeadsInbox.tsx` | Tiếp nhận và quản lý tiến độ xử lý khách hàng tiềm năng gửi từ website. |
| **Admin Roles** | `admin/pages/users/AdminRoles.tsx` | Quản lý tài khoản quản trị và cấp quyền truy cập hệ thống. |