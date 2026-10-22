import React, { useState, useEffect, useId } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ArrowUpDown,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Car,
  Route,
  Repeat,
  ArrowRight,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { business, hasConfirmedWhatsapp } from '../config/business';
import { TRIP_TYPE_LABELS } from '../config/fares';
import { trackEvent } from '../config/analytics';
import {
  calculateTripFare,
  calculateInclusiveTripDays,
  type TripMode,
  type FareCalculationSuccess,
} from '../utils/fareCalculator';
import {
  searchLocationSuggestions,
  getRouteDistanceKm,
  type LocationSuggestion,
} from '../utils/routingService';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export interface BookingFormProps {
  initialTripType?: TripMode;
  initialPickup?: string;
  initialDrop?: string;
  initialHours?: number;
  initialDays?: number;
  compact?: boolean;
  heading?: string;
  subheading?: string;
}

const TRIP_MODES: TripMode[] = ['local', 'hourly', 'outstation_drop', 'round_trip'];

function getDefaultTravelDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialTripType = 'outstation_drop',
  initialPickup = '',
  initialDrop = '',
  initialHours = 4,
  initialDays = 2,
  heading = 'Calculate Trip Fare & Book',
  subheading = 'Select your trip mode and route to view an instant fare estimate.',
}) => {
  const formId = useId();

  const [tripType, setTripType] = useState<TripMode>(initialTripType);
  const [pickupAddress, setPickupAddress] = useState(initialPickup);
  const [dropAddress, setDropAddress] = useState(initialDrop);
  const [travelDate, setTravelDate] = useState(getDefaultTravelDate());
  const [returnDate, setReturnDate] = useState('');
  const [bookedHours, setBookedHours] = useState<string>(String(initialHours));
  const [chargeableDays, setChargeableDays] = useState<string>(String(initialDays));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Autocomplete dropdown visibility
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);

  // Route & calculation states
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeSummaryText, setRouteSummaryText] = useState<string | null>(null);
  const [fareResult, setFareResult] = useState<FareCalculationSuccess | null>(null);

  // Fallback enquiry & WhatsApp preview states
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Sync props when navigating between dedicated service/tour pages
  useEffect(() => {
    setTripType(initialTripType);
    if (initialPickup) setPickupAddress(initialPickup);
    if (initialDrop) setDropAddress(initialDrop);
    if (initialHours) setBookedHours(String(initialHours));
    if (initialDays) setChargeableDays(String(initialDays));
    setFareResult(null);
    setRouteError(null);
    setValidationError(null);
    setEnquirySubmitted(false);
  }, [initialTripType, initialPickup, initialDrop, initialHours, initialDays]);

  // Automatically sync chargeableDays when user picks an optional returnDate on Round Trip
  useEffect(() => {
    if (tripType === 'round_trip' && travelDate && returnDate) {
      const days = calculateInclusiveTripDays(travelDate, returnDate);
      if (days !== null && days >= 1) {
        setChargeableDays(String(days));
      }
    }
  }, [tripType, travelDate, returnDate]);

  const pickupSuggestions: LocationSuggestion[] = searchLocationSuggestions(pickupAddress);
  const dropSuggestions: LocationSuggestion[] = searchLocationSuggestions(dropAddress);

  const handleSwapLocations = () => {
    const temp = pickupAddress;
    setPickupAddress(dropAddress);
    setDropAddress(temp);
    setFareResult(null);
    setRouteError(null);
  };

  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/[^\d]/g, '');
    return digits.length >= 10 && digits.length <= 13;
  };

  const handleCalculateFare = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setRouteError(null);
    setFareResult(null);
    setEnquirySubmitted(false);

    if (!pickupAddress.trim()) {
      setValidationError('Please enter or select a pickup address.');
      return;
    }
    if (!dropAddress.trim()) {
      setValidationError('Please enter or select a drop address.');
      return;
    }
    if (!travelDate.trim()) {
      setValidationError('Please select your travel date.');
      return;
    }
    if (tripType === 'round_trip' && returnDate) {
      const computedDays = calculateInclusiveTripDays(travelDate, returnDate);
      if (computedDays === null) {
        setValidationError('Return date cannot be earlier than the pickup travel date.');
        return;
      }
    }

    const parsedHours = Number(bookedHours);
    const parsedDays = Number(chargeableDays);

    if (tripType === 'hourly' && (!Number.isFinite(parsedHours) || parsedHours <= 0 || parsedHours > 72)) {
      setValidationError('Please enter a valid hourly rental duration between 1 and 72 hours.');
      return;
    }

    if (
      tripType === 'round_trip' &&
      (!Number.isFinite(parsedDays) || !Number.isInteger(parsedDays) || parsedDays < 1 || parsedDays > 60)
    ) {
      setValidationError('Please enter a valid number of round-trip days (whole number between 1 and 60).');
      return;
    }

    setIsCalculating(true);
    trackEvent('fare_calculation_request', { trip_type: tripType });

    const routeRes = await getRouteDistanceKm(pickupAddress, dropAddress);
    setIsCalculating(false);

    if (!routeRes.ok) {
      setRouteError(routeRes.errorMessage);
      return;
    }

    // For round_trip, getRouteDistanceKm returns the one-way route distance, so we pass isTotalReturnDistance: false
    // to calculate the actual round-trip distance once without double counting.
    const calcRes = calculateTripFare({
      tripType,
      distanceKm: routeRes.distanceKm,
      isTotalReturnDistance: tripType === 'round_trip' ? false : true,
      bookedHours: tripType === 'hourly' ? parsedHours : undefined,
      chargeableDays: tripType === 'round_trip' ? parsedDays : undefined,
    });

    if (!calcRes.ok) {
      setValidationError(calcRes.errorMessage);
      return;
    }

    setRouteSummaryText(routeRes.routeSummary);
    setFareResult(calcRes);
    trackEvent('booking_form_submit', {
      trip_type: tripType,
      distance_km: calcRes.chargeableDistanceKm,
    });
  };

  const durationLabel =
    tripType === 'hourly' && fareResult?.bookedHours
      ? `${fareResult.bookedHours} Hour${fareResult.bookedHours > 1 ? 's' : ''}`
      : tripType === 'round_trip' && fareResult?.chargeableDays
      ? `${fareResult.chargeableDays} Day${fareResult.chargeableDays > 1 ? 's' : ''}`
      : undefined;

  const whatsappData = fareResult
    ? buildWhatsAppUrl({
        businessName: business.name,
        whatsappNumber: business.whatsapp,
        customerName: customerName.trim() || 'Traveler',
        customerPhone: customerPhone.trim(),
        tripType,
        pickupAddress,
        dropAddress,
        travelDate,
        durationLabel,
        estimatedDistanceKm: fareResult.chargeableDistanceKm,
        estimatedFare: fareResult.estimatedFare,
      })
    : null;

  const handleCopyEnquiry = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-xl text-[#101820]">
      {/* Interactive Trip Type Segmented Tabs (4 Required Modes in Exact Order) */}
      <div
        role="tablist"
        aria-label="Select Trip Type"
        className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-slate-100/70 p-1 mb-4"
      >
        {[
          { mode: 'local' as TripMode, label: 'Local Taxi', icon: Car },
          { mode: 'hourly' as TripMode, label: 'Hourly Rental', icon: Clock },
          { mode: 'outstation_drop' as TripMode, label: 'Outstation', icon: Route },
          { mode: 'round_trip' as TripMode, label: 'Round Trip', icon: Repeat },
        ].map(({ mode, label, icon: TabIcon }) => {
          const isActive = tripType === mode;
          return (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setTripType(mode);
                setFareResult(null);
                setRouteError(null);
                setValidationError(null);
              }}
              className={`min-h-[42px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#F5C518] text-[#101820] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#101820] hover:bg-white/80'
              }`}
            >
              <TabIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleCalculateFare} noValidate className="space-y-3.5">
        {/* Main Inputs Row: Pick up location, Drop location, and Get Fare Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Pickup Input */}
          <div className="md:col-span-5 relative">
            <label
              htmlFor={`${formId}-pickup`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Pick up location
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                aria-hidden="true"
              />
              <input
                id={`${formId}-pickup`}
                type="text"
                required
                autoComplete="off"
                value={pickupAddress}
                onFocus={() => setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 180)}
                onChange={(e) => {
                  setPickupAddress(e.target.value);
                  setShowPickupSuggestions(true);
                  setFareResult(null);
                }}
                placeholder="Enter pick up location"
                className="w-full min-h-[46px] rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>

            {showPickupSuggestions && pickupSuggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Suggested pickup locations"
                className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                {pickupSuggestions.map((loc) => (
                  <li key={loc.id} role="option" aria-selected={pickupAddress === loc.label}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setPickupAddress(loc.label);
                        setShowPickupSuggestions(false);
                        setFareResult(null);
                        setRouteError(null);
                      }}
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#FAF9F5]"
                    >
                      <span className="text-xs font-semibold text-[#101820]">{loc.label}</span>
                      <span className="text-[11px] text-slate-500">{loc.secondaryText}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Drop Input */}
          <div className="md:col-span-5 relative">
            <label
              htmlFor={`${formId}-drop`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Drop location
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                aria-hidden="true"
              />
              <input
                id={`${formId}-drop`}
                type="text"
                required
                autoComplete="off"
                value={dropAddress}
                onFocus={() => setShowDropSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDropSuggestions(false), 180)}
                onChange={(e) => {
                  setDropAddress(e.target.value);
                  setShowDropSuggestions(true);
                  setFareResult(null);
                }}
                placeholder="Enter drop location"
                className="w-full min-h-[46px] rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>

            {showDropSuggestions && dropSuggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Suggested drop locations"
                className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                {dropSuggestions.map((loc) => (
                  <li key={loc.id} role="option" aria-selected={dropAddress === loc.label}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setDropAddress(loc.label);
                        setShowDropSuggestions(false);
                        setFareResult(null);
                        setRouteError(null);
                      }}
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#FAF9F5]"
                    >
                      <span className="text-xs font-semibold text-[#101820]">{loc.label}</span>
                      <span className="text-[11px] text-slate-500">{loc.secondaryText}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Primary Get Fare Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full min-h-[46px] rounded-lg bg-[#F5C518] px-4 py-2.5 text-sm font-bold text-[#101820] transition-colors hover:bg-[#eab808] flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap disabled:opacity-60"
            >
              <span>{isCalculating ? 'Calculating...' : 'Get Fare'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Quick Hub Selectors & Swap Option */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-700">Popular Hubs:</span>
            {[
              { short: 'Gandhipuram', full: 'Gandhipuram Central Bus Stand' },
              { short: 'Peelamedu', full: 'Peelamedu (PSG Tech /TIDEL Park)' },
              { short: 'Airport', full: 'Coimbatore International Airport (CJB)' },
              { short: 'Railway Station', full: 'Coimbatore Junction Railway Station' },
              { short: 'R.S. Puram', full: 'R.S. Puram (D.B. Road)' },
            ].map((hub, idx) => (
              <React.Fragment key={hub.short}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <button
                  type="button"
                  onClick={() => {
                    setPickupAddress(hub.full);
                    setFareResult(null);
                    setRouteError(null);
                  }}
                  className="hover:text-[#101820] hover:underline font-medium"
                >
                  {hub.short}
                </button>
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Swap pickup and drop addresses"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#101820] underline"
          >
            <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            <span>Swap locations</span>
          </button>
        </div>

        {/* Mode-Specific Rental/Round-Trip Duration Selectors */}
        {(tripType === 'hourly' || tripType === 'round_trip') && (
          <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 flex flex-wrap items-center gap-4 text-xs">
            {tripType === 'hourly' && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <label htmlFor={`${formId}-hours`} className="font-semibold text-slate-800">
                  Rental Duration:
                </label>
                <select
                  id={`${formId}-hours`}
                  value={bookedHours}
                  onChange={(e) => {
                    setBookedHours(e.target.value);
                    setFareResult(null);
                  }}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-[#101820]"
                >
                  <option value="2">2 Hours (20 km included)</option>
                  <option value="4">4 Hours (40 km included)</option>
                  <option value="8">8 Hours (80 km included)</option>
                  <option value="12">12 Hours (120 km included)</option>
                  <option value="24">24 Hours</option>
                </select>
              </div>
            )}

            {tripType === 'round_trip' && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <label htmlFor={`${formId}-days`} className="font-semibold text-slate-800">
                  Trip Duration:
                </label>
                <select
                  id={`${formId}-days`}
                  value={chargeableDays}
                  onChange={(e) => {
                    setChargeableDays(e.target.value);
                    setFareResult(null);
                  }}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-[#101820]"
                >
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Validation Error Alert */}
        {validationError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-900"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Exact Reassurance Row matching reference image */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-3.5 w-3.5 text-[#101820]" aria-hidden="true" />
            <span className="font-medium">No phone number required</span>
          </div>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#F5C518] fill-current" aria-hidden="true" />
            <span className="font-medium">Get instant fare</span>
          </div>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
            <span className="font-medium">Easy booking via WhatsApp</span>
          </div>
        </div>
      </form>

      {/* Route Resolution Fallback State ("Request a Quote" instead of guessing distance) */}
      {routeError && (
        <div
          role="region"
          aria-label="Custom Route Quote Request"
          className="mt-4 rounded-lg border border-amber-300 bg-[#FFFDF5] p-4"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-[#101820]">{routeError}</p>
              <p>
                We never estimate fares from arbitrary or guessed straight-line distances. You can
                request a manual route quote for this exact address pair:
              </p>
              {!enquirySubmitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setEnquirySubmitted(true);
                    trackEvent('contact_enquiry_submit', { source: 'custom_route_fallback' });
                  }}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#101820] px-4 py-2 text-xs font-semibold text-[#F5C518] hover:bg-slate-800 whitespace-nowrap"
                >
                  Request a Custom Route Quote
                </button>
              ) : (
                <div className="space-y-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-emerald-900 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>
                      Enquiry prepared for {pickupAddress} to {dropAddress}.
                    </span>
                  </div>
                  {hasConfirmedWhatsapp() && (
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                        `Hello ${business.name},\n\nI would like a custom route quote.\nName: ${customerName}\nPhone: ${customerPhone}\nTrip Type: ${TRIP_TYPE_LABELS[tripType]}\nPickup: ${pickupAddress}\nDestination: ${dropAddress}\nTravel Date: ${travelDate}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#166534]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Send Custom Quote Request on WhatsApp (99943 53722)</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer-Facing Estimated Fare Result (Strictly hides internal breakdown) */}
      {fareResult && whatsappData && (
        <div
          role="region"
          aria-live="polite"
          aria-label="Estimated Trip Fare"
          className="mt-5 rounded-xl border border-[#101820]/15 bg-[#FAF9F5] p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold text-slate-600">
              Your Estimated Trip Fare:
            </span>
            <span className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-[#101820]">
              {fareResult.formattedFare}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            <span>{TRIP_TYPE_LABELS[fareResult.tripType]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Est. {fareResult.chargeableDistanceKm} km road distance
            </span>
            {durationLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{durationLabel}</span>
              </>
            )}
          </div>
          {routeSummaryText && (
            <p className="mt-1 text-[11px] text-slate-500">
              {routeSummaryText} · Subject to route verification &amp; owner tariff confirmation
            </p>
          )}

          {/* Optional Name for WhatsApp Personalization */}
          <div className="mt-3.5 pt-3 border-t border-slate-200">
            <label
              htmlFor={`${formId}-opt-name`}
              className="block text-[11px] font-medium text-slate-600 mb-1"
            >
              Your Name (Optional — will be included in your WhatsApp enquiry):
            </label>
            <input
              id={`${formId}-opt-name`}
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh K (optional)"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none"
            />
          </div>

          {/* WhatsApp Booking Action */}
          <div className="mt-3 space-y-2.5">
            {hasConfirmedWhatsapp() && whatsappData.url ? (
              <a
                href={whatsappData.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('whatsapp_click', {
                    trip_type: fareResult.tripType,
                    estimated_fare: fareResult.estimatedFare,
                  })
                }
                className="flex w-full min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#166534] whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Book This Trip on WhatsApp</span>
              </a>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 cursor-not-allowed whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Book This Trip on WhatsApp (Pending Number Setup)</span>
                </button>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Configuration Notice:</strong> Live WhatsApp redirect is disabled until the
                  business owner adds the official WhatsApp number in{' '}
                  <code className="font-mono text-[11px]">src/config/business.ts</code>. Below is the
                  exact pre-filled enquiry message ready for dispatch:
                </p>
                <div className="rounded-md bg-[#F4F1EA] p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Prefilled WhatsApp Message Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyEnquiry(whatsappData.message)}
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium bg-white border border-slate-300 text-[#101820] hover:bg-slate-50"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>Copy Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 leading-relaxed">
                    {whatsappData.message}
                  </pre>
                </div>
              </div>
            )}
            <p className="text-[11px] text-slate-500">
              Note: Opening WhatsApp sends a booking enquiry. Your trip is confirmed only after
              availability and final details are verified by {business.name}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
