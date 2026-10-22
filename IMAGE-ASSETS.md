# Yellow Go Taxi — Image Asset Manifest & Upload Workflow (`IMAGE-ASSETS.md`)

All visual slots across the Yellow Go Taxi website use intentional, aspect-ratio-locked image placeholders (`<AssetImage />`) that reference exact paths in `public/images/`.

No AI-generated images, stock photographs, Unsplash URLs, or base64 images are embedded in the codebase. When the website owner uploads the final photographs and brand icons into `public/images/` using the exact filenames documented below, the website will automatically render them with zero layout shift (CLS = 0) and without requiring any code edits.

---

## 1. Brand & Favicon Assets

| Filename | Exact Repository Path | Where It Appears | Recommended Size | Aspect Ratio | Format | Critical to Initial Render | Suggested Subject & Alt-Text Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `yellow-go-taxi-logo.svg` | `public/images/yellow-go-taxi-logo.svg` | Global Header & Footer | `220 × 48` | `11:2.4` | SVG | Yes | Horizontal Yellow Go Taxi wordmark in `#F5C518` and `#101820`. Alt: `"Yellow Go Taxi logo"` |
| `favicon.svg` | `public/images/favicon.svg` | `<head>` vector icon | `64 × 64` | `1:1` | SVG | No | Square vector monogram on `#F5C518` background. |
| `favicon.ico` | `public/images/favicon.ico` | `<head>` legacy favicon | `32 × 32` | `1:1` | ICO | No | Multi-size 16×16 and 32×32 ICO file. |
| `favicon-32x32.png` | `public/images/favicon-32x32.png` | `<head>` & `site.webmanifest` | `32 × 32` | `1:1` | PNG | No | 32×32 PNG brand icon. |
| `apple-touch-icon.png` | `public/images/apple-touch-icon.png` | `<head>` iOS icon & manifest | `180 × 180` | `1:1` | PNG | No | 180×180 PNG brand icon with solid background. |

---

## 2. Homepage & Taxi Service Assets

| Filename | Exact Repository Path | Where It Appears | Recommended Size | Aspect Ratio | Format | Critical to Initial Render (LCP) | Suggested Image Subject | Alt-Text Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero-suv.webp` | `public/images/hero-suv.webp` | Homepage Hero (`/`) | `1600 × 900` | `16:9` | WebP | **Yes (LCP — eager loaded)** | Clean premium SUV or touring sedan on a Western Ghats highway near Coimbatore | `"Yellow Go Taxi premium touring vehicle on a highway near Coimbatore"` |
| `service-local.webp` | `public/images/service-local.webp` | Homepage Services & `/services/local-taxi/` | `800 × 600` | `4:3` | WebP | No (lazy) | City sedan on a tree-lined Coimbatore avenue | `"Local city taxi service in Coimbatore for point-to-point urban travel"` |
| `service-hourly.webp` | `public/images/service-hourly.webp` | Homepage Services & `/services/hourly-rental/` | `800 × 600` | `4:3` | WebP | No (lazy) | Chauffeur-driven cab parked outside a business district in Coimbatore | `"Flexible hourly taxi rental package in Coimbatore for multi-stop city errands and business meetings"` |
| `service-outstation.webp` | `public/images/service-outstation.webp` | Homepage Services & `/services/outstation-drop/` | `800 × 600` | `4:3` | WebP | No (lazy) | Touring cab on a Tamil Nadu four-lane highway | `"Outstation drop taxi from Coimbatore to destinations across Tamil Nadu, Kerala, and Karnataka"` |
| `service-round-trip.webp` | `public/images/service-round-trip.webp` | Homepage Services & `/services/round-trip/` | `800 × 600` | `4:3` | WebP | No (lazy) | Family SUV at a hill-station viewpoint during a multi-day tour | `"Multi-day round-trip taxi service from Coimbatore for family holidays and hill station tours"` |
| `why-choose-us.webp` | `public/images/why-choose-us.webp` | Homepage Trust Section & `/about/` | `1000 × 750` | `4:3` | WebP | No (lazy) | Clean, well-maintained vehicle cabin and pre-trip inspection | `"Clean, comfortable interior of a Yellow Go Taxi vehicle prepared for passenger travel"` |
| `travel-cta-banner.webp` | `public/images/travel-cta-banner.webp` | Homepage Final Booking CTA | `1600 × 700` | `16:7` | WebP | No (lazy) | Wide panoramic ghat road in the Nilgiris at golden hour | `"Scenic mountain road leading from Coimbatore to Western Ghats hill stations"` |

---

## 3. Ten Dedicated Tour Landing Page Assets

| Filename | Exact Repository Path | Where It Appears | Recommended Size | Aspect Ratio | Format | Critical to Homepage Render | Suggested Image Subject | Alt-Text Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `tour-ooty.webp` | `public/images/tour-ooty.webp` | `/tours/coimbatore-to-ooty-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Nilgiri tea estates and misty hills in Ooty | `"Scenic tea gardens and misty hills in Ooty on the Coimbatore to Ooty taxi route"` |
| `tour-kodaikanal.webp` | `public/images/tour-kodaikanal.webp` | `/tours/coimbatore-to-kodaikanal-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Star-shaped Kodaikanal Lake and Coaker’s Walk valley | `"Kodaikanal Lake and misty valleys accessible by Coimbatore to Kodaikanal taxi"` |
| `tour-isha-yoga.webp` | `public/images/tour-isha-yoga.webp` | `/tours/isha-yoga-center-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Velliangiri foothills and Adiyogi approach | `"Velliangiri hills backdrop at Isha Yoga Center near Coimbatore"` |
| `tour-valparai.webp` | `public/images/tour-valparai.webp` | `/tours/coimbatore-to-valparai-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | 40 hairpin bends overlooking Aliyar Reservoir | `"Aliyar Dam viewpoint and hairpin bends on the Coimbatore to Valparai taxi drive"` |
| `tour-munnar.webp` | `public/images/tour-munnar.webp` | `/tours/coimbatore-to-munnar-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Rolling emerald tea plantations in Munnar | `"Rolling tea hills in Munnar visited via Coimbatore to Munnar outstation taxi"` |
| `tour-yercaud.webp` | `public/images/tour-yercaud.webp` | `/tours/coimbatore-to-yercaud-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Yercaud Lake and coffee estates in the Shevaroy Hills | `"Shevaroy Hills and Yercaud Lake on the Coimbatore to Yercaud tour"` |
| `tour-masinagudi-mudumalai.webp` | `public/images/tour-masinagudi-mudumalai.webp` | `/tours/masinagudi-mudumalai-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Forest corridor in Masinagudi and Mudumalai | `"Forest road through Mudumalai and Masinagudi wildlife corridor from Coimbatore"` |
| `tour-topslip.webp` | `public/images/tour-topslip.webp` | `/tours/topslip-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Canopy forest road at Topslip (Anamalai Tiger Reserve) | `"Dense tropical forest canopy at Topslip Anamalai hills near Pollachi and Coimbatore"` |
| `tour-palani.webp` | `public/images/tour-palani.webp` | `/tours/palani-temple-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Sacred Sivagiri hill view of Palani Murugan Temple | `"Palani hill temple view on the Coimbatore to Palani temple taxi route"` |
| `tour-chikmagalur.webp` | `public/images/tour-chikmagalur.webp` | `/tours/coimbatore-to-chikmagalur-taxi/` & Tour Cards | `900 × 650` | `18:13` | WebP | No (lazy) | Mullayanagiri ridge and coffee estates of Chikmagalur | `"Coffee estates and mountain peaks of Chikmagalur on a multi-day tour from Coimbatore"` |

---

## 4. Ten Dedicated Blog Article Assets

| Filename | Exact Repository Path | Where It Appears | Recommended Size | Aspect Ratio | Format | Critical to Homepage Render | Suggested Image Subject | Alt-Text Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `blog-hidden-places-coimbatore.webp` | `public/images/blog-hidden-places-coimbatore.webp` | `/blog/hidden-tourist-places-near-coimbatore/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Quiet reservoir and Western Ghats foothills near Coimbatore | `"Quiet nature viewpoint in the Western Ghats foothills near Coimbatore"` |
| `blog-best-time-ooty.webp` | `public/images/blog-best-time-ooty.webp` | `/blog/best-time-to-visit-ooty/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Morning sunlight over Ooty botanical gardens | `"Clear morning skies over Ooty hills during peak sightseeing season"` |
| `blog-weekend-getaways.webp` | `public/images/blog-weekend-getaways.webp` | `/blog/weekend-getaways-from-coimbatore/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Scenic highway departing Coimbatore toward hill stations | `"Scenic weekend highway getaway departing from Coimbatore toward the Western Ghats"` |
| `blog-valparai-guide.webp` | `public/images/blog-valparai-guide.webp` | `/blog/valparai-travel-guide/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Tea estates and Sholayar Dam backwaters in Valparai | `"Valparai tea estates and Sholayar reservoir in the Anamalai hills"` |
| `blog-isha-yoga-guide.webp` | `public/images/blog-isha-yoga-guide.webp` | `/blog/isha-yoga-center-travel-guide/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Approach road to Velliangiri foothills at Isha Yoga Center | `"Peaceful walkway with Velliangiri hills at Isha Yoga Center near Coimbatore"` |
| `blog-family-tourist-places.webp` | `public/images/blog-family-tourist-places.webp` | `/blog/family-friendly-tourist-places-tamil-nadu/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Lakeside promenade and botanical park in Tamil Nadu | `"Family-friendly lakeside park and hill station walkway in Tamil Nadu"` |
| `blog-ooty-road-trip.webp` | `public/images/blog-ooty-road-trip.webp` | `/blog/coimbatore-to-ooty-road-trip/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Hairpin bends on the Mettupalayam–Coonoor–Ooty ghat road | `"Winding mountain road between Mettupalayam, Coonoor, and Ooty"` |
| `blog-monsoon-travel-tips.webp` | `public/images/blog-monsoon-travel-tips.webp` | `/blog/monsoon-travel-tips/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Rain-washed Western Ghats highway with mist | `"Mist-covered Western Ghats road during the South India monsoon season"` |
| `blog-hill-stations-near-coimbatore.webp` | `public/images/blog-hill-stations-near-coimbatore.webp` | `/blog/best-hill-stations-near-coimbatore/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Panoramic view of Nilgiri and Anamalai mountain ranges | `"Panoramic mountain vistas across hill stations surrounding Coimbatore"` |
| `blog-travel-checklist.webp` | `public/images/blog-travel-checklist.webp` | `/blog/taxi-trip-checklist/` | `1200 × 800` | `3:2` | WebP | No (lazy) | Neatly packed road-trip luggage ready for an outstation taxi journey | `"Organized travel luggage and road-trip essentials for an outstation taxi booking"` |

---

## 5. How to Upload Images via GitHub

1. Export/compress your photographs as `.webp` files at the recommended dimensions above (aim for `< 150 KB` for cards and `< 280 KB` for `hero-suv.webp`).
2. Place the files inside the `public/images/` folder in your GitHub repository using the **exact** filenames listed above.
3. Commit and push to your `main` branch. No component edits are needed—the `<AssetImage />` component automatically detects and displays the uploaded image file.
4. In production builds (`VITE_ASSET_DEBUG="false"` or omitted), missing images fall back to a clean neutral/yellow-tinted architectural surface without exposing internal filenames.
