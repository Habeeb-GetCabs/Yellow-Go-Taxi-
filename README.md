# Yellow Go Taxi — Official Website Repository

Production-oriented, SEO-architected multi-page website for **Yellow Go Taxi**, a taxi and tour service planned for **Coimbatore, Tamil Nadu, India**.

---

## 1. Key Capabilities

- **34 Indexable Multi-Page Routes**: Full URL-based routing with static HTML prerendering (`scripts/prerender.ts`) generating dedicated `index.html` files for every route during `npm run build`.
- **4-Mode Isolated Fare Calculation Engine**:
  1. **Local Taxi**: `₹100 + (chargeableKm × ₹30)`
  2. **Hourly Rental**: `bookedHours × ₹350 + max(0, totalKm - bookedHours × 10) × ₹20`
  3. **Outstation Drop**: `oneWayDistanceKm × ₹30 + ₹400`
  4. **Round Trip**: `totalReturnTripDistanceKm × ₹14 + chargeableDays × ₹500`
  *(Internal breakdown rules are isolated in `src/config/fares.ts` and `src/utils/fareCalculator.ts` and never exposed on customer-facing UI).*
- **Address Autocomplete & Road Route Distance**: Built-in Coimbatore & South India verified road corridor network + OpenStreetMap OSRM driving route fallback (`src/utils/routingService.ts`), with a graceful "Request a Quote" workflow when a custom street address cannot be verified automatically.
- **WhatsApp Booking Integration**: URL-encoded WhatsApp booking workflow (`src/utils/whatsapp.ts`) that includes only fields relevant to the selected trip type and the final estimated fare.
- **Strict Image Placeholder System**: Zero AI-generated or external stock images. Every visual slot uses `<AssetImage />` mapped to `public/images/` via `src/data/assetManifest.ts` and `IMAGE-ASSETS.md`.

---

## 2. Local Development, Testing & Build

```bash
# 1. Install dependencies
npm install

# 2. Start local development server on port 3000
npm run dev

# 3. Run unit tests (Fare calculator, boundary cases, WhatsApp URL builder, Routing service)
node --test src/utils/fareCalculator.test.ts

# 4. Type-check and lint
npm run lint

# 5. Build production bundle + prerender all 34 routes into static HTML
npm run build
```

---

## 3. Configuring Business Details (Phone, WhatsApp, Address, Hours)

Open `src/config/business.ts` (or set environment variables in `.env` based on `.env.example`):

```ts
export const business: BusinessConfig = {
  name: 'Yellow Go Taxi',
  legalEntityName: 'Yellow Go Taxi',
  phone: '+91 XXXXX XXXXX',        // Add confirmed phone number here
  whatsapp: '91XXXXXXXXXX',        // Add confirmed WhatsApp number (with country code)
  email: 'bookings@yellowgotaxi.com',
  address: 'Your confirmed street address, Coimbatore, Tamil Nadu',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  locationConfirmed: true,         // Set to true once Coimbatore address is finalized
  operatingHours: '24/7 Dispatch', // Set confirmed operating hours
  websiteUrl: 'https://yellowgotaxi.com',
};
```

As soon as `phone` and `whatsapp` are populated, the top bar, header, footer, floating WhatsApp CTA, and booking form "Book This Trip on WhatsApp" button automatically activate live links across the entire site.

---

## 4. Configuring Tariffs & Analytics

- **Tariffs**: Edit `src/config/fares.ts` and `DEFAULT_TARIFF_RULES` in `src/utils/fareCalculator.ts`.
- **GA4 & Google Ads**: Set `VITE_GA4_MEASUREMENT_ID`, `VITE_GOOGLE_ADS_CONVERSION_ID`, and conversion labels in `.env` or `src/config/analytics.ts`.
- **Images**: Follow `IMAGE-ASSETS.md` and upload `.webp`, `.svg`, `.png`, and `.ico` files into `public/images/`.

---

## 5. GitHub Export & Deployment Instructions

1. Push the repository to GitHub (`git push origin main`).
2. Connect the GitHub repository to Cloudflare Pages, Vercel, Netlify, or GitHub Pages:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Upload final brand and photography assets to `public/images/` as documented in `IMAGE-ASSETS.md`.
