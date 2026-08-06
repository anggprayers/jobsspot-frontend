import apiClient from "@/lib/apiClient";

import type {
    AdminCompaniesResponse,
    AdminCompanyListParams,
    AdminCompanyResponse,
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
