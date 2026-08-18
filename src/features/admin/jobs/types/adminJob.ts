export type AdminJobStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";
export type AdminJobModerationStatus = "VISIBLE" | "HIDDEN";

export type AdminJobListItem = {
    id: string;
    title: string;
    slug: string;
    status: AdminJobStatus;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    location: string | null;
    city?: string | null;
    stateRegion?: string | null;
    countryCode?: string;
    publishedAt: string | null;
    expiresAt: string | null;
    adminHiddenAt: string | null;
    adminHiddenReason: string | null;
    adminHiddenById: string | null;
    moderationStatus: AdminJobModerationStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    company: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        suspendedAt: string | null;
        deletedAt: string | null;
    };
    category: { id: string; name: string; slug: string };
    createdBy: { id: string; firstName: string; lastName: string; email: string };
    counts: { applications: number; reports: number };
};

export type AdminJobDetails = Omit<AdminJobListItem, "counts"> & {
    companyId: string;
    categoryId: string;
    createdById: string;
    description: string;
    requirements: string | null;
    responsibilities: string | null;
    salaryMin: string | null;
    salaryMax: string | null;
    salaryCurrency: string | null;
    salaryPeriod: string | null;
    applicationDeadline: string | null;
    publicContactEmail: string | null;
    adminHiddenBy: { id: string; firstName: string; lastName: string; email: string } | null;
    reports: Array<{
        id: string;
        reason: string;
        status: string;
        createdAt: string;
        reporter: { id: string; firstName: string; lastName: string; email: string };
    }>;
    counts: {
        applications: number;
        applicationsByStatus: Record<string, number>;
        reports: number;
        pendingReports: number;
        underReviewReports: number;
    };
};

export type AdminJobListParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: "ALL" | AdminJobStatus;
    moderation?: "ALL" | "VISIBLE" | "HIDDEN";
    recordState?: "ALL" | "ACTIVE" | "DELETED";
    companyId?: string;
    sort?: "NEWEST" | "OLDEST" | "TITLE_ASC" | "TITLE_DESC";
};

export type AdminJobsResponse = {
    success: true;
    message: string;
    jobs: AdminJobListItem[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export type AdminJobResponse = { success: true; message: string; job: AdminJobDetails };
export type UpdateAdminJobModerationRequest = { hidden: boolean; reason?: string };
export type UpdateAdminJobModerationResponse = {
    success: true;
    message: string;
    job: Pick<AdminJobDetails, "id" | "title" | "slug" | "status" | "adminHiddenAt" | "adminHiddenReason" | "adminHiddenById" | "updatedAt" | "moderationStatus">;
};


export type AdminJobPayload = {
    categoryId: string;
    title: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    city?: string | null;
    stateRegion?: string | null;
    countryCode: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency: string;
    salaryPeriod?: string;
    applicationDeadline?: string;
    publicContactEmail?: string | null;
};

export type CreateAdminJobRequest = { companyId: string; job: AdminJobPayload };
export type UpdateAdminJobRequest = Partial<AdminJobPayload>;
export type PublishAdminJobRequest = { applicationDeadline?: string };
export type AdminJobMutationResponse = {
    success: true;
    message: string;
    job: { id: string; title: string; slug: string; status: AdminJobStatus; updatedAt?: string; publishedAt?: string | null; expiresAt?: string | null };
};
