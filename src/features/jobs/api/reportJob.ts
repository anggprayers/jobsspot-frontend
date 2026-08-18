import apiClient from "@/lib/apiClient";

export type JobReportReason =
    | "SCAM_FRAUD"
    | "MISLEADING"
    | "DISCRIMINATION"
    | "SPAM_DUPLICATE"
    | "INAPPROPRIATE"
    | "OTHER";

export type CreateJobReportInput = {
    jobId: string;
    reason: JobReportReason;
    details?: string;
};

export type CreateJobReportResponse = {
    success: true;
    message: string;
    report: {
        id: string;
        jobId: string;
        reason: JobReportReason;
        details: string | null;
        status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
        createdAt: string;
    };
};

export async function reportJob(input: CreateJobReportInput): Promise<CreateJobReportResponse> {
    const response = await apiClient.post<CreateJobReportResponse>("/job-reports", input);
    return response.data;
}
