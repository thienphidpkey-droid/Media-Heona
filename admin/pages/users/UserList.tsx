import React, { useState, useEffect } from 'react';
import { Users, Shield, Check, X, UserPlus, Clock } from 'lucide-react';
import { UsersService, subscribe } from '../../services/db';
import { CMSUser, Role } from '../../../types';
import { useToast } from '../../components/Toast';

export const UserList: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<CMSUser[]>(UsersService.getAll());

  useEffect(() => {
    const unsub = subscribe(() => setUsers(UsersService.getAll()));
    return () => unsub();
  }, []);

  const handleRoleChange = (id: string, role: Role) => {
    UsersService.update(id, { role });
    showToast(`Đã phân quyền ${role.toUpperCase()} thành công!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Người dùng & Phân quyền</h1>
          <p className="text-xs text-gray-400 mt-1">
            Quản lý vai trò và quyền hạn của các thành viên trong đội ngũ Heona Media.
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Danh sách thành viên</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111116] border-b border-white/[0.06] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Thành viên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-5 text-right">Đăng nhập gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-gray-300 font-normal">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.08]"
                      />
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 text-[11px]">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="px-2.5 py-1 bg-[#16161d] border border-white/[0.08] rounded-lg text-xs font-medium text-white outline-none cursor-pointer capitalize focus:border-primary/50"
                    >
                      <option className="bg-[#111116] text-white" value="admin">Admin (Toàn quyền)</option>
                      <option className="bg-[#111116] text-white" value="editor">Editor (Biên tập & Duyệt)</option>
                      <option className="bg-[#111116] text-white" value="contributor">Contributor (Cộng tác viên)</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-gray-400 text-[11px]">
                    {u.lastLogin || 'Chưa đăng nhập'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-[#111116]/80 rounded-xl border border-white/[0.06] p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
          Ma trận Phân quyền Hệ thống (Role Capabilities)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111115] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Quyền hạn / Chức năng</th>
                <th className="py-3 px-4 text-center">Admin (Toàn quyền)</th>
                <th className="py-3 px-4 text-center">Editor (Biên tập)</th>
                <th className="py-3 px-4 text-center">Contributor (Cộng tác)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-gray-300">
              <tr>
                <td className="py-3 px-4">Tạo và chỉnh sửa bản nháp (Draft)</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Gửi duyệt bài viết (Send for Review)</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Phê duyệt & Xuất bản trực tiếp (Publish)</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Xóa bài viết và dự án</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Quản lý Khách hàng & Leads CRM</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Phân quyền nhân sự & Cài đặt hệ thống</td>
                <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
