import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import {
  ArticlesService,
  ProjectsService,
  LeadsService,
  MediaService,
  subscribe
} from '../services/db';
import { AuthService } from '../services/auth';
import { Article, Project, CMSUser } from '../../types';
import { useToast } from '../components/Toast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(AuthService.getCurrentUser());

  // Data states
  const [articles, setArticles] = useState<Article[]>(ArticlesService.getAll());
  const [projects, setProjects] = useState<Project[]>(ProjectsService.getAll());
  const [leads, setLeads] = useState(LeadsService.getAll());
  const [media, setMedia] = useState(MediaService.getAll());

  useEffect(() => {
    const unsubAuth = AuthService.subscribe((u) => setCurrentUser(u));
    const unsubDB = subscribe(() => {
      setArticles(ArticlesService.getAll());
      setProjects(ProjectsService.getAll());
      setLeads(LeadsService.getAll());
      setMedia(MediaService.getAll());
    });
    return () => {
      unsubAuth();
      unsubDB();
    };
  }, []);

  // Compute KPIs
  const totalArticles = articles.length;
  const totalProjects = projects.length;
  const draftCount =
    articles.filter((a) => a.status === 'draft').length +
    projects.filter((p) => p.status === 'draft').length;
  const reviewCount = articles.filter((a) => a.status === 'review').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length;

  // Actionable items: "Việc cần xử lý"
  const pendingActions = [
    ...(reviewCount > 0
      ? [
          {
            id: 'act-review',
            title: `${reviewCount} bài viết đang chờ duyệt`,
            desc: 'Cần kiểm tra văn phong, SEO và phê duyệt xuất bản lên website.',
            type: 'warning' as const,
            link: '/admin/articles?status=review'
          }
        ]
      : []),
    ...(newLeadsCount > 0
      ? [
          {
            id: 'act-lead',
            title: `${newLeadsCount} khách hàng tiềm năng (Leads) mới chưa liên hệ`,
            desc: 'Các đơn vị giáo dục vừa để lại thông tin cần liên hệ tư vấn ngay.',
            type: 'alert' as const,
            link: '/admin/leads'
          }
        ]
      : []),
    ...(projects.filter((p) => !p.image || p.image.includes('placeholder')).length > 0
      ? [
          {
            id: 'act-proj-thumb',
            title: `${projects.filter((p) => !p.image).length} dự án chưa có ảnh bìa chuẩn`,
            desc: 'Cần cập nhật ảnh bìa chất lượng cao để tăng uy tín case study.',
            type: 'info' as const,
            link: '/admin/projects'
          }
        ]
      : []),
    ...(media.filter((m) => !m.altText).length > 0
      ? [
          {
            id: 'act-media-alt',
            title: `${media.filter((m) => !m.altText).length} hình ảnh chưa có thẻ ALT text`,
            desc: 'Bổ sung ALT text để cải thiện thứ hạng tìm kiếm hình ảnh trên Google.',
            type: 'info' as const,
            link: '/admin/media'
          }
        ]
      : [])
  ];

  // Recent content
  const recentArticles = articles.slice(0, 4).map((a) => ({
    id: a.id,
    type: 'Bài viết' as const,
    title: a.title,
    thumbnail: a.thumbnail,
    author: a.author,
    status: a.status,
    updatedAt: a.updatedAt,
    editUrl: `/admin/articles/${a.id}`,
    previewUrl: `/blog/${a.slug}`
  }));

  const recentProjects = projects.slice(0, 3).map((p) => ({
    id: p.id,
    type: 'Dự án' as const,
    title: p.title,
    thumbnail: p.image,
    author: p.clientName || 'Heona Media',
    status: (p.status || 'published') as any,
    updatedAt: p.updatedAt || '2026-09-14',
    editUrl: `/admin/projects/${p.id}`,
    previewUrl: `/projects`
  }));

  const recentContent = [...recentArticles, ...recentProjects];

  const handleDeleteItem = (id: string | number, type: 'Bài viết' | 'Dự án') => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${type} này?`)) {
      if (type === 'Bài viết') {
        ArticlesService.delete(id);
      } else {
        ProjectsService.delete(id);
      }
      showToast(`Đã xóa ${type.toLowerCase()} thành công`, 'success');
    }
  };

  const handleDuplicateArticle = (id: string | number) => {
    const res = ArticlesService.duplicate(id);
    if (res) {
      showToast('Đã nhân bản bài viết thành công!', 'success');
      navigate(`/admin/articles/${res.id}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Xin chào, {currentUser?.name || 'Heona Admin'} 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Chào mừng bạn đến với Heona Content OS. Dưới đây là bức tranh tổng quan hoạt động hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Hệ thống trực tuyến
          </span>
        </div>
      </div>



      {/* Actionable Alerts: Việc cần xử lý */}
      {pendingActions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Việc cần xử lý ngay ({pendingActions.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="p-4 rounded-xl border border-white/[0.06] bg-[#111116] hover:border-white/[0.15] transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-xs font-semibold text-white">{action.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{action.desc}</p>
                </div>
                <button
                  onClick={() => navigate(action.link)}
                  className="px-3.5 py-1.5 bg-primary text-black text-[11px] font-semibold rounded-lg hover:bg-primary/90 transition-all shrink-0 flex items-center gap-1 active:scale-95 shadow-sm"
                >
                  <span>Xử lý</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Content Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Nội dung gần đây</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Danh sách bài viết và case study vừa được cập nhật
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/articles')}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Nội dung</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Tác giả / Khách hàng</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày cập nhật</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
                {recentContent.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/[0.08] shrink-0"
                        />
                        <span className="font-medium text-white max-w-sm truncate line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.type === 'Bài viết'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">{item.author}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                          item.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : item.status === 'review'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : item.status === 'scheduled'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                            : 'bg-white/5 text-gray-400 border border-white/[0.08]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">{item.updatedAt}</td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(item.editUrl)}
                          title="Chỉnh sửa"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={item.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Xem trước"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {item.type === 'Bài viết' && (
                          <button
                            onClick={() => handleDuplicateArticle(item.id)}
                            title="Nhân bản"
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteItem(item.id, item.type)}
                          title="Xóa"
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
