# Vendor PWA — Features & Pages

Complete, code-grounded inventory of the astrologer PWA: every route, what each page actually does, the timers
and polling it runs, and the components it uses. Routes are defined in `src/routes.jsx`; pages live under
`src/pages/`.

---

## Complete route table

All routes are wrapped in a guard. `PublicRoute` redirects logged-in users away; `ProtectedRoute` requires a
token and a completed onboarding (see OVERVIEW.md → Auth flow).

| Path | Page component | Guard | Bottom nav? | Purpose |
|---|---|---|---|---|
| `/otp` | `Otp/Otp.jsx` | Public | – | Phone + OTP login. |
| `/loading` | `Loading/Loading.jsx` | Public | – | Decorative splash. |
| `/` | `Home/Home.jsx` | Protected | ✔ | Dashboard. |
| `/messages` | `Messages/Messages.jsx` | Protected | ✔ | Conversation list + pending requests. |
| `/messages/chat/:id` | `Messages/ChatRoom.jsx` | Protected | – | 1-on-1 timed chat session. |
| `/earnings` | `Earnings/Earnings.jsx` | Protected | – | Revenue dashboard. |
| `/profile` | `Profile/Profile.jsx` | Protected | ✔ | Profile editor. |
| `/tools` | `Tools/Tools.jsx` | Protected | ✔ | Tools hub (grid + search). |
| `/live` | `Live/Live.jsx` | Protected | ✔ | Live broadcast console. |
| `/video-call` | `VideoCall/VideoCall.jsx` | Protected | – | 1-on-1 video consultation room. |
| `/audio-call` | `AudioCall/AudioCall.jsx` | Protected | – | 1-on-1 audio consultation room. |
| `/bookings` | `Bookings/Bookings.jsx` | Protected | – | Today/upcoming sessions + availability. |
| `/onboarding` | `Onboarding/Onboarding.jsx` | Protected | – | 3-step registration wizard. |
| `/kundli-matching` | `KundliMatching/KundliMatching.jsx` | Protected | – | Tool — Guna Milan compatibility. |
| `/kundli-generator` | `KundliGenerator/KundliGenerator.jsx` | Protected | – | Tool — birth chart generator. |
| `/dasha-calculator` | `DashaCalculator/DashaCalculator.jsx` | Protected | – | Tool — Vimshottari Mahadasha. |
| `/dasa-details` | `DasaDetails/DasaDetails.jsx` | Protected | – | Tool — multi-level dasha tree. |
| `/muhurth-finder` | `MuhurthFinder/MuhurthFinder.jsx` | Protected | – | Tool — auspicious dates. |
| `/numerology-calculator` | `NumerologyCalculator/NumerologyCalculator.jsx` | Protected | – | Tool — numerology numbers. |
| `/planetary-positions` | `PlanetaryPositions/PlanetaryPositions.jsx` | Protected | – | Reference — static planet table. |
| `/planetary-avastas` | `PlanetaryAvastas/PlanetaryAvastas.jsx` | Protected | – | Tool — planetary states/avasthas. |
| `/transit-calendar` | `TransitCalendar/TransitCalendar.jsx` | Protected | – | Tool — panchang + day timings. |
| `/transit-alerts` | `TransitAlerts/TransitAlerts.jsx` | Protected | – | Tool — natal vs current transits. |
| `/prashna` | `Prashna/Prashna.jsx` | Protected | – | Tool — horary chart. |
| `/yogas-detector` | `YogasDetector/YogasDetector.jsx` | Protected | – | Tool — yoga detection. |
| `/jaimini-astrology` | `JaiminiAstrology/JaiminiAstrology.jsx` | Protected | – | Tool — Chara karakas + Chara Dasha. |
| `/nazhika-converter` | `NazhikaConverter/NazhikaConverter.jsx` | Protected | – | Tool — Vedic ↔ standard time. |
| `/atlas-daylight-saving` | `AtlasDaylightSaving/AtlasDaylightSaving.jsx` | Protected | – | Tool — city lat/long/TZ/DST. |
| `/astro-report` | `AstroReport/AstroReport.jsx` | Protected | – | Tool — PDF consultation report. |
| `/gemstone-guide` | `GemstoneGuide/GemstoneGuide.jsx` | Protected | – | Tool/Guide — gemstone recs. |
| `/remedy-guide` | `RemedyGuide/RemedyGuide.jsx` | Protected | – | Tool/Guide — mantra/charity/fasting. |
| `/rashi-guide` | `RashiGuide/RashiGuide.jsx` | Protected | – | Reference — static 12 signs. |
| `/vastu-compass` | `VastuCompass/VastuCompass.jsx` | Protected | – | Guide — vastu placement. |

There is **no catch-all / 404 route**. The `Footer` bottom nav (`src/components/common/Footer.jsx`) links the
five tabs marked "Bottom nav?" above. `MainLayout` only shows the footer on those five paths.

> `src/components/common/BottomNavbar.jsx` is a second nav component (emoji `<a href>` links to
> `/services`, `/chats`, `/wallet` — routes that do not exist). It is unused/legacy.

---

## Authentication & onboarding

### `Otp/Otp.jsx`
Two-step phone auth (`authStep`: `'phone'` → `'otp'`).
- 4-box OTP input with refs, auto-advance, backspace and paste handling.
- **Resend timer:** 30-second countdown via a 1 s `setInterval` (only on the OTP step while `timer > 0`);
  `canResend` flips when it reaches 0; reset on send/resend.
- `useSendOtpMutation` → on success logs a dev OTP if `response.otp` is returned.
- `useVerifyOtpMutation` → dispatches `setToken(token)` + `setUser`; if `onboarding_completed`, writes
  `localStorage.onboardingCompleted='true'` and navigates `/`, otherwise removes it and navigates `/onboarding`.
  Failure clears the OTP boxes and refocuses.
- Back: OTP step → phone step; phone step → `navigate(-1)` or `/loading` if there's no history.

### `Loading/Loading.jsx`
Decorative-only splash (Framer Motion halo + spinning asset). The auto-redirect logic (read
`onboardingCompleted` after 3 s, route to `/` or `/onboarding`) is **commented out**; no timers, navigation, or
API run. Also rendered by `ProtectedRoute`/`PublicRoute` while `getUserDetails` is loading.

### `Onboarding/Onboarding.jsx`
3-step registration wizard (`step` 1–3) using `useGetLanguagesQuery`, `useGetSpecializationsQuery`, and
`useCompleteRegistrationMutation`.
- Fields across steps: languages, name, location, experience, qualification, DOB (day/month/year), TOB
  (hour/min/sec/period), specialization, employed-outside, where-learned.
- On final submit: maps specialization → integer IDs, maps language codes → DB IDs (handles
  English/Tamil/Sanskrit, else falls back to first language), formats DOB `YYYY-MM-DD` and TOB `HH:MM:SS AM/PM`,
  synthesizes a `bio` string from qualification/where-learned/employment, and sends default prices
  (chat 20 / call 30 / video 45).
- On success: `localStorage.onboardingCompleted='true'`, `sessionStorage.sessionLoaded='true'`,
  `dispatch(setUser)`, navigate `/`. Header padded by `statusBarHeight`.

---

## Home — `Home/Home.jsx`
Dashboard, wrapped in `PullToRefresh`.
- Time-aware greeting + astrologer name (`user.name` split into prefix/main; "Acharya/Pandit" aware).
- **Online/offline pill** — local-only toggle (`isOnline`), not persisted to the server.
- **Bell button** — local `notificationCount`; clicking it `alert('Notifications cleared')` and zeroes the badge.
- **Stats grid** from `useGetChatOverviewQuery().data.stats`: Today's Earnings (`₹today_earnings`,
  with up/down direction arrow), Sessions Today, Pending, Rating (+ reviews count). Each falls back to 0/`'0.0'`.
- Pull-to-refresh re-runs `refetchOverview()`; `isFetching` drives the spinner.
- Renders `QuickActions` (chat/Bookings/Earnings/Tools shortcuts) and `IncomingRequests`.
- Hero height/top padding adapt to `isNativeApp` + `statusBarHeight`.

**Components:** `QuickActions`, `IncomingRequests`, `PullToRefresh`.

---

## Messaging

### `Messages/Messages.jsx`
Conversation list + pending-request handling.
- `useGetChatOverviewQuery` and `useGetConversationsQuery`, **both polled at 5000 ms**.
- Filters overview requests to `status==='pending'`; renders the first via `RequestCard` (or an empty state).
- `useHandleChatRequestMutation`:
  - **Accept** → refetch both; if `res.conversation.id` exists, navigate `/messages/chat/:id`. Errors `alert()`.
  - **Reject** → handle + refetch.
- "{n} Active" badge = conversation count. `TodayBookings` lists conversations (tap → chat room).
- `PullToRefresh` re-runs both refetches.

**Components:** `RequestCard`, `TodayBookings`, `PullToRefresh`.

### `Messages/ChatRoom.jsx`
A timed 1-on-1 chat session (`conversationId` from the URL).
- `useGetConversationsQuery` → display name/avatar; `useGetChatSessionQuery(conversationId)` → `chat_session`
  + `remaining_seconds`.
- **Timers:**
  - A fixed **3 s "Loading…"** state on mount before the badge resolves.
  - A **1 s local countdown** for smooth `MM:SS` display; at 0 the session goes inactive.
  - A **2 s heartbeat** (`useUpdateChatSessionMutation`) that syncs `remaining_seconds` and detects
    server-side `status==='ended'`.
- **Header badge:** green normally, **red + pulsing in the final 60 s**, grey "Session Ended" after.
- **Banners:** red low-balance warning in the last 60 s; amber "session ended, history only" banner afterward.
- Body is `ChatMessageList`, which is disabled when the timer is loading or the session is inactive.

**Components:** `ChatMessageList` (+ `useChatSocket`).

#### `Messages/components/ChatMessageList.jsx`
- `useGetMessagesQuery(conversationId, { pollingInterval: 12000 })` **plus** the WebSocket via
  `useChatSocket(conversationId)` (real-time + 12 s poll backup).
- Aligns bubbles by comparing sender to `state.auth.user.id`; auto-scrolls to bottom on new messages.
- `useMarkMessagesReadMutation` fires on mount and whenever `messages.length` changes.
- `handleSend` clears the input optimistically, unwraps `useSendMessageMutation`, restores text on failure.
- Input/send disabled when `isTimerLoading` or `!isSessionActive`.

---

## Calls

### `VideoCall/VideoCall.jsx` (`/video-call`)
Astrologer side of a prepaid, fixed-length 1-on-1 video consultation. `meetUrl`, `requestId`, `endsAt` arrive
via router state (from accepting a video request). The Meet room is embedded in an `<iframe>` with the
astrologer's name appended to the URL (`?name=…`).
- **Phases:** `live` → `ended`. `WARN_SECONDS = 60`, `AUTO_LEAVE_SECONDS = 6`.
- **Deadline countdown:** 1 s tick computed from `endsAt`; at 0 → `finishSession('time')` which calls
  `endVideoSession(requestId)` (`useEndVideoSessionMutation`) to **force-close the room for both sides**.
- **Last-minute warning:** amber banner + pulsing red timer pill when `remaining <= 60`.
- **Disconnect handling:** listens for iframe `postMessage` `meet:close` / `room.disconnected` (origin-checked)
  → `finishSession('disconnected')` (no force-end; the other side already closed it).
- **Ended modal:** explains why it ended, then a **6 s auto-leave countdown** returns to `/`.

### `AudioCall/AudioCall.jsx` (`/audio-call`)
Audio-only sibling (room created `audioOnly`, iframe `allow="microphone; autoplay; fullscreen"`). Reached when
a **call**-type request is accepted (by `CallManager` or `IncomingRequests`/`Bookings`).
- Same 1 s `endsAt` countdown; red timer pill in the final 60 s.
- At deadline (or on `meet:close`/`room.disconnected`) it ends and returns to `/`. To force-end it issues a
  **direct `fetch`** to `POST https://zodimithra.howincloud.com/api/astrologer/chat-request/{requestId}/end-video`
  with the bearer token (the URL is hardcoded here, not via RTK Query).

### Global call handling — `CallManager` + `IncomingCallModal`
`CallManager` is mounted globally in `App.jsx`.
- Calls `useOneSignal()` (registers the device on login) and `useIncomingCallListener(...)` (Reverb channel
  `App.Models.User.{id}`, event `.IncomingCallRequest`).
- On an incoming call it stores the payload and shows `IncomingCallModal`. The modal auto-dismisses when
  `expires_at` passes (one-shot `setTimeout`).
- **Accept** → `handleChatRequest({ action:'accept' })`; if `res.type==='call'` and `res.host_meet_url`,
  navigate `/audio-call` with `{ meetUrl, minutes, endsAt, requestId }`.
- **Reject** → `handleChatRequest({ action:'reject' })`.
- `IncomingCallModal` plays a looping `/phonering.mp3` ringtone (paused on accept/reject; autoplay may be
  blocked on first interaction), shows caller name + minutes, and pulsing accept/reject buttons.

---

## Live broadcasting — `Live/Live.jsx`
Three-state console: **setup → countdown → live**.
- **Setup:** `LiveSetupCard` (topic input + "Start Live Now"), `SessionSettingsCard` (local-only toggles),
  `ScheduleSessionCard` (creates a future session), `TodayBookingsCard` (static teaser → `/bookings`).
- **Start:** `useCreateLiveSessionMutation({ mode:'live', title })`; requires a `host_url` in the response,
  then runs a **3-2-1 countdown** (1 s interval) before going live.
- **Live:** `LiveBroadcastViewport` embeds `host_url` in an iframe (camera/mic/share allowed) with a LIVE badge
  and a **1 s duration timer** (`MM:SS`). An "End Session" button calls
  `useEndLiveSessionMutation(activeSession.id)` after a `confirm()`.
- Can be launched directly from another tab via `location.state.activeSession` (it then enters live mode and
  clears the history state to avoid re-triggering on reload).

#### `Live/components/ScheduleSessionCard.jsx`
Self-contained form (title/date/time/description). Validates required fields and that
`start_time = '${date}T${time}:00'` (treated as Asia/Kolkata) is in the future, then submits
`useCreateLiveSessionMutation({ mode:'scheduled', title, description?, start_time })` with `alert()` feedback.

#### Other live components
- `CountdownScreen` — "Aligning Planets…" loader (numeric display commented out).
- `LiveBroadcastViewport` — iframe embed when `hostUrl` is set, else a simulated UI.
- `LiveConsoleChatPanel`, `LiveSetupCard`, `SessionSettingsCard`, `TodayBookingsCard` — presentational; live
  stats (followers/sessions/rating) and "interested" counters are hardcoded/local.

---

## Bookings — `Bookings/Bookings.jsx`
Sessions and availability hub.
- `useGetTodaySessionsQuery`, `useGetMyLiveSessionsQuery`, and `useGetChatOverviewQuery` (**5 s polling**),
  all feeding `PullToRefresh`.
- Pending request via `RequestCard`; on **accept** (`useHandleChatRequestMutation`) it branches by `res.type`:
  - `video` + `host_meet_url` → `/video-call` with `{ meetUrl, requestId, endsAt, minutes }`
  - `call` → `/audio-call` with `{ meetUrl, minutes, endsAt, requestId }`
  - else `res.conversation.id` → `/messages/chat/:id`
  Errors surface via `alert()`.
- Renders `TodaySessionsCard`, `UpcomingSessionsCard`, `AvailabilityCard` (in `Bookings/components/`).

---

## Earnings — `Earnings/Earnings.jsx`
Revenue dashboard via `useGetEarningsQuery`.
- Today/week/month stat cards from `data.stats` (fallback display strings `₹2,340 / ₹14,820 / ₹42,340`).
- "Withdraw Earnings" button is **not wired** (only `console.log`).
- Passes `chart_data`, `service_earnings`, `recent_transactions` to children: `EarningsChart` (week/month/year
  tabs, animated bars), `ServiceEarnings` (per-service bars), `RecentTransactions` (transaction list). Each
  child shows hardcoded sample data when its prop is empty.

---

## Profile — `Profile/Profile.jsx`
Profile editor backed by `useGetUserDetailsQuery`, `useGetSpecializationsQuery`,
`useCompleteRegistrationMutation`.
- Local form state: name, bio, experience, specializations (names mapped to IDs), chat/call/video prices,
  selected image + preview (object URL is created and revoked to avoid leaks).
- `handleSave` builds **`FormData`** (name, bio, experience, `onboarding_completed=1`, three prices, gender,
  `role=astrologer`, current_location, repeated `specialization_ids[]`, optional `profile_image`), unwraps the
  mutation, `dispatch(setUser)`, and `alert`s success/failure.
- **Components:** `ProfileHeader` (avatar + file picker, `navigate(-1)`), `BasicInfo`, `Specializations`,
  `ConsultationRates`, `ProfileActions` (Save + Logout; logout `dispatch(logout())` → `/otp`).

---

## Tools hub — `Tools/Tools.jsx`
Searchable grid that routes to the individual tool pages. Sections:
- **Quick Launch:** Kundli, Planets, Muhurtha, Numerology (`QuickLaunchCard`).
- **Calculation & Charts:** Kundli Generator (banner), Kundli Matching, Dasha Calculator, Numerology,
  Muhurta Finder.
- **Reference & Guides:** Planetary Avastas (banner), Gemstone Guide, Rashi Guide, Vastu Compass, Remedy
  Library, Nazhika Converter, Prashna, Atlas + Daylight Saving, Transit Calendar, Yogas Detector, Jaimini
  Astrology, Dasa Details, Astro Report (banner), Transit Alerts (banner).
- Live client-side filtering by title/subtitle; "No tools found" empty state. `ToolsHeader` search + a panchang
  shortcut to `/transit-calendar`.

**Components:** `ToolsHeader`, `QuickLaunchCard`, `ToolCard`, `ToolBannerCard`.

---

## Astrology tools & guides (per-page)

Most birth-data tools share a UX pattern: name/DOB/time/birthplace inputs, **birthplace autocomplete via
OpenStreetMap Nominatim** (direct `fetch`), and a browser-derived timezone offset. They call `toolsApi` and
render the result. Endpoints are listed in OVERVIEW.md → `toolsApi`.

### API-backed calculators
| Page | What it computes | toolsApi hook → endpoint |
|---|---|---|
| **Kundli Matching** | Ashtakoot/Guna Milan compatibility score + recommendation between two charts (male/female). | `useGetVedikaKundliMatchMutation` → `POST /vedika/kundali-matching` |
| **Kundli Generator** | D1 birth chart (Southern grid) + dasha data. | `useLazyGetPlanetPositionsQuery` + `useLazyGetDashaPeriodsQuery` (parallel) |
| **Dasha Calculator** | Vimshottari Mahadasha periods with start years, durations, active-period highlight. | `useLazyGetDashaPeriodsQuery` → `GET /astrology/dasha-periods` |
| **Dasa Details** | Expandable multi-level dasha tree (Mahadasha → Antardasha …). | `useLazyGetDashaPeriodsQuery` |
| **Muhurtha Finder** | Auspicious dates (Shubh Din) for an event with per-date muhurat + rating. | `useGenerateShubhDinMutation` → `POST /shubh-din/generate` |
| **Numerology Calculator** | Life Path, Birthday, Personality numbers with titles/descriptions. | `useCalculateNumerologyMutation` → `POST /numerology/calculate` |
| **Planetary Avastas** | Planetary states (combustion via distance-to-Sun, retrograde, …). | `useLazyGetPlanetPositionsQuery` |
| **Transit Calendar** | Panchang + auspicious/inauspicious day timings (sunrise/sunset, Abhijit, Rahu Kaal). Auto-fetches on date/city change. | `useGetPanchangMutation` + `useGetAuspiciousPeriodMutation` + `useGetInauspiciousPeriodMutation` (parallel) |
| **Transit Alerts** | Natal vs current transit comparison relative to natal Moon sign + alerts. | `useLazyGetPlanetPositionsQuery` (called twice: natal then "now") |
| **Prashna** | Horary chart cast at current moment/location; verdict from Lagna-lord placement. | `useLazyGetPlanetPositionsQuery` (auto place via geolocation + Nominatim reverse-geocode) |
| **Yogas Detector** | Detects yogas in a birth chart. | `useLazyGetYogaDetailsQuery` → `GET /astrology/yoga` |
| **Jaimini Astrology** | 7 Chara Karakas (AK…DK) + Chara Dasha. | `useGetJaiminiKarakasMutation` + `useGetJaiminiCharaDashaMutation` (parallel) |
| **Nazhika Converter** | Two-way Vedic (nazhika/vinazhika) ↔ standard (hh:mm) time; converts live on keystroke. | `useConvertNazhikaMutation` → `POST /tools/convert-nazhika` |
| **Gemstone Guide** | Per-planet gemstone recommendations (primary/alternative/caution/mantra). | `useGetGemstoneRecommendationsMutation` → `POST /vedika/remedies/gemstone` |
| **Remedy Guide** | Per-planet remedies merging mantra + charity + fasting. | `useGetMantraRemediesMutation` + `useGetCharityRemediesMutation` + `useGetFastingRemediesMutation` (`Promise.all`) |
| **Vastu Compass** | Vastu room placement + compass by door-facing. Fetches rules but the displayed analysis is largely a hardcoded table; "Analyse" is an 800 ms local timeout. | `useGetVastuRulesQuery` → `GET /vastu-rules` |

### Static / client-only pages (no `toolsApi`)
| Page | Notes |
|---|---|
| **Planetary Positions** | Static reference: hardcoded 8-planet table (rashi/degree/house/retrograde) + static date banner. No API. |
| **Rashi Guide** | Static reference: hardcoded 12 zodiac signs (lord/element/nature/gemstone/icon/description). No API. |
| **Atlas + Daylight Saving** | City lat/long, UTC offset, DST status. Calls external APIs directly (Nominatim + `timeapi.io`), debounced ~650 ms. No `toolsApi`. |
| **Astro Report** | Client-only PDF generator (see below). No `toolsApi`; uses Nominatim for birthplace. |

### Astro Report — PDF export (`AstroReport/AstroReport.jsx`)
The only page using **jsPDF + html2canvas**. A consultation-report builder: client/birth details + free-text
Observations / Predictions / Remedies / Notes, with an editable view and a preview tab. Can be prefilled from
URL query params (`client`, `type`, `dob`, `tob`, `pob`).
- `getPatchedCanvas(elementId)` renders an **offscreen fixed 800 px element** with
  `html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#FAF6F0', onclone })`. The `onclone` callback
  rewrites any `oklch`/`oklab` color values to `rgb()` fallbacks (html2canvas can't parse modern color spaces).
- **Download:** canvas → JPEG → `new jsPDF({ unit:'px', format:[w/2, h/2] })` → `addImage` →
  `pdf.save('<Client>_Report.pdf')`.
- **Share:** same canvas → `pdf.output('blob')` → `File` → `navigator.canShare/share({ files })`; falls back
  to `pdf.save(...)` if sharing is unsupported or throws (AbortError = user cancelled).
- **Print:** `window.print()`.

---

## Polling & timer reference

| Where | Interval / duration | Mechanism |
|---|---|---|
| Messages / Bookings / IncomingRequests — chat overview & conversations | **5000 ms** | RTK Query `pollingInterval` |
| ChatRoom messages | **12000 ms** | RTK Query `pollingInterval` (+ WebSocket) |
| ChatRoom session heartbeat | **2000 ms** | `setInterval` → `updateChatSession` |
| ChatRoom display countdown | **1000 ms** | local `setInterval` |
| ChatRoom initial badge "Loading…" | **3000 ms** one-shot | `setTimeout` |
| Live go-live countdown | **3-2-1**, 1 s ticks | `setInterval` |
| Live duration timer | **1000 ms** | `setInterval` |
| Video/Audio call deadline countdown | **1000 ms** from `endsAt` | `setInterval` |
| Video call last-minute warning | at `remaining <= 60` | derived |
| Video call auto-leave after end | **6 s** countdown | `setInterval` |
| OTP resend | **30 s** countdown | `setInterval` |
| RequestCard expiry | **1000 ms** from `expires_at` | `setInterval` |
| NativeAppContext device-info poll | **1000 ms × 10 attempts** | `setInterval` |
| Atlas city search debounce | **~650 ms** | `setTimeout` |
| Vastu "Analyse" | **800 ms** one-shot | `setTimeout` |

---

## Real-time, native & notifications (summary)

- **WebSocket:** Laravel Echo over Reverb (`src/config/echo.js`). Channels: `chat.{conversationId}`
  (`.MessageSent`) and `App.Models.User.{id}` (`.IncomingCallRequest`).
- **Native bridge:** `useNativeApp()` exposes `isNativeApp`, `platform`, `statusBarHeight`, screen size, app
  version, device name, and `showPayments` (hidden on iOS while `SHOW_PAYMENTS_ON_IOS = false`).
- **Push:** `useOneSignal()` posts `onesignal_login` to the RN WebView on login.
- **Custom pull-to-refresh:** `PullToRefresh` (resistance curve, 70 px threshold) on Home/Messages/Bookings.

See [OVERVIEW.md](./OVERVIEW.md) for the architecture, store, and endpoint tables; [SETUP.md](./SETUP.md) for
build & deploy.
