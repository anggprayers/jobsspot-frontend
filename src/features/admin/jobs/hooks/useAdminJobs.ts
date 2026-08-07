"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAdminJob, getAdminJobs, updateAdminJobModeration } from "../api/adminJobsApi";
import type { AdminJobListParams, UpdateAdminJobModerationRequest } from "../types/adminJob";

export function useAdminJobs(params: AdminJobListParams) {
    return useQuery({
        queryKey: ["platform-admin", "jobs", params],
        queryFn: () => getAdminJobs(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminJob(jobId: string) {
    return useQuery({
        queryKey: ["platform-admin", "jobs", jobId],
        queryFn: () => getAdminJob(jobId),
        enabled: Boolean(jobId),
    });
}

export function useUpdateAdminJobModeration(jobId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UpdateAdminJobModerationRequest) => updateAdminJobModeration(jobId, input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "jobs"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "reports"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
                queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
                queryClient.invalidateQueries({ queryKey: ["jobs"] }),
                queryClient.invalidateQueries({ queryKey: ["public-job"] }),
                queryClient.invalidateQueries({ queryKey: ["company-jobs"] }),
            ]);
        },
    });
}
