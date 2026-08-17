import apiClient from "@/lib/apiClient";

import type {
    AdminApplicationFileDownloadResponse,
    AdminApplicationListParams,
    AdminApplicationResponse,
    AdminApplicationsResponse,
    AdminApplicationStatusRequest,
    CreateAdminApplicationShareLinkRequest,
    CreateAdminApplicationShareLinkResponse,
    RevokeAdminApplicationShareLinkResponse,
} from "../types/adminApplication";

export async function getAdminApplications(
    params: AdminApplicationListParams,
): Promise<AdminApplicationsResponse> {
    const response = await apiClient.get<AdminApplicationsResponse>("/admin/applications", { params });
    return response.data;
}

export async function getAdminApplication(applicationId: string): Promise<AdminApplicationResponse> {
    const response = await apiClient.get<AdminApplicationResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}`,
    );
    return response.data;
}

export async function getAdminApplicationResumeDownload(
    applicationId: string,
): Promise<AdminApplicationFileDownloadResponse> {
    const response = await apiClient.get<AdminApplicationFileDownloadResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}/resume-download`,
    );
    return response.data;
}

export async function getAdminApplicationCoverLetterDownload(
    applicationId: string,
): Promise<AdminApplicationFileDownloadResponse> {
    const response = await apiClient.get<AdminApplicationFileDownloadResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}/cover-letter-download`,
    );
    return response.data;
}

export async function updateAdminApplicationStatus(
    applicationId: string,
    input: AdminApplicationStatusRequest,
): Promise<AdminApplicationResponse> {
    const response = await apiClient.patch<AdminApplicationResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}/status`,
        input,
    );
    return response.data;
}

export async function createAdminApplicationShareLink(
    applicationId: string,
    input: CreateAdminApplicationShareLinkRequest,
): Promise<CreateAdminApplicationShareLinkResponse> {
    const response = await apiClient.post<CreateAdminApplicationShareLinkResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}/share-links`,
        input,
    );
    return response.data;
}

export async function revokeAdminApplicationShareLink(
    applicationId: string,
    shareLinkId: string,
): Promise<RevokeAdminApplicationShareLinkResponse> {
    const response = await apiClient.post<RevokeAdminApplicationShareLinkResponse>(
        `/admin/applications/${encodeURIComponent(applicationId)}/share-links/${encodeURIComponent(shareLinkId)}/revoke`,
    );
    return response.data;
}
