/**
 * Central Google Analytics 4 (GA4) & Google Ads Conversion Tracking Configuration
 *
 * All IDs default to empty strings ("") until supplied by the business owner.
 * No false conversion events are recorded when IDs are unconfigured or when
 * an enquiry/booking is incomplete.
 */

export interface AnalyticsConfig {
  ga4MeasurementId: string;
  googleAdsConversionId: string;
  conversionLabels: {
    bookingFormSubmit: string;
    whatsappBookingClick: string;
    phoneCallClick: string;
    fareCalculationRequest: string;
    tourBookingCtaClick: string;
    contactEnquirySubmit: string;
  };
}

const getEnv = (key: string): string => {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    if (metaEnv && typeof metaEnv[key] === 'string') {
      return metaEnv[key] || '';
    }
  } catch {
    // Ignore in Node environment
  }
  return '';
};

export const analyticsConfig: AnalyticsConfig = {
  ga4MeasurementId: getEnv('VITE_GA4_MEASUREMENT_ID'),
  googleAdsConversionId: getEnv('VITE_GOOGLE_ADS_CONVERSION_ID'),
  conversionLabels: {
    bookingFormSubmit: getEnv('VITE_GADS_LABEL_BOOKING_SUBMIT'),
    whatsappBookingClick: getEnv('VITE_GADS_LABEL_WHATSAPP_CLICK'),
    phoneCallClick: getEnv('VITE_GADS_LABEL_PHONE_CLICK'),
    fareCalculationRequest: '',
    tourBookingCtaClick: '',
    contactEnquirySubmit: getEnv('VITE_GADS_LABEL_CONTACT_ENQUIRY'),
  },
};

export type TrackableEventName =
  | 'phone_click'
  | 'whatsapp_click'
  | 'booking_form_submit'
  | 'fare_calculation_request'
  | 'tour_booking_cta_click'
  | 'contact_enquiry_submit';

export function trackEvent(
  eventName: TrackableEventName,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === 'undefined') return;

  const win = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  // Only dispatch to gtag if GA4 or Google Ads is configured
  if (typeof win.gtag === 'function' && (analyticsConfig.ga4MeasurementId || analyticsConfig.googleAdsConversionId)) {
    win.gtag('event', eventName, params);

    // Trigger specific Google Ads conversion label if configured for completed actions
    const labelMap: Partial<Record<TrackableEventName, string>> = {
      booking_form_submit: analyticsConfig.conversionLabels.bookingFormSubmit,
      whatsapp_click: analyticsConfig.conversionLabels.whatsappBookingClick,
      phone_click: analyticsConfig.conversionLabels.phoneCallClick,
      contact_enquiry_submit: analyticsConfig.conversionLabels.contactEnquirySubmit,
    };

    const label = labelMap[eventName];
    if (analyticsConfig.googleAdsConversionId && label) {
      win.gtag('event', 'conversion', {
        send_to: `${analyticsConfig.googleAdsConversionId}/${label}`,
        ...params,
      });
    }
  }
}
