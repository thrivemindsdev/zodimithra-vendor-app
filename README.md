# Zodimithra Vendor PWA

The vendor-facing **Progressive Web App** for Zodimithra — used by astrologers (and other vendors) to take
chat / audio / video consultations, broadcast live, manage bookings and earnings, edit their profile, and run
~20 professional Vedic astrology calculation and reference tools. It runs in the browser **and** inside the
[vendor native app](../zodimithra-vendor-app) WebView shell, which it detects at runtime to adjust layout and
feature flags.

> Part of the [Zodimithra platform](../README.md). Talks to [`zodimithra-backend`](../zodimithra-backend).

---

## Tech stack

- **React 19** + **Vite 8** (JavaScript/JSX, no TypeScript)
- **Redux Toolkit + RTK Query** for state and data fetching (`react-redux` 9)
- **React Router DOM v7** with `ProtectedRoute` / `PublicRoute` guards
- **Tailwind CSS v4** (`@tailwindcss/vite`) + **Framer Motion**
- **Laravel Echo + Pusher JS** over a self-hosted **Reverb** WebSocket (real-time chat & incoming calls)
- **Embedded LiveKit "Meet" rooms** (iframe) for audio/video consultations & live broadcast
- **jsPDF + html2canvas** for PDF export (Astro Report tool only)

---

## Quick start

```bash
npm install
npm run dev          # Vite dev server (HMR)
```

Scripts: `dev` · `build` · `preview` · `lint`.

By default the app points at the live backend `https://zodimithra.howincloud.com/api`. There are **no env
files** — hosts/keys are hardcoded constants. To target a local backend, flip `isLocal` in
`src/redux/api/baseApi.js` and `src/config/echo.js`. See [`docs/SETUP.md`](./docs/SETUP.md).

---

## Documentation

| Doc | Contents |
|---|---|
| [`docs/OVERVIEW.md`](./docs/OVERVIEW.md) | Architecture, bootstrap, store + every RTK Query endpoint, auth/guards, real-time hooks, native bridge, A/V model. |
| [`docs/FEATURES.md`](./docs/FEATURES.md) | Complete route table, per-page behavior with real timers/polling, the tool catalog, and a polling/timer reference. |
| [`docs/SETUP.md`](./docs/SETUP.md) | Install, scripts, API/WS configuration, browser storage, build & deploy. |
| [`LAYOUT_STRUCTURE.md`](./LAYOUT_STRUCTURE.md) | Layout/header/footer component notes. |

---

## Project structure (high level)

```
src/
  main.jsx / App.jsx / routes.jsx   Bootstrap, router + CallManager, route table
  pages/             Route pages (Home, Messages + ChatRoom, Live, VideoCall, AudioCall,
                     Bookings, Earnings, Profile, Onboarding, Otp, Tools + ~20 tool pages)
  components/        Guards, CallManager/IncomingCallModal, Home/Earnings/Profile/Tools
                     widgets, common (Footer nav, PullToRefresh, inputs)
  layouts/           MainLayout (gradient shell + conditional footer)
  redux/             store.js, authSlice.js, api/{baseApi,authApi,chatApi,liveApi,toolsApi,userApi}
  context/           NativeAppContext (RN WebView bridge)
  hooks/             useChatSocket, useIncomingCallListener, useOneSignal
  config/            echo.js (Reverb WebSocket)
```

## Key endpoints (backend, via RTK Query)

- **Auth:** `/astrologer/send-otp`, `/astrologer/verify-otp`, `/astrologer/get-user-details`,
  `/complete-registration`
- **Chat:** `/astrologer/chat-overview`, `/chat/conversations`, `/chat/{id}/messages`, `/chat/{id}/send`,
  `/astrologer/chat-request/handle`, `/chat/session/{id}` (+ heartbeat)
- **Live:** `/astrologer/live-sessions` (create/list/end), `/astrologer/today-sessions`
- **Tools:** `/vedika/*`, `/astrology/*`, `/numerology/calculate`, `/shubh-din/generate`, `/tools/convert-nazhika`

Full tables in [`docs/OVERVIEW.md`](./docs/OVERVIEW.md).

## Deployed at

`https://zodimithra-vendor.howincloud.com` — also loaded inside the vendor native app's WebView.
