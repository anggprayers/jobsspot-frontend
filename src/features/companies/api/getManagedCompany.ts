import apiClient from "@/lib/apiClient";

import type { GetManagedCompanyResponse } from "../types/managedCompany";

type GetManagedCompanyParameters = {
    companyId: string;
    accessToken: string;
};

export async function getManagedCompany({
    companyId,
    accessToken,
}: GetManagedCompanyParameters): Promise<GetManagedCompanyResponse> {
    const response = await apiClient.get<GetManagedCompanyResponse>(
        `/companies/${encodeURIComponent(companyId)}/manage`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    return response.data;
}
