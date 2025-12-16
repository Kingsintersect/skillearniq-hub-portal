import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParentStore } from '@/store/parentStore';
import { parentService } from '@/lib/services/parentService';
import { useEffect } from 'react';

export const useParentMessages = () => {
    const {
        setMessages,
        setSelectedMessageId,
        setSelectedMessage,
        setMessagesLoading,
        setMessagesError,
        messages,
        selectedMessageId,
        selectedStudentId
    } = useParentStore();

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['parent', 'messages'],
        queryFn: () => parentService.getTeacherMessages(),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Sync React Query state with Zustand store
    // useEffect(() => {
    //     setMessagesLoading(query.isLoading);
    //     setMessagesError(query.error ? 'Failed to load messages' : null);
    //     if (query.data?.data) {
    //         setMessages(query.data.data);
    //     }
    // }, [
    //     query.data,
    //     query.isLoading,
    //     query.error,
    //     setMessages,
    //     setMessagesLoading,
    //     setMessagesError,
    // ]);

    // Sync selected message with selectedStudentId
    useEffect(() => {
        if (selectedStudentId && messages.length > 0) {
            // Filter messages for the selected student
            const messagesForSelectedStudent = messages.filter(message => message.studentId === selectedStudentId);

            // If we have a selected message, check if it belongs to the current student
            if (selectedMessageId) {
                const currentSelectedMessage = messages.find(msg => msg.id === selectedMessageId);
                if (currentSelectedMessage && currentSelectedMessage.studentId === selectedStudentId) {
                    // Keep the current selection if it belongs to the selected student
                    return;
                }
            }

            // Auto-select the first unread message, or the first message if all are read
            if (messagesForSelectedStudent.length > 0) {
                const firstUnreadMessage = messagesForSelectedStudent.find(msg => !msg.isRead);
                const messageToSelect = firstUnreadMessage || messagesForSelectedStudent[0];
                setSelectedMessageId(messageToSelect.id);
                setSelectedMessage(messageToSelect);
            } else {
                // No messages for this student
                setSelectedMessage(null);
                setSelectedMessageId(null);
            }
        } else if (!selectedStudentId) {
            // Clear message selection when no student is selected
            setSelectedMessage(null);
            setSelectedMessageId(null);
        }
    }, [selectedStudentId, messages, selectedMessageId, setSelectedMessage, setSelectedMessageId]);

    // Auto-select first message when data loads and no student is selected
    useEffect(() => {
        if (messages.length > 0 && !selectedStudentId && !selectedMessageId) {
            // When no student is selected, show all messages and select the first one
            setSelectedMessageId(messages[0].id);
            setSelectedMessage(messages[0]);
        }
    }, [messages, selectedStudentId, selectedMessageId, setSelectedMessage, setSelectedMessageId]);

    // Helper functions
    const refetchMessages = () => {
        queryClient.invalidateQueries({ queryKey: ['parent', 'messages'] });
    };

    const selectMessageById = (id: string) => {
        const message = messages.find(message => message.id === id);
        if (message) {
            setSelectedMessage(message);
            // Mark as read when selected
            if (!message.isRead) {
                useParentStore.getState().markMessageAsRead(id);
            }
        }
    };

    const getSelectedMessage = () => {
        return useParentStore.getState().selectedMessage;
    };

    const getMessagesByStudentId = (studentId: string) => {
        return messages.filter(message => message.id === studentId);
    };

    const getUnreadCount = (studentId?: string) => {
        return useParentStore.getState().getUnreadCount(studentId);
    };

    return {
        // React Query data
        ...query,

        // Zustand state
        messages,
        selectedMessage: useParentStore.getState().selectedMessage,
        selectedMessageId,
        selectedStudentId,
        isMessagesLoading: useParentStore.getState().isMessagesLoading,
        messagesError: useParentStore.getState().messagesError,

        // Computed values
        studentMessages: selectedStudentId
            ? messages.filter(message => message.studentId === selectedStudentId)
            : messages,
        unreadCount: getUnreadCount(selectedStudentId || undefined),

        // Actions
        refetchMessages,
        selectMessageById,
        getSelectedMessage,
        getMessagesByStudentId,
        getUnreadCount,
        setSelectedMessage: useParentStore.getState().setSelectedMessage,
        setSelectedMessageId: useParentStore.getState().setSelectedMessageId,
        markMessageAsRead: useParentStore.getState().markMessageAsRead,
    };
};