export type AdminApplicationStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "OFFERED"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN";

export type AdminManageableApplicationStatus =
    | "UNDER_REVIEW"
    | "INTERVIEW"
    | "OFFERED"
    | "HIRED"
    | "REJECTED";

export type AdminApplicationListStatus = "ALL" | AdminApplicationStatus;
export type AdminApplicationSort = "NEWEST" | "OLDEST";

export type AdminApplicationListParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: AdminApplicationListStatus;
    jobId?: string;
    companyId?: string;
    sort?: AdminApplicationSort;
};

export type AdminApplicationListItem = {
    id: string;
    status: AdminApplicationStatus;
    appliedAt: string;
    reviewedAt: string | null;
    withdrawnAt: string | null;
    updatedAt: string;
    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        isDeleted: boolean;
        jobSeekerProfile: {
            headline: string | null;
            location: string | null;
            yearsOfExperience: number | null;
        } | null;
    };
    job: {
        id: string;
        title: string;
        slug: string;
        status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";
        company: {
            id: string;
            name: string;
            slug: string;
        };
    };
    resume: {
        id: string;
        name: string;
        mimeType: string;
        fileSize: number;
    } | null;
};

export type AdminApplicationShareLink = {
    id: string;
    includeResume: boolean;
    includeCoverLetter: boolean;
    expiresAt: string;
    revokedAt: string | null;
    lastAccessedAt: string | null;
    accessCount: number;
    createdAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
};

export type AdminApplicationDetails = Omit<AdminApplicationListItem, "applicant" | "job" | "resume"> & {
    coverLetter: string | null;
    coverLetterFileName: string | null;
    coverLetterFileMimeType: string | null;
    coverLetterFileSize: number | null;
    createdAt: string;
    applicant: AdminApplicationListItem["applicant"] & {
        createdAt: string;
        jobSeekerProfile: {
            headline: string | null;
            summary: string | null;
            location: string | null;
            websiteUrl: string | null;
            linkedInUrl: string | null;
            yearsOfExperience: number | null;
        } | null;
    };
    job: AdminApplicationListItem["job"] & {
        employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";
        workplaceType: "ONSITE" | "REMOTE" | "HYBRID";
        experienceLevel: "ENTRY_LEVEL" | "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE";
        location: string | null;
        category: {
            id: string;
            name: string;
            slug: string;
        };
    };
    resume: (AdminApplicationListItem["resume"] & {
        createdAt: string;
        deletedAt: string | null;
    }) | null;
    shareLinks: AdminApplicationShareLink[];
};

export type AdminApplicationsSummary = {
    total: number;
    submitted: number;
    underReview: number;
    interview: number;
    offered: number;
    hired: number;
    notSelected: number;
    withdrawn: number;
    legacyShortlisted: number;
};

export type AdminApplicationJobOption = {
    id: string;
    title: string;
    company: {
        id: string;
        name: string;
    };
};

export type AdminApplicationsResponse = {
    success: true;
    message: string;
    applications: AdminApplicationListItem[];
    summary: AdminApplicationsSummary;
    jobOptions: AdminApplicationJobOption[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export type AdminApplicationResponse = {
    success: true;
    message: string;
    application: AdminApplicationDetails;
};

export type AdminApplicationFileDownloadResponse = {
    success: true;
    message: string;
    downloadUrl: string;
    expiresInSeconds: number;
};

export type AdminApplicationStatusRequest = {
    status: AdminManageableApplicationStatus;
};

export type CreateAdminApplicationShareLinkRequest = {
    expiresInHours: number;
    includeResume: boolean;
    includeCoverLetter: boolean;
};

export type CreateAdminApplicationShareLinkResponse = {
    success: true;
    message: string;
    shareLink: Omit<AdminApplicationShareLink, "createdBy"> & {
        sharePath: string;
        shareUrl: string;
    };
};

export type RevokeAdminApplicationShareLinkResponse = {
    success: true;
    message: string;
    shareLink: Omit<AdminApplicationShareLink, "createdBy">;
};
