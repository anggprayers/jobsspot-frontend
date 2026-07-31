import apiClient from "@/lib/apiClient";

import type { GetPublicJobBySlugResponse } from "../types/publicJobDetails";

export async function getPublicJobBySlug(slug: string): Promise<GetPublicJobBySlugResponse> {
    const response = await apiClient.get<GetPublicJobBySlugResponse>(
        `/jobs/${encodeURIComponent(slug)}`,
    );

    return response.data;
}
