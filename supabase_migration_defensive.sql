-- ====================================================================
-- HEONA MEDIA - DEFENSIVE SECURITY & SCHEMA SYNCHRONIZATION MIGRATION
-- An toàn chạy trực tiếp trong Supabase SQL Editor (Idempotent / IF NOT EXISTS)
-- ====================================================================

-- 1. BỔ SUNG CÁC CỘT CÒN THIẾU CHO BẢNG LEADS (CRM KHÁCH HÀNG)
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS service_interested VARCHAR(255);
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS source_page VARCHAR(255);
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. TẠO BẢNG DỊCH VỤ (SERVICES) NẾU CHƯA CÓ
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  tag VARCHAR(100) NOT NULL DEFAULT 'Trọng tâm',
  title VARCHAR(255) NOT NULL,
  sub_title VARCHAR(255),
  short_desc TEXT,
  features TEXT[] DEFAULT '{}',
  image TEXT,
  icon VARCHAR(100),
  highlight BOOLEAN DEFAULT TRUE,
  price VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TẠO BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITY LOGS - AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TẠO BẢNG THÔNG BÁO HỆ THỐNG (NOTIFICATIONS)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BẬT ROW LEVEL SECURITY (RLS) TRÊN CÁC BẢNG
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 6. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (POLICIES)

-- [LEADS] Khách vãng lai gửi form liên hệ (INSERT công khai)
DROP POLICY IF EXISTS "Public Submit Leads" ON leads;
CREATE POLICY "Public Submit Leads" ON leads FOR INSERT WITH CHECK (true);

-- [LEADS] Admin Whitelist có toàn quyền Đọc/Sửa/Xóa Lead
DROP POLICY IF EXISTS "Admin Full Access Leads" ON leads;
CREATE POLICY "Admin Full Access Leads" ON leads FOR ALL USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [SERVICES] Khách công khai được đọc danh sách dịch vụ đã đăng
DROP POLICY IF EXISTS "Public Read Published Services" ON services;
CREATE POLICY "Public Read Published Services" ON services FOR SELECT USING (status = 'published');

-- [SERVICES] Admin Whitelist có toàn quyền quản lý dịch vụ
DROP POLICY IF EXISTS "Admin Full Access Services" ON services;
CREATE POLICY "Admin Full Access Services" ON services FOR ALL USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [ACTIVITY_LOGS] Chỉ Admin Whitelist mới được xem và ghi log
DROP POLICY IF EXISTS "Admin Access Activity Logs" ON activity_logs;
CREATE POLICY "Admin Access Activity Logs" ON activity_logs FOR ALL USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [NOTIFICATIONS] Chỉ Admin Whitelist mới được xem và quản lý thông báo
DROP POLICY IF EXISTS "Admin Access Notifications" ON notifications;
CREATE POLICY "Admin Access Notifications" ON notifications FOR ALL USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);
