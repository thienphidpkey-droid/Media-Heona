import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Image as ImageIcon,
  UserCheck,
  Search,
  Bell,
  ExternalLink,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { AuthService } from '../../services/auth';
import { NotificationService, ArticlesService, ProjectsService, ClientsService } from '../../services/db';
import { CMSUser } from '../../../types';
import { useToast } from '../Toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(AuthService.getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = NotificationService.getAll();
  const unreadCount = NotificationService.getUnreadCount();

  useEffect(() => {
    const unsub = AuthService.subscribe((u) => setCurrentUser(u));
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('admin-mode');
    }
    return () => {
      unsub();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('admin-mode');
      }
    };
  }, []);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setNotifOpen(false);
        setCreateMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    showToast('Đã đăng xuất khỏi hệ thống', 'info');
    navigate('/');
  };

  // Search matches
  const articleMatches = searchQuery.trim()
    ? ArticlesService.getAll().filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const projectMatches = searchQuery.trim()
    ? ProjectsService.getAll().filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const clientMatches = searchQuery.trim()
    ? ClientsService.getAll().filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navGroups = [
    {
      label: '',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { label: 'Bài viết', icon: FileText, href: '/admin/articles' },
        { label: 'Dịch vụ', icon: Layers, href: '/admin/services' },
        { label: 'Tất cả dự án', icon: Briefcase, href: '/admin/projects' },
        { label: 'Khách hàng', icon: Users, href: '/admin/clients' },
        { label: 'Thư viện Media', icon: ImageIcon, href: '/admin/media' },
        { label: 'Hộp thư', icon: UserCheck, href: '/admin/leads' },
        { label: 'Admin Roles', icon: Users, href: '/admin/users' }
      ]
    }
  ];

  return (
    <div id="admin-root" className="admin-theme min-h-screen bg-[#0b0b0d] flex flex-col font-sans text-[#f4f4f6] selection:bg-primary selection:text-white antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-[#111115]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden rounded-lg hover:bg-white/5"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-white text-sm">HEONA MEDIA</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Content Operating System</p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>Tìm kiếm bài viết, dự án, khách hàng...</span>
            </div>
            <kbd className="text-[10px] font-semibold bg-white/10 border border-white/15 px-1.5 py-0.5 rounded text-gray-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span>Xem website</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Tạo mới</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {createMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCreateMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#15151b] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-fade-in text-xs font-medium text-gray-300">
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate('/admin/articles/new');
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/5 text-gray-200 hover:text-white"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Bài viết mới</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate('/admin/projects/new');
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/5 text-gray-200 hover:text-white"
                  >
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Dự án / Case Study</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate('/admin/services/new');
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/5 text-gray-200 hover:text-white"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Dịch vụ mới</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate('/admin/clients');
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/5 text-gray-200 hover:text-white"
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Khách hàng mới</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate('/admin/media');
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/5 text-gray-200 hover:text-white"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Upload Media</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#111115]"></span>
              )}
            </button>

            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#15151b] rounded-2xl shadow-2xl border border-white/10 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">Thông báo</h4>
                      {unreadCount > 0 && (
                        <span className="bg-rose-500/20 text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        NotificationService.markAllRead();
                        showToast('Đã đánh dấu đọc tất cả', 'info');
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Đọc tất cả
                    </button>
                  </div>
                  <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.link) navigate(n.link);
                          setNotifOpen(false);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${
                          n.read ? 'hover:bg-white/5 text-gray-400' : 'bg-primary/10 hover:bg-primary/15 text-gray-200'
                        }`}
                      >
                        <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-gray-300 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">{n.createdAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile & Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </p>
                <span className="text-[10px] font-medium text-gray-400 capitalize">
                  {currentUser?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#15151b] rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white">{currentUser?.name}</p>
                    <p className="text-[11px] text-gray-400">{currentUser?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 capitalize">
                      Vai trò: {currentUser?.role}
                    </span>
                  </div>

                  <div className="pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Area with Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-[#111115] border-r border-white/10 h-full shadow-2xl flex flex-col justify-between p-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">
                    H
                  </div>
                  <span className="font-black text-white text-xs">HEONA MEDIA OS</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    {group.label && (
                      <p className="px-3 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                        {group.label}
                      </p>
                    )}
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === '/admin'
                          ? location.pathname === '/admin'
                          : location.pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-lg shadow-primary/25'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-gray-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* Desktop Sidebar: 256px fixed column, Dark background, always in document flow */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#111115] border-r border-white/10 sticky top-16 h-[calc(100vh-4rem)] justify-between z-10">
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {group.label && (
                  <p className="px-3 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* System Info in Sidebar Bottom */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02] m-3 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-gray-300">Heona CMS Hybrid</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Dữ liệu tự động đồng bộ thời gian thực với Website chính.
            </p>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 bg-[#0b0b0d] p-4 md:px-8 md:py-5 text-[#f4f4f6]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15151b] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-white/10 text-white">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm bài viết, dự án, đối tác... (Nhập ít nhất 2 ký tự)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-white placeholder:text-gray-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/10"
              >
                ESC
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {searchQuery.trim().length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  Nhập từ khóa để tìm kiếm nhanh trên toàn bộ hệ sinh thái Heona Media.
                </div>
              ) : (
                <>
                  {/* Articles */}
                  {articleMatches.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Bài viết ({articleMatches.length})
                      </p>
                      <div className="space-y-1">
                        {articleMatches.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(`/admin/articles/${a.id}`);
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-gray-200 truncate">
                              {a.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">
                              {a.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {projectMatches.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Dự án / Case Study ({projectMatches.length})
                      </p>
                      <div className="space-y-1">
                        {projectMatches.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(`/admin/projects/${p.id}`);
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-gray-200 truncate">
                              {p.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold">
                              {p.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clients */}
                  {clientMatches.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Khách hàng ({clientMatches.length})
                      </p>
                      <div className="space-y-1">
                        {clientMatches.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate('/admin/clients');
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-gray-200">{c.name}</span>
                            <span className="text-[10px] text-gray-400">{c.industry}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {articleMatches.length === 0 &&
                    projectMatches.length === 0 &&
                    clientMatches.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-500">
                        Không tìm thấy kết quả nào khớp với "{searchQuery}".
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
