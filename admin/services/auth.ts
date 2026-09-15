import { CMSUser, Role } from '../../types';
import { UsersService } from './db';

const AUTH_STORAGE_KEY = 'heona_cms_current_user';

type AuthListener = (user: CMSUser | null) => void;
const authListeners = new Set<AuthListener>();

export const AuthService = {
  getCurrentUser(): CMSUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        // Default login as Admin for fast testing if nothing stored
        const defaultUser = UsersService.getAll()[0];
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
        return defaultUser;
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

  loginWithDemo(role: Role): CMSUser {
    const users = UsersService.getAll();
    const matched = users.find((u) => u.role === role) || users[0];
    matched.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.setCurrentUser(matched);
    return matched;
  },

  login(email: string): { success: boolean; user?: CMSUser; error?: string } {
    const users = UsersService.getAll();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Email không tồn tại trong hệ thống.' };
    }
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.setCurrentUser(user);
    return { success: true, user };
  },

  logout(): void {
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
