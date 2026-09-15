# Environment Configuration - Heona Media

Tài liệu hướng dẫn thiết lập môi trường phát triển và cấu hình biến môi trường.

---

## 1. Yêu cầu Hệ thống

- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị Node 20 LTS).
- **Trình quản lý gói:** `npm` (đi kèm Node.js).
- **Hệ điều hành:** Windows / macOS / Linux.

---

## 2. Các lệnh Thao tác Chính (Scripts)

| Lệnh | Chức năng |
|---|---|
| `npm run dev` | Khởi chạy máy chủ phát triển cục bộ tại `http://localhost:5173/` |
| `npm run build` | Biên dịch toàn diện: TypeScript check + Vite Client build + Vite SSR build + Prerender tĩnh 15 routes |
| `npm run preview` | Chạy thử nghiệm bản build production cục bộ |

---

## 3. Biến Môi trường (Environment Variables)

Hệ thống sử dụng các biến môi trường để kết nối với dịch vụ EmailJS (tạo file `.env.local` tại thư mục gốc):

```ini
# Cấu hình EmailJS phục vụ Form Liên hệ
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

---

## 4. Cảnh báo Kỹ thuật Quan trọng trên Windows

> [!CAUTION]
> Khi máy chủ phát triển (`npm run dev`) đang hoạt động, Vite duy trì tiến trình khóa file (file lock) đối với các file mã nguồn.
> **Tuyệt đối không dùng lệnh PowerShell `Set-Content` hoặc script ghi file đè trực tiếp khi dev server đang chạy**, vì thao tác này có thể khiến file bị ghi rỗng (0 bytes). Hãy dừng dev server hoặc sử dụng công cụ thay thế nội dung an toàn.