-- ==============================================================================
-- HEONA MEDIA - SUPABASE PRODUCTION ROW-LEVEL SECURITY (RLS) HARDENING (v4.2)
-- BẢN PRODUCTION HOÀN CHỈNH: ATOMIC TRANSACTION, PRE-MIGRATION COLUMN PATCHES,
-- IS_ADMIN() FUNCTION, EXPLICIT GRANTS, SECURITY DEFINER VIEW & SAFE STORAGE POLICIES.
--
-- Chạy toàn bộ script này trong Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fktotmzqfbesbidpqbqb/sql
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- BƯỚC 1: CHUẨN HÓA CỘT SCHEMA (NGĂN CHẶN LỖI 42703 COLUMN NOT EXIST)
-- Đảm bảo tất cả các cột được tham chiếu trong Policy và View đều tồn tại
-- ==============================================================================
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS notes TEXT;
UPDATE clients SET status = 'active' WHERE status IS NULL;

ALTER TABLE IF EXISTS media ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
UPDATE media SET is_public = true WHERE is_public IS NULL;

ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS service_interested VARCHAR(255);
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS source_page VARCHAR(255);


-- ==============================================================================
-- BƯỚC 2: HÀM ĐỊNH DANH QUẢN TRỊ VIÊN TẬP TRUNG (CENTRALIZED IAM HELPER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN (
    'thienph.idpkey@gmail.com',
    'heonamedia@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ==============================================================================
-- BƯỚC 3: DỌN DẸP SẠCH TOÀN BỘ POLICIES CŨ TRÊN CẢ 8 BẢNG DATABASE
-- (Xóa bỏ nguy cơ Additive RLS OR trong PostgreSQL)
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
-- BƯỚC 4: KHÓA CỨNG BẢNG DỰ ÁN (PROJECTS)
-- Chỉ cho phép công chúng xem dự án ĐÃ XUẤT BẢN (status = 'published')
-- ==============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Projects" 
ON projects FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Full Access Projects" 
ON projects FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 5: KHÓA CỨNG BẢNG BÀI VIẾT (ARTICLES)
-- ==============================================================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Articles" 
ON articles FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admin Full Access Articles" 
ON articles FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 6: KHÓA CỨNG BẢNG DỊCH VỤ (SERVICES)
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
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 7: BẢO MẬT DỮ LIỆU ĐỐI TÁC (CLIENTS) & VIEW PRIVILEGED PROJECTION
-- ==============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;

-- 1. Thu hồi quyền truy cập bảng gốc từ công chúng
REVOKE ALL ON clients FROM anon;

-- 2. Chỉ Admin Whitelist mới có quyền đọc và quản trị bảng gốc clients
CREATE POLICY "Admin Full Access Clients" 
ON clients FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Tạo View công khai bảo mật:
-- ==============================================================================
-- CẢNH BÁO BẢO MẬT: ĐÂY LÀ SECURITY DEFINER PROJECTION CÓ CHỦ ĐÍCH.
-- View này là cổng duy nhất cho phép website công khai hiển thị logo đối tác.
-- TUYỆT ĐỐI KHÔNG thêm các trường nhạy cảm: phone, email, contact_person, notes.
-- TUYỆT ĐỐI KHÔNG sử dụng 'SELECT *' tại đây!
-- ==============================================================================
CREATE OR REPLACE VIEW public_clients WITH (security_invoker = false) AS
  SELECT id, name, logo, website, industry, description
  FROM clients
  WHERE COALESCE(status, 'active') = 'active';

GRANT SELECT ON public_clients TO anon, authenticated;


-- ==============================================================================
-- BƯỚC 8: BẢO MẬT BẢNG MEDIA (THU HẸP PHẠM VI PUBLIC)
-- ==============================================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media FORCE ROW LEVEL SECURITY;

-- Công chúng chỉ được đọc các media công khai (không đọc được asset nội bộ / nháp)
CREATE POLICY "Public Read Public Media" 
ON media FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admin Full Access Media" 
ON media FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 9: BẢO MẬT VÀ RÀNG BUỘC CHẶT CHẼ DỮ LIỆU LEADS
-- ==============================================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;

-- Thu hồi quyền đọc/sửa/xóa từ công chúng
REVOKE SELECT, UPDATE, DELETE ON leads FROM anon;

-- Khách vãng lai chỉ được phép INSERT lead sạch, chuẩn format
CREATE POLICY "Public Submit Clean Leads" 
ON leads FOR INSERT 
WITH CHECK (
  status = 'New' AND
  notes IS NULL AND
  char_length(name) BETWEEN 2 AND 100 AND
  char_length(phone) BETWEEN 8 AND 20 AND
  char_length(email) BETWEEN 5 AND 100 AND
  char_length(COALESCE(message, '')) <= 2000 AND
  char_length(COALESCE(service_interested, '')) <= 200
);

-- Trigger kiểm soát tốc độ gửi (Rate Limiting) & Chống spam trùng lặp cho Leads
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_recent_count INT;
  v_dup_count INT;
BEGIN
  -- 1. Chống spam gửi liên tục cùng số điện thoại hoặc email trong vòng 5 phút
  SELECT COUNT(*) INTO v_dup_count
  FROM public.leads
  WHERE (phone = NEW.phone OR LOWER(email) = LOWER(NEW.email))
    AND created_at > (NOW() - INTERVAL '5 minutes');
    
  IF v_dup_count > 0 THEN
    RAISE EXCEPTION 'Thông tin liên hệ này vừa được gửi. Vui lòng đợi 5 phút trước khi gửi lại.'
      USING ERRCODE = '23505';
  END IF;

  -- 2. Giới hạn tần suất toàn cục (Rate Limiting): Tối đa 15 leads công khai / 10 phút
  IF NOT public.is_admin() THEN
    SELECT COUNT(*) INTO v_recent_count
    FROM public.leads
    WHERE created_at > (NOW() - INTERVAL '10 minutes');

    IF v_recent_count >= 15 THEN
      RAISE EXCEPTION 'Hệ thống đang tiếp nhận lượng yêu cầu lớn. Vui lòng liên hệ trực tiếp hotline 0931 899 427 hoặc thử lại sau ít phút.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- 3. Kiểm tra định dạng Regex Email
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Định dạng email không hợp lệ.' USING ERRCODE = '23514';
  END IF;

  -- 4. Kiểm tra định dạng Regex Số điện thoại
  IF NEW.phone !~* '^[0-9+() -]{8,20}$' THEN
    RAISE EXCEPTION 'Định dạng số điện thoại không hợp lệ.' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lead_rate_limit ON leads;
CREATE TRIGGER trg_lead_rate_limit
BEFORE INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION public.check_lead_rate_limit();

CREATE POLICY "Admin Full Access Leads" 
ON leads FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 10: BẢO MẬT NHẬT KÝ KIỂM TOÁN VÀ THÔNG BÁO HỆ THỐNG
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
REVOKE ALL ON activity_logs FROM anon;

CREATE POLICY "Admin Full Access Activity Logs" 
ON activity_logs FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

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
REVOKE ALL ON notifications FROM anon;

CREATE POLICY "Admin Full Access Notifications" 
ON notifications FOR ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- BƯỚC 11: PHÂN QUYỀN CƠ SỞ DỮ LIỆU TƯỜNG MINH (EXPLICIT SQL GRANTS)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.media TO anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.public_clients TO anon, authenticated;

COMMIT;

-- ==============================================================================
-- BƯỚC 12: BẢO VỆ SUPABASE STORAGE (AN TOÀN / KHÔNG DỪNG NẾU THIẾU QUYỀN OWNER)
-- Bảng storage.objects được sở hữu bởi role supabase_storage_admin.
-- Khối lệnh này sẽ tự động thử gán policy nếu có quyền, và không làm gián đoạn hệ thống.
-- ==============================================================================
DO $$ 
BEGIN 
  BEGIN
    DROP POLICY IF EXISTS "Public Read Storage Objects" ON storage.objects;
    CREATE POLICY "Public Read Storage Objects"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id IN ('media', 'public-media'));

    DROP POLICY IF EXISTS "Admin Manage Storage Objects" ON storage.objects;
    CREATE POLICY "Admin Manage Storage Objects"
    ON storage.objects FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Thông báo: storage.objects do role supabase_storage_admin quản lý. Hãy cấu hình Storage Policies qua tab Storage -> Configuration -> Policies trên Supabase Dashboard nếu cần.';
  END;
END $$;
