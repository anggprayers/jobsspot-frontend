"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { archiveAdminJob, createAdminJob, getAdminJob, getAdminJobs, publishAdminJob, updateAdminJob, updateAdminJobModeration } from "../api/adminJobsApi";
import type { AdminJobListParams, CreateAdminJobRequest, PublishAdminJobRequest, UpdateAdminJobRequest, UpdateAdminJobModerationRequest } from "../types/adminJob";

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


function useInvalidateAdminJobQueries() {
    const queryClient = useQueryClient();
    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "companies"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            queryClient.invalidateQueries({ queryKey: ["jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["public-job"] }),
            queryClient.invalidateQueries({ queryKey: ["public-companies"] }),
        ]);
    };
}

export function useCreateAdminJob() {
    const invalidate = useInvalidateAdminJobQueries();
    return useMutation({ mutationFn: (input: CreateAdminJobRequest) => createAdminJob(input), onSuccess: invalidate });
}

export function useUpdateAdminJob(jobId: string) {
    const invalidate = useInvalidateAdminJobQueries();
    return useMutation({ mutationFn: (input: UpdateAdminJobRequest) => updateAdminJob(jobId, input), onSuccess: invalidate });
}

export function usePublishAdminJob(jobId: string) {
    const invalidate = useInvalidateAdminJobQueries();
    return useMutation({ mutationFn: (input: PublishAdminJobRequest) => publishAdminJob(jobId, input), onSuccess: invalidate });
}

export function useArchiveAdminJob(jobId: string) {
    const invalidate = useInvalidateAdminJobQueries();
    return useMutation({ mutationFn: () => archiveAdminJob(jobId), onSuccess: invalidate });
}
