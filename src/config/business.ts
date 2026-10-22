/**
 * Central Business Configuration — Yellow Go Taxi
 *
 * Components across the entire website read from this single source of truth
 * for business address, operating hubs, telephone, and WhatsApp dispatch.
 */

export interface BusinessConfig {
  name: string;
  legalEntityName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  locationConfirmed: boolean;
  operatingHubs: string[];
  operatingHubsSummary: string;
  operatingHours: string;
  websiteUrl: string;
}

const getEnv = (key: string, fallback = ''): string => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    if (metaEnv && typeof metaEnv[key] === 'string') {
      return metaEnv[key] || fallback;
    }
  } catch {
    // Fallback for Node test runner environment
  }
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key] || fallback;
  }
  return fallback;
};

export const business: BusinessConfig = {
  name: 'Yellow Go Taxi',
  legalEntityName: '',
  phone: getEnv('VITE_BUSINESS_PHONE', '+91 99943 53722'),
  whatsapp: getEnv('VITE_BUSINESS_WHATSAPP', '919994353722'),
  email: getEnv('VITE_BUSINESS_EMAIL', ''),
  address: getEnv('VITE_BUSINESS_ADDRESS', 'Gandhipuram, Coimbatore, Tamil Nadu'),
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  locationConfirmed: true,
  operatingHubs: [
    'Gandhipuram',
    'Peelamedu',
    'Coimbatore International Airport (CJB)',
    'Coimbatore Junction Railway Station',
    'R.S. Puram',
    'Saravanampatti',
    'Singanallur',
    'Ukkadam',
  ],
  operatingHubsSummary:
    'Gandhipuram, Peelamedu, Coimbatore Airport, Railway Station, R.S. Puram & Saravanampatti',
  operatingHours: getEnv('VITE_BUSINESS_HOURS', ''),
  websiteUrl: getEnv('VITE_WEBSITE_URL', 'https://yellowgotaxi.com'),
};

export function hasConfirmedPhone(cfg: BusinessConfig = business): boolean {
  return cfg.phone.trim().length > 0;
}

export function hasConfirmedWhatsapp(cfg: BusinessConfig = business): boolean {
  return cfg.whatsapp.trim().length > 0;
}

export function hasConfirmedEmail(cfg: BusinessConfig = business): boolean {
  return cfg.email.trim().length > 0;
}

export function hasConfirmedAddress(cfg: BusinessConfig = business): boolean {
  return cfg.address.trim().length > 0;
}

export function hasConfirmedHours(cfg: BusinessConfig = business): boolean {
  return cfg.operatingHours.trim().length > 0;
}
