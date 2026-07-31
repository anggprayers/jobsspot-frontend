import apiClient from "@/lib/apiClient";

import type { CompanyJob } from "../types/companyJob";

type UnpublishJobParams = {
    companyId: string;
    jobId: string;
};

type UnpublishJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export async function unpublishJob({
    companyId,
    jobId,
}: UnpublishJobParams): Promise<UnpublishJobResponse> {
    const response = await apiClient.patch<UnpublishJobResponse>(
        `/companies/${companyId}/jobs/${jobId}/unpublish`,
    );

    return response.data;
}
