import apiClient from "@/lib/apiClient";

type RestoreJobResponse = {
    success: boolean;
    message: string;
    job: {
        id: string;
        title: string;
        slug: string;
        status: "DRAFT";
        publishedAt: string | null;
        updatedAt: string;
    };
};

type RestoreJobParameters = {
    companyId: string;
    jobId: string;
};

export async function restoreJob({
    companyId,
    jobId,
}: RestoreJobParameters): Promise<RestoreJobResponse> {
    const response = await apiClient.patch<RestoreJobResponse>(
        `/companies/${encodeURIComponent(companyId)}/jobs/${encodeURIComponent(jobId)}/restore`,
    );

    return response.data;
}
