import apiClient from "@/lib/apiClient";

import type {
    ApplicationMutationResponse,
    ApplicationResumeDownloadResponse,
    CreateApplicationInput,
    GetApplicationResponse,
    GetApplicationsParams,
    GetApplicationsResponse,
} from "../types/application";

export async function getApplications(
    params: GetApplicationsParams = {},
): Promise<GetApplicationsResponse> {
    const response = await apiClient.get<GetApplicationsResponse>(
        "/applications",
        {
            params,
        },
    );

    return response.data;
}

export async function getApplicationById(
    applicationId: string,
): Promise<GetApplicationResponse> {
    const response = await apiClient.get<GetApplicationResponse>(
        `/applications/${encodeURIComponent(applicationId)}`,
    );

    return response.data;
}

export async function getApplicationForJob(
    jobId: string,
): Promise<GetApplicationResponse> {
    const response = await apiClient.get<GetApplicationResponse>(
        `/applications/job/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}

export async function createApplication(
    input: CreateApplicationInput,
): Promise<ApplicationMutationResponse> {
    const response = await apiClient.post<ApplicationMutationResponse>(
        "/applications",
        input,
    );

    return response.data;
}

export async function withdrawApplication(
    applicationId: string,
): Promise<ApplicationMutationResponse> {
    const response = await apiClient.patch<ApplicationMutationResponse>(
        `/applications/${encodeURIComponent(applicationId)}/withdraw`,
    );

    return response.data;
}
export async function getApplicationResumeDownload(
    applicationId: string,
): Promise<ApplicationResumeDownloadResponse> {
    const response =
        await apiClient.get<ApplicationResumeDownloadResponse>(
            `/applications/${encodeURIComponent(
                applicationId,
            )}/resume/download`,
        );

    return response.data;
}
