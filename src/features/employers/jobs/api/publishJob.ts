import apiClient from "@/lib/apiClient";

import type { CompanyJob } from "../types/companyJob";

type PublishJobParams = {
    companyId: string;
    jobId: string;
};

type PublishJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export async function publishJob({
    companyId,
    jobId,
}: PublishJobParams): Promise<PublishJobResponse> {
    const response = await apiClient.patch<PublishJobResponse>(
        `/companies/${companyId}/jobs/${jobId}/publish`,
    );

    return response.data;
}
