import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Sparkles,
  Layers,
  TrendingUp,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ProjectsService, subscribe } from '../../services/db';
import { AuthService } from '../../services/auth';
import { Project } from '../../../types';
import { useToast } from '../../components/Toast';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<Project[]>(ProjectsService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCat = searchParams.get('cat') || 'All';

  const canDelete = AuthService.canDelete();

  useEffect(() => {
    const unsub = subscribe(() => setProjects(ProjectsService.getAll()));
    return () => unsub();
  }, []);

  const categories = [
    { id: 'All', label: 'Tất cả dự án', icon: Briefcase },
    { id: 'Expert Spotlight', label: 'Expert Spotlight', icon: Sparkles },
    { id: 'School Story', label: 'School Story', icon: Layers },
    { id: 'Event to Content', label: 'Event to Content', icon: TrendingUp }
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string | number, title: string) => {
    if (!canDelete) {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa dự án', 'warning');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa case study "${title}"?`)) {
      ProjectsService.delete(id);
      showToast('Đã xóa dự án thành công', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quản lý Dự án / Case Study
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Hồ sơ năng lực thực chiến theo 3 nhóm dịch vụ mũi nhọn của Heona Media.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/projects/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tạo dự án mới</span>
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count =
            cat.id === 'All'
              ? projects.length
              : projects.filter((p) => p.category === cat.id).length;
          const isActive = selectedCat === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSearchParams(cat.id === 'All' ? {} : { cat: cat.id })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-black shadow-xs'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : ''}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isActive ? 'bg-black/20 text-black' : 'bg-white/[0.06] text-gray-500'
              }`}>{count}</span>
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
            placeholder="Tìm theo tên dự án hoặc tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#111116] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-primary/50 placeholder:text-gray-500 transition-all"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Hiển thị {filteredProjects.length} dự án
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] text-gray-400 flex items-center justify-center mx-auto mb-3 border border-white/[0.06]">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">Chưa có dự án nào</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Không tìm thấy case study nào trong danh mục này. Hãy tạo case study đầu tiên!
            </p>
            <button
              onClick={() => navigate('/admin/projects/new')}
              className="mt-4 px-3.5 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              Tạo dự án mới
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Dự án</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Nhóm dịch vụ</th>
                  <th className="py-3 px-4">Các dịch vụ Heona đã làm</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/[0.08] shrink-0"
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/admin/projects/${proj.id}`)}
                            className="font-medium text-white line-clamp-1 hover:text-primary cursor-pointer transition-colors"
                          >
                            {proj.title}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                            {proj.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                      {proj.clientName || 'Heona Partners'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.services?.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/[0.06]"
                          >
                            {s}
                          </span>
                        ))}
                        {(proj.services?.length || 0) > 3 && (
                          <span className="text-[9px] text-gray-500">
                            +{(proj.services?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap ${
                          proj.status === 'draft'
                            ? 'bg-white/5 text-gray-400 border border-white/[0.08]'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        }`}
                      >
                        {proj.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/admin/projects/${proj.id}`)}
                          title="Chỉnh sửa"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href="/projects"
                          target="_blank"
                          rel="noreferrer"
                          title="Xem trên website"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(proj.id, proj.title)}
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
        )}
      </div>
    </div>
  );
};
