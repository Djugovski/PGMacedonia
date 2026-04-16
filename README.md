# PG Macedonia (Vue 3 + Vite + Vuetify + i18n)

Rebuild of [pgmacedonia.mk](https://pgmacedonia.mk/) with English (default) and Macedonian (`/mk/...`), a small Node API for email + calendar state, and SEO-oriented meta (canonical, `hreflang`, FAQ page, JSON-LD, sitemap).

---

## Running locally (step by step)

### Prerequisites

- **Node.js 18+** (20 LTS recommended) — [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node)

Check versions:

```bash
node -v
npm -v
```

### 1. Install dependencies

From the project root (`PGMacedonia`):

```bash
npm install
```

### 2. Environment file (optional but recommended)

Copy the example env file and edit values:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

- **SMTP** (`SMTP_*`): leave empty to **log emails to the API terminal** instead of sending.
- **`CONTACT_TO_EMAIL`**: inbox for contact/calendar notifications.
- **`APP_PUBLIC_URL`**: use `http://localhost:5173` locally so calendar approval links in emails open your dev site.

### 3. Start the app (frontend + API)

The project expects **two processes**: Vite (UI) and Express (API). The default dev script runs both:

```bash
npm run dev
```

- **Website:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:8787](http://localhost:8787) (Vite proxies `/api/*` here automatically)

If port **8787** is already in use, set `API_PORT` in `.env` to another port and update `vite.config.ts` `server.proxy['/api'].target` to match.

### 4. Run UI and API separately (optional)

Use two terminals:

```bash
npm run dev:api
```

```bash
npm run dev:app
```

### 5. Production build (local check)

```bash
npm run build
npm run preview
```

`preview` serves only the static SPA — **API routes are not included**; use a real Node host or deploy the `server/` app separately.

### 6. Typecheck

```bash
npm run typecheck
```

API-only TypeScript (no emit):

```bash
npx tsc -p tsconfig.server.json
```

---

## Goals this repo is built around

| # | Goal | How it’s addressed |
|---|------|----------------------|
| 1 | **SEO** (paragliding / Macedonia) | Unique titles & descriptions per route, `hreflang`, canonical + `og:url`, optional `VITE_OG_IMAGE_URL`, **JSON-LD** (`SportsActivityLocation` + `WebSite`, **FAQPage** on `/faq`), **`public/sitemap.xml`**, natural keywords in copy (EN + MK). |
| 2 | **UI/UX** | Vuetify theme, clear hierarchy, FAQ accordions, hero + cards, **44px min button height** class, focus-visible outlines, reduced-motion respect. |
| 3 | **Contact email** | `POST /api/contact` composes HTML/text → `CONTACT_TO_EMAIL` (see `.env.example`). |
| 4 | **Responsive** | Vuetify grid (`v-container`, `v-row`/`v-col`), mobile nav drawer, fluid images in `main.scss`. |
| 5 | **Readable code** | Small views, composables (`usePageMeta`, `useStructuredData`), `src/config`, `src/content`, `src/i18n/locales`. |
| 6 | **Gallery** | `src/content/gallery.ts` + `resolveGallerySrc()` for WP uploads paths or full URLs; `VITE_GALLERY_BASE_URL` override. |
| 7 | **CMS-ready** | Editable **locale JSON** (`en`/`mk`), `siteConfig`, `galleryImages`, and FAQ items — swap for API/CMS later without restructuring routes. |
| 8 | **Components** | Layout, home, forms, calendar, FAQ panel reused on home + `/faq`. |
| 9 | **No user accounts** | No auth/DB in the SPA; calendar state is **`server/data/calendar.json`**. |

---

## Languages & URLs

- English: `/`, `/guiding`, `/faq`, `/calendar`, …
- Macedonian: `/mk`, `/mk/guiding`, `/mk/faq`, …
- Header **EN / MK** switches locale and keeps the same logical page.

Strings: `src/i18n/locales/en.json` and `mk.json`.

---

## Contact & calendar API

- **Contact:** `POST /api/contact` — payload shape in `src/services/contact.ts`.
- **Calendar:** `GET /api/calendar`, `POST /api/calendar/request`, `GET /api/calendar/confirm`, admin `POST /api/calendar/admin` — see previous sections in git history or server comments.

Without SMTP, the API **prints** email bodies to the terminal.

---

## Production checklist

- Set `APP_PUBLIC_URL=https://pgmacedonia.mk` (approval links).
- Set `CONTACT_TO_EMAIL` and SMTP (or relay).
- Build with `VITE_API_URL` if the API is on another origin.
- Optional: `VITE_OG_IMAGE_URL` (absolute URL to a ~1200px wide hero image).
- Host `public/sitemap.xml` at `https://pgmacedonia.mk/sitemap.xml` (already referenced in `robots.txt`).
- Serve **or** merge the Express app with static `dist` (single Node process), or host SPA and API separately.

---

## Project layout

| Path | Purpose |
|------|--------|
| `server/` | Express API, `calendar.json`, nodemailer |
| `src/i18n/locales/` | All UI + FAQ copy (EN/MK) |
| `src/content/` | Gallery list (CMS-friendly) |
| `src/config/site.ts` | Branding, URLs, OG image env |
| `src/composables/usePageMeta.ts` | Titles, canonical, hreflang, Open Graph |
| `src/composables/useStructuredData.ts` | JSON-LD |
| `public/sitemap.xml` | Static sitemap for crawlers |
