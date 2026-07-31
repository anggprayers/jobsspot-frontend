import apiClient from "@/lib/apiClient";

import type { GetPublicCompanyBySlugResponse } from "../types/publicCompany";

export async function getPublicCompanyBySlug(
    slug: string,
): Promise<GetPublicCompanyBySlugResponse> {
    const response = await apiClient.get<GetPublicCompanyBySlugResponse>(
        `/companies/${encodeURIComponent(slug)}`,
    );

    return response.data;
}
