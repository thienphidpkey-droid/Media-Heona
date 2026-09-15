import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHero, Section } from '../components/Section';
import { BlogPost } from '../types';
import { Calendar, User, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { DOMAIN, SEO } from '../components/SEO';
import { ProgressiveImage } from '../components/ProgressiveImage';

const POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'checklist-to-chuc-su-kien',
    tag: 'Checklist',
    title: 'Checklist tổ chức sự kiện cơ bản',
    meta: 'Các hạng mục căn bản để sự kiện vận hành trơn tru.',
    date: '2025-02-10',
    author: 'Admin Heona',
    image: '/images/hero-2.webp',
    content: `
      <h3 class="text-lg font-bold text-white mb-3">1. Giai đoạn trước sự kiện (Pre-event)</h3>
      <p class="mb-4 text-sm text-textMuted">Đây là giai đoạn quan trọng nhất quyết định 80% thành công của sự kiện. Bạn cần chuẩn bị:</p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-sm text-textMuted">
        <li><strong>Mục tiêu & Ý tưởng:</strong> Xác định rõ mục đích sự kiện (Launch, Thank you party, Kick-off...) và Concept chủ đạo.</li>
        <li><strong>Địa điểm & Thời gian:</strong> Khảo sát địa điểm (sức chứa, trần cao, nguồn điện) và chốt ngày giờ.</li>
        <li><strong>Xin giấy phép:</strong> Các thủ tục pháp lý cần thiết với sở văn hóa (nếu có biểu diễn) hoặc chính quyền địa phương.</li>
        <li><strong>Thiết kế & Sản xuất:</strong> Key visual, backdrop, standee, thư mời, quà tặng.</li>
      </ul>

      <h3 class="text-lg font-bold text-white mb-3">2. Trong sự kiện (In-event)</h3>
      <p class="mb-4 text-sm text-textMuted">Sự phối hợp nhịp nhàng giữa các bộ phận là chìa khóa:</p>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-sm text-textMuted">
        <li><strong>Rehearsal (Tổng duyệt):</strong> Chạy thử âm thanh, ánh sáng, MC script ít nhất 4 tiếng trước giờ G.</li>
        <li><strong>Check-in:</strong> Quy trình đón khách, cài hoa, chụp hình check-in.</li>
        <li><strong>Điều phối sân khấu:</strong> Cue list cho âm thanh, ánh sáng khớp với kịch bản MC.</li>
      </ul>

      <h3 class="text-lg font-bold text-white mb-3">3. Sau sự kiện (Post-event)</h3>
      <p class="text-sm text-textMuted">Gửi thư cảm ơn, xử lý hình ảnh/video highlight để làm truyền thông sau sự kiện (Recap) và báo cáo nghiệm thu.</p>
    `
  },
  {
    id: 2,
    slug: 'chi-phi-to-chuc-hoi-nghi',
    tag: 'Chi phí',
    title: 'Chi phí tổ chức hội nghị gồm những gì?',
    meta: 'Phân nhóm chi phí rõ ràng – minh bạch.',
    date: '2025-02-12',
    author: 'Admin Heona',
    image: '/images/hero-3.webp',
    content: `
      <p class="mb-4 text-sm text-textMuted">Để tránh phát sinh không kiểm soát, ngân sách sự kiện cần được chia thành các nhóm chính sau:</p>
      
      <h4 class="text-base font-bold text-white mt-5 mb-2">1. Chi phí địa điểm (Venue)</h4>
      <p class="mb-4 text-sm text-textMuted">Chiếm khoảng 30-40% ngân sách. Bao gồm thuê sảnh, Teabreak, Set menu ăn uống và phí phục vụ.</p>

      <h4 class="text-base font-bold text-white mt-5 mb-2">2. Chi phí trang thiết bị (AV & Decor)</h4>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-sm text-textMuted">
        <li>Hệ thống Âm thanh – Ánh sáng (tính theo quy mô khách).</li>
        <li>Màn hình LED (P3 hoặc P4) hoặc Máy chiếu.</li>
        <li>Sân khấu, Backdrop, Photobooth chụp hình.</li>
      </ul>

      <h4 class="text-base font-bold text-white mt-5 mb-2">3. Chi phí nhân sự (Personnel)</h4>
      <p class="mb-4 text-sm text-textMuted">MC, PG/PB đón khách, Media (quay phim chụp ảnh), Đạo diễn sự kiện và Ekip chạy chương trình.</p>

      <h4 class="text-base font-bold text-white mt-5 mb-2">4. Chi phí dự phòng</h4>
      <p class="text-sm text-textMuted">Luôn trích lập 10% tổng ngân sách cho các khoản phát sinh không tên (thêm bàn ghế, thêm nước, làm lại file in ấn...).</p>
    `
  },
  {
    id: 3,
    slug: 'cach-chon-man-hinh-led',
    tag: 'Thiết bị',
    title: 'Cách chọn màn hình LED phù hợp',
    meta: 'Chọn P3, P4 hay P5 theo quy mô sân khấu?',
    date: '2025-02-15',
    author: 'Kỹ thuật Heona',
    image: '/images/hero-2.webp',
    content: `
      <p class="mb-4 text-sm text-textMuted">Màn hình LED được phân loại dựa trên "Pixel Pitch" (khoảng cách giữa các điểm ảnh). Số P càng nhỏ, độ nét càng cao nhưng chi phí cũng cao hơn.</p>

      <div class="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
        <h4 class="text-primary font-bold mb-2 text-sm">LED P3 (Indoor)</h4>
        <p class="text-xs mb-2 text-white">Khoảng cách nhìn tối ưu: Từ 3m trở lên.</p>
        <p class="text-xs text-textMuted">Phù hợp cho: Hội nghị khách hàng, tiệc cưới sang trọng, sự kiện cần trình chiếu slide chữ nhỏ, chi tiết sắc nét.</p>
      </div>

      <div class="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
        <h4 class="text-secondary font-bold mb-2 text-sm">LED P4 (Indoor/Outdoor)</h4>
        <p class="text-xs mb-2 text-white">Khoảng cách nhìn tối ưu: Từ 4m trở lên.</p>
        <p class="text-xs text-textMuted">Phù hợp cho: Sân khấu ngoài trời, sự kiện Year End Party quy mô lớn, background sân khấu ca nhạc.</p>
      </div>

      <p class="text-sm text-textMuted"><strong>Lời khuyên:</strong> Với các sảnh tiệc khách sạn thông thường, LED P3 là lựa chọn cân bằng nhất giữa chi phí và chất lượng hình ảnh.</p>
    `
  },
  {
    id: 4,
    slug: 'quy-trinh-livestream-su-kien',
    tag: 'Livestream',
    title: 'Livestream sự kiện: quy trình chuẩn',
    meta: 'Chuẩn bị thiết bị, ánh sáng và đường truyền.',
    date: '2025-02-18',
    author: 'Media Team',
    image: '/images/hero-3.webp',
    content: `
      <p class="mb-4 text-sm text-textMuted">Livestream sự kiện khác hoàn toàn với livestream bán hàng bằng điện thoại. Nó đòi hỏi tính ổn định và chuyên nghiệp cao.</p>
      
      <h3 class="text-lg font-bold text-white mb-3">1. Đường truyền Internet (Quan trọng nhất)</h3>
      <p class="mb-4 text-sm text-textMuted">Tuyệt đối không dùng Wifi công cộng của sảnh. Cần kéo dây mạng LAN riêng (tốc độ upload tối thiểu 40Mbps) hoặc sử dụng bộ gộp mạng 4G chuyên dụng (LiveU/Bonding).</p>

      <h3 class="text-lg font-bold text-white mb-3">2. Hệ thống Camera & Bàn trộn</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-sm text-textMuted">
        <li>Sử dụng ít nhất 2 góc máy (1 toàn, 1 cận) để hình ảnh không bị nhàm chán.</li>
        <li>Bàn trộn hình (Switcher) để chuyển cảnh mượt mà, chèn logo, lower-third (tên diễn giả).</li>
      </ul>

      <h3 class="text-lg font-bold text-white mb-3">3. Âm thanh (Audio)</h3>
      <p class="text-sm text-textMuted">Lấy tín hiệu trực tiếp (Line-out) từ bàn mixer âm thanh của sự kiện vào thiết bị livestream để âm thanh trong trẻo, không bị tạp âm ồn ào từ môi trường.</p>
    `
  },
  {
    id: 5,
    slug: 'loi-thuong-gap-khi-tu-to-chuc-su-kien',
    tag: 'Kinh nghiệm',
    title: '5 lỗi thường gặp khi tự tổ chức sự kiện',
    meta: 'Những lỗi nhỏ nhưng ảnh hưởng trải nghiệm.',
    date: '2025-02-20',
    author: 'Admin Heona',
    image: '/images/hero-2.webp',
    content: `
      <ol class="list-decimal pl-5 space-y-3 text-sm text-textMuted">
        <li>
            <strong class="text-white">Âm thanh bị hú/rè:</strong> Do bố trí loa sai vị trí hoặc kỹ thuật viên không cắt tần số hú. Đây là lỗi gây khó chịu nhất cho khán giả.
        </li>
        <li>
            <strong class="text-white">Ánh sáng mặt MC bị tối:</strong> Chỉ chú trọng đèn màu sân khấu mà quên đèn mặt (Face light/COB) khiến mặt nhân vật chính bị tối đen khi lên hình.
        </li>
        <li>
            <strong class="text-white">Timeline bị trễ (Overtime):</strong> Không có người quản lý thời gian (Stage Manager), khiến chương trình kéo dài lê thê, khách mời bỏ về sớm.
        </li>
        <li>
            <strong class="text-white">File trình chiếu lỗi font/không chạy video:</strong> Không test kỹ file trên máy tính điều khiển của sự kiện trước giờ G.
        </li>
        <li>
            <strong class="text-white">Thiếu phương án Backup:</strong> Mất điện, trời mưa (với tiệc ngoài trời) mà không có mái che dự phòng.
        </li>
      </ol>
    `
  },
  {
    id: 6,
    slug: 'lam-viec-voi-agency-su-kien',
    tag: 'Thực tế',
    title: 'Làm việc với agency sự kiện: cần chuẩn bị gì?',
    meta: 'Checklist trước khi gửi brief.',
    date: '2025-02-22',
    author: 'Admin Heona',
    image: '/images/hero-3.webp',
    content: `
      <p class="mb-4 text-sm text-textMuted">Để nhận được báo giá chính xác và ý tưởng sát sườn nhất từ Agency (như Heona Media), khách hàng cần chuẩn bị "Brief" (đề bài) bao gồm:</p>
      
      <ul class="list-disc pl-5 space-y-2 text-sm text-textMuted mb-5">
        <li><strong>Mục tiêu sự kiện:</strong> Bạn muốn khách mời cảm thấy gì sau khi tham dự? (Vui vẻ, Trang trọng, hay Xúc động?)</li>
        <li><strong>Đối tượng khách tham dự (Target Audience):</strong> Độ tuổi, nghề nghiệp, phong cách.</li>
        <li><strong>Số lượng khách (Pax):</strong> Để tính toán không gian và tiệc.</li>
        <li><strong>Ngân sách dự kiến (Budget):</strong> Cực kỳ quan trọng để Agency thiết kế các hạng mục "liệu cơm gắp mắm" phù hợp nhất.</li>
        <li><strong>Địa điểm & Thời gian:</strong> Đã có sẵn hay cần Agency đề xuất?</li>
      </ul>
      
      <p class="text-sm text-textMuted">Càng cung cấp thông tin chi tiết, giải pháp bạn nhận được càng tối ưu và tiết kiệm thời gian chỉnh sửa.</p>
    `
  },
];

export const BLOG_POSTS = POSTS;

const formatDate = (date?: string) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(`${date}T00:00:00+07:00`));
};

import { ArticlesService, subscribe } from '../admin/services/db';
import { trackArticleView } from '../admin/services/viewTracker';

const getCmsPosts = (): BlogPost[] => {
  try {
    const published = ArticlesService.getPublished();
    if (published.length > 0) {
      return published.map((a, idx) => ({
        id: typeof a.id === 'number' ? a.id : idx + 100,
        slug: a.slug,
        tag: a.tags?.[0] || a.category,
        title: a.title,
        meta: a.shortDesc,
        date: a.publishedAt || a.createdAt,
        author: a.author,
        image: a.thumbnail,
        views: a.views || 0,
        content:
          a.content +
          (a.ctaBlock?.enabled
            ? `
          <div class="mt-8 p-6 bg-gradient-to-r from-purple-900/40 to-black rounded-2xl border border-primary/30 text-white">
            <h3 class="text-lg font-bold text-white mb-2">${a.ctaBlock.title}</h3>
            <p class="text-sm text-textMuted mb-4">${a.ctaBlock.description}</p>
            <a href="${a.ctaBlock.buttonUrl}" class="inline-block px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-xl hover:bg-primary/90 transition-all">
              ${a.ctaBlock.buttonText}
            </a>
          </div>
        `
            : '')
      }));
    }
  } catch {}
  return POSTS;
};

export const Blog: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(() => getCmsPosts());

  useEffect(() => {
    const unsub = subscribe(() => {
      setPosts(getCmsPosts());
    });
    return () => unsub();
  }, []);

  const legacyPostId = searchParams.get('id');
  const selectedPost = slug ? posts.find((post: BlogPost) => post.slug === slug) : undefined;
  const legacyPost = legacyPostId ? posts.find((post: BlogPost) => post.id === Number(legacyPostId)) : undefined;

  useEffect(() => {
    if (!slug && legacyPost) {
      navigate(`/blog/${legacyPost.slug}`, { replace: true });
    }
  }, [legacyPost, navigate, slug]);

  useEffect(() => {
    if (!selectedPost?.slug) return;
    return trackArticleView(selectedPost.slug);
  }, [selectedPost?.slug]);

  const canonicalPath = selectedPost ? `/blog/${selectedPost.slug}` : '/blog';

  return (
    <>
      <SEO
        title={selectedPost ? selectedPost.title : "Blog Sự Kiện & Truyền Thông"}
        description={selectedPost ? selectedPost.meta : "Chia sẻ kinh nghiệm tổ chức sự kiện, kiến thức âm thanh ánh sáng, kỹ thuật livestream và checklist sự kiện từ đội ngũ Heona Media."}
        url={canonicalPath}
        image={selectedPost?.image}
        type={selectedPost ? "article" : "website"}
        customSchema={selectedPost ? {
          "@type": "BlogPosting",
          "@id": `https://www.heonamedia.com${canonicalPath}#article`,
          "headline": selectedPost.title,
          "description": selectedPost.meta,
          "image": selectedPost.image ? `${DOMAIN}${selectedPost.image}` : `${DOMAIN}/images/logo.webp`,
          "datePublished": selectedPost.date,
          "dateModified": selectedPost.date,
          "author": {
            "@type": "Organization",
            "name": "HEONA MEDIA"
          },
          "publisher": {
            "@id": "https://www.heonamedia.com/#organization"
          },
          "mainEntityOfPage": `https://www.heonamedia.com${canonicalPath}`
        } : undefined}
      />
      <PageHero
        title={selectedPost ? selectedPost.title : 'Blog – Chia sẻ kinh nghiệm'}
        sub={selectedPost ? selectedPost.meta : 'Các bài viết hướng dẫn, checklist và kinh nghiệm thực tế trong ngành sự kiện – media.'}
      />

      {!selectedPost && !slug ? (
        <Section narrow>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-bgCard border border-borderSubtle rounded-xl overflow-hidden hover:border-primary hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(111,58,255,0.2)] transition-all duration-300 flex flex-col h-full relative"
            >
              <div className="p-3 md:p-5 flex flex-col flex-grow relative z-10">
                <h3 className="font-heading font-bold text-[11px] md:text-xl mb-1 md:mb-2 group-hover:text-primary transition-colors leading-snug min-h-[2.2rem] md:min-h-[3.5rem] line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-[9px] md:text-sm text-textMuted leading-relaxed mb-2 md:mb-4 line-clamp-2 md:line-clamp-3 flex-grow">
                  {post.meta}
                </p>

                <div className="mt-auto pt-2 md:pt-3 border-t border-white/5 flex items-center justify-between text-[9px] md:text-[11px] text-textMuted/70 font-medium">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <div className="flex items-center gap-2.5">
                    {typeof post.views === 'number' && (
                      <span className="flex items-center gap-1 text-textMuted/70" title="Lượt xem thực tế">
                        <Eye size={11} className="md:w-3 md:h-3" />
                        <span>{(post.views || 0).toLocaleString()}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                      Đọc thêm <ArrowRight size={10} className="md:w-3.5 md:h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </Section>
      ) : selectedPost ? (
        <Section narrow>
          <article className="max-w-3xl mx-auto bg-[#111115] rounded-2xl border border-white/10 p-5 md:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center gap-5 mb-6 text-xs text-textMuted">
              <span className="inline-block px-2.5 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                {selectedPost.tag}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> <time dateTime={selectedPost.date}>{formatDate(selectedPost.date)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <User size={12} /> {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5 text-textMuted" title="Lượt xem thực tế">
                <Eye size={12} className="text-primary/70" /> {(selectedPost.views || 0).toLocaleString()} lượt xem
              </span>
            </div>
              {selectedPost.image && (
                <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden mb-6 border border-white/10 shadow-lg relative">
                  <ProgressiveImage
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    delay={0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-transparent to-transparent opacity-80"></div>
                </div>
              )}

              <div className="prose prose-invert prose-base max-w-none text-textMuted/90">
                <p className="text-base font-medium text-white italic border-l-4 border-secondary pl-3 mb-6">
                  {selectedPost.meta}
                </p>

                <div dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }} />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
                <p className="text-textMuted mb-3 text-sm">Bạn cần tư vấn chi tiết về chủ đề này?</p>
                <Link
                  to="/contact"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Liên hệ HEONA MEDIA ngay
                </Link>
                <div>
                  <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-primary transition-colors">
                    <ArrowLeft size={14} /> Quay lại danh sách bài viết
                  </Link>
                </div>
              </div>
          </article>
        </Section>
      ) : null}
    </>
  );
};
