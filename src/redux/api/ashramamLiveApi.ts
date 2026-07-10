import { baseApi } from "./baseApi";

export const liveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAshramaLiveSessions: builder.query({
      query: () => "/asramam/live-sessions",
      // Unwrap { status, data: { live, upcoming } }
      transformResponse: (res) => res?.data ?? { live: [], upcoming: [] },
      providesTags: ["LiveSessions"],
    }),

    // Create a session. body: { mode: 'live' | 'scheduled', title, description?, start_time?, duration_minutes? }
    createAshramaLiveSession: builder.mutation({
      query: (body) => ({
        url: "/asramam/live-sessions",
        method: "POST",
        body,
      }),
      transformResponse: (res) => res?.data ?? null,
      invalidatesTags: ["LiveSessions"],
    }),

    // Start a live session by its Meet id.
    startAshramaLiveSession: builder.mutation({
      query: (id) => ({
        url: `/asramam/live-sessions/${id}/start`,
        method: "POST",
      }),
      transformResponse: (res) => res?.data ?? null,
      invalidatesTags: ["LiveSessions"],
    }),

    // End a live session by its Meet id.
    endAshramaLiveSession: builder.mutation({
      query: (id) => ({
        url: `/asramam/live-sessions/${id}/end`,
        method: "POST",
      }),
      transformResponse: (res) => res?.data ?? null,
      invalidatesTags: ["LiveSessions"],
    }),

    // Today's client consultation bookings for the logged-in astrologer.
    getAshramaTodaySessions: builder.query({
      query: () => "/asramam/today-sessions",
      transformResponse: (res) => res?.data ?? [],
      providesTags: ["LiveSessions"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAshramaLiveSessionsQuery,
  useCreateAshramaLiveSessionMutation,
  useStartAshramaLiveSessionMutation,
  useEndAshramaLiveSessionMutation,
  useGetAshramaTodaySessionsQuery,
} = liveApi;
