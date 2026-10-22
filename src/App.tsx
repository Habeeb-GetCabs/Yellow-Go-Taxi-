import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ServicesDirectoryPage, ServiceDetailPage } from './pages/ServicesPage';
import { ToursDirectoryPage } from './pages/ToursDirectoryPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { BlogDirectoryPage, BlogDetailPage } from './pages/BlogPages';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
  CancellationRefundPolicyPage,
  NotFoundPage,
} from './pages/InfoAndLegalPages';
import { getServiceBySlug } from './data/servicesData';
import { getTourBySlug } from './data/toursData';
import { getBlogBySlug } from './data/blogsData';

const KNOWN_TOP_ROUTES = new Set([
  'services',
  'tours',
  'blog',
  'about',
  'contact',
  'faq',
  'privacy-policy',
  'terms-and-conditions',
  'cancellation-refund-policy',
  '404',
]);

/**
 * Detects if the site is running under a GitHub Pages repository subpath
 * (e.g. https://username.github.io/repo-name/) and returns the base prefix
 * (e.g. "/repo-name") or "" when running at domain root.
 */
export function getBasePrefix(): string {
  try {
    const metaBase = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL;
    if (metaBase && metaBase !== '/' && metaBase !== './') {
      return metaBase.replace(/\/$/, '');
    }
  } catch {
    // Ignore in Node test environment
  }

  if (typeof process !== 'undefined' && process.env?.VITE_BASE_PATH) {
    const envBase = process.env.VITE_BASE_PATH;
    if (envBase !== '/' && envBase !== './') {
      return envBase.replace(/\/$/, '');
    }
  }

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && !KNOWN_TOP_ROUTES.has(segments[0])) {
      return `/${segments[0]}`;
    }
  }
  return '';
}

export function normalizeRoutePath(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  let withoutQuery = rawPath.split('?')[0].split('#')[0];

  const basePrefix = getBasePrefix();
  if (basePrefix && withoutQuery.startsWith(basePrefix)) {
    withoutQuery = withoutQuery.slice(basePrefix.length) || '/';
  }

  if (!withoutQuery.startsWith('/')) {
    withoutQuery = `/${withoutQuery}`;
  }
  if (withoutQuery === '/') return '/';
  return withoutQuery.endsWith('/') ? withoutQuery : `${withoutQuery}/`;
}

export interface AppProps {
  initialPath?: string;
}

export function App({ initialPath }: AppProps = {}) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (initialPath) return normalizeRoutePath(initialPath);
    if (typeof window !== 'undefined') {
      return normalizeRoutePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizeRoutePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((nextPath: string) => {
    const normalized = normalizeRoutePath(nextPath);
    if (typeof window !== 'undefined') {
      const basePrefix = getBasePrefix();
      const browserUrl = basePrefix ? `${basePrefix}${normalized}` : normalized;
      window.history.pushState({}, '', browserUrl);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    setCurrentPath(normalized);
  }, []);

  const renderPage = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/services/') {
      return <ServicesDirectoryPage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace(/^\/services\//, '').replace(/\/$/, '');
      const service = getServiceBySlug(slug);
      if (service) {
        return <ServiceDetailPage service={service} onNavigate={handleNavigate} />;
      }
    }

    if (currentPath === '/tours/') {
      return <ToursDirectoryPage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/tours/')) {
      const slug = currentPath.replace(/^\/tours\//, '').replace(/\/$/, '');
      const tour = getTourBySlug(slug);
      if (tour) {
        return <TourDetailPage tour={tour} onNavigate={handleNavigate} />;
      }
    }

    if (currentPath === '/blog/') {
      return <BlogDirectoryPage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace(/^\/blog\//, '').replace(/\/$/, '');
      const article = getBlogBySlug(slug);
      if (article) {
        return <BlogDetailPage article={article} onNavigate={handleNavigate} />;
      }
    }

    if (currentPath === '/about/') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/contact/') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/faq/') {
      return <FaqPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/privacy-policy/') {
      return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/terms-and-conditions/') {
      return <TermsAndConditionsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/cancellation-refund-policy/') {
      return <CancellationRefundPolicyPage onNavigate={handleNavigate} />;
    }

    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={handleNavigate}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
