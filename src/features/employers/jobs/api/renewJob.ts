import apiClient from "@/lib/apiClient";

import type { CompanyJob } from "../types/companyJob";

type RenewJobParameters = {
    companyId: string;
    jobId: string;
};

type RenewJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export async function renewJob({
    companyId,
    jobId,
}: RenewJobParameters): Promise<RenewJobResponse> {
    const response =
        await apiClient.patch<RenewJobResponse>(
            `/companies/${encodeURIComponent(
                companyId,
            )}/jobs/${encodeURIComponent(
                jobId,
            )}/renew`,
        );

    return response.data;
}
