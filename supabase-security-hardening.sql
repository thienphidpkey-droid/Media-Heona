-- ==============================================================================
-- HEONA MEDIA - SUPABASE PRODUCTION ROW-LEVEL SECURITY (RLS) HARDENING
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fktotmzqfbesbidpqbqb/sql
-- ==============================================================================

-- 1. PROJECTS TABLE HARDENING
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Projects" ON projects;
DROP POLICY IF EXISTS "Admin Full Access Projects" ON projects;
DROP POLICY IF EXISTS "allow all" ON projects;

-- Public can view projects (needed for portfolio website)
CREATE POLICY "Public Read Projects" 
ON projects FOR SELECT 
USING (true);

-- Only verified admins (thienph.idpkey@gmail.com, heonamedia@gmail.com) can modify/delete
CREATE POLICY "Admin Full Access Projects" 
ON projects FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- 2. ARTICLES (BLOG) TABLE HARDENING
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Articles" ON articles;
DROP POLICY IF EXISTS "Admin Full Access Articles" ON articles;
DROP POLICY IF EXISTS "allow all" ON articles;

-- Public can view published articles
CREATE POLICY "Public Read Articles" 
ON articles FOR SELECT 
USING (true);

-- Only verified admins can create, edit or delete articles
CREATE POLICY "Admin Full Access Articles" 
ON articles FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- 3. CLIENTS TABLE HARDENING
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Clients" ON clients;
DROP POLICY IF EXISTS "Admin Full Access Clients" ON clients;
DROP POLICY IF EXISTS "allow all" ON clients;

CREATE POLICY "Public Read Clients" 
ON clients FOR SELECT 
USING (true);

CREATE POLICY "Admin Full Access Clients" 
ON clients FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- 4. MEDIA TABLE HARDENING
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Media" ON media;
DROP POLICY IF EXISTS "Admin Full Access Media" ON media;
DROP POLICY IF EXISTS "allow all" ON media;

CREATE POLICY "Public Read Media" 
ON media FOR SELECT 
USING (true);

CREATE POLICY "Admin Full Access Media" 
ON media FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);


-- 5. LEADS (CUSTOMER INQUIRIES & CONTACT CRM) HARDENING
-- CRITICAL: Prevent unauthorized leakage of customer contact data!
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Submit Lead" ON leads;
DROP POLICY IF EXISTS "Admin Manage Leads" ON leads;
DROP POLICY IF EXISTS "allow all" ON leads;

-- Any visitor can submit a lead via contact form
CREATE POLICY "Public Submit Lead" 
ON leads FOR INSERT 
WITH CHECK (true);

-- ONLY authenticated admins can view, update or delete confidential customer leads!
CREATE POLICY "Admin Manage Leads" 
ON leads FOR ALL 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('thienph.idpkey@gmail.com', 'heonamedia@gmail.com')
);
