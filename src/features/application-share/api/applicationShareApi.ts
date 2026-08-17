import apiClient from "@/lib/apiClient";
import type { SharedApplicationDownloadResponse, SharedApplicationResponse } from "../types/applicationShare";

export async function getSharedApplication(token: string): Promise<SharedApplicationResponse> {
    const response = await apiClient.get<SharedApplicationResponse>(`/application-shares/${encodeURIComponent(token)}`);
    return response.data;
}

export async function getSharedResumeDownload(token: string): Promise<SharedApplicationDownloadResponse> {
    const response = await apiClient.get<SharedApplicationDownloadResponse>(`/application-shares/${encodeURIComponent(token)}/resume-download`);
    return response.data;
}

export async function getSharedCoverLetterDownload(token: string): Promise<SharedApplicationDownloadResponse> {
    const response = await apiClient.get<SharedApplicationDownloadResponse>(`/application-shares/${encodeURIComponent(token)}/cover-letter-download`);
    return response.data;
}
