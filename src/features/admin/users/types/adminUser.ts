export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type AdminUserListStatus = "ALL" | AdminUserStatus;
export type AdminUserAccountType = "ALL" | "ADMIN" | "STANDARD";
export type AdminUserSort = "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC";

export type AdminUserCounts = {
    companyMemberships: number;
    applications: number;
    resumes: number;
};

export type AdminUserListItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    isAdmin: boolean;
    suspendedAt: string | null;
    suspensionReason: string | null;
    suspendedById: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    status: AdminUserStatus;
    counts: AdminUserCounts;
};

export type AdminUserListParams = {
    page: number;
    limit: number;
    search?: string;
    status: AdminUserListStatus;
    accountType: AdminUserAccountType;
    sort: AdminUserSort;
};

export type AdminPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type AdminUsersResponse = {
    success: true;
    message: string;
    users: AdminUserListItem[];
    pagination: AdminPagination;
};

export type AdminUserMembership = {
    id: string;
    role: "OWNER" | "ADMIN" | "RECRUITER" | "VIEWER";
    joinedAt: string;
    company: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        isVerified: boolean;
        suspendedAt: string | null;
        deletedAt: string | null;
    };
};

export type AdminUserDetails = Omit<AdminUserListItem, "avatarUrl" | "counts"> & {
    phone: string | null;
    avatarUrl: string | null;
    suspendedBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    companyMemberships: AdminUserMembership[];
    counts: {
        applications: number;
        resumes: number;
        savedJobs: number;
        savedSearches: number;
        createdJobs: number;
    };
};

export type AdminUserResponse = {
    success: true;
    message: string;
    user: AdminUserDetails;
};

export type UpdateAdminUserSuspensionRequest = {
    suspended: boolean;
    reason?: string;
};

export type UpdateAdminUserSuspensionResponse = {
    success: true;
    message: string;
    user: AdminUserListItem;
    revokedSessions: number;
};
