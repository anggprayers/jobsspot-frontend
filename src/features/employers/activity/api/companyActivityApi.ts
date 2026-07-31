import apiClient from "@/lib/apiClient";

import type { GetCompanyActivityParameters, GetCompanyActivityResponse } from "../types/activity";

// GET /api/companies/:companyId/activity
// Retrieve and filter the active company's audit trail.
export async function getCompanyActivity(
    companyId: string,
    parameters: GetCompanyActivityParameters = {},
): Promise<GetCompanyActivityResponse> {
    const response = await apiClient.get<GetCompanyActivityResponse>(
        `/companies/${encodeURIComponent(companyId)}/activity`,
        {
            params: {
                page: parameters.page ?? 1,
                limit: parameters.limit ?? 20,

                ...(parameters.action && {
                    action: parameters.action,
                }),

                ...(parameters.entityType && {
                    entityType: parameters.entityType,
                }),
            },
        },
    );

    return response.data;
}
