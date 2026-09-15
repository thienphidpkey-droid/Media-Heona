import React, { useRef, useEffect, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Code,
  Eye,
  RotateCcw,
  RotateCw,
  Sparkles,
  RemoveFormatting,
  Lightbulb
} from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

interface VisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  value,
  onChange,
  placeholder = 'Bắt đầu viết nội dung bài viết chuyên môn tại đây...'
}) => {
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Word count stats
  const [wordCount, setWordCount] = useState(0);

  const updateStats = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    setWordCount(words);
  };

  // Sync initial and external content changes
  useEffect(() => {
    if (editorRef.current && editorMode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = sanitizeHtml(value);
      }
    }
    updateStats(value);
  }, [value, editorMode]);

  // Save current text selection before opening modal
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Execute formatting command on contentEditable
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateStats(editorRef.current.innerHTML);
    }
  };

  // Handle format block (H2, H3, P, Blockquote)
  const formatBlock = (tagName: string) => {
    executeCommand('formatBlock', `<${tagName}>`);
  };

  // Insert custom HTML at saved or current selection
  const insertCustomHtml = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    executeCommand('insertHTML', html);
  };

  // Insert image from Media Library
  const handleSelectImage = (url: string) => {
    const imgHtml = `<figure class="my-6 block not-prose"><img src="${url}" alt="Hình ảnh bài viết" class="rounded-2xl w-full max-h-[550px] object-cover border border-white/10 shadow-lg mx-auto" /><figcaption class="text-center text-xs text-gray-400 mt-2 italic">Chú thích hình ảnh...</figcaption></figure><p><br></p>`;
    insertCustomHtml(imgHtml);
    setMediaPickerOpen(false);
  };

  // Helper to extract YouTube video ID from any format (watch, youtu.be, shorts, live, embed, iframe tag)
  const extractYouTubeId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    const target = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = target.match(regExp);
    return match ? match[1] : null;
  };

  // Insert Video Embed
  const handleInsertVideo = () => {
    if (!videoUrl) return;
    const trimmed = videoUrl.trim();
    const ytId = extractYouTubeId(trimmed);

    let embedSrc = '';
    if (ytId) {
      embedSrc = `https://www.youtube.com/embed/${ytId}`;
    } else if (trimmed.includes('player.vimeo.com/video/')) {
      embedSrc = trimmed;
    }

    if (!embedSrc) {
      alert('Vui lòng nhập đường dẫn video YouTube hợp lệ (Ví dụ: https://www.youtube.com/watch?v=...)');
      return;
    }

    const videoHtml = `<div class="aspect-video my-6 rounded-2xl overflow-hidden shadow-xl border border-white/10 not-prose"><iframe class="w-full h-full" src="${embedSrc}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p><br></p>`;
    insertCustomHtml(videoHtml);
    setVideoUrl('');
    setVideoModalOpen(false);
  };

  // Insert Link
  const handleInsertLink = () => {
    if (!linkUrl) return;
    executeCommand('createLink', linkUrl);
    setLinkUrl('');
    setLinkModalOpen(false);
  };

  // Insert Callout Box
  const handleInsertCallout = () => {
    const calloutHtml = `<div class="my-5 p-4 rounded-2xl bg-primary/10 border border-primary/30 text-gray-200 not-prose"><strong class="text-primary block mb-1 font-bold flex items-center gap-1.5">💡 Điểm nhấn chuyên môn (Heona Insight):</strong><span>Chia sẻ góc nhìn sâu sắc hoặc bài học kinh nghiệm tại đây...</span></div><p><br></p>`;
    insertCustomHtml(calloutHtml);
  };

  return (
    <div className="bg-[#15151b] rounded-3xl border border-white/10 shadow-xs overflow-hidden flex flex-col transition-all">
      {/* Top Main Toolbar */}
      <div className="p-2.5 bg-[#111115] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        {/* Left Toolbar Group: Text and Block Formatting */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 mr-1.5">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                editorMode === 'visual'
                  ? 'bg-primary text-black shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Trực quan</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                editorMode === 'code'
                  ? 'bg-primary text-black shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mã HTML</span>
            </button>
          </div>

          {editorMode === 'visual' && (
            <>
              {/* Headings */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatBlock('h2');
                }}
                title="Tiêu đề chính (Heading 2)"
                className="px-2.5 py-1.5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-extrabold flex items-center gap-1 border border-transparent hover:border-white/10 transition-colors"
              >
                <Heading1 className="w-4 h-4 text-primary" />
                <span>H2</span>
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatBlock('h3');
                }}
                title="Tiêu đề phụ (Heading 3)"
                className="px-2.5 py-1.5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-transparent hover:border-white/10 transition-colors"
              >
                <Heading2 className="w-4 h-4 text-primary/80" />
                <span>H3</span>
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatBlock('p');
                }}
                title="Đoạn văn thường (Paragraph)"
                className="px-2 py-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors"
              >
                Văn bản
              </button>

              <span className="w-px h-5 bg-white/10 mx-1"></span>

              {/* Inline formatting */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('bold');
                }}
                title="In đậm (Ctrl+B)"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('italic');
                }}
                title="In nghiêng (Ctrl+I)"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('underline');
                }}
                title="Gạch chân (Ctrl+U)"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Underline className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('strikeThrough');
                }}
                title="Gạch ngang"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <span className="w-px h-5 bg-white/10 mx-1"></span>

              {/* Block elements */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatBlock('blockquote');
                }}
                title="Khối trích dẫn (Quote)"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Quote className="w-4 h-4 text-primary" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('insertUnorderedList');
                }}
                title="Danh sách gạch đầu dòng"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('insertOrderedList');
                }}
                title="Danh sách số thứ tự"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('insertHorizontalRule');
                }}
                title="Đường phân cách ngang (Divider)"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-px h-5 bg-white/10 mx-1"></span>

              {/* Rich Inserts */}
              <button
                type="button"
                onClick={() => {
                  saveSelection();
                  setMediaPickerOpen(true);
                }}
                title="Chèn ảnh từ thư viện"
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg text-xs font-bold flex items-center gap-1.5 border border-primary/30 transition-all active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Chèn ảnh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  saveSelection();
                  setVideoModalOpen(true);
                }}
                title="Nhúng video YouTube"
                className="px-2.5 py-1.5 hover:bg-white/10 text-gray-300 hover:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>Embed Video</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  saveSelection();
                  setLinkModalOpen(true);
                }}
                title="Chèn liên kết URL"
                className="p-2 hover:bg-white/10 text-gray-300 hover:text-primary rounded-lg transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleInsertCallout();
                }}
                title="Khối lưu ý nổi bật"
                className="px-2.5 py-1.5 hover:bg-white/10 text-gray-300 hover:text-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-primary" />
                <span>Khối Lưu Ý</span>
              </button>

              <span className="w-px h-5 bg-white/10 mx-1"></span>

              {/* Undo / Redo / Clear */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('undo');
                }}
                title="Hoàn tác (Ctrl+Z)"
                className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('redo');
                }}
                title="Làm lại (Ctrl+Y)"
                className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand('removeFormat');
                }}
                title="Xóa định dạng"
                className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Right Stats & Badge */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span>{wordCount} từ</span>
          <span>•</span>
          <span>~{Math.max(1, Math.round(wordCount / 200))} phút đọc</span>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="p-6 min-h-[420px] bg-[#0d0d11]">
        {editorMode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
                updateStats(editorRef.current.innerHTML);
              }
            }}
            data-placeholder={placeholder}
            className="visual-editor-content focus:outline-none min-h-[380px]"
          />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>Chế độ mã nguồn HTML trực tiếp</span>
              <span>UTF-8</span>
            </div>
            <textarea
              rows={18}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                updateStats(e.target.value);
              }}
              placeholder="Nhập mã HTML..."
              className="w-full font-mono text-xs md:text-sm text-emerald-400 bg-[#08080a] border border-white/10 rounded-2xl p-4 outline-none resize-y leading-relaxed focus:border-primary/50"
            />
          </div>
        )}
      </div>

      {/* Footer Guidance Bar */}
      <div className="px-5 py-2 bg-[#111115] border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Giao diện soạn thảo WYSIWYG trực quan — Tự động căn chỉnh chuẩn thương hiệu Heona.</span>
        </span>
        <span className="hidden sm:inline text-gray-400 font-mono">
          Phím tắt: Ctrl+B (Đậm), Ctrl+I (Nghiêng), Ctrl+U (Gạch chân)
        </span>
      </div>

      {/* Media Library Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleSelectImage}
        title="Chọn hình ảnh chèn vào bài viết"
      />

      {/* Link Insertion Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15151b] border border-white/10 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-white">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              <span>Chèn đường dẫn (Link)</span>
            </h4>
            <input
              type="url"
              placeholder="https://heonamedia.com/..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#111115] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-primary placeholder:text-gray-600"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 text-xs font-bold text-black bg-primary rounded-xl hover:bg-primary/90"
              >
                Chèn liên kết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Embed Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15151b] border border-white/10 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 text-white">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-500" />
              <span>Nhúng Video YouTube vào bài</span>
            </h4>
            <p className="text-xs text-gray-400">
              Dán đường dẫn video YouTube (Ví dụ: https://www.youtube.com/watch?v=...)
            </p>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#111115] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-primary placeholder:text-gray-600"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleInsertVideo}
                className="px-4 py-1.5 text-xs font-bold text-black bg-primary rounded-xl hover:bg-primary/90"
              >
                Nhúng Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
