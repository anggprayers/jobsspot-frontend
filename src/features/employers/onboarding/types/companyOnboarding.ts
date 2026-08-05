import type {
    CompanyMemberRole,
} from "@/features/auth/types/auth";

export type CreateCompanyInput = {
    name: string;
    description?: string;
    websiteUrl?: string;
    industry?: string;
    companySize?: string;
    location?: string;
};

export type CreatedCompany = {
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

export type CreatedCompanyMembership = {
    id: string;
    companyId: string;
    userId: string;
    role: CompanyMemberRole;
    joinedAt: string;
};

export type CreateCompanyResponse = {
    success: true;
    message: string;
    company: CreatedCompany;
    membership: CreatedCompanyMembership;
};
