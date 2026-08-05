"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getPublicJobs,
    type GetPublicJobsParams,
} from "../api/getPublicJobs";

export type UsePublicJobsParams =
    GetPublicJobsParams;

export function publicJobsQueryKey(
    params: UsePublicJobsParams = {},
) {
    return [
        "public-jobs",
        {
            page: params.page ?? 1,
            limit: params.limit ?? 12,
            sort: params.sort ?? "newest",
            search: params.search ?? "",
            category: params.category ?? "",
            location: params.location ?? "",
            employmentType:
                params.employmentType ?? "",
            workplaceType:
                params.workplaceType ?? "",
            experienceLevel:
                params.experienceLevel ?? "",
            salaryPeriod:
                params.salaryPeriod ?? "",
            salaryMin: params.salaryMin ?? "",
            salaryMax: params.salaryMax ?? "",
            salaryCurrency:
                params.salaryCurrency ?? "",
            publishedWithinDays:
                params.publishedWithinDays ?? "",
        },
    ] as const;
}

export function usePublicJobs(
    params: UsePublicJobsParams = {},
) {
    return useQuery({
        queryKey: publicJobsQueryKey(params),
        queryFn: () => getPublicJobs(params),
        staleTime: 1000 * 60 * 2,
    });
}
