import apiClient from "@/lib/apiClient";

import type { GetCompanyJobResponse } from "../types/companyJob";

type GetCompanyJobParameters = {
    companyId: string;
    jobId: string;
};

export async function getCompanyJob({
    companyId,
    jobId,
}: GetCompanyJobParameters): Promise<GetCompanyJobResponse> {
    const response = await apiClient.get<GetCompanyJobResponse>(
        `/companies/${encodeURIComponent(companyId)}/jobs/${encodeURIComponent(jobId)}`,
    );

    return response.data;
}
