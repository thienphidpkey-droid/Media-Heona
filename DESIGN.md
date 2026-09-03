# DESIGN SYSTEM - HEONA MEDIA

Hệ thống quy chuẩn thiết kế giao diện (UI/UX Design System), định danh thị giác và bộ nguyên tắc mỹ thuật của HEONA MEDIA.

---

## 1. Triết lý Thiết kế (Design Philosophy)
- **Deep Dark Aesthetic:** Không gian đen sâu, huyền bí kết hợp ánh sáng phát quang neon tạo cảm giác công nghệ tương lai và sang trọng của ngành media.
- **Glassmorphism & Depth:** Sử dụng chất liệu kính mờ (`backdrop-blur-md`), viền sáng bán trong suốt và các khối phát sáng ambient orb đa tầng để tạo chiều sâu thị giác.
- **Micro-Interactions (WOW Effect):** Mọi điểm tương tác (nút bấm, thẻ dự án, dịch vụ) đều có phản hồi xúc giác thị giác (hơi phóng to, viền phát sáng, đổ bóng màu neon).

---

## 2. Bảng màu chuẩn (Color Palette)

### 2.1. Brand Colors
| Tên biến | Mã Hex | Ý nghĩa & Ứng dụng |
|---|---|---|
| **Primary** | `#6f3aff` | Tím đậm biểu trưng cho công nghệ, sự sáng tạo và tính đột phá |
| **Secondary** | `#ff3a8b` / `#ff7a33` | Hồng rực / Cam neon thể hiện năng lượng, nhiệt huyết và tuổi trẻ |
| **Accent** | `#cfc0ff` | Tím nhạt ánh bạc dùng cho highlight text, badge và tag |

### 2.2. Nền & Bề mặt (Background & Surfaces)
| Tên biến | Giá trị | Ứng dụng |
|---|---|---|
| **bgMain** | `#0b0b0d` (hoặc `#050507`) | Nền đen tuyền toàn bộ website |
| **bgSoft** | `#15151b` | Nền thứ cấp cho các phân vùng nổi |
| **bgCard** | `rgba(15, 15, 20, 0.7)` | Nền kính mờ bán trong suốt cho Card & Container |
| **borderSubtle** | `rgba(255, 255, 255, 0.08)` | Đường viền mỏng phân tách thành phần |

### 2.3. Văn bản (Typography Colors)
| Tên biến | Giá trị | Ứng dụng |
|---|---|---|
| **textMain** | `#f4f4f6` | Chữ chính (tiêu đề, nội dung quan trọng) |
| **textMuted** | `#a0a0b4` | Chữ phụ, mô tả ngắn, chú thích ngày tháng |

---

## 3. Kiểu chữ (Typography)

- **Headings (Tiêu đề):** `Montserrat, sans-serif` — Mạnh mẽ, dứt khoát, mang tinh thần truyền thông và sự kiện.
- **Body (Nội dung thông thường):** `Inter, sans-serif` — Rõ ràng, thoáng mắt, khả năng đọc tối ưu trên mọi màn hình.
- **Code / Số liệu:** `ui-monospace, Menlo, Consolas, monospace` — Dùng cho các số liệu kỹ thuật, số liệu thống kê.

---

## 4. Hiệu ứng & Chuyển động (Animations & Effects)

### 4.1. Hiệu ứng thẻ (Card WOW Effect)
```css
/* Chuẩn Card Hover */
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
hover:scale-[1.02] hoặc hover:scale-105;
hover:border-primary/50;
hover:shadow-[0_0_25px_rgba(111,58,255,0.2)];
```

### 4.2. Hiệu ứng Ánh sáng nền (Ambient Orbs & Grid)
- **Grid nền:** Lưới công nghệ mờ `cyber-grid` chạy ngầm phía sau nội dung.
- **Orbs:** 3 khối ánh sáng tròn chuyển động tự do:
  - Orb 1 (Tím): `bg-primary/10`, hiệu ứng `animate-pulse-slow`.
  - Orb 2 (Hồng): `bg-secondary/5`, hiệu ứng `animate-float`.
  - Orb 3 (Tím sâu): `bg-[#4221c4]/10`, hiệu ứng `animate-pulse-slow` trễ 1s.

---

## 5. Quy chuẩn Tối ưu Giao diện Di động (Mobile UX Guidelines)

1. **Floating Dock Menu (Mobile & Tablet < 1024px):**
   - Cố định đáy màn hình: `fixed bottom-5 left-0 right-0 z-[9999] lg:hidden`.
   - Bề mặt kính `backdrop-blur-xl bg-[#6f3aff]/20 border border-[#9d7aff]/30 rounded-full shadow-[0_0_25px_rgba(111,58,255,0.35)]`.
   - Trên Mobile: Hiển thị icon compact với tooltip khi hover/chạm.
   - Trên Tablet (`md:`): Mở rộng thanh dock ngang sang trọng hiển thị đồng thời cả icon và nhãn chữ (`text-xs font-semibold`).
   - Kích thước icon và touch-target tối thiểu 44px x 44px.

2. **Dự án (Projects Grid):**
   - 1 thẻ/dòng (`grid-cols-1`).
   - Khung ảnh panorama cố định `h-32` với `object-cover` để tránh chiếm toàn bộ chiều cao màn hình.

3. **Bài viết Blog:**
   - 2 thẻ/dòng (`grid-cols-2`).
   - Thumbnail thu gọn tỉ lệ `h-24` giúp người dùng dễ dàng lướt xem nhiều bài viết cùng lúc.

4. **Đánh giá khách hàng (Testimonials):**
   - 1 thẻ/dòng, cỡ chữ to hơn 30% so với bản desktop để tạo độ tin cậy và không mỏi mắt khi đọc.

5. **Trang Giới thiệu (About):**
   - Tiêu đề và đoạn văn giảm kích thước ~30% trên Mobile để đảm bảo mật độ chữ cân đối, không bị ngắt dòng bất hợp lý.
