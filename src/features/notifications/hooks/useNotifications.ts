import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    clearReadNotifications,
    getNotifications,
    getNotificationUnreadCount,
    getNotificationPreferences,
    markAllNotificationsRead,
    markNotificationRead,
    updateNotificationPreferences,
} from "../api/notificationApi";
import type {
    NotificationAudience,
    NotificationListParams,
    NotificationsResponse,
    NotificationUnreadCountResponse,
} from "../types/notification";

const NOTIFICATION_QUERY_KEY = ["notifications"] as const;
const notificationListQueryKey = [...NOTIFICATION_QUERY_KEY, "list"] as const;

export function useNotifications(
    params: NotificationListParams,
    enabled = true,
) {
    return useQuery({
        queryKey: [...notificationListQueryKey, params],
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
        onSuccess: (response) => {
            const notification = response.notification;
            let wasUnread = false;

            queryClient.setQueriesData<NotificationsResponse>(
                { queryKey: notificationListQueryKey },
                (current) => {
                    if (!current) {
                        return current;
                    }

                    const currentItem = current.notifications.find(
                        (item) => item.id === notification.id,
                    );
                    const becameRead = Boolean(currentItem && !currentItem.readAt);

                    if (becameRead) {
                        wasUnread = true;
                    }

                    return {
                        ...current,
                        unreadCount: becameRead
                            ? Math.max(0, current.unreadCount - 1)
                            : current.unreadCount,
                        notifications: current.notifications.map((item) =>
                            item.id === notification.id
                                ? {
                                      ...item,
                                      readAt:
                                          notification.readAt ??
                                          new Date().toISOString(),
                                  }
                                : item,
                        ),
                    };
                },
            );

            if (wasUnread) {
                const audiencesToUpdate: NotificationAudience[] =
                    notification.audience === "SYSTEM"
                        ? ["JOB_SEEKER", "EMPLOYER", "ADMIN", "SYSTEM"]
                        : [notification.audience];

                for (const audience of audiencesToUpdate) {
                    queryClient.setQueryData<NotificationUnreadCountResponse>(
                        [
                            ...NOTIFICATION_QUERY_KEY,
                            "unread-count",
                            audience,
                        ],
                        (current) =>
                            current
                                ? {
                                      ...current,
                                      unreadCount: Math.max(
                                          0,
                                          current.unreadCount - 1,
                                      ),
                                  }
                                : current,
                    );
                }
            }

            void queryClient.invalidateQueries({
                queryKey: NOTIFICATION_QUERY_KEY,
            });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: async (_response, audience) => {
            queryClient.setQueryData<NotificationUnreadCountResponse>(
                [...NOTIFICATION_QUERY_KEY, "unread-count", audience],
                (current) =>
                    current
                        ? {
                              ...current,
                              unreadCount: 0,
                          }
                        : current,
            );

            await queryClient.invalidateQueries({
                queryKey: NOTIFICATION_QUERY_KEY,
            });
        },
    });
}

export function useClearReadNotifications() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clearReadNotifications,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: NOTIFICATION_QUERY_KEY,
            });
        },
    });
}

export function useNotificationPreferences(enabled = true) {
    return useQuery({
        queryKey: [...NOTIFICATION_QUERY_KEY, "preferences"],
        queryFn: getNotificationPreferences,
        enabled,
    });
}

export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateNotificationPreferences,
        onSuccess: (response) => {
            queryClient.setQueryData(
                [...NOTIFICATION_QUERY_KEY, "preferences"],
                response,
            );
        },
    });
}
