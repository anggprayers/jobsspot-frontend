"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompanyJob } from "../api/getCompanyJob";

export const companyJobQueryKey = (companyId: string, jobId: string) =>
    ["company-job", companyId, jobId] as const;

type UseCompanyJobOptions = {
    companyId: string;
    jobId: string;
};

export function useCompanyJob({ companyId, jobId }: UseCompanyJobOptions) {
    return useQuery({
        queryKey: companyJobQueryKey(companyId, jobId),

        queryFn: () =>
            getCompanyJob({
                companyId,
                jobId,
            }),

        enabled: Boolean(companyId && jobId),
    });
}
