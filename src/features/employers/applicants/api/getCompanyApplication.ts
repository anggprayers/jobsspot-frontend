import apiClient from "@/lib/apiClient";

import type { GetCompanyApplicationResponse } from "../types/employerApplication";

type GetCompanyApplicationParameters = {
    companyId: string;
    applicationId: string;
};

export async function getCompanyApplication({
    companyId,
    applicationId,
}: GetCompanyApplicationParameters): Promise<GetCompanyApplicationResponse> {
    const response = await apiClient.get<GetCompanyApplicationResponse>(
        `/companies/${encodeURIComponent(companyId)}/applications/${encodeURIComponent(
            applicationId,
        )}`,
    );

    return response.data;
}
