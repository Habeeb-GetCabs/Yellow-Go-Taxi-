import type { TripMode } from '../utils/fareCalculator';

export interface TourPageData {
  id: string;
  slug: string;
  path: string;
  destinationName: string;
  shortTagline: string;
  featuredOnHome: boolean;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introParagraphs: string[];
  imageFilename: string;
  imageAlt: string;
  approxOneWayKm: number;
  approxDriveTime: string;
  recommendedDuration: string;
  routeCorridor: string;
  verificationNote: string;
  highlights: Array<{ title: string; description: string }>;
  suggestedItinerary: Array<{ dayOrPhase: string; title: string; details: string }>;
  practicalInfo: Array<{ label: string; detail: string }>;
  bookingDefaults: {
    tripType: TripMode;
    pickup: string;
    drop: string;
    days: number;
  };
  faqs: Array<{ question: string; answer: string }>;
  relatedTourSlugs: string[];
  relatedBlogSlugs: string[];
}

export const TOUR_PAGES: TourPageData[] = [
  {
    id: 'tour-ooty',
    slug: 'coimbatore-to-ooty-taxi',
    path: '/tours/coimbatore-to-ooty-taxi/',
    destinationName: 'Ooty (Udhagamandalam)',
    shortTagline: 'Nilgiri mountain climb via Mettupalayam & Coonoor tea estates',
    featuredOnHome: true,
    metaTitle: 'Coimbatore to Ooty Taxi Service | Outstation Drop & Round Trip | Yellow Go Taxi',
    metaDescription:
      'Plan your Coimbatore to Ooty taxi trip with Yellow Go Taxi. Convenient pickups from Coimbatore Airport or Junction, clear route fare estimates, and custom Nilgiri itineraries.',
    h1: 'Coimbatore to Ooty Taxi Service',
    introParagraphs: [
      'The road journey from Coimbatore to Ooty (Udhagamandalam) is one of South India’s classic hill-station drives, ascending from the plains of Mettupalayam through eucalyptus groves, Coonoor tea gardens, and sweeping Nilgiri hairpin bends.',
      'Yellow Go Taxi offers both direct Outstation Drop transfers and multi-day Round Trip bookings from Coimbatore International Airport (CJB), Coimbatore Junction Railway Station, and city residences directly to your Ooty hotel or homestay.',
    ],
    imageFilename: 'tour-ooty.webp',
    imageAlt: 'Scenic tea gardens and misty hills in Ooty on the Coimbatore to Ooty taxi route',
    approxOneWayKm: 86,
    approxDriveTime: 'Approx. 3 to 3.5 hours (route & traffic dependent)',
    recommendedDuration: '2 to 3 Days (or Same-Day Outstation Drop)',
    routeCorridor: 'NH181 via Mettupalayam, Kallar & Coonoor (or via Kotagiri)',
    verificationNote:
      'Approximate distance (~86 km one-way via Coonoor) and travel time vary by exact Coimbatore pickup point, seasonal hill traffic, and Tamil Nadu e-Pass checkpost queues.',
    highlights: [
      {
        title: 'Government Botanical Garden & Rose Garden',
        description:
          'Terraced lawns, heritage glasshouse conservatory, and thousands of rose varieties in central Ooty.',
      },
      {
        title: 'Doddabetta Peak Viewpoint',
        description:
          'The highest vantage point in the Nilgiris offering panoramic vistas across the Mysore plateau and Coimbatore plains.',
      },
      {
        title: 'Ooty Lake & Pykara Waterfalls Corridor',
        description:
          'Boating facilities at Ooty Lake and scenic pine forests, Wenlock Downs, and Pykara lake further along the Gudalur highway.',
      },
      {
        title: 'Coonoor En-Route Sightseeing',
        description:
          'Option to include Sim’s Park, Dolphin’s Nose, and Lamb’s Rock on the ascent or return leg.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore Pickup, Ghat Ascent & Central Ooty',
        details:
          'Morning pickup from Coimbatore Airport or Junction. Drive via Mettupalayam and Coonoor road, check in at your Ooty hotel, and visit the Botanical Garden and Ooty Lake in the afternoon.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Doddabetta Peak & Pykara Scenic Belt',
        details:
          'Start early for Doddabetta Peak, Tea Factory & Museum, Pine Forest viewpoint, Wenlock Downs (9th Mile), and Pykara Lake before returning to Ooty town.',
      },
      {
        dayOrPhase: 'Day 3',
        title: 'Coonoor Highlights & Return to Coimbatore',
        details:
          'Check out after breakfast, explore Sim’s Park and Lamb’s Rock in Coonoor, and descend to Coimbatore in time for your evening train or flight.',
      },
    ],
    practicalInfo: [
      {
        label: 'Route Options',
        detail:
          'The primary NH181 route runs via Mettupalayam and Coonoor (14 hairpin bends). An alternative scenic route runs via Mettupalayam and Kotagiri with wider road sections.',
      },
      {
        label: 'Entry Permits / e-Pass',
        detail:
          'Seasonal Nilgiris district vehicle entry regulations (such as e-Pass registration during peak months) may apply. Please verify current district guidelines prior to travel.',
      },
      {
        label: 'Best Departure Window',
        detail:
          'Departing Coimbatore between 6:00 AM and 8:30 AM helps avoid city peak traffic and morning fog on the upper ghat sections.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore International Airport (CJB)',
      drop: 'Ooty (Udhagamandalam)',
      days: 3,
    },
    faqs: [
      {
        question: 'How far is Ooty from Coimbatore Airport by taxi?',
        answer:
          'Ooty is approximately 86 to 92 km from Coimbatore depending on whether you depart from Coimbatore Junction or Coimbatore International Airport (CJB) and whether you travel via Coonoor or Kotagiri.',
      },
      {
        question: 'Can I book only an Outstation Drop from Coimbatore to Ooty?',
        answer:
          'Yes. Select "Outstation Drop" in the booking calculator to view the estimated one-way transfer fare from Coimbatore to Ooty.',
      },
      {
        question: 'Can we stop at Coonoor on the way to Ooty?',
        answer:
          'Yes, Coonoor lies directly on the NH181 route between Mettupalayam and Ooty. Mention any planned sightseeing stops when submitting your WhatsApp booking enquiry.',
      },
    ],
    relatedTourSlugs: [
      'masinagudi-mudumalai-taxi',
      'coimbatore-to-kodaikanal-taxi',
      'coimbatore-to-valparai-taxi',
    ],
    relatedBlogSlugs: ['best-time-to-visit-ooty', 'coimbatore-to-ooty-road-trip'],
  },
  {
    id: 'tour-kodaikanal',
    slug: 'coimbatore-to-kodaikanal-taxi',
    path: '/tours/coimbatore-to-kodaikanal-taxi/',
    destinationName: 'Kodaikanal',
    shortTagline: 'Misty Palani Hills retreat via Pollachi, Udumalpet & Palani foothills',
    featuredOnHome: true,
    metaTitle: 'Coimbatore to Kodaikanal Taxi | Outstation Drop & Tour Cab | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore to Kodaikanal taxi for family vacations or direct resort drops. Transparent fare estimation via Pollachi and Palani ghat road.',
    h1: 'Coimbatore to Kodaikanal Taxi Service',
    introParagraphs: [
      'Perched in the Palani Hills of Dindigul district, Kodaikanal offers cool pine forests, a star-shaped central lake, and dramatic cliffside valleys. Travelling by private taxi from Coimbatore lets you enjoy a smooth highway drive past Pollachi and Palani before ascending the scenic ghat road.',
      'Choose between an Outstation Drop directly to your Kodaikanal resort or a multi-day Round Trip package that stays with your family for local valley sightseeing.',
    ],
    imageFilename: 'tour-kodaikanal.webp',
    imageAlt: 'Kodaikanal Lake and misty valleys accessible by Coimbatore to Kodaikanal taxi',
    approxOneWayKm: 172,
    approxDriveTime: 'Approx. 4.5 to 5 hours (route & weather dependent)',
    recommendedDuration: '3 Days / 2 Nights',
    routeCorridor: 'NH83 via Pollachi, Udumalpet, Palani Bypass & Perumalmalai Ghat Road',
    verificationNote:
      'Approximate distance (~172 km one-way) depends on whether the Palani-Perumalmalai ghat road or Batlagundu route is taken. Subject to checkpost regulations.',
    highlights: [
      {
        title: 'Kodaikanal Lake & Bryant Park',
        description:
          'A 5 km lakeside promenade for cycling, boating, and walking beside landscaped horticultural gardens.',
      },
      {
        title: 'Coaker’s Walk & Pillar Rocks',
        description:
          'Pedestrian cliff-edge walkway and towering granite rock formations overlooking the southern plains.',
      },
      {
        title: 'Pine Forest & Moir Point',
        description:
          'Tall preserved pine groves and historic viewpoints leading toward Berijam Lake forest checkpost.',
      },
      {
        title: 'Silver Cascade Waterfall',
        description:
          'A convenient roadside waterfall stop on the upper ghat approach just before entering Kodaikanal town.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore to Kodaikanal via Pollachi & Palani Foothills',
        details:
          'Morning departure from Coimbatore. Pause at Silver Cascade Waterfall on the ghat road, check in at your hotel, and enjoy an evening walk at Coaker’s Walk and Kodaikanal Lake.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Valley Viewpoints & Pine Forest Circuit',
        details:
          'Visit Pillar Rocks, Guna Caves exterior viewpoint, Pine Forest, Moir Point, and Bryant Park.',
      },
      {
        dayOrPhase: 'Day 3',
        title: 'Kurinji Andavar Temple & Return to Coimbatore',
        details:
          'Morning visit to Kurinji Andavar Temple and Chettiar Park, followed by a relaxed descent back to Coimbatore.',
      },
    ],
    practicalInfo: [
      {
        label: 'Highway & Ghat Conditions',
        detail:
          'The first 110 km from Coimbatore to Palani runs on well-paved plains highways, followed by ~60 km of steady mountain ghat ascent via Perumalmalai.',
      },
      {
        label: 'District Entry Requirements',
        detail:
          'Dindigul district / Kodaikanal local administration may require vehicle e-Pass registration during designated seasons. Please verify before departure.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore Junction Railway Station',
      drop: 'Kodaikanal Lake & Town Center',
      days: 3,
    },
    faqs: [
      {
        question: 'What is the approximate taxi distance from Coimbatore to Kodaikanal?',
        answer:
          'The road distance is approximately 172 km one-way via Pollachi, Udumalpet, and the Palani-Perumalmalai ghat road, or roughly 180–185 km if travelling from Coimbatore International Airport.',
      },
      {
        question: 'Can we combine a Palani Temple visit with our Kodaikanal taxi trip?',
        answer:
          'Yes. Since Palani lies directly at the foothills on the route from Coimbatore to Kodaikanal, many travellers schedule a temple stop on either the onward or return journey.',
      },
    ],
    relatedTourSlugs: ['palani-temple-taxi', 'coimbatore-to-ooty-taxi', 'coimbatore-to-munnar-taxi'],
    relatedBlogSlugs: ['best-hill-stations-near-coimbatore', 'family-friendly-tourist-places-tamil-nadu'],
  },
  {
    id: 'tour-isha',
    slug: 'isha-yoga-center-taxi',
    path: '/tours/isha-yoga-center-taxi/',
    destinationName: 'Isha Yoga Center & Adiyogi',
    shortTagline: 'Direct foothills transfer to Velliangiri & Dhyanalinga',
    featuredOnHome: true,
    metaTitle: 'Isha Yoga Center Taxi from Coimbatore Airport & Junction | Yellow Go Taxi',
    metaDescription:
      'Book a taxi from Coimbatore Airport, Junction, or city hotels to Isha Yoga Center and Adiyogi. Choose one-way drop, hourly wait, or same-day return.',
    h1: 'Isha Yoga Center Taxi Service in Coimbatore',
    introParagraphs: [
      'Located at the foothills of the Velliangiri Mountains approximately 30 km west of central Coimbatore, the Isha Yoga Center and the 112-foot Adiyogi statue attract visitors and programme participants from across India.',
      'Yellow Go Taxi provides reliable transfers from Coimbatore International Airport (CJB), Coimbatore Junction Railway Station, and city hotels—whether you need a direct drop for an ashram stay or a same-day return cab that waits while you visit Dhyanalinga and the evening Adiyogi Divya Darshanam.',
    ],
    imageFilename: 'tour-isha-yoga.webp',
    imageAlt: 'Velliangiri hills backdrop at Isha Yoga Center near Coimbatore',
    approxOneWayKm: 30,
    approxDriveTime: 'Approx. 55 to 75 minutes (pickup hub dependent)',
    recommendedDuration: 'Half-Day (4–6 Hours) or Direct Drop',
    routeCorridor: 'Siruvani Main Road via Perur, Alandurai & Iruttupallam Checkpost',
    verificationNote:
      'Distance is ~30 km from Coimbatore Junction and ~40–42 km from Coimbatore International Airport (CJB). Visitor timings and evening light show schedules are managed by Isha Yoga Center and should be verified before travel.',
    highlights: [
      {
        title: 'Dhyanalinga & Linga Bhairavi',
        description:
          'Quiet meditative spaces inside the campus surrounded by the Velliangiri mountain range.',
      },
      {
        title: '112-Foot Adiyogi & Evening Light Projection',
        description:
          'Monumental steel bust at the foothills with an evening sound-and-light presentation (subject to official schedule).',
      },
      {
        title: 'Surya Kund & Chandra Kund',
        description:
          'Consecrated water bodies open to visitors prior to entering the main meditation dome.',
      },
      {
        title: 'Optional Perur Pateeswarar Temple Stop',
        description:
          'Located directly along the Siruvani road between central Coimbatore and Velliangiri foothills.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Option A',
        title: 'Half-Day Afternoon & Evening Return (4 to 6 Hours)',
        details:
          'Pickup from Coimbatore around 2:30 PM. Visit Dhyanalinga and Linga Bhairavi, walk to Adiyogi for the evening ambiance, and return to your Coimbatore hotel or railway station.',
      },
      {
        dayOrPhase: 'Option B',
        title: 'Direct Airport / Railway Station Drop or Pickup',
        details:
          'Point-to-point transfer from Coimbatore International Airport (CJB) or Coimbatore Junction directly to the Isha Yoga Center welcome point.',
      },
    ],
    practicalInfo: [
      {
        label: 'Walkway & Footwear Note',
        detail:
          'Be prepared for moderate walking inside the campus between the parking zone, Adiyogi, and the main Dhyanalinga complex.',
      },
      {
        label: 'Mobile Network Coverage',
        detail:
          'Mobile data signal can be intermittent near the foothills; booking a round-trip or hourly waiting taxi ensures your return vehicle is already waiting on-site.',
      },
    ],
    bookingDefaults: {
      tripType: 'hourly',
      pickup: 'Coimbatore Junction Railway Station',
      drop: 'Isha Yoga Center & Adiyogi',
      days: 1,
    },
    faqs: [
      {
        question: 'Which booking mode is best for visiting Isha Yoga Center for a few hours?',
        answer:
          'If you plan to visit for 4 to 6 hours and return to Coimbatore the same day, select "Hourly Rental" or a 1-day "Round Trip". If you are checking into the ashram and only need a one-way ride, select "Local" or "Outstation Drop".',
      },
      {
        question: 'How far is Isha Yoga Center from Coimbatore Airport?',
        answer:
          'From Coimbatore International Airport (CJB) in Peelamedu, the road distance is approximately 40 to 42 km via central Coimbatore and Siruvani Main Road.',
      },
    ],
    relatedTourSlugs: ['palani-temple-taxi', 'topslip-taxi', 'coimbatore-to-valparai-taxi'],
    relatedBlogSlugs: ['isha-yoga-center-travel-guide', 'hidden-tourist-places-near-coimbatore'],
  },
  {
    id: 'tour-valparai',
    slug: 'coimbatore-to-valparai-taxi',
    path: '/tours/coimbatore-to-valparai-taxi/',
    destinationName: 'Valparai',
    shortTagline: '40 hairpin bends past Aliyar Dam into the Anamalai tea plateau',
    featuredOnHome: true,
    metaTitle: 'Coimbatore to Valparai Taxi Service | Pollachi & Aliyar Route | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore to Valparai taxi through Pollachi, Aliyar Dam, and the famous 40 hairpin bends. Ideal for peaceful tea-estate holidays and nature road trips.',
    h1: 'Coimbatore to Valparai Taxi Service',
    introParagraphs: [
      'Situated at roughly 3,500 feet above sea level in the Anamalai mountain range of Coimbatore district, Valparai is celebrated for its uncrowded tea estates, high-altitude reservoirs, and wildlife-rich forest corridors.',
      'The drive from Coimbatore passes through coconut-lined highways around Pollachi and Aliyar Dam before climbing 40 numbered hairpin bends with sweeping views of the plains below.',
    ],
    imageFilename: 'tour-valparai.webp',
    imageAlt: 'Aliyar Dam viewpoint and hairpin bends on the Coimbatore to Valparai taxi drive',
    approxOneWayKm: 109,
    approxDriveTime: 'Approx. 3.5 to 4 hours (forest checkpost & ghat traffic dependent)',
    recommendedDuration: '2 to 3 Days',
    routeCorridor: 'NH83 to Pollachi -> SH78 via Aliyar Dam, Monkey Falls & 40 Hairpin Bends',
    verificationNote:
      'Approximate distance (~109 km one-way from Central Coimbatore). Forest checkpost timings apply between Aliyar and Valparai; night driving through the reserve is restricted.',
    highlights: [
      {
        title: 'Loam’s Viewpoint (9th Hairpin Bend)',
        description:
          'Signature vantage point overlooking the Aliyar Dam reservoir and the Pollachi plains.',
      },
      {
        title: 'Sholayar Dam & Nallamudi Viewpoint',
        description:
          'Expansive reservoir backwaters and cliffside tea garden viewpoints overlooking tribal valleys and waterfalls.',
      },
      {
        title: 'Balaji Temple (Karumalai) & Vellamalai Tunnel',
        description:
          'Peaceful estate shrines and scenic streams surrounded by manicured tea plantations.',
      },
      {
        title: 'Chinnakallar & Nirar Dam Belt',
        description:
          'High-rainfall rainforest zones (subject to local forest department entry permission).',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore to Valparai via Pollachi & Aliyar Reservoir',
        details:
          'Morning pickup in Coimbatore. Pause at Aliyar Dam park and Loam’s Viewpoint on the 9th hairpin bend. Check in at Valparai and visit Nallamudi Viewpoint in the afternoon.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Sholayar Dam, Tea Estates & Return to Coimbatore',
        details:
          'Morning drive to Sholayar Dam, Koolangal River pebble bed, and Karumalai estate before descending the ghat road in daylight back to Coimbatore.',
      },
    ],
    practicalInfo: [
      {
        label: 'Forest Checkpost Timings',
        detail:
          'Because the Valparai road passes through the Anamalai Tiger Reserve, checkposts near Aliyar enforce daytime entry windows. Always plan early morning departures from Coimbatore.',
      },
      {
        label: 'Plastic-Free Forest Zone',
        detail:
          'Single-use plastics and feeding wildlife (such as Lion-tailed macaques or Nilgiri tahr on the ghat bends) are strictly prohibited by forest authorities.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore Junction Railway Station',
      drop: 'Valparai Hill Station',
      days: 2,
    },
    faqs: [
      {
        question: 'How many hairpin bends are on the Coimbatore to Valparai route?',
        answer:
          'There are 40 numbered hairpin bends ascending from the Aliyar foothills up to the Valparai plateau along State Highway 78.',
      },
      {
        question: 'Can we travel to Valparai late at night?',
        answer:
          'Night travel through the Aliyar–Valparai forest checkpost is restricted by forest authorities. We recommend departing Coimbatore in the morning or early afternoon.',
      },
    ],
    relatedTourSlugs: ['topslip-taxi', 'coimbatore-to-munnar-taxi', 'coimbatore-to-ooty-taxi'],
    relatedBlogSlugs: ['valparai-travel-guide', 'monsoon-travel-tips'],
  },
  {
    id: 'tour-munnar',
    slug: 'coimbatore-to-munnar-taxi',
    path: '/tours/coimbatore-to-munnar-taxi/',
    destinationName: 'Munnar (Kerala)',
    shortTagline: 'Cross-border Western Ghats drive via Udumalpet, Chinnar & Marayoor',
    featuredOnHome: true,
    metaTitle: 'Coimbatore to Munnar Taxi Service | Via Chinnar & Marayoor | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore to Munnar taxi for interstate hill station tours or resort drops. Scenic route via Pollachi, Udumalpet, Chinnar Wildlife Sanctuary, and Marayoor.',
    h1: 'Coimbatore to Munnar Taxi Service',
    introParagraphs: [
      'Connecting Tamil Nadu’s western plains with Kerala’s Idukki highlands, the road trip from Coimbatore to Munnar is a diverse geographical journey—transitioning from dry rain-shadow forests at Chinnar through natural sandalwood groves in Marayoor to high-altitude tea estates.',
      'Yellow Go Taxi arranges both Outstation Drop transfers and multi-day Round Trip vehicles for families and couples travelling from Coimbatore Airport or Junction to Munnar.',
    ],
    imageFilename: 'tour-munnar.webp',
    imageAlt: 'Rolling tea hills in Munnar visited via Coimbatore to Munnar outstation taxi',
    approxOneWayKm: 158,
    approxDriveTime: 'Approx. 4.5 to 5.5 hours (checkpost & ghat traffic dependent)',
    recommendedDuration: '3 to 4 Days',
    routeCorridor: 'NH83 to Udumalpet -> SH17 via Amaravathi, Chinnar Checkpost & Marayoor',
    verificationNote:
      'Approximate distance (~158 km one-way). Interstate Kerala entry permits and forest checkpost daytime operating hours between Udumalpet and Marayoor apply.',
    highlights: [
      {
        title: 'Marayoor Sandalwood Forests & Lakkam Waterfalls',
        description:
          'Scenic roadside stops along SH17 during the final climb into Munnar.',
      },
      {
        title: 'Eravikulam National Park (Rajamalai)',
        description:
          'Highland grassland habitat of the Nilgiri Tahr located along the Udumalpet–Munnar approach (subject to park seasonal closure during calving months).',
      },
      {
        title: 'Mattupetty Dam, Echo Point & Kundala Lake',
        description:
          'Munnar’s signature reservoir belt surrounded by rolling tea hills and eucalyptus groves.',
      },
      {
        title: 'Top Station Viewpoint',
        description:
          'Historic tea-transshipment vantage point on the Kerala–Tamil Nadu border ridge.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore to Munnar via Udumalpet & Marayoor',
        details:
          'Depart Coimbatore in the morning. Cross the Chinnar forest corridor, pause at Lakkam Waterfalls, and check in to your Munnar resort.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Mattupetty Dam, Kundala Lake & Top Station Direction',
        details:
          'Full-day sightseeing covering Photo Point, Mattupetty Dam, Echo Point, Kundala Lake, and the Tea Museum.',
      },
      {
        dayOrPhase: 'Day 3',
        title: 'Eravikulam (Subject to Opening) & Return to Coimbatore',
        details:
          'Morning visit to Rajamalai / Eravikulam viewpoint before driving back via Marayoor and Pollachi to Coimbatore.',
      },
    ],
    practicalInfo: [
      {
        label: 'Interstate Permit & Taxes',
        detail:
          'Because Munnar is in Kerala, commercial vehicles entering from Tamil Nadu require a Kerala state permit/tax receipt, which is confirmed transparently before your journey.',
      },
      {
        label: 'Chinnar Forest Checkpost Hours',
        detail:
          'The Udumalpet–Marayoor forest stretch has daytime checkpost restrictions. Early morning departures from Coimbatore are strongly advised.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore International Airport (CJB)',
      drop: 'Munnar Town Center',
      days: 3,
    },
    faqs: [
      {
        question: 'How long does it take to reach Munnar from Coimbatore by taxi?',
        answer:
          'The drive covers approximately 158 km and typically takes 4.5 to 5.5 hours depending on forest checkpost formalities and hillside road conditions.',
      },
      {
        question: 'Are Kerala state entry permits included in the online calculator estimate?',
        answer:
          'The online calculator estimates the base distance and day tariff. Interstate permit charges for Kerala and statutory tolls are confirmed separately when finalising your booking.',
      },
    ],
    relatedTourSlugs: [
      'coimbatore-to-valparai-taxi',
      'coimbatore-to-kodaikanal-taxi',
      'topslip-taxi',
    ],
    relatedBlogSlugs: ['weekend-getaways-from-coimbatore', 'best-hill-stations-near-coimbatore'],
  },
  {
    id: 'tour-yercaud',
    slug: 'coimbatore-to-yercaud-taxi',
    path: '/tours/coimbatore-to-yercaud-taxi/',
    destinationName: 'Yercaud',
    shortTagline: 'Smooth NH544 highway run & 20-hairpin climb into the Shevaroy Hills',
    featuredOnHome: false,
    metaTitle: 'Coimbatore to Yercaud Taxi Service | Shevaroy Hills Tour | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore to Yercaud taxi via Salem for a calm weekend getaway in the Shevaroy Hills. Transparent outstation drop and round-trip fare estimates.',
    h1: 'Coimbatore to Yercaud Taxi Service',
    introParagraphs: [
      'Located in the Shevaroy Hills of Salem district in the Eastern Ghats, Yercaud is a relaxed, coffee-scented hill station ideal for travellers seeking a quieter alternative to larger mountain towns.',
      'Most of the journey from Coimbatore runs along the multi-lane NH544 highway past Avinashi, Perundurai, and Sankagiri before ascending a short, well-maintained 20-hairpin ghat road from Salem.',
    ],
    imageFilename: 'tour-yercaud.webp',
    imageAlt: 'Shevaroy Hills and Yercaud Lake on the Coimbatore to Yercaud tour',
    approxOneWayKm: 194,
    approxDriveTime: 'Approx. 4 to 4.5 hours',
    recommendedDuration: '2 Days / 1 Night',
    routeCorridor: 'NH544 via Avinashi, Erode Bypass & Salem -> Yercaud Ghat Road',
    verificationNote:
      'Approximate distance (~194 km one-way). Fast highway corridor up to Salem; verify FASTag toll plazas along NH544.',
    highlights: [
      {
        title: 'Yercaud Emerald Lake & Anna Park',
        description:
          'Shaded lakeside walkway and adjacent botanical garden in the heart of Yercaud.',
      },
      {
        title: 'Pagoda Point & Lady’s Seat Viewpoints',
        description:
          'Cliffside viewpoints offering expansive views over Salem city and the Mettur plains.',
      },
      {
        title: 'Loop Road Coffee & Spice Estates',
        description:
          'A quiet 32 km circular drive through silver-oak canopies, coffee plantations, and Cauvery Peak.',
      },
      {
        title: 'Shevaroyan Temple',
        description:
          'Situated atop the highest point in the Shevaroy range with sweeping valley views.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore to Yercaud & Sunset Viewpoints',
        details:
          'Morning highway drive along NH544 to Salem and ascent up the 20 hairpin bends. Visit Emerald Lake, Anna Park, and Lady’s Seat viewpoint before sunset.',
      },
      {
        dayOrPhase: 'Day 2',
        title: '32-Km Loop Road, Pagoda Point & Return to Coimbatore',
        details:
          'Morning scenic drive along the Yercaud Loop Road, visit Shevaroyan Temple and Pagoda Point, and return to Coimbatore by evening.',
      },
    ],
    practicalInfo: [
      {
        label: 'Motion-Friendly Ascent',
        detail:
          'Because roughly 160 km of the 194 km journey is on a flat four-lane highway and only the final ~30 km is ghat road, Yercaud is comfortable for passengers sensitive to prolonged mountain curves.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Peelamedu (PSG Tech /TIDEL Park)',
      drop: 'Yercaud Lake & Shevaroy Hills',
      days: 2,
    },
    faqs: [
      {
        question: 'How long is the ghat road section on a Coimbatore to Yercaud trip?',
        answer:
          'The ghat climb from Salem foothills to Yercaud town is approximately 28 to 32 km with 20 hairpin bends, while the rest of the trip from Coimbatore is on the NH544 highway.',
      },
      {
        question: 'Can we book a one-way Outstation Drop to Yercaud or Salem?',
        answer:
          'Yes, you can select "Outstation Drop" in our fare estimator for a direct point-to-point transfer.',
      },
    ],
    relatedTourSlugs: [
      'coimbatore-to-ooty-taxi',
      'coimbatore-to-kodaikanal-taxi',
      'coimbatore-to-valparai-taxi',
    ],
    relatedBlogSlugs: ['weekend-getaways-from-coimbatore', 'best-hill-stations-near-coimbatore'],
  },
  {
    id: 'tour-masinagudi',
    slug: 'masinagudi-mudumalai-taxi',
    path: '/tours/masinagudi-mudumalai-taxi/',
    destinationName: 'Masinagudi & Mudumalai',
    shortTagline: 'Nilgiri Biosphere wildlife corridor & forest resort transfers',
    featuredOnHome: false,
    metaTitle: 'Coimbatore to Masinagudi & Mudumalai Taxi | Wildlife Tour Cab | Yellow Go Taxi',
    metaDescription:
      'Book a taxi from Coimbatore to Masinagudi and Mudumalai Tiger Reserve via Ooty. Reliable forest resort transfers and multi-day wildlife tour cabs.',
    h1: 'Coimbatore to Masinagudi & Mudumalai Taxi Service',
    introParagraphs: [
      'Located at the northern foothills of the Nilgiris inside the Nilgiri Biosphere Reserve, Masinagudi and the Mudumalai Tiger Reserve (Theppakadu) offer dry deciduous forests, bamboo thickets, and eco-lodges frequented by wildlife enthusiasts.',
      'Yellow Go Taxi provides comfortable transfers from Coimbatore to Masinagudi resorts and Theppakadu safari reception centres, navigating the Nilgiri ghat highways in compliance with local traffic and forest checkpost rules.',
    ],
    imageFilename: 'tour-masinagudi-mudumalai.webp',
    imageAlt: 'Forest road through Mudumalai and Masinagudi wildlife corridor from Coimbatore',
    approxOneWayKm: 114,
    approxDriveTime: 'Approx. 4 to 4.5 hours (route & forest checkpost dependent)',
    recommendedDuration: '2 to 3 Days',
    routeCorridor: 'NH181 via Mettupalayam & Ooty -> Gudalur Road or Kalhatti Route (per police rules)',
    verificationNote:
      'Approximate distance (~114 km via Kalhatti or ~132 km via Gudalur). Note: Descent down the 36-hairpin Kalhatti ghat road often has strict vehicle and permit restrictions enforced by Nilgiris police; routes may operate via Gudalur accordingly.',
    highlights: [
      {
        title: 'Theppakadu Safari Reception & Elephant Camp',
        description:
          'Official Forest Department starting point for Mudumalai bus/van safaris and observation of the Moyar River elephant camp.',
      },
      {
        title: 'Masinagudi Eco-Lodges & Foothill Views',
        description:
          'Quiet forest buffer zone resorts with views of the soaring Nilgiri escarpment.',
      },
      {
        title: 'Pykara Lake & Pine Forest En-Route',
        description:
          'When travelling via the Ooty–Gudalur highway, Pykara waterfalls, Needle Rock viewpoint, and pine forests lie directly along the route.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Coimbatore to Masinagudi / Theppakadu via Ooty',
        details:
          'Early morning pickup in Coimbatore. Ascend to Ooty, pause at Pykara viewpoints, and arrive at Masinagudi / Mudumalai in time for the afternoon Forest Department safari window.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Morning Forest Visit, Ooty Sightseeing & Return to Coimbatore',
        details:
          'Attend the early morning safari or elephant camp session, return up the Nilgiris for lunch in Ooty or Coonoor, and descend to Coimbatore.',
      },
    ],
    practicalInfo: [
      {
        label: 'Kalhatti vs Gudalur Routing',
        detail:
          'Nilgiris district traffic authorities strictly regulate outstation vehicles descending the steep 36-hairpin Kalhatti Ghat road. Depending on current enforcement, downward travel from Ooty to Mudumalai/Masinagudi may route via Gudalur (~18–20 km extra).',
      },
      {
        label: 'Night Traffic Curfew',
        detail:
          'Core forest highways through Mudumalai and Bandipur close to night traffic between 9:00 PM and 6:00 AM.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Coimbatore International Airport (CJB)',
      drop: 'Masinagudi & Mudumalai Tiger Reserve',
      days: 2,
    },
    faqs: [
      {
        question: 'Can private taxis conduct wildlife safaris inside Mudumalai core zones?',
        answer:
          'No. Wildlife safaris inside the core reserve are conducted exclusively by official Tamil Nadu Forest Department vehicles from Theppakadu. Our taxi drops you at the reception center and your resort.',
      },
      {
        question: 'Does the route pass through Ooty?',
        answer:
          'Yes, the road from Coimbatore to Masinagudi and Mudumalai ascends via Mettupalayam and Ooty before descending to the northern foothills.',
      },
    ],
    relatedTourSlugs: ['coimbatore-to-ooty-taxi', 'topslip-taxi', 'coimbatore-to-chikmagalur-taxi'],
    relatedBlogSlugs: ['coimbatore-to-ooty-road-trip', 'weekend-getaways-from-coimbatore'],
  },
  {
    id: 'tour-topslip',
    slug: 'topslip-taxi',
    path: '/tours/topslip-taxi/',
    destinationName: 'Topslip (Anamalai Tiger Reserve)',
    shortTagline: 'Day-trip forest excursion via Pollachi & Sethumadai Checkpost',
    featuredOnHome: false,
    metaTitle: 'Coimbatore to Topslip Taxi | Pollachi & Anamalai Forest Trip | Yellow Go Taxi',
    metaDescription:
      'Plan a day trip or overnight taxi from Coimbatore to Topslip (Anamalai Tiger Reserve) and Pollachi. Clear road distance fare estimates and local route guidance.',
    h1: 'Coimbatore to Topslip & Pollachi Taxi Service',
    introParagraphs: [
      'Situated 76 km south of Coimbatore in the Anamalai Hills near Pollachi, Topslip is the primary visitor reception zone of the Anamalai Tiger Reserve—known for its teak forests, bamboo groves, and connection to the adjacent Parambikulam reserve.',
      'Because Topslip is less than 2.5 hours from Coimbatore, it works exceptionally well as a full-day Round Trip excursion combined with Aliyar Dam or Pollachi countryside stops.',
    ],
    imageFilename: 'tour-topslip.webp',
    imageAlt: 'Dense tropical forest canopy at Topslip Anamalai hills near Pollachi and Coimbatore',
    approxOneWayKm: 76,
    approxDriveTime: 'Approx. 2 to 2.5 hours',
    recommendedDuration: '1 Day (Same-Day Return) or 2 Days with Valparai',
    routeCorridor: 'NH83 via Kinathukadavu & Pollachi -> Anamalai & Sethumadai Checkpost',
    verificationNote:
      'Approximate distance (~76 km one-way). Forest entry permits and daytime gate hours are strictly enforced at Sethumadai Checkpost.',
    highlights: [
      {
        title: 'Topslip Forest Reception & Eco-Walks',
        description:
          'Forest Department interpretation center, guided treks, and official safari booking counter.',
      },
      {
        title: 'Anamalai Masani Amman Temple',
        description:
          'Revered temple in Anamalai town located directly along the Pollachi–Sethumadai approach road.',
      },
      {
        title: 'Aliyar Dam & Pollachi Countryside',
        description:
          'Easily combined on the return drive for an evening stroll by the reservoir garden.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Morning',
        title: 'Early Departure from Coimbatore to Sethumadai & Topslip',
        details:
          'Leave Coimbatore by 6:30 AM to reach Sethumadai Checkpost in the morning. Complete forest entry formalities and ascend through the shaded forest road to Topslip.',
      },
      {
        dayOrPhase: 'Afternoon',
        title: 'Anamalai Temple, Aliyar Dam & Return to Coimbatore',
        details:
          'Descend for lunch near Sethumadai or Anamalai, visit Masani Amman Temple and Aliyar Dam, and return to Coimbatore by evening.',
      },
    ],
    practicalInfo: [
      {
        label: 'Sethumadai Checkpost Hours',
        detail:
          'Entry into the Topslip forest road is permitted only during designated daytime hours (typically 6:00 AM to afternoon cutoff, subject to Forest Department rules).',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Ukkadam Bus Stand',
      drop: 'Topslip (Anamalai Tiger Reserve)',
      days: 1,
    },
    faqs: [
      {
        question: 'Can we visit Topslip and return to Coimbatore on the same day?',
        answer:
          'Yes. At roughly 76 km each way (~152 km round trip), Topslip is one of the most popular same-day nature road trips from Coimbatore.',
      },
      {
        question: 'Can we combine Topslip and Valparai in a 2-day trip?',
        answer:
          'Yes, both destinations are accessed via Pollachi. You can visit Topslip on Day 1 and ascend the 40 hairpin bends from Aliyar to Valparai for an overnight stay.',
      },
    ],
    relatedTourSlugs: [
      'coimbatore-to-valparai-taxi',
      'masinagudi-mudumalai-taxi',
      'palani-temple-taxi',
    ],
    relatedBlogSlugs: ['hidden-tourist-places-near-coimbatore', 'weekend-getaways-from-coimbatore'],
  },
  {
    id: 'tour-palani',
    slug: 'palani-temple-taxi',
    path: '/tours/palani-temple-taxi/',
    destinationName: 'Palani Murugan Temple',
    shortTagline: 'Comfortable pilgrimage taxi via Pollachi & Udumalpet highway',
    featuredOnHome: false,
    metaTitle: 'Coimbatore to Palani Temple Taxi | Same-Day & Drop Cab | Yellow Go Taxi',
    metaDescription:
      'Book a Coimbatore to Palani Temple taxi from Coimbatore Airport, Junction, or city homes. Smooth highway travel for family darshan trips.',
    h1: 'Coimbatore to Palani Temple Taxi Service',
    introParagraphs: [
      'Arulmigu Dhandayuthapani Swamy Temple in Palani—one of the revered Arupadaiveedu shrines of Lord Murugan—lies approximately 112 km southeast of Coimbatore across flat, well-connected plains highways.',
      'Yellow Go Taxi provides early-morning pilgrimage transfers from Coimbatore Airport, Railway Station, and city neighbourhoods, allowing families and senior citizens to complete their darshan comfortably and return the same day or continue onward to Kodaikanal or Madurai.',
    ],
    imageFilename: 'tour-palani.webp',
    imageAlt: 'Palani hill temple view on the Coimbatore to Palani temple taxi route',
    approxOneWayKm: 112,
    approxDriveTime: 'Approx. 2.5 to 3 hours',
    recommendedDuration: '1 Day (Same-Day Return) or Direct Drop',
    routeCorridor: 'NH83 via Kinathukadavu, Pollachi & Udumalpet to Palani',
    verificationNote:
      'Approximate distance (~112 km one-way). Temple darshan, winch, and rope-car timings are administered by the temple Devasthanam and vary on festival days.',
    highlights: [
      {
        title: 'Sivagiri Hill Main Shrine (Winch / Rope Car / Steps)',
        description:
          'Direct drop near the Giri Veedhi foothills perimeter with convenient access to winch and rope-car stations.',
      },
      {
        title: 'Thiru Avinankudi & Periyanayaki Amman Temples',
        description:
          'Important sub-shrines at the foothills and in Palani town easily covered with a dedicated waiting cab.',
      },
      {
        title: 'Smooth Plains Highway Drive',
        description:
          'Entirely flat highway corridor via Pollachi and Udumalpet, making it comfortable for elderly passengers.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Early Morning',
        title: '5:00 AM Pickup in Coimbatore & Drive to Palani',
        details:
          'Depart Coimbatore early to reach Palani foothills around 7:30–8:00 AM before peak midday crowds.',
      },
      {
        dayOrPhase: 'Midday & Return',
        title: 'Hill Shrine Darshan, Foothill Shrines & Return to Coimbatore',
        details:
          'Complete darshan at Sivagiri Hill and Thiru Avinankudi, pause for lunch, and return comfortably to Coimbatore by late afternoon.',
      },
    ],
    practicalInfo: [
      {
        label: 'Festival & Auspicious Days',
        detail:
          'During Thai Poosam, Panguni Uthiram, Vaikasi Visakam, and Krithigai days, local vehicle traffic around Giri Veedhi may be diverted to outer parking rings.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Gandhipuram Central Bus Stand',
      drop: 'Palani Arulmigu Dhandayuthapani Swamy Temple',
      days: 1,
    },
    faqs: [
      {
        question: 'Can we complete a Coimbatore to Palani temple trip in a single day?',
        answer:
          'Yes. Because the one-way drive is roughly 2.5 to 3 hours (~112 km), most families choose a 1-day Round Trip starting early in the morning and returning to Coimbatore by evening.',
      },
      {
        question: 'Can you pick us up at Coimbatore Airport and drop us at Palani?',
        answer:
          'Yes, select "Outstation Drop" in the booking form and choose Coimbatore International Airport (CJB) as your pickup point.',
      },
    ],
    relatedTourSlugs: [
      'coimbatore-to-kodaikanal-taxi',
      'isha-yoga-center-taxi',
      'topslip-taxi',
    ],
    relatedBlogSlugs: ['family-friendly-tourist-places-tamil-nadu', 'taxi-trip-checklist'],
  },
  {
    id: 'tour-chikmagalur',
    slug: 'coimbatore-to-chikmagalur-taxi',
    path: '/tours/coimbatore-to-chikmagalur-taxi/',
    destinationName: 'Chikmagalur (Karnataka)',
    shortTagline: 'Multi-day coffee highland expedition to Mullayanagiri & Baba Budangiri',
    featuredOnHome: false,
    metaTitle: 'Coimbatore to Chikmagalur Taxi Service | Multi-Day Tour Cab | Yellow Go Taxi',
    metaDescription:
      'Plan a multi-day road trip from Coimbatore to Chikmagalur, Mullayanagiri, and Belur-Halebidu with Yellow Go Taxi. Clear round-trip fare estimates.',
    h1: 'Coimbatore to Chikmagalur Taxi Service',
    introParagraphs: [
      'For travellers planning an extended 3-to-5 day outstation road trip from Coimbatore into Karnataka’s Malnad coffee highlands, Chikmagalur offers soaring mountain ridges at Mullayanagiri and Baba Budangiri alongside the Hoysala temple architecture of Belur and Halebidu.',
      'Yellow Go Taxi provides dedicated Round Trip vehicles and Outstation Drop transfers for groups and families embarking on this scenic interstate route.',
    ],
    imageFilename: 'tour-chikmagalur.webp',
    imageAlt: 'Coffee estates and mountain peaks of Chikmagalur on a multi-day tour from Coimbatore',
    approxOneWayKm: 388,
    approxDriveTime: 'Approx. 8 to 9.5 hours (route & break dependent)',
    recommendedDuration: '4 to 5 Days',
    routeCorridor: 'NH948 via Sathyamangalam (Dhimbam Ghat), Chamarajanagar, Mysuru Bypass & Hassan',
    verificationNote:
      'Approximate distance (~388 km one-way). Note: Night traffic regulations apply on the Dhimbam / Sathyamangalam Tiger Reserve highway section; Karnataka state entry permit applies.',
    highlights: [
      {
        title: 'Mullayanagiri & Baba Budangiri Peaks',
        description:
          'Karnataka’s highest mountain ridge with sweeping Western Ghats mist and trekking trails.',
      },
      {
        title: 'Belur & Halebidu Hoysala Temples',
        description:
          'Intricately carved 12th-century stone temples located directly along the Hassan–Chikmagalur belt.',
      },
      {
        title: 'Coffee Plantation Stays & Hebbe / Jhari Falls',
        description:
          'Lush Arabica and Robusta coffee estates and forest waterfalls around Kemmanagundi.',
      },
    ],
    suggestedItinerary: [
      {
        dayOrPhase: 'Day 1',
        title: 'Early Departure from Coimbatore to Chikmagalur via Mysuru & Hassan',
        details:
          'Start at 5:30 AM from Coimbatore to ascend Dhimbam Ghat in early morning daylight, continue past Mysuru ring road and Hassan, and check in at Chikmagalur by evening.',
      },
      {
        dayOrPhase: 'Day 2',
        title: 'Mullayanagiri, Seethalayyanagiri & Baba Budangiri Ridge',
        details:
          'Explore the high-altitude peaks, Jhari Falls (local jeep transfer required for last stretch), and Hirekolale Lake at sunset.',
      },
      {
        dayOrPhase: 'Day 3',
        title: 'Coffee Museum, Belur & Halebidu Heritage Circuit',
        details:
          'Visit the Coffee Yatra Museum, followed by guided visits to Chennakesava Temple (Belur) and Hoysaleswara Temple (Halebidu).',
      },
      {
        dayOrPhase: 'Day 4',
        title: 'Return Journey to Coimbatore',
        details:
          'Morning checkout and return highway drive to reach Coimbatore before evening checkpost cutoffs.',
      },
    ],
    practicalInfo: [
      {
        label: 'Dhimbam Ghat Daytime Window',
        detail:
          'The Sathyamangalam–Chamarajanagar forest section enforces night traffic restrictions. Plan departure and return times so you cross Dhimbam Ghat comfortably during daylight hours.',
      },
      {
        label: 'Karnataka State Permit',
        detail:
          'Interstate commercial permit fees and highway tolls are confirmed transparently before trip dispatch.',
      },
    ],
    bookingDefaults: {
      tripType: 'round_trip',
      pickup: 'Saravanampatti IT Park Corridor (CHIL SEZ)',
      drop: 'Chikmagalur & Mullayanagiri Foothills',
      days: 4,
    },
    faqs: [
      {
        question: 'How many days are recommended for a Coimbatore to Chikmagalur taxi tour?',
        answer:
          'Because the one-way road distance is roughly 388 km (8 to 9.5 hours of driving), we recommend a minimum of 4 days so you have two full days for sightseeing in Chikmagalur, Belur, and Halebidu.',
      },
      {
        question: 'Can we stop at Mysuru on the way to or from Chikmagalur?',
        answer:
          'Yes, Mysuru lies directly along the primary highway route between Coimbatore and Hassan/Chikmagalur. You can easily turn it into a 5-day Mysuru–Chikmagalur circuit.',
      },
    ],
    relatedTourSlugs: [
      'masinagudi-mudumalai-taxi',
      'coimbatore-to-ooty-taxi',
      'coimbatore-to-yercaud-taxi',
    ],
    relatedBlogSlugs: ['taxi-trip-checklist', 'best-hill-stations-near-coimbatore'],
  },
];

export function getTourBySlug(slug: string): TourPageData | undefined {
  return TOUR_PAGES.find((t) => t.slug === slug);
}
