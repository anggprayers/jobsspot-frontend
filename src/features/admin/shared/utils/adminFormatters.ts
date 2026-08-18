import axios from "axios";

import { JOBS_SPOT_TIME_ZONE } from "@/lib/jobsSpotDateTime";

export function formatAdminDate(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(new Date(value));
}

export function formatAdminLabel(value: string): string {
    return value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getAdminInitials(firstName: string, lastName: string): string {
    return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() || "U";
}

export function getAdminErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}
