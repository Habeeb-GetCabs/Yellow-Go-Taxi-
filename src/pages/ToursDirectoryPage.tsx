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

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Tours', path: '/tours/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Outstation Tour Destinations from Coimbatore
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Explore 10 dedicated destination guides covering the Nilgiris, Anamalai Hills, Palani
            Hills, Kerala highlands, and Karnataka coffee estates—each with suggested itineraries and
            route fare calculators.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Interactive Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD2] pb-5">
            <p className="text-sm text-slate-600">
              Showing <span className="font-mono-tabular font-bold text-[#101820]">{filteredTours.length}</span> dedicated destination pages
            </p>
            <div
              role="group"
              aria-label="Filter tour routes by distance"
              className="inline-flex items-center gap-1 rounded-lg bg-[#EAE5D7] p-1 self-start"
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterDuration === btn.key
                      ? 'bg-white text-[#101820] shadow-xs'
                      : 'text-slate-700 hover:text-[#101820]'
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
                className="flex flex-col rounded-xl border border-[#E2DDD2] bg-white overflow-hidden"
              >
                <AssetImage
                  filename={tour.imageFilename}
                  alt={tour.imageAlt}
                  priority={idx < 3}
                  className="w-full border-0 border-b border-[#E2DDD2]"
                />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono-tabular">~{tour.approxOneWayKm} km one-way</span>
                      <span aria-hidden="true">·</span>
                      <span>{tour.recommendedDuration}</span>
                    </div>

                    <h2 className="mt-2 text-xl font-bold text-[#101820]">
                      <a
                        href={tour.path}
                        onClick={(e) => handleLink(e, tour.path)}
                        className="hover:underline"
                      >
                        Coimbatore to {tour.destinationName} Taxi
                      </a>
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {tour.introParagraphs[0]}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                      <span className="truncate">{tour.routeCorridor}</span>
                    </p>
                    <a
                      href={tour.path}
                      onClick={(e) => handleLink(e, tour.path)}
                      className="inline-flex w-full min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#101820] px-4 py-2 text-xs font-bold text-[#F5C518] hover:bg-slate-800 whitespace-nowrap"
                    >
                      <span>Open {tour.destinationName} Route Guide</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Calculator Section */}
          <div className="mt-14 pt-10 border-t border-[#E2DDD2] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-2xl font-extrabold text-[#101820]">
                Estimate Any Outstation Tour Fare
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
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
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
