import apiClient from "@/lib/apiClient";
import type { AdminJobReportListParams, AdminJobReportResponse, AdminJobReportsResponse, UpdateJobReportStatusRequest, UpdateJobReportStatusResponse } from "../types/adminJobReport";

export async function getAdminJobReports(params: AdminJobReportListParams): Promise<AdminJobReportsResponse> {
    const response = await apiClient.get<AdminJobReportsResponse>("/admin/reports", { params });
    return response.data;
}
export async function getAdminJobReport(reportId: string): Promise<AdminJobReportResponse> {
    const response = await apiClient.get<AdminJobReportResponse>(`/admin/reports/${encodeURIComponent(reportId)}`);
    return response.data;
}
export async function updateAdminJobReportStatus(reportId: string, input: UpdateJobReportStatusRequest): Promise<UpdateJobReportStatusResponse> {
    const response = await apiClient.patch<UpdateJobReportStatusResponse>(`/admin/reports/${encodeURIComponent(reportId)}/status`, input);
    return response.data;
}
