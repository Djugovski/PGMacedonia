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
| 6 | **Gallery** | Local images in `public/gallery/` — listed in `src/content/gallery.ts`. Override the base with `VITE_GALLERY_BASE_URL` only if you migrate to a CDN. |
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
- Build with `VITE_API_URL` **only if** the API lives on a different origin (see deployment options below).
- Optional: `VITE_OG_IMAGE_URL` (absolute URL to a ~1200px wide hero image).
- Host `public/sitemap.xml` at `https://pgmacedonia.mk/sitemap.xml` (already referenced in `robots.txt`).
- Serve **or** merge the Express app with static `dist` (single Node process), or host SPA and API separately.

---

## Deployment

The repo produces **two artifacts**:

| Artifact | Build command | Output |
|----------|---------------|--------|
| **Frontend (SPA)** | `npm run build` | `dist/` — static HTML/JS/CSS + `.htaccess` |
| **Backend (API)** | `npm run build:server` | `dist-server/index.cjs` — single-file bundled Node server |

Build both at once:

```bash
npm run build:all
```

### Frontend — upload `dist/` to your current host (LiteSpeed / cPanel)

The `dist/` folder is self-contained. Upload everything inside it (including the
shipped `.htaccess`) to the domain's public root on cPanel (`public_html/`).
The `.htaccess` already handles:

- SPA history-mode fallback → fixes `/paragliding-macedonia` and any other deep link that currently 404s
- Pass-through for `/api/*` (so the backend routing below keeps working)
- Force HTTPS, sensible cache headers, gzip compression, basic security headers

No file in `dist/` needs a separate configuration — just upload and you're done.

### Backend — pick **one** of the three options

The frontend services call `/api/*` on the same origin by default, so no
`VITE_API_URL` is needed as long as `/api/*` is routed to Node.

#### Option A — cPanel "Setup Node.js App" (same host, zero extra services)

Recommended if you're staying on LiteSpeed/cPanel (which the current host is):

1. Upload the repo to a folder outside `public_html/`, e.g. `~/pg-api` (via the cPanel File Manager or SSH/git).
2. cPanel → **Setup Node.js App** → **Create Application**:
   - Node version: **20** or newer
   - Application mode: **Production**
   - Application root: `/home/<user>/pg-api`
   - Application URL: `/api` (so it's served as `https://pgmacedonia.mk/api/*`)
   - Startup file: **`app.js`**
3. In the same panel, set **Environment Variables**:
   ```
   NODE_ENV              production
   API_PATH_PREFIX       /            ← important: Passenger already strips /api
   TRUST_PROXY           true
   APP_PUBLIC_URL        https://pgmacedonia.mk
   CALENDAR_DATA_FILE    /home/<user>/pg-api/data/calendar.json
   CONTACT_TO_EMAIL      <your inbox>
   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
   CALENDAR_ADMIN_SECRET <any long random string>
   ```
4. Click **Run NPM Install**, then open the cPanel terminal:
   ```bash
   cd ~/pg-api
   npm run build:server
   ```
5. Click **Restart** in the Node.js Selector.

That's it — `https://pgmacedonia.mk/api/health` should return `{"ok":true}`.

#### Option B — Render.com (free tier, auto-deploy from GitHub)

1. Push this repo to GitHub.
2. Go to [Render Dashboard → Blueprints](https://dashboard.render.com/blueprints), point at the repo. Render reads `render.yaml` and creates the service automatically.
3. In the Render service dashboard, set the secret env vars (SMTP, admin secret).
4. In your frontend build, set `VITE_API_URL=https://pgmacedonia-api.onrender.com` (or whatever Render assigns), then rebuild `dist/` and re-upload. CORS on the backend already allows `pgmacedonia.mk`.

Free tier spins down after 15 min of idleness — first request after that has a ~30s cold start. Fine for a low-traffic booking site.

#### Option C — Docker (any container host: Fly, Railway, Hetzner, AWS, …)

```bash
docker build -t pgmacedonia-api .
docker run -p 8787:8787 \
  -v pgmacedonia-data:/app/data \
  -e SMTP_HOST=… -e SMTP_USER=… -e SMTP_PASS=… \
  -e APP_PUBLIC_URL=https://pgmacedonia.mk \
  pgmacedonia-api
```

Mount `/app/data` to a volume so the calendar JSON persists across restarts.

### Nextcloud-powered gallery (zero-deploy photo/video uploads)

The gallery on `/gallery` can be backed by a public share on your Nextcloud
instance (`cloud.pgmacedonia.mk`). Upload a photo or video to the shared
folder → it shows up on the live site within ~5 minutes, **no redeploy**.

**Setup**

1. Create a folder in Nextcloud (e.g. `Gallery`), share it as a public link.
   – Permission: "View only" is enough for the site (no upload/edit needed).
   – Leave the password empty unless you explicitly want a gated gallery.
2. Copy the share URL (looks like `https://cloud.pgmacedonia.mk/index.php/s/XXXXXXXX`).
3. Set `NEXTCLOUD_SHARE_URL=<that url>` in the backend env (cPanel / Render / Docker — wherever the API runs).
4. Restart the API.

**How it works**

- Backend hits Nextcloud's `PROPFIND /public.php/dav/files/{token}/` to list files.
- For every image/video it builds anonymous, direct URLs:
  - `…/index.php/apps/files_sharing/publicpreview/{token}?file=/name.jpg&x=800…` — grid thumbnails
  - `…/index.php/apps/files_sharing/publicpreview/{token}?file=/name.jpg&x=2000…` — lightbox preview
  - `…/index.php/s/{token}/download?path=/&files=name.jpg` — full-res download / video source
- The list is cached in memory for 5 minutes; `GET /api/gallery` is cheap.
- Captions = the filename, prettified (`IMG_2024-ohrid-sunset.jpg` → *"IMG 2024 Ohrid Sunset"*).
  To override, drop a `captions.json` into the share root:
  ```json
  { "IMG_2024-ohrid-sunset.jpg": "Sunset tandem above Lake Ohrid" }
  ```
- Need an instant refresh (don't want to wait for the TTL)?
  ```bash
  curl -X POST \
    -H "x-calendar-admin-secret: <CALENDAR_ADMIN_SECRET>" \
    https://pgmacedonia.mk/api/gallery/refresh
  ```

**Fallback**

If `NEXTCLOUD_SHARE_URL` isn't set, or Nextcloud is unreachable, or the share
is empty, the SPA transparently falls back to the bundled images in
`public/gallery/` — the page never looks broken.

### Quick self-test after deploy

```bash
# These should all return 200:
curl https://pgmacedonia.mk/paragliding-macedonia  # SPA fallback
curl https://pgmacedonia.mk/gallery/01.jpg          # local gallery image
curl https://pgmacedonia.mk/api/health              # backend is reachable
curl "https://pgmacedonia.mk/api/calendar?year=2026&month=5"
curl "https://pgmacedonia.mk/api/gallery"                    # Nextcloud-backed list
```

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
