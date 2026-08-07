import apiClient from "@/lib/apiClient";

import type {
    AdminJobListParams,
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
