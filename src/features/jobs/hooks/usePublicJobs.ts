"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicJobs } from "../api/getPublicJobs";

export type UsePublicJobsParams = {
    page?: number;
    limit?: number;
    sort?: "newest" | "oldest" | "salary_high" | "salary_low";
    search?: string;
    category?: string;
    location?: string;
    employmentType?: string;
    workplaceType?: string;
    experienceLevel?: string;
};

export function publicJobsQueryKey(params: UsePublicJobsParams = {}) {
    return [
        "public-jobs",
        {
            page: params.page ?? 1,
            limit: params.limit ?? 12,
            sort: params.sort ?? "newest",
            search: params.search ?? "",
            category: params.category ?? "",
            location: params.location ?? "",
            employmentType: params.employmentType ?? "",
            workplaceType: params.workplaceType ?? "",
            experienceLevel: params.experienceLevel ?? "",
        },
    ] as const;
}

export function usePublicJobs(params: UsePublicJobsParams = {}) {
    return useQuery({
        queryKey: publicJobsQueryKey(params),
        queryFn: () => getPublicJobs(params),
        staleTime: 1000 * 60 * 2,
    });
}
