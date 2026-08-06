"use client";

import { useRouter } from "next/navigation";
import {
    Bell,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "../hooks/useNotifications";
import type {
    NotificationAudience,
    NotificationItem,
    NotificationStatusFilter,
} from "../types/notification";
import { formatNotificationDate } from "../utils/notificationFormatters";
import NotificationTypeIcon from "./NotificationTypeIcon";

type NotificationsPageProps = {
    audience: NotificationAudience;
    eyebrow: string;
    title: string;
    description: string;
};

const statusFilters: Array<{
    label: string;
    value: NotificationStatusFilter;
}> = [
    { label: "All", value: "ALL" },
    { label: "Unread", value: "UNREAD" },
    { label: "Read", value: "READ" },
];

export default function NotificationsPage({
    audience,
    eyebrow,
    title,
    description,
}: NotificationsPageProps) {
    const router = useRouter();
    const [status, setStatus] =
        useState<NotificationStatusFilter>("ALL");
    const [page, setPage] = useState(1);
    const notificationsQuery = useNotifications({
        audience,
        status,
        page,
        limit: 15,
    });
    const markReadMutation = useMarkNotificationRead();
    const markAllMutation = useMarkAllNotificationsRead();

    const notifications = notificationsQuery.data?.notifications ?? [];
    const unreadCount = notificationsQuery.data?.unreadCount ?? 0;
    const pagination = notificationsQuery.data?.pagination;

    function changeStatus(nextStatus: NotificationStatusFilter) {
        setStatus(nextStatus);
        setPage(1);
    }

    async function openNotification(notification: NotificationItem) {
        try {
            if (!notification.readAt) {
                await markReadMutation.mutateAsync(notification.id);
            }

            if (notification.actionUrl) {
                router.push(notification.actionUrl);
            }
        } catch {
            toast.error("Unable to update this notification.");
        }
    }

    async function markAllRead() {
        if (unreadCount === 0 || markAllMutation.isPending) {
            return;
        }

        try {
            const response = await markAllMutation.mutateAsync(audience);

            toast.success(
                response.markedReadCount === 1
                    ? "1 notification marked as read."
                    : `${response.markedReadCount} notifications marked as read.`,
            );
        } catch {
            toast.error("Unable to mark notifications as read.");
        }
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">
                        {eyebrow}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void notificationsQuery.refetch()}
                        disabled={notificationsQuery.isFetching}
                    >
                        <RefreshCw
                            className={cn(
                                notificationsQuery.isFetching &&
                                    "animate-spin",
                            )}
                        />
                        Refresh
                    </Button>

                    <Button
                        type="button"
                        onClick={() => void markAllRead()}
                        disabled={
                            unreadCount === 0 || markAllMutation.isPending
                        }
                    >
                        {markAllMutation.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <CheckCheck />
                        )}
                        Mark all read
                    </Button>
                </div>
            </section>

            <Card className="overflow-hidden py-0">
                <div className="flex flex-col justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="font-semibold text-foreground">
                            Notification inbox
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {unreadCount === 0
                                ? "No unread notifications."
                                : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`}
                        </p>
                    </div>

                    <div
                        className="inline-flex w-fit rounded-lg border bg-muted/40 p-1"
                        aria-label="Notification status filter"
                    >
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => changeStatus(filter.value)}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    status === filter.value
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {notificationsQuery.isLoading ? (
                    <div
                        className="flex min-h-80 items-center justify-center gap-3 text-muted-foreground"
                        role="status"
                    >
                        <LoaderCircle className="size-5 animate-spin text-primary" />
                        Loading notifications...
                    </div>
                ) : notificationsQuery.isError ? (
                    <div className="min-h-80 p-8 text-center">
                        <Bell className="mx-auto size-10 text-red-400" />
                        <h2 className="mt-4 text-lg font-semibold">
                            Notifications could not be loaded
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Refresh the page or try again in a moment.
                        </p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Bell className="size-6" />
                        </span>
                        <h2 className="mt-4 text-lg font-semibold">
                            {status === "UNREAD"
                                ? "No unread notifications"
                                : status === "READ"
                                  ? "No read notifications"
                                  : "No notifications yet"}
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Important updates about applications, employer
                            activity, and platform moderation will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <NotificationRow
                                key={notification.id}
                                notification={notification}
                                isUpdating={
                                    markReadMutation.isPending &&
                                    markReadMutation.variables ===
                                        notification.id
                                }
                                onOpen={() =>
                                    void openNotification(notification)
                                }
                            />
                        ))}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 border-t px-5 py-4">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() =>
                                    setPage((current) =>
                                        Math.max(1, current - 1),
                                    )
                                }
                            >
                                <ChevronLeft />
                                Previous
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!pagination.hasNextPage}
                                onClick={() =>
                                    setPage((current) => current + 1)
                                }
                            >
                                Next
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

type NotificationRowProps = {
    notification: NotificationItem;
    isUpdating: boolean;
    onOpen: () => void;
};

function NotificationRow({
    notification,
    isUpdating,
    onOpen,
}: NotificationRowProps) {
    const isUnread = !notification.readAt;

    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                "flex w-full gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/40",
                isUnread && "bg-primary/5",
            )}
        >
            <span
                className={cn(
                    "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
                    isUnread && "bg-primary/10 text-primary",
                )}
            >
                {isUpdating ? (
                    <LoaderCircle className="size-5 animate-spin" />
                ) : (
                    <NotificationTypeIcon
                        type={notification.type}
                        className="size-5"
                    />
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <span className="flex min-w-0 items-center gap-2">
                        <span
                            className={cn(
                                "truncate text-base text-foreground",
                                isUnread ? "font-semibold" : "font-medium",
                            )}
                        >
                            {notification.title}
                        </span>

                        {isUnread && (
                            <span className="size-2 shrink-0 rounded-full bg-primary" />
                        )}
                    </span>

                    <span className="shrink-0 text-xs text-muted-foreground">
                        {formatNotificationDate(notification.createdAt)}
                    </span>
                </span>

                <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted-foreground">
                    {notification.message}
                </span>

                <span className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border bg-background px-2 py-1 font-medium">
                        {notification.audience.replaceAll("_", " ")}
                    </span>
                    {notification.actionUrl && (
                        <span className="font-medium text-primary">
                            Open related item
                        </span>
                    )}
                </span>
            </span>
        </button>
    );
}
