# AI Context - HEONA MEDIA Project

## Overview
Dự án HEONA MEDIA là một website cho Event Agency & Media Production tại TP.HCM. 
Website tập trung vào hiệu năng cao, tối ưu hóa AIO (AI Search Optimization) / SEO và mang lại trải nghiệm thị giác ấn tượng (WOW effect).

## Technology Stack
- **Core:** React 18 (CSR), TypeScript, Vite 5.
- **Styling:** Tailwind CSS, Vanilla CSS (`index.css`), CSS Animations.
- **Routing:** React Router v6.
- **SEO/AIO:** `react-helmet-async` (quản lý metadata động).
- **Form:** EmailJS.

## Project Structure
- `/components`: Các UI component có thể tái sử dụng (`Header`, `Footer`, `Card`, `ProgressiveImage`, `SEO`...).
- `/pages`: Các trang chính (`Home`, `About`, `Services`, `Projects`, `Pricing`, `Blog`, `Contact`).
- `/context`: Quản lý state chung (VD: `ContentContext`).

## Core Principles & Guidelines for AI
1. **AIO & SEO First (Tối ưu cho AI):**
   - Không được phá vỡ cấu trúc `<HelmetProvider>` và component `<SEO>`.
   - Giữ nguyên cấu trúc dữ liệu JSON-LD (Schema Markup cho `ProfessionalService`) trong `SEO.tsx` để tối ưu hóa cho ChatGPT Search, Perplexity và Google AI Overviews.
   - Thẻ Heading (H1-H6) phải chuẩn semantic.

2. **Design & UI/UX (Event Agency Style):**
   - **Màu sắc/Theme:** Sử dụng nền Dark Mode (`bg-[#050507]`, `#111115`) làm chủ đạo.
   - **Phong cách:** Hướng đến Glassmorphism (`backdrop-blur-md`, `bg-white/5`), Tech/Cyber accents, và Neo-Brutalism tinh tế.
   - **Hiệu ứng (Animations):** Ưu tiên CSS tĩnh và Tailwind. Sử dụng Hover effects (quét sáng, phóng to nhẹ, border glow) để tạo tương tác sống động (Micro-interactions).
   - **Bố cục (Layout):** Khuyến khích sử dụng Bento Grid (các khối linh hoạt đan xen) thay vì grid đều đặn truyền thống, đặc biệt cho trang Home và Projects.

3. **Performance (Hiệu năng):**
   - Sử dụng `<ProgressiveImage />` cho hình ảnh nặng.
   - Không import thư viện bên ngoài bừa bãi (như Framer Motion) nếu hiệu ứng đó có thể làm được bằng TailwindCSS tĩnh.

4. **Bảo mật:**
   - Khi chỉnh sửa form `Contact.tsx` sử dụng EmailJS, hãy cẩn thận không để lộ các key nhạy cảm hoặc nhắc User cấu hình domain whitelist trên EmailJS Dashboard.
   - Duy trì các CSP Headers trong `index.html`.

*Ghi chú: File này được tạo và cập nhật để giúp các session AI tiếp theo hiểu rõ ngữ cảnh, định hướng SEO và thiết kế của dự án trước khi đưa ra đề xuất.*
