import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { CMSUser } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<CMSUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Xác thực phiên làm việc an toàn trực tiếp từ máy chủ Supabase
    AuthService.verifySession().then((verifiedUser) => {
      if (!isMounted) return;
      setUser(verifiedUser);
      setLoading(false);
    });

    const unsubscribe = AuthService.subscribe((u) => {
      if (!isMounted) return;
      setUser(u);
      setLoading(false);
    });

    // Hạn chế treo loading tối đa 3s trong trường hợp mạng chập chờn
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0b0d] text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#5a2dff] flex items-center justify-center animate-pulse mb-4 shadow-xl shadow-primary/30">
          <span className="font-black text-xl text-white">H</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3"></div>
        <p className="text-xs text-textMuted tracking-wider uppercase font-semibold">
          Đang xác thực bảo mật tài khoản...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
