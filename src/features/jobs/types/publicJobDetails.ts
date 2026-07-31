import type { PublicJobCategory, PublicJobCompany } from "./publicJob";

export type PublicJobDetails = {
    id: string;
    title: string;
    slug: string;
    description: string;
    requirements: string | null;
    responsibilities: string | null;
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

export type GetPublicJobBySlugResponse = {
    success: boolean;
    message: string;
    job: PublicJobDetails;
};
