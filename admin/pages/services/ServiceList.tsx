import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Eye,
  Check,
  AlertCircle,
  HelpCircle,
  Zap,
  ArrowUpDown
} from 'lucide-react';
import { ServicesService, subscribe } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Service, ContentStatus } from '../../../types';
import { useToast } from '../../components/Toast';

export const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>(ServicesService.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'home' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const canPublish = AuthService.canPublish();
  const canDelete = AuthService.canDelete();

  useEffect(() => {
    const unsub = subscribe(() => {
      setServices(ServicesService.getAll());
    });
    return () => unsub();
  }, []);

  // Filtered list
  const filtered = services.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tag.toLowerCase().includes(search.toLowerCase()) ||
      (s.subTitle && s.subTitle.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    if (statusFilter === 'home') return s.highlight !== false && s.status === 'published';
    if (statusFilter === 'published') return s.status === 'published';
    if (statusFilter === 'draft') return s.status === 'draft';
    return true;
  });

  // Stats
  const totalCount = services.length;
  const publishedCount = services.filter((s) => s.status === 'published').length;
  const homeHighlightCount = services.filter((s) => s.highlight !== false && s.status === 'published').length;
  const draftCount = services.filter((s) => s.status === 'draft').length;

  const handleToggleHighlight = (service: Service) => {
    if (!canPublish) {
      showToast('Bạn không có quyền chỉnh sửa hiển thị trang chủ', 'error');
      return;
    }
    const updated = ServicesService.toggleHighlight(service.id);
    if (updated) {
      showToast(
        updated.highlight
          ? `Đã ghim "${updated.title}" vào Dịch vụ trọng tâm Trang chủ!`
          : `Đã bỏ ghim "${updated.title}" khỏi Trang chủ.`,
        'success'
      );
    }
  };

  const handleDuplicate = (service: Service) => {
    const duplicated = ServicesService.duplicate(service.id);
    if (duplicated) {
      showToast(`Đã sao chép thành "${duplicated.title}"`, 'success');
      navigate(`/admin/services/${duplicated.id}`);
    }
  };

  const handleDelete = (id: string) => {
    if (!canDelete) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa dịch vụ', 'error');
      setDeleteConfirmId(null);
      return;
    }
    const success = ServicesService.delete(id);
    if (success) {
      showToast('Đã xóa dịch vụ thành công', 'success');
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Heona Services OS
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-primary" />
            <span>Quản Lý Dịch Vụ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Cấu hình các gói dịch vụ, tính năng & đồng bộ trực tiếp với mục <strong className="text-white">Dịch vụ trọng tâm</strong> ở Trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Xem Trang Chủ</span>
          </Link>
          <Link
            to="/admin/services/new"
            className="px-5 py-2.5 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm Dịch Vụ Mới</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên dịch vụ, gói, phân loại..."
            className="w-full bg-[#111116] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `Tất cả (${totalCount})` },
            { id: 'home', label: `Ghim Trang Chủ (${homeHighlightCount})`, icon: Sparkles },
            { id: 'published', label: `Xuất bản (${publishedCount})` },
            { id: 'draft', label: `Bản nháp (${draftCount})` }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-black font-semibold shadow-xs'
                    : 'text-gray-400 hover:text-white bg-[#111116] border border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((service) => {
          const isPublished = service.status === 'published';
          const isHighlighted = service.highlight !== false;

          return (
            <div
              key={service.id}
              className={`bg-[#111116] rounded-xl border transition-all duration-300 flex flex-col overflow-hidden group hover:border-white/[0.15] ${
                isHighlighted ? 'border-primary/30 ring-1 ring-primary/20' : 'border-white/[0.06]'
              }`}
            >
              {/* Card Top Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-[#0d0d11]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-[#111116]/30 to-transparent" />

                {/* Left Tag Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    {service.tag}
                  </span>
                  {service.order && (
                    <span className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[10px] font-mono text-gray-300">
                      #{service.order}
                    </span>
                  )}
                </div>

                {/* Right Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isPublished ? 'Đang hiển thị' : 'Bản nháp'}
                  </span>
                </div>

                {/* Bottom Highlight Indicator */}
                {isHighlighted && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[10px] font-bold shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>Dịch vụ trọng tâm Trang chủ</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                    {service.title}
                  </h3>
                  {service.subTitle && (
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {service.subTitle}
                    </p>
                  )}

                  {/* Features Preview */}
                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                      <span className="font-semibold text-gray-300">Đặc điểm / Hạng mục:</span>
                      <span className="font-mono text-primary">{service.features?.length || 0} mục</span>
                    </div>
                    <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {service.features?.slice(0, 4).map((feat, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <Zap className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                      {(service.features?.length || 0) > 4 && (
                        <li className="text-[11px] text-gray-500 italic pl-5">
                          + thêm {(service.features?.length || 0) - 4} hạng mục khác...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Actions & Home Switch */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  {/* Home Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleHighlight(service)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                      isHighlighted
                        ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                        : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hiển thị Trang chủ</span>
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isHighlighted ? 'bg-primary text-black' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {isHighlighted ? 'BẬT' : 'TẮT'}
                    </span>
                  </button>

                  {/* Buttons Action Group */}
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/admin/services/${service.id}`}
                      className="flex-1 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-medium rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 border border-white/[0.08]"
                    >
                      <Edit className="w-3.5 h-3.5 text-primary" />
                      <span>Chỉnh sửa</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(service)}
                      title="Nhân bản dịch vụ"
                      className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white rounded-lg border border-white/[0.08] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === service.id ? (
                      <div className="flex items-center gap-1 bg-rose-500/20 p-1 rounded-xl border border-rose-500/30 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => handleDelete(service.id)}
                          className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-lg hover:bg-rose-600"
                        >
                          Xóa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-[10px] rounded-lg hover:text-white"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(service.id)}
                        title="Xóa dịch vụ"
                        className="p-2 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-[#15151b] rounded-3xl border border-white/10">
          <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Không tìm thấy dịch vụ nào</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Không có dịch vụ phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm từ khóa khác hoặc bấm tạo dịch vụ mới.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
