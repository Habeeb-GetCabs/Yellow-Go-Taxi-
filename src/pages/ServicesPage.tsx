import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TAXI_SERVICES, type ServicePageData } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';

export interface ServicesDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesDirectoryPage: React.FC<ServicesDirectoryPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <SeoHead
        title="Taxi Services in Coimbatore | Local, Hourly, Outstation Drop & Round Trip | Yellow Go Taxi"
        description="Explore Yellow Go Taxi’s four core booking modes in Coimbatore: Local point-to-point city rides, Hourly Rental packages, Outstation Drop transfers, and Round Trip tours."
        canonicalPath="/services/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Taxi Services', path: '/services/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Taxi Services', path: '/services/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Taxi Services in Coimbatore
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Compare our four structured booking modes—Local Taxi, Hourly Rental, Outstation Drop,
            and Round Trip—and select the option tailored to your route and schedule.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-18 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TAXI_SERVICES.map((service, index) => (
              <article
                key={service.id}
                className="flex flex-col rounded-xl border border-[#E2DDD2] bg-white overflow-hidden"
              >
                <AssetImage
                  filename={service.imageFilename}
                  alt={service.imageAlt}
                  priority={index < 2}
                  className="w-full border-0 border-b border-[#E2DDD2]"
                />
                <div className="p-6 sm:p-8 flex flex-1 flex-col justify-between space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500">0{index + 1}. Service Mode</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#101820]">{service.title}</h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {service.introParagraph}
                    </p>

                    <div className="mt-5 space-y-2">
                      <p className="text-xs font-bold text-[#101820]">Recommended For:</p>
                      <ul className="space-y-1.5">
                        {service.idealFor.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"
                          >
                            <CheckCircle2
                              className="h-4 w-4 text-[#101820] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href={service.path}
                      onClick={(e) => handleLink(e, service.path)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#101820] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#F5C518] hover:bg-slate-800 whitespace-nowrap"
                    >
                      <span>Open {service.title} Page &amp; Calculator</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Embedded Booking Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#E2DDD2]">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl font-extrabold text-[#101820]">
                Estimate Your Fare Across Any Service Mode
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Switch tabs inside the calculator to compare Local, Hourly Rental, Outstation Drop,
                and Round Trip estimates for your pickup and destination.
              </p>
              <div className="rounded-xl border border-[#E2DDD2] bg-white p-5 space-y-3">
                <h3 className="text-sm font-bold text-[#101820]">
                  Popular Outstation Tour Destinations
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {TOUR_PAGES.slice(0, 6).map((t) => (
                    <li key={t.id}>
                      <a
                        href={t.path}
                        onClick={(e) => handleLink(e, t.path)}
                        className="font-medium text-slate-700 hover:text-[#101820] hover:underline"
                      >
                        Coimbatore to {t.destinationName} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export interface ServiceDetailPageProps {
  service: ServicePageData;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const otherServices = TAXI_SERVICES.filter((s) => s.id !== service.id);

  return (
    <>
      <SeoHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonicalPath={service.path}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Taxi Services', path: '/services/' },
          { name: service.title, path: service.path },
        ]}
      />

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Taxi Services', path: '/services/' },
              { name: service.title, path: service.path },
            ]}
          />
          <p className="text-xs font-semibold text-[#F5C518]">
            Coimbatore Taxi Service Mode · {service.title}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            {service.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <AssetImage
                filename={service.imageFilename}
                alt={service.imageAlt}
                priority={true}
                className="w-full rounded-xl"
              />

              <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#101820]">Overview</h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.introParagraph}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#101820]">When to Choose {service.title}</h2>
                  <ul className="mt-3 space-y-2.5">
                    {service.idealFor.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2
                          className="h-4 w-4 text-[#101820] shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#101820]">How {service.title} Estimation Works</h2>
                  <ol className="mt-3 space-y-2.5 list-decimal list-inside text-sm text-slate-700 leading-relaxed">
                    {service.howItWorksNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Service-Specific FAQs */}
              <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-[#101820]">
                  {service.title} — Frequently Asked Questions
                </h2>
                <div className="divide-y divide-slate-200">
                  {service.faqs.map((faq) => (
                    <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#101820]">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Services */}
              <div className="rounded-xl border border-[#E2DDD2] bg-white p-6">
                <h2 className="text-base font-bold text-[#101820] mb-3">
                  Compare Other Taxi Service Modes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {otherServices.map((other) => (
                    <a
                      key={other.id}
                      href={other.path}
                      onClick={(e) => handleLink(e, other.path)}
                      className="rounded-lg border border-slate-200 bg-[#FAF9F5] p-3.5 hover:border-[#101820] transition-colors"
                    >
                      <p className="text-sm font-bold text-[#101820]">{other.title}</p>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {other.shortDescription}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Booking Calculator */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <BookingForm
                initialTripType={service.bookingDefaults.tripType}
                initialPickup={service.bookingDefaults.pickup}
                initialDrop={service.bookingDefaults.drop}
                initialHours={service.bookingDefaults.hours}
                initialDays={service.bookingDefaults.days}
                heading={`Estimate ${service.title} Fare`}
                subheading={`Pre-selected for ${service.title}. Adjust pickup, destination, and date below.`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
