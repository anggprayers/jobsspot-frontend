import apiClient from "@/lib/apiClient";

import type {
    AdminCompaniesResponse,
    AdminCompanyListParams,
    AdminCompanyResponse,
    AdminCompanyMutationResponse,
    CreateAdminCompanyRequest,
    UpdateAdminCompanyRequest,
    UpdateAdminCompanyResponse,
    UpdateAdminCompanySuspensionRequest,
    UpdateAdminCompanyVerificationRequest,
} from "../types/adminCompany";

export async function getAdminCompanies(
    params: AdminCompanyListParams,
): Promise<AdminCompaniesResponse> {
    const response = await apiClient.get<AdminCompaniesResponse>("/admin/companies", {
        params,
    });

    return response.data;
}

export async function getAdminCompany(
    companyId: string,
): Promise<AdminCompanyResponse> {
    const response = await apiClient.get<AdminCompanyResponse>(
        `/admin/companies/${companyId}`,
    );

    return response.data;
}

export async function updateAdminCompanySuspension(
    companyId: string,
    input: UpdateAdminCompanySuspensionRequest,
): Promise<UpdateAdminCompanyResponse> {
    const response = await apiClient.patch<UpdateAdminCompanyResponse>(
        `/admin/companies/${companyId}/suspension`,
        input,
    );

    return response.data;
}

export async function updateAdminCompanyVerification(
    companyId: string,
    input: UpdateAdminCompanyVerificationRequest,
): Promise<UpdateAdminCompanyResponse> {
    const response = await apiClient.patch<UpdateAdminCompanyResponse>(
        `/admin/companies/${companyId}/verification`,
        input,
    );

    return response.data;
}

export async function createAdminCompany(
    input: CreateAdminCompanyRequest,
): Promise<AdminCompanyMutationResponse> {
    const response = await apiClient.post<AdminCompanyMutationResponse>("/admin/companies", input);
    return response.data;
}

export async function updateAdminCompany(
    companyId: string,
    input: UpdateAdminCompanyRequest,
): Promise<AdminCompanyMutationResponse> {
    const response = await apiClient.patch<AdminCompanyMutationResponse>(
        `/admin/companies/${companyId}`,
        input,
    );
    return response.data;
}
