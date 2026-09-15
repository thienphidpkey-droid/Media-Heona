# Error Handling & Edge Cases - Heona Media

Tài liệu quy định cách thức xử lý ngoại lệ, mã lỗi và các tình huống biên trong ứng dụng.

---

## 1. Cơ chế Phản hồi Lỗi Giao diện (UI Error Patterns)

Hệ thống sử dụng cơ chế phản hồi lỗi tại chỗ (Inline Validation) kết hợp Toast Notification:

| Tình huống | Hành vi hệ thống | Thông điệp hiển thị |
|---|---|---|
| **Lưu Case Study thiếu tên dự án** | Cuộn mượt về Section 01, hiển thị Toast cảnh báo | `"Vui lòng nhập tên dự án tại Mục 01"` (Toast Error) |
| **Lưu Case Study thiếu ảnh bìa** | Hiển thị cờ cảnh báo màu vàng tại header Section 01 | `"Bắt buộc tên & ảnh bìa"` |
| **Xóa nội dung không có quyền Admin** | Chặn thao tác, bắn Toast Warning | `"Chỉ Quản trị viên (Admin) mới có quyền xóa dự án"` |
| **Gửi form liên hệ thất bại** | Bắt lỗi khối catch trong promise EmailJS | `"Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại hoặc gọi Hotline!"` |
| **Thư viện ảnh trống** | Hiển thị Empty State với icon minh họa và hướng dẫn | `"Chưa có hình ảnh nào trong thư viện dự án"` |
| **Đường dẫn không tồn tại (404)** | Chuyển hướng hoặc hiển thị layout trang chủ | SPA Rewrites tự động điều hướng an toàn |

---

## 2. Các Lỗi Thường Gặp & Cách Khắc phục (Troubleshooting)

### 2.1. Lỗi không cập nhật được ô nhập chỉ số KPI (Fixed in v1.4)
- **Triệu chứng:** Người dùng gõ số vào ô KPI trong Case Study nhưng giá trị không hiển thị.
- **Nguyên nhân:** Biến thể thao tác mảng trực tiếp thay đổi thuộc tính của object mà không thay đổi tham chiếu, khiến React không kích hoạt chu kỳ re-render.
- **Giải pháp:** Sử dụng `setResults(prev => prev.map((r, i) => i === idx ? { ...r, number: val } : r))`.

### 2.2. Giới hạn dung lượng LocalStorage (QuotaExceededError)
- **Triệu chứng:** Trình duyệt từ chối ghi dữ liệu khi dung lượng `localStorage` vượt quá ~5MB-10MB (thường do lưu ảnh Base64 thay vì URL).
- **Quy tắc:** Chỉ lưu đường dẫn URL hình ảnh (`https://...` hoặc `/images/...`), tuyệt đối không lưu chuỗi Base64 dài vào localStorage.