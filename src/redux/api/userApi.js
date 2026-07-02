import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['User'],
        }),

        getUser: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ['User'],
        })
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
} = userApi;