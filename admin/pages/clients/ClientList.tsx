import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Users, Plus, Search, Edit, Trash2, Globe, Phone, Mail, FileText, X, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { ClientsService, MediaService, subscribe } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Client } from '../../../types';
import { useToast } from '../../components/Toast';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { processUploadToWebp } from '../../../utils/imageToWebp';

export const ClientList: React.FC = () => {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>(ClientsService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canDelete = AuthService.canDelete();

  useEffect(() => {
    const unsub = subscribe(() => setClients(ClientsService.getAll()));
    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingClient) return;

    try {
      setIsUploading(true);
      const processed = await processUploadToWebp(file);
      MediaService.add({
        filename: processed.filename,
        url: processed.url,
        fileType: processed.fileType,
        mimeType: processed.mimeType,
        sizeBytes: processed.sizeBytes,
        resolution: processed.resolution,
        altText: editingClient.name ? `Logo ${editingClient.name}` : processed.altText,
        uploadedBy: 'Admin'
      });
      setEditingClient((prev) => prev ? { ...prev, logo: processed.url } : null);
      showToast('Đã tải ảnh lên thành công', 'success');
    } catch (err: any) {
      console.error('Lỗi khi tải ảnh:', err);
      showToast('Không thể xử lý ảnh, vui lòng thử lại', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleOpenAdd = () => {
    setEditingClient({
      name: '',
      logo: '/images/testimonial-1.webp',
      industry: 'Giáo dục & Đào tạo',
      status: 'active',
      website: '',
      contactPerson: '',
      phone: '',
      email: '',
      notes: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient({ ...c });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name || !editingClient?.industry) {
      showToast('Vui lòng điền tên khách hàng và lĩnh vực', 'error');
      return;
    }

    ClientsService.save(editingClient as any);
    setModalOpen(false);
    showToast('Đã lưu thông tin khách hàng thành công', 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (!canDelete) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa khách hàng', 'warning');
      return;
    }
    if (window.confirm(`Xác nhận xóa hồ sơ khách hàng "${name}"?`)) {
      ClientsService.delete(id);
      showToast('Đã xóa khách hàng', 'success');
    }
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-xs text-gray-400 mt-1">
            Hồ sơ đối tác, chuyên gia, trường học và hệ sinh thái giáo dục của Heona Media.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc lĩnh vực..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#111116] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-primary/50 placeholder:text-gray-500 transition-all"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Tổng cộng {filtered.length} khách hàng
        </span>
      </div>

      {/* Clients Table */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Khách hàng / Đối tác</th>
                <th className="py-3 px-4">Lĩnh vực</th>
                <th className="py-3 px-4">Người liên hệ</th>
                <th className="py-3 px-4">Điện thoại / Email</th>
                <th className="py-3 px-4">Ghi chú nội bộ</th>
                <th className="py-3 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-white/[0.08] shrink-0"
                      />
                      <div>
                        <p className="font-medium text-white">{c.name}</p>
                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-primary hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{c.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-300 whitespace-nowrap">
                    {c.industry}
                  </td>
                  <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                    {c.contactPerson || '—'}
                  </td>
                  <td className="py-3.5 px-4 space-y-1">
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Phone className="w-3 h-3 text-primary" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Mail className="w-3 h-3 text-primary" />
                        <span>{c.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">
                    {c.notes || '—'}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        title="Chỉnh sửa"
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Xóa"
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingClient && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="bg-[#111116] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white my-auto animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="font-semibold text-white text-base">
                {editingClient.id ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Logo / Ảnh đại diện khách hàng */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Ảnh đại diện / Logo khách hàng
                </label>
                <div className="flex items-center gap-3.5 bg-[#16161d] p-3 rounded-xl border border-white/[0.08]">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/[0.1] bg-black/40 shrink-0">
                    <img
                      src={editingClient.logo || '/images/testimonial-1.webp'}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/testimonial-1.webp';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="relative flex items-center">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={editingClient.logo || ''}
                        onChange={(e) => setEditingClient({ ...editingClient, logo: e.target.value })}
                        placeholder="Dán link ảnh (https://... hoặc /images/...)"
                        className="w-full pl-8 pr-3 py-1.5 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-2.5 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>{isUploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-lg font-medium text-[11px] transition-colors flex items-center gap-1.5 border border-white/[0.08] cursor-pointer"
                        title="Chọn từ thư viện ảnh đã tải lên"
                      >
                        <ImageIcon className="w-3 h-3 text-primary" />
                        <span>Thư viện Media</span>
                      </button>

                      {editingClient.logo && editingClient.logo !== '/images/testimonial-1.webp' && (
                        <button
                          type="button"
                          onClick={() => setEditingClient({ ...editingClient, logo: '/images/testimonial-1.webp' })}
                          className="px-2 py-1 text-gray-400 hover:text-rose-400 text-[11px] transition-colors"
                          title="Đặt lại ảnh mặc định"
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Tên Khách hàng / Chuyên gia *
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="Ví dụ: Trainer Thanh Nguyên"
                  className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] font-medium text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Lĩnh vực hoạt động *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClient.industry}
                    onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                    placeholder="Đào tạo & Kỹ năng"
                    className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Website
                  </label>
                  <input
                    type="text"
                    value={editingClient.website || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Người liên hệ
                  </label>
                  <input
                    type="text"
                    value={editingClient.contactPerson || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                    className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={editingClient.email || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                  Ghi chú nội bộ (Không hiển thị ra ngoài website)
                </label>
                <textarea
                  rows={3}
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  placeholder="Hợp đồng, tiến độ thanh toán, yêu cầu phong cách..."
                  className="w-full p-2.5 bg-[#16161d] rounded-lg border border-white/[0.08] text-gray-300 outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                >
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setEditingClient((prev) => prev ? { ...prev, logo: url } : null);
          showToast('Đã chọn ảnh từ thư viện', 'success');
        }}
        title="Chọn ảnh đại diện / Logo khách hàng"
      />
    </div>
  );
};
