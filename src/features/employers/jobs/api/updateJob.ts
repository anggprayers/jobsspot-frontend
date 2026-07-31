import apiClient from "@/lib/apiClient";

import { mapJobFormToPayload, type CompanyJob } from "../types/companyJob";
import type { JobFormValues } from "../validations/jobFormSchema";

type UpdateJobParams = {
    companyId: string;
    jobId: string;
    values: JobFormValues;
};

type UpdateJobResponse = {
    success: boolean;
    message: string;
    job: CompanyJob;
};

export async function updateJob({
    companyId,
    jobId,
    values,
}: UpdateJobParams): Promise<UpdateJobResponse> {
    const payload = mapJobFormToPayload(values);

    const response = await apiClient.patch<UpdateJobResponse>(
        `/companies/${companyId}/jobs/${jobId}`,
        payload,
    );

    return response.data;
}
