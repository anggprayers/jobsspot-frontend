import apiClient from "@/lib/apiClient";

import type {
    EmployerApplicationsQueryParams,
    GetCompanyApplicationsResponse,
} from "../types/employerApplication";

type GetCompanyApplicationsParameters = {
    companyId: string;
    params?: EmployerApplicationsQueryParams;
};

export async function getCompanyApplications({
    companyId,
    params,
}: GetCompanyApplicationsParameters): Promise<GetCompanyApplicationsResponse> {
    const response = await apiClient.get<GetCompanyApplicationsResponse>(
        `/companies/${encodeURIComponent(companyId)}/applications`,
        {
            params,
        },
    );

    return response.data;
}
