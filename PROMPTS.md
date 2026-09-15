# AI & Agent Prompting Guidelines - Heona Media

Tài liệu cung cấp các chỉ dẫn quan trọng dành riêng cho các AI Coding Assistants khi làm việc với codebase này.

---

## 1. Giới hạn Phạm vi Tuyệt đối (Absolute Guardrails)

- **KHÔNG THAY ĐỔI DỮ LIỆU / BUSINESS LOGIC:** Không tự ý thay đổi schema, Supabase, CRUD, route hoặc dữ liệu mẫu trừ khi có yêu cầu bằng văn bản rõ ràng từ người dùng.
- **KHÔNG DÙNG FONT FUTURISTIC / MONO:** Font chữ duy nhất được chấp nhận là **Inter**. Nghiêm cấm dùng Montserrat hoặc font-mono trên giao diện người dùng.
- **KHÔNG TỰ Ý CÀI THÊM THƯ VIỆN:** Giữ bundle nhẹ; chỉ sử dụng Tailwind CSS và Lucide React.
- **BẢO TỒN DOCSTRINGS:** Giữ nguyên các chú thích có sẵn trong mã nguồn.

---

## 2. Chỉ dẫn Kỹ thuật Đặc thù (Technical Guardrails)

- **Tránh ghi đè file khi Dev Server đang chạy:** Vite giữ lock file khi đang watch HMR. Dùng công cụ replace an toàn hoặc tắt dev server trước khi chạy script ghi file lớn bằng PowerShell để tránh file bị ghi rỗng 0 bytes.
- **Immutable State Updates:** Luôn dùng cú pháp `setState(prev => prev.map(...))` đối với mảng object (như kết quả KPI hoặc các bước quy trình).
- **Layout Case Study Editor:** Luôn duy trì layout 2 Cột cân đối: Sidebar mục lục (299px) - Editor trung tâm (minmax(0,1fr)) - Modal Preview toàn màn hình trong container `max-w-[1440px]`.
- **Thanh điều hướng Sidebar Admin:** Duy trì cấu trúc phẳng (Flat Navigation), không phân nhóm theo các tiêu đề nhóm (NỘI DUNG, DỰ ÁN, HỆ THỐNG).