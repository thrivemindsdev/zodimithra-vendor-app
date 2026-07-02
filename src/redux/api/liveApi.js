import { baseApi } from './baseApi';

export const liveApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // The astrologer's own live + upcoming broadcast sessions.
        getMyLiveSessions: builder.query({
            query: () => '/astrologer/live-sessions',
            // Unwrap { status, data: { live, upcoming } }
            transformResponse: (res) => res?.data ?? { live: [], upcoming: [] },
            providesTags: ['LiveSessions'],
        }),

        // Create a session. body: { mode: 'live' | 'scheduled', title, description?, start_time?, duration_minutes? }
        createLiveSession: builder.mutation({
            query: (body) => ({
                url: '/astrologer/live-sessions',
                method: 'POST',
                body,
            }),
            transformResponse: (res) => res?.data ?? null,
            invalidatesTags: ['LiveSessions'],
        }),

        // End a live session by its Meet id.
        endLiveSession: builder.mutation({
            query: (id) => ({
                url: `/astrologer/live-sessions/${id}/end`,
                method: 'POST',
            }),
            transformResponse: (res) => res?.data ?? null,
            invalidatesTags: ['LiveSessions'],
        }),

        // Today's client consultation bookings for the logged-in astrologer.
        getTodaySessions: builder.query({
            query: () => '/astrologer/today-sessions',
            transformResponse: (res) => res?.data ?? [],
            providesTags: ['LiveSessions'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetMyLiveSessionsQuery,
    useCreateLiveSessionMutation,
    useEndLiveSessionMutation,
    useGetTodaySessionsQuery,
} = liveApi;
