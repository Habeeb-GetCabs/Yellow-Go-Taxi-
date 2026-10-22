import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { TAXI_SERVICES } from '../src/data/servicesData';
import { TOUR_PAGES } from '../src/data/toursData';
import { BLOG_ARTICLES } from '../src/data/blogsData';
import { buildStructuredDataJson, type SeoHeadProps } from '../src/components/SeoHead';

interface RouteMeta extends SeoHeadProps {
  routePath: string;
}

const ALL_ROUTES: RouteMeta[] = [
  {
    routePath: '/',
    title: 'Yellow Go Taxi | Coimbatore Local, Outstation & Tour Taxi Service',
    description:
      'Plan your journey in Coimbatore with Yellow Go Taxi. Convenient booking experience, transparent trip fare estimates for local, hourly, outstation drop, and round-trip tours.',
    canonicalPath: '/',
  },
  {
    routePath: '/services/',
    title: 'Taxi Services in Coimbatore | Local, Hourly, Outstation Drop & Round Trip | Yellow Go Taxi',
    description:
      'Explore Yellow Go Taxi’s four core booking modes in Coimbatore: Local point-to-point city rides, Hourly Rental packages, Outstation Drop transfers, and Round Trip tours.',
    canonicalPath: '/services/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Taxi Services', path: '/services/' },
    ],
  },
  ...TAXI_SERVICES.map((s) => ({
    routePath: s.path,
    title: s.metaTitle,
    description: s.metaDescription,
    canonicalPath: s.path,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Taxi Services', path: '/services/' },
      { name: s.title, path: s.path },
    ],
  })),
  // Service alias routes for legacy / alternate slugs to prevent 404 on static hosting
  {
    routePath: '/services/coimbatore-local-taxi/',
    title: 'Coimbatore Local Taxi Service | Point-to-Point City Rides | Yellow Go Taxi',
    description: 'Book a Coimbatore local taxi for airport transfers, railway station pickups, hospital visits, and city point-to-point travel with clear upfront fare estimates.',
    canonicalPath: '/services/local-taxi/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Taxi Services', path: '/services/' },
      { name: 'Local Taxi', path: '/services/local-taxi/' },
    ],
  },
  {
    routePath: '/services/outstation-taxi-coimbatore/',
    title: 'Coimbatore Outstation Drop Taxi | Point-to-Point Intercity Cabs | Yellow Go Taxi',
    description: 'Book an Outstation Drop taxi from Coimbatore to Ooty, Kodaikanal, Munnar, Palani, Valparai, Salem, or Bengaluru. Transparent point-to-point fare estimates.',
    canonicalPath: '/services/outstation-drop/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Taxi Services', path: '/services/' },
      { name: 'Outstation Drop', path: '/services/outstation-drop/' },
    ],
  },
  {
    routePath: '/services/hourly-car-rental-coimbatore/',
    title: 'Hourly Taxi Rental in Coimbatore | Flexible City Packages | Yellow Go Taxi',
    description: 'Hire a taxi by the hour in Coimbatore for business meetings, wedding shopping, temple visits, or local sightseeing. Clear hourly package fare estimates.',
    canonicalPath: '/services/hourly-rental/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Taxi Services', path: '/services/' },
      { name: 'Hourly Rental', path: '/services/hourly-rental/' },
    ],
  },
  {
    routePath: '/tours/',
    title: 'Coimbatore Outstation Tours & Hill Station Taxi Packages | Yellow Go Taxi',
    description:
      'Browse all 10 dedicated outstation tour routes starting from Coimbatore: Ooty, Kodaikanal, Isha Yoga Center, Valparai, Munnar, Yercaud, Masinagudi, Topslip, Palani & Chikmagalur.',
    canonicalPath: '/tours/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tours', path: '/tours/' },
    ],
  },
  ...TOUR_PAGES.map((t) => ({
    routePath: t.path,
    title: t.metaTitle,
    description: t.metaDescription,
    canonicalPath: t.path,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tours', path: '/tours/' },
      { name: `Coimbatore to ${t.destinationName}`, path: t.path },
    ],
  })),
  {
    routePath: '/blog/',
    title: 'Coimbatore Travel Blog & Outstation Road Trip Guides | Yellow Go Taxi',
    description:
      'Read 10 practical travel guides covering Ooty, Valparai, Isha Yoga Center, weekend getaways from Coimbatore, monsoon driving tips, and outstation taxi checklists.',
    canonicalPath: '/blog/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Travel Blog', path: '/blog/' },
    ],
  },
  ...BLOG_ARTICLES.map((b) => ({
    routePath: b.path,
    title: b.metaTitle,
    description: b.metaDescription,
    canonicalPath: b.path,
    ogType: 'article' as const,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Travel Blog', path: '/blog/' },
      { name: b.title, path: b.path },
    ],
    articleSchema: {
      headline: b.h1,
      authorName: b.authorLabel,
      description: b.metaDescription,
    },
  })),
  {
    routePath: '/about/',
    title: 'About Yellow Go Taxi | Coimbatore Taxi & Outstation Tour Service',
    description:
      'Learn about Yellow Go Taxi, a taxi and tour booking service planned for Coimbatore, Tamil Nadu. Focused on transparent fare estimation and structured service modes.',
    canonicalPath: '/about/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about/' },
    ],
  },
  {
    routePath: '/contact/',
    title: 'Contact Yellow Go Taxi | Coimbatore Booking Enquiry & Support',
    description:
      'Get in touch with Yellow Go Taxi in Coimbatore for local cab enquiries, outstation drop quotes, and multi-day hill station tour bookings.',
    canonicalPath: '/contact/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact Us', path: '/contact/' },
    ],
  },
  {
    routePath: '/faq/',
    title: 'Frequently Asked Questions | Yellow Go Taxi Coimbatore',
    description:
      'Answers to common questions about Yellow Go Taxi booking modes, fare estimation, WhatsApp booking confirmation, outstation tours, and cancellation policies.',
    canonicalPath: '/faq/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'FAQs', path: '/faq/' },
    ],
  },
  {
    routePath: '/privacy-policy/',
    title: 'Privacy Policy | Yellow Go Taxi Coimbatore',
    description:
      'Privacy Policy for Yellow Go Taxi explaining how customer booking form inputs, contact enquiries, and analytics/advertising data are handled.',
    canonicalPath: '/privacy-policy/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy-policy/' },
    ],
  },
  {
    routePath: '/terms-and-conditions/',
    title: 'Terms & Conditions | Yellow Go Taxi Coimbatore',
    description:
      'Terms and Conditions governing taxi fare estimates, booking confirmation, route changes, tolls, and passenger responsibilities with Yellow Go Taxi.',
    canonicalPath: '/terms-and-conditions/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Terms & Conditions', path: '/terms-and-conditions/' },
    ],
  },
  {
    routePath: '/cancellation-refund-policy/',
    title: 'Cancellation & Refund Policy | Yellow Go Taxi Coimbatore',
    description:
      'Cancellation, rescheduling, and refund policy framework for Yellow Go Taxi bookings in Coimbatore.',
    canonicalPath: '/cancellation-refund-policy/',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Cancellation & Refund Policy', path: '/cancellation-refund-policy/' },
    ],
  },
  {
    routePath: '/404/',
    title: 'Page Not Found (404) | Yellow Go Taxi',
    description:
      'The requested page could not be found. Explore Yellow Go Taxi services, outstation tours, and travel guides from Coimbatore.',
    canonicalPath: '/404/',
  },
];

function escapeHtmlAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function runPrerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  let generatedCount = 0;

  for (const route of ALL_ROUTES) {
    const appHtml = renderToString(<App initialPath={route.routePath} />);
    const canonicalUrl = `https://yellowgotaxi.com${route.canonicalPath}`;
    const jsonLd = JSON.stringify(buildStructuredDataJson(route));

    let pageHtml = templateHtml
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtmlAttr(route.title)}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeHtmlAttr(route.description)}" />`
      )
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
      )
      .replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${escapeHtmlAttr(route.title)}" />`
      )
      .replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${escapeHtmlAttr(route.description)}" />`
      )
      .replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:title" content="${escapeHtmlAttr(route.title)}" />`
      )
      .replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:description" content="${escapeHtmlAttr(route.description)}" />`
      )
      .replace(
        '</head>',
        `<script id="ygt-schema-jsonld" type="application/ld+json">${jsonLd}</script>\n  </head>`
      )
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    if (route.routePath === '/') {
      fs.writeFileSync(templatePath, pageHtml, 'utf-8');
    } else {
      const cleanRel = route.routePath.replace(/^\//, '').replace(/\/$/, '');
      const targetDir = path.join(distDir, cleanRel);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf-8');
      if (route.routePath === '/404/') {
        fs.writeFileSync(path.join(distDir, '404.html'), pageHtml, 'utf-8');
      }
    }
    generatedCount++;
  }

  console.log(`Prerendered ${generatedCount} static HTML pages into dist/`);
}

runPrerender();
