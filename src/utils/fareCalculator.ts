/**
 * Isolated, Pure Fare Calculation Engine — Yellow Go Taxi
 *
 * Implements the 4 configured tariff modes strictly:
 * A. Local Taxi:
 *    fare = ₹100 + (chargeableKm × ₹30)
 * B. Hourly Rental:
 *    includedKm = bookedHours × 10
 *    extraKm = max(0, totalKm - includedKm)
 *    fare = bookedHours × ₹350 + extraKm × ₹20
 * C. Outstation Drop:
 *    fare = oneWayDistanceKm × ₹30 + ₹400
 * D. Round Trip:
 *    fare = totalReturnTripDistanceKm × ₹14 + chargeableDays × ₹500
 *
 * No unapproved taxes, waiting fees, or hidden surcharges are added.
 * All numeric inputs are validated explicitly.
 */

export type TripMode = 'local' | 'hourly' | 'outstation_drop' | 'round_trip';

export type PartialHourRounding = 'ceil_full_hour' | 'exact_decimal' | 'nearest_half_hour';

export interface TariffRules {
  localBaseFare: number;
  localRatePerKm: number;
  hourlyRatePerHour: number;
  hourlyIncludedKmPerHour: number;
  hourlyExtraKmRate: number;
  hourlyRoundingRule: PartialHourRounding;
  outstationDropRatePerKm: number;
  outstationDropAllowance: number;
  roundTripRatePerKm: number;
  roundTripAllowancePerDay: number;
}

export const DEFAULT_TARIFF_RULES: TariffRules = {
  localBaseFare: 100,
  localRatePerKm: 30,
  hourlyRatePerHour: 350,
  hourlyIncludedKmPerHour: 10,
  hourlyExtraKmRate: 20,
  hourlyRoundingRule: 'ceil_full_hour',
  outstationDropRatePerKm: 30,
  outstationDropAllowance: 400,
  roundTripRatePerKm: 14,
  roundTripAllowancePerDay: 500,
};

export interface FareCalculationInput {
  tripType: TripMode;
  /**
   * For 'local', 'hourly', and 'outstation_drop', pass the actual route distance in km.
   * For 'round_trip', pass either `totalReturnTripDistanceKm` directly OR `oneWayRouteDistanceKm`
   * (if `isReturnDistanceAlreadyDoubled` is false, the calculator multiplies one-way route distance by 2 once,
   * never counting return distance twice).
   */
  distanceKm: number;
  /**
   * If true for 'round_trip', `distanceKm` is already the full return-trip distance.
   * Default is true so callers explicitly pass `totalReturnTripDistanceKm`.
   */
  isTotalReturnDistance?: boolean;
  /** Required for 'hourly' trip type (must be > 0) */
  bookedHours?: number;
  /** Required for 'round_trip' trip type (must be an integer >= 1) */
  chargeableDays?: number;
}

export interface FareCalculationSuccess {
  ok: true;
  tripType: TripMode;
  estimatedFare: number;
  formattedFare: string;
  chargeableDistanceKm: number;
  bookedHours?: number;
  chargeableDays?: number;
}

export interface FareCalculationFailure {
  ok: false;
  errorCode:
    | 'INVALID_TRIP_TYPE'
    | 'INVALID_DISTANCE'
    | 'MISSING_HOURS'
    | 'INVALID_HOURS'
    | 'MISSING_DAYS'
    | 'INVALID_DAYS';
  errorMessage: string;
}

export type FareCalculationResult = FareCalculationSuccess | FareCalculationFailure;

export function isValidPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function normalizeBookedHours(hours: number, rule: PartialHourRounding): number {
  if (rule === 'ceil_full_hour') {
    return Math.ceil(hours);
  }
  if (rule === 'nearest_half_hour') {
    return Math.ceil(hours * 2) / 2;
  }
  return hours;
}

export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function calculateTripFare(
  input: FareCalculationInput,
  rules: TariffRules = DEFAULT_TARIFF_RULES
): FareCalculationResult {
  if (!input || typeof input !== 'object') {
    return {
      ok: false,
      errorCode: 'INVALID_TRIP_TYPE',
      errorMessage: 'Valid trip calculation parameters are required.',
    };
  }

  const { tripType, distanceKm } = input;

  if (
    tripType !== 'local' &&
    tripType !== 'hourly' &&
    tripType !== 'outstation_drop' &&
    tripType !== 'round_trip'
  ) {
    return {
      ok: false,
      errorCode: 'INVALID_TRIP_TYPE',
      errorMessage: 'Please select a valid trip type.',
    };
  }

  if (!isValidPositiveNumber(distanceKm)) {
    return {
      ok: false,
      errorCode: 'INVALID_DISTANCE',
      errorMessage: 'A valid positive route distance in kilometres is required to calculate the fare.',
    };
  }

  // Round distance to 1 decimal place for consistent calculation
  const cleanDistanceKm = Math.round(distanceKm * 10) / 10;

  if (tripType === 'local') {
    const rawFare = rules.localBaseFare + cleanDistanceKm * rules.localRatePerKm;
    const estimatedFare = Math.round(rawFare);
    return {
      ok: true,
      tripType: 'local',
      estimatedFare,
      formattedFare: formatINR(estimatedFare),
      chargeableDistanceKm: cleanDistanceKm,
    };
  }

  if (tripType === 'hourly') {
    if (input.bookedHours === undefined || input.bookedHours === null) {
      return {
        ok: false,
        errorCode: 'MISSING_HOURS',
        errorMessage: 'Please specify the number of rental hours required.',
      };
    }
    if (!isValidPositiveNumber(input.bookedHours) || input.bookedHours > 72) {
      return {
        ok: false,
        errorCode: 'INVALID_HOURS',
        errorMessage: 'Rental duration must be between 1 and 72 hours.',
      };
    }

    const chargeableHours = normalizeBookedHours(input.bookedHours, rules.hourlyRoundingRule);
    const includedKm = chargeableHours * rules.hourlyIncludedKmPerHour;
    const extraKm = Math.max(0, cleanDistanceKm - includedKm);
    const rawFare = chargeableHours * rules.hourlyRatePerHour + extraKm * rules.hourlyExtraKmRate;
    const estimatedFare = Math.round(rawFare);

    return {
      ok: true,
      tripType: 'hourly',
      estimatedFare,
      formattedFare: formatINR(estimatedFare),
      chargeableDistanceKm: cleanDistanceKm,
      bookedHours: chargeableHours,
    };
  }

  if (tripType === 'outstation_drop') {
    const rawFare = cleanDistanceKm * rules.outstationDropRatePerKm + rules.outstationDropAllowance;
    const estimatedFare = Math.round(rawFare);
    return {
      ok: true,
      tripType: 'outstation_drop',
      estimatedFare,
      formattedFare: formatINR(estimatedFare),
      chargeableDistanceKm: cleanDistanceKm,
    };
  }

  // tripType === 'round_trip'
  if (input.chargeableDays === undefined || input.chargeableDays === null) {
    return {
      ok: false,
      errorCode: 'MISSING_DAYS',
      errorMessage: 'Please specify the number of chargeable trip days for a round trip.',
    };
  }

  if (
    !isValidPositiveNumber(input.chargeableDays) ||
    !Number.isInteger(input.chargeableDays) ||
    input.chargeableDays < 1 ||
    input.chargeableDays > 60
  ) {
    return {
      ok: false,
      errorCode: 'INVALID_DAYS',
      errorMessage: 'Round-trip duration must be a whole number of days between 1 and 60.',
    };
  }

  const isTotalReturn = input.isTotalReturnDistance !== false;
  const totalReturnTripDistanceKm = isTotalReturn
    ? cleanDistanceKm
    : Math.round(cleanDistanceKm * 2 * 10) / 10;

  const rawFare =
    totalReturnTripDistanceKm * rules.roundTripRatePerKm +
    input.chargeableDays * rules.roundTripAllowancePerDay;
  const estimatedFare = Math.round(rawFare);

  return {
    ok: true,
    tripType: 'round_trip',
    estimatedFare,
    formattedFare: formatINR(estimatedFare),
    chargeableDistanceKm: totalReturnTripDistanceKm,
    chargeableDays: input.chargeableDays,
  };
}

/**
 * Helper to compute inclusive calendar days between a pickup date and return date (YYYY-MM-DD).
 * Returns null if dates are missing, malformed, or returnDate < travelDate.
 */
export function calculateInclusiveTripDays(travelDate: string, returnDate: string): number | null {
  if (!travelDate || !returnDate) return null;
  const start = new Date(`${travelDate}T00:00:00Z`);
  const end = new Date(`${returnDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return null;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}
