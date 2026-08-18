import apiClient from "@/lib/apiClient";

import type {
    AdminJobSubmissionListParams,
    AdminJobSubmissionResponse,
    AdminJobSubmissionsResponse,
    MarkJobSubmissionContactedRequest,
    PublishJobSubmissionRequest,
    PublishJobSubmissionResponse,
    RejectJobSubmissionRequest,
} from "../types/adminJobSubmission";

export async function getAdminJobSubmissions(
    params: AdminJobSubmissionListParams,
): Promise<AdminJobSubmissionsResponse> {
    const response = await apiClient.get<AdminJobSubmissionsResponse>("/admin/job-submissions", {
        params,
    });

    return response.data;
}

export async function getAdminJobSubmission(
    submissionId: string,
): Promise<AdminJobSubmissionResponse> {
    const response = await apiClient.get<AdminJobSubmissionResponse>(
        `/admin/job-submissions/${encodeURIComponent(submissionId)}`,
    );

    return response.data;
}

export async function markAdminJobSubmissionContacted(
    submissionId: string,
    input: MarkJobSubmissionContactedRequest,
): Promise<AdminJobSubmissionResponse> {
    const response = await apiClient.patch<AdminJobSubmissionResponse>(
        `/admin/job-submissions/${encodeURIComponent(submissionId)}/contacted`,
        input,
    );

    return response.data;
}

export async function rejectAdminJobSubmission(
    submissionId: string,
    input: RejectJobSubmissionRequest,
): Promise<AdminJobSubmissionResponse> {
    const response = await apiClient.patch<AdminJobSubmissionResponse>(
        `/admin/job-submissions/${encodeURIComponent(submissionId)}/reject`,
        input,
    );

    return response.data;
}

export async function publishAdminJobSubmission(
    submissionId: string,
    input: PublishJobSubmissionRequest,
): Promise<PublishJobSubmissionResponse> {
    const response = await apiClient.post<PublishJobSubmissionResponse>(
        `/admin/job-submissions/${encodeURIComponent(submissionId)}/publish`,
        input,
    );

    return response.data;
}
