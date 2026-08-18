export type EmployerApplicationStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "OFFERED"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN";

export type ManageableEmployerApplicationStatus =
    "UNDER_REVIEW" | "INTERVIEW" | "OFFERED" | "HIRED" | "REJECTED";

export type EmployerApplicationJobStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";

export type EmployerApplication = {
    id: string;
    status: EmployerApplicationStatus;

    appliedAt: string;
    reviewedAt: string | null;
    withdrawnAt: string | null;
    updatedAt: string;

    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        isDeleted: boolean;
        phone: string | null;
        avatarUrl: string | null;

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
        status: EmployerApplicationJobStatus;
    };

    resume: {
        id: string;
        name: string;
        mimeType: string;
        fileSize: number;
    } | null;
};

export type EmployerApplicationDetails = {
    id: string;
    coverLetter: string | null;
    coverLetterFileName: string | null;
    coverLetterFileMimeType: string | null;
    coverLetterFileSize: number | null;
    status: EmployerApplicationStatus;

    appliedAt: string;
    reviewedAt: string | null;
    withdrawnAt: string | null;
    createdAt: string;
    updatedAt: string;

    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        isDeleted: boolean;
        phone: string | null;
        avatarUrl: string | null;
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

    job: {
        id: string;
        title: string;
        slug: string;
        status: EmployerApplicationJobStatus;

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

    resume: {
        id: string;
        name: string;
        mimeType: string;
        fileSize: number;
        createdAt: string;
    } | null;
};

export type GetCompanyApplicationResumeDownloadResponse = {
    success: true;
    message: string;
    resume: {
        id: string;
        name: string;
        mimeType: string;
        fileSize: number;
    };
    downloadUrl: string;
    expiresInSeconds: number;
};

export type EmployerApplicationsQueryParams = {
    search?: string;
    jobId?: string;
    status?: EmployerApplicationStatus;
    page?: number;
    limit?: number;
};

export type EmployerApplicationsSummary = {
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

export type EmployerApplicationJobOption = {
    id: string;
    title: string;
    status: EmployerApplicationJobStatus;
};

export type EmployerApplicationsPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetCompanyApplicationsResponse = {
    success: boolean;
    message: string;
    applications: EmployerApplication[];
    summary: EmployerApplicationsSummary;
    jobOptions: EmployerApplicationJobOption[];
    pagination: EmployerApplicationsPagination;
};

export type GetCompanyApplicationResponse = {
    success: boolean;
    message: string;
    application: EmployerApplicationDetails;
};

export type UpdateCompanyApplicationStatusPayload = {
    status: ManageableEmployerApplicationStatus;
};

export type UpdateCompanyApplicationStatusResponse = {
    success: boolean;
    message: string;
    application: EmployerApplication;
};

export type GetCompanyApplicationCoverLetterDownloadResponse = {
    success: true;
    message: string;
    coverLetterFile: {
        name: string;
        mimeType: string;
        fileSize: number;
    };
    downloadUrl: string;
    expiresInSeconds: number;
};
