import apiClient from "@/lib/apiClient";

import type { UpdateCompanyInput, UpdateCompanyResponse } from "../types/managedCompany";

type UpdateCompanyParameters = {
    companyId: string;
    accessToken: string;
    data: UpdateCompanyInput;
};

export async function updateCompany({
    companyId,
    accessToken,
    data,
}: UpdateCompanyParameters): Promise<UpdateCompanyResponse> {
    const response = await apiClient.patch<UpdateCompanyResponse>(
        `/companies/${encodeURIComponent(companyId)}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    return response.data;
}
