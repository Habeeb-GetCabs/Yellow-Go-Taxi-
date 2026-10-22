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
  MessageCircle,
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            Coimbatore’s Trusted Fleet
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            About <span className="text-[#FFC400]">{business.name}</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            A dedicated local and outstation taxi service planned for {business.city},{' '}
            {business.state}, focused on route transparency, clear trip categories, and direct
            booking assistance.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111820]">
                Designed Around Clear Trip Planning
              </h2>
              <p className="text-sm sm:text-base text-[#263241] leading-relaxed">
                {business.name} was created to simplify how passengers in {business.city} plan city
                transfers, hourly errands, point-to-point intercity drops, and multi-day hill
                station tours across the Western and Eastern Ghats.
              </p>
              <p className="text-sm sm:text-base text-[#263241] leading-relaxed">
                Instead of requiring customers to guess which package applies to their journey, our
                platform separates bookings into four clear modes—Local, Hourly Rental, Outstation
                Drop, and Round Trip—and provides an instant route-based fare estimate before you
                submit your booking enquiry.
              </p>

              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm text-[#263241] shadow-sm">
                <p className="font-extrabold text-[#111820] text-base">
                  Base Location &amp; Coimbatore Operating Hubs
                </p>
                <p>
                  <strong className="text-[#111820]">Primary Base:</strong> {business.address} ({business.phone})
                </p>
                <div>
                  <p className="font-extrabold text-[#111820] mb-2">Active Pickup &amp; Dispatch Hubs:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {business.operatingHubs.map((hub) => (
                      <span
                        key={hub}
                        className="rounded-lg border border-[#D8DFE8] bg-[#F7F6F1] px-3 py-1 text-xs font-bold text-[#111820]"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border-2 border-[#FFC400] shadow-xl bg-[#111820]">
                <AssetImage
                  filename="why-choose-us.webp"
                  alt="Clean, comfortable interior of a Yellow Go Taxi vehicle prepared for passenger travel"
                  priority={true}
                  className="w-full border-0"
                />
              </div>
            </div>
          </div>

          {/* Quick Links to Services & Tours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-[#D8DFE8]">
            <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 space-y-3.5 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#111820]">Explore Our Four Service Modes</h2>
              <ul className="space-y-2.5 text-sm">
                {TAXI_SERVICES.map((svc) => (
                  <li key={svc.id}>
                    <a
                      href={svc.path}
                      onClick={(e) => handleLink(e, svc.path)}
                      className="font-bold text-[#111820] hover:text-[#F5B800] hover:underline"
                    >
                      {svc.title} — {svc.shortDescription}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 space-y-3.5 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#111820]">Explore Our 10 Tour Routes</h2>
              <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                {TOUR_PAGES.map((tour) => (
                  <a
                    key={tour.id}
                    href={tour.path}
                    onClick={(e) => handleLink(e, tour.path)}
                    className="font-bold text-[#263241] hover:text-[#111820] underline"
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Contact Us', path: '/contact/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            24/7 Coimbatore Dispatch
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Contact <span className="text-[#FFC400]">{business.name}</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Use our instant fare calculator, send a general trip enquiry, or review our configured
            dispatch contact channels below.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Configurable Contact Details + General Enquiry Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-7 space-y-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-[#111820]">
                    Dispatch, Address &amp; Operating Hubs
                  </h2>
                  <p className="text-xs font-medium text-[#526174] mt-1">
                    Direct booking and dispatch support across {business.city} and surrounding South
                    India outstation corridors.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#111820]">Office &amp; Primary Base Address</p>
                      <p className="text-[#263241] font-semibold">
                        {hasConfirmedAddress() ? business.address : `${business.city}, ${business.state}`}
                      </p>
                      <p className="text-xs text-[#526174] mt-1">
                        <strong className="text-[#111820]">Operating Hubs:</strong>{' '}
                        {business.operatingHubs.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#111820]">Call &amp; WhatsApp Booking</p>
                      <p className="text-[#111820] font-mono-tabular font-extrabold">
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
                      <p className="text-xs text-[#138443] font-extrabold mt-1">
                        {hasConfirmedWhatsapp() ? (
                          <a
                            href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('whatsapp_click', { location: 'contact_page' })}
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>WhatsApp Dispatch: +91 99943 53722 (Click to Chat)</span>
                          </a>
                        ) : (
                          'WhatsApp number pending owner configuration'
                        )}
                      </p>
                    </div>
                  </div>

                  {hasConfirmedEmail() && (
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-extrabold text-[#111820]">Email Address</p>
                        <p className="text-[#263241]">{business.email}</p>
                      </div>
                    </div>
                  )}

                  {hasConfirmedHours() && (
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FFC400] text-[#111820] flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="h-5 w-5 stroke-[2.3]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-extrabold text-[#111820]">Operating Hours</p>
                        <p className="text-[#263241] font-semibold">{business.operatingHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* General Enquiry Form */}
              <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#111820]">Send a Custom Trip Enquiry</h2>
                <p className="text-xs sm:text-sm text-[#526174]">
                  Have a custom multi-city itinerary or group requirement? Prepare your enquiry
                  below.
                </p>

                {!submitted ? (
                  <form onSubmit={handleEnquirySubmit} noValidate className="space-y-4">
                    <div>
                      <label
                        htmlFor={`${formId}-contact-name`}
                        className="block text-xs sm:text-sm font-extrabold text-[#111820] mb-1.5"
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
                        className="w-full min-h-[46px] rounded-xl border-2 border-[#D8DFE8] bg-white px-3.5 py-2 text-sm font-semibold text-[#111820] focus:border-[#111820] focus:outline-none focus:ring-3 focus:ring-[#FFC400]/40"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-contact-phone`}
                        className="block text-xs sm:text-sm font-extrabold text-[#111820] mb-1.5"
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
                        className="w-full min-h-[46px] rounded-xl border-2 border-[#D8DFE8] bg-white px-3.5 py-2 text-sm font-mono-tabular font-semibold text-[#111820] focus:border-[#111820] focus:outline-none focus:ring-3 focus:ring-[#FFC400]/40"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-contact-details`}
                        className="block text-xs sm:text-sm font-extrabold text-[#111820] mb-1.5"
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
                        className="w-full rounded-xl border-2 border-[#D8DFE8] bg-white px-3.5 py-2 text-sm font-semibold text-[#111820] focus:border-[#111820] focus:outline-none focus:ring-3 focus:ring-[#FFC400]/40"
                      />
                    </div>

                    {error && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 p-3 text-xs font-bold text-red-900"
                      >
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" aria-hidden="true" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="min-h-[48px] rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-6 py-2.5 text-sm font-extrabold text-[#111820] shadow-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Prepare Custom Enquiry
                    </button>
                  </form>
                ) : (
                  <div
                    role="status"
                    className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-xs sm:text-sm text-emerald-950 space-y-3"
                  >
                    <div className="flex items-center gap-2 font-extrabold">
                      <CheckCircle2 className="h-4 w-4 text-[#138443]" aria-hidden="true" />
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
                        className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#138443] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0f6b36]"
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
                        className="text-xs font-extrabold underline text-emerald-900"
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-12 sm:py-16 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'FAQs', path: '/faq/' },
            ]}
          />
          <span className="inline-block rounded-md bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#111820]">
            Booking &amp; Tariff Help
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked <span className="text-[#FFC400]">Questions</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Clear answers regarding our four taxi booking modes, route distance calculation,
            WhatsApp enquiries, and outstation tour planning.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F7F6F1]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="divide-y divide-[#D8DFE8] rounded-2xl border-2 border-[#D8DFE8] bg-white overflow-hidden shadow-sm">
            {GENERAL_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.question} className="p-5 sm:p-6">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-base font-extrabold text-[#111820] cursor-pointer"
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
                    <p className="mt-3 text-sm sm:text-base text-[#263241] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border-2 border-[#FFC400] bg-[#111820] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-lg font-extrabold text-white">Ready to Estimate Your Trip?</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Return to our trip calculator or browse our 10 dedicated destination guides.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                onClick={(e) => handleLink(e, '/')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-5 py-2.5 text-xs font-extrabold text-[#111820] whitespace-nowrap"
              >
                Open Fare Calculator
              </a>
              <a
                href="/tours/"
                onClick={(e) => handleLink(e, '/tours/')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-white/25 bg-white/8 px-5 py-2.5 text-xs font-extrabold text-white hover:border-[#FFC400] whitespace-nowrap"
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-10 sm:py-14 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Privacy Policy', path: '/privacy-policy/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Policy Template — Requires Owner Review &amp; Final Approval Before Live
            Launch
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#F7F6F1]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-[#263241] leading-relaxed shadow-sm">
            <div className="rounded-xl border-2 border-[#FFC400] bg-[#F7F6F1] p-4 text-xs text-[#263241]">
              <strong className="text-[#111820]">Owner Approval Notice:</strong> Sections regarding
              data retention periods, official grievance contact email, and third-party
              analytics/advertising processors must be reviewed and confirmed by the business owner
              before connecting live campaigns.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#111820]">
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
              <h2 className="text-lg font-extrabold text-[#111820]">
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
              <h2 className="text-lg font-extrabold text-[#111820]">
                3. Mapping, Analytics &amp; Advertising Technologies
              </h2>
              <p>When configured by the website owner, this website may use:</p>
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
              <h2 className="text-lg font-extrabold text-[#111820]">
                4. Contact for Privacy Requests
              </h2>
              <p>
                For questions regarding your personal data, please contact {business.name} via the
                official email or telephone number published on our Contact Us page.
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-10 sm:py-14 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Terms & Conditions', path: '/terms-and-conditions/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Terms Template — Requires Owner Review &amp; Final Approval Before Live
            Operations
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#F7F6F1]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-[#263241] leading-relaxed shadow-sm">
            <div className="rounded-xl border-2 border-[#FFC400] bg-[#F7F6F1] p-4 text-xs text-[#263241]">
              <strong className="text-[#111820]">Owner Approval Notice:</strong> Tariff inclusions,
              partial-hour rounding rules, waiting charges, and statutory fee handling must be
              approved by the owner of {business.name} prior to commercial launch. Current tariff
              status: {fareConfig.requiresOwnerApproval ? 'Pending Owner Approval' : 'Approved'}.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#111820]">
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
              <h2 className="text-lg font-extrabold text-[#111820]">
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
              <h2 className="text-lg font-extrabold text-[#111820]">
                3. Changes to Confirmed Trips &amp; Additional Distance
              </h2>
              <p>
                If a passenger requests additional sightseeing detours, route changes, or extended
                hours/days beyond the originally confirmed itinerary, the final fare will be adjusted
                according to the applicable tariff for the extra kilometres or duration.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#111820]">
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

      <section className="bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820] text-white py-10 sm:py-14 border-b-4 border-[#FFC400]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            lightText
            onNavigate={onNavigate}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Cancellation & Refund Policy', path: '/cancellation-refund-policy/' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Configurable Policy Framework — Requires Owner Approval of Specific Notice Windows
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#F7F6F1]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-6 sm:p-10 space-y-6 text-sm sm:text-base text-[#263241] leading-relaxed shadow-sm">
            <div className="rounded-xl border-2 border-[#FFC400] bg-[#F7F6F1] p-4 text-xs text-[#263241]">
              <strong className="text-[#111820]">Owner Approval Required:</strong> No arbitrary
              cancellation cutoff hours or unapproved refund percentages have been invented on this
              page. The business owner must specify the exact advance-payment and refund windows
              before accepting deposits.
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#111820]">
                1. Unconfirmed Enquiries Carry Zero Cancellation Fee
              </h2>
              <p>
                Calculating a fare on the website or sending an initial WhatsApp enquiry does not
                create a financial obligation. You may modify or withdraw an unconfirmed enquiry at
                any time without charge.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#111820]">
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
              <h2 className="text-lg font-extrabold text-[#111820]">
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

      <section className="py-20 bg-[#F7F6F1]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6">
          <span className="inline-block rounded-lg bg-[#111820] px-3 py-1 font-mono-tabular text-xs font-extrabold text-[#FFC400]">
            HTTP 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111820]">
            Route or Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-[#263241]">
            The page you requested does not exist or may have moved. Use the links below to return
            to the trip fare calculator or browse our tour directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#FFC400] hover:bg-[#F5B800] px-5 py-2.5 text-sm font-extrabold text-[#111820] shadow-md"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            </a>
            <a
              href="/tours/"
              onClick={(e) => handleLink(e, '/tours/')}
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border-2 border-[#111820] bg-white px-5 py-2.5 text-sm font-extrabold text-[#111820] hover:bg-[#111820] hover:text-[#FFC400]"
            >
              View All 10 Tour Routes
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
