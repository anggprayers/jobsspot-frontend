import apiClient from "@/lib/apiClient";

import type {
    UpdateCompanyApplicationStatusPayload,
    UpdateCompanyApplicationStatusResponse,
} from "../types/employerApplication";

type UpdateCompanyApplicationStatusParameters = {
    companyId: string;
    applicationId: string;
    payload: UpdateCompanyApplicationStatusPayload;
};

export async function updateCompanyApplicationStatus({
    companyId,
    applicationId,
    payload,
}: UpdateCompanyApplicationStatusParameters): Promise<UpdateCompanyApplicationStatusResponse> {
    const response = await apiClient.patch<UpdateCompanyApplicationStatusResponse>(
        `/companies/${encodeURIComponent(companyId)}/applications/${encodeURIComponent(
            applicationId,
        )}/status`,
        payload,
    );

    return response.data;
}
