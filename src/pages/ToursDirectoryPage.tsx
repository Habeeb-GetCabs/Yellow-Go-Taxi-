import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TOUR_PAGES } from '../data/toursData';

export interface ToursDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const ToursDirectoryPage: React.FC<ToursDirectoryPageProps> = ({ onNavigate }) => {
  const [filterDuration, setFilterDuration] = useState<'all' | 'short' | 'multi'>('all');

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const filteredTours = TOUR_PAGES.filter((tour) => {
    if (filterDuration === 'short') return tour.approxOneWayKm <= 115;
    if (filterDuration === 'multi') return tour.approxOneWayKm > 115;
    return true;
  });

  return (
    <>
      <SeoHead
        title="Coimbatore Outstation Tours & Hill Station Taxi Packages | Yellow Go Taxi"
        description="Browse all 10 dedicated outstation tour routes starting from Coimbatore: Ooty, Kodaikanal, Isha Yoga Center, Valparai, Munnar, Yercaud, Masinagudi, Topslip, Palani & Chikmagalur."
        canonicalPath="/tours/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tours', path: '/tours/' },
        ]}
      />

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Tours', path: '/tours/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            10 Curated Outstation Packages
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            Outstation Tour Destinations from <span className="text-[#FFC400]">Coimbatore</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Explore 10 dedicated destination guides covering the Nilgiris, Anamalai Hills, Palani
            Hills, Kerala highlands, and Karnataka coffee estates—each with suggested itineraries and
            route fare calculators.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Interactive Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#D8DFE8] pb-5">
            <p className="text-sm font-semibold text-[#263241]">
              Showing{' '}
              <span className="font-mono-tabular font-extrabold text-[#111820]">
                {filteredTours.length}
              </span>{' '}
              dedicated destination pages
            </p>
            <div
              role="group"
              aria-label="Filter tour routes by distance"
              className="inline-flex flex-wrap items-center gap-1.5 rounded-xl bg-white border-2 border-[#D8DFE8] p-1.5 self-start shadow-xs"
            >
              {[
                { key: 'all', label: 'All 10 Destinations' },
                { key: 'short', label: 'Under 115 km (Same-Day / 2-Day)' },
                { key: 'multi', label: '115+ km (Multi-Day Tours)' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setFilterDuration(btn.key as 'all' | 'short' | 'multi')}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    filterDuration === btn.key
                      ? 'bg-[#FFC400] text-[#111820] shadow-xs'
                      : 'text-[#263241] hover:text-[#111820] hover:bg-[#F7F6F1]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 10 Dedicated Tour Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, idx) => (
              <article
                key={tour.id}
                className="group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200"
              >
                <div className="relative overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={tour.imageFilename}
                    alt={tour.imageAlt}
                    priority={idx < 3}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-lg bg-[#111820]/90 border border-[#FFC400] px-2.5 py-1 font-mono-tabular text-xs font-extrabold text-[#FFC400] shadow-md">
                      ~{tour.approxOneWayKm} km one-way
                    </span>
                    <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-extrabold text-[#111820] shadow-md">
                      {tour.recommendedDuration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#111820]">
                      <a
                        href={tour.path}
                        onClick={(e) => handleLink(e, tour.path)}
                        className="hover:underline"
                      >
                        Coimbatore to {tour.destinationName} Taxi
                      </a>
                    </h2>

                    <p className="mt-2.5 text-sm text-[#263241] leading-relaxed">
                      {tour.introParagraphs[0]}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8DFE8] space-y-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#526174]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F5B800]" aria-hidden="true" />
                      <span className="truncate">{tour.routeCorridor}</span>
                    </p>
                    <a
                      href={tour.path}
                      onClick={(e) => handleLink(e, tour.path)}
                      className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-4 py-2.5 text-xs font-extrabold text-[#111820] shadow-xs transition-colors whitespace-nowrap"
                    >
                      <span>Open {tour.destinationName} Route Guide</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Calculator Section */}
          <div className="mt-14 pt-10 border-t-2 border-[#D8DFE8] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-block rounded-md bg-[#111820] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                Instant Tour Fare Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111820]">
                Estimate Any Outstation Tour Fare
              </h2>
              <p className="text-sm sm:text-base text-[#263241] leading-relaxed">
                Select Outstation Drop for a direct one-way transfer, or Round Trip for a multi-day
                return journey from Coimbatore.
              </p>
            </div>
            <div className="lg:col-span-7">
              <BookingForm
                initialTripType="round_trip"
                initialPickup="Coimbatore International Airport (CJB)"
                initialDrop="Ooty (Udhagamandalam)"
                initialDays={3}
                heading="Calculate Outstation Tour Fare"
                subheading="Pre-filled for Coimbatore to Ooty. Change pickup or destination anytime."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
