import axios from "axios";

import type { ApplicationStatus } from "../types/application";

const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    SHORTLISTED: "Under review",
    INTERVIEW: "Interview",
    OFFERED: "Offer received",
    HIRED: "Hired",
    REJECTED: "Not selected",
    WITHDRAWN: "Withdrawn",
};

const APPLICATION_STATUS_CLASSES: Record<ApplicationStatus, string> = {
    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",
    UNDER_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
    SHORTLISTED: "border-amber-200 bg-amber-50 text-amber-700",
    INTERVIEW: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OFFERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    HIRED: "border-green-200 bg-green-50 text-green-700",
    REJECTED: "border-slate-200 bg-slate-100 text-slate-700",
    WITHDRAWN: "border-slate-200 bg-slate-100 text-slate-600",
};

export function formatApplicationStatus(status: ApplicationStatus): string {
    return APPLICATION_STATUS_LABELS[status];
}

export function getApplicationStatusClasses(status: ApplicationStatus): string {
    return APPLICATION_STATUS_CLASSES[status];
}

export function formatApplicationDate(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function formatApplicationDateTime(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

export function formatApplicationEnum(value: string): string {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function getApplicationErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
