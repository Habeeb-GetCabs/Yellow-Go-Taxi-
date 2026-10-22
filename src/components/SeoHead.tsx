import React, { useEffect } from 'react';
import { business } from '../config/business';

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article';
  breadcrumbs?: BreadcrumbEntry[];
  articleSchema?: {
    headline: string;
    datePublished?: string;
    authorName: string;
    description: string;
  };
}

export function buildStructuredDataJson(props: SeoHeadProps): Record<string, unknown>[] {
  const baseUrl = (business.websiteUrl || 'https://yellowgotaxi.com').replace(/\/$/, '');
  const fullUrl = `${baseUrl}${props.canonicalPath}`;

  const schemas: Record<string, unknown>[] = [];

  // 1. TaxiService / LocalBusiness schema (Strictly factual — never invents unconfirmed phone, street address, or reviews)
  const taxiSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: business.name,
    url: baseUrl,
    areaServed: {
      '@type': 'City',
      name: business.city,
      containedInPlace: {
        '@type': 'State',
        name: business.state,
      },
    },
  };

  if (business.phone.trim()) {
    taxiSchema.telephone = business.phone.trim();
  }
  if (business.email.trim()) {
    taxiSchema.email = business.email.trim();
  }
  if (business.address.trim()) {
    taxiSchema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.trim(),
      addressLocality: business.city,
      addressRegion: business.state,
      addressCountry: business.country,
    };
  }

  schemas.push(taxiSchema);

  // 2. BreadcrumbList schema
  if (props.breadcrumbs && props.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: props.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.path}`,
      })),
    });
  }

  // 3. BlogPosting schema for blog articles
  if (props.articleSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: props.articleSchema.headline,
      description: props.articleSchema.description,
      mainEntityOfPage: fullUrl,
      author: {
        '@type': 'Organization',
        name: props.articleSchema.authorName || business.name,
      },
      publisher: {
        '@type': 'Organization',
        name: business.name,
      },
    });
  }

  return schemas;
}

export const SeoHead: React.FC<SeoHeadProps> = (props) => {
  const { title, description, canonicalPath, ogType = 'website' } = props;
  const baseUrl = (business.websiteUrl || 'https://yellowgotaxi.com').replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Update JSON-LD script
    const scriptId = 'ygt-schema-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(buildStructuredDataJson(props));
  }, [title, description, canonicalUrl, ogType, props]);

  return null;
};
