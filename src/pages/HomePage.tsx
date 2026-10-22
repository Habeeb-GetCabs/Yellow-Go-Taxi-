import React, { useState } from 'react';
import {
  ArrowRight,
  Route,
  Calculator,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Headphones,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import { TAXI_SERVICES } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';
import { BLOG_ARTICLES } from '../data/blogsData';
import { GENERAL_FAQS } from '../data/faqsData';
import { business } from '../config/business';
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

      {/* 2. HERO SECTION — EXACT REFERENCE DESIGN */}
      <section className="relative bg-[#FAF9F5] overflow-hidden border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10 lg:pt-12 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Column: Hero Typography, Benefits Badges, and Floating Booking Panel */}
            <div className="lg:col-span-7 flex flex-col space-y-5">
              <div className="space-y-3">
                {/* Small introductory line */}
                <p className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-600 uppercase">
                  SAFE · RELIABLE · AFFORDABLE
                </p>

                {/* Main Heading with exact line breaks */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-[#101820] leading-[1.12]">
                  Coimbatore’s <br />
                  <span className="text-[#F5C518]">Trusted</span> Taxi Service
                </h1>

                {/* Tamil Subtitle with exact script and decorative yellow underline */}
                <div className="pt-1 inline-block">
                  <p className="text-xl sm:text-2xl font-bold text-[#101820] tracking-wide font-sans">
                    உங்கள் பயணம் எங்கள் பொறுப்பு
                  </p>
                  <svg
                    className="w-48 sm:w-56 h-3 text-[#F5C518] mt-0.5"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9C45 2 135 1 197 7"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Four Hero Benefit Labels (compact horizontal row) */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Safe & Verified Drivers', icon: ShieldCheck },
                    { label: 'Transparent Pricing', symbol: '₹' },
                    { label: 'On-Time Pickup', icon: Clock },
                    { label: 'Local & Outstation', icon: MapPin },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-[#101820] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {item.icon ? (
                          <item.icon className="h-5 w-5 text-white" aria-hidden="true" />
                        ) : (
                          <span className="text-base font-bold text-white">{item.symbol}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#101820] leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating White Booking Panel in bottom-left */}
              <div id="booking-section" className="pt-2">
                <BookingForm
                  initialTripType={selectedHeroTripType}
                  heading="Book Your Ride"
                  subheading="Instant fare calculation for local and outstation taxi trips."
                />
              </div>
            </div>

            {/* Right Column: Prominent Branded White SUV & Coimbatore Landscape */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <AssetImage
                  filename="hero-suv.webp"
                  alt="Yellow Go Taxi premium white SUV with official door branding on Coimbatore highway"
                  priority={true}
                  variant="hero"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                {/* Subtle decorative badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs font-extrabold text-[#101820] shadow-md border border-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
                  <span>Explore Coimbatore &amp; Beyond</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESTINATION CARDS SECTION (DIRECTLY BENEATH HERO) */}
      <section aria-label="Popular Destination Tours" className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {featuredDestinationCards.map((dest) => (
              <a
                key={dest.slug}
                href={dest.path}
                onClick={(e) => handleLink(e, dest.path)}
                className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 aspect-4/3 sm:aspect-3/4 bg-slate-900 focus-visible:outline-2 focus-visible:outline-[#101820]"
              >
                <AssetImage
                  filename={dest.imageFilename}
                  alt={`${dest.title} ${dest.subtitle} tour from Coimbatore by Yellow Go Taxi`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  aria-hidden="true"
                />
                {/* Bottom content: Title, Subtitle, and Yellow Arrow Button */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug drop-shadow-xs truncate">
                      {dest.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-medium text-slate-200 drop-shadow-xs truncate">
                      {dest.subtitle}
                    </p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5C518] text-[#101820] flex items-center justify-center font-bold shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOTTOM TRUST STRIP */}
      <section aria-label="Customer Guarantees" className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 gap-4 sm:gap-0">
            {trustStripItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${idx > 0 ? 'sm:pl-6' : ''} ${
                  idx < trustStripItems.length - 1 ? 'sm:pr-6' : ''
                } py-2 sm:py-0`}
              >
                <div className="w-12 h-12 rounded-full bg-[#F5C518] text-[#101820] flex items-center justify-center shrink-0 shadow-xs">
                  <item.icon className="h-6 w-6 stroke-[2.2]" aria-hidden="true" />
                </div>
                <span className="text-sm sm:text-base font-bold text-[#101820] leading-snug">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TAXI SERVICES SECTION */}
      <section aria-labelledby="services-heading" className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-slate-500">01. Core Capabilities</p>
              <h2
                id="services-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820] text-balance"
              >
                Four Dedicated Taxi Booking Modes
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                Every journey has a clear service structure—whether you need a short city transfer in
                Coimbatore, an hourly package for multi-stop errands, a point-to-point outstation
                drop, or a multi-day round trip.
              </p>
            </div>
            <a
              href="/services/"
              onClick={(e) => handleLink(e, '/services/')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#101820] underline-offset-4 hover:underline whitespace-nowrap shrink-0"
            >
              <span>View All Service Details</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TAXI_SERVICES.map((service, idx) => (
              <article
                key={service.id}
                className="flex flex-col rounded-xl border border-[#E2DDD2] bg-white overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
              >
                <AssetImage
                  filename={service.imageFilename}
                  alt={service.imageAlt}
                  className="w-full border-0 border-b border-[#E2DDD2]"
                />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      0{idx + 1} · {service.title}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#101820]">{service.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={service.path}
                      onClick={(e) => handleLink(e, service.path)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#101820] hover:underline whitespace-nowrap"
                    >
                      <span>Explore {service.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => scrollToBooking(service.tripType)}
                      className="rounded-md bg-[#FAF9F5] border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#101820] hover:bg-[#F5C518] whitespace-nowrap"
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

      {/* 4. FEATURED TOUR CARDS (5 Featured Tours + View All Tours Link) */}
      <section
        aria-labelledby="featured-tours-heading"
        className="py-16 sm:py-20 bg-white border-y border-[#E5E0D5]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-slate-500">02. Outstation &amp; Hill Station Routes</p>
              <h2
                id="featured-tours-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820] text-balance"
              >
                Featured Tours from Coimbatore
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                Explore dedicated destination guides with suggested itineraries, practical checkpost
                notes, and instant route fare estimators.
              </p>
            </div>
            <a
              href="/tours/"
              onClick={(e) => handleLink(e, '/tours/')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#101820] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#F5C518] hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <span>View All Tours (10 Destinations)</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour, index) => (
              <article
                key={tour.id}
                className={`flex flex-col rounded-xl border border-[#E2DDD2] bg-[#FAF9F5] overflow-hidden ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <AssetImage
                  filename={tour.imageFilename}
                  alt={tour.imageAlt}
                  className="w-full border-0 border-b border-[#E2DDD2]"
                />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-mono-tabular">Approx. {tour.approxOneWayKm} km one-way</span>
                      <span aria-hidden="true">·</span>
                      <span>{tour.recommendedDuration}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-[#101820]">
                      <a
                        href={tour.path}
                        onClick={(e) => handleLink(e, tour.path)}
                        className="hover:underline"
                      >
                        Coimbatore to {tour.destinationName} Taxi
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {tour.shortTagline}. {tour.introParagraphs[0]}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 truncate">{tour.routeCorridor}</span>
                    <a
                      href={tour.path}
                      onClick={(e) => handleLink(e, tour.path)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101820] hover:text-amber-700 whitespace-nowrap shrink-0"
                    >
                      <span>View Itinerary &amp; Fare</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE YELLOW GO TAXI (Uses "why-choose-us.webp" and factual, verifiable statements) */}
      <section aria-labelledby="why-choose-heading" className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500">03. Built for Clarity</p>
                <h2
                  id="why-choose-heading"
                  className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820] text-balance"
                >
                  Why Choose Yellow Go Taxi
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
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
                    className="flex items-start gap-3.5 rounded-xl border border-[#E2DDD2] bg-white p-4"
                  >
                    <CheckCircle2
                      className="h-5 w-5 text-[#101820] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#101820]">{item.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <AssetImage
                filename="why-choose-us.webp"
                alt="Clean, comfortable interior of a Yellow Go Taxi vehicle prepared for passenger travel"
                className="w-full rounded-xl shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW BOOKING WORKS */}
      <section
        aria-labelledby="how-booking-works-heading"
        className="py-16 sm:py-20 bg-white border-y border-[#E5E0D5]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold text-slate-500">04. Step-by-Step Process</p>
            <h2
              id="how-booking-works-heading"
              className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820] text-balance"
            >
              How Booking Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
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
                className="rounded-xl border border-[#E2DDD2] bg-[#FAF9F5] p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono-tabular text-xs font-bold text-slate-500">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#101820]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST TRAVEL BLOGS (4 Featured Articles + View All Blogs Link) */}
      <section aria-labelledby="latest-blogs-heading" className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-slate-500">05. Regional Road-Trip Guides</p>
              <h2
                id="latest-blogs-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820] text-balance"
              >
                Latest Travel Blogs &amp; Route Insights
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                Read practical guides covering best travel seasons, ghat road comparisons, forest
                checkpost rules, and family-friendly itineraries around Coimbatore.
              </p>
            </div>
            <a
              href="/blog/"
              onClick={(e) => handleLink(e, '/blog/')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#101820] underline-offset-4 hover:underline whitespace-nowrap shrink-0"
            >
              <span>View All Blogs (10 Articles)</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="flex flex-col rounded-xl border border-[#E2DDD2] bg-white overflow-hidden"
              >
                <AssetImage
                  filename={blog.imageFilename}
                  alt={blog.imageAlt}
                  className="w-full border-0 border-b border-[#E2DDD2]"
                />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{blog.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{blog.readingTime}</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-[#101820] leading-snug">
                      <a
                        href={blog.path}
                        onClick={(e) => handleLink(e, blog.path)}
                        className="hover:underline"
                      >
                        {blog.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <a
                      href={blog.path}
                      onClick={(e) => handleLink(e, blog.path)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#101820] hover:underline"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQS SECTION */}
      <section
        aria-labelledby="home-faq-heading"
        className="py-16 sm:py-20 bg-white border-t border-[#E5E0D5]"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold text-slate-500">06. Common Questions</p>
              <h2
                id="home-faq-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101820]"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <a
              href="/faq/"
              onClick={(e) => handleLink(e, '/faq/')}
              className="text-xs sm:text-sm font-bold text-[#101820] underline-offset-4 hover:underline whitespace-nowrap"
            >
              View Complete FAQ Page →
            </a>
          </div>

          <div className="divide-y divide-slate-200 rounded-xl border border-[#E2DDD2] bg-[#FAF9F5]">
            {GENERAL_FAQS.slice(0, 5).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} className="p-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-sm sm:text-base font-bold text-[#101820] focus-visible:outline-2 focus-visible:outline-[#101820]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL BOOKING CTA (Uses "travel-cta-banner.webp") */}
      <section aria-labelledby="final-cta-heading" className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#101820] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
                <p className="text-xs font-semibold text-[#F5C518]">
                  Plan Your Local or Outstation Trip
                </p>
                <h2
                  id="final-cta-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance"
                >
                  Ready to Estimate Your Fare or Explore Outstation Tours?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Use our interactive trip calculator to get an instant route-based estimate, or
                  browse our 10 curated destination guides starting from Coimbatore.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToBooking()}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 py-3 text-sm font-bold text-[#101820] hover:bg-[#eab808] whitespace-nowrap"
                  >
                    <span>Calculate Trip Fare</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <a
                    href="/contact/"
                    onClick={(e) => handleLink(e, '/contact/')}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 whitespace-nowrap"
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
