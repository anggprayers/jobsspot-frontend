import apiClient from "@/lib/apiClient";

import type { CreateJobPayload, CreateJobResponse } from "../types/companyJob";

type CreateJobParameters = {
    companyId: string;
    payload: CreateJobPayload;
};

export async function createJob({
    companyId,
    payload,
}: CreateJobParameters): Promise<CreateJobResponse> {
    const response = await apiClient.post<CreateJobResponse>(
        `/companies/${encodeURIComponent(companyId)}/jobs`,
        payload,
    );

    return response.data;
}
