import apiClient from "@/lib/apiClient";

import type {
    ClearReadNotificationsResponse,
    MarkAllNotificationsReadResponse,
    MarkNotificationReadResponse,
    NotificationAudience,
    NotificationListParams,
    NotificationsResponse,
    NotificationUnreadCountResponse,
    NotificationPreferencesResponse,
    UpdateNotificationPreferencesInput,
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

export async function clearReadNotifications(
    audience: Extract<NotificationAudience, "JOB_SEEKER" | "EMPLOYER" | "ADMIN">,
): Promise<ClearReadNotificationsResponse> {
    const response = await apiClient.patch<ClearReadNotificationsResponse>(
        "/notifications/clear-read",
        { audience },
    );

    return response.data;
}

export async function getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
    const response = await apiClient.get<NotificationPreferencesResponse>(
        "/notifications/preferences",
    );

    return response.data;
}

export async function updateNotificationPreferences(
    input: UpdateNotificationPreferencesInput,
): Promise<NotificationPreferencesResponse> {
    const response = await apiClient.patch<NotificationPreferencesResponse>(
        "/notifications/preferences",
        input,
    );

    return response.data;
}
