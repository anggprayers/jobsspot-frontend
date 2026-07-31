"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCompanyApplications } from "../api/getCompanyApplications";
import type { EmployerApplicationsQueryParams } from "../types/employerApplication";

export const companyApplicationsQueryKey = (
    companyId: string,
    params: EmployerApplicationsQueryParams = {},
) =>
    [
        "company-applications",
        companyId,
        {
            search: params.search ?? "",
            jobId: params.jobId ?? "",
            status: params.status ?? "",
            page: params.page ?? 1,
            limit: params.limit ?? 10,
        },
    ] as const;

type UseCompanyApplicationsParameters = {
    companyId: string;
    params?: EmployerApplicationsQueryParams;
};

export function useCompanyApplications({
    companyId,
    params = {},
}: UseCompanyApplicationsParameters) {
    return useQuery({
        queryKey: companyApplicationsQueryKey(companyId, params),

        queryFn: () =>
            getCompanyApplications({
                companyId,
                params,
            }),

        enabled: Boolean(companyId),

        placeholderData: keepPreviousData,
    });
}
