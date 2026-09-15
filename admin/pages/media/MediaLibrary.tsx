import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  X,
  FileText,
  ExternalLink,
  Info
} from 'lucide-react';
import { MediaService, subscribe } from '../../services/db';
import { MediaItem } from '../../../types';
import { useToast } from '../../components/Toast';
import { processUploadToWebp } from '../../../utils/imageToWebp';

export const MediaLibrary: React.FC = () => {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<MediaItem[]>(MediaService.getAll());
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const unsub = subscribe(() => setMediaList(MediaService.getAll()));
    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let count = 0;
    for (const file of Array.from(files)) {
      try {
        const processed = await processUploadToWebp(file);
        MediaService.add({
          filename: processed.filename,
          url: processed.url,
          fileType: processed.fileType,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
          resolution: processed.resolution,
          altText: processed.altText,
          uploadedBy: 'Admin'
        });
        count++;
      } catch (err) {
        console.error('Lỗi chuyển đổi WebP:', err);
      }
    }

    if (count > 0) {
      showToast(`Đã tự động tối ưu & chuyển đổi ${count} tệp sang WebP thành công!`, 'success');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    showToast('Đã sao chép đường dẫn hình ảnh!', 'success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDeleteMedia = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tệp "${name}" khỏi Media Library?`)) {
      MediaService.delete(id);
      setActiveItem(null);
      showToast('Đã xóa tệp media', 'success');
    }
  };

  const handleSaveMetadata = () => {
    if (!activeItem) return;
    MediaService.update(activeItem.id, {
      altText: activeItem.altText,
      caption: activeItem.caption
    });
    showToast('Đã cập nhật thông tin ALT text & Caption chuẩn SEO!', 'success');
  };

  const filtered = mediaList.filter((m) => {
    const matchType = selectedType === 'all' || m.fileType === selectedType;
    const matchSearch =
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Thư viện Media</h1>
          <p className="text-xs text-gray-400 mt-1">
            Kho ảnh và video tập trung dùng chung cho toàn bộ bài viết, case study và website.
          </p>
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer active:scale-95">
          <Upload className="w-4 h-4 stroke-[3]" />
          <span>Tải tệp lên</span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên file hoặc ALT text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#111116] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-primary placeholder:text-gray-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#111116] p-1 rounded-xl border border-white/[0.06]">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                selectedType === t
                  ? 'bg-primary text-black font-extrabold shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'Tất cả' : t === 'image' ? 'Hình ảnh' : 'Video'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative aspect-square bg-[#111116] rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer hover:border-primary/50 hover:scale-[1.02] transition-all"
          >
            <img
              src={item.url}
              alt={item.altText || item.filename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[11px] font-semibold truncate leading-tight text-white">{item.filename}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{item.resolution || 'Web Image'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Details Side Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#111116] border-l border-white/[0.08] text-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="font-bold text-white text-sm">Chi tiết tệp Media</h3>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="aspect-video bg-[#0b0b0d] rounded-xl overflow-hidden border border-white/[0.06]">
                <img
                  src={activeItem.url}
                  alt={activeItem.altText}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Tên file
                  </label>
                  <p className="font-medium text-gray-300 bg-[#16161d] p-2 rounded-xl border border-white/[0.06] truncate">
                    {activeItem.filename}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    ALT Text (Tối ưu SEO hình ảnh Google)
                  </label>
                  <input
                    type="text"
                    value={activeItem.altText || ''}
                    onChange={(e) =>
                      setActiveItem({ ...activeItem, altText: e.target.value })
                    }
                    placeholder="Mô tả nội dung bức ảnh..."
                    className="w-full p-2.5 bg-[#16161d] rounded-xl border border-white/[0.08] text-xs text-white outline-none focus:border-primary placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Chú thích ảnh (Caption)
                  </label>
                  <input
                    type="text"
                    value={activeItem.caption || ''}
                    onChange={(e) =>
                      setActiveItem({ ...activeItem, caption: e.target.value })
                    }
                    placeholder="Chú thích hiển thị dưới ảnh..."
                    className="w-full p-2.5 bg-[#16161d] rounded-xl border border-white/[0.08] text-xs text-white outline-none focus:border-primary placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 bg-[#16161d] p-3 rounded-xl border border-white/[0.06]">
                  <div>
                    <span>Kích thước: </span>
                    <strong className="text-white font-semibold">
                      {activeItem.sizeBytes ? `${Math.round(activeItem.sizeBytes / 1024)} KB` : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span>Độ phân giải: </span>
                    <strong className="text-white font-semibold">{activeItem.resolution || 'N/A'}</strong>
                  </div>
                </div>

                {/* Copy URL */}
                <div>
                  <button
                    onClick={() => handleCopyUrl(activeItem.url)}
                    className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-white/[0.08]"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl ? 'Đã sao chép link' : 'Sao chép đường dẫn (URL)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteMedia(activeItem.id, activeItem.filename)}
                className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa tệp</span>
              </button>

              <button
                onClick={handleSaveMetadata}
                className="px-5 py-2 bg-primary text-black text-xs font-extrabold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
