# Deployment Guide - Heona Media

Tài liệu hướng dẫn quy trình đóng gói, biên dịch và triển khai website Heona Media lên hạ tầng đám mây.

---

## 1. Nền tảng Triển khai (Target Platform)

- **Hosting:** Vercel (Edge Network Global CDN).
- **Cơ chế Triển khai:** Tự động build và deploy khi có commit mới đẩy lên nhánh `main` trên GitHub repository.

---

## 2. Quy trình Biên dịch (Build Pipeline)

Lệnh build sản phẩm:
```bash
npm run build
```

Chuỗi lệnh thực thi bao gồm 4 bước nối tiếp:
1. `tsc`: Kiểm tra tính toàn vẹn kiểu dữ liệu toàn bộ codebase (Strict TypeScript Check).
2. `vite build`: Đóng gói ứng dụng Client SPA vào thư mục `dist/` (tối ưu hóa chunks, css, minification).
3. `vite build --ssr entry-server.tsx --outDir dist-ssr`: Đóng gói bundle SSR phục vụ prerender.
4. `node scripts/prerender.mjs`: Chạy script trích xuất 15 routes tĩnh chính thành các file HTML hoàn chỉnh, tối ưu chỉ mục SEO và tốc độ mở trang lần đầu.

---

## 3. Cấu hình Vercel (`vercel.json`)

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 4. Quy chuẩn Lưu trữ Backup Cục bộ

Mỗi phiên bản cập nhật tính năng lớn đều được đóng gói zip theo quy tắc:
- Cú pháp: `yymmdd-hhmm-version-feature.zip` (Ví dụ: `260915-1230-v1.4-admin-ui-refine.zip`).
- Loại trừ: `node_modules`, `dist`, `dist-ssr`, `.git` và các file `.zip` cũ để đảm bảo dung lượng siêu nhẹ (~1.5MB - 2MB).