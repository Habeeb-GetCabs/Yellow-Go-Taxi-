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
    if (!customerName.trim() || customerName.trim().length < 2) {
      setValidationError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!validatePhone(customerPhone)) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
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
        customerName,
        customerPhone,
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
    <div className="rounded-xl border border-[#E2DDD2] bg-white p-5 sm:p-6 shadow-xs text-[#101820]">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#101820]">
          {heading}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">{subheading}</p>
      </div>

      {/* Interactive Trip Type Segmented Tabs (4 Required Modes) */}
      <div
        role="tablist"
        aria-label="Select Trip Type"
        className="grid grid-cols-2 gap-1.5 rounded-lg bg-[#F4F1EA] p-1.5 mb-5"
      >
        {TRIP_MODES.map((mode) => {
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
              className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101820] ${
                isActive
                  ? 'bg-[#101820] text-[#F5C518] shadow-xs'
                  : 'text-slate-700 hover:text-[#101820] hover:bg-white/60'
              }`}
            >
              {TRIP_TYPE_LABELS[mode]}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleCalculateFare} noValidate className="space-y-4">
        {/* Pickup & Drop Address Fields with Autocomplete */}
        <div className="space-y-3">
          {/* Pickup Input */}
          <div className="relative">
            <label
              htmlFor={`${formId}-pickup`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Pickup Address
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
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
                placeholder="e.g. Coimbatore International Airport (CJB)"
                className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
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

            {/* Quick Pickup Hub Selectors */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
              <span className="font-medium text-slate-600">Pickup hubs:</span>
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
                    className="underline hover:text-[#101820] font-medium"
                  >
                    {hub.short}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Swap Pickup & Drop Button + Quick Route Presets */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
              <span>Quick routes:</span>
              <button
                type="button"
                onClick={() => {
                  setPickupAddress('Coimbatore International Airport (CJB)');
                  setDropAddress('Ooty (Udhagamandalam)');
                  setFareResult(null);
                  setRouteError(null);
                }}
                className="underline hover:text-[#101820] font-medium"
              >
                Airport → Ooty
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  setPickupAddress('Coimbatore Junction Railway Station');
                  setDropAddress('Isha Yoga Center & Adiyogi');
                  setFareResult(null);
                  setRouteError(null);
                }}
                className="underline hover:text-[#101820] font-medium"
              >
                Junction → Isha
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  setPickupAddress('Gandhipuram Central Bus Stand');
                  setDropAddress('Valparai Hill Station');
                  setFareResult(null);
                  setRouteError(null);
                }}
                className="underline hover:text-[#101820] font-medium"
              >
                CBE → Valparai
              </button>
            </div>

            <button
              type="button"
              onClick={handleSwapLocations}
              aria-label="Swap pickup and drop addresses"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[#101820] whitespace-nowrap shrink-0"
            >
              <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
              <span>Swap</span>
            </button>
          </div>

          {/* Drop Input */}
          <div className="relative">
            <label
              htmlFor={`${formId}-drop`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Drop Address
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
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
                placeholder="e.g. Ooty (Udhagamandalam) or R.S. Puram"
                className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
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
        </div>

        {/* Date & Duration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-date`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Travel Date
            </label>
            <div className="relative">
              <Calendar
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id={`${formId}-date`}
                type="date"
                required
                value={travelDate}
                onChange={(e) => {
                  setTravelDate(e.target.value);
                  setFareResult(null);
                }}
                className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>
          </div>

          {tripType === 'hourly' && (
            <div>
              <label
                htmlFor={`${formId}-hours`}
                className="block text-xs font-semibold text-[#101820] mb-1"
              >
                Rental Duration (Hours)
              </label>
              <div className="relative">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id={`${formId}-hours`}
                  type="number"
                  min={1}
                  max={72}
                  step="1"
                  required
                  value={bookedHours}
                  onChange={(e) => {
                    setBookedHours(e.target.value);
                    setFareResult(null);
                  }}
                  className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm font-mono-tabular text-[#101820] focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>
            </div>
          )}

          {tripType === 'round_trip' && (
            <div>
              <label
                htmlFor={`${formId}-days`}
                className="block text-xs font-semibold text-[#101820] mb-1"
              >
                Trip Duration (Days)
              </label>
              <div className="relative">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id={`${formId}-days`}
                  type="number"
                  min={1}
                  max={60}
                  step={1}
                  required
                  value={chargeableDays}
                  onChange={(e) => {
                    setChargeableDays(e.target.value);
                    setFareResult(null);
                  }}
                  className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm font-mono-tabular text-[#101820] focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>
            </div>
          )}

          {(tripType === 'local' || tripType === 'outstation_drop') && (
            <div className="flex flex-col justify-end">
              <div className="rounded-lg border border-slate-200 bg-[#FAF9F5] px-3 py-2.5 text-xs text-slate-600">
                {tripType === 'local'
                  ? 'Point-to-point city transfer within Coimbatore.'
                  : 'Single point-to-point intercity drop transfer.'}
              </div>
            </div>
          )}
        </div>

        {/* Optional Return Date selector for Round Trip */}
        {tripType === 'round_trip' && (
          <div>
            <label
              htmlFor={`${formId}-return-date`}
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Return Date (Optional — auto-calculates inclusive trip days)
            </label>
            <input
              id={`${formId}-return-date`}
              type="date"
              min={travelDate}
              value={returnDate}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setFareResult(null);
              }}
              className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-[#FAF9F5] px-3 py-1.5 text-xs text-[#101820] focus:border-[#101820] focus:outline-none"
            />
          </div>
        )}

        {/* Customer Name & Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Your Name
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id={`${formId}-name`}
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-[#101820] placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${formId}-phone`}
              className="block text-xs font-semibold text-[#101820] mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id={`${formId}-phone`}
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm font-mono-tabular text-[#101820] placeholder:font-sans placeholder:text-slate-400 focus:border-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Primary Calculate Fare Button */}
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full min-h-[48px] rounded-lg bg-[#F5C518] px-5 py-3 text-sm font-bold text-[#101820] transition-colors hover:bg-[#eab808] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101820] disabled:opacity-60 whitespace-nowrap"
        >
          {isCalculating ? 'Calculating Route Distance...' : 'Calculate Estimated Fare'}
        </button>
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

          {/* WhatsApp Booking Action */}
          <div className="mt-4 space-y-2.5">
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
