import apiClient from "@/lib/apiClient";

import type {
    MarkAllNotificationsReadResponse,
    MarkNotificationReadResponse,
    NotificationAudience,
    NotificationListParams,
    NotificationsResponse,
    NotificationUnreadCountResponse,
} from "../types/notification";

export async function getNotifications(
    params: NotificationListParams,
): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>(
        "/notifications",
        { params },
    );

    return response.data;
}

export async function getNotificationUnreadCount(
    audience: NotificationAudience,
): Promise<NotificationUnreadCountResponse> {
    const response = await apiClient.get<NotificationUnreadCountResponse>(
        "/notifications/unread-count",
        {
            params: { audience },
        },
    );

    return response.data;
}

export async function markNotificationRead(
    notificationId: string,
): Promise<MarkNotificationReadResponse> {
    const response = await apiClient.patch<MarkNotificationReadResponse>(
        `/notifications/${notificationId}/read`,
    );

    return response.data;
}

export async function markAllNotificationsRead(
    audience: NotificationAudience,
): Promise<MarkAllNotificationsReadResponse> {
    const response = await apiClient.patch<MarkAllNotificationsReadResponse>(
        "/notifications/read-all",
        { audience },
    );

    return response.data;
}
