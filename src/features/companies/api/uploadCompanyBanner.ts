import apiClient from "@/lib/apiClient";

import type { UpdateCompanyBrandingResponse } from "../types/managedCompany";

type UploadCompanyBannerParameters = {
    companyId: string;
    accessToken: string;
    file: File;
};

export async function uploadCompanyBanner({
    companyId,
    accessToken,
    file,
}: UploadCompanyBannerParameters): Promise<UpdateCompanyBrandingResponse> {
    const formData = new FormData();

    formData.append("image", file);

    const response = await apiClient.patch<UpdateCompanyBrandingResponse>(
        `/companies/${encodeURIComponent(companyId)}/banner`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return response.data;
}
