# Vendor PWA — Setup, Build & Deploy

How to install, run, configure, and deploy the astrologer (vendor) PWA. This is a Vite + React 19 SPA; no
TypeScript and no test suite are present.

---

## Prerequisites

- **Node.js** ≥ 20 LTS and **npm** ≥ 10 (Vite 8 / React 19 / Tailwind 4 require a modern Node).
- A reachable **backend** — by default the live one at `https://zodimithra.howincloud.com/api`. You do **not**
  need to run the backend locally unless you switch the base URL (see below).
- Internet access at runtime: Google Fonts (`index.html`), the Reverb WebSocket, and — for several tools —
  OpenStreetMap **Nominatim** and **timeapi.io**.

---

## Install & run

```bash
npm install
npm run dev        # Vite dev server with HMR (default http://localhost:5173)
```

### Scripts (`package.json`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Dev server with hot-module reload. |
| `npm run build` | `vite build` | Production build → `dist/`. |
| `npm run preview` | `vite preview` | Serve the built `dist/` locally to sanity-check the prod bundle. |
| `npm run lint` | `eslint .` | Lint the whole project (config in `eslint.config.js`). |

Vite config (`vite.config.js`) is minimal: the React plugin (`@vitejs/plugin-react`) and the Tailwind v4 Vite
plugin (`@tailwindcss/vite`). There is no proxy, alias, or custom server config.

---

## Configuration

> **There is no `.env` file or `import.meta.env` usage.** All hosts and keys are hardcoded constants in source.
> Changing environments means editing these files (and rebuilding).

### API base URL — `src/redux/api/baseApi.js`
```js
const isLocal = false;                                  // flip to use the .test backend
const BASE_URL = isLocal
  ? 'http://zodiminds-backend.test/api'
  : 'https://zodimithra.howincloud.com/api';            // default (production)
```
This URL backs all RTK Query slices (auth, chat, live, tools, user). Auth is Laravel Sanctum: the bearer token
from `state.auth.token` is attached to every request, with `Accept: application/json`.

### WebSocket (Reverb) — `src/config/echo.js`
```js
const isLocal = false;
const apiUrl  = 'https://zodimithra.howincloud.com/api';      // used for /broadcasting/auth
// Echo config:
broadcaster : 'reverb'
key         : 'cglzdl6g3q34q1h4tnch'                          // public app key
wsHost      : 'zodireverb.howincloud.com'                     // (isLocal → hostname of apiUrl)
wsPort/wssPort : 443                                          // (isLocal → 8080)
forceTLS    : true                                            // (isLocal → false)
```
Channel auth POSTs to `${apiUrl}/broadcasting/auth` with the bearer token.

### Hardcoded backend references to know about
- **Media/storage:** `https://zodimithra.howincloud.com/storage/...` for customer avatars
  (`components/IncomingRequests/IncomingRequests.jsx`, `components/RequestCard/RequestCard.jsx`).
- **Audio-call force-end:** a direct `fetch` to
  `https://zodimithra.howincloud.com/api/astrologer/chat-request/{id}/end-video`
  in `pages/AudioCall/AudioCall.jsx` (note: this URL is **not** driven by `baseApi`, so it must be updated
  separately if the backend host changes).
- **External services (no key needed):** OpenStreetMap Nominatim (birthplace/city autocomplete across most
  tools) and `timeapi.io` (Atlas + Daylight Saving).

### Switching to a local backend
1. Set `isLocal = true` in `src/redux/api/baseApi.js` and `src/config/echo.js`.
2. Update the hardcoded URLs listed above to your host.
3. Ensure the backend's CORS allows this app's origin.

### Native-shell flag — `src/context/NativeAppContext.jsx`
`SHOW_PAYMENTS_ON_IOS = false` hides payment UI on iOS (App-Store review compliance). Set it to `true` to show
payments on iOS once approved. Outside the native app, payments always show.

---

## Browser storage used

| Key | Store | Set by | Purpose |
|---|---|---|---|
| `token` | localStorage | `authSlice.setToken` / Otp login | Sanctum bearer token; seeds auth state on reload. |
| `onboardingCompleted` | localStorage | Otp, Onboarding, ProtectedRoute | Gates the onboarding redirect. Cleared on logout. |
| `sessionLoaded` | sessionStorage | Onboarding | One-time onboarding-complete marker. |

`logout()` removes `token` and `onboardingCompleted`.

---

## Build & deploy

```bash
npm run build       # → dist/
npm run preview     # optional local check of the production bundle
```

- Output is a static SPA in `dist/`. Deploy it to any static host / CDN.
- **SPA routing:** React Router uses `BrowserRouter` (clean URLs, no hash). Configure the host to **rewrite all
  paths to `/index.html`** so deep links like `/messages/chat/12` or `/kundli-matching` resolve on refresh.
- **Production target:** `https://zodimithra-vendor.howincloud.com`.
- The [vendor native app](../../zodimithra-vendor-app) loads this deployed URL inside its WebView, so a web
  deploy updates the in-app content too (alongside any native OTA bundles).

A prebuilt `dist.zip` exists at the repo root as a convenience artifact; prefer a fresh `npm run build`.

---

## Notes & gotchas

- **CORS:** the backend must allow this app's origin (both the dev origin and the production domain).
- **Autoplay:** the incoming-call ringtone (`public/phonering.mp3`) may be blocked until the user interacts
  with the page; the visual modal still appears.
- **iframe permissions:** Live/Video/Audio embeds need `camera`/`microphone`/`autoplay` permissions, which the
  host page / WebView must allow.
- **Fonts:** loaded from Google Fonts via `index.html`; offline/blocked environments fall back to system fonts.
- **No env switching:** because hosts are hardcoded, "staging vs prod" requires code edits + a rebuild, not env
  vars.

See [OVERVIEW.md](./OVERVIEW.md) for architecture and the store/endpoint tables, and [FEATURES.md](./FEATURES.md)
for the route table and per-page behavior.
