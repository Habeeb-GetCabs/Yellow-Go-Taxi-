/**
 * Central Fare & Tariff Configuration — Yellow Go Taxi
 *
 * PENDING OWNER APPROVAL NOTES:
 * 1. Local Taxi: ₹100 is treated as a one-time base fare + ₹30 per chargeable km
 *    (0 free kilometres included in base fare unless updated by owner).
 * 2. Hourly Rental: Partial hours are rounded up to the next full hour ('ceil_full_hour')
 *    with a 1-hour minimum booking floor unless updated by owner.
 * 3. Outstation Drop: ₹30 per chargeable one-way km + ₹400 flat driver allowance per trip.
 * 4. Round Trip: ₹14 per chargeable return-journey km + ₹500 driver allowance per chargeable day.
 *
 * Internal tariff breakdown parameters are used strictly by the calculation engine
 * and must NEVER be displayed directly on customer-facing cards or forms.
 */

export type TripType = 'local' | 'hourly' | 'outstation_drop' | 'round_trip';

export type PartialHourRoundingRule = 'ceil_full_hour' | 'exact_decimal' | 'nearest_half_hour';

export interface FareConfig {
  currencySymbol: string;
  currencyCode: string;
  requiresOwnerApproval: boolean;
  local: {
    baseFare: number;
    ratePerKm: number;
    includedFreeKm: number;
  };
  hourly: {
    ratePerHour: number;
    includedKmPerHour: number;
    extraKmRate: number;
    minimumHours: number;
    partialHourRounding: PartialHourRoundingRule;
  };
  outstationDrop: {
    ratePerKm: number;
    driverAllowancePerTrip: number;
  };
  roundTrip: {
    ratePerKm: number;
    driverAllowancePerDay: number;
    minimumDays: number;
  };
}

export const fareConfig: FareConfig = {
  currencySymbol: '₹',
  currencyCode: 'INR',
  requiresOwnerApproval: true,
  local: {
    baseFare: 100,
    ratePerKm: 30,
    includedFreeKm: 0,
  },
  hourly: {
    ratePerHour: 350,
    includedKmPerHour: 10,
    extraKmRate: 20,
    minimumHours: 1,
    partialHourRounding: 'ceil_full_hour',
  },
  outstationDrop: {
    ratePerKm: 30,
    driverAllowancePerTrip: 400,
  },
  roundTrip: {
    ratePerKm: 14,
    driverAllowancePerDay: 500,
    minimumDays: 1,
  },
};

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  local: 'Local',
  hourly: 'Hourly Rental',
  outstation_drop: 'Outstation Drop',
  round_trip: 'Round Trip',
};
