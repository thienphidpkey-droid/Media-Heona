-- =========================================================
-- HEONA MEDIA CONTENT OPERATING SYSTEM - SUPABASE DATABASE SCHEMA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'contributor' CHECK (role IN ('admin', 'editor', 'contributor')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  website TEXT,
  industry VARCHAR(100) NOT NULL,
  description TEXT,
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  facebook TEXT,
  tiktok TEXT,
  youtube TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ARTICLES TABLE (BLOG & KNOWLEDGE)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  short_desc TEXT,
  content TEXT NOT NULL,
  thumbnail TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255) DEFAULT 'Heona Media Team',
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  seo JSONB DEFAULT '{}'::jsonb,
  cta_block JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECTS TABLE (CASE STUDIES & PORTFOLIO)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('Expert Spotlight', 'School Story', 'Event to Content', 'Branding', 'Tiktok', 'Event')),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255),
  industry VARCHAR(100),
  services TEXT[] DEFAULT '{}',
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  cover_image TEXT NOT NULL,
  featured_video TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived')),
  
  -- Narrative sections
  project_intro TEXT,
  client_background TEXT,
  challenge TEXT,
  project_goals TEXT,
  solution_summary TEXT,

  -- Dynamic arrays stored as JSONB
  process_steps JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  qualitative_results TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',
  testimonial JSONB DEFAULT '{}'::jsonb,
  seo JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  tag VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  sub_title VARCHAR(255),
  features TEXT[] DEFAULT '{}',
  image TEXT,
  icon VARCHAR(50),
  short_desc TEXT,
  full_desc TEXT,
  benefits TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video')),
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  resolution VARCHAR(50),
  alt_text TEXT,
  caption TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  uploaded_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LEADS CRM TABLE
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  service_interested VARCHAR(255),
  message TEXT,
  source_page VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin whitelist
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN (
    'thienph.idpkey@gmail.com',
    'heonamedia@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Public can read published articles, projects, services, and public media
CREATE POLICY "Public Read Published Articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admin Full Access Articles" ON articles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public Read Published Projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admin Full Access Projects" ON projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public Read Public Media" ON media FOR SELECT USING (is_public = true);
CREATE POLICY "Admin Full Access Media" ON media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Hide sensitive client contact info from public; expose via public_clients view
REVOKE SELECT ON clients FROM anon;
CREATE POLICY "Admin Full Access Clients" ON clients FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE VIEW public_clients WITH (security_invoker = false) AS
  SELECT id, name, logo, website, industry, description
  FROM clients
  WHERE COALESCE(status, 'active') = 'active';

GRANT SELECT ON public_clients TO anon, authenticated;

-- Public can submit clean leads only (no notes, constrained fields)
CREATE POLICY "Public Submit Clean Leads" ON leads FOR INSERT WITH CHECK (
  status = 'New' AND
  notes IS NULL AND
  char_length(name) BETWEEN 2 AND 100 AND
  char_length(phone) BETWEEN 8 AND 20 AND
  char_length(email) BETWEEN 5 AND 100 AND
  char_length(COALESCE(message, '')) <= 2000 AND
  char_length(COALESCE(service_interested, '')) <= 200
);
CREATE POLICY "Admin Full Access Leads" ON leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Rate limit and anti-spam trigger for leads
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_recent_count INT;
  v_dup_count INT;
BEGIN
  -- 1. Anti-flood duplicate: same phone or email within 5 minutes
  SELECT COUNT(*) INTO v_dup_count
  FROM public.leads
  WHERE (phone = NEW.phone OR LOWER(email) = LOWER(NEW.email))
    AND created_at > (NOW() - INTERVAL '5 minutes');
    
  IF v_dup_count > 0 THEN
    RAISE EXCEPTION 'Thông tin liên hệ này vừa được gửi. Vui lòng đợi 5 phút trước khi gửi lại.'
      USING ERRCODE = '23505';
  END IF;

  -- 2. Global anonymous rate limit: max 15 leads / 10 minutes
  IF NOT public.is_admin() THEN
    SELECT COUNT(*) INTO v_recent_count
    FROM public.leads
    WHERE created_at > (NOW() - INTERVAL '10 minutes');

    IF v_recent_count >= 15 THEN
      RAISE EXCEPTION 'Hệ thống đang tiếp nhận lượng yêu cầu lớn. Vui lòng liên hệ trực tiếp hotline 0931 899 427 hoặc thử lại sau ít phút.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- 3. Email regex validation
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Định dạng email không hợp lệ.' USING ERRCODE = '23514';
  END IF;

  -- 4. Phone regex validation
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
