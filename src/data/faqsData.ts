export interface FaqItem {
  category: 'booking' | 'fares' | 'tours' | 'policies';
  question: string;
  answer: string;
}

export const GENERAL_FAQS: FaqItem[] = [
  {
    category: 'booking',
    question: 'What types of taxi services does Yellow Go Taxi offer in Coimbatore?',
    answer:
      'We offer four distinct booking modes tailored to your travel requirements: Local Taxi (point-to-point city transfers), Hourly Rental (flexible multi-stop city packages), Outstation Drop (direct point-to-point intercity drops), and Round Trip (return journeys and multi-day hill station tours).',
  },
  {
    category: 'fares',
    question: 'How is the estimated trip fare calculated on the website?',
    answer:
      'When you enter your pickup location, destination, and trip type (plus rental hours or trip days where applicable), our fare estimator calculates the road route distance in kilometres and applies our configured tariff for that trip mode to show a single upfront estimated fare.',
  },
  {
    category: 'booking',
    question: 'Is my booking automatically confirmed when I click "Book This Trip on WhatsApp"?',
    answer:
      'No. Clicking the WhatsApp booking button opens a pre-filled enquiry message with your trip details and estimated fare. A booking is confirmed only after our team verifies vehicle availability, route specifics, and final booking details with you.',
  },
  {
    category: 'fares',
    question: 'What happens if the route calculator cannot find my exact street address?',
    answer:
      'We never guess or invent a price from arbitrary distances. If your exact custom address cannot be resolved automatically, you can either select the nearest major Coimbatore hub from the autocomplete list for an approximate estimate, or submit a direct "Request a Quote" enquiry so we can calculate the exact route manually.',
  },
  {
    category: 'fares',
    question: 'Are highway tolls, parking fees, and interstate permits included in the online fare estimate?',
    answer:
      'The online fare estimator calculates the trip fare based on route distance and duration. Actual highway tolls, airport/hotel parking charges, forest checkpost fees, and interstate permits (for Kerala or Karnataka trips) depend on the specific route taken and are communicated transparently before trip confirmation.',
  },
  {
    category: 'tours',
    question: 'Which outstation tour destinations can I book from Coimbatore?',
    answer:
      'We cover all major destinations accessible from Coimbatore, including Ooty, Kodaikanal, Isha Yoga Center, Valparai, Munnar, Yercaud, Masinagudi & Mudumalai, Topslip, Palani Temple, and Chikmagalur. Each destination has a dedicated route guide on our website.',
  },
  {
    category: 'policies',
    question: 'How do I modify or cancel a requested trip?',
    answer:
      'You can request schedule adjustments or cancellations by contacting us through the same communication channel used for your booking confirmation. Please review our Cancellation & Refund Policy page for details on configurable policy terms.',
  },
];
