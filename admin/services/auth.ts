import { CMSUser, Role } from '../../types';
import { UsersService } from './db';
import { supabase } from './supabase';

const AUTH_STORAGE_KEY = 'heona_cms_current_user';

// Danh sách Email Quản trị viên được phép truy cập (Whitelist)
export const DEFAULT_WHITELIST_EMAILS = [
  'thienph.idpkey@gmail.com',
  'admin@heonamedia.com',
  'heonamedia@gmail.com'
];

export function getAllowedAdminEmails(): string[] {
  if (typeof window === 'undefined') return DEFAULT_WHITELIST_EMAILS;
  try {
    const envEmails = (import.meta as any).env?.VITE_ADMIN_WHITELIST_EMAILS;
    if (envEmails) {
      const list = envEmails.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean);
      return Array.from(new Set([...DEFAULT_WHITELIST_EMAILS, ...list]));
    }
  } catch {}
  return DEFAULT_WHITELIST_EMAILS;
}

type AuthListener = (user: CMSUser | null) => void;
const authListeners = new Set<AuthListener>();

let isAuthInitialized = false;

export const AuthService = {
  isEmailAllowed(email?: string | null): boolean {
    if (!email) return false;
    const allowed = getAllowedAdminEmails();
    return allowed.some((a) => a.toLowerCase() === email.trim().toLowerCase());
  },

  getCurrentUser(): CMSUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: CMSUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    authListeners.forEach((fn) => fn(user));
  },

  subscribe(fn: AuthListener) {
    authListeners.add(fn);
    return () => {
      authListeners.delete(fn);
    };
  },

  // Đăng nhập bảo mật qua Google OAuth (Supabase Auth)
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Môi trường trình duyệt không hỗ trợ' };
    }
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Không thể kết nối dịch vụ Google Auth' };
    }
  },

  // Xử lý thông tin user trả về từ Supabase
  handleSupabaseUser(sbUser: any): { success: boolean; error?: string } {
    const email = sbUser?.email?.toLowerCase();
    if (!email) {
      return { success: false, error: 'Không tìm thấy địa chỉ email trong tài khoản Google.' };
    }

    // Kiểm tra Whitelist
    if (!this.isEmailAllowed(email)) {
      console.warn(`[Auth Whitelist Blocked]: Email ${email} không có trong danh sách cho phép.`);
      this.logout();
      return {
        success: false,
        error: `Tài khoản ${email} chưa được cấp quyền quản trị viên. Vui lòng liên hệ Admin Heona Media.`
      };
    }

    const name = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0];
    const avatar = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture;

    const cmsUser: CMSUser = {
      id: sbUser.id,
      name,
      email,
      avatar,
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16),
      createdAt: sbUser.created_at || new Date().toISOString().slice(0, 10)
    };

    this.setCurrentUser(cmsUser);
    return { success: true };
  },

  // Khởi tạo listener theo dõi trạng thái Supabase Session
  initSupabaseAuth(): void {
    if (typeof window === 'undefined' || isAuthInitialized) return;
    isAuthInitialized = true;

    // Kiểm tra phiên làm việc hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.handleSupabaseUser(session.user);
      }
    });

    // Lắng nghe thay đổi đăng nhập / đăng xuất
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.handleSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.setCurrentUser(null);
      }
    });
  },

  loginWithDemo(role: Role): CMSUser {
    const users = UsersService.getAll();
    const matched = users.find((u) => u.role === role) || users[0];
    matched.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.setCurrentUser(matched);
    return matched;
  },

  login(email: string): { success: boolean; user?: CMSUser; error?: string } {
    if (!this.isEmailAllowed(email)) {
      return {
        success: false,
        error: `Email ${email} chưa được cấp quyền truy cập hệ thống quản trị.`
      };
    }
    const users = UsersService.getAll();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Email không tồn tại trong danh sách tài khoản.' };
    }
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.setCurrentUser(user);
    return { success: true, user };
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    this.setCurrentUser(null);
  },

  // Permissions helpers
  canPublish(role?: Role): boolean {
    const r = role || this.getCurrentUser()?.role;
    return r === 'admin' || r === 'editor';
  },

  canDelete(role?: Role): boolean {
    const r = role || this.getCurrentUser()?.role;
    return r === 'admin';
  },

  canManageUsers(role?: Role): boolean {
    const r = role || this.getCurrentUser()?.role;
    return r === 'admin';
  }
};

// Tự động khởi tạo Auth listener trên browser
if (typeof window !== 'undefined') {
  AuthService.initSupabaseAuth();
}
