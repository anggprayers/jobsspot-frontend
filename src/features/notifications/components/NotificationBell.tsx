"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
    useNotificationUnreadCount,
} from "../hooks/useNotifications";
import type {
    NotificationAudience,
    NotificationItem,
} from "../types/notification";
import { formatNotificationRelativeTime } from "../utils/notificationFormatters";
import NotificationTypeIcon from "./NotificationTypeIcon";

type NotificationBellProps = {
    audience: NotificationAudience;
    viewAllHref: string;
    enabled?: boolean;
    className?: string;
    visualStyle?: "public" | "portal";
};

export default function NotificationBell({
    audience,
    viewAllHref,
    enabled = true,
    className,
    visualStyle = "portal",
}: NotificationBellProps) {
    const router = useRouter();
    const unreadCountQuery = useNotificationUnreadCount(audience, enabled);
    const notificationsQuery = useNotifications(
        {
            audience,
            status: "ALL",
            page: 1,
            limit: 6,
        },
        enabled,
    );
    const markReadMutation = useMarkNotificationRead();
    const markAllMutation = useMarkAllNotificationsRead();

    const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;
    const notifications = notificationsQuery.data?.notifications ?? [];
    const isLoading =
        unreadCountQuery.isLoading || notificationsQuery.isLoading;

    async function handleNotificationOpen(notification: NotificationItem) {
        try {
            if (!notification.readAt) {
                await markReadMutation.mutateAsync(notification.id);
            }

            const isJobSeekerReportUpdate =
                notification.audience === "JOB_SEEKER" &&
                notification.entityType === "JOB_REPORT";
            const destination = isJobSeekerReportUpdate
                ? viewAllHref
                : notification.actionUrl;

            if (destination) {
                router.push(destination);
            }
        } catch {
            toast.error("Unable to update this notification.");
        }
    }

    async function handleMarkAllRead() {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant={visualStyle === "public" ? "outline" : "ghost"}
                    size="icon"
                    aria-label={
                        unreadCount > 0
                            ? `Open notifications, ${unreadCount} unread`
                            : "Open notifications"
                    }
                    className={cn(
                        "relative size-10 shrink-0",
                        visualStyle === "public" &&
                            "size-12 rounded-xl border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
                        className,
                    )}
                >
                    <Bell className="size-5" />

                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[min(92vw,390px)] p-0"
            >
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <DropdownMenuLabel className="p-0">
                        <p className="font-semibold">Notifications</p>
                        <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                            {unreadCount === 0
                                ? "You are all caught up."
                                : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`}
                        </p>
                    </DropdownMenuLabel>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={
                            unreadCount === 0 || markAllMutation.isPending
                        }
                        onClick={() => void handleMarkAllRead()}
                        className="h-8 shrink-0 px-2 text-xs"
                    >
                        {markAllMutation.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <CheckCheck />
                        )}
                        Mark all read
                    </Button>
                </div>

                <DropdownMenuSeparator className="m-0" />

                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div
                            className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-muted-foreground"
                            role="status"
                        >
                            <LoaderCircle className="size-4 animate-spin" />
                            Loading notifications...
                        </div>
                    ) : notificationsQuery.isError ? (
                        <div className="px-5 py-8 text-center text-sm text-red-600">
                            Notifications could not be loaded.
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                            <Bell className="mx-auto size-8 text-muted-foreground/60" />
                            <p className="mt-3 text-sm font-medium">
                                No notifications yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Important JobsSpot updates will appear here.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const isUnread = !notification.readAt;

                            return (
                                <button
                                    key={notification.id}
                                    type="button"
                                    onClick={() =>
                                        void handleNotificationOpen(notification)
                                    }
                                    className={cn(
                                        "flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60",
                                        isUnread && "bg-primary/5",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
                                            isUnread &&
                                                "bg-primary/10 text-primary",
                                        )}
                                    >
                                        <NotificationTypeIcon
                                            type={notification.type}
                                            className="size-4.5"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-start justify-between gap-3">
                                            <span
                                                className={cn(
                                                    "line-clamp-1 text-sm",
                                                    isUnread
                                                        ? "font-semibold text-foreground"
                                                        : "font-medium text-foreground",
                                                )}
                                            >
                                                {notification.title}
                                            </span>

                                            {isUnread && (
                                                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                        </span>

                                        <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                            {notification.message}
                                        </span>

                                        <span className="mt-1.5 block text-[11px] font-medium text-muted-foreground">
                                            {formatNotificationRelativeTime(
                                                notification.createdAt,
                                            )}
                                        </span>
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />

                <div className="p-2">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-center"
                    >
                        <Link href={viewAllHref}>View all notifications</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
