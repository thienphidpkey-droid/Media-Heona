# DESIGN SYSTEM - HEONA MEDIA

Hệ thống quy chuẩn thiết kế giao diện (UI/UX Design System), định danh thị giác và bộ nguyên tắc mỹ thuật của HEONA MEDIA (Cập nhật phiên bản v1.4).

---

## 1. Triết lý Thiết kế (Design Philosophy)
- **Deep Dark Aesthetic:** Không gian đen sâu (`#0b0b0d`), huyền bí kết hợp ánh sáng phó quang tím `#6f3aff` tạo cảm giác hiện đại, sang trọng và đậm chất truyền thông sáng tạo.
- **Tối giản Hóa Viền (Eliminate Box-inside-Box):** Ưu tiên phân cấp bằng khoảng cách (whitespace), độ tương phản nền và divider mờ `border-white/[0.06]`. Loại bỏ các đường viền bao quanh section lớn gây nặng mắt.
- **Glassmorphism & Depth:** Sử dụng chất liệu kính mờ (`backdrop-blur-md`), viền sáng nhẹ và các khối phát sáng ambient orb đa tầng để tạo chiều sâu thị giác.

---

## 2. Bảng Màu Chuẩn (Color Palette)

### 2.1. Màu Thương hiệu (Brand Colors)
| Tên biến | Mã Hex | Ý nghĩa & Ứng dụng |
|---|---|---|
| **Primary** | `#6f3aff` | Tím đậm biểu trưng cho công nghệ, sự sáng tạo và tính đột phá |
| **Secondary** | `#ff3a8b` / `#ff7a33` | Hồng rực / Cam neon thể hiện năng lượng, nhiệt huyết |
| **Accent** | `#cfc0ff` | Tím nhạt ánh bạc dùng cho highlight text, badge và tag |

### 2.2. Nền & Bề mặt (Surfaces)
| Tên biến | Giá trị | Ứng dụng |
|---|---|---|
| **bgMain** | `#0b0b0d` | Nền đen tuyền toàn bộ website |
| **bgSurface** | `#111116` | Nền thẻ Card, container và ô nhập liệu |
| **borderSubtle** | `rgba(255, 255, 255, 0.08)` | Đường viền mỏng phân tách thành phần |

---

## 3. Kiểu Chữ Chuẩn mực (Typography System)

- **Toàn bộ hệ thống (Tiêu đề, Thân bài, Nhãn, Số liệu):** Chỉ sử dụng duy nhất font **Inter, sans-serif**.
- **Quy chuẩn kích thước văn bản trong Quản trị (Admin Typography Scale):**
  - **Nhãn trường nhập (Labels):** `text-[11px] font-medium uppercase tracking-wider text-gray-400`
  - **Giá trị ô nhập (Inputs/Textareas):** `text-sm text-white` hoặc `text-sm text-gray-200`
  - **Tiêu đề phân đoạn (Section Headings):** `text-base sm:text-lg font-bold text-white`
  - **Nút hành động chính (Primary Buttons):** `text-xs font-bold bg-primary text-black`
  - **Huy hiệu trạng thái (Status Badges):** `text-[10px] font-semibold px-2 py-0.5 rounded`

---

## 4. Bố Cục Biên Tập Case Study 2 Cột (Editor Layout)
- **Container chính:** `max-w-[1440px]` căn giữa màn hình.
- **Cột trái (299px):** Mục lục 8 phần cố định với thanh trạng thái tiến độ hoàn thiện.
- **Cột giữa (minmax(0, 1fr)):** Vùng nhập liệu nội dung chính không bị giới hạn chiều ngang hẹp.
- **Cột phải (300px):** Modal Preview toàn màn hình cố định theo màn hình cuộn.