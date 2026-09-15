# CONTEXT - HEONA MEDIA

Tài liệu ngữ cảnh tổng quan, nghiệp vụ cốt lõi và định hướng công nghệ của dự án HEONA MEDIA.

---

## 1. Giới thiệu Doanh nghiệp
**HEONA MEDIA** là đơn vị sản xuất và tư vấn truyền thông sáng tạo hàng đầu, chuyên định vị hình ảnh và tạo ra các tài sản truyền thông đột phá với 3 nhóm dịch vụ mũi nhọn:
1. **Expert Spotlight:** Định vị và xây dựng thương hiệu cá nhân toàn diện cho chuyên gia, bác sĩ, giảng viên, KOLs/KOCs trên các nền tảng video ngắn (TikTok, Reels, YouTube Shorts).
2. **School Story:** Sản xuất nội dung truyền thông thương hiệu trường học, chuỗi phóng sự tuyển sinh và câu chuyện giáo dục chạm tới cảm xúc phụ huynh/học sinh.
3. **Event to Content:** Biến các hội thảo, hội nghị, sự kiện thương mại thành kho tài sản truyền thông số dài hạn, tối ưu hóa ngân sách tổ chức sự kiện.

---

## 2. Thông tin Pháp lý & Liên hệ
- **Trụ sở chính:** 45/30 Đường số 1, Phường Thông Tây Hội (Phường 11 cũ), Quận Gò Vấp, TP. Hồ Chí Minh.
- **Hotline / Zalo:** 0931 899 427
- **Email:** heonamedia@gmail.com
- **Website chính thức:** [https://heonamedia.com](https://heonamedia.com)

---

## 3. Mục tiêu của Repository
Repository này chứa mã nguồn toàn bộ hệ sinh thái kỹ thuật số của HEONA MEDIA:
- **Website Công khai (Public Portal):** Giới thiệu dịch vụ, hồ sơ năng lực (portfolio case study), kiến thức chuyên ngành, thu hút khách hàng tiềm năng (Leads) và tối ưu hóa cho công cụ tìm kiếm truyền thống (SEO) lẫn công cụ tìm kiếm AI (AIO / GEO).
- **Hệ thống Quản trị Nội dung (Admin Content OS v1.4):** CMS nội bộ vận hành tại `/admin/*`, phục vụ biên tập Case Study chuẩn mực với bố cục 2 Cột trực quan (Mục lục, Form nhập liệu, Live Preview thời gian thực).

---

## 4. Quy tắc Vận hành Cốt lõi
1. **Bảo toàn dữ liệu thực tế:** Không tự ý rút gọn, bịa đặt hoặc thay đổi các thông tin doanh nghiệp, dịch vụ, số liệu hay nội dung bài viết nếu không có yêu cầu cụ thể.
2. **TypeScript Strictly Typed:** Tuyệt đối không dùng kiểu `any`. Luôn khai báo `interface` hoặc `type` trong file `types.ts` hoặc trực tiếp tại component khi cần.
3. **Typography Đồng nhất:** Chỉ sử dụng font **Inter**. Nghiêm cấm font Montserrat hoặc các font chữ futuristic trong giao diện.
4. **Không tùy tiện thêm thư viện UI:** Ưu tiên thuần Tailwind CSS và Lucide Icons để giữ cho bundle size siêu nhỏ và tốc độ tải trang cao nhất.