import apiClient from "@/lib/apiClient";

type ArchiveJobResponse = {
    success: boolean;
    message: string;
    job: {
        id: string;
        title: string;
        slug: string;
        status: "ARCHIVED";
        publishedAt: string | null;
        updatedAt: string;
    };
};

type ArchiveJobParameters = {
    companyId: string;
    jobId: string;
};

export async function archiveJob({
    companyId,
    jobId,
}: ArchiveJobParameters): Promise<ArchiveJobResponse> {
    const response = await apiClient.patch<ArchiveJobResponse>(
        `/companies/${encodeURIComponent(companyId)}/jobs/${encodeURIComponent(jobId)}/archive`,
    );

    return response.data;
}
