import type { CompanyMemberRole } from "@/features/auth/types/auth";

export type EmployerCompanyRole = CompanyMemberRole;

type OptionalEmployerCompanyRole = EmployerCompanyRole | null | undefined;

export function isCompanyOwner(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER";
}

export function canManageCompany(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER" || role === "ADMIN";
}

export function canManageTeam(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER" || role === "ADMIN";
}

export function canViewActivity(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER" || role === "ADMIN";
}

export function canManageJobs(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER" || role === "ADMIN" || role === "RECRUITER";
}

export function canUpdateApplications(role: OptionalEmployerCompanyRole): boolean {
    return role === "OWNER" || role === "ADMIN" || role === "RECRUITER";
}

type CanManageCompanyMemberInput = {
    actorRole: OptionalEmployerCompanyRole;
    actorUserId: string | null | undefined;
    targetRole: EmployerCompanyRole;
    targetUserId: string;
};

export function canManageCompanyMember({
    actorRole,
    actorUserId,
    targetRole,
    targetUserId,
}: CanManageCompanyMemberInput): boolean {
    if (!actorUserId || !canManageTeam(actorRole)) {
        return false;
    }

    // The company owner is always protected.
    if (targetRole === "OWNER") {
        return false;
    }

    // Members cannot change or remove themselves.
    if (targetUserId === actorUserId) {
        return false;
    }

    // Admins cannot manage other admins.
    if (actorRole === "ADMIN" && targetRole === "ADMIN") {
        return false;
    }

    return true;
}
