import React, { useState, useId } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AssetImage } from '../components/AssetImage';
import { BookingForm } from '../components/BookingForm';
import {
  business,
  hasConfirmedPhone,
  hasConfirmedWhatsapp,
  hasConfirmedEmail,
  hasConfirmedAddress,
  hasConfirmedHours,
} from '../config/business';
import { fareConfig } from '../config/fares';
import { GENERAL_FAQS } from '../data/faqsData';
import { TAXI_SERVICES } from '../data/servicesData';
import { TOUR_PAGES } from '../data/toursData';
import { trackEvent } from '../config/analytics';

export interface PageNavProps {
  onNavigate: (path: string) => void;
}

/* ============================================================================
 * ABOUT US PAGE (/about/)
 * ========================================================================== */
export const AboutPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <SeoHead
        title="About Yellow Go Taxi | Coimbatore Taxi & Outstation Tour Service"
        description="Learn about Yellow Go Taxi, a taxi and tour booking service planned for Coimbatore, Tamil Nadu. Focused on transparent fare estimation and structured service modes."
        canonicalPath="/about/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            About {business.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            A dedicated local and outstation taxi service planned for {business.city},{' '}
            {business.state}, focused on route transparency, clear trip categories, and direct
            booking assistance.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl font-bold text-[#101820]">
                Designed Around Clear Trip Planning
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {business.name} was created to simplify how passengers in {business.city} plan city
                transfers, hourly errands, point-to-point intercity drops, and multi-day hill
                station tours across the Western and Eastern Ghats.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Instead of requiring customers to guess which package applies to their journey, our
                platform separates bookings into four clear modes—Local, Hourly Rental, Outstation
                Drop, and Round Trip—and provides an instant route-based fare estimate before you
                submit your booking enquiry.
              </p>

              <div className="rounded-xl border border-[#E2DDD2] bg-white p-5 space-y-3 text-xs sm:text-sm text-slate-600">
                <p className="font-bold text-[#101820]">
                  Base Location &amp; Coimbatore Operating Hubs
                </p>
                <p>
                  <strong>Primary Base:</strong> {business.address} ({business.phone})
                </p>
                <div>
                  <p className="font-semibold text-[#101820] mb-1.5">Active Pickup &amp; Dispatch Hubs:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {business.operatingHubs.map((hub) => (
                      <span
                        key={hub}
                        className="rounded-md border border-[#E2DDD2] bg-[#FAF9F5] px-2.5 py-1 text-xs font-medium text-[#101820]"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <AssetImage
                filename="why-choose-us.webp"
                alt="Clean, comfortable interior of a Yellow Go Taxi vehicle prepared for passenger travel"
                priority={true}
                className="w-full rounded-xl"
              />
            </div>
          </div>

          {/* Quick Links to Services & Tours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E2DDD2]">
            <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 space-y-3">
              <h2 className="text-lg font-bold text-[#101820]">Explore Our Four Service Modes</h2>
              <ul className="space-y-2 text-sm">
                {TAXI_SERVICES.map((svc) => (
                  <li key={svc.id}>
                    <a
                      href={svc.path}
                      onClick={(e) => handleLink(e, svc.path)}
                      className="font-semibold text-[#101820] hover:underline"
                    >
                      {svc.title} — {svc.shortDescription}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 space-y-3">
              <h2 className="text-lg font-bold text-[#101820]">Explore Our 10 Tour Routes</h2>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {TOUR_PAGES.map((tour) => (
                  <a
                    key={tour.id}
                    href={tour.path}
                    onClick={(e) => handleLink(e, tour.path)}
                    className="font-medium text-slate-700 hover:text-[#101820] underline"
                  >
                    Coimbatore to {tour.destinationName}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * CONTACT US PAGE (/contact/)
 * ========================================================================== */
export const ContactPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const formId = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    const cleanDigits = phone.replace(/[^\d]/g, '');
    if (cleanDigits.length < 10 || cleanDigits.length > 13) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!tripDetails.trim() || tripDetails.trim().length < 5) {
      setError('Please share brief details about your planned route or enquiry.');
      return;
    }

    setSubmitted(true);
    trackEvent('contact_enquiry_submit', { source: 'contact_page' });
  };

  return (
    <>
      <SeoHead
        title="Contact Yellow Go Taxi | Coimbatore Booking Enquiry & Support"
        description="Get in touch with Yellow Go Taxi in Coimbatore for local cab enquiries, outstation drop quotes, and multi-day hill station tour bookings."
        canonicalPath="/contact/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact Us', path: '/contact/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Contact Us', path: '/contact/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Contact {business.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Use our instant fare calculator, send a general trip enquiry, or review our configured
            dispatch contact channels below.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Configurable Contact Details + General Enquiry Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#101820]">Dispatch, Address &amp; Operating Hubs</h2>
                <p className="text-xs text-slate-500">
                  Direct booking and dispatch support across {business.city} and surrounding South
                  India outstation corridors.
                </p>

                <div className="space-y-4 pt-2 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[#101820] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-[#101820]">Office &amp; Primary Base Address</p>
                      <p className="text-slate-700 font-medium">
                        {hasConfirmedAddress() ? business.address : `${business.city}, ${business.state}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>Operating Hubs:</strong> {business.operatingHubs.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-[#101820] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-[#101820]">Call &amp; WhatsApp Booking</p>
                      <p className="text-slate-700 font-mono-tabular font-semibold">
                        {hasConfirmedPhone() ? (
                          <a
                            href={`tel:${business.phone.replace(/\s+/g, '')}`}
                            onClick={() => trackEvent('phone_click', { location: 'contact_page' })}
                            className="hover:underline"
                          >
                            Call: {business.phone}
                          </a>
                        ) : (
                          'Telephone number pending owner configuration'
                        )}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        {hasConfirmedWhatsapp() ? (
                          <a
                            href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('whatsapp_click', { location: 'contact_page' })}
                            className="hover:underline"
                          >
                            WhatsApp Dispatch: +91 99943 53722 (Click to Chat)
                          </a>
                        ) : (
                          'WhatsApp number pending owner configuration'
                        )}
                      </p>
                    </div>
                  </div>

                  {hasConfirmedEmail() && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-[#101820] shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <p className="font-bold text-[#101820]">Email Address</p>
                        <p className="text-slate-600">{business.email}</p>
                      </div>
                    </div>
                  )}

                  {hasConfirmedHours() && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-[#101820] shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <p className="font-bold text-[#101820]">Operating Hours</p>
                        <p className="text-slate-600">{business.operatingHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* General Enquiry Form */}
              <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#101820]">Send a Custom Trip Enquiry</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Have a custom multi-city itinerary or group requirement? Prepare your enquiry
                  below.
                </p>

                {!submitted ? (
                  <form onSubmit={handleEnquirySubmit} noValidate className="space-y-4">
                    <div>
                      <label
                        htmlFor={`${formId}-contact-name`}
                        className="block text-xs font-semibold text-[#101820] mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        id={`${formId}-contact-name`}
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#101820]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-contact-phone`}
                        className="block text-xs font-semibold text-[#101820] mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id={`${formId}-contact-phone`}
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono-tabular text-[#101820]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-contact-details`}
                        className="block text-xs font-semibold text-[#101820] mb-1"
                      >
                        Route &amp; Travel Requirements
                      </label>
                      <textarea
                        id={`${formId}-contact-details`}
                        rows={3}
                        required
                        value={tripDetails}
                        onChange={(e) => setTripDetails(e.target.value)}
                        placeholder="Share pickup point, destinations, dates, and number of passengers"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#101820]"
                      />
                    </div>

                    {error && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900"
                      >
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" aria-hidden="true" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="min-h-[46px] rounded-lg bg-[#101820] px-6 py-2.5 text-sm font-bold text-[#F5C518] hover:bg-slate-800 whitespace-nowrap"
                    >
                      Prepare Custom Enquiry
                    </button>
                  </form>
                ) : (
                  <div
                    role="status"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm text-emerald-950 space-y-3"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      <span>Enquiry Ready for Dispatch</span>
                    </div>
                    <p>
                      Thank you, <strong>{name}</strong>. Click below to send your enquiry for{' '}
                      <em>“{tripDetails}”</em> directly to our WhatsApp dispatch ({business.phone}):
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                          `Hello ${business.name},\n\nName: ${name}\nPhone: ${phone}\nEnquiry: ${tripDetails}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-xs font-bold text-white hover:bg-[#166534]"
                      >
                        Send via WhatsApp (99943 53722)
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setName('');
                          setPhone('');
                          setTripDetails('');
                        }}
                        className="text-xs font-bold underline text-emerald-900"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Instant Fare Calculator */}
            <div className="lg:col-span-6">
              <BookingForm
                heading="Or Calculate an Instant Route Fare"
                subheading="Get an immediate fare estimate for standard Coimbatore local and outstation routes."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * FAQ PAGE (/faq/)
 * ========================================================================== */
export const FaqPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <SeoHead
        title="Frequently Asked Questions | Yellow Go Taxi Coimbatore"
        description="Answers to common questions about Yellow Go Taxi booking modes, fare estimation, WhatsApp booking confirmation, outstation tours, and cancellation policies."
        canonicalPath="/faq/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQs', path: '/faq/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'FAQs', path: '/faq/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Clear answers regarding our four taxi booking modes, route distance calculation,
            WhatsApp enquiries, and outstation tour planning.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#FAF9F5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="divide-y divide-slate-200 rounded-xl border border-[#E2DDD2] bg-white">
            {GENERAL_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.question} className="p-5 sm:p-6">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-base font-bold text-[#101820]"
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
                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#101820]">Ready to Estimate Your Trip?</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Return to our trip calculator or browse our 10 dedicated destination guides.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                onClick={(e) => handleLink(e, '/')}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#F5C518] px-4 py-2 text-xs font-bold text-[#101820] whitespace-nowrap"
              >
                Open Fare Calculator
              </a>
              <a
                href="/tours/"
                onClick={(e) => handleLink(e, '/tours/')}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-[#101820] whitespace-nowrap"
              >
                Browse Tours
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * PRIVACY POLICY PAGE (/privacy-policy/)
 * ========================================================================== */
export const PrivacyPolicyPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <>
      <SeoHead
        title="Privacy Policy | Yellow Go Taxi Coimbatore"
        description="Privacy Policy for Yellow Go Taxi explaining how customer booking form inputs, contact enquiries, and analytics/advertising data are handled."
        canonicalPath="/privacy-policy/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Privacy Policy', path: '/privacy-policy/' },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Policy Template — Requires Owner Review &amp; Final Approval Before Live
            Launch
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#FAF9F5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div className="rounded-lg border border-amber-300 bg-[#FFFDF5] p-4 text-xs text-slate-700">
              <strong>Owner Approval Notice:</strong> Sections regarding data retention periods,
              official grievance contact email, and third-party analytics/advertising processors
              must be reviewed and confirmed by the business owner before connecting live campaigns.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                1. Information Collected Through Booking &amp; Contact Forms
              </h2>
              <p>
                When you use the trip fare calculator or contact form on the {business.name} website,
                we ask only for the information necessary to estimate your route and respond to your
                booking enquiry:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your name and mobile telephone number.</li>
                <li>Selected trip type (Local, Hourly Rental, Outstation Drop, or Round Trip).</li>
                <li>Pickup location, drop destination, travel date, and trip duration.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                2. How We Use Your Booking Enquiry Information
              </h2>
              <p>
                Information entered into the calculator is used to compute an estimated road-route
                fare and, when you choose to proceed, to pre-fill a WhatsApp or direct booking
                enquiry message addressed to {business.name}. We do not sell or rent customer phone
                numbers or travel itineraries to third-party marketers.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                3. Mapping, Analytics &amp; Advertising Technologies
              </h2>
              <p>
                When configured by the website owner, this website may use:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Route &amp; Geocoding Services:</strong> To resolve road distances between
                  your selected pickup and drop points.
                </li>
                <li>
                  <strong>Google Analytics 4 (GA4) &amp; Google Ads Conversion Tracking:</strong> To
                  measure aggregate website traffic and user interactions (such as booking form
                  submissions or WhatsApp enquiry clicks) in compliance with applicable consent and
                  privacy regulations.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">4. Contact for Privacy Requests</h2>
              <p>
                For questions regarding your personal data, please contact {business.name} via the
                official email or telephone number published on our Contact Us page (currently
                pending owner configuration in <code className="font-mono text-xs">src/config/business.ts</code>).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * TERMS & CONDITIONS PAGE (/terms-and-conditions/)
 * ========================================================================== */
export const TermsAndConditionsPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <>
      <SeoHead
        title="Terms & Conditions | Yellow Go Taxi Coimbatore"
        description="Terms and Conditions governing taxi fare estimates, booking confirmation, route changes, tolls, and passenger responsibilities with Yellow Go Taxi."
        canonicalPath="/terms-and-conditions/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms & Conditions', path: '/terms-and-conditions/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Terms & Conditions', path: '/terms-and-conditions/' },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Terms Template — Requires Owner Review &amp; Final Approval Before Live
            Operations
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#FAF9F5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div className="rounded-lg border border-amber-300 bg-[#FFFDF5] p-4 text-xs text-slate-700">
              <strong>Owner Approval Notice:</strong> Tariff inclusions, partial-hour rounding
              rules, waiting charges, and statutory fee handling must be approved by the owner of{' '}
              {business.name} prior to commercial launch. Current tariff status:{' '}
              {fareConfig.requiresOwnerApproval ? 'Pending Owner Approval' : 'Approved'}.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                1. Online Fare Estimates vs. Final Confirmed Quotes
              </h2>
              <p>
                Fares displayed by the website calculator are initial estimates based on standard
                road route distance and the selected trip category. Opening a WhatsApp link or
                submitting an enquiry form does not constitute an automatically confirmed booking. A
                booking is confirmed only after {business.name} verifies vehicle availability, pickup
                timing, and final route details with the customer.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                2. Tolls, Permits, Parking &amp; Statutory Charges
              </h2>
              <p>
                Unless explicitly stated in your written booking confirmation, highway FASTag tolls,
                interstate commercial vehicle entry permits (for Kerala, Karnataka, or other states),
                forest checkpost fees, hill-station e-Pass/entry fees, and airport/hotel parking
                charges are payable based on actuals along the route.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                3. Changes to Confirmed Trips &amp; Additional Distance
              </h2>
              <p>
                If a passenger requests additional sightseeing detours, route changes, or extended
                hours/days beyond the originally confirmed itinerary, the final fare will be adjusted
                according to the applicable tariff for the extra kilometres or duration.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                4. Forest Checkposts, Night Curfews &amp; Safety Compliance
              </h2>
              <p>
                Drivers must comply with speed limits, Nilgiris/Kodaikanal district e-Pass rules,
                Kalhatti/Dhimbam/Aliyar/Sethumadai forest checkpost timings, and statutory seating
                capacities. Passengers are requested not to ask drivers to violate forest curfews or
                traffic regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * CANCELLATION & REFUND POLICY PAGE (/cancellation-refund-policy/)
 * ========================================================================== */
export const CancellationRefundPolicyPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  return (
    <>
      <SeoHead
        title="Cancellation & Refund Policy | Yellow Go Taxi Coimbatore"
        description="Cancellation, rescheduling, and refund policy framework for Yellow Go Taxi bookings in Coimbatore."
        canonicalPath="/cancellation-refund-policy/"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Cancellation & Refund Policy', path: '/cancellation-refund-policy/' },
        ]}
      />

      <section className="bg-[#101820] text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Cancellation & Refund Policy', path: '/cancellation-refund-policy/' },
            ]}
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Policy Framework — Requires Owner Approval of Specific Notice Windows
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#FAF9F5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#E2DDD2] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div className="rounded-lg border border-amber-300 bg-[#FFFDF5] p-4 text-xs text-slate-700">
              <strong>Owner Approval Required:</strong> No arbitrary cancellation cutoff hours or
              unapproved refund percentages have been invented on this page. The business owner must
              specify the exact advance-payment and refund windows before accepting deposits.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                1. Unconfirmed Enquiries Carry Zero Cancellation Fee
              </h2>
              <p>
                Calculating a fare on the website or sending an initial WhatsApp enquiry does not
                create a financial obligation. You may modify or withdraw an unconfirmed enquiry at
                any time without charge.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                2. Rescheduling a Confirmed Booking (Subject to Owner Policy)
              </h2>
              <p>
                If your travel date or flight/train arrival time changes after a booking has been
                confirmed, please notify {business.name} as early as possible through your booking
                confirmation channel. Rescheduling is accommodated subject to vehicle availability
                on the revised date.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#101820]">
                3. Cancellations &amp; Advance Refunds (Pending Owner Configuration)
              </h2>
              <p>
                Where an advance booking deposit is collected to reserve a vehicle for a specific
                date or outstation tour, the applicable cancellation cutoff window and refund
                processing timeline will be shared in writing at the time of booking confirmation
                once approved by the business owner.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ============================================================================
 * 404 NOT FOUND PAGE
 * ========================================================================== */
export const NotFoundPage: React.FC<PageNavProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <SeoHead
        title="Page Not Found (404) | Yellow Go Taxi"
        description="The requested page could not be found. Explore Yellow Go Taxi services, outstation tours, and travel guides from Coimbatore."
        canonicalPath="/404/"
      />

      <section className="py-20 bg-[#FAF9F5]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6">
          <p className="font-mono-tabular text-sm font-bold text-slate-500">HTTP 404</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101820]">
            Route or Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            The page you requested does not exist or may have moved. Use the links below to return
            to the trip fare calculator or browse our tour directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#101820] px-5 py-2.5 text-sm font-bold text-[#F5C518]"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="/tours/"
              onClick={(e) => handleLink(e, '/tours/')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-[#101820]"
            >
              View All 10 Tour Routes
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
