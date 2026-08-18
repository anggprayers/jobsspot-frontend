"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createApplication,
    getApplicationCoverLetterDownload,
    getApplicationById,
    getApplicationForJob,
    getApplicationResumeDownload,
    getApplications,
    withdrawApplication,
} from "../api/applicationApi";
import type { GetApplicationsParams } from "../types/application";

export const applicationsQueryKey = ["account", "applications"] as const;

export function applicationForJobQueryKey(jobId: string) {
    return ["application-for-job", jobId] as const;
}

export function applicationDetailsQueryKey(applicationId: string) {
    return ["account", "application", applicationId] as const;
}

export function useApplications(
    params: GetApplicationsParams = {},
    enabled = true,
) {
    return useQuery({
        queryKey: [
            ...applicationsQueryKey,
            {
                status: params.status ?? "",
                page: params.page ?? 1,
                limit: params.limit ?? 10,
            },
        ],
        queryFn: () => getApplications(params),
        enabled,
    });
}

export function useApplicationsSummary(enabled = true) {
    return useQuery({
        queryKey: [...applicationsQueryKey, "summary"],
        queryFn: () =>
            getApplications({
                page: 1,
                limit: 1,
            }),
        enabled,
        staleTime: 1000 * 60,
    });
}

export function useApplicationDetails(
    applicationId: string,
    enabled = true,
) {
    return useQuery({
        queryKey: applicationDetailsQueryKey(applicationId),
        queryFn: () => getApplicationById(applicationId),
        enabled: enabled && Boolean(applicationId),
    });
}

export function useApplicationForJob(jobId: string, enabled = true) {
    return useQuery({
        queryKey: applicationForJobQueryKey(jobId),
        queryFn: () => getApplicationForJob(jobId),
        enabled: enabled && Boolean(jobId),
        staleTime: 1000 * 60,
        retry: false,
    });
}

export function useApplicationResumeDownload() {
    return useMutation({
        mutationFn: getApplicationResumeDownload,
    });
}

export function useApplicationCoverLetterDownload() {
    return useMutation({
        mutationFn: getApplicationCoverLetterDownload,
    });
}

export function useCreateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createApplication,
        onSuccess: async (_response, input) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: applicationsQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: applicationForJobQueryKey(input.jobId),
                }),
            ]);
        },
    });
}

export function useWithdrawApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawApplication,
        onSuccess: async (response) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: applicationsQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: applicationDetailsQueryKey(
                        response.application.id,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: applicationForJobQueryKey(
                        response.application.job.id,
                    ),
                }),
            ]);
        },
    });
}
