import axios from "axios";

import type { CompanyMemberRole } from "@/features/auth/types/auth";

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

export function getTeamErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
