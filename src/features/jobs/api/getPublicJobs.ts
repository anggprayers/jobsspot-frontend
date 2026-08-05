import apiClient from "@/lib/apiClient";

import type { GetPublicJobsResponse } from "../types/publicJob";

export type GetPublicJobsParams = {
    page?: number;
    limit?: number;
    sort?:
        | "newest"
        | "oldest"
        | "salary_high"
        | "salary_low";
    search?: string;
    category?: string;
    location?: string;
    employmentType?: string;
    workplaceType?: string;
    experienceLevel?: string;
    salaryPeriod?: string;
    salaryMin?: string | number;
    salaryMax?: string | number;
    salaryCurrency?: string;
    publishedWithinDays?: string | number;
};

export async function getPublicJobs(
    params: GetPublicJobsParams = {},
): Promise<GetPublicJobsResponse> {
    const response =
        await apiClient.get<GetPublicJobsResponse>(
            "/jobs",
            {
                params,
            },
        );

    return response.data;
}
