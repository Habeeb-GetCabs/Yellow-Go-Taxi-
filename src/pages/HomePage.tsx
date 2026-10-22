import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Headphones,
  BadgeIndianRupee,
  Phone,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TAXI_SERVICES } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';
import { BLOG_ARTICLES } from '../data/blogsData';
import { GENERAL_FAQS } from '../data/faqsData';
import { business } from '../config/business';
import { trackEvent } from '../config/analytics';
import type { TripMode } from '../utils/fareCalculator';

export interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedHeroTripType, setSelectedHeroTripType] = useState<TripMode>('local');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredDestinationCards = [
    { slug: 'isha-yoga-center-taxi', title: 'Isha Yoga', subtitle: 'Coimbatore' },
    { slug: 'coimbatore-to-ooty-taxi', title: 'Ooty', subtitle: 'Hill Station' },
    { slug: 'coimbatore-to-kodaikanal-taxi', title: 'Kodaikanal', subtitle: 'Hill Station' },
    { slug: 'coimbatore-to-valparai-taxi', title: 'Valparai', subtitle: 'Nature Trip' },
    { slug: 'palani-temple-taxi', title: 'Palani', subtitle: 'Temple Trip' },
    { slug: 'masinagudi-mudumalai-taxi', title: 'Masinagudi', subtitle: 'Wildlife Trip' },
  ].map((item) => {
    const tour = TOUR_PAGES.find((t) => t.slug === item.slug);
    return {
      ...item,
      path: tour?.path || `/tours/${item.slug}/`,
      imageFilename: tour?.imageFilename || `${item.slug}.webp`,
      imageAlt: tour?.imageAlt || `${item.title} tour from Coimbatore`,
    };
  });

  const trustStripItems = [
    { title: 'Verified & Experienced Drivers', icon: Users },
    { title: 'Transparent Pricing', icon: CreditCard },
    { title: 'All Over Tamil Nadu Service', icon: MapPin },
    { title: '24/7 Customer Support', icon: Headphones },
  ];

  const featuredTours = TOUR_PAGES.filter((t) => t.featuredOnHome).slice(0, 5);
  const featuredBlogs = BLOG_ARTICLES.filter((b) => b.featuredOnHome).slice(0, 4);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const scrollToBooking = (mode?: TripMode) => {
    if (mode) {
      setSelectedHeroTripType(mode);
    }
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SeoHead
        title="Yellow Go Taxi | Coimbatore Local, Outstation & Tour Taxi Service"
        description="Plan your journey in Coimbatore with Yellow Go Taxi. Convenient booking experience, transparent trip fare estimates for local, hourly, outstation drop, and round-trip tours."
        canonicalPath="/"
      />

      {/* 1. HERO SECTION — CINEMATIC DARK NAVY & CHARCOAL WITH BRAND YELLOW ACCENTS */}
      <section className="relative bg-gradient-to-b from-[#111820] via-[#172536] to-[#111820] text-white overflow-hidden border-b-4 border-[#FFC400]">
        {/* Subtle radial glow accents */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FFC400]/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* Block 1: Hero Typography & 4 Yellow-Bordered Circular Trust Features */}
            <div className="lg:col-span-7 order-1 space-y-3.5 sm:space-y-4">
              {/* Top Kicker */}
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.18em] text-slate-200 uppercase">
                SAFE · RELIABLE · AFFORDABLE
              </p>

              {/* Main English Heading with exact wording and Brand Yellow highlight */}
              <h1 className="text-[34px] sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.06]">
                Coimbatore’s <br />
                <span className="text-[#FFC400]">Trusted</span> Taxi <br className="sm:hidden" />
                Service
              </h1>

              {/* Exact Tamil Subtitle with Rich Brand Yellow Curved Underline */}
              <div className="pt-0.5 inline-block">
                <p className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white tracking-wide">
                  உங்கள் பயணம் எங்கள் பொறுப்பு
                </p>
                <svg
                  className="w-56 sm:w-68 h-3.5 text-[#FFC400] mt-1"
                  viewBox="0 0 220 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C55 2 150 1 217 8"
                    stroke="currentColor"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Four Hero Trust Features in Yellow-Bordered Dark Circular Containers */}
              <div className="pt-2 grid grid-cols-4 divide-x divide-white/15">
                {[
                  { label: 'Safe & Verified Drivers', icon: ShieldCheck },
                  { label: 'Transparent Pricing', icon: BadgeIndianRupee },
                  { label: 'On-Time Pickup', icon: Clock },
                  { label: 'Local & Outstation', icon: MapPin },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center text-center gap-2 ${
                      idx === 0 ? 'pr-2 sm:pr-4' : idx === 3 ? 'pl-2 sm:pl-4' : 'px-2 sm:px-4'
                    }`}
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111820]/90 border-2 border-[#FFC400] text-[#FFC400] flex items-center justify-center shadow-md shrink-0">
                      <item.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2.2]" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Block 2: Prominent Branded White SUV Asset ("hero-suv.webp") */}
            <div className="lg:col-span-5 lg:row-span-2 order-2 -mx-4 sm:mx-0 relative flex flex-col justify-center">
              <div className="relative w-full sm:rounded-2xl overflow-hidden lg:shadow-[0_24px_60px_rgba(0,0,0,0.65)] lg:border-2 lg:border-white/15 group bg-[#172536]">
                <AssetImage
                  filename="hero-suv.webp"
                  alt="Yellow Go Taxi premium white SUV with official door branding on Coimbatore highway"
                  priority={true}
                  variant="hero"
                  className="w-full border-0 object-cover transition-transform duration-500 group-hover:scale-103"
                />
                {/* Top & bottom cinematic gradient blends on mobile so the car sits inside the hero atmosphere */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#172536] to-transparent lg:hidden"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111820] to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Block 3: High-Contrast Crisp White Booking Panel */}
            <div
              id="booking-section"
              className="lg:col-span-7 order-3 -mt-10 sm:-mt-6 lg:mt-2 relative z-20"
            >
              <BookingForm initialTripType={selectedHeroTripType} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DESTINATION CARDS SECTION */}
      <section aria-label="Popular Destination Tours" className="py-10 sm:py-14 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="inline-block rounded-md bg-[#FFC400] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111820]">
                Top Routes from Coimbatore
              </span>
              <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight text-[#111820]">
                Popular Hill Stations, Temples &amp; Getaways
              </h2>
            </div>
            <a
              href="/tours/"
              onClick={(e) => handleLink(e, '/tours/')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#111820] hover:text-[#F5B800] underline-offset-4 hover:underline"
            >
              <span>Explore All 10 Tour Packages</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {featuredDestinationCards.map((dest) => (
              <a
                key={dest.slug}
                href={dest.path}
                onClick={(e) => handleLink(e, dest.path)}
                className="group relative block rounded-2xl overflow-hidden border-2 border-[#D8DFE8] hover:border-[#FFC400] shadow-md hover:shadow-xl transition-all duration-200 aspect-4/3 sm:aspect-3/4 bg-[#111820] focus-visible:outline-2 focus-visible:outline-[#111820]"
              >
                <AssetImage
                  filename={dest.imageFilename}
                  alt={`${dest.title} ${dest.subtitle} tour from Coimbatore by Yellow Go Taxi`}
                  className="h-full w-full border-0 object-cover transition-transform duration-300 group-hover:scale-108"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820] via-[#111820]/45 to-transparent"
                  aria-hidden="true"
                />
                {/* Bottom content: Title, Subtitle, and Yellow Arrow Button */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#FFC400] truncate">
                      {dest.subtitle}
                    </p>
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug truncate">
                      {dest.title}
                    </h3>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFC400] text-[#111820] flex items-center justify-center font-extrabold shrink-0 shadow-md transition-transform duration-200 group-hover:scale-110">
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIGH-CONTRAST DARK CHARCOAL TRUST STRIP */}
      <section aria-label="Customer Guarantees" className="bg-[#111820] border-y border-white/10 py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15 gap-4 sm:gap-0">
            {trustStripItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${idx > 0 ? 'sm:pl-6' : ''} ${
                  idx < trustStripItems.length - 1 ? 'sm:pr-6' : ''
                } py-2 sm:py-0`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 shadow-md">
                  <item.icon className="h-6 w-6 stroke-[2.3]" aria-hidden="true" />
                </div>
                <span className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TAXI SERVICES SECTION (CLEAN WHITE SURFACE WITH HIGH-CONTRAST CARDS) */}
      <section aria-labelledby="services-heading" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                01. Core Capabilities
              </span>
              <h2
                id="services-heading"
                className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111820] text-balance"
              >
                Four Dedicated Taxi Booking Modes
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#526174] max-w-2xl leading-relaxed">
                Every journey has a clear service structure—whether you need a short city transfer in
                Coimbatore, an hourly package for multi-stop errands, a point-to-point outstation
                drop, or a multi-day round trip.
              </p>
            </div>
            <a
              href="/services/"
              onClick={(e) => handleLink(e, '/services/')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-[#111820] bg-white px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#111820] hover:bg-[#111820] hover:text-[#FFC400] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Service Details</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TAXI_SERVICES.map((service, idx) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={service.imageFilename}
                    alt={service.imageAlt}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-lg bg-[#111820]/90 border border-[#FFC400] px-2.5 py-1 text-[11px] font-extrabold text-[#FFC400] shadow-md">
                    0{idx + 1} · {service.title}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#111820]">
                      <a
                        href={service.path}
                        onClick={(e) => handleLink(e, service.path)}
                        className="hover:underline"
                      >
                        {service.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-[#263241] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8DFE8] flex items-center justify-between gap-2">
                    <a
                      href={service.path}
                      onClick={(e) => handleLink(e, service.path)}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-[#111820] hover:text-[#F5B800] underline-offset-4 hover:underline whitespace-nowrap"
                    >
                      <span>Explore {service.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => scrollToBooking(service.tripType)}
                      className="rounded-lg bg-[#FFC400] hover:bg-[#F5B800] px-3 py-2 text-xs font-extrabold text-[#111820] shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Estimate Fare
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED TOUR CARDS (WARM OFF-WHITE SURFACE) */}
      <section
        aria-labelledby="featured-tours-heading"
        className="py-16 sm:py-20 bg-[#F7F6F1] border-t border-[#D8DFE8]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block rounded-md bg-[#111820] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                02. Outstation &amp; Hill Station Routes
              </span>
              <h2
                id="featured-tours-heading"
                className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111820] text-balance"
              >
                Featured Tours from Coimbatore
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#526174] max-w-2xl leading-relaxed">
                Explore dedicated destination guides with suggested itineraries, practical checkpost
                notes, and instant route fare estimators.
              </p>
            </div>
            <a
              href="/tours/"
              onClick={(e) => handleLink(e, '/tours/')}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#111820] px-5 py-3 text-xs sm:text-sm font-extrabold text-[#FFC400] hover:bg-[#172536] shadow-md transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Tours (10 Destinations)</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour, index) => (
              <article
                key={tour.id}
                className={`group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="relative overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={tour.imageFilename}
                    alt={tour.imageAlt}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-104"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#111820]/90 border border-[#FFC400] px-2.5 py-1 font-mono-tabular text-xs font-extrabold text-[#FFC400] shadow-md">
                      Approx. {tour.approxOneWayKm} km one-way
                    </span>
                    <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-extrabold text-[#111820] shadow-md">
                      {tour.recommendedDuration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#111820]">
                      <a
                        href={tour.path}
                        onClick={(e) => handleLink(e, tour.path)}
                        className="hover:underline"
                      >
                        Coimbatore to {tour.destinationName} Taxi
                      </a>
                    </h3>
                    <p className="mt-2.5 text-sm text-[#263241] leading-relaxed">
                      <strong className="text-[#111820]">{tour.shortTagline}.</strong>{' '}
                      {tour.introParagraphs[0]}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8DFE8] flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526174] truncate">
                      <MapPin className="h-3.5 w-3.5 text-[#F5B800] shrink-0" aria-hidden="true" />
                      <span className="truncate">{tour.routeCorridor}</span>
                    </span>
                    <a
                      href={tour.path}
                      onClick={(e) => handleLink(e, tour.path)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFC400] hover:bg-[#F5B800] px-3.5 py-2 text-xs font-extrabold text-[#111820] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>View Itinerary &amp; Fare</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE YELLOW GO TAXI (DEEP NAVY & CHARCOAL PREMIUM SECTION) */}
      <section
        aria-labelledby="why-choose-heading"
        className="py-16 sm:py-22 bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white border-y-4 border-[#FFC400]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                  03. Built for Clarity
                </span>
                <h2
                  id="why-choose-heading"
                  className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance"
                >
                  Why Choose <span className="text-[#FFC400]">Yellow Go Taxi</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Planning a local transfer or a multi-day Western Ghats road trip works best when
                  route expectations, trip modes, and communication channels are straightforward from
                  the start.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Clear Route-Based Fare Estimates',
                    description:
                      'Estimate your trip cost based on actual road distance and trip duration before you send a booking request—with no arbitrary guessed distances.',
                  },
                  {
                    title: 'Tailored Trip Categories',
                    description:
                      'Choose the exact mode that matches your plan: Local point-to-point rides, Hourly Rentals, Outstation Drops, or multi-day Round Trips.',
                  },
                  {
                    title: 'Destination-Specific Travel Guidance',
                    description:
                      'Every tour page outlines practical highway corridors, forest checkpost considerations, and suggested day-by-day itineraries.',
                  },
                  {
                    title: 'Direct Booking Assistance via WhatsApp',
                    description:
                      'Share your calculated itinerary in a single pre-formatted WhatsApp enquiry to confirm vehicle availability and trip details directly.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/6 hover:border-[#FFC400]/70 p-4 sm:p-5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 stroke-[2.4]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="rounded-2xl overflow-hidden border-2 border-[#FFC400]/70 shadow-2xl">
                <AssetImage
                  filename="why-choose-us.webp"
                  alt="Clean, comfortable interior of a Yellow Go Taxi vehicle prepared for passenger travel"
                  variant="dark"
                  className="w-full border-0"
                />
              </div>

              {/* Direct Call & Estimate Bar below Why Choose Us Image */}
              <div className="rounded-2xl bg-[#111820] border border-white/15 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                    Need Immediate Dispatch?
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Speak directly with our Coimbatore booking desk.
                  </p>
                </div>
                <a
                  href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => trackEvent('phone_click', { location: 'why_choose_us' })}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#111820] whitespace-nowrap shrink-0 shadow-md"
                >
                  <Phone className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span>Call {business.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW BOOKING WORKS */}
      <section aria-labelledby="how-booking-works-heading" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
              04. Step-by-Step Process
            </span>
            <h2
              id="how-booking-works-heading"
              className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111820] text-balance"
            >
              How Booking Works
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#526174]">
              Complete your trip estimate and send your booking enquiry in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01. Select Trip Type & Route',
                title: 'Enter Pickup, Destination & Schedule',
                description:
                  'Choose between Local, Hourly Rental, Outstation Drop, or Round Trip. Select your Coimbatore pickup hub, destination, and travel dates.',
              },
              {
                step: '02. Review Estimated Trip Fare',
                title: 'Get an Instant Route-Based Estimate',
                description:
                  'Our fare calculator resolves the road distance in kilometres and displays your estimated trip fare upfront.',
              },
              {
                step: '03. Confirm Details on WhatsApp',
                title: 'Send Pre-Filled Enquiry for Confirmation',
                description:
                  'Click "Book This Trip on WhatsApp" to send your structured trip summary. Our dispatch team reviews availability and confirms final details.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border-2 border-[#D8DFE8] bg-[#F7F6F1] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#FFC400] transition-colors"
              >
                <div>
                  <span className="inline-block rounded-lg bg-[#111820] px-3 py-1 font-mono-tabular text-xs font-extrabold text-[#FFC400]">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-[#111820]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#263241] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST TRAVEL BLOGS (4 Featured Articles + View All Blogs Link) */}
      <section
        aria-labelledby="latest-blogs-heading"
        className="py-16 sm:py-20 bg-[#F7F6F1] border-t border-[#D8DFE8]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block rounded-md bg-[#111820] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FFC400]">
                05. Regional Road-Trip Guides
              </span>
              <h2
                id="latest-blogs-heading"
                className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111820] text-balance"
              >
                Latest Travel Blogs &amp; Route Insights
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#526174] max-w-2xl leading-relaxed">
                Read practical guides covering best travel seasons, ghat road comparisons, forest
                checkpost rules, and family-friendly itineraries around Coimbatore.
              </p>
            </div>
            <a
              href="/blog/"
              onClick={(e) => handleLink(e, '/blog/')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-[#111820] bg-white px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#111820] hover:bg-[#111820] hover:text-[#FFC400] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Blogs (10 Articles)</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col rounded-2xl border-2 border-[#D8DFE8] hover:border-[#FFC400] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div className="overflow-hidden border-b border-[#D8DFE8]">
                  <AssetImage
                    filename={blog.imageFilename}
                    alt={blog.imageAlt}
                    className="w-full border-0 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#526174]">
                      <span className="rounded bg-[#FFC400]/30 px-2 py-0.5 text-[#111820] font-extrabold">
                        {blog.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{blog.readingTime}</span>
                    </div>
                    <h3 className="mt-3 text-base font-extrabold text-[#111820] leading-snug">
                      <a
                        href={blog.path}
                        onClick={(e) => handleLink(e, blog.path)}
                        className="hover:underline"
                      >
                        {blog.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#263241] line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#D8DFE8]">
                    <a
                      href={blog.path}
                      onClick={(e) => handleLink(e, blog.path)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111820] hover:text-[#F5B800] underline-offset-4 hover:underline"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQS SECTION */}
      <section
        aria-labelledby="home-faq-heading"
        className="py-16 sm:py-20 bg-white border-t border-[#D8DFE8]"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                06. Common Questions
              </span>
              <h2
                id="home-faq-heading"
                className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111820]"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <a
              href="/faq/"
              onClick={(e) => handleLink(e, '/faq/')}
              className="text-xs sm:text-sm font-extrabold text-[#111820] hover:text-[#F5B800] underline-offset-4 hover:underline whitespace-nowrap"
            >
              View Complete FAQ Page →
            </a>
          </div>

          <div className="divide-y divide-[#D8DFE8] rounded-2xl border-2 border-[#D8DFE8] bg-[#F7F6F1] overflow-hidden shadow-xs">
            {GENERAL_FAQS.slice(0, 5).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} className="p-5 sm:p-6 bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-sm sm:text-base font-extrabold text-[#111820] focus-visible:outline-2 focus-visible:outline-[#111820] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#FFC400] text-[#111820]'
                          : 'bg-[#F7F6F1] text-[#111820] border border-[#D8DFE8]'
                      }`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-[#263241] leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL BOOKING CTA (Uses "travel-cta-banner.webp") */}
      <section
        aria-labelledby="final-cta-heading"
        className="py-12 sm:py-16 bg-[#F7F6F1] border-t border-[#D8DFE8]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFC400] bg-gradient-to-r from-[#111820] via-[#172536] to-[#111820] text-white shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
                <span className="inline-block self-start rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
                  Plan Your Local or Outstation Trip
                </span>
                <h2
                  id="final-cta-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight"
                >
                  Ready to Estimate Your Fare or Explore Outstation Tours?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Use our interactive trip calculator to get an instant route-based estimate, or
                  browse our 10 curated destination guides starting from Coimbatore.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => scrollToBooking()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-6 py-3 text-sm font-extrabold text-[#111820] shadow-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Calculate Trip Fare</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  </button>
                  <a
                    href="/contact/"
                    onClick={(e) => handleLink(e, '/contact/')}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-white/25 bg-white/8 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 hover:border-[#FFC400] transition-colors whitespace-nowrap"
                  >
                    Contact &amp; Enquiry Page
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <AssetImage
                  filename="travel-cta-banner.webp"
                  alt="Scenic mountain road leading from Coimbatore to Western Ghats hill stations"
                  variant="dark"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
