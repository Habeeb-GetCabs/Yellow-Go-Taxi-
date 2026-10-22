import type { TripMode } from '../utils/fareCalculator';

export interface ServicePageData {
  id: string;
  slug: string;
  path: string;
  tripType: TripMode;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introParagraph: string;
  imageFilename: string;
  imageAlt: string;
  idealFor: string[];
  howItWorksNotes: string[];
  bookingDefaults: {
    tripType: TripMode;
    pickup?: string;
    drop?: string;
    hours?: number;
    days?: number;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export const TAXI_SERVICES: ServicePageData[] = [
  {
    id: 'local-taxi',
    slug: 'local-taxi',
    path: '/services/local-taxi/',
    tripType: 'local',
    title: 'Local Taxi',
    shortDescription: 'Comfortable city rides and local point-to-point transportation across Coimbatore.',
    metaTitle: 'Coimbatore Local Taxi Service | Point-to-Point City Rides | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore local taxi for airport transfers, railway station pickups, hospital visits, and city point-to-point travel with clear upfront fare estimates.',
    h1: 'Coimbatore Local Taxi Service',
    introParagraph:
      'Whether you are travelling between Coimbatore International Airport (CJB), Coimbatore Junction Railway Station, Gandhipuram, R.S. Puram, or Saravanampatti IT Park, our Local Taxi service provides direct point-to-point city transfers with upfront estimated fares.',
    imageFilename: 'service-local.webp',
    imageAlt: 'Local city taxi service in Coimbatore for point-to-point urban travel',
    idealFor: [
      'Coimbatore International Airport (CJB) pickups and drops',
      'Coimbatore Junction and Podanur Railway Station transfers',
      'Point-to-point commutes between R.S. Puram, Peelamedu, Race Course, and Saravanampatti',
      'Direct rides to hospitals, colleges, and convention venues within city limits',
    ],
    howItWorksNotes: [
      'Select "Local" in the trip estimator and choose your pickup and destination hubs.',
      'Our route estimator calculates the road distance along Coimbatore city corridors and displays a single estimated trip fare.',
      'Send your trip details directly via WhatsApp or the enquiry form to confirm vehicle availability.',
    ],
    bookingDefaults: {
      tripType: 'local',
      pickup: 'Coimbatore International Airport (CJB)',
      drop: 'R.S. Puram (D.B. Road)',
    },
    faqs: [
      {
        question: 'How is the Local Taxi fare estimated?',
        answer:
          'Local taxi estimates are calculated from the verified road distance between your pickup and drop point using our configured city tariff. You see the total estimated trip fare upfront before submitting your booking request.',
      },
      {
        question: 'Should I choose Local Taxi or Hourly Rental for multiple stops?',
        answer:
          'Choose Local Taxi for a direct point-to-point transfer. If you plan to visit multiple locations and need the cab to wait with you across several hours, our Hourly Rental option is more suitable.',
      },
    ],
  },
  {
    id: 'hourly-rental',
    slug: 'hourly-rental',
    path: '/services/hourly-rental/',
    tripType: 'hourly',
    title: 'Hourly Rental',
    shortDescription: 'Flexible hourly rental packages for business meetings, shopping, and city sightseeing.',
    metaTitle: 'Hourly Taxi Rental in Coimbatore | Flexible City Packages | Yellow Go Taxi',
    metaDescription:
      'Hire a taxi by the hour in Coimbatore for business meetings, wedding shopping, temple visits, or local sightseeing. Clear hourly package fare estimates.',
    h1: 'Hourly Taxi Rental in Coimbatore',
    introParagraph:
      'When your schedule involves multiple stops across Coimbatore—such as corporate visits along Avinashi Road, shopping in Cross Cut Road and R.S. Puram, or half-day local temple visits—our Hourly Rental service keeps a dedicated vehicle and driver at your disposal for your chosen duration.',
    imageFilename: 'service-hourly.webp',
    imageAlt: 'Flexible hourly taxi rental package in Coimbatore for multi-stop city errands and business meetings',
    idealFor: [
      'Corporate executives attending back-to-back meetings across Peelamedu, Saravanampatti, and Race Course',
      'Family shopping trips across Cross Cut Road, Town Hall, and R.S. Puram',
      'Half-day or full-day local sightseeing (Marudhamalai Temple, Perur Pateeswarar Temple, GD Naidu Museum)',
      'Guest transportation for weddings, conferences, and family events',
    ],
    howItWorksNotes: [
      'Select "Hourly Rental" in the booking calculator and enter your primary pickup hub, final drop point, and required hours.',
      'Each booked hour includes a set distance allowance, with any extra kilometres factored transparently into the single estimated total.',
      'Partial hours are rounded according to our configured hourly rule (subject to final booking confirmation).',
    ],
    bookingDefaults: {
      tripType: 'hourly',
      pickup: 'Gandhipuram Central Bus Stand',
      drop: 'Marudhamalai Murugan Temple Foothills',
      hours: 4,
    },
    faqs: [
      {
        question: 'What happens if my trip exceeds the initially booked hours?',
        answer:
          'If your schedule extends on the day of travel, additional hours and kilometres are calculated according to the configured hourly tariff. Please inform dispatch if you need to extend your booking.',
      },
      {
        question: 'Can I use Hourly Rental for hill station trips like Ooty?',
        answer:
          'Hourly Rental is designed for local Coimbatore and suburban usage. For hill stations and inter-district travel, please select Outstation Drop or Round Trip.',
      },
    ],
  },
  {
    id: 'outstation-drop',
    slug: 'outstation-drop',
    path: '/services/outstation-drop/',
    tripType: 'outstation_drop',
    title: 'Outstation Drop',
    shortDescription: 'Point-to-point outstation drop bookings to hill stations, temples, and cities across South India.',
    metaTitle: 'Coimbatore Outstation Drop Taxi | Point-to-Point Intercity Cabs | Yellow Go Taxi',
    metaDescription:
      'Book an Outstation Drop taxi from Coimbatore to Ooty, Kodaikanal, Munnar, Palani, Valparai, Salem, or Bengaluru. Transparent point-to-point fare estimates.',
    h1: 'Outstation Drop Taxi Service from Coimbatore',
    introParagraph:
      'Travelling from Coimbatore to another city, hill station, or pilgrimage town without requiring a return journey on the same booking? Our Outstation Drop service offers direct door-to-door transfers from Coimbatore to destinations across Tamil Nadu, Kerala, and Karnataka.',
    imageFilename: 'service-outstation.webp',
    imageAlt: 'Outstation drop taxi from Coimbatore to destinations across Tamil Nadu, Kerala, and Karnataka',
    idealFor: [
      'Direct point-to-point transfers from Coimbatore Airport or Junction to Ooty, Coonoor, or Kotagiri',
      'Intercity drops to Kodaikanal, Munnar, Valparai, Palani, Yercaud, or Madurai',
      'Relocation, college reporting, or resort check-in drops where return dates are open-ended',
      'Pilgrimage drops to Palani Dhandayuthapani Temple or Isha Yoga Center',
    ],
    howItWorksNotes: [
      'Select "Outstation Drop" in the booking form and choose your Coimbatore pickup point and outstation destination.',
      'The calculator determines the highway road distance and computes a single estimated trip fare.',
      'Toll, forest checkpost, and parking charges (where applicable on the route) are confirmed clearly before dispatch.',
    ],
    bookingDefaults: {
      tripType: 'outstation_drop',
      pickup: 'Coimbatore International Airport (CJB)',
      drop: 'Ooty (Udhagamandalam)',
    },
    faqs: [
      {
        question: 'Is Outstation Drop different from Round Trip?',
        answer:
          'Yes. Outstation Drop is for a single point-to-point transfer to your destination without keeping the vehicle for return travel or multi-day sightseeing.',
      },
      {
        question: 'Are interstate permits or forest checkpost fees included in the online estimate?',
        answer:
          'The online calculator provides the estimated trip fare based on route distance. Statutory toll charges, interstate permits (for Kerala or Karnataka routes), and forest checkpost fees are confirmed based on your exact route prior to booking confirmation.',
      },
    ],
  },
  {
    id: 'round-trip',
    slug: 'round-trip',
    path: '/services/round-trip/',
    tripType: 'round_trip',
    title: 'Round Trip',
    shortDescription: 'Return journeys with configurable multi-day duration for hill station holidays and tours.',
    metaTitle: 'Coimbatore Round Trip Taxi Service | Multi-Day Outstation Tours | Yellow Go Taxi',
    metaDescription:
      'Plan a multi-day round-trip taxi journey from Coimbatore to Ooty, Kodaikanal, Valparai, Munnar, or Chikmagalur with clear return-distance fare estimates.',
    h1: 'Round Trip Outstation Taxi Service from Coimbatore',
    introParagraph:
      'For weekend getaways, family hill-station vacations, and multi-temple circuits starting and ending in Coimbatore, our Round Trip service keeps the same vehicle and driver with you throughout your itinerary.',
    imageFilename: 'service-round-trip.webp',
    imageAlt: 'Multi-day round-trip taxi service from Coimbatore for family holidays and hill station tours',
    idealFor: [
      '2-to-5 day hill station holidays to Ooty, Kodaikanal, Valparai, Munnar, Yercaud, or Chikmagalur',
      'Same-day return excursions to Isha Yoga Center, Topslip, or Palani Temple',
      'Wildlife safari road trips to Masinagudi and Mudumalai Tiger Reserve',
      'Custom multi-city South India family itineraries starting and returning to Coimbatore',
    ],
    howItWorksNotes: [
      'Select "Round Trip" in the booking calculator, choose your pickup and destination, and specify the number of chargeable days.',
      'The calculator uses the actual return-journey road distance (without double-counting) and the number of trip days to display your estimated total fare.',
      'If your itinerary includes local sightseeing loops at the destination, share your stops on WhatsApp so we can provide an updated total distance estimate.',
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore Junction Railway Station',
      drop: 'Kodaikanal Lake & Town Center',
      days: 3,
    },
    faqs: [
      {
        question: 'How are chargeable days counted on a Round Trip?',
        answer:
          'Chargeable days are based on calendar days from pickup to return in Coimbatore (subject to owner tariff approval). You can select the exact number of days or enter your pickup and return dates in the calculator.',
      },
      {
        question: 'Does the Round Trip estimate include local sightseeing kilometres at the destination?',
        answer:
          'The instant calculator estimates the highway return distance between your pickup and primary destination. If you wish to include local sightseeing points, mention them in your WhatsApp enquiry so the expected sightseeing kilometres can be included in your final quote.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return TAXI_SERVICES.find((s) => s.slug === slug);
}
