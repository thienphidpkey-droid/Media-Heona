import {
  Article,
  Project,
  Service,
  Client,
  MediaItem,
  Lead,
  CMSUser,
  ActivityLog,
  NotificationItem,
  ContentStatus,
  LeadStatus
} from '../../types';

import {
  SEED_ARTICLES,
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_CLIENTS,
  SEED_MEDIA,
  SEED_LEADS,
  SEED_USERS,
  SEED_ACTIVITY_LOGS,
  SEED_NOTIFICATIONS
} from './seedData';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  ARTICLES: 'heona_cms_articles',
  PROJECTS: 'heona_cms_projects',
  SERVICES: 'heona_cms_services',
  CLIENTS: 'heona_cms_clients',
  MEDIA: 'heona_cms_media',
  LEADS: 'heona_cms_leads',
  USERS: 'heona_cms_users',
  LOGS: 'heona_cms_activity_logs',
  NOTIFICATIONS: 'heona_cms_notifications',
  SEEDED: 'heona_cms_seeded_v1'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyChange() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error calling listener', e);
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', () => {
    notifyChange();
  });
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange();
  } catch (err) {
    console.error(`Failed to write to localStorage: ${key}`, err);
  }
}

// Ensure database is seeded with rich Heona Media initial data
export function ensureDatabaseSeeded(): void {
  if (typeof window === 'undefined') return;
  const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  if (!isSeeded) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(SEED_MEDIA));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_ACTIVITY_LOGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  } else if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
  }

  // Cleanse any old fake seed views from previously seeded localStorage
  const CLEANSE_KEY = 'heona_cms_cleansed_mock_views_v1';
  if (!localStorage.getItem(CLEANSE_KEY)) {
    const articles = getItem<Article[]>(STORAGE_KEYS.ARTICLES, []);
    if (articles.length > 0) {
      let changed = false;
      const cleaned = articles.map((a) => {
        if ([1420, 980, 2450, 45, 12].includes(a.views)) {
          changed = true;
          return { ...a, views: 0 };
        }
        return a;
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(cleaned));
      }
    }
    localStorage.setItem(CLEANSE_KEY, 'true');
  }
}

// Automatically seed on initial load
ensureDatabaseSeeded();

// ==========================================
// SUPABASE CLOUD SYNC HELPERS
// ==========================================
export async function syncFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // Sync Projects from Supabase with Smart Merge (never delete local items)
    const { data: dbProjects, error: pErr } = await supabase.from('projects').select('*');
    if (!pErr && dbProjects && dbProjects.length > 0) {
      const mapped: Project[] = dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        clientId: p.client_id,
        clientName: p.client_name,
        industry: p.industry,
        services: p.services || [],
        location: p.location,
        startDate: p.start_date,
        endDate: p.end_date,
        image: p.cover_image || p.image || '/images/project-1.webp',
        coverImage: p.cover_image || p.image || '/images/project-1.webp',
        featuredVideo: p.featured_video,
        status: p.status,
        description: p.description,
        projectIntro: p.project_intro,
        clientBackground: p.client_background,
        challenge: p.challenge,
        projectGoals: p.project_goals,
        solutionSummary: p.solution_summary,
        processSteps: p.process_steps || [],
        results: p.results || [],
        qualitativeResults: p.qualitative_results || [],
        gallery: p.gallery || [],
        testimonial: p.testimonial,
        seo: p.seo,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      // Smart merge: keep any local projects not yet in Supabase
      const localProjects = getItem<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
      const mergedProjects = [...mapped];
      for (const lp of localProjects) {
        if (!mergedProjects.some((mp) => mp.slug === lp.slug || String(mp.id) === String(lp.id))) {
          mergedProjects.push(lp);
        }
      }
      setItem(STORAGE_KEYS.PROJECTS, mergedProjects);
    }

    // Sync Articles from Supabase with Smart Merge
    const { data: dbArticles, error: aErr } = await supabase.from('articles').select('*');
    if (!aErr && dbArticles && dbArticles.length > 0) {
      const mappedArt: Article[] = dbArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        shortDesc: a.excerpt || a.content?.slice(0, 150) || '',
        excerpt: a.excerpt || '',
        content: a.content,
        thumbnail: a.thumbnail || '/images/hero-1.webp',
        author: a.author || 'Heona Media Team',
        category: a.category || 'Kiến thức',
        tags: a.tags || [],
        status: a.status || 'draft',
        views: 0,
        publishedAt: a.published_at,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
        seo: a.seo,
        ctaBlock: undefined
      }));

      // Smart merge: keep any local articles not yet in Supabase
      const localArticles = getItem<Article[]>(STORAGE_KEYS.ARTICLES, SEED_ARTICLES);
      const mergedArticles = [...mappedArt];
      for (const la of localArticles) {
        if (!mergedArticles.some((ma) => ma.slug === la.slug || String(ma.id) === String(la.id))) {
          mergedArticles.push(la);
        }
      }
      setItem(STORAGE_KEYS.ARTICLES, mergedArticles);
    }
  } catch (e) {
    console.warn('[Supabase Sync] Background sync skipped:', e);
  }
}

function syncProjectToSupabase(p: Project) {
  try {
    supabase.from('projects').upsert({
      title: p.title,
      slug: p.slug,
      category: p.category,
      client_name: p.clientName,
      client_id: p.clientId || null,
      industry: p.industry,
      services: p.services || [],
      location: p.location,
      start_date: p.startDate || null,
      end_date: p.endDate || null,
      cover_image: p.coverImage || p.image,
      image: p.coverImage || p.image,
      featured_video: p.featuredVideo || null,
      status: p.status,
      description: p.description,
      project_intro: p.projectIntro,
      client_background: p.clientBackground,
      challenge: p.challenge,
      project_goals: p.projectGoals,
      solution_summary: p.solutionSummary,
      process_steps: p.processSteps || [],
      results: p.results || [],
      qualitative_results: p.qualitativeResults || [],
      gallery: p.gallery || [],
      testimonial: p.testimonial || {},
      seo: p.seo || {}
    }, { onConflict: 'slug' }).then(({ error }) => {
      if (error) console.warn('[Supabase Project Sync Error]:', error.message);
      else console.log('[Supabase Project Sync] Synced:', p.title);
    });
  } catch (e) {}
}

function syncArticleToSupabase(a: Article) {
  try {
    supabase.from('articles').upsert({
      title: a.title,
      slug: a.slug,
      excerpt: a.shortDesc || '',
      content: a.content,
      category: a.category,
      tags: a.tags || [],
      author: a.author,
      thumbnail: a.thumbnail,
      status: a.status,
      seo: a.seo || {},
      published_at: a.publishedAt || null
    }, { onConflict: 'slug' }).then(({ error }) => {
      if (error) console.warn('[Supabase Article Sync Error]:', error.message);
      else console.log('[Supabase Article Sync] Synced:', a.title);
    });
  } catch (e) {}
}

// Trigger initial sync if in browser
if (typeof window !== 'undefined') {
  syncFromSupabase();
}

// ==========================================
// ARTICLES (BLOG) CRUD
// ==========================================
export const ArticlesService = {
  getAll(): Article[] {
    return getItem<Article[]>(STORAGE_KEYS.ARTICLES, SEED_ARTICLES).sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.createdAt || '').getTime() || 0;
      const timeB = new Date(b.publishedAt || b.createdAt || '').getTime() || 0;
      return timeB - timeA;
    });
  },

  getPublished(): Article[] {
    return this.getAll()
      .filter((a) => a.status === 'published')
      .sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.createdAt || '').getTime() || 0;
        const timeB = new Date(b.publishedAt || b.createdAt || '').getTime() || 0;
        return timeB - timeA;
      });
  },

  getBySlug(slug: string): Article | undefined {
    return this.getAll().find((a) => a.slug === slug);
  },

  getById(id: string | number): Article | undefined {
    return this.getAll().find((a) => String(a.id) === String(id));
  },

  save(article: Partial<Article> & { title: string; content: string }): Article {
    const list = this.getAll();
    const now = new Date().toISOString().split('T')[0];
    const slug =
      article.slug ||
      article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (article.id) {
      const index = list.findIndex((a) => String(a.id) === String(article.id));
      if (index >= 0) {
        const updated: Article = {
          ...list[index],
          ...article,
          slug,
          updatedAt: now
        };
        list[index] = updated;
        setItem(STORAGE_KEYS.ARTICLES, list);
        ActivityLogService.log('đã cập nhật bài viết', 'article', updated.title);
        syncArticleToSupabase(updated);
        return updated;
      }
    }

    // Create new
    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug,
      title: article.title,
      shortDesc: article.shortDesc || '',
      content: article.content,
      thumbnail: article.thumbnail || '/images/hero-1.webp',
      author: article.author || 'Nguyễn Heona (Founder)',
      authorId: article.authorId || 'u-admin-1',
      category: article.category || 'Expert Spotlight',
      tags: article.tags || [],
      status: article.status || 'draft',
      views: 0,
      publishedAt: article.status === 'published' ? now : undefined,
      scheduledAt: article.scheduledAt,
      createdAt: now,
      updatedAt: now,
      seo: article.seo || {
        title: article.title,
        metaDescription: article.shortDesc || '',
        focusKeyword: ''
      },
      ctaBlock: article.ctaBlock
    };

    list.unshift(newArticle);
    setItem(STORAGE_KEYS.ARTICLES, list);
    ActivityLogService.log('đã tạo bài viết mới', 'article', newArticle.title);
    syncArticleToSupabase(newArticle);
    return newArticle;
  },

  delete(id: string | number): boolean {
    const list = this.getAll();
    const item = list.find((a) => String(a.id) === String(id));
    if (!item) return false;
    const filtered = list.filter((a) => String(a.id) !== String(id));
    setItem(STORAGE_KEYS.ARTICLES, filtered);
    ActivityLogService.log('đã xóa bài viết', 'article', item.title);
    try { supabase.from('articles').delete().eq('slug', item.slug).then(() => {}); } catch(e) {}
    return true;
  },

  updateStatus(id: string | number, status: ContentStatus): Article | null {
    const list = this.getAll();
    const item = list.find((a) => String(a.id) === String(id));
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString().split('T')[0];
    if (status === 'published' && !item.publishedAt) {
      item.publishedAt = item.updatedAt;
    }
    setItem(STORAGE_KEYS.ARTICLES, list);
    ActivityLogService.log(`đã đổi trạng thái sang ${status}`, 'article', item.title);
    return item;
  },

  duplicate(id: string | number): Article | null {
    const source = this.getById(id);
    if (!source) return null;
    const duplicated: Partial<Article> = {
      ...source,
      id: undefined,
      title: `${source.title} (Bản sao)`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      views: 0
    };
    return this.save(duplicated as any);
  },

  recordView(slugOrId: string | number): number {
    const list = this.getAll();
    const item = list.find((a) => a.slug === slugOrId || String(a.id) === String(slugOrId));
    if (!item) return 0;
    item.views = (typeof item.views === 'number' ? item.views : 0) + 1;
    setItem(STORAGE_KEYS.ARTICLES, list);
    return item.views;
  }
};

// ==========================================
// PROJECTS (CASE STUDIES) CRUD
// ==========================================
export const ProjectsService = {
  getAll(): Project[] {
    return getItem<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
  },

  getPublished(): Project[] {
    return this.getAll().filter((p) => p.status !== 'draft' && p.status !== 'archived');
  },

  getByCategory(category: string): Project[] {
    return this.getAll().filter((p) => p.category === category);
  },

  getBySlug(slug: string): Project | undefined {
    return this.getAll().find((p) => p.slug === slug);
  },

  getById(id: string | number): Project | undefined {
    return this.getAll().find((p) => String(p.id) === String(id));
  },

  save(project: Partial<Project> & { title: string; category: string }): Project {
    const list = this.getAll();
    const now = new Date().toISOString().split('T')[0];
    const slug =
      project.slug ||
      project.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (project.id) {
      const index = list.findIndex((p) => String(p.id) === String(project.id));
      if (index >= 0) {
        const updated: Project = {
          ...list[index],
          ...project,
          slug,
          updatedAt: now
        };
        list[index] = updated;
        setItem(STORAGE_KEYS.PROJECTS, list);
        ActivityLogService.log('đã cập nhật dự án', 'project', updated.title);
        syncProjectToSupabase(updated);
        return updated;
      }
    }

    // Create new
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: project.title,
      slug,
      category: project.category,
      description: project.description || '',
      image: project.image || '/images/project-1.webp',
      status: project.status || 'published',
      clientId: project.clientId,
      clientName: project.clientName,
      industry: project.industry || 'Giáo dục & Đào tạo',
      services: project.services || ['Personal Branding', 'Content Strategy'],
      location: project.location || 'TP. Hồ Chí Minh',
      startDate: project.startDate,
      endDate: project.endDate,
      featuredVideo: project.featuredVideo,
      projectIntro: project.projectIntro,
      clientBackground: project.clientBackground,
      challenge: project.challenge,
      projectGoals: project.projectGoals,
      solutionSummary: project.solutionSummary,
      processSteps: project.processSteps || [],
      results: project.results || [],
      qualitativeResults: project.qualitativeResults || [],
      gallery: project.gallery || [],
      testimonial: project.testimonial,
      seo: project.seo || {
        title: `${project.title} - Heona Media Case Study`,
        focusKeyword: ''
      },
      createdAt: now,
      updatedAt: now
    };

    list.unshift(newProject);
    setItem(STORAGE_KEYS.PROJECTS, list);
    ActivityLogService.log('đã tạo dự án mới', 'project', newProject.title);
    syncProjectToSupabase(newProject);
    return newProject;
  },

  delete(id: string | number): boolean {
    const list = this.getAll();
    const item = list.find((p) => String(p.id) === String(id));
    if (!item) return false;
    const filtered = list.filter((p) => String(p.id) !== String(id));
    setItem(STORAGE_KEYS.PROJECTS, filtered);
    ActivityLogService.log('đã xóa dự án', 'project', item.title);
    try { supabase.from('projects').delete().eq('slug', item.slug).then(() => {}); } catch(e) {}
    return true;
  }
};

// ==========================================
// SERVICES CRUD
// ==========================================
export const ServicesService = {
  getAll(): Service[] {
    const items = getItem<Service[]>(STORAGE_KEYS.SERVICES, SEED_SERVICES);
    return [...items].sort((a, b) => (a.order || 99) - (b.order || 99));
  },

  getPublished(): Service[] {
    return this.getAll().filter((s) => s.status !== 'draft' && s.status !== 'archived');
  },

  getHomeHighlights(): Service[] {
    const published = this.getPublished();
    const highlights = published.filter((s) => s.highlight !== false);
    return highlights.length > 0 ? highlights : published.slice(0, 3);
  },

  getById(id: string): Service | undefined {
    return this.getAll().find((s) => s.id === id);
  },

  save(service: Partial<Service> & { title: string }): Service {
    const list = this.getAll();
    const now = new Date().toISOString().split('T')[0];

    if (service.id) {
      const idx = list.findIndex((s) => s.id === service.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...service,
          updatedAt: now
        };
        setItem(STORAGE_KEYS.SERVICES, list);
        ActivityLogService.log('đã cập nhật dịch vụ', 'service', list[idx].title);
        return list[idx];
      }
    }

    // Create new service
    const newId = service.id || `service-${Date.now()}`;
    const newService: Service = {
      id: newId,
      tag: service.tag || 'Trọng tâm',
      title: service.title,
      subTitle: service.subTitle || '',
      shortDescription: service.shortDescription || '',
      features: service.features || [],
      image: service.image || '/images/hero-1.webp',
      icon: service.icon || '',
      highlight: service.highlight ?? true,
      price: service.price || '',
      order: service.order ?? (list.length + 1),
      status: service.status || 'published',
      createdAt: now,
      updatedAt: now
    };

    list.push(newService);
    setItem(STORAGE_KEYS.SERVICES, list);
    ActivityLogService.log('đã thêm dịch vụ mới', 'service', newService.title);
    return newService;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const item = list.find((s) => s.id === id);
    if (!item) return false;
    const filtered = list.filter((s) => s.id !== id);
    setItem(STORAGE_KEYS.SERVICES, filtered);
    ActivityLogService.log('đã xóa dịch vụ', 'service', item.title);
    return true;
  },

  toggleHighlight(id: string): Service | null {
    const list = this.getAll();
    const item = list.find((s) => s.id === id);
    if (!item) return null;
    item.highlight = !item.highlight;
    item.updatedAt = new Date().toISOString().split('T')[0];
    setItem(STORAGE_KEYS.SERVICES, list);
    ActivityLogService.log(
      item.highlight ? 'đã ghim dịch vụ lên trang chủ' : 'đã bỏ ghim dịch vụ khỏi trang chủ',
      'service',
      item.title
    );
    return item;
  },

  updateStatus(id: string, status: ContentStatus): Service | null {
    const list = this.getAll();
    const item = list.find((s) => s.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString().split('T')[0];
    setItem(STORAGE_KEYS.SERVICES, list);
    ActivityLogService.log(`đã đổi trạng thái dịch vụ sang ${status}`, 'service', item.title);
    return item;
  },

  duplicate(id: string): Service | null {
    const source = this.getById(id);
    if (!source) return null;
    const duplicated: Partial<Service> = {
      ...source,
      id: undefined,
      title: `${source.title} (Bản sao)`,
      status: 'draft',
      highlight: false
    };
    return this.save(duplicated as any);
  }
};

// ==========================================
// CLIENTS CRUD
// ==========================================
export const ClientsService = {
  getAll(): Client[] {
    return getItem<Client[]>(STORAGE_KEYS.CLIENTS, SEED_CLIENTS);
  },

  getById(id: string): Client | undefined {
    return this.getAll().find((c) => c.id === id);
  },

  save(client: Partial<Client> & { name: string; industry: string }): Client {
    const list = this.getAll();
    const now = new Date().toISOString().split('T')[0];

    if (client.id) {
      const index = list.findIndex((c) => c.id === client.id);
      if (index >= 0) {
        const updated = { ...list[index], ...client };
        list[index] = updated;
        setItem(STORAGE_KEYS.CLIENTS, list);
        ActivityLogService.log('đã cập nhật khách hàng', 'client', updated.name);
        return updated;
      }
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: client.name,
      logo: client.logo || '/images/testimonial-1.webp',
      industry: client.industry,
      website: client.website,
      contactPerson: client.contactPerson,
      phone: client.phone,
      email: client.email,
      facebook: client.facebook,
      tiktok: client.tiktok,
      youtube: client.youtube,
      notes: client.notes,
      projectCount: 0,
      status: client.status || 'active',
      createdAt: now
    };

    list.unshift(newClient);
    setItem(STORAGE_KEYS.CLIENTS, list);
    ActivityLogService.log('đã thêm khách hàng mới', 'client', newClient.name);
    return newClient;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const item = list.find((c) => c.id === id);
    if (!item) return false;
    setItem(
      STORAGE_KEYS.CLIENTS,
      list.filter((c) => c.id !== id)
    );
    ActivityLogService.log('đã xóa khách hàng', 'client', item.name);
    return true;
  }
};

// ==========================================
// MEDIA LIBRARY CRUD
// ==========================================
export const MediaService = {
  getAll(): MediaItem[] {
    return getItem<MediaItem[]>(STORAGE_KEYS.MEDIA, SEED_MEDIA);
  },

  add(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const list = this.getAll();
    const newItem: MediaItem = {
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...item
    };
    list.unshift(newItem);
    setItem(STORAGE_KEYS.MEDIA, list);
    ActivityLogService.log('đã tải lên tệp mới', 'media', newItem.filename);
    return newItem;
  },

  update(id: string, updates: Partial<MediaItem>): MediaItem | null {
    const list = this.getAll();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    setItem(STORAGE_KEYS.MEDIA, list);
    return list[index];
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const item = list.find((m) => m.id === id);
    if (!item) return false;
    setItem(
      STORAGE_KEYS.MEDIA,
      list.filter((m) => m.id !== id)
    );
    ActivityLogService.log('đã xóa tệp media', 'media', item.filename);
    return true;
  }
};

// ==========================================
// LEADS CRM CRUD
// ==========================================
export const LeadsService = {
  getAll(): Lead[] {
    return getItem<Lead[]>(STORAGE_KEYS.LEADS, SEED_LEADS);
  },

  updateStatus(id: string, status: LeadStatus, notes?: string): Lead | null {
    const list = this.getAll();
    const item = list.find((l) => l.id === id);
    if (!item) return null;
    item.status = status;
    if (notes) item.notes = notes;
    setItem(STORAGE_KEYS.LEADS, list);
    ActivityLogService.log(`đã đổi trạng thái lead sang ${status}`, 'lead', item.name);
    return item;
  },

  add(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const list = this.getAll();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...lead
    };
    list.unshift(newLead);
    setItem(STORAGE_KEYS.LEADS, list);
    NotificationService.add({
      title: 'Lead mới từ website',
      message: `${newLead.name} (${newLead.phone}) vừa để lại thông tin tư vấn.`,
      type: 'alert',
      link: '/admin/leads'
    });
    return newLead;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const item = list.find((l) => l.id === id);
    if (!item) return false;
    setItem(
      STORAGE_KEYS.LEADS,
      list.filter((l) => l.id !== id)
    );
    ActivityLogService.log('đã xóa lead', 'lead', item.name);
    return true;
  }
};

// ==========================================
// USERS CRUD
// ==========================================
export const UsersService = {
  getAll(): CMSUser[] {
    return getItem<CMSUser[]>(STORAGE_KEYS.USERS, SEED_USERS);
  },

  getById(id: string): CMSUser | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  update(id: string, updates: Partial<CMSUser>): CMSUser | null {
    const list = this.getAll();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    setItem(STORAGE_KEYS.USERS, list);
    return list[index];
  }
};

// ==========================================
// ACTIVITY LOGS
// ==========================================
export const ActivityLogService = {
  getAll(): ActivityLog[] {
    return getItem<ActivityLog[]>(STORAGE_KEYS.LOGS, SEED_ACTIVITY_LOGS);
  },

  log(action: string, entityType: ActivityLog['entityType'], entityTitle: string): void {
    const list = this.getAll();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'u-admin-1',
      userName: 'Nguyễn Heona',
      action,
      entityType,
      entityTitle,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    list.unshift(newLog);
    // Keep max 50 logs
    setItem(STORAGE_KEYS.LOGS, list.slice(0, 50));
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================
export const NotificationService = {
  getAll(): NotificationItem[] {
    return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },

  getUnreadCount(): number {
    return this.getAll().filter((n) => !n.read).length;
  },

  markAllRead(): void {
    const list = this.getAll().map((n) => ({ ...n, read: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  add(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
    const list = this.getAll();
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...item
    };
    list.unshift(notif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 20));
    return notif;
  }
};
