import apiClient from "@/lib/apiClient";

import type {
    GetSavedJobsParams,
    GetSavedJobsResponse,
    RemoveSavedJobResponse,
    SaveJobResponse,
    SavedJobStatusResponse,
} from "../types/savedJob";

export async function getSavedJobs(
    params: GetSavedJobsParams = {},
): Promise<GetSavedJobsResponse> {
    const response = await apiClient.get<GetSavedJobsResponse>(
        "/saved-jobs",
        {
            params,
        },
    );

    return response.data;
}

export async function getSavedJobStatus(
    jobId: string,
): Promise<SavedJobStatusResponse> {
    const response = await apiClient.get<SavedJobStatusResponse>(
        `/saved-jobs/job/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}

export async function saveJob(
    jobId: string,
): Promise<SaveJobResponse> {
    const response = await apiClient.post<SaveJobResponse>(
        `/saved-jobs/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}

export async function removeSavedJob(
    jobId: string,
): Promise<RemoveSavedJobResponse> {
    const response = await apiClient.delete<RemoveSavedJobResponse>(
        `/saved-jobs/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}
