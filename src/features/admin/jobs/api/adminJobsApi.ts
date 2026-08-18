import apiClient from "@/lib/apiClient";

import type {
    AdminJobListParams,
    AdminJobMutationResponse,
    CreateAdminJobRequest,
    PublishAdminJobRequest,
    UpdateAdminJobRequest,
    AdminJobResponse,
    AdminJobsResponse,
    UpdateAdminJobModerationRequest,
    UpdateAdminJobModerationResponse,
} from "../types/adminJob";

export async function getAdminJobs(params: AdminJobListParams): Promise<AdminJobsResponse> {
    const response = await apiClient.get<AdminJobsResponse>("/admin/jobs", { params });
    return response.data;
}

export async function getAdminJob(jobId: string): Promise<AdminJobResponse> {
    const response = await apiClient.get<AdminJobResponse>(`/admin/jobs/${encodeURIComponent(jobId)}`);
    return response.data;
}

export async function updateAdminJobModeration(
    jobId: string,
    input: UpdateAdminJobModerationRequest,
): Promise<UpdateAdminJobModerationResponse> {
    const response = await apiClient.patch<UpdateAdminJobModerationResponse>(
        `/admin/jobs/${encodeURIComponent(jobId)}/moderation`,
        input,
    );
    return response.data;
}


export async function createAdminJob(input: CreateAdminJobRequest): Promise<AdminJobMutationResponse> {
    const response = await apiClient.post<AdminJobMutationResponse>("/admin/jobs", input);
    return response.data;
}

export async function updateAdminJob(jobId: string, input: UpdateAdminJobRequest): Promise<AdminJobMutationResponse> {
    const response = await apiClient.patch<AdminJobMutationResponse>(`/admin/jobs/${encodeURIComponent(jobId)}`, input);
    return response.data;
}

export async function publishAdminJob(jobId: string, input: PublishAdminJobRequest): Promise<AdminJobMutationResponse> {
    const response = await apiClient.post<AdminJobMutationResponse>(`/admin/jobs/${encodeURIComponent(jobId)}/publish`, input);
    return response.data;
}

export async function archiveAdminJob(jobId: string): Promise<AdminJobMutationResponse> {
    const response = await apiClient.post<AdminJobMutationResponse>(`/admin/jobs/${encodeURIComponent(jobId)}/archive`);
    return response.data;
}
