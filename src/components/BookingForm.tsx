import React, { useState, useEffect, useId, useRef } from 'react';
import {
  MapPin,
  Clock,
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
  Crosshair,
  Loader2,
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
  searchLocationsAsync,
  findLocationByLabelOrId,
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

function getDefaultTravelDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function isQueryEligibleForAutocomplete(query: string): boolean {
  const trimmed = query.trim();
  return trimmed.length >= 3 || /^r\.?s\.?$/i.test(trimmed);
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialTripType = 'outstation_drop',
  initialPickup = '',
  initialDrop = '',
  initialHours = 4,
  initialDays = 2,
  heading,
  subheading,
}) => {
  const formId = useId();

  const [tripType, setTripType] = useState<TripMode>(initialTripType);
  const [pickupAddress, setPickupAddress] = useState(initialPickup);
  const [dropAddress, setDropAddress] = useState(initialDrop);
  const [selectedPickup, setSelectedPickup] = useState<LocationSuggestion | null>(() =>
    findLocationByLabelOrId(initialPickup) || null
  );
  const [selectedDrop, setSelectedDrop] = useState<LocationSuggestion | null>(() =>
    findLocationByLabelOrId(initialDrop) || null
  );

  const [travelDate] = useState(getDefaultTravelDate());
  const [returnDate] = useState('');
  const [bookedHours, setBookedHours] = useState<string>(String(initialHours));
  const [chargeableDays, setChargeableDays] = useState<string>(String(initialDays));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone] = useState('');

  // Autocomplete dropdown visibility, dynamic results, loading, and keyboard active index
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDrop, setIsSearchingDrop] = useState(false);
  const [pickupActiveIdx, setPickupActiveIdx] = useState<number>(-1);
  const [dropActiveIdx, setDropActiveIdx] = useState<number>(-1);

  const pickupSearchAbortRef = useRef<AbortController | null>(null);
  const dropSearchAbortRef = useRef<AbortController | null>(null);

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
    if (initialPickup !== undefined) {
      setPickupAddress(initialPickup);
      setSelectedPickup(findLocationByLabelOrId(initialPickup) || null);
    }
    if (initialDrop !== undefined) {
      setDropAddress(initialDrop);
      setSelectedDrop(findLocationByLabelOrId(initialDrop) || null);
    }
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

  // Dynamic 3-character search for Pickup
  useEffect(() => {
    if (!isQueryEligibleForAutocomplete(pickupAddress)) {
      setPickupSuggestions([]);
      setIsSearchingPickup(false);
      setPickupActiveIdx(-1);
      return;
    }

    const immediate = searchLocationSuggestions(pickupAddress, 8);
    setPickupSuggestions(immediate);
    setPickupActiveIdx(immediate.length > 0 ? 0 : -1);

    if (immediate.length >= 6 || selectedPickup?.label === pickupAddress) {
      setIsSearchingPickup(false);
      return;
    }

    setIsSearchingPickup(true);
    const timer = setTimeout(async () => {
      pickupSearchAbortRef.current?.abort();
      const controller = new AbortController();
      pickupSearchAbortRef.current = controller;

      const merged = await searchLocationsAsync(pickupAddress, controller.signal, 8);
      if (!controller.signal.aborted) {
        setPickupSuggestions(merged);
        setPickupActiveIdx(merged.length > 0 ? 0 : -1);
        setIsSearchingPickup(false);
      }
    }, 240);

    return () => {
      clearTimeout(timer);
      pickupSearchAbortRef.current?.abort();
    };
  }, [pickupAddress, selectedPickup]);

  // Dynamic 3-character search for Drop
  useEffect(() => {
    if (!isQueryEligibleForAutocomplete(dropAddress)) {
      setDropSuggestions([]);
      setIsSearchingDrop(false);
      setDropActiveIdx(-1);
      return;
    }

    const immediate = searchLocationSuggestions(dropAddress, 8);
    setDropSuggestions(immediate);
    setDropActiveIdx(immediate.length > 0 ? 0 : -1);

    if (immediate.length >= 6 || selectedDrop?.label === dropAddress) {
      setIsSearchingDrop(false);
      return;
    }

    setIsSearchingDrop(true);
    const timer = setTimeout(async () => {
      dropSearchAbortRef.current?.abort();
      const controller = new AbortController();
      dropSearchAbortRef.current = controller;

      const merged = await searchLocationsAsync(dropAddress, controller.signal, 8);
      if (!controller.signal.aborted) {
        setDropSuggestions(merged);
        setDropActiveIdx(merged.length > 0 ? 0 : -1);
        setIsSearchingDrop(false);
      }
    }, 240);

    return () => {
      clearTimeout(timer);
      dropSearchAbortRef.current?.abort();
    };
  }, [dropAddress, selectedDrop]);

  const handleSelectPickupSuggestion = (loc: LocationSuggestion) => {
    setPickupAddress(loc.label);
    setSelectedPickup(loc);
    setShowPickupSuggestions(false);
    setFareResult(null);
    setRouteError(null);
    setValidationError(null);
  };

  const handleSelectDropSuggestion = (loc: LocationSuggestion) => {
    setDropAddress(loc.label);
    setSelectedDrop(loc);
    setShowDropSuggestions(false);
    setFareResult(null);
    setRouteError(null);
    setValidationError(null);
  };

  const handlePickupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPickupSuggestions || pickupSuggestions.length === 0) {
      if (e.key === 'Escape') setShowPickupSuggestions(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPickupActiveIdx((prev) => (prev + 1) % pickupSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPickupActiveIdx((prev) => (prev <= 0 ? pickupSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && pickupActiveIdx >= 0 && pickupSuggestions[pickupActiveIdx]) {
      e.preventDefault();
      handleSelectPickupSuggestion(pickupSuggestions[pickupActiveIdx]);
    } else if (e.key === 'Escape') {
      setShowPickupSuggestions(false);
    }
  };

  const handleDropKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropSuggestions || dropSuggestions.length === 0) {
      if (e.key === 'Escape') setShowDropSuggestions(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDropActiveIdx((prev) => (prev + 1) % dropSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDropActiveIdx((prev) => (prev <= 0 ? dropSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && dropActiveIdx >= 0 && dropSuggestions[dropActiveIdx]) {
      e.preventDefault();
      handleSelectDropSuggestion(dropSuggestions[dropActiveIdx]);
    } else if (e.key === 'Escape') {
      setShowDropSuggestions(false);
    }
  };

  const handleSwapLocations = () => {
    const tempText = pickupAddress;
    const tempLoc = selectedPickup;
    setPickupAddress(dropAddress);
    setSelectedPickup(selectedDrop);
    setDropAddress(tempText);
    setSelectedDrop(tempLoc);
    setFareResult(null);
    setRouteError(null);
    setValidationError(null);
  };

  const handleQuickPickupFill = () => {
    const defaultHub = findLocationByLabelOrId('Gandhipuram Central Bus Stand');
    if (!pickupAddress.trim() && defaultHub) {
      handleSelectPickupSuggestion(defaultHub);
    } else {
      setShowPickupSuggestions(true);
    }
    setFareResult(null);
    setRouteError(null);
  };

  const handleCalculateFare = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setRouteError(null);
    setFareResult(null);
    setEnquirySubmitted(false);
    setShowPickupSuggestions(false);
    setShowDropSuggestions(false);

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

    // Resolve locations if user typed a matching name without explicitly clicking a suggestion
    const resolvedPickup = selectedPickup || findLocationByLabelOrId(pickupAddress) || pickupAddress;
    const resolvedDrop = selectedDrop || findLocationByLabelOrId(dropAddress) || dropAddress;

    if (typeof resolvedPickup === 'object') {
      setSelectedPickup(resolvedPickup);
    }
    if (typeof resolvedDrop === 'object') {
      setSelectedDrop(resolvedDrop);
    }

    setIsCalculating(true);
    trackEvent('fare_calculation_request', { trip_type: tripType });

    const routeRes = await getRouteDistanceKm(resolvedPickup, resolvedDrop);
    setIsCalculating(false);

    if (!routeRes.ok) {
      setRouteError(routeRes.errorMessage);
      return;
    }

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

  const pickupHas3Chars = isQueryEligibleForAutocomplete(pickupAddress);
  const dropHas3Chars = isQueryEligibleForAutocomplete(dropAddress);

  return (
    <div className="rounded-2xl border-2 border-[#D8DFE8] bg-white p-4 sm:p-6 shadow-[0_20px_50px_rgba(17,24,32,0.18)] text-[#111820]">
      {heading && (
        <div className="mb-4 pb-3 border-b border-[#D8DFE8]/80 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111820] tracking-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="text-xs font-medium text-[#526174] mt-0.5">{subheading}</p>
            )}
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#FFC400]/20 border border-[#FFC400] px-2.5 py-1 text-[11px] font-extrabold text-[#111820]">
            <Zap className="h-3 w-3 text-[#111820] fill-[#FFC400]" aria-hidden="true" />
            <span>Instant Estimate</span>
          </span>
        </div>
      )}

      {/* Interactive Trip Type Segmented Tabs (4 Required Modes in Exact Order) */}
      <div
        role="tablist"
        aria-label="Select Trip Type"
        className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-[#F1F5F9] border border-[#D8DFE8] p-1.5 mb-5"
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
              className={`min-h-[44px] px-3 py-2.5 text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#FFC400] text-[#111820] font-extrabold shadow-sm ring-1 ring-[#F5B800]'
                  : 'text-[#263241] font-bold hover:text-[#111820] hover:bg-white'
              }`}
            >
              <TabIcon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-[#111820] stroke-[2.5]' : 'text-[#526174] stroke-[2]'
                }`}
                aria-hidden="true"
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleCalculateFare} noValidate className="space-y-4">
        {/* Main Inputs Row: Pick up location, Drop location, and Get Fare Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* Pickup Input */}
          <div className="md:col-span-5 relative">
            <label
              htmlFor={`${formId}-pickup`}
              className="block text-xs sm:text-sm font-extrabold text-[#111820] mb-1.5"
            >
              Pick up location
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]"
                aria-hidden="true"
              />
              <input
                id={`${formId}-pickup`}
                type="text"
                required
                autoComplete="off"
                role="combobox"
                aria-expanded={showPickupSuggestions && pickupHas3Chars}
                aria-controls={`${formId}-pickup-listbox`}
                aria-autocomplete="list"
                value={pickupAddress}
                onFocus={() => setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 180)}
                onKeyDown={handlePickupKeyDown}
                onChange={(e) => {
                  setPickupAddress(e.target.value);
                  setSelectedPickup(null);
                  setShowPickupSuggestions(true);
                  setFareResult(null);
                  setRouteError(null);
                }}
                placeholder="Enter pick up location"
                className="w-full min-h-[48px] rounded-xl border-2 border-[#D8DFE8] bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-[#111820] placeholder:font-normal placeholder:text-[#526174]/75 focus:border-[#111820] focus:outline-none focus:ring-3 focus:ring-[#FFC400]/40 transition-all"
              />
              <button
                type="button"
                onClick={handleQuickPickupFill}
                title="Select Coimbatore Central Hub"
                aria-label="Quick fill Coimbatore pickup hub"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#526174] hover:text-[#111820] hover:bg-[#F7F6F1] transition-colors"
              >
                {isSearchingPickup ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#111820]" aria-hidden="true" />
                ) : (
                  <Crosshair className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {showPickupSuggestions && pickupHas3Chars && (
              <ul
                id={`${formId}-pickup-listbox`}
                role="listbox"
                aria-label="Suggested pickup locations"
                className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border-2 border-[#111820]/15 bg-white py-1.5 shadow-2xl"
              >
                {pickupSuggestions.map((loc, idx) => {
                  const isActive = idx === pickupActiveIdx;
                  return (
                    <li
                      key={loc.id}
                      role="option"
                      aria-selected={isActive || pickupAddress === loc.label}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectPickupSuggestion(loc);
                        }}
                        className={`flex w-full flex-col items-start px-3.5 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-[#FFC400]/25' : 'hover:bg-[#FFC400]/15'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-[#111820]">{loc.label}</span>
                        <span className="text-[11px] font-medium text-[#526174]">
                          {loc.secondaryText}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {!isSearchingPickup && pickupSuggestions.length === 0 && (
                  <li className="px-3.5 py-2.5 text-xs font-medium text-[#526174]">
                    No matching locations found. Try a nearby Coimbatore area or city name.
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Drop Input */}
          <div className="md:col-span-4 relative">
            <label
              htmlFor={`${formId}-drop`}
              className="block text-xs sm:text-sm font-extrabold text-[#111820] mb-1.5"
            >
              Drop location
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526174]"
                aria-hidden="true"
              />
              <input
                id={`${formId}-drop`}
                type="text"
                required
                autoComplete="off"
                role="combobox"
                aria-expanded={showDropSuggestions && dropHas3Chars}
                aria-controls={`${formId}-drop-listbox`}
                aria-autocomplete="list"
                value={dropAddress}
                onFocus={() => setShowDropSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDropSuggestions(false), 180)}
                onKeyDown={handleDropKeyDown}
                onChange={(e) => {
                  setDropAddress(e.target.value);
                  setSelectedDrop(null);
                  setShowDropSuggestions(true);
                  setFareResult(null);
                  setRouteError(null);
                }}
                placeholder="Enter drop location"
                className="w-full min-h-[48px] rounded-xl border-2 border-[#D8DFE8] bg-white pl-10 pr-8 py-2.5 text-sm font-semibold text-[#111820] placeholder:font-normal placeholder:text-[#526174]/75 focus:border-[#111820] focus:outline-none focus:ring-3 focus:ring-[#FFC400]/40 transition-all"
              />
              {isSearchingDrop && (
                <Loader2
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#111820]"
                  aria-hidden="true"
                />
              )}
            </div>

            {showDropSuggestions && dropHas3Chars && (
              <ul
                id={`${formId}-drop-listbox`}
                role="listbox"
                aria-label="Suggested drop locations"
                className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border-2 border-[#111820]/15 bg-white py-1.5 shadow-2xl"
              >
                {dropSuggestions.map((loc, idx) => {
                  const isActive = idx === dropActiveIdx;
                  return (
                    <li
                      key={loc.id}
                      role="option"
                      aria-selected={isActive || dropAddress === loc.label}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectDropSuggestion(loc);
                        }}
                        className={`flex w-full flex-col items-start px-3.5 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-[#FFC400]/25' : 'hover:bg-[#FFC400]/15'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-[#111820]">{loc.label}</span>
                        <span className="text-[11px] font-medium text-[#526174]">
                          {loc.secondaryText}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {!isSearchingDrop && dropSuggestions.length === 0 && (
                  <li className="px-3.5 py-2.5 text-xs font-medium text-[#526174]">
                    No matching locations found. Try a nearby area, town, or city name.
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Primary Get Fare Button */}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full min-h-[48px] rounded-xl bg-[#FFC400] hover:bg-[#F5B800] border border-[#F5B800] px-5 py-3 text-base font-extrabold text-[#111820] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-60 cursor-pointer"
            >
              <span>{isCalculating ? 'Calculating...' : 'Get Fare'}</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mode-Specific Rental/Round-Trip Duration Selectors */}
        {(tripType === 'hourly' || tripType === 'round_trip') && (
          <div className="rounded-xl bg-[#F7F6F1] border border-[#D8DFE8] p-3.5 flex flex-wrap items-center gap-4 text-xs">
            {tripType === 'hourly' && (
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#111820]" aria-hidden="true" />
                <label htmlFor={`${formId}-hours`} className="font-extrabold text-[#111820]">
                  Rental Duration:
                </label>
                <select
                  id={`${formId}-hours`}
                  value={bookedHours}
                  onChange={(e) => {
                    setBookedHours(e.target.value);
                    setFareResult(null);
                  }}
                  className="rounded-lg border-2 border-[#D8DFE8] bg-white px-3 py-1.5 text-xs font-extrabold text-[#111820] focus:border-[#111820] focus:outline-none"
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
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#111820]" aria-hidden="true" />
                <label htmlFor={`${formId}-days`} className="font-extrabold text-[#111820]">
                  Trip Duration:
                </label>
                <select
                  id={`${formId}-days`}
                  value={chargeableDays}
                  onChange={(e) => {
                    setChargeableDays(e.target.value);
                    setFareResult(null);
                  }}
                  className="rounded-lg border-2 border-[#D8DFE8] bg-white px-3 py-1.5 text-xs font-extrabold text-[#111820] focus:border-[#111820] focus:outline-none"
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
            className="flex items-start gap-2.5 rounded-xl border-2 border-red-300 bg-red-50 p-3 text-xs font-bold text-red-950"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Reassurance Row */}
        <div className="pt-2.5 border-t border-[#D8DFE8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#263241]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="h-3.5 w-3.5 text-[#111820]" aria-hidden="true" />
              <span className="font-bold">No phone number required</span>
            </div>
            <span className="hidden sm:inline text-[#D8DFE8]" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#F5B800] fill-[#FFC400]" aria-hidden="true" />
              <span className="font-bold">Get instant fare</span>
            </div>
            <span className="hidden sm:inline text-[#D8DFE8]" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-[#138443]" aria-hidden="true" />
              <span className="font-bold">Easy booking via WhatsApp</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Swap pickup and drop addresses"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#111820] hover:text-[#F5B800] underline cursor-pointer"
          >
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Swap locations</span>
          </button>
        </div>

        {/* Popular Pickup Hubs Pill Chips */}
        <div className="pt-2 border-t border-[#D8DFE8]/70">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#111820] mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#F5B800] fill-[#FFC400]" aria-hidden="true" />
            <span>Popular Hubs:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { short: 'Gandhipuram', full: 'Gandhipuram Central Bus Stand' },
              { short: 'Airport', full: 'Coimbatore International Airport (CJB)' },
              { short: 'Railway Station', full: 'Coimbatore Junction Railway Station' },
              { short: 'R.S. Puram', full: 'R.S. Puram (D.B. Road)' },
              { short: 'Tidel Park', full: 'Peelamedu (PSG Tech / TIDEL Park)' },
              { short: 'Ukkadam', full: 'Ukkadam Bus Stand' },
            ].map((hub) => {
              const isSelected = pickupAddress === hub.full;
              return (
                <button
                  key={hub.short}
                  type="button"
                  onClick={() => {
                    const resolved = findLocationByLabelOrId(hub.full) || null;
                    setPickupAddress(hub.full);
                    setSelectedPickup(resolved);
                    setFareResult(null);
                    setRouteError(null);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#111820] text-[#FFC400] border-[#111820] shadow-xs'
                      : 'bg-[#F7F6F1] text-[#263241] border-[#D8DFE8] hover:bg-[#FFC400] hover:text-[#111820] hover:border-[#F5B800]'
                  }`}
                >
                  {hub.short}
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* Route Resolution Fallback State ("Request a Quote" instead of guessing distance) */}
      {routeError && (
        <div
          role="region"
          aria-label="Custom Route Quote Request"
          className="mt-4 rounded-xl border-2 border-[#FFC400] bg-[#F7F6F1] p-4"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#111820] mt-0.5" aria-hidden="true" />
            <div className="space-y-2 text-xs text-[#263241]">
              <p className="font-extrabold text-[#111820]">{routeError}</p>
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
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#111820] px-4 py-2 text-xs font-extrabold text-[#FFC400] hover:bg-[#172536] whitespace-nowrap"
                >
                  Request a Custom Route Quote
                </button>
              ) : (
                <div className="space-y-2 rounded-xl bg-emerald-50 border border-emerald-300 px-3.5 py-3 text-emerald-950 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#138443]" aria-hidden="true" />
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
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#138443] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0f6b36]"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
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
          className="mt-5 rounded-2xl border-2 border-[#111820] bg-[#F7F6F1] overflow-hidden shadow-lg"
        >
          <div className="bg-[#111820] px-4 py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Your Estimated Trip Fare
            </span>
            <span className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-[#FFC400]">
              {fareResult.formattedFare}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-bold text-[#111820]">
              <span className="rounded-md bg-[#FFC400]/25 border border-[#FFC400] px-2 py-0.5">
                {TRIP_TYPE_LABELS[fareResult.tripType]}
              </span>
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
              <p className="text-[11px] font-medium text-[#526174]">
                {routeSummaryText} · Subject to route verification &amp; owner tariff confirmation
              </p>
            )}

            {/* Optional Name for WhatsApp Personalization */}
            <div className="pt-3 border-t border-[#D8DFE8]">
              <label
                htmlFor={`${formId}-opt-name`}
                className="block text-xs font-bold text-[#111820] mb-1.5"
              >
                Your Name (Optional — included in your WhatsApp enquiry):
              </label>
              <input
                id={`${formId}-opt-name`}
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh K (optional)"
                className="w-full rounded-xl border-2 border-[#D8DFE8] bg-white px-3.5 py-2 text-xs font-semibold text-[#111820] placeholder:font-normal placeholder:text-[#526174] focus:border-[#111820] focus:outline-none"
              />
            </div>

            {/* WhatsApp Booking Action */}
            <div className="space-y-2.5">
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
                  className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#138443] px-4 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#0f6b36] whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Book This Trip on WhatsApp</span>
                </a>
              ) : (
                <div className="rounded-xl border border-[#D8DFE8] bg-white p-3.5 space-y-2.5">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 cursor-not-allowed whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Book This Trip on WhatsApp (Pending Number Setup)</span>
                  </button>
                  <div className="rounded-lg bg-[#F7F6F1] p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#111820]">
                        Prefilled WhatsApp Message Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEnquiry(whatsappData.message)}
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold bg-white border border-[#D8DFE8] text-[#111820] hover:bg-slate-50"
                      >
                        {copiedMessage ? (
                          <>
                            <Check className="h-3 w-3 text-[#138443]" aria-hidden="true" />
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
                    <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#263241] leading-relaxed">
                      {whatsappData.message}
                    </pre>
                  </div>
                </div>
              )}
              <p className="text-[11px] font-medium text-[#526174]">
                Note: Opening WhatsApp sends a booking enquiry. Your trip is confirmed only after
                availability and final details are verified by {business.name}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
