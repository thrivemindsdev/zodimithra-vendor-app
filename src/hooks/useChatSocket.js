import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getEcho } from '../config/echo';
import { chatApi } from '../redux/api/chatApi';
import { store } from '../redux/store';

export function useChatSocket(conversationId) {
    const dispatch = useDispatch();

    const handleIncomingMessage = useCallback(
        (payload) => {
            if (!conversationId) return;

            const state = store.getState();
            const myId = state.auth?.user?.id;

            // Ignore if we sent this message (already added via sendMessage mutation)
            if (payload.sender_id === myId) return;

            const newMessage = {
                id: payload.id,
                conversation_id: payload.conversation_id,
                sender_id: payload.sender_id,
                message: payload.message,
                created_at: payload.created_at,
                updated_at: payload.created_at,
                sender: payload.sender,
            };

            dispatch(
                chatApi.util.updateQueryData('getMessages', conversationId, (draft) => {
                    // Avoid duplicates
                    if (!draft.find((m) => m.id === newMessage.id)) {
                        draft.push(newMessage);
                    }
                })
            );

            // Invalidate conversation list or overview to trigger reload of last messages & unreads
            dispatch(chatApi.util.invalidateTags(['ChatList', 'ChatOverview']));
        },
        [conversationId, dispatch]
    );

    useEffect(() => {
        console.log(`[ChatSocket] Hook effect trigger for conversationId: ${conversationId}`);
        if (!conversationId) {
            console.log('[ChatSocket] No conversationId, skipping subscription');
            return;
        }

        console.log(`[ChatSocket] Subscribing to chat.${conversationId}`);
        const echo = getEcho();
        console.log('[ChatSocket] Echo instance obtained:', !!echo);
        
        const channel = echo
            .private(`chat.${conversationId}`)
            .listen('.MessageSent', (payload) => {
                console.log('[ChatSocket] Received MessageSent:', payload);
                handleIncomingMessage(payload);
            });

        return () => {
            console.log(`[ChatSocket] Leaving chat.${conversationId}`);
            channel.stopListening('.MessageSent');
            echo.leave(`chat.${conversationId}`);
        };
    }, [conversationId, handleIncomingMessage]);
}
