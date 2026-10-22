import React from 'react';
import { ArrowRight, MapPin, Clock, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TOUR_PAGES, type TourPageData } from '../data/toursData';
import { BLOG_ARTICLES } from '../data/blogsData';
import { TAXI_SERVICES } from '../data/servicesData';
import { trackEvent } from '../config/analytics';

export interface TourDetailPageProps {
  tour: TourPageData;
  onNavigate: (path: string) => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({ tour, onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const relatedTours = TOUR_PAGES.filter((t) => tour.relatedTourSlugs.includes(t.slug));
  const relatedBlogs = BLOG_ARTICLES.filter((b) => tour.relatedBlogSlugs.includes(b.slug));

  return (
    <>
      <SeoHead
        title={tour.metaTitle}
        description={tour.metaDescription}
        canonicalPath={tour.path}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tours', path: '/tours/' },
          { name: `Coimbatore to ${tour.destinationName}`, path: tour.path },
        ]}
      />

      {/* Destination Hero Header */}
      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-10 sm:py-14 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Tours', path: '/tours/' },
              { name: `Coimbatore to ${tour.destinationName}`, path: tour.path },
            ]}
          />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3.5 max-w-3xl">
              <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                Dedicated Outstation Route Guide · {tour.shortTagline}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
                {tour.h1}
              </h1>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white font-bold">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-3 py-1.5 font-mono-tabular">
                  <MapPin className="h-4 w-4 text-[#FFC400]" aria-hidden="true" />
                  <span>Approx. {tour.approxOneWayKm} km (One-Way)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-3 py-1.5">
                  <Clock className="h-4 w-4 text-[#FFC400]" aria-hidden="true" />
                  <span>{tour.approxDriveTime}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-[#FFC400]" aria-hidden="true" />
                  <span>Suggested: {tour.recommendedDuration}</span>
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  trackEvent('tour_booking_cta_click', { destination: tour.slug });
                  document
                    .getElementById('tour-booking-calculator')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-6 py-3 text-sm font-extrabold text-[#111820] shadow-lg whitespace-nowrap cursor-pointer"
              >
                <span>Estimate {tour.destinationName} Fare</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Sticky Calculator */}
      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Destination Guide Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D8DFE8] shadow-lg bg-[#111820]">
                <AssetImage
                  filename={tour.imageFilename}
                  alt={tour.imageAlt}
                  priority={true}
                  className="w-full border-0"
                />
              </div>

              {/* Introductory Content & Verification Notice */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111820]">
                  About the Coimbatore to {tour.destinationName} Route
                </h2>
                {tour.introParagraphs.map((para, i) => (
                  <p key={i} className="text-sm sm:text-base text-[#263241] leading-relaxed">
                    {para}
                  </p>
                ))}

                <div className="mt-4 rounded-xl border-2 border-[#FFC400] bg-[#F7F6F1] p-4 flex items-start gap-3 text-xs text-[#263241]">
                  <Info className="h-5 w-5 text-[#111820] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-extrabold text-[#111820]">
                      Route Corridor &amp; Verification Note
                    </p>
                    <p className="mt-0.5">
                      <strong>Primary Highway:</strong> {tour.routeCorridor}
                    </p>
                    <p className="mt-1">{tour.verificationNote}</p>
                  </div>
                </div>
              </div>

              {/* Destination Highlights */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111820]">
                  Key Highlights in {tour.destinationName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.highlights.map((hl) => (
                    <div
                      key={hl.title}
                      className="rounded-xl border border-[#D8DFE8] bg-[#F7F6F1] p-4"
                    >
                      <h3 className="text-sm font-extrabold text-[#111820] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                        </div>
                        <span>{hl.title}</span>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#263241] leading-relaxed">
                        {hl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Itinerary */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111820]">
                    Suggested {tour.destinationName} Itinerary
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#526174]">
                    Flexible schedule template—customise your departure time and sightseeing stops
                    when confirming your booking.
                  </p>
                </div>

                <div className="space-y-4">
                  {tour.suggestedItinerary.map((step) => (
                    <div
                      key={step.dayOrPhase}
                      className="rounded-xl border border-[#D8DFE8] p-4 sm:p-5 bg-[#F7F6F1]"
                    >
                      <span className="inline-block rounded-md bg-[#111820] px-2.5 py-0.5 font-mono-tabular text-xs font-extrabold text-[#FFC400]">
                        {step.dayOrPhase}
                      </span>
                      <h3 className="mt-2 text-base font-extrabold text-[#111820]">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-[#263241] leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Travel Information */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#111820]">
                  Practical Travel Information &amp; Checkpost Notes
                </h2>
                <div className="divide-y divide-[#D8DFE8]">
                  {tour.practicalInfo.map((info) => (
                    <div key={info.label} className="py-3.5 first:pt-0 last:pb-0">
                      <h3 className="text-sm font-extrabold text-[#111820]">{info.label}</h3>
                      <p className="mt-1 text-sm text-[#263241] leading-relaxed">{info.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination FAQs */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#111820]">
                  FAQs — Coimbatore to {tour.destinationName} Taxi
                </h2>
                <div className="divide-y divide-[#D8DFE8]">
                  {tour.faqs.map((faq) => (
                    <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#111820]">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm text-[#263241] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Links to Related Tours, Blogs & Services */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-extrabold text-[#111820]">Related Outstation Tours</h2>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedTours.map((rel) => (
                      <a
                        key={rel.id}
                        href={rel.path}
                        onClick={(e) => handleLink(e, rel.path)}
                        className="rounded-xl border-2 border-[#D8DFE8] bg-[#F7F6F1] p-3.5 hover:border-[#FFC400] hover:bg-white transition-all"
                      >
                        <p className="text-xs font-mono-tabular font-bold text-[#526174]">
                          ~{rel.approxOneWayKm} km
                        </p>
                        <p className="mt-0.5 text-sm font-extrabold text-[#111820]">
                          Coimbatore to {rel.destinationName}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>

                {relatedBlogs.length > 0 && (
                  <div className="pt-4 border-t border-[#D8DFE8]">
                    <h3 className="text-sm font-extrabold text-[#111820]">
                      Helpful Travel Guides for This Route
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-xs sm:text-sm">
                      {relatedBlogs.map((blog) => (
                        <li key={blog.id}>
                          <a
                            href={blog.path}
                            onClick={(e) => handleLink(e, blog.path)}
                            className="font-bold text-[#263241] hover:text-[#111820] underline underline-offset-4"
                          >
                            {blog.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-[#D8DFE8]">
                  <h3 className="text-sm font-extrabold text-[#111820]">
                    Applicable Taxi Service Modes
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2.5 text-xs font-extrabold">
                    {TAXI_SERVICES.map((svc) => (
                      <a
                        key={svc.id}
                        href={svc.path}
                        onClick={(e) => handleLink(e, svc.path)}
                        className="rounded-lg border border-[#D8DFE8] bg-[#F7F6F1] px-3 py-1.5 text-[#111820] hover:bg-[#FFC400]"
                      >
                        {svc.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Form Pre-populated for this Destination */}
            <div id="tour-booking-calculator" className="lg:col-span-5 lg:sticky lg:top-22">
              <BookingForm
                initialTripType={tour.bookingDefaults.tripType}
                initialPickup={tour.bookingDefaults.pickup}
                initialDrop={tour.bookingDefaults.drop}
                initialDays={tour.bookingDefaults.days}
                heading={`Book Coimbatore to ${tour.destinationName}`}
                subheading="Pre-filled with this destination route. Switch between Round Trip and Outstation Drop anytime."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
