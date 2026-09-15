# Routing Architecture - Heona Media

Tài liệu bản đồ định tuyến URL của toàn bộ hệ thống Heona Media (Public + Admin).

---

## 1. Bản đồ Tuyến đường Công khai (Public Routes)

Tất cả các trang public đều được lazy load và bọc trong `<Suspense>` với fallback skeleton loading.

| Đường dẫn (URL) | Component | Mô tả | Trạng thái Prerender SSR |
|---|---|---|---|
| `/` | `pages/Home.tsx` | Trang chủ: Hero, số liệu, 3 nhóm dịch vụ, case study tiêu biểu, testimonial | Đã prerender |
| `/about` | `pages/About.tsx` | Giới thiệu doanh nghiệp, tầm nhìn, đội ngũ sáng lập | Đã prerender |
| `/services` | `pages/Services.tsx` | Chi tiết các gói giải pháp truyền thông & bảng giá minh bạch | Đã prerender |
| `/projects` | `pages/Projects.tsx` | Thư viện hồ sơ dự án thực chiến (lọc theo danh mục) | Đã prerender |
| `/projects/:slug` | `pages/ProjectDetail.tsx` | Trang chi tiết Case Study chuẩn SEO & đa phương tiện | Đã prerender |
| `/blog` | `pages/Blog.tsx` | Trang danh sách bài viết kiến thức & tin tức chuyên ngành | Đã prerender |
| `/blog/:slug` | `pages/BlogDetail.tsx` | Chi tiết bài viết với mục lục, CTA block và bài liên quan | Đã prerender |
| `/contact` | `pages/Contact.tsx` | Form liên hệ báo giá, hotline, bản đồ văn phòng | Đã prerender |
| `/pricing` | `pages/Pricing.tsx` | Bảng giá chi tiết dịch vụ | Đã prerender |
| `/privacy` | `pages/Privacy.tsx` | Chính sách bảo mật thông tin | Đã prerender |
| `*` | `pages/NotFound.tsx` | Trang 404 không tìm thấy nội dung | Fallback |

---

## 2. Bản đồ Tuyến đường Quản trị (Admin Routes)

Tất cả các route admin nằm dưới prefix `/admin/*` và được bảo vệ bởi phiên làm việc nội bộ (`<ProtectedRoute>`).

| Đường dẫn (URL) | Component | Chức năng |
|---|---|---|
| `/admin/login` | `admin/pages/Login.tsx` | Màn hình đăng nhập quản trị viên |
| `/admin` | `admin/pages/Dashboard.tsx` | Bảng điều khiển trung tâm & việc cần xử lý |
| `/admin/articles` | `admin/pages/articles/ArticleList.tsx` | Quản lý danh sách bài viết |
| `/admin/articles/new` | `admin/pages/articles/ArticleEditor.tsx` | Soạn thảo bài viết mới |
| `/admin/articles/:id` | `admin/pages/articles/ArticleEditor.tsx` | Chỉnh sửa bài viết đã có |
| `/admin/projects` | `admin/pages/projects/ProjectList.tsx` | Quản lý Case Study (Pill tabs filter) |
| `/admin/projects/new` | `admin/pages/projects/ProjectEditor.tsx` | Khởi tạo Case Study (2 Cột, 8 sections) |
| `/admin/projects/:id` | `admin/pages/projects/ProjectEditor.tsx` | Biên tập Case Study với Modal Preview |
| `/admin/services` | `admin/pages/services/ServiceList.tsx` | Quản lý danh mục gói dịch vụ |
| `/admin/services/new` | `admin/pages/services/ServiceEditor.tsx` | Tạo gói dịch vụ mới |
| `/admin/services/:id` | `admin/pages/services/ServiceEditor.tsx` | Chỉnh sửa gói dịch vụ |
| `/admin/media` | `admin/pages/media/MediaLibrary.tsx` | Thư viện hình ảnh & tài nguyên truyền thông |
| `/admin/clients` | `admin/pages/clients/ClientList.tsx` | Quản lý danh mục đối tác & khách hàng |
| `/admin/leads` | `admin/pages/leads/LeadList.tsx` | Hộp thư tiếp nhận khách hàng tiềm năng |
| `/admin/calendar` | `admin/pages/calendar/ContentCalendar.tsx` | Lịch nội dung và kế hoạch xuất bản |
| `/admin/users` | `admin/pages/users/UserList.tsx` | Quản trị tài khoản (Admin Roles) & phân quyền |

---

## 3. Cấu hình Single Page Application (SPA Rewrites)

Để React Router hoạt động mượt mà trên môi trường hosting tĩnh Vercel mà không bị lỗi 404 khi người dùng tải lại trang:
- File `vercel.json` chứa cấu hình rewrite:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```