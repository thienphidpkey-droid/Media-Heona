# ARCHITECTURE - HEONA MEDIA

Tài liệu mô tả kiến trúc kỹ thuật, cấu trúc thư mục, luồng dữ liệu và hạ tầng triển khai của website HEONA MEDIA (Cập nhật phiên bản v1.4).

---

## 1. Công nghệ Nền tảng (Tech Stack)

| Hạng mục | Công nghệ | Phiên bản | Vai trò |
|---|---|---|---|
| **Core Framework** | React | ^18.2.0 | UI rendering & component model |
| **Language** | TypeScript | ^5.2.2 | Type safety & developer experience |
| **Bundler & Dev Server** | Vite | v8.2.2 | Fast HMR, optimized ESM & SSR builds |
| **Styling** | Tailwind CSS | ^3.4.1 | Utility-first CSS & dark theme tokens |
| **Routing** | React Router DOM | ^6.22.3 | Client-side routing với code splitting |
| **Icons** | Lucide React | ^0.344.0 | Bộ icon hiện đại, tối ưu tree-shaking |
| **SEO & Head Management** | React Helmet Async | ^2.0.4 | Thẻ meta động, Open Graph, JSON-LD Schema |
| **Email Service** | @emailjs/browser | ^4.3.3 | Gửi form liên hệ từ client không cần backend |
| **Storage Architecture** | LocalStorage DB | Service Layer | Quản trị dữ liệu CMS nội bộ với zero-infrastructure |

---

## 2. Cấu trúc Thư mục Dự án

```text
Media-Heona/
├── admin/                     # Hệ thống Quản trị Nội dung (Admin Content OS)
│   ├── components/            # Reusable admin components (Layout, Toast, MediaPicker, Calendar)
│   ├── pages/                 # Các trang CMS (Dashboard, ProjectEditor, ProjectList, ArticleEditor,...)
│   └── services/              # Tầng lưu trữ dữ liệu (db.ts, auth.ts)
├── components/                # Reusable UI components cho website công khai
│   ├── FloatingMenu.tsx       # Menu nổi ngón tay cái cố định đáy màn hình mobile
│   ├── Header.tsx / Footer.tsx# Thanh điều hướng và chân trang
│   ├── Layout.tsx             # Khung bao ngoài (tech-grid canvas, ambient light orbs)
│   ├── ProgressiveImage.tsx   # Loader ảnh mượt mà chống nhảy khung hình (CLS)
│   └── SEO.tsx                # Inject thẻ meta & JSON-LD schema
├── pages/                     # Các trang công khai (Home, About, Services, Projects, Blog, Contact,...)
├── scripts/                   # Script prerender tĩnh SSR (prerender.mjs)
├── public/                    # Static assets, robots.txt, sitemap.xml
├── App.tsx                    # Định tuyến chính (React Router + Suspense)
├── index.html                 # Entry point HTML (Inter font duy nhất)
├── tailwind.config.js         # Theme tokens: colors (#6f3aff), Inter typography stack
└── vercel.json                # Cấu hình Edge CDN, caching và SPA rewrites
```

---

## 3. Kiến trúc Luồng Dữ liệu (Data Flow)

1. **Website Công khai:** Dữ liệu mẫu và dữ liệu nội dung phục vụ khách đọc được cấp thông qua `ContentContext.tsx` và được prerender thành 15 file HTML tĩnh lúc build.
2. **Hệ thống Quản trị (Admin CMS):** Tương tác đồng bộ qua tầng Service trong `admin/services/db.ts`, tự động phát tín hiệu cập nhật qua pattern `subscribe()`.
3. **Biên tập Case Study 2 Cột:** Trạng thái form trong `ProjectEditor.tsx` phản chiếu theo thời gian thực sang cột xem trước trực tiếp (Live Preview Panel) mà không gây giật lag.