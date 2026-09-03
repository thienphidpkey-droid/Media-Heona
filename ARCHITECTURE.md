# ARCHITECTURE - HEONA MEDIA

Tài liệu mô tả kiến trúc kỹ thuật, cấu trúc thư mục, luồng dữ liệu và hạ tầng triển khai của website HEONA MEDIA.

---

## 1. Công nghệ nền tảng (Tech Stack)

| Hạng mục | Công nghệ | Phiên bản | Vai trò |
|---|---|---|---|
| **Core Framework** | React | ^18.2.0 | UI rendering & component model |
| **Language** | TypeScript | ^5.2.2 | Type safety & developer experience |
| **Bundler & Dev Server** | Vite | ^5.2.0 | Fast HMR, optimized ESM builds |
| **Styling** | Tailwind CSS | ^3.4.1 | Utility-first CSS & theme customization |
| **PostCSS / Autoprefixer** | PostCSS | ^8.4.35 | Tự động thêm vendor prefix cho CSS |
| **Routing** | React Router DOM | ^6.22.3 | Client-side routing với code splitting |
| **Icons** | Lucide React | ^0.344.0 | Bộ icon hiện đại, tối ưu tree-shaking |
| **SEO & Head Management** | React Helmet Async | ^2.0.4 | Thẻ meta động, Open Graph, JSON-LD Schema |
| **Email Service** | @emailjs/browser | ^4.3.3 | Gửi form liên hệ từ client không cần backend |

---

## 2. Cấu trúc thư mục (Directory Structure)

```text
Media-Heona/
├── components/          # Reusable UI & layout components
│   ├── Card.tsx         # Khung Card hiệu ứng Glassmorphism & Hover Glow
│   ├── FloatingMenu.tsx # Menu điều hướng nổi cố định dưới đáy trên Mobile (z-[9999])
│   ├── Footer.tsx       # Chân trang với thông tin pháp lý, mạng xã hội, bản đồ
│   ├── Header.tsx       # Thanh điều hướng phía trên cho Desktop & tablet
│   ├── Layout.tsx       # Khung layout bọc ngoài (background grid, light orbs)
│   ├── ProgressiveImage.tsx # Image loader với skeleton & fade-in animation
│   ├── Section.tsx      # Section wrapper chuẩn hóa container & padding
│   └── SEO.tsx          # Component inject meta tags & JSON-LD schema động
├── context/
│   └── ContentContext.tsx # Centralized React Context chứa dữ liệu mẫu / mock data
├── pages/               # Các trang giao diện (Lazy Loaded)
│   ├── About.tsx        # Giới thiệu công ty, tầm nhìn, đội ngũ
│   ├── Blog.tsx         # Danh sách bài viết & chi tiết bài viết
│   ├── Contact.tsx      # Form liên hệ kết hợp EmailJS & thông tin hotline/địa chỉ
│   ├── Home.tsx         # Trang chủ giới thiệu tổng quan, số liệu, dịch vụ, dự án
│   ├── Pricing.tsx      # Bảng giá các gói dịch vụ
│   ├── Projects.tsx     # Bộ sưu tập các dự án tiêu biểu theo danh mục
│   └── Services.tsx     # Chi tiết các gói giải pháp truyền thông
├── public/              # Static assets (images, icons, robots.txt, sitemap.xml)
├── App.tsx              # Root component: ContentProvider, Router, Lazy Routes
├── index.tsx            # Entry point bọc HelmetProvider & React DOM Root
├── types.ts             # Toàn bộ TypeScript interfaces & types của dự án
├── tailwind.config.js   # Cấu hình màu sắc thương hiệu, font chữ, animation
├── vercel.json          # Cấu hình deployment: caching, cleanUrls, SPA rewrites
└── vite.config.ts       # Cấu hình Vite bundler & plugins
```

---

## 3. Kiến trúc thành phần & Luồng dữ liệu (Data & Component Flow)

### 3.1. Phân tầng ứng dụng
1. **Root Layer (`index.tsx`):**
   - Bọc toàn bộ ứng dụng bằng `HelmetProvider` để hỗ trợ SEO SSR-friendly & dynamic meta headers.
2. **Context Layer (`ContentContext.tsx`):**
   - Cung cấp dữ liệu tĩnh/mẫu (`projects`, `services`, `contactInfo`, `testimonials`) thông qua React Context hook `useContent()`. Giúp dễ dàng chuyển đổi sang API hoặc Headless CMS sau này.
3. **Routing & Code-Splitting Layer (`App.tsx`):**
   - Tất cả 7 trang chính đều được lazy load thông qua `React.lazy()` và bọc trong `<Suspense fallback={<LoadingFallback />}>`.
   - Component `ScrollToTop` tự động cuộn lên đầu trang mỗi khi `pathname` thay đổi.
4. **Layout Layer (`Layout.tsx`):**
   - Chứa background grid công nghệ (`bg-tech-grid`), các ambient light orbs tạo chiều sâu thị giác.
   - Quản lý đồng thời `Header` (Desktop) và `FloatingMenu` (Mobile).

### 3.2. Luồng tối ưu SEO & AIO (`SEO.tsx`)
- Tự động xuất sinh thẻ OpenGraph, Twitter Cards, Canonical URL.
- Tạo cấu trúc Schema Structured Data tiêu chuẩn quốc tế:
  - `Organization` & `LocalBusiness`: định danh doanh nghiệp tại Google Search & Google Maps.
  - `WebSite`: thiết lập tên trang web và sitelink search box.
  - `FAQPage`: định dạng hỏi đáp chuẩn Schema giúp hiển thị rich snippet và hỗ trợ công cụ tìm kiếm AI (ChatGPT Search, Gemini, Perplexity) trích xuất trực tiếp.

---

## 4. Hạ tầng Triển khai & Tối ưu (Deployment & Performance)

- **Hosting Target:** Vercel (Edge Network).
- **SPA Rewrites:** File `vercel.json` định tuyến tất cả request về `/index.html` để React Router xử lý.
- **Cache Strategy:**
  - File tĩnh trong `/assets/` được áp dụng header `Cache-Control: public, max-age=31536000, immutable`.
  - File HTML và sitemap được cấu hình `stale-while-revalidate` để cập nhật tức thì khi có bản release mới.
- **Image Delivery:** Sử dụng cơ chế ảnh tiến trình qua `<ProgressiveImage />` giảm giật khung hình (CLS - Cumulative Layout Shift).
