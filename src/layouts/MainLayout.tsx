import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import {
  business,
  hasConfirmedPhone,
  hasConfirmedWhatsapp,
  hasConfirmedHours,
  hasConfirmedAddress,
} from '../config/business';
import { trackEvent } from '../config/analytics';
import { TAXI_SERVICES } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';
import { BLOG_ARTICLES } from '../data/blogsData';
import { sanitizeWhatsappNumber } from '../utils/whatsapp';

export interface MainLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Taxi Services', path: '/services/' },
    { label: 'Tours', path: '/tours/' },
    { label: 'Travel Blog', path: '/blog/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Contact', path: '/contact/' },
  ];

  const cleanWa = sanitizeWhatsappNumber(business.whatsapp);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#101820]">
      {/* Skip to main content for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-[#F5C518] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#101820]"
      >
        Skip to main content
      </a>

      {/* Main Navigation Header — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E5E0D5] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single clean text element wordmark */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            aria-label="Yellow Go Taxi Home"
            className="text-xl font-extrabold tracking-tight text-[#101820] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101820]"
          >
            {business.name}
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700"
          >
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 underline-offset-8 hover:text-[#101820] hover:underline ${
                    isActive
                      ? 'font-bold text-[#101820] underline decoration-[#F5C518] decoration-2'
                      : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Hamburger Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/#booking-section"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  if (currentPath !== '/') {
                    onNavigate('/');
                    setTimeout(() => {
                      document
                        .getElementById('booking-section')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  } else {
                    document
                      .getElementById('booking-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#101820] px-4 py-2 text-xs sm:text-sm font-bold text-[#F5C518] transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101820]"
            >
              Book Now
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-[#101820] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#101820]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Navigation Menu Drawer (Exposes all services, 10 tours, 10 blogs, FAQs, About, Contact & Legal pages) */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Complete Site Navigation"
            className="md:hidden max-h-[82vh] overflow-y-auto border-t border-slate-200 bg-white px-4 py-5 shadow-xl"
          >
            <div className="space-y-6">
              {/* Primary Pages */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">Main Pages</p>
                <ul className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'Taxi Services', path: '/services/' },
                    { label: 'All Tours', path: '/tours/' },
                    { label: 'Travel Blog', path: '/blog/' },
                    { label: 'About Us', path: '/about/' },
                    { label: 'Contact Us', path: '/contact/' },
                    { label: 'FAQs', path: '/faq/' },
                  ].map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        onClick={(e) => handleLinkClick(e, link.path)}
                        className="flex min-h-[44px] items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#101820] hover:bg-[#FAF9F5]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 Dedicated Service Pages */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">Taxi Services</p>
                <ul className="grid grid-cols-2 gap-2">
                  {TAXI_SERVICES.map((service) => (
                    <li key={service.id}>
                      <a
                        href={service.path}
                        onClick={(e) => handleLinkClick(e, service.path)}
                        className="flex min-h-[44px] items-center rounded-lg bg-[#FAF9F5] px-3 py-2 text-xs font-semibold text-[#101820] hover:bg-[#F5C518]/20"
                      >
                        {service.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* All 10 Dedicated Tour Pages */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">
                  10 Outstation Tour Destinations
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {TOUR_PAGES.map((tour) => (
                    <li key={tour.id}>
                      <a
                        href={tour.path}
                        onClick={(e) => handleLinkClick(e, tour.path)}
                        className="flex min-h-[40px] items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#FAF9F5] hover:text-[#101820]"
                      >
                        <span>Coimbatore to {tour.destinationName}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* All 10 Dedicated Travel Blog Articles */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">Travel Guides &amp; Blog</p>
                <ul className="space-y-1">
                  {BLOG_ARTICLES.map((post) => (
                    <li key={post.id}>
                      <a
                        href={post.path}
                        onClick={(e) => handleLinkClick(e, post.path)}
                        className="block rounded-md px-2.5 py-2 text-xs text-slate-700 hover:bg-[#FAF9F5] hover:text-[#101820]"
                      >
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Policies */}
              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-bold text-slate-400 mb-2">Legal &amp; Policies</p>
                <ul className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
                  <li>
                    <a
                      href="/privacy-policy/"
                      onClick={(e) => handleLinkClick(e, '/privacy-policy/')}
                      className="underline hover:text-[#101820]"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms-and-conditions/"
                      onClick={(e) => handleLinkClick(e, '/terms-and-conditions/')}
                      className="underline hover:text-[#101820]"
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/cancellation-refund-policy/"
                      onClick={(e) => handleLinkClick(e, '/cancellation-refund-policy/')}
                      className="underline hover:text-[#101820]"
                    >
                      Cancellation &amp; Refund Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Floating WhatsApp CTA — Rendered ONLY when business WhatsApp number is configured */}
      {hasConfirmedWhatsapp() && cleanWa && (
        <a
          href={`https://wa.me/${cleanWa}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'floating_cta' })}
          aria-label="Chat with Yellow Go Taxi on WhatsApp"
          className="fixed bottom-5 right-5 z-30 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#15803D] px-4 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">WhatsApp Enquiry</span>
        </a>
      )}

      {/* Comprehensive SEO & Navigation Footer */}
      <footer className="border-t border-slate-800 bg-[#101820] text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: Brand & Configurable Contact Summary */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="inline-block text-2xl font-extrabold tracking-tight text-white"
              >
                <span className="text-[#F5C518]">Yellow Go</span> Taxi
              </a>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                Local city rides, flexible hourly rentals, point-to-point outstation drops, and
                multi-day round-trip tours planned for {business.city}, {business.state},{' '}
                {business.country}.
              </p>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs space-y-2">
                <p className="font-semibold text-[#F5C518]">
                  Business Contact &amp; Operating Hubs
                </p>
                <p>
                  <span className="text-slate-400">Primary Address:</span>{' '}
                  {hasConfirmedAddress()
                    ? business.address
                    : 'Pending owner configuration in src/config/business.ts'}
                </p>
                <p>
                  <span className="text-slate-400">Operating Hubs:</span>{' '}
                  {business.operatingHubsSummary}
                </p>
                <p>
                  <span className="text-slate-400">Call / WhatsApp:</span>{' '}
                  {hasConfirmedPhone() ? (
                    <a
                      href={`tel:${business.phone.replace(/\s+/g, '')}`}
                      onClick={() => trackEvent('phone_click', { location: 'footer' })}
                      className="font-mono-tabular font-semibold text-white hover:text-[#F5C518] hover:underline"
                    >
                      {business.phone}
                    </a>
                  ) : (
                    'Pending owner configuration'
                  )}
                </p>
                {hasConfirmedHours() && (
                  <p>
                    <span className="text-slate-400">Operating Hours:</span>{' '}
                    {business.operatingHours}
                  </p>
                )}
              </div>
            </div>

            {/* Column 2: Taxi Services & Company */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Taxi Services</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/services/"
                    onClick={(e) => handleLinkClick(e, '/services/')}
                    className="hover:text-[#F5C518] transition-colors"
                  >
                    All Taxi Services Overview
                  </a>
                </li>
                {TAXI_SERVICES.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.path}
                      onClick={(e) => handleLinkClick(e, s.path)}
                      className="hover:text-[#F5C518] transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-white pt-4">Company &amp; Help</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/about/"
                    onClick={(e) => handleLinkClick(e, '/about/')}
                    className="hover:text-[#F5C518] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact/"
                    onClick={(e) => handleLinkClick(e, '/contact/')}
                    className="hover:text-[#F5C518] transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/faq/"
                    onClick={(e) => handleLinkClick(e, '/faq/')}
                    className="hover:text-[#F5C518] transition-colors"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: All 10 Dedicated Tour Routes */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Outstation Tours</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/tours/"
                    onClick={(e) => handleLinkClick(e, '/tours/')}
                    className="font-semibold text-[#F5C518] hover:underline"
                  >
                    Tour Directory (All 10 Routes)
                  </a>
                </li>
                {TOUR_PAGES.map((tour) => (
                  <li key={tour.id}>
                    <a
                      href={tour.path}
                      onClick={(e) => handleLinkClick(e, tour.path)}
                      className="hover:text-[#F5C518] transition-colors"
                    >
                      Coimbatore to {tour.destinationName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: All 10 Travel Blog Guides */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Travel Blog &amp; Guides</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/blog/"
                    onClick={(e) => handleLinkClick(e, '/blog/')}
                    className="font-semibold text-[#F5C518] hover:underline"
                  >
                    All Travel Articles
                  </a>
                </li>
                {BLOG_ARTICLES.map((blog) => (
                  <li key={blog.id}>
                    <a
                      href={blog.path}
                      onClick={(e) => handleLinkClick(e, blog.path)}
                      className="hover:text-[#F5C518] transition-colors line-clamp-1"
                    >
                      {blog.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal Policies */}
          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} {business.name}. Planned for {business.city},{' '}
              {business.state}, {business.country}.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/privacy-policy/"
                onClick={(e) => handleLinkClick(e, '/privacy-policy/')}
                className="hover:text-white underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/terms-and-conditions/"
                onClick={(e) => handleLinkClick(e, '/terms-and-conditions/')}
                className="hover:text-white underline-offset-4 hover:underline"
              >
                Terms &amp; Conditions
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/cancellation-refund-policy/"
                onClick={(e) => handleLinkClick(e, '/cancellation-refund-policy/')}
                className="hover:text-white underline-offset-4 hover:underline"
              >
                Cancellation &amp; Refund Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
