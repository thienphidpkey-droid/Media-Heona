import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { Role } from '../../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@heonamedia.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('admin-mode');
      return () => {
        document.documentElement.classList.remove('admin-mode');
      };
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = AuthService.login(email);
    if (res.success) {
      showToast(`Chào mừng trở lại, ${res.user?.name}!`, 'success');
      navigate('/admin');
    } else {
      setError(res.error || 'Email không hợp lệ');
    }
  };

  const handleQuickDemo = (role: Role) => {
    const user = AuthService.loginWithDemo(role);
    showToast(`Đăng nhập thành công với vai trò ${role.toUpperCase()}`, 'success');
    navigate('/admin');
  };

  return (
    <div id="admin-root" className="admin-theme min-h-screen bg-[#0b0b0d] flex items-center justify-center p-4 selection:bg-primary selection:text-black text-white">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-black font-black text-2xl shadow-lg mb-4">
            H
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">HEONA MEDIA</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Content Operating System for Education Ecosystem
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#15151b] rounded-3xl p-8 shadow-2xl border border-white/10 text-white">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Đăng nhập Quản trị</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Nhập email hoặc chọn nhanh tài khoản kiểm thử bên dưới
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@heonamedia.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111115] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary placeholder:text-gray-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111115] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary placeholder:text-gray-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-black font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <span>Vào bảng điều khiển</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 mb-3 text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Đăng nhập nhanh 1-Click (Kiểm thử phân quyền)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="w-full p-2.5 text-left rounded-xl border border-white/10 hover:border-primary/60 bg-[#111115] hover:bg-white/[0.04] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Nguyễn Heona (Admin)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-primary/20 text-primary font-semibold rounded border border-primary/30">
                      Toàn quyền
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">admin@heonamedia.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('editor')}
                className="w-full p-2.5 text-left rounded-xl border border-white/10 hover:border-blue-500/60 bg-[#111115] hover:bg-blue-500/5 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Trần Minh (Editor)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-400 font-semibold rounded border border-blue-500/30">
                      Biên tập & Duyệt
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">editor@heonamedia.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('contributor')}
                className="w-full p-2.5 text-left rounded-xl border border-white/10 hover:border-amber-500/60 bg-[#111115] hover:bg-amber-500/5 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Lê Thảo (Contributor)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-400 font-semibold rounded border border-amber-500/30">
                      Tạo & Sửa Draft
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">contributor@heonamedia.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>© 2026 Heona Media. Xây dựng hình ảnh và nội dung cho hệ sinh thái giáo dục.</p>
        </div>
      </div>
    </div>
  );
};
