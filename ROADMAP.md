# ROADMAP - HEONA MEDIA

Lộ trình phát triển và hoàn thiện nền tảng kỹ thuật số của HEONA MEDIA.

---

## Giai đoạn 1: Nền tảng cốt lõi & Nhận diện (Đã hoàn thành ✅)
- [x] Thiết lập cấu trúc dự án chuẩn với React 18, Vite, TypeScript và Tailwind CSS.
- [x] Định hình phong cách thiết kế Deep Dark Mode, Glassmorphism, Ambient Orbs và micro-interactions.
- [x] Tối ưu hóa trải nghiệm Mobile độc quyền: Floating Dock Menu cố định, Layout responsive theo tỷ lệ màn hình.
- [x] Xây dựng các trang chức năng:
  - Trang chủ (`/`)
  - Về chúng tôi (`/about`)
  - Dịch vụ (`/services`)
  - Dự án tiêu biểu (`/projects`)
  - Bảng giá minh bạch (`/pricing`)
  - Blog & Kiến thức (`/blog`)
  - Liên hệ trực tiếp & Tích hợp EmailJS (`/contact`)
- [x] Tích hợp chuẩn SEO / AIO với `react-helmet-async` và JSON-LD Schema (Organization, FAQPage, LocalBusiness).
- [x] Cấu hình tối ưu deploy Vercel với Clean URLs và caching headers.

---

## Giai đoạn 2: Nâng cấp trải nghiệm & Chuyển đổi số (Q3 - Q4 / 2025 🚀)
- [ ] **Hệ thống tính chi phí tự động (Quotation Calculator):**
  - Cho phép khách hàng chọn loại sự kiện, quy mô khách mời, các hạng mục media để nhận ước tính báo giá tức thì.
- [ ] **Hệ quản trị nội dung Blog nâng cao (MDX / Headless CMS):**
  - Hỗ trợ bài viết định dạng phong phú hơn (Markdown / MDX / Strapi / Sanity), bộ lọc danh mục và tìm kiếm bài viết thời gian thực.
- [x] **Tối ưu hóa Media & Assets:**
  - Chuyển đổi toàn bộ hình ảnh sang định dạng WebP hiện đại, lưu trữ nội bộ tại `public/images/` (tiết kiệm 46% dung lượng).
  - Đạt chuẩn tải nhanh và tối ưu Core Web Vitals (LCP).
- [ ] **Tích hợp Tracking Chuyển đổi:**
  - Cài đặt Google Tag Manager (GTM), Meta Pixel, TikTok Pixel để đo lường hiệu quả quảng cáo và tỷ lệ điền form.

---

## Giai đoạn 3: Mở rộng tính năng & Khách hàng tương tác (2026 🔮)
- [ ] **Video Portfolio & Case Studies tương tác:**
  - Tích hợp video player tối ưu cho các highlight reel sự kiện và case studies xây dựng nhân hiệu (số liệu trước/sau khi triển khai).
- [ ] **Cổng Khách Hàng (Client Portal / Booking Calendar):**
  - Tích hợp lịch hẹn tư vấn trực tuyến (Calendly / Cal.com).
  - Khu vực theo dõi tiến độ dự án sự kiện / quay dựng media dành cho khách hàng ký hợp đồng.
- [ ] **Đa ngôn ngữ (Tiếng Việt & Tiếng Anh):**
  - Tích hợp `react-i18next` để phục vụ khách hàng doanh nghiệp nước ngoài (FDI) có nhu cầu tổ chức sự kiện tại Việt Nam.

---

## Giai đoạn 4: Ứng dụng AI & Tự động hóa truyền thông (Tương lai 🌟)
- [ ] **AI Brand Diagnostic Tool:**
  - Mini-app trắc nghiệm đánh giá sức khỏe thương hiệu cá nhân bằng AI, đưa ra gợi ý lộ trình xây dựng nhân hiệu tự động cho khách hàng.
- [ ] **Chatbot AI Tư vấn 24/7:**
  - Chatbot hỗ trợ giải đáp thắc mắc dịch vụ, báo giá sơ bộ và thu thập lead tự động kết nối qua Telegram / Zalo OA.
