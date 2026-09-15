# Project Rules & Development Guidelines - Heona Media

Tài liệu quy định các nguyên tắc bất biến cho Developers và AI Agents khi làm việc trên codebase Heona Media.

---

## 1. Nguyên tắc phạm vi (Scope Boundaries)

1. **Tuyệt đối không tự ý thay đổi Database, Supabase, CRUD, Route hoặc Business Logic** trừ khi có yêu cầu rõ ràng từ người dùng.
2. **Không tự ý thêm thư viện UI:** Không cài thêm Tailwind components, Shadcn, MUI, AntD. Chỉ dùng thuần Tailwind CSS 3 và Lucide Icons.
3. **Bảo tồn comments và docstrings:** Giữ nguyên toàn bộ ghi chú và tài liệu trong mã nguồn, không tự tiện xóa bỏ.

---

## 2. Quy chuẩn Thiết kế & Giao diện (Design Rules)

1. **Font chữ:** Chỉ sử dụng font **Inter** cho toàn bộ hệ thống (headings, body, labels). **Nghiêm cấm** sử dụng font Montserrat hay các kiểu font futuristic/mono trong giao diện người dùng.
2. **Bảng màu:** Màu chủ đạo thương hiệu là Primary `#6f3aff` (Tím). Nền tối sâu `#0b0b0d`, card `#111116`.
3. **Quy chuẩn Font Size trong Admin:**
   - Field Labels: `text-[11px] font-medium uppercase tracking-wider text-gray-400`
   - Input / Textarea text values: `text-sm text-white` hoặc `text-sm text-gray-200`
   - Section Headings: `text-base sm:text-lg font-bold text-white`
   - Primary Buttons: `bg-primary text-black font-bold text-xs`
4. **Không lạm dụng viền (Bỏ Box-inside-Box):** Không dùng outer border bao quanh các section lớn. Ưu tiên phân cấp bằng khoảng cách (whitespace), độ tương phản nền và divider mờ `border-white/[0.06]`.
5. **Cấu trúc Case Study Editor:**
   - 2 Cột trên desktop: Sidebar mục lục (299px sticky) + Vùng soạn thảo (minmax(0,1fr)) + Modal Preview toàn màn hình.
   - Chiều rộng container chính: `max-w-[1440px]`.

---

## 3. Quy chuẩn Kỹ thuật & State (Engineering Rules)

1. **Cập nhật State bất biến (Immutable State Updates):**
   Luôn sử dụng cú pháp `setState(prev => prev.map(...))` khi cập nhật phần tử trong mảng (như KPIs, Process Steps). Tuyệt đối không mutate trực tiếp object trong shallow copy.
2. **Thao tác ghi file khi Dev Server đang chạy:**
   Vite giữ file lock đối với các file đang được HMR. Khi cần ghi/thay thế nội dung lớn qua file script, hãy đảm bảo dev server không gây tranh chấp hoặc dùng API an toàn để tránh trường hợp file bị ghi 0 bytes.
3. **Kiểm tra bản build sau mỗi phiên làm việc:**
   Luôn chạy `npm run build` để kiểm tra TypeScript compilation và SSR prerender (15 routes) trước khi kết thúc tác vụ.
4. **Định dạng file Backup:**
   File nén lưu trữ theo cú pháp: `yymmdd-hhmm-version-feature.zip`, luôn loại trừ `node_modules`, `dist`, `dist-ssr`, `.git`.