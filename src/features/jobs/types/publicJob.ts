export type PublicJobCompany = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
};

export type PublicJobCategory = {
    id: string;
    name: string;
    slug: string;
};

export type PublicJob = {
    id: string;
    title: string;
    slug: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    location: string;
    salaryMin: string | null;
    salaryMax: string | null;
    salaryCurrency: string | null;
    salaryPeriod: string | null;
    applicationDeadline: string | null;
    publishedAt: string | null;
    expiresAt: string | null;
    company: PublicJobCompany;
    category: PublicJobCategory;
};

export type PublicJobsPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetPublicJobsResponse = {
    success: boolean;
    message: string;
    jobs: PublicJob[];
    pagination: PublicJobsPagination;
};
