-- ====================================================================
-- HEONA MEDIA - DEFENSIVE SECURITY & SCHEMA SYNCHRONIZATION MIGRATION (v2.1)
-- An toàn chạy trực tiếp trong Supabase SQL Editor (Idempotent / IF NOT EXISTS)
-- ====================================================================

BEGIN;

-- 1. BỔ SUNG CÁC CỘT CÒN THIẾU TRƯỚC TIÊN (TRÁNH LỖI 42703 COLUMN NOT EXIST)
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS notes TEXT;
UPDATE clients SET status = 'active' WHERE status IS NULL;

ALTER TABLE IF EXISTS media ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
UPDATE media SET is_public = true WHERE is_public IS NULL;

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
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 6. XÓA MỌI CHÍNH SÁCH CŨ ĐỂ TRÁNH HIỆN TƯỢNG CỘNG GỘP (ADDITIVE RLS OR)
DROP POLICY IF EXISTS "Public Submit Leads" ON leads;
DROP POLICY IF EXISTS "Public Submit Lead" ON leads;
DROP POLICY IF EXISTS "Public Submit Clean Leads" ON leads;
DROP POLICY IF EXISTS "Admin Full Access Leads" ON leads;
DROP POLICY IF EXISTS "Admin Manage Leads" ON leads;

DROP POLICY IF EXISTS "Public Read Services" ON services;
DROP POLICY IF EXISTS "Public Read Published Services" ON services;
DROP POLICY IF EXISTS "Admin Full Access Services" ON services;

DROP POLICY IF EXISTS "Admin Access Activity Logs" ON activity_logs;
DROP POLICY IF EXISTS "Admin Full Access Activity Logs" ON activity_logs;

DROP POLICY IF EXISTS "Admin Access Notifications" ON notifications;
DROP POLICY IF EXISTS "Admin Full Access Notifications" ON notifications;

DROP POLICY IF EXISTS "Public Read Clients" ON clients;
DROP POLICY IF EXISTS "Admin Full Access Clients" ON clients;

-- 7. THIẾT LẬP CHÍNH SÁCH BẢO MẬT CHẶT CHẼ (POLICIES)

-- [LEADS] Khách vãng lai chỉ được gửi lead sạch với status 'New', notes IS NULL và giới hạn độ dài
CREATE POLICY "Public Submit Clean Leads" ON leads FOR INSERT WITH CHECK (
  status = 'New' AND
  notes IS NULL AND
  char_length(name) BETWEEN 2 AND 100 AND
  char_length(phone) BETWEEN 8 AND 20 AND
  char_length(email) BETWEEN 5 AND 100 AND
  char_length(COALESCE(message, '')) <= 2000 AND
  char_length(COALESCE(service, '')) <= 200
);

-- [LEADS] Chỉ Admin Whitelist có toàn quyền Đọc/Sửa/Xóa Lead
CREATE POLICY "Admin Full Access Leads" ON leads FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [SERVICES] Khách công khai chỉ được đọc dịch vụ đã xuất bản
CREATE POLICY "Public Read Published Services" ON services FOR SELECT 
USING (status = 'published');

-- [SERVICES] Admin Whitelist có toàn quyền quản lý dịch vụ
CREATE POLICY "Admin Full Access Services" ON services FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [CLIENTS] Khóa bảng gốc clients với công chúng, chỉ mở qua View an toàn
REVOKE ALL ON clients FROM anon;
CREATE POLICY "Admin Full Access Clients" ON clients FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

CREATE OR REPLACE VIEW public_clients WITH (security_invoker = false) AS
  SELECT id, name, logo, website, industry, description
  FROM clients
  WHERE COALESCE(status, 'active') = 'active';

GRANT SELECT ON public_clients TO anon, authenticated;

-- [ACTIVITY_LOGS] Chỉ Admin Whitelist mới được xem và ghi log
CREATE POLICY "Admin Full Access Activity Logs" ON activity_logs FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

-- [NOTIFICATIONS] Chỉ Admin Whitelist mới được xem và quản lý thông báo
CREATE POLICY "Admin Full Access Notifications" ON notifications FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

COMMIT;
