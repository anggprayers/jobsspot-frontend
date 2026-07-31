import apiClient from "@/lib/apiClient";

import type { UpdateCompanyBrandingResponse } from "../types/managedCompany";

type UploadCompanyLogoParameters = {
    companyId: string;
    accessToken: string;
    file: File;
};

export async function uploadCompanyLogo({
    companyId,
    accessToken,
    file,
}: UploadCompanyLogoParameters): Promise<UpdateCompanyBrandingResponse> {
    const formData = new FormData();

    formData.append("image", file);

    const response = await apiClient.patch<UpdateCompanyBrandingResponse>(
        `/companies/${encodeURIComponent(companyId)}/logo`,
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
