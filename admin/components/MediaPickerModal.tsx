import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Check, Image as ImageIcon, Search } from 'lucide-react';
import { MediaService } from '../services/db';
import { MediaItem } from '../../types';
import { processUploadToWebp } from '../../utils/imageToWebp';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Chọn hình ảnh từ Thư viện Media'
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => MediaService.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMediaList(MediaService.getAll());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const processed = await processUploadToWebp(file);
        const newItem = MediaService.add({
          filename: processed.filename,
          url: processed.url,
          fileType: processed.fileType,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
          resolution: processed.resolution,
          altText: processed.altText,
          uploadedBy: 'Admin'
        });
        setMediaList(MediaService.getAll());
        setSelectedUrl(newItem.url);
      } catch (err) {
        console.error('Lỗi tự động convert ảnh sang WebP:', err);
      }
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.altText && m.altText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#111116] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-white/[0.08] text-white my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-white text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-3 bg-[#111116] border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#16161d] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-primary placeholder:text-gray-500"
            />
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-xs rounded-xl hover:bg-primary/90 cursor-pointer transition-colors shadow-xs">
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Tải ảnh lên</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedUrl(item.url)}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 shadow-md scale-[1.02]'
                    : 'border-white/[0.06] hover:border-white/20 bg-[#16161d]'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-black p-1 rounded-full shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-white">
                  <p className="text-[11px] font-medium truncate text-gray-200">{item.filename}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-[#111116]">
          <p className="text-xs text-gray-400">
            {selectedUrl ? 'Đã chọn 1 tệp' : 'Vui lòng nhấp vào một hình ảnh để chọn'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-5 py-2 text-xs font-extrabold text-black bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              Sử dụng tệp này
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
