import apiClient from "@/lib/apiClient";

import type { GetCompanyApplicationCoverLetterDownloadResponse } from "../types/employerApplication";

type GetCompanyApplicationCoverLetterDownloadParameters = {
    companyId: string;
    applicationId: string;
};

export async function getCompanyApplicationCoverLetterDownload({
    companyId,
    applicationId,
}: GetCompanyApplicationCoverLetterDownloadParameters): Promise<GetCompanyApplicationCoverLetterDownloadResponse> {
    const response = await apiClient.get<GetCompanyApplicationCoverLetterDownloadResponse>(
        `/companies/${encodeURIComponent(companyId)}/applications/${encodeURIComponent(
            applicationId,
        )}/cover-letter-download`,
    );

    return response.data;
}
