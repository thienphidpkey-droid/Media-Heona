# State Management - Heona Media

Tài liệu chi tiết về chiến lược quản lý trạng thái (State Architecture) của toàn bộ ứng dụng Heona Media.

---

## 1. Triết lý quản lý State (Zero Heavy Libraries)

Dự án có chủ ý **không sử dụng Redux, Zustand hay Recoil** nhằm giữ bundle size nhẹ nhất và tối đa hóa tốc độ tải trang. State được phân tách rõ ràng thành 3 tầng:

1. **Tầng Lưu trữ Bền vững (Persistent Storage Layer):** Dữ liệu nghiệp vụ Admin được quản lý tập trung qua `localStorage` bằng các hàm Service độc lập trong `admin/services/db.ts`.
2. **Tầng Ngữ cảnh Chia sẻ (Shared Context Layer):** Dữ liệu công khai trang web dùng `React.createContext` (`ContentContext.tsx`) cung cấp dữ liệu cho các trang Public.
3. **Tầng Trạng thái Cục bộ (Local Component State):** Sử dụng `useState`, `useEffect`, `useMemo` cho các hành vi giao diện tức thời (active nav, modal open, search query, unsaved changes flag).

---

## 2. Dịch vụ Cơ sở Dữ liệu (DB Service Layer)

File `admin/services/db.ts` xuất bản các API dạng đồng bộ/bất đồng bộ nhẹ:
- `ProjectsService`: `getAll()`, `getById(id)`, `save(project)`, `delete(id)`
- `ArticlesService`: `getAll()`, `getById(id)`, `save(article)`, `delete(id)`, `duplicate(id)`
- `ClientsService`: `getAll()`, `getById(id)`, `save(client)`, `delete(id)`
- `LeadsService`: `getAll()`, `getById(id)`, `updateStatus(id, status)`, `delete(id)`
- `MediaService`: `getAll()`, `upload(file)`, `delete(id)`
- `AuthService`: `getCurrentUser()`, `login(email, password)`, `logout()`

### Event Subscription Pattern:
File `db.ts` cung cấp hàm `subscribe(callback)` cho phép các component lắng nghe sự kiện thay đổi dữ liệu trong `localStorage` để tự động re-render khi có thao tác Create/Update/Delete mà không cần reload trang.

---

## 3. Quy chuẩn Cập nhật State Bất biến (Immutable State Rules)

Khi thao tác với mảng đối tượng phức tạp (như danh sách chỉ số KPI `results` hoặc quy trình `processSteps`):
```typescript
// ĐÚNG: Tạo object mới cho phần tử cần cập nhật, giữ nguyên tham chiếu các phần tử khác
setResults((prev) =>
  prev.map((r, i) => (i === idx ? { ...r, number: val } : r))
);

// SAI: Mutate trực tiếp object trong shallow copy khiến React không nhận biết thay đổi
const updated = [...results];
updated[idx].number = val; // BUG: mutated original item reference
setResults(updated);
```

---

## 4. Hệ thống Thông báo (Toast Notification State)

Sử dụng custom hook `useToast()` và component `Toast.tsx`:
```typescript
const { showToast } = useToast();
showToast('Đã lưu bản nháp thành công!', 'success'); // 'success' | 'error' | 'warning' | 'info'
```
Thời gian hiển thị mặc định: 3000ms với hiệu ứng slide-in và auto dismiss.