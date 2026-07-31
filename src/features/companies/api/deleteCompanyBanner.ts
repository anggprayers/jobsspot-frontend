import apiClient from "@/lib/apiClient";

import type { UpdateCompanyBrandingResponse } from "../types/managedCompany";

type DeleteCompanyBannerParameters = {
    companyId: string;
    accessToken: string;
};

export async function deleteCompanyBanner({
    companyId,
    accessToken,
}: DeleteCompanyBannerParameters): Promise<UpdateCompanyBrandingResponse> {
    const response = await apiClient.delete<UpdateCompanyBrandingResponse>(
        `/companies/${encodeURIComponent(companyId)}/banner`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    return response.data;
}
