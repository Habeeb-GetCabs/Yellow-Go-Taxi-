import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTripFare,
  calculateInclusiveTripDays,
  formatINR,
} from './fareCalculator.ts';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from './whatsapp.ts';
import {
  getRouteDistanceKm,
  searchLocationSuggestions,
} from './routingService.ts';
import { business } from '../config/business.ts';
import { analyticsConfig } from '../config/analytics.ts';
import { ASSET_MANIFEST } from '../data/assetManifest.ts';
import { TOUR_PAGES } from '../data/toursData.ts';
import { BLOG_ARTICLES } from '../data/blogsData.ts';
import { TAXI_SERVICES } from '../data/servicesData.ts';

test('A. Local Taxi formula: fare = ₹100 + (chargeableKm * ₹30)', () => {
  // 10 km local trip: 100 + 10 * 30 = 400
  const res10 = calculateTripFare({ tripType: 'local', distanceKm: 10 });
  assert.equal(res10.ok, true);
  if (res10.ok) {
    assert.equal(res10.estimatedFare, 400);
    assert.equal(res10.formattedFare, '₹400');
    assert.equal(res10.chargeableDistanceKm, 10);
  }

  // 1 km boundary case: does NOT assume free km included in ₹100 base fare -> 100 + 30 = 130
  const res1 = calculateTripFare({ tripType: 'local', distanceKm: 1 });
  assert.equal(res1.ok, true);
  if (res1.ok) {
    assert.equal(res1.estimatedFare, 130);
  }

  // 25.5 km fractional distance: 100 + 25.5 * 30 = 100 + 765 = 865
  const resFrac = calculateTripFare({ tripType: 'local', distanceKm: 25.5 });
  assert.equal(resFrac.ok, true);
  if (resFrac.ok) {
    assert.equal(resFrac.estimatedFare, 865);
  }
});

test('B. Hourly Rental formula: bookedHours * ₹350 + max(0, totalKm - bookedHours * 10) * ₹20', () => {
  // Within included distance: 4 hours (40 km included), 32 km driven -> 4 * 350 = 1400
  const within = calculateTripFare({
    tripType: 'hourly',
    distanceKm: 32,
    bookedHours: 4,
  });
  assert.equal(within.ok, true);
  if (within.ok) {
    assert.equal(within.estimatedFare, 1400);
    assert.equal(within.bookedHours, 4);
  }

  // Exact boundary: 4 hours, 40 km -> 1400
  const exact = calculateTripFare({
    tripType: 'hourly',
    distanceKm: 40,
    bookedHours: 4,
  });
  assert.equal(exact.ok, true);
  if (exact.ok) {
    assert.equal(exact.estimatedFare, 1400);
  }

  // Exceeding included distance: 4 hours (40 km included), 55 km driven -> 15 extra km * 20 = 300 -> 1400 + 300 = 1700
  const extra = calculateTripFare({
    tripType: 'hourly',
    distanceKm: 55,
    bookedHours: 4,
  });
  assert.equal(extra.ok, true);
  if (extra.ok) {
    assert.equal(extra.estimatedFare, 1700);
  }

  // Partial hour rounding ('ceil_full_hour' default): 2.5 hours rounds to 3 hours -> 3 * 350 = 1050 (for 25 km)
  const partial = calculateTripFare({
    tripType: 'hourly',
    distanceKm: 25,
    bookedHours: 2.5,
  });
  assert.equal(partial.ok, true);
  if (partial.ok) {
    assert.equal(partial.bookedHours, 3);
    assert.equal(partial.estimatedFare, 1050);
  }
});

test('C. Outstation Drop formula: oneWayDistanceKm * ₹30 + ₹400', () => {
  // Coimbatore to Ooty approx 86 km: 86 * 30 + 400 = 2580 + 400 = 2980
  const ootyDrop = calculateTripFare({
    tripType: 'outstation_drop',
    distanceKm: 86,
  });
  assert.equal(ootyDrop.ok, true);
  if (ootyDrop.ok) {
    assert.equal(ootyDrop.estimatedFare, 2980);
    assert.equal(ootyDrop.formattedFare, '₹2,980');
  }
});

test('D. Round Trip formula: totalReturnTripDistanceKm * ₹14 + chargeableDays * ₹500', () => {
  // 200 km total return distance, 2 days: 200 * 14 + 2 * 500 = 2800 + 1000 = 3800
  const rtTotal = calculateTripFare({
    tripType: 'round_trip',
    distanceKm: 200,
    isTotalReturnDistance: true,
    chargeableDays: 2,
  });
  assert.equal(rtTotal.ok, true);
  if (rtTotal.ok) {
    assert.equal(rtTotal.estimatedFare, 3800);
    assert.equal(rtTotal.chargeableDistanceKm, 200);
    assert.equal(rtTotal.chargeableDays, 2);
  }

  // Passing one-way distance with isTotalReturnDistance: false doubles once (86 * 2 = 172 km), 2 days -> 172 * 14 + 1000 = 2408 + 1000 = 3408
  const rtFromOneWay = calculateTripFare({
    tripType: 'round_trip',
    distanceKm: 86,
    isTotalReturnDistance: false,
    chargeableDays: 2,
  });
  assert.equal(rtFromOneWay.ok, true);
  if (rtFromOneWay.ok) {
    assert.equal(rtFromOneWay.chargeableDistanceKm, 172);
    assert.equal(rtFromOneWay.estimatedFare, 3408);
  }
});

test('Validation rejects invalid distances, missing durations, and negative values', () => {
  const zeroDist = calculateTripFare({ tripType: 'local', distanceKm: 0 });
  assert.equal(zeroDist.ok, false);
  if (!zeroDist.ok) assert.equal(zeroDist.errorCode, 'INVALID_DISTANCE');

  const negDist = calculateTripFare({ tripType: 'outstation_drop', distanceKm: -15 });
  assert.equal(negDist.ok, false);
  if (!negDist.ok) assert.equal(negDist.errorCode, 'INVALID_DISTANCE');

  const nanDist = calculateTripFare({ tripType: 'local', distanceKm: Number.NaN });
  assert.equal(nanDist.ok, false);

  const missingHours = calculateTripFare({ tripType: 'hourly', distanceKm: 20 });
  assert.equal(missingHours.ok, false);
  if (!missingHours.ok) assert.equal(missingHours.errorCode, 'MISSING_HOURS');

  const zeroHours = calculateTripFare({ tripType: 'hourly', distanceKm: 20, bookedHours: 0 });
  assert.equal(zeroHours.ok, false);
  if (!zeroHours.ok) assert.equal(zeroHours.errorCode, 'INVALID_HOURS');

  const missingDays = calculateTripFare({ tripType: 'round_trip', distanceKm: 200 });
  assert.equal(missingDays.ok, false);
  if (!missingDays.ok) assert.equal(missingDays.errorCode, 'MISSING_DAYS');

  const nonIntDays = calculateTripFare({
    tripType: 'round_trip',
    distanceKm: 200,
    chargeableDays: 1.5,
  });
  assert.equal(nonIntDays.ok, false);
  if (!nonIntDays.ok) assert.equal(nonIntDays.errorCode, 'INVALID_DAYS');
});

test('Inclusive calendar day calculation helper', () => {
  assert.equal(calculateInclusiveTripDays('2026-11-10', '2026-11-10'), 1);
  assert.equal(calculateInclusiveTripDays('2026-11-10', '2026-11-12'), 3);
  assert.equal(calculateInclusiveTripDays('2026-11-12', '2026-11-10'), null);
  assert.equal(calculateInclusiveTripDays('', '2026-11-10'), null);
});

test('WhatsApp message and URL builder encodes properly and hides internal breakdown', () => {
  const msg = buildWhatsAppMessage({
    customerName: 'Karthik R',
    customerPhone: '9876543210',
    tripType: 'outstation_drop',
    pickupAddress: 'RS Puram, Coimbatore',
    dropAddress: 'Ooty Bus Stand, The Nilgiris',
    travelDate: '2026-11-15',
    estimatedDistanceKm: 86,
    estimatedFare: 2980,
  });

  assert.equal(msg.includes('Estimated Fare: ₹2,980'), true);
  assert.equal(msg.includes('driver allowance'), false);
  assert.equal(msg.includes('₹30'), false);
  assert.equal(msg.includes('Duration:'), false); // Outstation drop omits duration

  // When business WhatsApp is empty, url is null and isConfigured is false
  const unconfigured = buildWhatsAppUrl({
    whatsappNumber: '',
    customerName: 'Karthik R',
    customerPhone: '9876543210',
    tripType: 'outstation_drop',
    pickupAddress: 'RS Puram, Coimbatore',
    dropAddress: 'Ooty Bus Stand, The Nilgiris',
    travelDate: '2026-11-15',
    estimatedDistanceKm: 86,
    estimatedFare: 2980,
  });
  assert.equal(unconfigured.isConfigured, false);
  assert.equal(unconfigured.url, null);

  // With a test number in development
  const configured = buildWhatsAppUrl({
    whatsappNumber: '+91 98765 00000',
    customerName: 'Karthik R',
    customerPhone: '9876543210',
    tripType: 'round_trip',
    pickupAddress: 'Gandhipuram, Coimbatore',
    dropAddress: 'Kodaikanal Lake',
    travelDate: '2026-12-01',
    durationLabel: '3 Days',
    estimatedDistanceKm: 344,
    estimatedFare: 6316,
  });
  assert.equal(configured.isConfigured, true);
  assert.equal(configured.url?.startsWith('https://wa.me/919876500000?text='), true);
  assert.equal(configured.message.includes('Duration: 3 Days'), true);
});

test('formatINR formats Indian currency properly', () => {
  assert.equal(formatINR(2350), '₹2,350');
  assert.equal(formatINR(125000), '₹1,25,000');
});

test('Routing service resolves verified road routes and rejects unknown/same locations without guessing', async () => {
  // 3-character minimum rule: 1 or 2 generic characters return empty suggestions
  assert.equal(searchLocationSuggestions('G').length, 0);
  assert.equal(searchLocationSuggestions('Ga').length, 0);

  // Part 7 Local Search Tests
  const ganSuggestions = searchLocationSuggestions('Gan');
  assert.equal(ganSuggestions.some((s) => s.id === 'cbe-gandhipuram'), true);
  assert.equal(ganSuggestions.some((s) => s.id === 'cbe-ganapathy'), true);

  const airSuggestions = searchLocationSuggestions('Air');
  assert.equal(airSuggestions[0]?.id, 'cbe-airport');

  const peelSuggestions = searchLocationSuggestions('Peel');
  assert.equal(peelSuggestions[0]?.id, 'cbe-peelamedu');

  const sarSuggestions = searchLocationSuggestions('Sar');
  assert.equal(sarSuggestions[0]?.id, 'cbe-saravanampatti');

  const rsSuggestions1 = searchLocationSuggestions('RS');
  assert.equal(rsSuggestions1[0]?.id, 'cbe-rspuram');
  const rsSuggestions2 = searchLocationSuggestions('R.S.');
  assert.equal(rsSuggestions2[0]?.id, 'cbe-rspuram');

  // Alternative spelling & locality coverage tests
  assert.equal(searchLocationSuggestions('Kovai Pudur')[0]?.id, 'cbe-kovaipudur');
  assert.equal(searchLocationSuggestions('Vadav')[0]?.id, 'cbe-vadavalli');
  assert.equal(searchLocationSuggestions('Thud')[0]?.id, 'cbe-thudiyalur');

  // Part 7 Outstation Search Tests
  const cheSuggestions = searchLocationSuggestions('Che');
  assert.equal(cheSuggestions.some((s) => s.id === 'dest-chennai'), true);

  const ootSuggestions = searchLocationSuggestions('Oot');
  assert.equal(ootSuggestions[0]?.id, 'dest-ooty');

  const benSuggestions = searchLocationSuggestions('Ben');
  assert.equal(benSuggestions[0]?.id, 'dest-bengaluru');
  assert.equal(searchLocationSuggestions('Bang')[0]?.id, 'dest-bengaluru');

  const kocSuggestions = searchLocationSuggestions('Koc');
  assert.equal(kocSuggestions[0]?.id, 'dest-kochi');

  const hydSuggestions = searchLocationSuggestions('Hyd');
  assert.equal(hydSuggestions[0]?.id, 'dest-hyderabad');

  // Part 7 Distance & Fare Verification Tests
  // 1. Local Coimbatore trip: Gandhipuram -> Airport (10.8 km -> ₹100 + 10.8 * 30 = ₹424)
  const routeLocal = await getRouteDistanceKm(
    'Gandhipuram Central Bus Stand',
    'Coimbatore International Airport (CJB)'
  );
  assert.equal(routeLocal.ok, true);
  if (routeLocal.ok) {
    assert.equal(routeLocal.distanceKm, 10.8);
    const localFare = calculateTripFare({ tripType: 'local', distanceKm: routeLocal.distanceKm });
    assert.equal(localFare.ok, true);
    if (localFare.ok) {
      assert.equal(localFare.estimatedFare, 424);
    }
  }

  // 2. Coimbatore to Ooty (86 km one-way -> Outstation Drop ₹2,980; Round Trip 2 days 172 km -> ₹3,408)
  const routeOoty = await getRouteDistanceKm(
    'Coimbatore Junction Railway Station',
    'Ooty (Udhagamandalam)'
  );
  assert.equal(routeOoty.ok, true);
  if (routeOoty.ok) {
    assert.equal(routeOoty.distanceKm, 86);
  }

  // 3. Coimbatore to Chennai (~506 km one-way -> Outstation Drop 506 * 30 + 400 = ₹15,580)
  const routeChennai = await getRouteDistanceKm('Gandhipuram Central Bus Stand', 'Chennai');
  assert.equal(routeChennai.ok, true);
  if (routeChennai.ok) {
    assert.equal(routeChennai.distanceKm, 506);
    const chennaiDropFare = calculateTripFare({
      tripType: 'outstation_drop',
      distanceKm: routeChennai.distanceKm,
    });
    assert.equal(chennaiDropFare.ok, true);
    if (chennaiDropFare.ok) {
      assert.equal(chennaiDropFare.estimatedFare, 15580);
    }
  }

  // 4. Coimbatore to Kochi (~192 km one-way -> Outstation Drop 192 * 30 + 400 = ₹6,160)
  const routeKochi = await getRouteDistanceKm('Gandhipuram Central Bus Stand', 'Kochi (Cochin / Ernakulam)');
  assert.equal(routeKochi.ok, true);
  if (routeKochi.ok) {
    assert.equal(routeKochi.distanceKm, 192);
    const kochiDropFare = calculateTripFare({
      tripType: 'outstation_drop',
      distanceKm: routeKochi.distanceKm,
    });
    assert.equal(kochiDropFare.ok, true);
    if (kochiDropFare.ok) {
      assert.equal(kochiDropFare.estimatedFare, 6160);
    }
  }

  // 5. Rejects identical and unresolved locations without guessing
  const sameLoc = await getRouteDistanceKm(
    'Gandhipuram Central Bus Stand',
    'Gandhipuram Central Bus Stand'
  );
  assert.equal(sameLoc.ok, false);
  if (!sameLoc.ok) {
    assert.equal(sameLoc.errorCode, 'SAME_LOCATION');
  }

  const unknownLoc = await getRouteDistanceKm(
    'Unknown Street 999 Nowhere',
    'Another Unmapped Address 123'
  );
  assert.equal(unknownLoc.ok, false);
  if (!unknownLoc.ok) {
    assert.equal(unknownLoc.errorCode, 'UNRESOLVED_LOCATION');
  }
});

test('Business config, analytics config, and 32-asset manifest match approved configuration', () => {
  // Confirm approved business contact details and operating hubs
  assert.equal(business.name, 'Yellow Go Taxi');
  assert.equal(business.phone, '+91 99943 53722');
  assert.equal(business.whatsapp, '919994353722');
  assert.equal(business.email, '');
  assert.equal(business.address, 'Gandhipuram, Coimbatore, Tamil Nadu');
  assert.equal(business.locationConfirmed, true);
  assert.equal(business.operatingHubs.includes('Gandhipuram'), true);
  assert.equal(business.operatingHubs.includes('Peelamedu'), true);
  assert.equal(business.operatingHubs.includes('Coimbatore International Airport (CJB)'), true);
  assert.equal(business.operatingHubs.includes('Coimbatore Junction Railway Station'), true);
  assert.equal(business.operatingHours, '');

  // Confirm no fabricated tracking IDs
  assert.equal(analyticsConfig.ga4MeasurementId, '');
  assert.equal(analyticsConfig.googleAdsConversionId, '');
  assert.equal(analyticsConfig.conversionLabels.bookingFormSubmit, '');
  assert.equal(analyticsConfig.conversionLabels.whatsappBookingClick, '');

  // Confirm all 32 required image filenames exist in ASSET_MANIFEST
  const expectedAssets = [
    'yellow-go-taxi-logo.svg',
    'favicon.svg',
    'favicon.ico',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'hero-suv.webp',
    'service-local.webp',
    'service-hourly.webp',
    'service-outstation.webp',
    'service-round-trip.webp',
    'why-choose-us.webp',
    'travel-cta-banner.webp',
    'tour-ooty.webp',
    'tour-kodaikanal.webp',
    'tour-isha-yoga.webp',
    'tour-valparai.webp',
    'tour-munnar.webp',
    'tour-yercaud.webp',
    'tour-masinagudi-mudumalai.webp',
    'tour-topslip.webp',
    'tour-palani.webp',
    'tour-chikmagalur.webp',
    'blog-hidden-places-coimbatore.webp',
    'blog-best-time-ooty.webp',
    'blog-weekend-getaways.webp',
    'blog-valparai-guide.webp',
    'blog-isha-yoga-guide.webp',
    'blog-family-tourist-places.webp',
    'blog-ooty-road-trip.webp',
    'blog-monsoon-travel-tips.webp',
    'blog-hill-stations-near-coimbatore.webp',
    'blog-travel-checklist.webp',
  ];
  assert.equal(expectedAssets.length, 32);
  for (const filename of expectedAssets) {
    assert.equal(Boolean(ASSET_MANIFEST[filename]), true, `Missing manifest entry for ${filename}`);
  }

  // Confirm all 10 tour routes and all 10 blog routes match the specification
  assert.equal(TOUR_PAGES.length, 10);
  const expectedTourPaths = [
    '/tours/coimbatore-to-ooty-taxi/',
    '/tours/coimbatore-to-kodaikanal-taxi/',
    '/tours/isha-yoga-center-taxi/',
    '/tours/coimbatore-to-valparai-taxi/',
    '/tours/coimbatore-to-munnar-taxi/',
    '/tours/coimbatore-to-yercaud-taxi/',
    '/tours/masinagudi-mudumalai-taxi/',
    '/tours/topslip-taxi/',
    '/tours/palani-temple-taxi/',
    '/tours/coimbatore-to-chikmagalur-taxi/',
  ];
  assert.deepEqual(
    TOUR_PAGES.map((t) => t.path),
    expectedTourPaths
  );

  assert.equal(BLOG_ARTICLES.length, 10);
  const expectedBlogPaths = [
    '/blog/hidden-tourist-places-near-coimbatore/',
    '/blog/best-time-to-visit-ooty/',
    '/blog/weekend-getaways-from-coimbatore/',
    '/blog/valparai-travel-guide/',
    '/blog/isha-yoga-center-travel-guide/',
    '/blog/family-friendly-tourist-places-tamil-nadu/',
    '/blog/coimbatore-to-ooty-road-trip/',
    '/blog/monsoon-travel-tips/',
    '/blog/best-hill-stations-near-coimbatore/',
    '/blog/taxi-trip-checklist/',
  ];
  assert.deepEqual(
    BLOG_ARTICLES.map((b) => b.path),
    expectedBlogPaths
  );

  assert.equal(TAXI_SERVICES.length, 4);
});



