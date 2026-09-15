import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ContentProvider } from './context/ContentContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

// Admin Imports
import { ToastProvider } from './admin/components/Toast';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { Login } from './admin/pages/Login';
import { Dashboard } from './admin/pages/Dashboard';
import { ArticleList } from './admin/pages/articles/ArticleList';
import { ArticleEditor } from './admin/pages/articles/ArticleEditor';
import { ProjectList } from './admin/pages/projects/ProjectList';
import { ProjectEditor } from './admin/pages/projects/ProjectEditor';
import { ServiceList } from './admin/pages/services/ServiceList';
import { ServiceEditor } from './admin/pages/services/ServiceEditor';
import { MediaLibrary } from './admin/pages/media/MediaLibrary';
import { ClientList } from './admin/pages/clients/ClientList';
import { LeadList } from './admin/pages/leads/LeadList';
import { ContentCalendar } from './admin/pages/calendar/ContentCalendar';
import { UserList } from './admin/pages/users/UserList';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Helper for public website pages (wrapped in public Layout)
const PublicPage: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return <Layout>{element}</Layout>;
};

export const AppRoutes: React.FC = () => (
  <Routes>
    {/* ================= ADMIN CMS ROUTES ================= */}
    <Route path="/admin/login" element={<Login />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/articles"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ArticleList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/articles/new"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ArticleEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/articles/:id"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ArticleEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/projects"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/projects/new"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/projects/:id"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/services"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ServiceList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/services/new"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ServiceEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/services/:id"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ServiceEditor />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/media"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <MediaLibrary />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/clients"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ClientList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/leads"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <LeadList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/calendar"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <ContentCalendar />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <UserList />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    {/* ================= PUBLIC WEBSITE ROUTES ================= */}
    <Route path="/" element={<PublicPage element={<Home />} />} />
    <Route path="/about" element={<PublicPage element={<About />} />} />
    <Route path="/services" element={<PublicPage element={<Services />} />} />
    <Route path="/projects" element={<PublicPage element={<Projects />} />} />
    <Route path="/pricing" element={<PublicPage element={<Pricing />} />} />
    <Route path="/blog" element={<PublicPage element={<Blog />} />} />
    <Route path="/blog/:slug" element={<PublicPage element={<Blog />} />} />
    <Route path="/contact" element={<PublicPage element={<Contact />} />} />
    <Route path="/privacy" element={<PublicPage element={<Privacy />} />} />
    <Route path="*" element={<PublicPage element={<NotFound />} />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <ToastProvider>
      <ContentProvider>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </ContentProvider>
    </ToastProvider>
  );
};

export default App;
