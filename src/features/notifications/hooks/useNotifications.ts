import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getNotifications,
    getNotificationUnreadCount,
    markAllNotificationsRead,
    markNotificationRead,
} from "../api/notificationApi";
import type {
    NotificationAudience,
    NotificationListParams,
} from "../types/notification";

const NOTIFICATION_QUERY_KEY = ["notifications"] as const;

export function useNotifications(
    params: NotificationListParams,
    enabled = true,
) {
    return useQuery({
        queryKey: [...NOTIFICATION_QUERY_KEY, "list", params],
        queryFn: () => getNotifications(params),
        enabled,
        placeholderData: (previousData) => previousData,
        refetchInterval: 60_000,
    });
}

export function useNotificationUnreadCount(
    audience: NotificationAudience,
    enabled = true,
) {
    return useQuery({
        queryKey: [...NOTIFICATION_QUERY_KEY, "unread-count", audience],
        queryFn: () => getNotificationUnreadCount(audience),
        enabled,
        refetchInterval: 60_000,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markNotificationRead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: NOTIFICATION_QUERY_KEY,
            });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: NOTIFICATION_QUERY_KEY,
            });
        },
    });
}
