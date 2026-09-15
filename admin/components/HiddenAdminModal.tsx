import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService, DEFAULT_WHITELIST_EMAILS } from '../services/auth';
import { useToast } from './Toast';
import { Role } from '../../types';
import { Lock, Mail, X, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const HiddenAdminModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('thienph.idpkey@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on Ctrl + Shift + A or Cmd + Shift + A
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
        e.preventDefault();
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          if (!location.pathname.startsWith('/admin')) {
            showToast(`Chào ${currentUser.name}, đang mở trang Quản trị...`, 'success');
            navigate('/admin');
          }
        } else {
          setIsOpen((prev) => !prev);
          setError(null);
        }
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        if (!location.pathname.startsWith('/admin')) {
          showToast(`Chào ${currentUser.name}, đang mở trang Quản trị...`, 'success');
          navigate('/admin');
        }
      } else {
        setIsOpen(true);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-admin-auth', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-admin-auth', handleCustomOpen);
    };
  }, [isOpen, location.pathname, navigate, showToast]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const res = await AuthService.loginWithGoogle();
    if (res.error) {
      setError(`Lỗi xác thực Google: ${res.error}`);
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = AuthService.login(email);
    if (res.success) {
      showToast(`Chào mừng trở lại, ${res.user?.name}!`, 'success');
      setIsOpen(false);
      navigate('/admin');
    } else {
      setError(res.error || 'Email không hợp lệ hoặc chưa được cấp quyền.');
    }
  };

  const handleQuickDemo = (role: Role) => {
    const user = AuthService.loginWithDemo(role);
    showToast(`Đăng nhập vai trò ${role.toUpperCase()}`, 'success');
    setIsOpen(false);
    navigate('/admin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Background click to close */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsOpen(false)} 
        aria-hidden="true" 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#111115] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-white z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#5a2dff] flex items-center justify-center shadow-lg shadow-primary/25">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">Quản trị Hệ thống</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                  Ctrl+Shift+A
                </span>
              </div>
              <p className="text-xs text-textMuted mt-0.5">Xác thực Google OAuth & Phân quyền bảo mật</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isGoogleLoading ? 'Đang kết nối Google...' : 'Đăng nhập bảo mật với Google'}</span>
          </button>
          <div className="flex items-center gap-1.5 mt-2 justify-center text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 size={12} />
            <span>Chỉ chấp nhận các email Google trong danh sách cấp quyền</span>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
            hoặc đăng nhập nội bộ
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Quản trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="thienph.idpkey@gmail.com"
                className="w-full pl-10 pr-4 py-2 bg-[#17171e] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary placeholder:text-gray-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-[#17171e] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary placeholder:text-gray-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 transition-all cursor-pointer"
          >
            <span>Xác thực & Mở CMS</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick Demo Access (for dev) */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" /> Môi trường thử nghiệm cục bộ
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-xl text-[10px] font-semibold text-white transition-all text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('editor')}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-xl text-[10px] font-semibold text-white transition-all text-center"
            >
              ✍️ Editor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('contributor')}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-xl text-[10px] font-semibold text-white transition-all text-center"
            >
              📝 Contrib
            </button>
          </div>
        </div>

        <div className="mt-3.5 text-center">
          <span className="text-[10px] text-gray-500">
            Bấm <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px]">Esc</kbd> hoặc click ngoài để đóng
          </span>
        </div>
      </div>
    </div>
  );
};
