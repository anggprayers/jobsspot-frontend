import type { CompanyMemberRole } from "@/features/auth/types/auth";

export type CompanyInvitationStatus =
    | "PENDING"
    | "EXPIRED"
    | "ACCEPTED"
    | "CANCELLED";

export type CompanyInvitationMembershipOutcome =
    | "CREATED"
    | "RESTORED"
    | "ALREADY_ACTIVE";

export type ResolvedCompanyInvitation = {
    company: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    };
    role: CompanyMemberRole;
    invitedEmailMasked: string;
    expiresAt: string;
    status: CompanyInvitationStatus;
    canAccept: boolean;
    invitedBy: {
        id: string;
        displayName: string;
        avatarUrl: string | null;
    };
};

export type ResolveCompanyInvitationResponse = {
    success: true;
    message: string;
    invitation: ResolvedCompanyInvitation;
};

export type AcceptCompanyInvitationRequest = {
    token: string;
};

export type AcceptedCompanyInvitation = {
    status: "ACCEPTED";
    acceptedAt: string;
    invitedRole: CompanyMemberRole;
    company: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    };
};

export type AcceptedCompanyMembership = {
    id: string;
    role: CompanyMemberRole;
    joinedAt: string;
    outcome: CompanyInvitationMembershipOutcome;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string | null;
    };
};

export type AcceptCompanyInvitationResponse = {
    success: true;
    message: string;
    invitation: AcceptedCompanyInvitation;
    membership: AcceptedCompanyMembership;
};

export type CompanyInvitationApiError = {
    success?: false;
    message?: string;
    errors?: Record<string, string[]>;
    invitationStatus?: CompanyInvitationStatus;
    invitedEmailMasked?: string;
    expiresAt?: string;
};

