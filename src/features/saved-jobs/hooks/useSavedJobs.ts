"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getSavedJobs,
    getSavedJobStatus,
    removeSavedJob,
    saveJob,
} from "../api/savedJobApi";
import type {
    GetSavedJobsParams,
    SavedJobStatusResponse,
} from "../types/savedJob";

export const savedJobsQueryKey = ["account", "saved-jobs"] as const;

export function savedJobStatusQueryKey(jobId: string) {
    return ["saved-job-status", jobId] as const;
}

export function useSavedJobs(
    params: GetSavedJobsParams = {},
    enabled = true,
) {
    return useQuery({
        queryKey: [
            ...savedJobsQueryKey,
            {
                page: params.page ?? 1,
                limit: params.limit ?? 10,
            },
        ],
        queryFn: () => getSavedJobs(params),
        enabled,
    });
}

export function useSavedJobStatus(
    jobId: string,
    enabled = true,
) {
    return useQuery({
        queryKey: savedJobStatusQueryKey(jobId),
        queryFn: () => getSavedJobStatus(jobId),
        enabled: enabled && Boolean(jobId),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
}

export function useSaveJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveJob,
        onSuccess: async (response, jobId) => {
            const status: SavedJobStatusResponse = {
                success: true,
                isSaved: true,
                savedAt: response.savedJob.savedAt,
            };

            queryClient.setQueryData(
                savedJobStatusQueryKey(jobId),
                status,
            );

            await queryClient.invalidateQueries({
                queryKey: savedJobsQueryKey,
            });
        },
    });
}

export function useRemoveSavedJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeSavedJob,
        onSuccess: async (_response, jobId) => {
            const status: SavedJobStatusResponse = {
                success: true,
                isSaved: false,
                savedAt: null,
            };

            queryClient.setQueryData(
                savedJobStatusQueryKey(jobId),
                status,
            );

            await queryClient.invalidateQueries({
                queryKey: savedJobsQueryKey,
            });
        },
    });
}
