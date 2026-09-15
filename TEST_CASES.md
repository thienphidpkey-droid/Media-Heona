# Test Cases & QA Checklist - Heona Media

Tài liệu hướng dẫn quy trình kiểm thử thủ công và danh mục kiểm tra chất lượng phần mềm (QA Checklist).

---

## 1. Danh mục Kiểm tra Biên tập Case Study (ProjectEditor Checklist)

| STT | Kịch bản kiểm thử | Thao tác thực hiện | Kết quả kỳ vọng |
|---|---|---|---|
| **TC-01** | Tạo mới Case Study | Truy cập `/admin/projects/new`, nhập tên và chọn ảnh bìa | Tiêu đề hiển thị đồng thời tại header và live preview panel |
| **TC-02** | Ràng buộc tiêu đề bắt buộc | Để trống tiêu đề và nhấn "Xuất bản" | Hệ thống bắn Toast lỗi và tự động cuộn về Section 01 |
| **TC-03** | Chỉnh sửa chỉ số KPI | Nhập số vào ô "Giá trị con số" và "Nhãn chỉ số" | Giá trị cập nhật mượt mà, live preview cập nhật tức thì theo thời gian thực |
| **TC-04** | Quy trình thực hiện 2 cột | Kiểm tra hiển thị Section 04 trên màn hình desktop | Các bước quy trình tự động chia thành lưới 2 cột cân đối |
| **TC-05** | Phản chiếu Live Preview | Thay đổi trạng thái, dịch vụ, lời nhận xét | Cột thứ 3 bên phải cập nhật live chính xác từng trường thông tin |
| **TC-06** | Lưu nháp & Xuất bản | Nhấn "Lưu nháp" hoặc "Xuất bản" | Thông báo Toast thành công, thời gian lưu cập nhật lúc HH:MM |

---

## 2. Danh mục Kiểm tra Danh sách Dự án (ProjectList Checklist)

| STT | Kịch bản kiểm thử | Thao tác thực hiện | Kết quả kỳ vọng |
|---|---|---|---|
| **TC-07** | Bộ lọc Pill Tabs danh mục | Nhấp chọn các tab: Tất cả, Expert Spotlight, School Story, Event to Content | Danh sách bài lọc chính xác, tab active đổi nền tím chữ đen |
| **TC-08** | Tìm kiếm dự án | Gõ tên dự án hoặc tên khách hàng vào ô Search | Kết quả lọc ngay lập tức sau từng ký tự gõ |

---

## 3. Danh mục Kiểm tra Website Công khai (Public QA)

| STT | Kịch bản kiểm thử | Thao tác thực hiện | Kết quả kỳ vọng |
|---|---|---|---|
| **TC-09** | Floating Dock Menu (Mobile) | Thu nhỏ màn hình < 1024px hoặc mở điện thoại | Thanh dock nổi cố định dưới đáy màn hình, chạm chuyển trang trơn tru |
| **TC-10** | Form gửi liên hệ | Điền form tại `/contact` và nhấn Gửi | EmailJS nhận dữ liệu, hiển thị thông báo thành công |
| **TC-11** | Kiểm tra Build & Prerender | Chạy `npm run build` | Lệnh thoát mã `0`, đủ 15 trang tĩnh được prerender thành công |
| **TC-12** | Đăng nhập Ẩn bằng phím tắt | Trên bất kỳ trang công khai nào, bấm `Ctrl + Shift + A` (hoặc `Cmd + Shift + A`) | Xuất hiện Modal Quản trị bí mật, cho phép nhập email/mật khẩu hoặc chọn nhanh vai trò |
| **TC-13** | Chặn URL `/admin` trực tiếp | Mở ẩn danh hoặc xóa local user, gõ trực tiếp `localhost:5173/admin` | Hệ thống tự động redirect về trang chủ (`/`), không để lộ giao diện admin |