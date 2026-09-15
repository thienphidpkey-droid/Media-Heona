import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Globe,
  Youtube,
  Link as LinkIcon
} from 'lucide-react';
import { ArticlesService, subscribe } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Article, ContentStatus } from '../../../types';
import { useToast } from '../../components/Toast';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { VisualEditor } from '../../components/VisualEditor';

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isNew = !id || id === 'new';
  const existing = !isNew ? ArticlesService.getById(id!) : undefined;
  const currentUser = AuthService.getCurrentUser();
  const canPublish = AuthService.canPublish();

  // Basic Information
  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [shortDesc, setShortDesc] = useState(existing?.shortDesc || '');
  const [thumbnail, setThumbnail] = useState(existing?.thumbnail || '/images/hero-1.webp');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');
  const [isExtractingYt, setIsExtractingYt] = useState(false);

  const handleApplyThumbnailUrl = (inputUrl?: string) => {
    const raw = (inputUrl !== undefined ? inputUrl : thumbnailUrlInput).trim();
    if (!raw) return;

    const ytId = extractYoutubeId(raw);
    if (ytId) {
      setIsExtractingYt(true);
      const maxresUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      const hqUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

      // Kiểm tra tính khả dụng của maxresdefault
      const testImg = new window.Image();
      testImg.onload = () => {
        setIsExtractingYt(false);
        if (testImg.naturalWidth === 120 && testImg.naturalHeight === 90) {
          setThumbnail(hqUrl);
        } else {
          setThumbnail(maxresUrl);
        }
        setIsDirty(true);
        setThumbnailUrlInput('');
        showToast('Đã trích xuất thumbnail từ YouTube!', 'success');
      };
      testImg.onerror = () => {
        setIsExtractingYt(false);
        setThumbnail(hqUrl);
        setIsDirty(true);
        setThumbnailUrlInput('');
        showToast('Đã trích xuất thumbnail từ YouTube (HQ)!', 'success');
      };
      testImg.src = maxresUrl;
      return;
    }

    // Link ảnh trực tiếp
    if (/^https?:\/\//i.test(raw)) {
      setThumbnail(raw);
      setIsDirty(true);
      setThumbnailUrlInput('');
      showToast('Đã cập nhật ảnh đại diện bài viết!', 'success');
      return;
    }

    showToast('Đường dẫn không hợp lệ. Vui lòng nhập link YouTube hoặc link ảnh trực tiếp.', 'error');
  };
  const [category, setCategory] = useState(existing?.category || 'Expert Spotlight');
  const [tagsInput, setTagsInput] = useState(existing?.tags?.join(', ') || 'Giáo dục, Chuyên gia');
  const [author, setAuthor] = useState(existing?.author || currentUser?.name || 'Nguyễn Heona');
  const [status, setStatus] = useState<ContentStatus>(existing?.status || 'draft');

  // Content (HTML / Rich text)
  const [content, setContent] = useState(
    existing?.content ||
      `<h2>1. Mở đầu bài viết</h2>\n<p>Chia sẻ góc nhìn và giải pháp xây dựng thương hiệu giáo dục, nâng tầm vị thế chuyên gia và lan tỏa giá trị tri thức...</p>`
  );

  // HEONA CTA Block
  const [ctaEnabled, setCtaEnabled] = useState(existing?.ctaBlock?.enabled ?? true);
  const [ctaTitle, setCtaTitle] = useState(
    existing?.ctaBlock?.title || 'Bạn muốn xây dựng hình ảnh thương hiệu chuyên nghiệp?'
  );
  const [ctaDesc, setCtaDesc] = useState(
    existing?.ctaBlock?.description ||
      'Heona Media đồng hành cùng chuyên gia và tổ chức giáo dục xây dựng nội dung, hình ảnh và thương hiệu trên social media.'
  );
  const [ctaButtonText, setCtaButtonText] = useState(
    existing?.ctaBlock?.buttonText || 'TƯ VẤN CÙNG HEONA'
  );
  const [ctaButtonUrl, setCtaButtonUrl] = useState(existing?.ctaBlock?.buttonUrl || '/contact');

  // SEO Sidebar
  const [seoTitle, setSeoTitle] = useState(existing?.seo?.title || '');
  const [metaDesc, setMetaDesc] = useState(existing?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(existing?.seo?.focusKeyword || '');
  const [robotsIndex, setRobotsIndex] = useState(existing?.seo?.robotsIndex ?? true);
  const [robotsFollow, setRobotsFollow] = useState(existing?.seo?.robotsFollow ?? true);

  // Autosave & UI state
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Auto-generate slug if new or empty
  useEffect(() => {
    if (isNew && title && !slug) {
      const generated = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [title, isNew, slug]);

  // Handle ESC key and scroll lock for preview modal
  useEffect(() => {
    if (!previewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [previewOpen]);

  // Mark dirty
  const handleContentChange = (val: string) => {
    setContent(val);
    setIsDirty(true);
  };

  // Preset CTA templates
  const applyCtaPreset = (type: 'expert' | 'school' | 'event') => {
    if (type === 'expert') {
      setCtaTitle('Bạn là chuyên gia đang tìm giải pháp xây dựng thương hiệu cá nhân?');
      setCtaDesc('Chương trình Expert Spotlight của Heona Media giúp bạn định hình phong thái, xây dựng kênh TikTok - Facebook chuyên nghiệp.');
      setCtaButtonText('ĐĂNG KÝ TƯ VẤN SPOTLIGHT');
    } else if (type === 'school') {
      setCtaTitle('Xây dựng câu chuyện thương hiệu chạm đến trái tim phụ huynh');
      setCtaDesc('Gói School Story giúp trường học và trung tâm giáo dục nâng tầm uy tín và bùng nổ chiến dịch tuyển sinh.');
      setCtaButtonText('KHÁM PHÁ SCHOOL STORY');
    } else {
      setCtaTitle('Chuyển đổi sự kiện thành tài sản truyền thông vô giá');
      setCtaDesc('Biến 1 buổi workshop/hội thảo thành hơn 20 video ngắn recap và bài viết chuyên môn đa nền tảng.');
      setCtaButtonText('TƯ VẤN TRUYỀN THÔNG SỰ KIỆN');
    }
    setCtaEnabled(true);
    setIsDirty(true);
    showToast('Đã áp dụng mẫu HEONA CTA!', 'info');
  };

  // SEO Score calculation
  const calcSeoScore = () => {
    let score = 0;
    const checks: { label: string; passed: boolean }[] = [];

    const effectiveTitle = seoTitle || title;
    const effectiveMeta = metaDesc || shortDesc;

    // Title length 40 - 65 chars
    const titleGood = effectiveTitle.length >= 30 && effectiveTitle.length <= 70;
    checks.push({ label: 'Độ dài tiêu đề SEO (30-70 ký tự)', passed: titleGood });
    if (titleGood) score += 25;

    // Meta desc length 100 - 160 chars
    const metaGood = effectiveMeta.length >= 80 && effectiveMeta.length <= 165;
    checks.push({ label: 'Độ dài Meta Description (80-165 ký tự)', passed: metaGood });
    if (metaGood) score += 25;

    // Focus keyword provided & in title
    const hasKeyword = focusKeyword.trim().length > 0;
    const keywordInTitle = hasKeyword && effectiveTitle.toLowerCase().includes(focusKeyword.toLowerCase());
    checks.push({ label: 'Từ khóa chính xuất hiện trong tiêu đề SEO', passed: keywordInTitle });
    if (keywordInTitle) score += 25;

    // Has image & alt
    const hasImage = !!thumbnail;
    checks.push({ label: 'Có ảnh đại diện Featured Image', passed: hasImage });
    if (hasImage) score += 25;

    return { score, checks };
  };

  const { score: seoScore, checks: seoChecks } = calcSeoScore();

  // Save handler
  const handleSave = (newStatus?: ContentStatus) => {
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề bài viết', 'error');
      return;
    }

    const effectiveStatus = newStatus || status;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const savedArticle = ArticlesService.save({
      id: isNew ? undefined : existing?.id,
      title,
      slug,
      shortDesc,
      thumbnail,
      content,
      category,
      tags,
      author,
      status: effectiveStatus,
      seo: {
        title: seoTitle || title,
        metaDescription: metaDesc || shortDesc,
        focusKeyword,
        robotsIndex,
        robotsFollow
      },
      ctaBlock: {
        enabled: ctaEnabled,
        title: ctaTitle,
        description: ctaDesc,
        buttonText: ctaButtonText,
        buttonUrl: ctaButtonUrl
      }
    });

    setStatus(effectiveStatus);
    setIsDirty(false);
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSaved(timeStr);

    if (newStatus === 'published') {
      showToast('Đã xuất bản bài viết thành công lên website!', 'success');
    } else if (newStatus === 'review') {
      showToast('Đã gửi bài viết chờ phê duyệt!', 'info');
    } else {
      showToast('Đã lưu bản nháp thành công!', 'success');
    }

    if (isNew) {
      navigate(`/admin/articles/${savedArticle.id}`, { replace: true });
    }
  };

  // Autosave interval (every 20s if dirty)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty && title.trim()) {
        handleSave(status);
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [isDirty, title, content, status]);

  return (
    <div className="animate-fade-in pb-12">
      {/* Top Header Sticky Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] sticky top-0 bg-[#0b0b0d]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl border border-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {isNew ? 'Soạn bài viết mới' : 'Chỉnh sửa bài viết'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : status === 'review'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    : 'bg-white/5 text-gray-400 border border-white/[0.08]'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {lastSaved ? `Đã lưu tự động lúc ${lastSaved}` : 'Chưa lưu thay đổi'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#111116] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#111116] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-gray-400" />
            <span>Lưu nháp</span>
          </button>

          {!canPublish ? (
            <button
              type="button"
              onClick={() => handleSave('review')}
              className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi duyệt (Review)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-4 py-2 text-xs font-semibold text-black bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xuất bản ngay</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Editor (2/3), Right SEO Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Left Column: Form & Content Block Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-[#111116] p-6 rounded-xl border border-white/[0.06] space-y-5">
            <div>
              <input
                type="text"
                placeholder="Nhập tiêu đề bài viết..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full text-xl md:text-2xl font-bold text-white placeholder:text-gray-600 outline-none border-b border-transparent focus:border-white/20 pb-2 transition-colors bg-transparent"
              />
            </div>

            {/* Slug & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Đường dẫn tĩnh (Slug URL)
                </label>
                <div className="flex items-center px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs focus-within:border-primary/50 transition-colors">
                  <span className="text-gray-500 select-none">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full bg-transparent outline-none font-medium text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Chuyên mục (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs font-medium text-white outline-none focus:border-primary/50 transition-colors"
                >
                  <option className="bg-[#111116] text-white" value="Expert Spotlight">Expert Spotlight (Xây dựng hình ảnh chuyên gia)</option>
                  <option className="bg-[#111116] text-white" value="School Story">School Story (Truyền thông trường học / Tuyển sinh)</option>
                  <option className="bg-[#111116] text-white" value="Event to Content">Event to Content (Tổ chức & truyền thông sự kiện)</option>
                  <option className="bg-[#111116] text-white" value="Checklist">Checklist</option>
                  <option className="bg-[#111116] text-white" value="Chi phí">Chi phí</option>
                  <option className="bg-[#111116] text-white" value="Thiết bị">Thiết bị</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Tóm tắt ngắn (Short Description)
              </label>
              <textarea
                rows={2}
                placeholder="Mô tả ngắn gọn nội dung bài viết hiển thị ở trang danh sách..."
                value={shortDesc}
                onChange={(e) => {
                  setShortDesc(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full p-3 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-gray-200 outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Tags & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Tags (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Ví dụ: TikTok, Hội thảo, Giáo dục"
                  className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Tác giả hiển thị
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs font-medium text-white outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Ảnh đại diện bài viết (Thumbnail)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#16161d] p-3 rounded-xl border border-white/[0.08]">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden ring-1 ring-white/[0.1] bg-black/40 shrink-0">
                  <img
                    src={thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('maxresdefault.jpg')) {
                        target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                      }
                    }}
                  />
                  {thumbnail.includes('youtube.com') && (
                    <div className="absolute top-1.5 right-1.5 bg-red-600/90 text-white p-1 rounded-md shadow flex items-center justify-center">
                      <Youtube className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <input
                        type="url"
                        value={thumbnailUrlInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThumbnailUrlInput(val);
                          // Tự động nhận diện và trích xuất nếu là link YouTube
                          if (extractYoutubeId(val)) {
                            handleApplyThumbnailUrl(val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyThumbnailUrl();
                          }
                        }}
                        placeholder="Dán link video YouTube (hoặc link ảnh webp, jpg, png)..."
                        className="w-full pl-8 pr-3 py-2 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      type="button"
                      disabled={isExtractingYt || !thumbnailUrlInput.trim()}
                      onClick={() => handleApplyThumbnailUrl()}
                      className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                    >
                      {isExtractingYt ? (
                        <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Youtube className="w-3.5 h-3.5" />
                      )}
                      <span>Lấy ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-white/[0.08] shrink-0"
                      title="Chọn từ thư viện ảnh đã tải lên"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="hidden md:inline">Thư viện</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <span>💡 Hỗ trợ dán link YouTube (youtube.com/watch, youtu.be, shorts), hệ thống tự động tải thumbnail HD cao nhất.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual WYSIWYG Content Editor */}
          <VisualEditor
            value={content}
            onChange={handleContentChange}
            placeholder="Bắt đầu viết nội dung bài viết chuyên môn tại đây..."
          />

          {/* Special Block: HEONA CTA BLOCK */}
          <div className="bg-[#111116] p-6 rounded-xl border border-white/[0.06] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-white text-sm">Khối Kêu Gọi Hành Động (HEONA CTA BLOCK)</h3>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaEnabled}
                  onChange={(e) => {
                    setCtaEnabled(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                />
                <span>Kích hoạt CTA</span>
              </label>
            </div>

            {ctaEnabled && (
              <div className="space-y-4 pt-3 border-t border-white/[0.06]">
                {/* Presets */}
                <div>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-2">
                    Áp dụng mẫu CTA thương hiệu giáo dục:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyCtaPreset('expert')}
                      className="px-3 py-1.5 bg-white/[0.03] hover:bg-primary hover:text-black text-gray-300 border border-white/[0.06] rounded-lg text-xs font-medium transition-colors"
                    >
                      Mẫu 1: Expert Spotlight
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCtaPreset('school')}
                      className="px-3 py-1.5 bg-white/[0.03] hover:bg-primary hover:text-black text-gray-300 border border-white/[0.06] rounded-lg text-xs font-medium transition-colors"
                    >
                      Mẫu 2: School Story
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCtaPreset('event')}
                      className="px-3 py-1.5 bg-white/[0.03] hover:bg-primary hover:text-black text-gray-300 border border-white/[0.06] rounded-lg text-xs font-medium transition-colors"
                    >
                      Mẫu 3: Event to Content
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Tiêu đề CTA
                  </label>
                  <input
                    type="text"
                    value={ctaTitle}
                    onChange={(e) => {
                      setCtaTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs font-medium text-white outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Mô tả CTA
                  </label>
                  <textarea
                    rows={2}
                    value={ctaDesc}
                    onChange={(e) => {
                      setCtaDesc(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full p-3 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-gray-200 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                      Nút bấm (Button text)
                    </label>
                    <input
                      type="text"
                      value={ctaButtonText}
                      onChange={(e) => {
                        setCtaButtonText(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs font-medium text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                      Liên kết (Button URL)
                    </label>
                    <input
                      type="text"
                      value={ctaButtonUrl}
                      onChange={(e) => {
                        setCtaButtonUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs font-medium text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* CTA Live Preview Box */}
                <div className="mt-4 p-5 bg-gradient-to-br from-[#0b0b0d] via-[#111116] to-[#16161d] text-white rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider mb-1 block">
                    Xem trước hiển thị ngoài website:
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">{ctaTitle}</h4>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">{ctaDesc}</p>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-block px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-lg shadow-sm hover:bg-primary/90 transition-all"
                  >
                    {ctaButtonText}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: SEO Settings & Google Preview */}
        <div className="space-y-5">
          <div className="bg-[#111116] p-5 rounded-xl border border-white/[0.06] space-y-5 sticky top-24">
            {/* SEO Score Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-white text-sm">Cấu hình SEO</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    seoScore >= 75
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : seoScore >= 50
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                  }`}
                >
                  SEO: {seoScore}/100
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Tối ưu chuẩn Google cho hệ sinh thái giáo dục.
              </p>
            </div>

            {/* Google Search Preview */}
            <div className="p-3.5 bg-[#0b0b0d] rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-2">
                Google Search Preview
              </span>
              <div className="font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-0.5 truncate">
                  <span className="font-medium text-gray-300">Heona Media</span>
                  <span>›</span>
                  <span className="text-gray-400">blog</span>
                  <span>›</span>
                  <span className="text-gray-400">{slug || 'bai-viet'}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1 leading-snug">
                  {seoTitle || title || 'Tiêu đề bài viết hiển thị trên Google'}
                </h4>
                <p className="text-xs text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                  {metaDesc || shortDesc || 'Mô tả tóm tắt nội dung bài viết sẽ xuất hiện ở đoạn trích tìm kiếm của Google...'}
                </p>
              </div>
            </div>

            {/* SEO Checklist */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Kiểm tra chỉ số SEO:
              </span>
              {seoChecks.map((chk, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {chk.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                  <span className={chk.passed ? 'text-gray-200' : 'text-gray-400'}>
                    {chk.label}
                  </span>
                </div>
              ))}
            </div>

            {/* SEO Form Inputs */}
            <div className="space-y-4 pt-2 border-t border-white/[0.06]">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    SEO Title
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {(seoTitle || title).length}/70
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={title || 'Tiêu đề SEO tối ưu...'}
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Meta Description
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {(metaDesc || shortDesc).length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={shortDesc || 'Mô tả meta tóm tắt cho search engine...'}
                  value={metaDesc}
                  onChange={(e) => {
                    setMetaDesc(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full p-3 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Focus Keyword (Từ khóa chính)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: thương hiệu cá nhân giảng viên"
                  value={focusKeyword}
                  onChange={(e) => {
                    setFocusKeyword(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-[#16161d] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              {/* Robots Settings */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                  />
                  <span>Google Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                  />
                  <span>Follow links</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(selectedUrl) => {
          setThumbnail(selectedUrl);
          setIsDirty(true);
          showToast('Đã chọn ảnh đại diện', 'success');
        }}
      />

      {/* Live Preview Modal */}
      {previewOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false);
          }}
        >
          <div className="bg-[#15151b] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white my-auto animate-fade-in">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111115]">
              <span className="text-xs font-bold text-gray-300">
                Xem trước giao diện bài viết ngoài website
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-colors"
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 font-bold text-xs rounded-full">
                {category}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>Bởi {author}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('vi-VN')}</span>
              </div>
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-80 object-cover rounded-2xl shadow-md border border-white/10"
              />
              <div
                className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {ctaEnabled && (
                <div className="p-6 bg-gradient-to-br from-[#0b0b0d] via-[#111115] to-[#15151b] border border-white/10 text-white rounded-2xl shadow-lg mt-8">
                  <h3 className="text-lg font-bold text-white mb-2">{ctaTitle}</h3>
                  <p className="text-xs text-gray-300 mb-4">{ctaDesc}</p>
                  <a
                    href={ctaButtonUrl}
                    className="inline-block px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-xl shadow-md"
                  >
                    {ctaButtonText}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
