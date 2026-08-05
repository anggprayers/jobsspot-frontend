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

export type TransferCompanyOwnershipRequest = {
    targetMemberId: string;
    confirmationCompanyName: string;
};

export type TransferCompanyOwnershipResponse = {
    success: true;
    message: string;
    company: {
        id: string;
        name: string;
    };
    previousOwner: CompanyMember;
    newOwner: CompanyMember;
};

export type RemoveCompanyMemberResponse = {
    success: boolean;
    message: string;
};

export type CompanyInvitationStatus = "PENDING" | "EXPIRED" | "ACCEPTED" | "CANCELLED";

export type CompanyInvitationSender = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
};

export type CompanyInvitation = {
    id: string;
    companyId: string;
    email: string;
    role: AssignableCompanyMemberRole;
    expiresAt: string;
    lastSentAt: string | null;
    sendCount: number;
    acceptedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    invitedBy: CompanyInvitationSender;
    status: CompanyInvitationStatus;
};

export type GetCompanyInvitationsResponse = {
    success: true;
    message: string;
    invitations: CompanyInvitation[];
};

export type CreateCompanyInvitationRequest = {
    email: string;
    role: AssignableCompanyMemberRole;
};

export type CompanyInvitationMutationResponse = {
    success: true;
    message: string;
    invitation: CompanyInvitation;
};

export type CompanyInvitationRateLimitType =
    | "RESEND_COOLDOWN"
    | "RECIPIENT_DAILY_LIMIT"
    | "COMPANY_DAILY_LIMIT";

export type CompanyInvitationApiError = {
    success?: false;
    message?: string;
    errors?: Record<string, string[]>;
    rateLimitType?: CompanyInvitationRateLimitType;
    retryAfterSeconds?: number;
    retryAfterAt?: string;
};
