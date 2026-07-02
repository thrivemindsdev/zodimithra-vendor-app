# Vendor PWA — Overview

The **Zodimithra Vendor PWA** is the astrologer-facing single-page application. Astrologers use it to take
chat / audio / video consultations, broadcast live, manage bookings and earnings, edit their profile, and run
~20 professional Vedic-astrology calculation and reference tools. It runs standalone in a browser **and**
inside the [vendor native app](../../zodimithra-vendor-app) WebView shell, which it detects at runtime to
adjust layout (status-bar padding) and feature flags (e.g. hiding payments on iOS).

- **Framework:** React 19 (`react@^19.2.6`) + Vite (`vite@^8`)
- **State / data:** Redux Toolkit (`@reduxjs/toolkit@^2.12`) + RTK Query, React-Redux 9
- **Routing:** React Router DOM v7 (`react-router-dom@^7.16`)
- **Styling:** Tailwind CSS v4 (`tailwindcss@^4.3` via `@tailwindcss/vite`)
- **Animation:** Framer Motion (`framer-motion@^12.40`)
- **Real-time:** Laravel Echo (`laravel-echo@^2.3`) + Pusher JS (`pusher-js@^8.5`) over a self-hosted
  **Reverb** WebSocket server
- **A/V sessions & live:** embedded LiveKit "Meet" rooms loaded in `<iframe>`s (no client SDK; rooms are
  created server-side and joined by URL)
- **PDF export:** jsPDF (`jspdf@^4.2`) + html2canvas (`html2canvas@^1.4`) — used only by the Astro Report tool

Language is JavaScript/JSX throughout. There is no TypeScript and no test suite in the repo.

---

## Application bootstrap

The render tree is wired in `src/main.jsx` → `src/App.jsx`:

```
main.jsx
└─ <StrictMode>
   └─ <Provider store={store}>            redux/store.js
      └─ <NativeAppProvider>              context/NativeAppContext.jsx — RN WebView bridge
         └─ <App>                         App.jsx
            └─ <Router> (BrowserRouter)
               ├─ <CallManager/>          global incoming-call listener + modal
               └─ <MainLayout headerProps={…}>
                  └─ <AppRoutes/>         routes.jsx — the <Routes> table
```

Notable bootstrap facts:

- The store is created in `src/redux/store.js` with a single RTK Query reducer (`baseApi`) plus the `auth`
  slice, and `baseApi.middleware` concatenated.
- `CallManager` (`src/components/CallManager/CallManager.jsx`) is mounted **once, globally**, so an incoming
  consultation call surfaces an overlay modal no matter which page the astrologer is on.
- `MainLayout` (`src/layouts/MainLayout.jsx`) renders a centered gradient column and conditionally renders the
  bottom-nav `Footer` only on the five primary tabs (`/`, `/messages`, `/live`, `/tools`, `/profile`); every
  other route (chat room, call rooms, tools, onboarding, …) hides it.
- The `headerProps` passed in `App.jsx` (`title: 'Acharya Pandit JI'`, `showOnlineStatus: true`) are vestigial
  — `MainLayout` does not currently consume them; each page renders its own header.

---

## Folder structure

```
src/
  main.jsx                  App bootstrap (store + native provider + render)
  App.jsx                   Router + CallManager + MainLayout
  routes.jsx                <Routes> definition (every path lives here)
  index.css / App.css       Tailwind entry + global styles

  pages/                    One folder per route page
    Otp/  Loading/                       Auth & splash
    Home/                                 Dashboard
    Messages/ (Messages, ChatRoom,
              components/ChatMessageList) Chat list + chat room
    Live/   (+ components/*)              Live broadcast console
    VideoCall/  AudioCall/                1-on-1 consultation rooms
    Bookings/  (+ components/*)           Sessions & availability
    Earnings/                             Revenue dashboard
    Profile/                              Profile editor
    Onboarding/                           3-step registration wizard
    Tools/                                Tools hub (grid + search)
    <20 tool/guide pages>                 KundliMatching, KundliGenerator, …

  components/
    ProtectedRoute.jsx  PublicRoute.jsx   Route guards
    CallManager/  IncomingCallModal/      Global call handling + ringing modal
    QuickActions/  IncomingRequests/      Home widgets
    RequestCard/  TodayBookings/          Request + conversation widgets
    EarningsChart/ ServiceEarnings/ RecentTransactions/
    Profile/      ProfileHeader, BasicInfo, Specializations,
                  ConsultationRates, ProfileActions
    Tools/        ToolCard, ToolBannerCard, QuickLaunchCard, ToolsHeader
    common/       Footer (active bottom nav), BottomNavbar (legacy/unused),
                  Header, CustomButton/Input/Label/Heading/Header, PullToRefresh

  layouts/MainLayout.jsx
  redux/          store.js, authSlice.js, api/{baseApi,authApi,chatApi,liveApi,toolsApi,userApi}.js
  context/        NativeAppContext.jsx
  hooks/          useChatSocket.js, useIncomingCallListener.js, useOneSignal.js
  config/         echo.js   (Laravel Echo / Reverb WebSocket)
  assets/         images + per-tool PNG icons
```

---

## State & data layer (Redux Toolkit + RTK Query)

### Store (`src/redux/store.js`)

```js
configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer, auth: authReducer },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
})
```

Two slices of state: `api` (all RTK Query cache) and `auth`.

### Auth slice (`src/redux/authSlice.js`)

Holds `{ token, user }`. `token` is **seeded from `localStorage.getItem('token')`** on load, so a refresh keeps
the session. Actions:

| Action | Effect |
|---|---|
| `setToken(token)` | Sets `state.token`; mirrors to `localStorage` (or removes the key if falsy). |
| `setUser(user)` | Sets `state.user` (in-memory only — not persisted). |
| `logout()` | Clears token + user; removes `token` and `onboardingCompleted` from `localStorage`. |

### Base API (`src/redux/api/baseApi.js`)

`createApi({ reducerPath: 'api' })` with `fetchBaseQuery`:

- **Base URL** is chosen by a hardcoded `isLocal` flag:
  `false` → `https://zodimithra.howincloud.com/api` (production, default),
  `true` → `http://zodiminds-backend.test/api`.
- `prepareHeaders` reads `getState().auth.token` and sets `Authorization: Bearer <token>` plus
  `Accept: application/json` on every request (Laravel Sanctum token auth).
- Tag types for cache invalidation: `User`, `Post`, `ChatList`, `Messages`, `ChatOverview`, `LiveSessions`.

All feature APIs are created with `baseApi.injectEndpoints(...)`, so they share that base query, auth header,
and cache.

### RTK Query endpoint reference

Every endpoint hits the same `…/api` base URL above. Hook name in parentheses.

#### `authApi` (`src/redux/api/authApi.js`)

| Endpoint (hook) | Method | Backend path | Notes |
|---|---|---|---|
| `sendOtp` (`useSendOtpMutation`) | POST | `/astrologer/send-otp` | Request an OTP for a phone number. |
| `verifyOtp` (`useVerifyOtpMutation`) | POST | `/astrologer/verify-otp` | Returns Sanctum `token` + user. |
| `getUserDetails` (`useGetUserDetailsQuery`) | GET | `/astrologer/get-user-details` | `providesTags: ['User']`. Used by both route guards. |
| `getSpecializations` (`useGetSpecializationsQuery`) | GET | `/specializations` | Lookup list. |
| `getLanguages` (`useGetLanguagesQuery`) | GET | `/languages` | Lookup list. |
| `completeRegistration` (`useCompleteRegistrationMutation`) | POST | `/complete-registration` | Onboarding + profile save; `invalidatesTags: ['User']`. |

#### `chatApi` (`src/redux/api/chatApi.js`)

| Endpoint (hook) | Method | Backend path | Notes |
|---|---|---|---|
| `getChatOverview` (`useGetChatOverviewQuery`) | GET | `/astrologer/chat-overview` | Dashboard stats + pending requests. `providesTags: ['ChatOverview']`. Polled at 5 s by Messages/Bookings/IncomingRequests. |
| `getConversations` (`useGetConversationsQuery`) | GET | `/chat/conversations` | Unwraps `res.data`. `providesTags: ['ChatList']`. |
| `getMessages` (`useGetMessagesQuery`) | GET | `/chat/{id}/messages` | `providesTags: [{ type:'Messages', id }]`. Polled at 12 s in chat room. |
| `sendMessage` (`useSendMessageMutation`) | POST | `/chat/{id}/send` | **Optimistic update** appends the returned message into the `getMessages` cache. |
| `handleChatRequest` (`useHandleChatRequestMutation`) | POST | `/astrologer/chat-request/handle` | Body `{ request_id, action: 'accept'\|'reject' }`. Invalidates `ChatOverview`+`ChatList`. Drives chat/audio/video routing. |
| `markMessagesRead` (`useMarkMessagesReadMutation`) | POST | `/chat/{id}/read` | Invalidates `ChatList`+`ChatOverview`. |
| `getChatSession` (`useGetChatSessionQuery`) | GET | `/chat/session/{id}` | Returns `chat_session` + `remaining_seconds` for the timer. |
| `updateChatSession` (`useUpdateChatSessionMutation`) | POST | `/chat/session/{id}/update` | Heartbeat (polled every 2 s) that returns `status`/`remaining_seconds`. |
| `endVideoSession` (`useEndVideoSessionMutation`) | POST | `/astrologer/chat-request/{id}/end-video` | Force-ends an A/V room (deletes it → disconnects both sides). |
| `getEarnings` (`useGetEarningsQuery`) | GET | `/astrologer/earnings` | Earnings page data. |

#### `liveApi` (`src/redux/api/liveApi.js`)

| Endpoint (hook) | Method | Backend path | Notes |
|---|---|---|---|
| `getMyLiveSessions` (`useGetMyLiveSessionsQuery`) | GET | `/astrologer/live-sessions` | Unwraps to `{ live, upcoming }`. `providesTags: ['LiveSessions']`. |
| `createLiveSession` (`useCreateLiveSessionMutation`) | POST | `/astrologer/live-sessions` | Body `{ mode:'live'\|'scheduled', title, description?, start_time?, duration_minutes? }`. Returns the session (incl. `host_url`). |
| `endLiveSession` (`useEndLiveSessionMutation`) | POST | `/astrologer/live-sessions/{id}/end` | Ends by Meet id. |
| `getTodaySessions` (`useGetTodaySessionsQuery`) | GET | `/astrologer/today-sessions` | Today's client consultation bookings. |

#### `toolsApi` (`src/redux/api/toolsApi.js`)

The astrology engine. Mix of queries (with lazy variants) and mutations.

| Endpoint (hook) | Method | Backend path |
|---|---|---|
| `getVedikaKundliMatch` (`useGetVedikaKundliMatchMutation`) | POST | `/vedika/kundali-matching` |
| `generateShubhDin` (`useGenerateShubhDinMutation`) | POST | `/shubh-din/generate` |
| `calculateNumerology` (`useCalculateNumerologyMutation`) | POST | `/numerology/calculate` |
| `getPlanetPositions` (`useGetPlanetPositionsQuery` / `useLazyGetPlanetPositionsQuery`) | GET | `/astrology/planet-position` |
| `getDashaPeriods` (`useGetDashaPeriodsQuery` / lazy) | GET | `/astrology/dasha-periods` |
| `getPanchang` (`useGetPanchangMutation`) | GET | `/astrology/panchang` |
| `getAuspiciousPeriod` (`useGetAuspiciousPeriodMutation`) | GET | `/astrology/auspicious-period` |
| `getInauspiciousPeriod` (`useGetInauspiciousPeriodMutation`) | GET | `/astrology/inauspicious-period` |
| `getVastuRules` (`useGetVastuRulesQuery`) | GET | `/vastu-rules` |
| `getGemstoneRecommendations` (`useGetGemstoneRecommendationsMutation`) | POST | `/vedika/remedies/gemstone` |
| `convertNazhika` (`useConvertNazhikaMutation`) | POST | `/tools/convert-nazhika` |
| `getPanchangAdvanced` (`useGetPanchangAdvancedQuery` / lazy) | GET | `/astrology/panchang/advanced` |
| `getMantraRemedies` (`useGetMantraRemediesMutation`) | POST | `/vedika/remedies/mantra` |
| `getCharityRemedies` (`useGetCharityRemediesMutation`) | POST | `/vedika/remedies/charity` |
| `getFastingRemedies` (`useGetFastingRemediesMutation`) | POST | `/vedika/remedies/fasting` |
| `getYogaDetails` (`useGetYogaDetailsQuery` / lazy) | GET | `/astrology/yoga` |
| `getJaiminiKarakas` (`useGetJaiminiKarakasMutation`) | POST | `/vedika/jaimini/karakas` |
| `getJaiminiCharaDasha` (`useGetJaiminiCharaDashaMutation`) | POST | `/vedika/jaimini/chara-dasha` |

#### `userApi` (`src/redux/api/userApi.js`)

| Endpoint (hook) | Method | Backend path |
|---|---|---|
| `getUsers` (`useGetUsersQuery`) | GET | `/users` |
| `getUser` (`useGetUserQuery`) | GET | `/users/{id}` |

> `userApi` is defined but not referenced by any page in the current source — treat it as scaffolding.

---

## Authentication & route-guard flow

Token-based (Laravel Sanctum). Guards live in `src/components/`:

- **`ProtectedRoute`** — reads `localStorage.token`; if absent → redirect to `/otp`. Otherwise it runs
  `useGetUserDetailsQuery` (skipped when no token). On success it `dispatch(setUser(...))`. On error it
  `dispatch(logout())` and redirects to `/otp`. While loading it renders `<Loading/>`. It also enforces
  onboarding: it mirrors `onboarding_completed` to `localStorage.onboardingCompleted`, forces incomplete users
  to `/onboarding`, and bounces completed users away from `/onboarding`.
- **`PublicRoute`** — wraps `/otp` and `/loading`. If there is no token it renders the child. If a valid token
  exists it redirects: incomplete profile → `/onboarding`, otherwise → `/`. An invalid token still shows the
  public page.

Login happens on `/otp`: `verifyOtp` returns `{ token, user }`, the page dispatches `setToken` + `setUser`,
writes `onboardingCompleted` to `localStorage`, and routes to `/` or `/onboarding`.

---

## Real-time layer

### WebSocket config (`src/config/echo.js`)

Laravel Echo configured against a self-hosted **Reverb** broadcaster (lazy singleton via `getEcho()`):

| Setting | Value |
|---|---|
| `broadcaster` | `reverb` |
| `key` | `cglzdl6g3q34q1h4tnch` (public app key) |
| `wsHost` | `zodireverb.howincloud.com` |
| `wsPort` / `wssPort` | `443` |
| `forceTLS` | `true` |
| transports | `['ws', 'wss']` |
| auth | custom authorizer → `POST https://zodimithra.howincloud.com/api/broadcasting/auth` with the bearer token |

`window.Pusher` is set to the `pusher-js` client (Reverb is Pusher-protocol compatible). `resetEcho()` /
`disconnectEcho()` tear the singleton down.

### Hooks

- **`useChatSocket(conversationId)`** (`src/hooks/useChatSocket.js`) — subscribes to the private channel
  `chat.{conversationId}` and listens for `.MessageSent`. Incoming messages from **other** users are pushed
  into the `getMessages` RTK Query cache (dedup by id), and `ChatList`/`ChatOverview` tags are invalidated so
  unread counts refresh. Messages the astrologer sent are ignored (already added optimistically).
- **`useIncomingCallListener(onIncomingCall)`** (`src/hooks/useIncomingCallListener.js`) — subscribes to the
  vendor's own private channel `App.Models.User.{id}` and fires the callback on `.IncomingCallRequest` events
  where `type === 'call'` and `status === 'pending'`. Consumed by `CallManager`.
- **`useOneSignal()`** (`src/hooks/useOneSignal.js`) — on login, `postMessage`s
  `{ type: 'onesignal_login', data: { playerId: user.id, status: 'subscribed' } }` to the RN WebView so the
  native app can link the OneSignal subscription and register the device. No-op outside the WebView.

Polling supplements sockets: chat overview/conversations every **5 s**, chat-room messages every **12 s**,
chat-session heartbeat every **2 s**. See `docs/FEATURES.md` for the full timer table.

---

## Native bridge (`src/context/NativeAppContext.jsx`)

Detects and describes the React-Native (Expo) WebView host. `NativeAppProvider` posts
`{ type: 'get_device_data' }` to `window.ReactNativeWebView` and listens for a `DEVICE_INFO` reply, polling
every **1000 ms up to 10 attempts** until it arrives. Consumed via the `useNativeApp()` hook.

Exposed context value:

| Field | Meaning |
|---|---|
| `isNativeApp` | `true` once a `DEVICE_INFO` message is received (default `false`). |
| `platform` | `'ios'` / `'android'` / `null`. |
| `platformVersion` | OS version string. |
| `statusBarHeight` | Pixels to pad page headers under the native status bar (used widely). |
| `screenWidth` / `screenHeight` | Device pixels. |
| `appVersion` | Native app version. |
| `deviceName` | Device model/name. |
| `showPayments` | Computed: `!(platform === 'ios' && !SHOW_PAYMENTS_ON_IOS)`. With the module constant `SHOW_PAYMENTS_ON_IOS = false`, payments are hidden on iOS (App-Store review compliance) and shown everywhere else. |

Pages read `statusBarHeight` to offset their headers (Home, Messages, ChatRoom, Bookings, Earnings, Onboarding,
VideoCall, AudioCall, ProfileHeader) and `isNativeApp` to switch padding/heights.

---

## A/V & live sessions (iframe model)

There is **no LiveKit client SDK** in the bundle. Instead the backend provisions LiveKit "Meet" rooms and
returns join URLs; the PWA embeds them:

- **Live broadcast** — `createLiveSession` returns `host_url`, embedded by `LiveBroadcastViewport` in an
  `<iframe>` with `allow="camera; microphone; fullscreen; display-capture; autoplay"`.
- **Video consultation** (`/video-call`) — `meetUrl` arrives via router state; embedded with camera+mic.
- **Audio consultation** (`/audio-call`) — room created `audioOnly`, so the Meet UI renders the voice view;
  iframe `allow="microphone; autoplay; fullscreen"`.

The PWA controls timing/end-of-session: it listens for `meet:close` / `room.disconnected` `postMessage`
events from the iframe and, when the prepaid deadline hits, calls `endVideoSession` to force-close the room.

---

## Cross-doc links

- **[FEATURES.md](./FEATURES.md)** — complete route table, per-page behavior with real timers/flows, the tool
  catalog, and the native-bridge details.
- **[SETUP.md](./SETUP.md)** — install, scripts, API/WS configuration, build & deploy.
