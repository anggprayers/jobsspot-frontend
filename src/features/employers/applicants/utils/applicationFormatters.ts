import type { EmployerApplicationStatus } from "../types/employerApplication";

const statusLabels: Record<EmployerApplicationStatus, string> = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFERED: "Offered",
    HIRED: "Hired",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
};

const statusBadgeClasses: Record<EmployerApplicationStatus, string> = {
    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",
    UNDER_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
    SHORTLISTED: "border-violet-200 bg-violet-50 text-violet-700",
    INTERVIEW: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OFFERED: "border-cyan-200 bg-cyan-50 text-cyan-700",
    HIRED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
    WITHDRAWN: "border-slate-200 bg-slate-100 text-slate-600",
};

export function formatApplicationStatus(status: EmployerApplicationStatus): string {
    return statusLabels[status];
}

export function getApplicationStatusBadgeClasses(status: EmployerApplicationStatus): string {
    return statusBadgeClasses[status];
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

export function formatFileSize(bytes: number): string {
    if (bytes <= 0) {
        return "0 KB";
    }

    const kilobytes = bytes / 1024;

    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(kilobytes >= 100 ? 0 : 1)} KB`;
    }

    const megabytes = kilobytes / 1024;

    return `${megabytes.toFixed(megabytes >= 10 ? 1 : 2)} MB`;
}

export function getApplicantInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
