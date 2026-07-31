export type PublicCompanyJobCategory = {
    id: string;
    name: string;
    slug: string;
};

export type PublicCompanyJob = {
    id: string;
    title: string;
    slug: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    location: string | null;
    salaryMin: string | null;
    salaryMax: string | null;
    salaryCurrency: string | null;
    salaryPeriod: string | null;
    publishedAt: string | null;
    createdAt: string;
    category: PublicCompanyJobCategory;
};

export type PublicCompany = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    industry: string | null;
    companySize: string | null;
    location: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    openJobsCount: number;
    jobs: PublicCompanyJob[];
};

export type GetPublicCompanyBySlugResponse = {
    success: boolean;
    message: string;
    company: PublicCompany;
};
