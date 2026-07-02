import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (body) => ({
                url: '/astrologer/send-otp',
                method: 'POST',
                body,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (body) => ({
                url: '/astrologer/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        getUserDetails: builder.query({
            query: () => '/astrologer/get-user-details',
            providesTags: ['User'],
        }),
        getSpecializations: builder.query({
            query: () => '/specializations',
        }),
        getLanguages: builder.query({
            query: () => '/languages',
        }),
        completeRegistration: builder.mutation({
            query: (body) => ({
                url: '/complete-registration',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useGetUserDetailsQuery,
    useGetSpecializationsQuery,
    useGetLanguagesQuery,
    useCompleteRegistrationMutation,
} = authApi;
