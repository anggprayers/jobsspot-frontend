import apiClient from "@/lib/apiClient";

import type { CompanyJobsQueryParams, GetCompanyJobsResponse } from "../types/companyJob";

type GetCompanyJobsParameters = {
    companyId: string;
    accessToken: string;
    params?: CompanyJobsQueryParams;
};

export async function getCompanyJobs({
    companyId,
    accessToken,
    params,
}: GetCompanyJobsParameters): Promise<GetCompanyJobsResponse> {
    const response = await apiClient.get<GetCompanyJobsResponse>(
        `/companies/${encodeURIComponent(companyId)}/jobs`,
        {
            params,

            // This can be removed later because your interceptor
            // already attaches the access token.
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    return response.data;
}
