# Search Engine & AI Optimization (SEO / AIO / GEO) - Heona Media

Tài liệu chiến lược và kỹ thuật tối ưu hóa công cụ tìm kiếm truyền thống và công cụ tìm kiếm thế hệ mới (AI Engines).

---

## 1. Kiến trúc Triển khai Kỹ thuật

- **Quản lý Thẻ Đầu trang (Head Management):** Triển khai tập trung qua component `<SEO />` (`components/SEO.tsx`) kết hợp thư viện `react-helmet-async`.
- **Cơ chế Prerendering:** 15 routes chính được xuất sẵn mã HTML tĩnh khi build, đảm bảo bot tìm kiếm (Googlebot, Bingbot) đọc được 100% nội dung mà không phụ thuộc vào việc thực thi JavaScript.

---

## 2. Hệ thống Dữ liệu Cấu trúc (JSON-LD Structured Data)

Website tích hợp các lược đồ Schema chuẩn quốc tế:
1. **Schema Organization & LocalBusiness:** Định danh pháp nhân Heona Media, địa chỉ trụ sở tại Gò Vấp, hotline, logo và các mạng xã hội liên kết.
2. **Schema WebSite:** Cung cấp thông tin tên thương hiệu và hộp tìm kiếm sitelinks.
3. **Schema FAQPage:** Chuẩn hóa các câu hỏi thường gặp về dịch vụ truyền thông, bảng giá, giúp xuất hiện rich snippet dạng câu hỏi thả xuống trên Google Search và hỗ trợ các AI bot (ChatGPT Search, Gemini, Perplexity) trích xuất câu trả lời chính xác.
4. **Schema BreadcrumbList:** Hỗ trợ cấu trúc phân cấp đường dẫn trên kết quả tìm kiếm.

---

## 3. Tối ưu hóa Case Study theo Chuẩn SEO

Mỗi Case Study trong hệ thống quản trị cung cấp tab Section 08 chuyên biệt:
- **Tiêu đề SEO:** Giới hạn chuẩn 60 ký tự, có bộ đếm tự động.
- **Mô tả Meta:** Tối ưu hóa độ dài 120-160 ký tự.
- **Mô phỏng Kết quả Tìm kiếm Google (SERP Preview):** Hiển thị trực quan cách bài viết xuất hiện trên màn hình máy tính và điện thoại.
- **Kiểm soát Lập chỉ mục (Index Toggle):** Cho phép bật/tắt thẻ `noindex` khi đang chạy thử nghiệm nội dung.