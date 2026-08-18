export type JobReportReason = "SCAM_FRAUD" | "MISLEADING" | "DISCRIMINATION" | "SPAM_DUPLICATE" | "INAPPROPRIATE" | "OTHER";
export type JobReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export type AdminJobReportListItem = {
    id: string;
    reason: JobReportReason;
    details: string | null;
    status: JobReportStatus;
    resolutionNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    job: {
        id: string;
        title: string;
        slug: string;
        status: string;
        adminHiddenAt: string | null;
        adminHiddenReason: string | null;
        deletedAt: string | null;
        company: { id: string; name: string; slug: string; logoUrl: string | null };
    };
    reporter: { id: string; firstName: string; lastName: string; email: string; avatarUrl: string | null };
    reviewedBy: { id: string; firstName: string; lastName: string; email: string } | null;
};

export type AdminJobReportDetails = Omit<AdminJobReportListItem, "job" | "reporter"> & {
    reporter: AdminJobReportListItem["reporter"] & {
        isEmailVerified: boolean;
        suspendedAt: string | null;
        deletedAt: string | null;
    };
    job: AdminJobReportListItem["job"] & {
        description: string;
        requirements: string | null;
        responsibilities: string | null;
        employmentType: string;
        workplaceType: string;
        experienceLevel: string;
        location: string | null;
        publishedAt: string | null;
        expiresAt: string | null;
        adminHiddenById: string | null;
        company: AdminJobReportListItem["job"]["company"] & { suspendedAt: string | null; deletedAt: string | null };
        category: { id: string; name: string; slug: string };
        _count: { applications: number; reports: number };
    };
};

export type AdminJobReportListParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: "ALL" | JobReportStatus;
    reason?: "ALL" | JobReportReason;
    sort?: "NEWEST" | "OLDEST";
};

export type AdminJobReportsResponse = {
    success: true;
    message: string;
    reports: AdminJobReportListItem[];
    pagination: { page: number; limit: number; totalItems: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
};
export type AdminJobReportResponse = { success: true; message: string; report: AdminJobReportDetails };
export type UpdateJobReportStatusRequest = { status: Exclude<JobReportStatus, "PENDING">; resolutionNote?: string };
export type UpdateJobReportStatusResponse = { success: true; message: string; report: Pick<AdminJobReportDetails, "id" | "reason" | "details" | "status" | "resolutionNote" | "reviewedAt" | "createdAt" | "updatedAt"> };
