import apiClient from "@/lib/apiClient";

import type {
    ApplicationCoverLetterDownloadResponse,
    ApplicationMutationResponse,
    ApplicationResumeDownloadResponse,
    CreateApplicationInput,
    GetApplicationForJobResponse,
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
): Promise<GetApplicationForJobResponse> {
    const response = await apiClient.get<GetApplicationForJobResponse>(
        `/applications/job/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}

export async function createApplication(
    input: CreateApplicationInput,
): Promise<ApplicationMutationResponse> {
    const formData = new FormData();
    formData.append("jobId", input.jobId);
    formData.append("resumeId", input.resumeId);

    if (input.coverLetter) {
        formData.append("coverLetter", input.coverLetter);
    }

    if (input.coverLetterFile) {
        formData.append("coverLetterFile", input.coverLetterFile);
    }

    const response = await apiClient.post<ApplicationMutationResponse>(
        "/applications",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
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

export async function getApplicationCoverLetterDownload(
    applicationId: string,
): Promise<ApplicationCoverLetterDownloadResponse> {
    const response =
        await apiClient.get<ApplicationCoverLetterDownloadResponse>(
            `/applications/${encodeURIComponent(
                applicationId,
            )}/cover-letter/download`,
        );

    return response.data;
}
