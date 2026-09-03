# HEONA MEDIA - AI CONTEXT

Tài liệu này cung cấp toàn bộ ngữ cảnh (Context), kiến trúc kỹ thuật và bộ quy tắc thiết kế của dự án HEONA MEDIA. Bất kỳ AI Assistant nào khi làm việc với repository này đều phải đọc và tuân thủ các nguyên tắc dưới đây.

## 1. Công nghệ & Kiến trúc (Tech Stack)
- **Core:** React 18 + Vite + TypeScript.
- **Styling:** Tailwind CSS (Vanilla Tailwind, không dùng thư viện component bên thứ 3).
- **Routing:** React Router DOM (v6).
- **Icons:** Lucide React.
- **SEO/AIO (Generative Engine Optimization):** Sử dụng `react-helmet-async` (bọc toàn app bằng HelmetProvider) để quản lý thẻ Meta và cấu trúc JSON-LD Schema.

## 2. Ngôn ngữ thiết kế (Design System & Aesthetics)
- **Deep Dark Mode:** Sử dụng các tone màu tối sâu để làm nổi bật nội dung.
  - `bgMain`: `#050507` (Đen tuyền nền chính).
  - `bgCard`: `#111115` (Đen xám cho các thẻ).
- **Brand Colors:**
  - `primary`: `#6f3aff` (Tím đậm - công nghệ/sáng tạo).
  - `secondary`: `#ff3a8b` (Hồng rực - năng động/nhiệt huyết).
  - Accent: `#cfc0ff` (Tím nhạt).
- **Phong cách thị giác (Visual Style):** 
  - **Glassmorphism:** Sử dụng `backdrop-blur-md` kết hợp màu nền bán trong suốt (`bg-white/5` hoặc `bg-black/40`) và viền mỏng (`border border-white/10`).
  - **WOW Effects:** Luôn tích hợp micro-interactions. Khi hover vào thẻ/nút phải có hiệu ứng `scale-105`, chuyển màu viền (vd: `hover:border-primary/50`), và đổ bóng phát sáng (Glow: `hover:shadow-[0_0_20px_rgba(111,58,255,0.15)]`).
- **Hình ảnh:** Tối ưu tải ảnh thông qua component `<ProgressiveImage />` (có cơ chế skeleton và hiệu ứng fade-in mượt mà).

## 3. Tối ưu hóa trên thiết bị di động (Mobile Optimization)
Đã được tinh chỉnh thủ công để tối ưu UX cho màn hình nhỏ:
- **Floating Dock Menu:** Trên Mobile & Tablet (< 1024px, `lg:hidden`) sử dụng thanh menu nổi (Fixed Bottom) dạng Glassmorphism thay cho Header truyền thống, luôn hiển thị `z-[9999]` (trên Tablet tự động hiển thị kèm icon + nhãn chữ).
- **Dự án (Projects):** Hiển thị 1 thẻ/dòng (`grid-cols-1`). Để tránh ảnh bị quá to, chiều cao ảnh được ép cố định (`h-32`) tạo hiệu ứng ảnh ngang Panorama.
- **Đánh giá khách hàng (Testimonials):** Hiển thị 1 thẻ/dòng, font chữ được tăng lên 30% để dễ đọc.
- **Trang Blog:** Hiển thị 2 thẻ/dòng (`grid-cols-2`), thumbnail được thu gọn 1/2 chiều cao (`h-24`) giúp tăng mật độ bài viết trên màn hình.
- **Trang About:** Toàn bộ font chữ (Heading, Paragraph) được thu nhỏ 30% trên bản Mobile (`md:` breakpoint dùng cho kích thước lớn hơn).

## 4. Quy tắc Code (Coding Rules)
- KHÔNG sử dụng `any` trong TypeScript. Luôn định nghĩa `interface` hoặc `type`.
- Luôn giữ nguyên các nội dung text/mô tả gốc của doanh nghiệp, không tự ý rút ngắn hoặc tóm tắt nội dung trừ khi có yêu cầu.
- Các thay đổi liên quan đến CSS layout luôn phải kiểm tra kỹ các breakpoint (`md:`, `lg:`) để không phá vỡ giao diện Desktop khi tinh chỉnh Mobile.
