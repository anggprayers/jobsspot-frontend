import type { AxiosProgressEvent } from "axios";

import apiClient from "@/lib/apiClient";

import type {
    DeleteResumeResponse,
    RenameResumeInput,
    ResumeDownloadResponse,
    ResumeListResponse,
    ResumeMutationResponse,
    ResumeProfilePreviewResponse,
    ImportResumeProfileRequest,
    ImportResumeProfileResponse,
    UploadResumeInput,
} from "../types/resume";

function calculateUploadPercentage(
    progressEvent: AxiosProgressEvent,
): number {
    if (!progressEvent.total) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((progressEvent.loaded / progressEvent.total) * 100),
    );
}

export async function getResumes(): Promise<ResumeListResponse> {
    const response = await apiClient.get<ResumeListResponse>("/resumes");

    return response.data;
}

export async function uploadResume({
    file,
    name,
    isDefault,
    onProgress,
}: UploadResumeInput): Promise<ResumeMutationResponse> {
    const formData = new FormData();

    formData.append("resume", file);

    if (name?.trim()) {
        formData.append("name", name.trim());
    }

    formData.append("isDefault", String(isDefault));

    const response = await apiClient.post<ResumeMutationResponse>(
        "/resumes",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                onProgress?.(
                    calculateUploadPercentage(progressEvent),
                );
            },
        },
    );

    return response.data;
}

export async function renameResume({
    resumeId,
    name,
}: RenameResumeInput): Promise<ResumeMutationResponse> {
    const response = await apiClient.patch<ResumeMutationResponse>(
        `/resumes/${resumeId}`,
        {
            name,
        },
    );

    return response.data;
}

export async function setDefaultResume(
    resumeId: string,
): Promise<ResumeMutationResponse> {
    const response = await apiClient.patch<ResumeMutationResponse>(
        `/resumes/${resumeId}/default`,
    );

    return response.data;
}

export async function getResumeDownload(
    resumeId: string,
): Promise<ResumeDownloadResponse> {
    const response = await apiClient.get<ResumeDownloadResponse>(
        `/resumes/${resumeId}/download`,
    );

    return response.data;
}

export async function deleteResume(
    resumeId: string,
): Promise<DeleteResumeResponse> {
    const response = await apiClient.delete<DeleteResumeResponse>(
        `/resumes/${resumeId}`,
    );

    return response.data;
}


export async function getResumeProfilePreview(
    resumeId: string,
): Promise<ResumeProfilePreviewResponse> {
    const response = await apiClient.get<ResumeProfilePreviewResponse>(
        `/resumes/${resumeId}/profile-preview`,
    );

    return response.data;
}

export async function importResumeProfile(
    resumeId: string,
    data: ImportResumeProfileRequest,
): Promise<ImportResumeProfileResponse> {
    const response = await apiClient.post<ImportResumeProfileResponse>(
        `/resumes/${resumeId}/profile-import`,
        data,
    );

    return response.data;
}
