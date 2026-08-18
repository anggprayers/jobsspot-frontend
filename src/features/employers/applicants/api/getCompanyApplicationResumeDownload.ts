import apiClient from "@/lib/apiClient";

import type { GetCompanyApplicationResumeDownloadResponse } from "../types/employerApplication";

type GetCompanyApplicationResumeDownloadParameters = {
    companyId: string;
    applicationId: string;
};

export async function getCompanyApplicationResumeDownload({
    companyId,
    applicationId,
}: GetCompanyApplicationResumeDownloadParameters): Promise<GetCompanyApplicationResumeDownloadResponse> {
    const response = await apiClient.get<GetCompanyApplicationResumeDownloadResponse>(
        `/companies/${encodeURIComponent(companyId)}/applications/${encodeURIComponent(
            applicationId,
        )}/resume-download`,
    );

    return response.data;
}
