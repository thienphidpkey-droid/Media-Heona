# Dependencies Catalog - Heona Media

Tài liệu kiểm kê toàn bộ các gói phụ thuộc (packages) được cài đặt trong dự án.

---

## 1. Production Dependencies

| Tên gói | Phiên bản | Mục đích sử dụng |
|---|---|---|
| `react` | `^18.2.0` | Thư viện cốt lõi dựng giao diện người dùng |
| `react-dom` | `^18.2.0` | Cung cấp DOM renderer cho React và createPortal |
| `react-router-dom` | `^6.22.3` | Quản lý định tuyến trang phía client (SPA Routing) |
| `react-helmet-async` | `^2.0.4` | Quản lý thẻ Head, OpenGraph và Schema JSON-LD động |
| `lucide-react` | `^0.344.0` | Bộ icon vector hiện đại, tối ưu tree-shaking |
| `@emailjs/browser` | `^4.3.3` | SDK gửi email trực tiếp từ client không cần backend |

---

## 2. Development Dependencies

| Tên gói | Phiên bản | Mục đích sử dụng |
|---|---|---|
| `typescript` | `^5.2.2` | Bộ biên dịch kiểm tra kiểu tĩnh (Strict Type Checking) |
| `vite` | `^5.2.0` (v8.2.2 runtime) | Bundler siêu tốc, cung cấp HMR và SSR bundling |
| `@vitejs/plugin-react` | `^4.2.1` | Plugin hỗ trợ Fast Refresh và JSX runtime cho Vite |
| `tailwindcss` | `^3.4.1` | Framework CSS tiện ích (Utility-first CSS) |
| `postcss` | `^8.4.35` | Công cụ xử lý CSS AST |
| `autoprefixer` | `^10.4.18` | Tự động thêm vendor prefix cho CSS đa trình duyệt |
| `@types/react` | `^18.2.66` | Định nghĩa kiểu TypeScript cho React |
| `@types/react-dom` | `^18.2.22` | Định nghĩa kiểu TypeScript cho React DOM |

---

## 3. Quy định về Thư viện Phụ thuộc (Dependency Policy)

1. **Không sử dụng component library nặng:** Tránh cài đặt MUI, Ant Design, Bootstrap hay thư viện CSS-in-JS gây phình to bundle.
2. **Font chữ độc quyền:** Chỉ nhúng font **Inter** qua Google Fonts. Không cài thêm font futuristic hay package font cục bộ không cần thiết.