import type { LucideIcon } from "lucide-react";
import {
    Bell,
    BriefcaseBusiness,
    Building2,
    CircleAlert,
    FileCheck2,
    Info,
    MailCheck,
    ShieldCheck,
    UserCheck,
} from "lucide-react";

export function formatNotificationDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export function formatNotificationRelativeTime(value: string): string {
    const date = new Date(value);
    const timestamp = date.getTime();

    if (Number.isNaN(timestamp)) {
        return "Recently";
    }

    const differenceInSeconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000),
    );

    if (differenceInSeconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(differenceInSeconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatNotificationDate(value);
}

export function getNotificationIcon(type: string): LucideIcon {
    if (type.includes("APPLICATION_SUBMITTED")) {
        return FileCheck2;
    }

    if (type.includes("APPLICATION_FIRST_VIEWED")) {
        return UserCheck;
    }

    if (type.includes("APPLICATION_STATUS")) {
        return BriefcaseBusiness;
    }

    if (type.includes("NEW_APPLICATION")) {
        return MailCheck;
    }

    if (type.includes("COMPANY")) {
        return Building2;
    }

    if (type.includes("JOB")) {
        return BriefcaseBusiness;
    }

    if (type.includes("ADMIN")) {
        return ShieldCheck;
    }

    if (type.includes("REVIEW") || type.includes("SUSPENDED")) {
        return CircleAlert;
    }

    if (type === "SYSTEM") {
        return Info;
    }

    return Bell;
}
