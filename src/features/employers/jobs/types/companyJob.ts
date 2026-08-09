import type { JobFormValues } from "../validations/jobFormSchema";

export type CompanyJob = {
    id: string;
    title: string;
    slug: string;

    description: string;
    requirements: string | null;
    responsibilities: string | null;

    status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";

    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";

    workplaceType: "ONSITE" | "REMOTE" | "HYBRID";

    experienceLevel: "ENTRY_LEVEL" | "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE";

    location: string | null;

    salaryMin: string | null;
    salaryMax: string | null;
    salaryCurrency: string | null;

    salaryPeriod: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;

    applicationDeadline: string | null;

    publishedAt: string | null;
    expiresAt: string | null;
    adminHiddenAt: string | null;
    adminHiddenReason: string | null;
    isExpired: boolean;
    daysUntilExpiration: number | null;

    createdAt: string;
    updatedAt: string;

    category: {
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
    };

    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
};

export type CompanyJobStatus = CompanyJob["status"];

export type CompanyJobsQueryParams = {
    search?: string;
    status?: CompanyJobStatus;
    page?: number;
    limit?: number;
};

export type CompanyJobsSummary = {
    totalJobs: number;
    publishedJobs: number;
    expiredJobs: number;
    draftJobs: number;
    pausedJobs: number;
    closedJobs: number;
    archivedJobs: number;
};

export type CompanyJobsPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetCompanyJobsResponse = {
    success: boolean;
    message: string;
    jobs: CompanyJob[];
    summary: CompanyJobsSummary;
    pagination: CompanyJobsPagination;
};

export type GetCompanyJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export type CreateJobPayload = {
    categoryId: string;
    title: string;
    description: string;

    requirements?: string;
    responsibilities?: string;

    employmentType: JobFormValues["employmentType"];
    workplaceType: JobFormValues["workplaceType"];
    experienceLevel: JobFormValues["experienceLevel"];

    location?: string;

    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency: string;

    salaryPeriod?: Exclude<JobFormValues["salaryPeriod"], "">;

    applicationDeadline?: string;
};

export type CreateJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export function mapJobFormToPayload(values: JobFormValues): CreateJobPayload {
    return {
        categoryId: values.categoryId,
        title: values.title.trim(),
        description: values.description.trim(),

        ...(values.requirements.trim() && {
            requirements: values.requirements.trim(),
        }),

        ...(values.responsibilities.trim() && {
            responsibilities: values.responsibilities.trim(),
        }),

        employmentType: values.employmentType,
        workplaceType: values.workplaceType,
        experienceLevel: values.experienceLevel,

        ...(values.location.trim() && {
            location: values.location.trim(),
        }),

        ...(values.salaryMin !== "" && {
            salaryMin: Number(values.salaryMin),
        }),

        ...(values.salaryMax !== "" && {
            salaryMax: Number(values.salaryMax),
        }),

        salaryCurrency: values.salaryCurrency.toUpperCase(),

        ...(values.salaryPeriod !== "" && {
            salaryPeriod: values.salaryPeriod,
        }),

        ...(values.applicationDeadline && {
            applicationDeadline: new Date(`${values.applicationDeadline}T23:59:59`).toISOString(),
        }),
    };
}
