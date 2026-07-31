import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCompanyJobs } from "../api/getCompanyJobs";
import type { CompanyJobsQueryParams } from "../types/companyJob";

export const companyJobsQueryKey = (companyId: string, params: CompanyJobsQueryParams = {}) =>
    [
        "company-jobs",
        companyId,
        {
            search: params.search ?? "",
            status: params.status ?? "",
            page: params.page ?? 1,
            limit: params.limit ?? 10,
        },
    ] as const;

type UseCompanyJobsParameters = {
    companyId: string;
    accessToken: string;
    params?: CompanyJobsQueryParams;
};

export function useCompanyJobs({ companyId, accessToken, params = {} }: UseCompanyJobsParameters) {
    return useQuery({
        queryKey: companyJobsQueryKey(companyId, params),

        queryFn: () =>
            getCompanyJobs({
                companyId,
                accessToken,
                params,
            }),

        enabled: Boolean(companyId && accessToken),

        placeholderData: keepPreviousData,
    });
}
