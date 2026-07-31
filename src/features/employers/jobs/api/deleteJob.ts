import apiClient from "@/lib/apiClient";

type DeleteJobParams = {
    companyId: string;
    jobId: string;
};

type DeleteJobResponse = {
    success: boolean;
    message: string;
};

export async function deleteJob({ companyId, jobId }: DeleteJobParams): Promise<DeleteJobResponse> {
    const response = await apiClient.delete<DeleteJobResponse>(
        `/companies/${companyId}/jobs/${jobId}`,
    );

    return response.data;
}
