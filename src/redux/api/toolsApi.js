import { baseApi } from './baseApi';

export const toolsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVedikaKundliMatch: builder.mutation({
            query: (body) => ({
                url: '/vedika/kundali-matching',
                method: 'POST',
                body,
            }),
        }),

        generateShubhDin: builder.mutation({
            query: (body) => ({
                url: '/shubh-din/generate',
                method: 'POST',
                body,
            }),
        }),

        calculateNumerology: builder.mutation({
            query: (body) => ({
                url: '/numerology/calculate',
                method: 'POST',
                body,
            }),
        }),

        getPlanetPositions: builder.query({
            query: (params) => ({
                url: '/astrology/planet-position',
                method: 'GET',
                params,
            }),
        }),

        getDashaPeriods: builder.query({
            query: (params) => ({
                url: '/astrology/dasha-periods',
                method: 'GET',
                params,
            }),
        }),

        getPanchang: builder.mutation({
            query: (params) => ({
                url: '/astrology/panchang',
                method: 'GET',
                params,
            }),
        }),

        getAuspiciousPeriod: builder.mutation({
            query: (params) => ({
                url: '/astrology/auspicious-period',
                method: 'GET',
                params,
            }),
        }),

        getInauspiciousPeriod: builder.mutation({
            query: (params) => ({
                url: '/astrology/inauspicious-period',
                method: 'GET',
                params,
            }),
        }),

        getVastuRules: builder.query({
            query: (search) => ({
                url: '/vastu-rules',
                method: 'GET',
                params: search ? { search } : undefined,
            }),
        }),

        getGemstoneRecommendations: builder.mutation({
            query: (body) => ({
                url: '/vedika/remedies/gemstone',
                method: 'POST',
                body,
            }),
        }),

        convertNazhika: builder.mutation({
            query: (body) => ({
                url: '/tools/convert-nazhika',
                method: 'POST',
                body,
            }),
        }),

        getPanchangAdvanced: builder.query({
            query: (params) => ({
                url: '/astrology/panchang/advanced',
                method: 'GET',
                params,
            }),
        }),

        getMantraRemedies: builder.mutation({
            query: (body) => ({
                url: '/vedika/remedies/mantra',
                method: 'POST',
                body,
            }),
        }),

        getCharityRemedies: builder.mutation({
            query: (body) => ({
                url: '/vedika/remedies/charity',
                method: 'POST',
                body,
            }),
        }),

        getFastingRemedies: builder.mutation({
            query: (body) => ({
                url: '/vedika/remedies/fasting',
                method: 'POST',
                body,
            }),
        }),

        getYogaDetails: builder.query({
            query: (params) => ({
                url: '/astrology/yoga',
                method: 'GET',
                params,
            }),
        }),

        getJaiminiKarakas: builder.mutation({
            query: (body) => ({
                url: '/vedika/jaimini/karakas',
                method: 'POST',
                body,
            }),
        }),

        getJaiminiCharaDasha: builder.mutation({
            query: (body) => ({
                url: '/vedika/jaimini/chara-dasha',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetVedikaKundliMatchMutation,
    useGenerateShubhDinMutation,
    useCalculateNumerologyMutation,

    useGetPlanetPositionsQuery,
    useLazyGetPlanetPositionsQuery,

    useGetDashaPeriodsQuery,
    useLazyGetDashaPeriodsQuery,

    useGetPanchangMutation,
    useGetAuspiciousPeriodMutation,
    useGetInauspiciousPeriodMutation,

    useGetVastuRulesQuery,

    useGetGemstoneRecommendationsMutation,
    useConvertNazhikaMutation,

    useGetPanchangAdvancedQuery,
    useLazyGetPanchangAdvancedQuery,

    useGetMantraRemediesMutation,
    useGetCharityRemediesMutation,
    useGetFastingRemediesMutation,

    useGetYogaDetailsQuery,
    useLazyGetYogaDetailsQuery,

    useGetJaiminiKarakasMutation,
    useGetJaiminiCharaDashaMutation,
} = toolsApi;