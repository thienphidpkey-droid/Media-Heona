-- ==============================================================================
-- HEONA MEDIA - SUPABASE PRODUCTION ROW-LEVEL SECURITY (RLS) HARDENING (v3.0)
-- BẢN NÂNG CẤP TOÀN DIỆN: KHẮC PHỤC TRIỆT ĐỂ CẢ 6 LỖ HỔNG BẢO MẬT TỪ HOSTILE AUDIT
-- Chạy toàn bộ script này trong Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fktotmzqfbesbidpqbqb/sql
-- ==============================================================================

-- ==============================================================================
-- BƯỚC 1: XÓA SẠCH MỌI POLICIES TRÊN TẤT CẢ 8 BẢNG
-- (Ngăn chặn triệt để hiện tượng cộng gộp OR - Additive RLS trong Postgres)
-- ==============================================================================
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('projects', 'articles', 'clients', 'media', 'leads', 'services', 'activity_logs', 'notifications')
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', pol.policyname, pol.tablename);
    END LOOP; 
END $$;


-- ==============================================================================
-- BƯỚC 2: KHÓA CỨNG BẢNG DỰ ÁN (PROJECTS)
-- Chỉ cho phép công chúng xem dự án ĐÃ XUẤT BẢN (status = 'published')
-- Tuyệt đối không để lộ dự án 'draft', 'review', 'scheduled', 'archived'
-- ==============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Projects" 
ON projects FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Full Access Projects" 
ON projects FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 3: KHÓA CỨNG BẢNG BÀI VIẾT (ARTICLES)
-- Chỉ cho phép công chúng xem bài viết ĐÃ XUẤT BẢN (status = 'published')
-- Không thể truy vấn bản nháp hoặc kế hoạch nội dung chưa công bố
-- ==============================================================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Articles" 
ON articles FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Full Access Articles" 
ON articles FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 4: KHẮC PHỤC RÒ RỈ DỮ LIỆU ĐỐI TÁC (CLIENTS)
-- 1. Tạo VIEW an toàn 'public_clients' chỉ hiển thị logo và thông tin thương hiệu
-- 2. Giấu kín các trường nhạy cảm: phone, email, contact_person, notes
-- 3. Khóa bảng gốc clients: Chỉ Admin Whitelist mới có quyền đọc/ghi
-- ==============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;

-- Tạo View công khai bảo mật chỉ trích xuất các trường an toàn
CREATE OR REPLACE VIEW public_clients WITH (security_invoker = false) AS
  SELECT id, name, logo, website, industry, description
  FROM clients
  WHERE status = 'active';

GRANT SELECT ON public_clients TO anon, authenticated;

-- Bảng gốc clients: KHÔNG cấp quyền SELECT cho công chúng!
CREATE POLICY "Admin Full Access Clients" 
ON clients FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 5: KHÓA CỨNG BẢNG DỊCH VỤ (SERVICES)
-- Chỉ cho phép đọc dịch vụ đã xuất bản
-- ==============================================================================
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

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Services" 
ON services FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Full Access Services" 
ON services FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 6: CHỐNG ĐẦU ĐỘC VÀ SPAM CƠ SỞ DỮ LIỆU LEADS (LEADS CRM)
-- 1. Ràng buộc WITH CHECK chặt chẽ:
--    - Bắt buộc status = 'New'
--    - Bắt buộc notes IS NULL (ngăn kẻ ngoài chèn ghi chú giả mạo)
--    - Giới hạn độ dài chuỗi tên, số điện thoại, email, nội dung tin nhắn
-- 2. Chỉ duy nhất Admin Whitelist được SELECT / UPDATE / DELETE
-- ==============================================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Submit Clean Leads" 
ON leads FOR INSERT 
WITH CHECK (
  status = 'New' AND
  notes IS NULL AND
  char_length(name) BETWEEN 2 AND 100 AND
  char_length(phone) BETWEEN 8 AND 20 AND
  char_length(email) BETWEEN 5 AND 100 AND
  char_length(COALESCE(message, '')) <= 2000 AND
  char_length(COALESCE(service, '')) <= 200
);

CREATE POLICY "Admin Full Access Leads" 
ON leads FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 7: KHÓA CỨNG BẢNG MEDIA
-- ==============================================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Media" 
ON media FOR SELECT 
USING (true);

CREATE POLICY "Admin Full Access Media" 
ON media FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 8: BẢO MẬT NHẬT KÝ HOẠT ĐỘNG VÀ THÔNG BÁO (ACTIVITY_LOGS & NOTIFICATIONS)
-- Chỉ Admin Whitelist mới được xem và ghi log/thông báo
-- ==============================================================================
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

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY "Admin Full Access Activity Logs" 
ON activity_logs FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications FORCE ROW LEVEL SECURITY;

CREATE POLICY "Admin Full Access Notifications" 
ON notifications FOR ALL 
TO authenticated 
USING (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);
