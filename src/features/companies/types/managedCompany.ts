export type ManagedCompany = {
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
};

export type GetManagedCompanyResponse = {
    success: boolean;
    message: string;
    company: ManagedCompany;
};

export type UpdateCompanyInput = {
    name?: string;
    description?: string | null;
    websiteUrl?: string | null;
    industry?: string | null;
    companySize?: string | null;
    location?: string | null;
};

export type UpdateCompanyResponse = {
    success: boolean;
    message: string;
    company: ManagedCompany;
};

export type CompanyBrandingUpdate = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    updatedAt: string;
};

export type UpdateCompanyBrandingResponse = {
    success: boolean;
    message: string;
    company: CompanyBrandingUpdate;
};
