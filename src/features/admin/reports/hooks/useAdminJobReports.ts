"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminJobReport, getAdminJobReports, updateAdminJobReportStatus } from "../api/adminJobReportsApi";
import type { AdminJobReportListParams, UpdateJobReportStatusRequest } from "../types/adminJobReport";

export function useAdminJobReports(params: AdminJobReportListParams) {
    return useQuery({ queryKey: ["platform-admin", "reports", params], queryFn: () => getAdminJobReports(params), placeholderData: (previousData) => previousData });
}
export function useAdminJobReport(reportId: string) {
    return useQuery({ queryKey: ["platform-admin", "reports", reportId], queryFn: () => getAdminJobReport(reportId), enabled: Boolean(reportId) });
}
export function useUpdateAdminJobReportStatus(reportId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: UpdateJobReportStatusRequest) => updateAdminJobReportStatus(reportId, input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "reports"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "jobs"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            ]);
        },
    });
}
