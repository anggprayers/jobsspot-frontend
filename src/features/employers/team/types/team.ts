import type { CompanyMemberRole } from "@/features/auth/types/auth";

export type AssignableCompanyMemberRole = Exclude<CompanyMemberRole, "OWNER">;

export type CompanyMemberUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
};

export type CompanyMember = {
    id: string;
    role: CompanyMemberRole;
    joinedAt: string;
    user: CompanyMemberUser;
};

export type CompanyMemberCandidate = CompanyMemberUser;

export type GetCompanyMembersResponse = {
    success: boolean;
    message: string;
    members: CompanyMember[];
};

export type SearchCompanyMemberCandidatesResponse = {
    success: boolean;
    message: string;
    users: CompanyMemberCandidate[];
};

export type AddCompanyMemberRequest = {
    email: string;
    role: AssignableCompanyMemberRole;
};

export type AddCompanyMemberResponse = {
    success: boolean;
    message: string;
    member: CompanyMember;
};

export type UpdateCompanyMemberRoleRequest = {
    role: AssignableCompanyMemberRole;
};

export type UpdateCompanyMemberRoleResponse = {
    success: boolean;
    message: string;
    member: CompanyMember;
};

export type RemoveCompanyMemberResponse = {
    success: boolean;
    message: string;
};
