import { ArticlesService } from './db';

/**
 * Thuật toán kiểm tra & ghi nhận lượt xem Realtime chính xác (Anti-Spam & Verified Real Human Views):
 * 
 * 1. Lọc Bot, Web Crawler & Headless Browser:
 *    - Bỏ qua nếu chạy trong môi trường SSR (window === undefined).
 *    - Bỏ qua nếu navigator.webdriver là true (các công cụ test tự động, automation).
 *    - Bỏ qua nếu User-Agent thuộc nhóm crawler/bot (Googlebot, Bingbot, Baiduspider, Yahoo, DuckDuckBot...).
 * 
 * 2. Ngăn chặn spam F5 (Anti-Spam / Session Cooldown):
 *    - Sử dụng cơ chế Cooldown theo bài viết và người dùng (30 phút).
 *    - Lưu timestamp lần xem gần nhất vào localStorage (`heona_view_${slug}`).
 *    - Nếu người dùng tải lại trang (F5) liên tục trong 30 phút, lượt xem sẽ KHÔNG bị tăng ảo.
 * 
 * 3. Xác thực người đọc thực tế (Human Dwell Time Verification):
 *    - Chỉ kích hoạt khi tab đang hiển thị trực tiếp cho người đọc (`document.visibilityState === 'visible'`).
 *    - Yêu cầu người dùng dừng lại đọc bài viết tối thiểu 2.5 giây. Nếu mở tab rồi đóng ngay lập tức (bounce rate < 2.5s), không tính lượt xem.
 * 
 * 4. Đồng bộ Realtime tức thì:
 *    - Khi đạt đủ điều kiện, gọi `ArticlesService.recordView(slug)` tăng 1 lượt xem nguyên tử.
 *    - Kích hoạt notifyChange và storage event, cập nhật số view lập tức trên cả trang Blog và Admin trong mọi tab đang mở.
 */

const COOLDOWN_MS = 30 * 60 * 1000; // 30 phút cooldown chống spam F5
const DWELL_TIME_MS = 2500; // 2.5 giây người đọc thực tế

export function isBotOrCrawler(): boolean {
  if (typeof window === 'undefined') return true;
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent || '';
  return /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(ua);
}

export function trackArticleView(slug: string): () => void {
  if (typeof window === 'undefined' || !slug) return () => {};

  // 1. Bỏ qua bot / crawler
  if (isBotOrCrawler()) {
    return () => {};
  }

  // 2. Kiểm tra cooldown chống spam F5
  const viewKey = `heona_view_${slug}`;
  try {
    const lastViewTime = Number(localStorage.getItem(viewKey) || 0);
    const now = Date.now();
    if (lastViewTime && now - lastViewTime < COOLDOWN_MS) {
      return () => {};
    }
  } catch {
    // Không thể truy cập localStorage
  }

  // 3. Đếm ngược Dwell Time xác thực người đọc
  let cancelled = false;
  const timer = setTimeout(() => {
    if (cancelled) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }

    try {
      localStorage.setItem(viewKey, String(Date.now()));
    } catch {}

    // Ghi nhận lượt xem realtime vào database
    ArticlesService.recordView(slug);
  }, DWELL_TIME_MS);

  // Dọn dẹp nếu người dùng thoát hoặc chuyển trang trước 2.5s
  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
