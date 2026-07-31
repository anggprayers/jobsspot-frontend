import apiClient from "@/lib/apiClient";

import type { GetJobCategoriesResponse } from "../types/jobCategory";

export async function getJobCategories(): Promise<GetJobCategoriesResponse> {
    const response = await apiClient.get<GetJobCategoriesResponse>("/job-categories");

    return response.data;
}
