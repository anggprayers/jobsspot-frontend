import type { AdminPagination } from "../../users/types/adminUser";

export type AdminCompanyStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type AdminCompanyListStatus = "ALL" | AdminCompanyStatus;
export type AdminCompanyVerification = "ALL" | "VERIFIED" | "UNVERIFIED";
export type AdminCompanySort = "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC";

export type AdminCompanyOwner = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
};

export type AdminCompanyListItem = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
    companySize: string | null;
    location: string | null;
    websiteUrl: string | null;
    isVerified: boolean;
    suspendedAt: string | null;
    suspensionReason: string | null;
    suspendedById: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    status: AdminCompanyStatus;
    owner: AdminCompanyOwner | null;
    counts: {
        activeMembers: number;
        jobs: number;
        publishedJobs: number;
        invitations: number;
    };
};

export type AdminCompanyListParams = {
    page: number;
    limit: number;
    search?: string;
    status: AdminCompanyListStatus;
    verification: AdminCompanyVerification;
    sort: AdminCompanySort;
};

export type AdminCompaniesResponse = {
    success: true;
    message: string;
    companies: AdminCompanyListItem[];
    pagination: AdminPagination;
};

export type AdminCompanyMembership = {
    id: string;
    role: "OWNER" | "ADMIN" | "RECRUITER" | "VIEWER";
    joinedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string | null;
        isEmailVerified: boolean;
        isAdmin: boolean;
        suspendedAt: string | null;
        deletedAt: string | null;
    };
};

export type AdminCompanyRecentJob = {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";
    publishedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    applicationsCount: number;
};

export type AdminCompanyDetails = Omit<
    AdminCompanyListItem,
    "owner" | "counts"
> & {
    description: string | null;
    bannerUrl: string | null;
    suspendedBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    memberships: AdminCompanyMembership[];
    counts: {
        activeMembers: number;
        owners: number;
        jobs: {
            total: number;
            draft: number;
            published: number;
            paused: number;
            closed: number;
            archived: number;
        };
        applications: number;
        pendingInvitations: number;
        companyActivity: number;
        platformActivity: number;
    };
    recentJobs: AdminCompanyRecentJob[];
};

export type AdminCompanyResponse = {
    success: true;
    message: string;
    company: AdminCompanyDetails;
};


export type AdminCompanyMutationRecord = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    industry: string | null;
    companySize: string | null;
    location: string | null;
    isVerified: boolean;
    suspendedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type CreateAdminCompanyRequest = {
    name: string;
    description?: string;
    websiteUrl?: string;
    industry?: string;
    companySize?: string;
    location?: string;
};

export type UpdateAdminCompanyRequest = Partial<CreateAdminCompanyRequest>;

export type AdminCompanyMutationResponse = {
    success: true;
    message: string;
    company: AdminCompanyMutationRecord;
};

export type UpdateAdminCompanySuspensionRequest = {
    suspended: boolean;
    reason?: string;
};

export type UpdateAdminCompanyVerificationRequest = {
    verified: boolean;
};

export type UpdateAdminCompanyResponse = {
    success: true;
    message: string;
    company: {
        id: string;
        name: string;
        slug: string;
        isVerified: boolean;
        suspendedAt: string | null;
        suspensionReason: string | null;
        suspendedById: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        status: AdminCompanyStatus;
    };
};
