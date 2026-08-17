import type { JobFormValues } from "@/features/employers/jobs/validations/jobFormSchema";

import type { AdminPagination } from "../../users/types/adminUser";

export type JobSubmissionStatus =
    | "SUBMITTED"
    | "CONTACTED"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED";

export type JobSubmissionListStatus = "ALL" | JobSubmissionStatus;
export type JobSubmissionSort = "NEWEST" | "OLDEST";

export type JobSubmissionReviewer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type AdminJobSubmissionListItem = {
    id: string;
    referenceCode: string;
    jobTitle: string;
    companyName: string;
    locationText: string;
    workplaceType: "ONSITE" | "REMOTE" | "HYBRID";
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";
    salaryText: string | null;
    contactName: string | null;
    contactEmail: string;
    contactPhone: string | null;
    status: JobSubmissionStatus;
    contactedAt: string | null;
    reviewedAt: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    companyId: string | null;
    publishedJobId: string | null;
    reviewedBy: JobSubmissionReviewer | null;
};

export type AdminJobSubmissionDetails = AdminJobSubmissionListItem & {
    companyWebsite: string | null;
    description: string;
    internalNotes: string | null;
    company: {
        id: string;
        name: string;
        slug: string;
        websiteUrl: string | null;
        location: string | null;
        isVerified: boolean;
        suspendedAt: string | null;
        deletedAt: string | null;
    } | null;
    publishedJob: {
        id: string;
        title: string;
        slug: string;
        status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";
        publishedAt: string | null;
        expiresAt: string | null;
        deletedAt: string | null;
    } | null;
};

export type AdminJobSubmissionSummary = {
    total: number;
    byStatus: Record<JobSubmissionStatus, number>;
};

export type AdminJobSubmissionListParams = {
    page: number;
    limit: number;
    search?: string;
    status: JobSubmissionListStatus;
    sort: JobSubmissionSort;
};

export type AdminJobSubmissionsResponse = {
    success: true;
    message: string;
    submissions: AdminJobSubmissionListItem[];
    summary: AdminJobSubmissionSummary;
    pagination: AdminPagination;
};

export type AdminJobSubmissionResponse = {
    success: true;
    message: string;
    submission: AdminJobSubmissionDetails;
};

export type MarkJobSubmissionContactedRequest = {
    internalNotes?: string;
};

export type RejectJobSubmissionRequest = {
    reason: string;
};

export type ExistingSubmissionCompany = {
    mode: "EXISTING";
    companyId: string;
};

export type NewSubmissionCompany = {
    mode: "NEW";
    name: string;
    description?: string;
    websiteUrl?: string;
    industry?: string;
    companySize?: string;
    location?: string;
};

export type PublishJobSubmissionRequest = {
    company: ExistingSubmissionCompany | NewSubmissionCompany;
    job: {
        categoryId: string;
        title: string;
        description: string;
        requirements?: string;
        responsibilities?: string;
        employmentType: JobFormValues["employmentType"];
        workplaceType: JobFormValues["workplaceType"];
        experienceLevel: JobFormValues["experienceLevel"];
        city?: string | null;
        stateRegion?: string | null;
        countryCode: string;
        salaryMin?: number;
        salaryMax?: number;
        salaryCurrency: string;
        salaryPeriod?: Exclude<JobFormValues["salaryPeriod"], "">;
        applicationDeadline?: string;
    };
    internalNotes?: string;
};

export type PublishJobSubmissionResponse = {
    success: true;
    message: string;
    submission: AdminJobSubmissionListItem;
    company: {
        id: string;
        name: string;
        slug: string;
        websiteUrl: string | null;
        location: string | null;
    };
    job: {
        id: string;
        title: string;
        slug: string;
        status: "PUBLISHED";
        publishedAt: string;
        expiresAt: string;
        companyId: string;
        categoryId: string;
    };
};
