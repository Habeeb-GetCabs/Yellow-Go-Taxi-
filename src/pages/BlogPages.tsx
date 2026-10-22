import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BLOG_ARTICLES, type BlogArticleData } from '../data/blogsData';
import { TOUR_PAGES } from '../data/toursData';

export interface BlogDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const BlogDirectoryPage: React.FC<BlogDirectoryPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <SeoHead
        title="Coimbatore Travel Blog & Outstation Road Trip Guides | Yellow Go Taxi"
        description="Read 10 practical travel guides covering Ooty, Valparai, Isha Yoga Center, weekend getaways from Coimbatore, monsoon driving tips, and outstation taxi checklists."
        canonicalPath="/blog/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Travel Blog', path: '/blog/' },
        ]}
      />

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Travel Blog', path: '/blog/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            Editorial Route Guides
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            Coimbatore Travel Blog &amp; <span className="text-[#FFC400]">Route Guides</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Practical road-trip planning articles, seasonal weather comparisons, and route checklists
            for travellers starting from Coimbatore, Tamil Nadu.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_ARTICLES.map((article, idx) => (
              <article
                key={article.id}
                className="group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200"
              >
                <div className="overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={article.imageFilename}
                    alt={article.imageAlt}
                    priority={idx < 3}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#526174]">
                      <span className="rounded bg-[#FFC400] px-2.5 py-0.5 text-[#111820] font-extrabold">
                        {article.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readingTime}</span>
                    </div>

                    <h2 className="mt-3 text-lg sm:text-xl font-extrabold text-[#111820] leading-snug">
                      <a
                        href={article.path}
                        onClick={(e) => handleLink(e, article.path)}
                        className="hover:underline"
                      >
                        {article.title}
                      </a>
                    </h2>

                    <p className="mt-2.5 text-sm text-[#263241] leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8DFE8] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#526174]">{article.authorLabel}</span>
                    <a
                      href={article.path}
                      onClick={(e) => handleLink(e, article.path)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFC400] hover:bg-[#F5B800] px-3 py-1.5 font-extrabold text-[#111820] transition-colors whitespace-nowrap"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export interface BlogDetailPageProps {
  article: BlogArticleData;
  onNavigate: (path: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ article, onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const otherArticles = BLOG_ARTICLES.filter((b) => b.id !== article.id).slice(0, 3);

  return (
    <>
      <SeoHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalPath={article.path}
        ogType="article"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Travel Blog', path: '/blog/' },
          { name: article.title, path: article.path },
        ]}
        articleSchema={{
          headline: article.h1,
          authorName: article.authorLabel,
          description: article.metaDescription,
        }}
      />

      <article className="bg-[#F7F6F1]">
        {/* Article Header */}
        <header className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              lightText
              onNavigate={onNavigate}
              items={[
                { name: 'Home', path: '/' },
                { name: 'Travel Blog', path: '/blog/' },
                { name: article.title, path: article.path },
              ]}
            />

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-3 font-semibold">
              <span className="rounded-md bg-[#FFC400] px-2.5 py-0.5 text-[#111820] font-extrabold">
                {article.categoryLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>By {article.authorLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Published: {article.publishedDate}</span>
            </div>

            <h1 className="mt-3.5 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              {article.h1}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </header>

        {/* Article Body */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <div className="rounded-2xl overflow-hidden border-2 border-[#D8DFE8] shadow-lg bg-[#111820]">
            <AssetImage
              filename={article.imageFilename}
              alt={article.imageAlt}
              priority={true}
              className="w-full border-0"
            />
          </div>

          <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-10 space-y-8 shadow-sm">
            {article.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111820]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-base text-[#263241] leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="mt-3 list-disc list-inside space-y-2 text-sm sm:text-base text-[#263241] font-medium">
                    {section.bulletPoints.map((bp) => (
                      <li key={bp} className="leading-relaxed">
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Relevant Internal Links */}
            <div className="pt-6 border-t border-[#D8DFE8]">
              <h2 className="text-base font-extrabold text-[#111820]">
                Related Routes &amp; Services on Yellow Go Taxi
              </h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {article.internalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#D8DFE8] bg-[#F7F6F1] px-4 py-2 text-xs font-extrabold text-[#111820] hover:border-[#FFC400] hover:bg-[#FFC400]"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Relevant, Non-Intrusive Booking CTA */}
          <div className="rounded-2xl border-2 border-[#FFC400] bg-gradient-to-r from-[#111820] via-[#172536] to-[#111820] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 max-w-xl">
              <span className="inline-block rounded bg-[#FFC400] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111820]">
                Plan Your Journey
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white">{article.ctaHeading}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{article.ctaText}</p>
            </div>
            <a
              href={article.ctaLinkHref}
              onClick={(e) => handleLink(e, article.ctaLinkHref)}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#111820] shadow-md whitespace-nowrap shrink-0"
            >
              <span>{article.ctaLinkLabel}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            </a>
          </div>

          {/* More Articles & Tour Directory Links */}
          <div className="pt-6 border-t-2 border-[#D8DFE8] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#111820]">More Travel Guides</h2>
              <a
                href="/blog/"
                onClick={(e) => handleLink(e, '/blog/')}
                className="text-xs font-extrabold text-[#111820] hover:text-[#F5B800] underline"
              >
                View All 10 Articles →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherArticles.map((other) => (
                <a
                  key={other.id}
                  href={other.path}
                  onClick={(e) => handleLink(e, other.path)}
                  className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-4 hover:border-[#FFC400] transition-colors shadow-xs"
                >
                  <p className="text-xs font-bold text-[#526174]">{other.categoryLabel}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#111820] leading-snug">
                    {other.title}
                  </p>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#111820] mb-2.5">
                Explore Dedicated Outstation Tour Pages
              </h3>
              <div className="flex flex-wrap gap-2.5 text-xs">
                {TOUR_PAGES.slice(0, 6).map((t) => (
                  <a
                    key={t.id}
                    href={t.path}
                    onClick={(e) => handleLink(e, t.path)}
                    className="rounded-lg border border-[#D8DFE8] bg-[#F7F6F1] px-3 py-1.5 font-bold text-[#111820] hover:bg-[#FFC400]"
                  >
                    Coimbatore to {t.destinationName}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};
