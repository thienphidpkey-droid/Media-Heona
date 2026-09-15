import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Tag,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { ServicesService } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Service, ContentStatus } from '../../../types';
import { useToast } from '../../components/Toast';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const ServiceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isNew = !id || id === 'new';
  const existing = !isNew ? ServicesService.getById(id!) : undefined;
  const canPublish = AuthService.canPublish();
  const canDelete = AuthService.canDelete();

  // Form states
  const [title, setTitle] = useState(existing?.title || '');
  const [tag, setTag] = useState(existing?.tag || 'Trọng tâm');
  const [subTitle, setSubTitle] = useState(existing?.subTitle || '');
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription || '');
  const [image, setImage] = useState(existing?.image || '/images/hero-1.webp');
  const [price, setPrice] = useState(existing?.price || 'Liên hệ báo giá');
  const [order, setOrder] = useState<number>(existing?.order || 1);
  const [status, setStatus] = useState<ContentStatus>(existing?.status || 'published');
  const [highlight, setHighlight] = useState<boolean>(existing?.highlight ?? true);
  const [features, setFeatures] = useState<string[]>(
    existing?.features || [
      'Lên ý tưởng kịch bản & thông điệp cốt lõi',
      'Thi công & sản xuất trọn gói chuẩn tiến độ',
      'Tối ưu ngân sách & báo cáo hiệu quả'
    ]
  );

  // New feature input state
  const [newFeatureText, setNewFeatureText] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-fill fallback subtitle if empty
  const currentSubtitle = subTitle || shortDescription;

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
    setIsDirty(true);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= features.length) return;
    const reordered = [...features];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setFeatures(reordered);
    setIsDirty(true);
  };

  const handleApplyPreset = (type: 'event' | 'branding' | 'media') => {
    if (type === 'event') {
      setTitle('Tổ chức sự kiện & Workshop');
      setTag('Sự kiện');
      setSubTitle('Lên ý tưởng – kịch bản – thi công – vận hành trọn gói theo mục tiêu doanh nghiệp.');
      setFeatures([
        'Lễ khai trương – khánh thành',
        'Hội nghị – hội thảo – họp báo',
        'Tiệc tất niên – Year End Party',
        'Team Building',
        'Tour Retreat/Trekking',
        'Activation – Roadshow',
        'Ra mắt sản phẩm'
      ]);
      setImage('/images/hero-2.webp');
    } else if (type === 'branding') {
      setTitle('Xây dựng nhân hiệu');
      setTag('Cá nhân');
      setSubTitle('Chiến lược – nội dung – hình ảnh. Đồng hành trọn gói.');
      setFeatures([
        'Tư vấn & Định hình thông điệp & phong cách cá nhân',
        'Sản xuất nội dung chuyên sâu (bài viết – video – podcast)',
        'Xây kênh social (Facebook – TikTok – Group cộng đồng)',
        'Coaching 1:1: xuất hiện tự tin – thuyết phục – tạo ảnh hưởng',
        'Chụp ảnh – quay video nhân hiệu (profile, series nội dung)'
      ]);
      setImage('/images/hero-1.webp');
    } else if (type === 'media') {
      setTitle('Chụp ảnh profile cá nhân');
      setTag('Hình ảnh');
      setSubTitle('Ghi lại thần thái chuyên nghiệp, khẳng định uy tín và sự đột phá trong sự nghiệp.');
      setFeatures([
        'Chụp ảnh chân dung nghề nghiệp (Studio/Office)',
        'Concept: Chuyên gia, Doanh nhân, Nghệ sĩ',
        'Trang điểm & Làm tóc chuyên nghiệp',
        'Hỗ trợ tạo dáng & Biểu cảm chuyên nghiệp',
        'Hậu kỳ cao cấp, tối ưu đa nền tảng'
      ]);
      setImage('/images/service-e.webp');
    }
    setIsDirty(true);
    showToast(`Đã áp dụng mẫu ${type.toUpperCase()}`, 'info');
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Vui lòng nhập tên dịch vụ', 'error');
      return;
    }

    if (features.length === 0) {
      showToast('Vui lòng thêm ít nhất 1 đặc điểm/tính năng cho dịch vụ', 'warning');
      return;
    }

    const payload: Partial<Service> & { title: string } = {
      id: !isNew ? id : undefined,
      title: title.trim(),
      tag: tag.trim() || 'Trọng tâm',
      subTitle: subTitle.trim(),
      shortDescription: shortDescription.trim() || subTitle.trim(),
      image,
      price: price.trim(),
      order: Number(order) || 1,
      status,
      highlight,
      features
    };

    const saved = ServicesService.save(payload);
    setIsDirty(false);
    showToast(isNew ? 'Đã tạo dịch vụ mới thành công!' : 'Đã cập nhật dịch vụ thành công!', 'success');

    if (isNew) {
      navigate(`/admin/services/${saved.id}`, { replace: true });
    }
  };

  const handleDelete = () => {
    if (isNew || !id) return;
    if (!canDelete) {
      showToast('Chỉ Quản trị viên mới có quyền xóa dịch vụ', 'error');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${title}"?`)) {
      ServicesService.delete(id);
      showToast('Đã xóa dịch vụ', 'info');
      navigate('/admin/services');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Sticky Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isDirty && !window.confirm('Bạn có thay đổi chưa lưu. Bạn có muốn thoát?')) return;
              navigate('/admin/services');
            }}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">
                {isNew ? '[ TẠO DỊCH VỤ MỚI ]' : `[ DỊCH VỤ #${id} ]`}
              </span>
              {isDirty && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Chưa lưu
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              {title || 'Dịch vụ chưa có tên'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          )}

          <Link
            to="/"
            target="_blank"
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xem Trang chủ</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Preset Template Buttons */}
          <div className="bg-[#111116] p-3.5 rounded-xl border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Nạp nhanh mẫu chuẩn:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('event')}
                className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-gray-300 hover:text-white font-medium transition-colors"
              >
                Mẫu Sự kiện
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('branding')}
                className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-gray-300 hover:text-white font-medium transition-colors"
              >
                Mẫu Nhân hiệu
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('media')}
                className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-gray-300 hover:text-white font-medium transition-colors"
              >
                Mẫu Profile Studio
              </button>
            </div>
          </div>

          {/* Block 1: Basic Information */}
          <div className="bg-[#111116] p-6 rounded-xl border border-white/[0.06] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Layers className="w-4 h-4 text-primary" />
              <span>Thông Tin Cơ Bản</span>
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Tên Dịch Vụ <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Ví dụ: Tổ chức sự kiện chuyên nghiệp"
                className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3.5 py-2 text-sm font-semibold text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Tag & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  <span>Nhãn / Thẻ phân loại</span>
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Ví dụ: Trọng tâm, Sự kiện, Gói A..."
                  className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mức giá tham khảo</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Ví dụ: Liên hệ báo giá / Gói từ 3.500.000đ"
                  className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>

            {/* SubTitle / Description on Homepage */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Mô tả ngắn (Hiển thị ngay dưới tiêu đề dịch vụ tại Trang chủ)
              </label>
              <textarea
                rows={2}
                value={subTitle}
                onChange={(e) => {
                  setSubTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Ví dụ: Lên ý tưởng – kịch bản – thi công – vận hành trọn gói theo mục tiêu doanh nghiệp."
                className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg p-3 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Block 2: Dynamic Features List */}
          <div className="bg-[#111116] p-6 rounded-xl border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                <span>Danh Sách Hạng Mục / Tính Năng ({features.length})</span>
              </h3>
              <span className="text-[11px] text-gray-400">
                Hiển thị gạch đầu dòng tại thẻ dịch vụ
              </span>
            </div>

            {/* Input to add new feature */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Nhập hạng mục mới và nhấn Thêm hoặc Enter..."
                className="flex-1 bg-[#16161d] border border-white/[0.08] rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 bg-primary text-black font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Reorderable / removable list */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {features.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2 bg-[#16161d] rounded-lg border border-white/[0.04] hover:border-white/[0.08] group transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-5 h-5 rounded bg-white/[0.04] text-[10px] font-mono text-gray-400 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[index] = e.target.value;
                        setFeatures(updated);
                        setIsDirty(true);
                      }}
                      className="bg-transparent border-none text-xs text-gray-200 focus:text-white outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveFeature(index, 'up')}
                      className="p-1 hover:bg-white/[0.06] text-gray-400 hover:text-white rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === features.length - 1}
                      onClick={() => handleMoveFeature(index, 'down')}
                      className="p-1 hover:bg-white/[0.06] text-gray-400 hover:text-white rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1 hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: Media & Visibility Settings */}
          <div className="bg-[#111116] p-6 rounded-xl border border-white/[0.06] space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>Hình Ảnh & Cài Đặt Hiển Thị</span>
            </h3>

            {/* Image Preview & Picker */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Ảnh đại diện dịch vụ
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#16161d] border border-white/[0.08] shrink-0">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="/images/hero-1.webp hoặc URL ảnh..."
                    className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-white/[0.08]"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Chọn từ Thư viện Media</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Highlight & Status toggles */}
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              {/* Highlight on Home Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer transition-colors hover:bg-primary/15">
                <input
                  type="checkbox"
                  checked={highlight}
                  onChange={(e) => {
                    setHighlight(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                />
                <div>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Hiển thị tại mục Dịch vụ trọng tâm trên Trang chủ (Homepage)</span>
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    Khi kích hoạt, dịch vụ này sẽ xuất hiện trực tiếp trên trang chủ với hiệu ứng viền neon, hỗ trợ tối đa 3 dịch vụ trọng tâm hàng đầu.
                  </p>
                </div>
              </label>

              {/* Status & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Trạng thái xuất bản
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as ContentStatus);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-primary/50 focus:outline-none"
                  >
                    <option className="bg-[#111116] text-white" value="published">
                      Đã xuất bản (Công khai)
                    </option>
                    <option className="bg-[#111116] text-white" value="draft">
                      Bản nháp (Ẩn)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={order}
                    min={1}
                    max={99}
                    onChange={(e) => {
                      setOrder(Number(e.target.value));
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#16161d] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              <span>Xem Trước Trực Tiếp (Live Preview)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Chuẩn Giao Diện Trang Chủ</span>
          </div>

          {/* Mock Homepage Service Card */}
          <div className="p-1 rounded-xl bg-gradient-to-b from-primary/30 via-transparent to-transparent border border-white/[0.08]">
            <div className="relative bg-[#111116] border border-white/[0.06] rounded-lg overflow-hidden flex flex-col p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                    {tag || 'Trọng tâm'}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white leading-tight">
                    {title || 'Tên dịch vụ chưa nhập'}
                  </h3>
                </div>
                <ArrowRight className="text-primary w-4 h-4 shrink-0" />
              </div>

              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {currentSubtitle || 'Mô tả ngắn gọn về dịch vụ này sẽ hiển thị ở đây.'}
              </p>

              <ul className="space-y-2 pt-2 border-t border-white/[0.04]">
                {features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium text-emerald-400">{price}</span>
                <span className="text-[11px] font-mono text-gray-500">#{order}</span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.06] text-xs text-gray-400 space-y-1.5">
            <p className="font-medium text-gray-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đồng bộ thời gian thực:</span>
            </p>
            <p className="leading-relaxed">
              Mọi thay đổi sau khi bấm <strong>"Lưu Thay Đổi"</strong> sẽ cập nhật ngay lập tức vào Trang Chủ và trang Danh Mục Dịch Vụ mà không cần khởi động lại server.
            </p>
          </div>
        </div>
      </div>

      {/* Media Picker Modal Integration */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(selectedUrl) => {
          setImage(selectedUrl);
          setIsDirty(true);
        }}
      />
    </div>
  );
};
