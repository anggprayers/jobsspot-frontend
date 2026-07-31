import apiClient from "@/lib/apiClient";

import type { UpdateCompanyBrandingResponse } from "../types/managedCompany";

type DeleteCompanyLogoParameters = {
    companyId: string;
    accessToken: string;
};

export async function deleteCompanyLogo({
    companyId,
    accessToken,
}: DeleteCompanyLogoParameters): Promise<UpdateCompanyBrandingResponse> {
    const response = await apiClient.delete<UpdateCompanyBrandingResponse>(
        `/companies/${encodeURIComponent(companyId)}/logo`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    return response.data;
}
