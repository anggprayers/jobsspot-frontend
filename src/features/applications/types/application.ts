export type ApplicationStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "OFFERED"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN";

export type ApplicationCompany = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
};

export type ApplicationCategory = {
    id: string;
    name: string;
    slug: string;
};

export type ApplicationJob = {
    id: string;
    title: string;
    slug: string;
    status: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    location: string | null;
    applicationDeadline: string | null;
    publishedAt: string | null;
    expiresAt: string | null;
    company: ApplicationCompany;
    category: ApplicationCategory;
};

export type ApplicationResume = {
    id: string;
    name: string;
    mimeType: string;
    fileSize: number;
    isDefault: boolean;
};

export type JobSeekerApplication = {
    id: string;
    coverLetter: string | null;
    status: ApplicationStatus;
    appliedAt: string;
    reviewedAt: string | null;
    withdrawnAt: string | null;
    createdAt: string;
    updatedAt: string;
    job: ApplicationJob;
    resume: ApplicationResume | null;
};

export type ApplicationsSummary = {
    totalApplications: number;
    submitted: number;
    underReview: number;
    shortlisted: number;
    interviews: number;
    offered: number;
    hired: number;
    rejected: number;
    withdrawn: number;
};

export type ApplicationsPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetApplicationsParams = {
    status?: ApplicationStatus;
    page?: number;
    limit?: number;
};

export type GetApplicationsResponse = {
    success: true;
    message: string;
    applications: JobSeekerApplication[];
    summary: ApplicationsSummary;
    pagination: ApplicationsPagination;
};

export type GetApplicationResponse = {
    success: true;
    message?: string;
    application: JobSeekerApplication | null;
};

export type CreateApplicationInput = {
    jobId: string;
    resumeId: string;
    coverLetter: string | null;
};

export type ApplicationMutationResponse = {
    success: true;
    message: string;
    application: JobSeekerApplication;
};
export type ApplicationResumeDownloadResponse = {
    success: true;
    resume: Pick<ApplicationResume, "id" | "name" | "mimeType">;
    downloadUrl: string;
    expiresInSeconds: number;
};
