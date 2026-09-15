# Business Rules - Heona Media

Tập hợp các quy tắc nghiệp vụ, ràng buộc logic và quy trình vận hành nội dung trên hệ thống Heona Media.

---

## 1. Quy trình phê duyệt & Trạng thái nội dung (Content Workflow)

Mỗi bài viết hoặc Case Study tuân thủ vòng đời trạng thái sau:
1. **Bản nháp (Draft):** Đang soạn thảo, chỉ nhìn thấy trong giao diện Quản trị nội bộ.
2. **Chờ duyệt (Review):** Tác giả hoàn thành, gửi cho Quản trị viên/Biên tập viên trưởng thẩm định. Xuất hiện trong danh sách "Việc cần xử lý" tại Dashboard.
3. **Đã xuất bản (Published):** Công khai trên website cho toàn bộ khách ghé thăm đọc.
4. **Lên lịch (Scheduled):** Nội dung đã sẵn sàng và được hẹn giờ tự động xuất bản theo ngày định trước.
5. **Lưu trữ (Archived):** Ẩn khỏi website nhưng không bị xóa vĩnh viễn khỏi hệ thống.

---

## 2. Quy tắc xuất bản Case Study (Project Validation Rules)

Để một Case Study được coi là hợp lệ và xuất bản thành công:
- **Tên dự án (Title):** Bắt buộc, không được để trống.
- **Ảnh bìa đại diện (Cover Image):** Bắt buộc, dùng làm thumbnail tại danh sách dự án và ảnh OpenGraph.
- **Đường dẫn tĩnh (Slug):** Tự động tạo từ tiêu đề tiếng Việt không dấu (NFD normalization + lowercase + hyphens). Cho phép chỉnh sửa thủ công nhưng phải duy nhất.
- **Dịch vụ triển khai (Services):** Cho phép chọn nhiều từ danh mục chuẩn gồm: `Brand Strategy`, `Personal Branding`, `Content Strategy`, `Photography`, `Video Production`, `TikTok`, `Facebook`, `YouTube`, `Event Production`, `Event Content`, `Social Media Management`, `Design`, `Livestream`.
- **Nhóm dịch vụ mũi nhọn (Category):** Bắt buộc thuộc một trong 3 nhóm chính:
  - `Expert Spotlight`: Định vị hình ảnh chuyên gia, bác sĩ, giảng viên, KOLs/KOCs.
  - `School Story`: Truyền thông thương hiệu trường học, đại học, tuyển sinh.
  - `Event to Content`: Khai thác tư liệu sự kiện thành tài sản truyền thông đa kênh.
- **Đánh giá khách hàng (Section 06):** Lời nhận xét và thông tin đối tác nhập tại đây có cờ `★ Xuất hiện ở Trang chủ`, được đồng bộ lên mục Testimonials tại trang chủ.

---

## 3. Quy tắc SEO (Search Engine Optimization Rules)

- **Tiêu đề SEO (Title Tag):** Khuyến nghị tối đa 60 ký tự (cảnh báo amber nếu > 50, cảnh báo rose nếu > 60).
- **Mô tả SEO (Meta Description):** Khuyến nghị từ 120 đến 160 ký tự.
- **Từ khóa trọng tâm (Focus Keyword):** Tối ưu cụm từ tìm kiếm chính của Case Study.
- **Index Control:** Toggle cho phép Google bot thu thập dữ liệu (mặc định BẬT cho bài xuất bản, TẮT cho bài nháp/test).

---

## 4. Phân quyền & Quản lý vai trò (Role Permissions)

| Hành động | Admin | Editor | Viewer |
|---|---|---|---|
| Xem Dashboard & Thống kê | Có | Có | Có |
| Tạo / Chỉnh sửa nội dung | Có | Có | Không |
| Xóa Dự án / Bài viết | **Chỉ Admin** | Không | Không |
| Quản lý Hộp thư Leads | Có | Có | Chỉ xem |
| Quản lý Thư viện Media | Có | Có | Chỉ xem |
| Phân quyền & Quản lý User | **Chỉ Admin** | Không | Không |

---

## 5. Quy trình xử lý Hộp thư (Leads CRM)

- Khách hàng điền form tại trang Liên hệ (`/contact`) → Dữ liệu lưu vào `heona_leads` với trạng thái `New`, đồng thời gửi thông báo qua EmailJS.
- Dashboard hiển thị badge cảnh báo số lượng leads `New` chưa được xử lý.
- Luồng trạng thái lead: `New` → `Contacted` (Đã liên hệ) → `Qualified` (Tiềm năng cao) → `Closed` (Đã ký hợp đồng hoặc Đóng hồ sơ).