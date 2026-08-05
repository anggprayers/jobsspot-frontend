import axios from "axios";

import type { CompanyMemberRole } from "@/features/auth/types/auth";

import type {
    CompanyInvitationApiError,
    CompanyInvitationStatus,
} from "../types/team";

export const roleDescriptions: Record<CompanyMemberRole, string> = {
    OWNER: "Full company control, including team management.",
    ADMIN: "Can manage jobs, applicants, company information, and team members.",
    RECRUITER: "Can create jobs and manage applicants.",
    VIEWER: "Can view jobs and applicants without making changes.",
};

export function getTeamMemberInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatCompanyMemberRole(role: CompanyMemberRole): string {
    return role
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatTeamMemberJoinedDate(joinedAt: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(joinedAt));
}

export function formatInvitationDate(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

export function getCompanyMemberRoleBadgeClasses(role: CompanyMemberRole): string {
    switch (role) {
        case "OWNER":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "ADMIN":
            return "border-purple-200 bg-purple-50 text-purple-700";

        case "RECRUITER":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "VIEWER":
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

export function getInvitationStatusBadgeClasses(status: CompanyInvitationStatus): string {
    switch (status) {
        case "PENDING":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "EXPIRED":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "ACCEPTED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "CANCELLED":
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

export function formatInvitationStatus(status: CompanyInvitationStatus): string {
    return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatRetryAfterSeconds(seconds: number): string {
    if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? "" : "s"}`;
    }

    const minutes = Math.ceil(seconds / 60);

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }

    const hours = Math.ceil(minutes / 60);

    return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function getTeamErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<CompanyInvitationApiError>(error)) {
        const validationMessage = error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat()[0]
            : undefined;

        return validationMessage ?? error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

export function getTeamErrorDescription(error: unknown): string | undefined {
    if (!axios.isAxiosError<CompanyInvitationApiError>(error)) {
        return undefined;
    }

    const retryAfterSeconds = error.response?.data?.retryAfterSeconds;

    if (typeof retryAfterSeconds === "number" && retryAfterSeconds > 0) {
        return `Try again in about ${formatRetryAfterSeconds(retryAfterSeconds)}.`;
    }

    const retryAfterAt = error.response?.data?.retryAfterAt;

    if (retryAfterAt) {
        return `Try again after ${formatInvitationDate(retryAfterAt)}.`;
    }

    return undefined;
}
