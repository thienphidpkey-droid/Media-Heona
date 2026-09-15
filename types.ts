export type Role = 'admin' | 'editor' | 'contributor';

export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export type EducationCategory = 'Expert Spotlight' | 'School Story' | 'Event to Content' | 'Branding' | 'Tiktok' | 'Event';

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface SEOMetadata {
  title?: string;
  metaDescription?: string;
  focusKeyword?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  shortDesc: string;
  content: string; // HTML or JSON block structure
  thumbnail: string;
  author: string;
  authorId?: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  views: number;
  publishedAt?: string;
  scheduledAt?: string;
  updatedAt: string;
  createdAt: string;
  seo?: SEOMetadata;
  ctaBlock?: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export interface ProjectProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

export interface ProjectResult {
  id: string;
  number: string; // e.g. "2M+", "100+", "50K+"
  label: string; // e.g. "Reach", "Videos Produced"
}

export interface Project {
  id: number | string;
  title: string;
  slug?: string;
  description: string;
  image: string; // cover image
  coverImage?: string;
  category: string; // e.g. Expert Spotlight, School Story, Event to Content
  clientId?: string;
  clientName?: string;
  industry?: string;
  services?: string[]; // e.g. Personal Branding, TikTok, Photography...
  location?: string;
  startDate?: string;
  endDate?: string;
  featuredVideo?: string;
  status?: ContentStatus;
  
  // Overview
  projectIntro?: string;
  clientBackground?: string;
  challenge?: string;
  projectGoals?: string;

  // Solutions & Process
  solutionSummary?: string;
  processSteps?: ProjectProcessStep[];

  // Results
  results?: ProjectResult[];
  qualitativeResults?: string[];

  // Media
  gallery?: string[];

  // Testimonial
  testimonial?: {
    avatar?: string;
    name: string;
    position?: string;
    company?: string;
    content: string;
    videoUrl?: string;
  };

  seo?: SEOMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  tag: string;
  title: string;
  subTitle?: string;
  features: string[];
  image: string;
  icon?: string;
  shortDescription?: string;
  fullDescription?: string;
  benefits?: string[];
  deliverables?: string[];
  highlight?: boolean; // Hiển thị tại mục Dịch vụ trọng tâm trên Trang chủ
  price?: string;
  order?: number;
  status?: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  tag: string;
  title: string;
  meta: string;
  content?: string;
  date?: string;
  author?: string;
  image?: string;
  views?: number;
}

export interface PricingPlan {
  id: number;
  label: string;
  name: string;
  desc: string;
  features: string[];
  price: string;
  note: string;
  highlight?: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  facebook: string;
  youtube: string;
  zalo: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website?: string;
  industry: string;
  description?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  notes?: string;
  projectCount?: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  fileType: 'image' | 'video';
  mimeType?: string;
  sizeBytes?: number;
  resolution?: string;
  altText?: string;
  caption?: string;
  clientId?: string;
  projectId?: string;
  uploadedBy?: string;
  createdAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  serviceInterested?: string;
  message: string;
  sourcePage?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  entityType: 'article' | 'project' | 'service' | 'client' | 'media' | 'user' | 'lead';
  entityTitle: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ContentState {
  projects: Project[];
  services: Service[];
  contactInfo: ContactInfo;
  testimonials: Testimonial[];
  articles?: Article[];
}
