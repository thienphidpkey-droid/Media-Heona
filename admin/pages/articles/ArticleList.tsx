import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import { ArticlesService, subscribe } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Article, ContentStatus } from '../../../types';
import { useToast } from '../../components/Toast';

export const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [articles, setArticles] = useState<Article[]>(ArticlesService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'all');
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  const canPublish = AuthService.canPublish();
  const canDelete = AuthService.canDelete();

  useEffect(() => {
    const unsub = subscribe(() => setArticles(ArticlesService.getAll()));
    return () => unsub();
  }, []);

  const categories = ['All', 'Expert Spotlight', 'School Story', 'Event to Content', 'Checklist', 'Chi phí', 'Thiết bị'];
  const statusTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'published', label: 'Published' },
    { id: 'review', label: 'Chờ duyệt' },
    { id: 'draft', label: 'Draft' },
    { id: 'scheduled', label: 'Đã lên lịch' },
    { id: 'archived', label: 'Lưu trữ' }
  ];

  // Filtering
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = () => {
    if (!canPublish) {
      showToast('Bạn không có quyền xuất bản nội dung (yêu cầu Editor hoặc Admin)', 'warning');
      return;
    }
    selectedIds.forEach((id) => ArticlesService.updateStatus(id, 'published'));
    showToast(`Đã xuất bản ${selectedIds.length} bài viết`, 'success');
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    selectedIds.forEach((id) => ArticlesService.updateStatus(id, 'archived'));
    showToast(`Đã chuyển ${selectedIds.length} bài viết vào lưu trữ`, 'info');
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (!canDelete) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa bài viết', 'warning');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} bài viết đã chọn?`)) {
      selectedIds.forEach((id) => ArticlesService.delete(id));
      showToast(`Đã xóa ${selectedIds.length} bài viết`, 'success');
      setSelectedIds([]);
    }
  };

  const handleDelete = (id: string | number, title: string) => {
    if (!canDelete) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa bài viết', 'warning');
      return;
    }
    if (window.confirm(`Xác nhận xóa bài viết: "${title}"?`)) {
      ArticlesService.delete(id);
      showToast('Đã xóa bài viết thành công', 'success');
    }
  };

  const handleDuplicate = (id: string | number) => {
    const duplicated = ArticlesService.duplicate(id);
    if (duplicated) {
      showToast('Đã nhân bản bài viết', 'success');
      navigate(`/admin/articles/${duplicated.id}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Quản lý Bài viết</h1>
        </div>

        <button
          onClick={() => navigate('/admin/articles/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/25 active:scale-95"
        >
          <Plus className="w-4 h-4 text-white stroke-[3]" />
          <span>Tạo bài viết mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
        {statusTabs.map((tab) => {
          const count =
            tab.id === 'all'
              ? articles.length
              : articles.filter((a) => a.status === tab.id).length;
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStatus(tab.id);
                setSearchParams(tab.id === 'all' ? {} : { status: tab.id });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#111116] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-black font-semibold shadow-xs'
                  : 'bg-[#111116] text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#16161d] text-white rounded-xl border border-primary/30 flex items-center justify-between shadow-lg animate-fade-in text-xs font-semibold">
          <div className="flex items-center gap-2 pl-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span>Đã chọn {selectedIds.length} bài viết</span>
          </div>
          <div className="flex items-center gap-2">
            {canPublish && (
              <button
                onClick={handleBulkPublish}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white"
              >
                Xuất bản
              </button>
            )}
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-gray-200"
            >
              Lưu trữ
            </button>
            {canDelete && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors text-white"
              >
                Xóa đã chọn
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Content or Empty State */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] text-gray-400 flex items-center justify-center mx-auto mb-3 border border-white/[0.06]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">Chưa có bài viết nào</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại. Bắt đầu tạo bài viết đầu tiên ngay!
            </p>
            <button
              onClick={() => navigate('/admin/articles/new')}
              className="mt-4 px-3.5 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              Tạo bài viết đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-gray-400 hover:text-white">
                      {selectedIds.length === filteredArticles.length && filteredArticles.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Bài viết</th>
                  <th className="py-3 px-4">Chuyên mục</th>
                  <th className="py-3 px-4">Tác giả</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Lượt xem</th>
                  <th className="py-3 px-4">Ngày xuất bản</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
                {filteredArticles.map((article) => {
                  const isSelected = selectedIds.includes(article.id);
                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(article.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/[0.08] shrink-0"
                          />
                          <div>
                            <p
                              onClick={() => navigate(`/admin/articles/${article.id}`)}
                              className="font-medium text-white line-clamp-1 hover:text-primary cursor-pointer transition-colors"
                            >
                              {article.title}
                            </p>
                            <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                              {article.shortDesc}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/[0.06]">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">{article.author}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap ${
                            article.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                              : article.status === 'review'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                              : article.status === 'scheduled'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                              : 'bg-white/5 text-gray-400 border border-white/[0.08]'
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5" title="Lượt xem thực tế từ người đọc">
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          <span className={article.views > 0 ? 'text-emerald-400 font-semibold' : 'text-gray-400'}>
                            {(article.views || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap text-[11px]">
                        {article.publishedAt || article.createdAt}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/articles/${article.id}`)}
                            title="Chỉnh sửa"
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Xem trên website"
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDuplicate(article.id)}
                            title="Nhân bản"
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              title="Xóa"
                              className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
