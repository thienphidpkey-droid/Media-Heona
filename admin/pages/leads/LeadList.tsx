import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Eye,
  X,
  Building2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { LeadsService, subscribe } from '../../services/db';
import { Lead, LeadStatus } from '../../../types';
import { useToast } from '../../components/Toast';

export const LeadList: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(LeadsService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | 'message' | null>(null);

  useEffect(() => {
    const unsub = subscribe(() => {
      const all = LeadsService.getAll();
      setLeads(all);
      // Cập nhật activeLead nếu đang mở
      if (activeLead) {
        const found = all.find((item) => item.id === activeLead.id);
        if (found) setActiveLead(found);
      }
    });
    return () => unsub();
  }, [activeLead]);

  // Sync notes when activeLead changes
  useEffect(() => {
    if (activeLead) {
      setNotesInput(activeLead.notes || '');
      setCopiedField(null);
    }
  }, [activeLead?.id]);

  // Lock body scroll & ESC key support for Modal
  useEffect(() => {
    if (!activeLead) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLead(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeLead]);

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string }> = {
    New: { label: 'Mới', badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    Contacted: { label: 'Đã liên hệ', badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    Qualified: { label: 'Tiềm năng', badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    Proposal: { label: 'Báo giá', badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    Won: { label: 'Chốt hợp đồng', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    Lost: { label: 'Đã hủy', badgeClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    return LEAD_STATUS_CONFIG[status]?.badgeClass || 'bg-white/10 text-gray-400 border-white/10';
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    const updated = LeadsService.updateStatus(id, status);
    if (updated && activeLead?.id === id) {
      setActiveLead({ ...updated });
    }
    const label = LEAD_STATUS_CONFIG[status]?.label || status;
    showToast(`Đã chuyển trạng thái lead sang: "${label}"`, 'success');
  };

  const handleSaveNotes = () => {
    if (!activeLead) return;
    const updated = LeadsService.updateStatus(activeLead.id, activeLead.status, notesInput);
    if (updated) {
      setActiveLead({ ...updated });
    }
    showToast('Đã lưu ghi chú liên hệ thành công', 'success');
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa lead của "${name}" khỏi CRM không?`)) {
      LeadsService.delete(id);
      if (activeLead?.id === id) {
        setActiveLead(null);
      }
      showToast('Đã xóa lead thành công', 'success');
    }
  };

  const copyToClipboard = (text: string, field: 'phone' | 'email' | 'message') => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép ${field === 'phone' ? 'SĐT' : field === 'email' ? 'Email' : 'nội dung tin nhắn'}`, 'info');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.message && l.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = selectedStatus === 'all' || l.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Quản lý Khách hàng Tiềm năng (Leads CRM)</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              {leads.length} leads
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Tổng hợp dữ liệu khách hàng gửi liên hệ, yêu cầu báo giá từ form website hoặc landing page.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-primary text-black font-extrabold shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>Tất cả leads</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedStatus === 'all' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
            }`}
          >
            {leads.length}
          </span>
        </button>
        {statuses.map((st) => {
          const count = leads.filter((l) => l.status === st).length;
          const isActive = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-black font-extrabold shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{LEAD_STATUS_CONFIG[st].label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email, lời nhắn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#111116] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-primary/50 placeholder:text-gray-500 transition-all"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          {filtered.length} lead hiển thị
        </span>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Họ tên khách hàng</th>
                <th className="py-3 px-4">Đơn vị / Trường học</th>
                <th className="py-3 px-4">Dịch vụ quan tâm</th>
                <th className="py-3 px-4">Nội dung tin nhắn</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-xs">
                    Không tìm thấy lead nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setActiveLead(l)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    title="Bấm vào để xem toàn bộ chi tiết tin nhắn và thông tin khách hàng"
                  >
                    <td className="py-3.5 px-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white group-hover:text-primary transition-colors">
                            {l.name}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1 text-[11px]">
                          <span className="font-mono text-gray-300 whitespace-nowrap">
                            {l.phone}
                          </span>
                          <span className="text-gray-400 truncate max-w-[220px]">
                            {l.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{l.company || 'Cá nhân'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {l.serviceInterested || 'Tư vấn chung'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                          {l.message}
                        </p>
                        <span className="text-[10px] text-primary/80 font-medium group-hover:underline flex items-center gap-1 mt-0.5">
                          <Eye className="w-3 h-3" /> Xem đầy đủ
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={l.status}
                        onChange={(e) => handleUpdateStatus(l.id, e.target.value as LeadStatus)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full outline-none border cursor-pointer transition-all ${getStatusBadgeClass(
                          l.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option className="bg-[#111116] text-white py-1" key={st} value={st}>
                            {LEAD_STATUS_CONFIG[st].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                      {l.createdAt}
                    </td>
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveLead(l)}
                          title="Xem chi tiết tin nhắn & Lead"
                          className="p-1.5 text-primary hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${l.phone}`}
                          title="Gọi điện thoại"
                          className="p-1.5 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${l.email}`}
                          title="Gửi email"
                          className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteLead(l.id, l.name)}
                          title="Xóa Lead này"
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chi tiết Khách hàng & Nội dung Tin nhắn Modal */}
      {activeLead &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveLead(null);
            }}
          >
            <div className="bg-[#111116] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-white my-auto animate-fade-in overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-white/[0.06] flex items-start justify-between gap-4 bg-[#111116]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Chi tiết Yêu cầu từ Khách hàng
                    </h2>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                        activeLead.status
                      )}`}
                    >
                      {LEAD_STATUS_CONFIG[activeLead.status]?.label || activeLead.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3.5 h-3.5" /> {activeLead.createdAt}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">
                      Nguồn:{' '}
                      <span className="text-primary font-medium">
                        {activeLead.sourcePage || 'Trang Liên hệ (/contact)'}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                  title="Đóng (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Thông tin người liên hệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cột 1: Thông tin cá nhân & Công ty */}
                  <div className="bg-[#16161d] border border-white/[0.06] rounded-xl p-4 space-y-3">
                    <div className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">
                      Người gửi liên hệ
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{activeLead.name}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span>Đơn vị: {activeLead.company || 'Cá nhân tự do'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06]">
                      <div className="text-[10px] text-gray-400 mb-1">Dịch vụ quan tâm:</div>
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {activeLead.serviceInterested || 'Tư vấn truyền thông & sự kiện'}
                      </span>
                    </div>
                  </div>

                  {/* Cột 2: Kênh liên lạc & Kết nối */}
                  <div className="bg-[#16161d] border border-white/[0.06] rounded-xl p-4 space-y-3">
                    <div className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">
                      Thông tin liên lạc
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono text-xs font-semibold text-white">
                          {activeLead.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(activeLead.phone, 'phone')}
                          title="Sao chép SĐT"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          {copiedField === 'phone' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={`tel:${activeLead.phone}`}
                          title="Bấm gọi ngay"
                          className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                        >
                          Gọi
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs font-normal text-white truncate">
                          {activeLead.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(activeLead.email, 'email')}
                          title="Sao chép Email"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          {copiedField === 'email' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={`mailto:${activeLead.email}`}
                          title="Gửi email"
                          className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-semibold text-[11px] hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                        >
                          Gửi mail
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toàn bộ nội dung tin nhắn của khách hàng */}
                <div className="bg-[#16161d] border border-primary/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Nội dung lời nhắn / Yêu cầu chi tiết:</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(activeLead.message, 'message')}
                      className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 hover:bg-white/[0.06] px-2 py-1 rounded-lg transition-colors"
                    >
                      {copiedField === 'message' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép lời nhắn</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.04] text-xs text-gray-200 leading-relaxed whitespace-pre-wrap select-text font-normal font-sans">
                    {activeLead.message || '(Khách hàng không để lại tin nhắn cụ thể)'}
                  </div>
                </div>

                {/* Chuyển trạng thái Lead */}
                <div className="bg-[#16161d] border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <div className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">
                    Cập nhật trạng thái xử lý:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {statuses.map((st) => {
                      const isCurr = activeLead.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(activeLead.id, st)}
                          className={`py-1.5 px-2.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            isCurr
                              ? 'bg-primary text-black shadow-xs'
                              : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]'
                          }`}
                        >
                          {isCurr && <Check className="w-3 h-3 text-black" />}
                          <span>{LEAD_STATUS_CONFIG[st].label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ghi chú nội bộ dành cho đội ngũ Sale / CSKH */}
                <div className="bg-[#16161d] border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">
                      Ghi chú nội bộ (Đội ngũ chăm sóc khách hàng)
                    </div>
                    <span className="text-[10px] text-gray-500">Chỉ nhân sự nội bộ nhìn thấy</span>
                  </div>

                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Nhập ghi chú sau khi gọi điện/trao đổi với khách hàng..."
                    className="w-full p-3 bg-[#111116] rounded-lg border border-white/[0.08] text-xs text-white outline-none focus:border-primary/50 placeholder:text-gray-600 transition-all leading-relaxed"
                  />

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 text-xs font-semibold text-black bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                    >
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-white/[0.06] flex items-center justify-between bg-[#111116]">
                <button
                  type="button"
                  onClick={() => handleDeleteLead(activeLead.id, activeLead.name)}
                  className="text-xs text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa lead</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveLead(null)}
                    className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    Đóng (ESC)
                  </button>
                  <a
                    href={`tel:${activeLead.phone}`}
                    className="px-4 py-1.5 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {activeLead.name.split(' ').pop()}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
