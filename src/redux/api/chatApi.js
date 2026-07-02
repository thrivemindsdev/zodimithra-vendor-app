import { baseApi } from './baseApi';

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChatOverview: builder.query({
            query: () => '/astrologer/chat-overview',
            providesTags: ['ChatOverview'],
        }),
        getConversations: builder.query({
            query: () => '/chat/conversations',
            transformResponse: (res) => res.data,
            providesTags: ['ChatList'],
        }),
        getMessages: builder.query({
            query: (conversationId) => `/chat/${conversationId}/messages`,
            providesTags: (result, error, conversationId) => [
                { type: 'Messages', id: conversationId },
            ],
        }),
        sendMessage: builder.mutation({
            query: ({ conversationId, message }) => ({
                url: `/chat/${conversationId}/send`,
                method: 'POST',
                body: { message },
            }),
            // Optimistic update
            async onQueryStarted({ conversationId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: newMsg } = await queryFulfilled;
                    dispatch(
                        chatApi.util.updateQueryData('getMessages', conversationId, (draft) => {
                            if (!draft.find((m) => m.id === newMsg.id)) {
                                draft.push(newMsg);
                            }
                        })
                    );
                } catch {}
            },
        }),
        handleChatRequest: builder.mutation({
            query: ({ requestId, action }) => ({
                url: '/astrologer/chat-request/handle',
                method: 'POST',
                body: { request_id: requestId, action },
            }),
            invalidatesTags: ['ChatOverview', 'ChatList'],
        }),
        markMessagesRead: builder.mutation({
            query: (conversationId) => ({
                url: `/chat/${conversationId}/read`,
                method: 'POST',
            }),
            invalidatesTags: ['ChatList', 'ChatOverview'],
        }),
        getChatSession: builder.query({
            query: (conversationId) => `/chat/session/${conversationId}`,
        }),
        updateChatSession: builder.mutation({
            query: (chatSessionId) => ({
                url: `/chat/session/${chatSessionId}/update`,
                method: 'POST',
            }),
        }),
        // Force-end an accepted 1-on-1 video consultation (deadline reached).
        // Deleting the room disconnects both sides.
        endVideoSession: builder.mutation({
            query: (requestId) => ({
                url: `/astrologer/chat-request/${requestId}/end-video`,
                method: 'POST',
            }),
        }),
        getEarnings: builder.query({
            query: () => '/astrologer/earnings',
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetChatOverviewQuery,
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useHandleChatRequestMutation,
    useMarkMessagesReadMutation,
    useGetChatSessionQuery,
    useUpdateChatSessionMutation,
    useEndVideoSessionMutation,
    useGetEarningsQuery,
} = chatApi;
