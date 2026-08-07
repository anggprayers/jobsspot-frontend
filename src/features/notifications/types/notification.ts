export type NotificationAudience =
    | "JOB_SEEKER"
    | "EMPLOYER"
    | "ADMIN"
    | "SYSTEM";

export type NotificationStatusFilter = "ALL" | "UNREAD" | "READ";

export type NotificationItem = {
    id: string;
    audience: NotificationAudience;
    type: string;
    title: string;
    message: string;
    actionUrl: string | null;
    entityType: string | null;
    entityId: string | null;
    metadata: unknown;
    readAt: string | null;
    emailedAt: string | null;
    createdAt: string;
};

export type NotificationPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type NotificationListParams = {
    audience: NotificationAudience;
    status?: NotificationStatusFilter;
    page?: number;
    limit?: number;
};

export type NotificationsResponse = {
    success: true;
    message: string;
    notifications: NotificationItem[];
    unreadCount: number;
    pagination: NotificationPagination;
};

export type NotificationUnreadCountResponse = {
    success: true;
    message: string;
    unreadCount: number;
};

export type MarkNotificationReadResponse = {
    success: true;
    message: string;
    notification: NotificationItem;
};

export type MarkAllNotificationsReadResponse = {
    success: true;
    message: string;
    markedReadCount: number;
};

export type ClearReadNotificationsResponse = {
    success: true;
    message: string;
    clearedCount: number;
};

export type NotificationPreferences = {
    jobSeekerApplicationUpdatesEmail: boolean;
    jobSeekerApplicationViewedEmail: boolean;
    employerApplicationEmail: boolean;
    employerTeamEmail: boolean;
    employerJobEmail: boolean;
    systemEmail: boolean;
    updatedAt: string;
};

export type NotificationPreferencesResponse = {
    success: true;
    message: string;
    preferences: NotificationPreferences;
};

export type UpdateNotificationPreferencesInput = Partial<
    Omit<NotificationPreferences, "updatedAt">
>;
