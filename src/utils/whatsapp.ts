/**
 * Reusable WhatsApp Booking URL & Message Builder — Yellow Go Taxi
 *
 * Builds a properly URL-encoded WhatsApp message containing ONLY the fields
 * relevant to the selected trip type and the final estimated price
 * (never internal base fare, per-km tariff, or driver allowance).
 */

import type { TripMode } from './fareCalculator.ts';

export interface WhatsAppBookingPayload {
  businessName?: string;
  whatsappNumber: string;
  customerName: string;
  customerPhone: string;
  tripType: TripMode;
  pickupAddress: string;
  dropAddress: string;
  travelDate: string;
  durationLabel?: string;
  estimatedDistanceKm?: number;
  estimatedFare?: number;
}

const TRIP_MODE_TITLES: Record<TripMode, string> = {
  local: 'Local',
  hourly: 'Hourly Rental',
  outstation_drop: 'Outstation Drop',
  round_trip: 'Round Trip',
};

export function sanitizeWhatsappNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/[^\d]/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function buildWhatsAppMessage(payload: Omit<WhatsAppBookingPayload, 'whatsappNumber'>): string {
  const brand = payload.businessName || 'Yellow Go Taxi';
  const lines: string[] = [
    `Hello ${brand},`,
    '',
    'I would like to enquire about a taxi booking.',
    '',
    `Name: ${payload.customerName.trim()}`,
    `Phone: ${payload.customerPhone.trim()}`,
    `Trip Type: ${TRIP_MODE_TITLES[payload.tripType]}`,
    `Pickup: ${payload.pickupAddress.trim()}`,
    `Destination: ${payload.dropAddress.trim()}`,
    `Travel Date: ${payload.travelDate.trim()}`,
  ];

  // Include duration only when relevant (Hourly Rental or Round Trip)
  if (
    (payload.tripType === 'hourly' || payload.tripType === 'round_trip') &&
    payload.durationLabel &&
    payload.durationLabel.trim().length > 0
  ) {
    lines.push(`Duration: ${payload.durationLabel.trim()}`);
  }

  if (
    typeof payload.estimatedDistanceKm === 'number' &&
    Number.isFinite(payload.estimatedDistanceKm) &&
    payload.estimatedDistanceKm > 0
  ) {
    lines.push(`Estimated Distance: ${payload.estimatedDistanceKm} km`);
  }

  if (
    typeof payload.estimatedFare === 'number' &&
    Number.isFinite(payload.estimatedFare) &&
    payload.estimatedFare > 0
  ) {
    lines.push(`Estimated Fare: ₹${Math.round(payload.estimatedFare).toLocaleString('en-IN')}`);
  }

  lines.push('');
  lines.push('Please confirm availability and the final booking details.');
  lines.push('');
  lines.push('Thank you.');

  return lines.join('\n');
}

export function buildWhatsAppUrl(payload: WhatsAppBookingPayload): {
  isConfigured: boolean;
  url: string | null;
  message: string;
} {
  const message = buildWhatsAppMessage(payload);
  const cleanPhone = sanitizeWhatsappNumber(payload.whatsappNumber);

  if (!cleanPhone || cleanPhone.length < 10) {
    return {
      isConfigured: false,
      url: null,
      message,
    };
  }

  const encodedMessage = encodeURIComponent(message);
  return {
    isConfigured: true,
    url: `https://wa.me/${cleanPhone}?text=${encodedMessage}`,
    message,
  };
}
