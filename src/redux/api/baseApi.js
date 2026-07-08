import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const isLocal = false;

const BASE_URL = isLocal    
    ? 'http://zodiminds-backend.test/api'
    : 'https://backend.zodimithra.com/api';


export const baseApi = createApi({
    reducerPath: 'api',

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,

        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            headers.set('Accept', 'application/json');

            return headers;
        },
    }),

    tagTypes: ['User', 'Post', 'ChatList', 'Messages', 'ChatOverview', 'LiveSessions'],
    endpoints: () => ({}),
});