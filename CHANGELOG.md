# Changelog

All notable changes to **PG Macedonia** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versioning rules for this site:

- **MAJOR** — breaking content structure change (e.g. route renames that would invalidate external links).
- **MINOR** — new public pages, new functionality, backwards-compatible data model changes.
- **PATCH** — copy polish, image swaps, bug fixes, dependency bumps.

The build embeds the current version into `__APP_VERSION__` and renders it in the
footer as `v<semver>` so you can verify at a glance which build is live.

---

## [1.2.0] — 2026-04-19

### Changed

- **Reverted the captcha back to an in-house math captcha.** Cloudflare
  Turnstile (widget + server verifier + dashboard keys) was removed to
  simplify the stack while other priorities are in flight. Forms now show a
  small `"What is 7 × 4?"` field with a refresh button; the server
  re-evaluates the question in `server/captcha.ts` so stripping or faking
  the fields is detected. No keys are required and there are no third-party
  network calls during submission.

### Removed

- `server/turnstile.ts` and `src/components/forms/TurnstileWidget.vue`.
- Env vars `TURNSTILE_SECRET_KEY` and `VITE_TURNSTILE_SITE_KEY` — dropped
  from `.env`, `.env.example`, `render.yaml`, `Dockerfile` docs,
  `app.js`, and `README.md`.
- Unused `clientIp()` helper in `server/index.ts` (it only fed Turnstile).

---

## [1.1.0] — 2026-04-19

### Added

- **Gallery pagination.** The grid now shows 21 photos per page on desktops
  (3 × 7), 16 on tablets, 12 on phones, with a Vuetify `v-pagination` control
  underneath and an "Showing x–y of N" summary. The lightbox keeps the full
  set so arrow-key navigation works across pages.
- **Build version surfaced in the UI.** `vite.config.ts` reads the version
  from `package.json` at build time and exposes it as `__APP_VERSION__`;
  the footer prints `v<semver>` in subtle text so support can quickly verify
  deployments.
- **CHANGELOG.md** (this file).

### Changed

- **Language switcher hidden.** While the Macedonian copy is being polished by
  a native speaker, the site is English-only in the UI. The switcher was
  removed from both the desktop header and the mobile drawer; the `/mk/*`
  routes and translations remain intact for a future toggle-back.

### Notes for operators

- Bump the patch version whenever you push new copy or swap images; bump the
  minor when adding a new landing page or feature.
- Run `npm run build:all` to produce both the static SPA (`dist/`) and the
  bundled API (`dist-server/index.cjs`). Each build gets a fresh
  `__APP_BUILD_TIME__` timestamp so you can diff deployments.

---

## [1.0.1] — 2026-04

### Added

- **Nextcloud-powered gallery.** Backend lists `NEXTCLOUD_SHARE_URL` via WebDAV,
  caches the result for 5 minutes, and exposes `GET /api/gallery`. Frontend
  renders images and videos from the API with automatic fallback to the
  bundled `public/gallery/` images when the share is unavailable.
- **SEO landing pages.** `/paragliding-macedonia`, `/paragliding-ohrid`,
  `/paragliding-krusevo`, `/paragliding-season-macedonia` with dedicated
  schema.org markup and internal linking from the footer.
- **Cloudflare Turnstile** on all forms, replacing the previous math captcha.
  Server verifies tokens server-side via `server/turnstile.ts`.
- **Zod input validation** on every `POST /api/*` endpoint.
- **`express-rate-limit`** with a per-IP budget for the contact + calendar
  endpoints.
- **Deployment artifacts:** `Dockerfile`, `render.yaml`, `app.js` for
  cPanel Node.js Selector, and `scripts/build-server.mjs` to bundle the API
  into a single CommonJS file via esbuild.

### Changed

- **Tandem navigation** consolidated under one `Tandem` menu with hover
  sub-items for Ohrid and Krušеvo.
- **Guiding + Calendar merged** into one `/guiding` page.
- **Copy** rewritten across Guiding and the home slider; Macedonian polished
  toward native-speaker tone (still in review).

### Security

- Tightened CORS to an explicit allow-list with `EXTRA_CORS_ORIGINS` escape hatch.
- Reduced the JSON body size limit.
- Added `TRUST_PROXY` knob so rate limiting sees real client IPs behind a CDN.

---

## [1.0.0] — Initial launch

- First public build of `pgmacedonia.mk` (Vue 3 + Vuetify 3 SPA, Express API).
