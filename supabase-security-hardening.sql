-- ==============================================================================
-- HEONA MEDIA - SUPABASE PRODUCTION ROW-LEVEL SECURITY (RLS) HARDENING (v2.0)
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fktotmzqfbesbidpqbqb/sql
-- ==============================================================================

-- BƯỚC 1: XÓA SẠCH MỌI POLICIES CŨ (TRÁNH XUNG ĐỘT HOẶC CÒN SÓT CHÍNH SÁCH CŨ TỪ UI)
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('projects', 'articles', 'clients', 'media', 'leads')
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', pol.policyname, pol.tablename);
    END LOOP; 
END $$;


-- ==============================================================================
-- BƯỚC 2: KHÓA CỨNG BẢNG DỰ ÁN (PROJECTS)
-- ==============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

-- Công chúng và website được phép đọc các dự án
CREATE POLICY "Public Read Projects" 
ON projects FOR SELECT 
USING (true);

-- Chỉ 2 Super Admin duy nhất được Thêm, Sửa, Xóa dự án
CREATE POLICY "Admin Full Access Projects" 
ON projects FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 3: KHÓA CỨNG BẢNG BÀI VIẾT (ARTICLES)
-- ==============================================================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles FORCE ROW LEVEL SECURITY;

-- Công chúng và website được phép đọc bài viết blog
CREATE POLICY "Public Read Articles" 
ON articles FOR SELECT 
USING (true);

-- Chỉ 2 Super Admin duy nhất được Thêm, Sửa, Xóa bài viết
CREATE POLICY "Admin Full Access Articles" 
ON articles FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 4: KHÓA CỨNG BẢNG KHÁCH HÀNG / ĐỐI TÁC (CLIENTS)
-- ==============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;

-- Công chúng được xem logo đối tác trên trang chủ
CREATE POLICY "Public Read Clients" 
ON clients FOR SELECT 
USING (true);

-- Chỉ 2 Super Admin duy nhất được Thêm, Sửa, Xóa thông tin khách hàng
CREATE POLICY "Admin Full Access Clients" 
ON clients FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 5: KHÓA CỨNG BẢNG MEDIA (HÌNH ẢNH / VIDEO LƯU TRỮ)
-- ==============================================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media FORCE ROW LEVEL SECURITY;

-- Công chúng được xem media trên website
CREATE POLICY "Public Read Media" 
ON media FOR SELECT 
USING (true);

-- Chỉ 2 Super Admin duy nhất được Thêm, Sửa, Xóa media
CREATE POLICY "Admin Full Access Media" 
ON media FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- ==============================================================================
-- BƯỚC 6: BẢO MẬT DỮ LIỆU KHÁCH HÀNG TIỀM NĂNG (LEADS CRM)
-- ==============================================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;

-- Khách hàng vãng lai gửi form liên hệ qua website được phép INSERT
CREATE POLICY "Public Submit Lead" 
ON leads FOR INSERT 
WITH CHECK (true);

-- CHỈ DUY NHẤT 2 Super Admin được xem (SELECT), cập nhật (UPDATE) hoặc xóa (DELETE) thông tin liên hệ!
-- Người ngoài tuyệt đối KHÔNG THỂ đọc trộm danh sách khách hàng tiềm năng.
CREATE POLICY "Admin Manage Leads" 
ON leads FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);
