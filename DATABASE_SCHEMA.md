# Database Schema & Data Models - Heona Media

Tài liệu mô tả toàn bộ cấu trúc dữ liệu, entities và cơ chế lưu trữ của hệ thống Heona Media CMS.

---

## 1. Kiến trúc lưu trữ (Storage Architecture)

- **Cơ chế lai (Hybrid Cloud & Offline-First):** Kết hợp bộ nhớ đệm tốc độ cao `localStorage` trên trình duyệt và Cơ sở dữ liệu đám mây **Supabase PostgreSQL** thông qua tầng dịch vụ `admin/services/db.ts` và `admin/services/supabase.ts`.
- **Đồng bộ Đám mây (Supabase Cloud Sync):** Toàn bộ dữ liệu dự án, bài viết, khách hàng, leads và media được đồng bộ hai chiều với Supabase.
- **Bảo mật RLS & View Chiếu (Zero-Trust):** Toàn bộ các bảng trên Supabase đều được kích hoạt `FORCE ROW LEVEL SECURITY`. Bảng `clients` được bảo vệ phía sau View chiếu công khai `public_clients` (`security_invoker = false`), chỉ cho phép Quản trị viên trong Whitelist (`public.is_admin()`) thực hiện các thao tác ghi.
- **Tầng trừu tượng hóa (Service Layer):** Tất cả thao tác đọc/ghi đều đi qua các Service (`ProjectsService`, `ArticlesService`, `ClientsService`, `LeadsService`, `MediaService`, `AuthService`).

---

## 2. Danh sách Storage Keys

| Key | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `heona_articles` | `Article[]` | Danh sách bài viết tin tức & kiến thức |
| `heona_projects` | `Project[]` | Danh sách hồ sơ dự án / Case Study |
| `heona_clients` | `Client[]` | Danh mục khách hàng & đối tác |
| `heona_leads` | `Lead[]` | Dữ liệu khách hàng liên hệ gửi về từ form website |
| `heona_media` | `MediaItem[]` | Danh mục hình ảnh/tài nguyên thư viện media |
| `heona_users` | `CMSUser[]` | Danh sách tài khoản quản trị nội bộ |
| `heona_auth_user` | `CMSUser` | Phiên đăng nhập người dùng hiện tại |

---

## 3. Chi tiết cấu trúc các thực thể (Entity Definitions)

### 3.1. Project (Case Study)
```typescript
interface Project {
  id: string | number;
  title: string;
  slug: string;
  category: 'Expert Spotlight' | 'School Story' | 'Event to Content' | string;
  clientId?: string;
  clientName: string;
  industry?: string;
  services: string[];
  location?: string;
  startDate?: string;
  endDate?: string;
  image: string;               // Legacy field alias cho coverImage
  coverImage: string;
  featuredVideo?: string;      // YouTube/Vimeo embed URL
  status: ContentStatus;       // 'published' | 'draft' | 'review' | 'archived'
  description?: string;
  projectIntro?: string;       // Bối cảnh mở đầu
  clientBackground?: string;   // Vị thế khách hàng
  challenge?: string;          // Khó khăn nút thắt
  projectGoals?: string;       // Mục tiêu dự án
  solutionSummary?: string;    // Tóm tắt giải pháp Heona
  processSteps?: ProjectProcessStep[];
  results?: ProjectResult[];
  qualitativeResults?: string[];
  gallery?: string[];
  testimonial?: ProjectTestimonial;
  seo?: ProjectSEO;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectProcessStep {
  id: string;
  stepNumber: string; // '01', '02', ...
  title: string;
  description: string;
}

interface ProjectResult {
  id: string;
  number: string;     // '2M+', '100+'
  label: string;      // 'Lượt tiếp cận'
}

interface ProjectTestimonial {
  name: string;
  position?: string;
  company?: string;
  content: string;
  avatar?: string;
  videoUrl?: string;
}

interface ProjectSEO {
  title: string;
  metaDescription: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
}
```

### 3.2. Article (Bài viết)
```typescript
interface Article {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  thumbnail: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
```

### 3.3. ContentStatus Enum
```typescript
type ContentStatus = 'published' | 'draft' | 'review' | 'scheduled' | 'archived';
```

### 3.4. Lead (Hộp thư / Liên hệ)
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  createdAt: string;
}
```

### 3.5. Client (Đối tác / Khách hàng)
```typescript
interface Client {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  description?: string;
}
```

### 3.6. MediaItem (Thư viện media)
```typescript
interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size?: number;
  uploadedAt: string;
}
```

### 3.7. CMSUser (Người dùng & Quyền)
```typescript
interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastLogin?: string;
}
```