import React from 'react';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TAXI_SERVICES, type ServicePageData } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';
import { business } from '../config/business';
import { trackEvent } from '../config/analytics';

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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Taxi Services', path: '/services/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            Coimbatore Taxi Booking Modes
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            Taxi Services in <span className="text-[#FFC400]">Coimbatore</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Compare our four structured booking modes—Local Taxi, Hourly Rental, Outstation Drop,
            and Round Trip—and select the option tailored to your route and schedule.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-18 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TAXI_SERVICES.map((service, index) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200"
              >
                <div className="relative overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={service.imageFilename}
                    alt={service.imageAlt}
                    priority={index < 2}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-104"
                  />
                  <span className="absolute top-3.5 left-3.5 rounded-lg bg-[#111820]/90 border border-[#FFC400] px-3 py-1 text-xs font-extrabold text-[#FFC400] shadow-md">
                    0{index + 1} · Service Mode
                  </span>
                </div>
                <div className="p-6 sm:p-8 flex flex-1 flex-col justify-between space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#111820]">{service.title}</h2>
                    <p className="mt-3 text-sm sm:text-base text-[#263241] leading-relaxed">
                      {service.introParagraph}
                    </p>

                    <div className="mt-5 rounded-xl bg-[#F7F6F1] border border-[#D8DFE8] p-4 space-y-2.5">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                        Recommended For:
                      </p>
                      <ul className="space-y-2">
                        {service.idealFor.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#263241]"
                          >
                            <CheckCircle2
                              className="h-4 w-4 text-[#138443] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#D8DFE8]">
                    <a
                      href={service.path}
                      onClick={(e) => handleLink(e, service.path)}
                      className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#111820] shadow-sm transition-colors whitespace-nowrap"
                    >
                      <span>Open {service.title} Page &amp; Calculator</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Embedded Booking Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t-2 border-[#D8DFE8]">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block rounded-md bg-[#111820] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                Instant Route Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111820]">
                Estimate Your Fare Across Any Service Mode
              </h2>
              <p className="text-sm sm:text-base text-[#263241] leading-relaxed">
                Switch tabs inside the calculator to compare Local, Hourly Rental, Outstation Drop,
                and Round Trip estimates for your pickup and destination.
              </p>
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#111820]">
                  Popular Outstation Tour Destinations
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {TOUR_PAGES.slice(0, 6).map((t) => (
                    <li key={t.id}>
                      <a
                        href={t.path}
                        onClick={(e) => handleLink(e, t.path)}
                        className="font-bold text-[#263241] hover:text-[#111820] hover:underline"
                      >
                        Coimbatore to {t.destinationName} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <BookingForm
                heading="Calculate Trip Fare"
                subheading="Select your preferred taxi service mode and enter route details."
              />
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
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
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            Coimbatore Taxi Service Mode · {service.title}
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            {service.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D8DFE8] shadow-lg bg-[#111820]">
                <AssetImage
                  filename={service.imageFilename}
                  alt={service.imageAlt}
                  priority={true}
                  className="w-full border-0"
                />
              </div>

              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111820]">Overview</h2>
                  <p className="mt-2.5 text-sm sm:text-base text-[#263241] leading-relaxed">
                    {service.introParagraph}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8DFE8]">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#111820]">
                    When to Choose {service.title}
                  </h2>
                  <ul className="mt-3.5 space-y-3">
                    {service.idealFor.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#263241] leading-relaxed"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#D8DFE8]">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#111820]">
                    How {service.title} Estimation Works
                  </h2>
                  <ol className="mt-3.5 space-y-2.5 list-decimal list-inside text-sm sm:text-base text-[#263241] leading-relaxed font-medium">
                    {service.howItWorksNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Service-Specific FAQs */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#111820]">
                  {service.title} — Frequently Asked Questions
                </h2>
                <div className="divide-y divide-[#D8DFE8]">
                  {service.faqs.map((faq) => (
                    <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#111820]">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm text-[#263241] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Services */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-[#111820] mb-3.5">
                  Compare Other Taxi Service Modes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {otherServices.map((other) => (
                    <a
                      key={other.id}
                      href={other.path}
                      onClick={(e) => handleLink(e, other.path)}
                      className="rounded-xl border-2 border-[#D8DFE8] bg-[#F7F6F1] p-4 hover:border-[#FFC400] hover:bg-white transition-all"
                    >
                      <p className="text-sm font-extrabold text-[#111820]">{other.title}</p>
                      <p className="mt-1 text-xs text-[#526174] line-clamp-2">
                        {other.shortDescription}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Booking Calculator */}
            <div className="lg:col-span-5 lg:sticky lg:top-22 space-y-5">
              <BookingForm
                initialTripType={service.bookingDefaults.tripType}
                initialPickup={service.bookingDefaults.pickup}
                initialDrop={service.bookingDefaults.drop}
                initialHours={service.bookingDefaults.hours}
                initialDays={service.bookingDefaults.days}
                heading={`Estimate ${service.title} Fare`}
                subheading={`Pre-selected for ${service.title}. Adjust pickup, destination, and duration below.`}
              />

              <div className="rounded-2xl bg-[#111820] border-2 border-[#FFC400] p-5 text-white flex items-center justify-between gap-4 shadow-lg">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                    24/7 Phone Booking
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Need immediate cab dispatch?
                  </p>
                </div>
                <a
                  href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => trackEvent('phone_click', { location: 'service_detail_sidebar' })}
                  className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-4 py-2 text-xs font-extrabold text-[#111820] whitespace-nowrap shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>{business.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
