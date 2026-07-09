import { baseApi } from './baseApi';

export const liveApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // The astrologer's own live + upcoming broadcast sessions.
        getAshramaLiveSessions: builder.query({
            query: () => '/asramam/live-sessions',
            // Unwrap { status, data: { live, upcoming } }
            transformResponse: (res) => res?.data ?? { live: [], upcoming: [] },
            providesTags: ['LiveSessions'],
        }),

        // Create a session. body: { mode: 'live' | 'scheduled', title, description?, start_time?, duration_minutes? }
        createAshramaLiveSession: builder.mutation({
            query: (body) => ({
                url: '/asramam/live-sessions',
                method: 'POST',
                body,
            }),
            transformResponse: (res) => res?.data ?? null,
            invalidatesTags: ['LiveSessions'],
        }),

        // End a live session by its Meet id.
        endAshramaLiveSession: builder.mutation({
            query: (id) => ({
                url: `/asramam/live-sessions/${id}/end`,
                method: 'POST',
            }),
            transformResponse: (res) => res?.data ?? null,
            invalidatesTags: ['LiveSessions'],
        }),

        // Today's client consultation bookings for the logged-in astrologer.
        getAshramaTodaySessions: builder.query({
            query: () => '/asramam/today-sessions',
            transformResponse: (res) => res?.data ?? [],
            providesTags: ['LiveSessions'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetAshramaMyLiveSessionsQuery,
    useCreateAshramaLiveSessionMutation,
    useEndAshramaLiveSessionMutation,
    useGetAshramaTodaySessionsQuery,
} = liveApi;
