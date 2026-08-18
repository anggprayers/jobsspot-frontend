"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getAdminJobSubmission,
    getAdminJobSubmissions,
    markAdminJobSubmissionContacted,
    publishAdminJobSubmission,
    rejectAdminJobSubmission,
} from "../api/adminJobSubmissionsApi";
import type {
    AdminJobSubmissionListParams,
    MarkJobSubmissionContactedRequest,
    PublishJobSubmissionRequest,
    RejectJobSubmissionRequest,
} from "../types/adminJobSubmission";

export function useAdminJobSubmissions(params: AdminJobSubmissionListParams) {
    return useQuery({
        queryKey: ["platform-admin", "job-submissions", params],
        queryFn: () => getAdminJobSubmissions(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminJobSubmission(submissionId: string) {
    return useQuery({
        queryKey: ["platform-admin", "job-submissions", submissionId],
        queryFn: () => getAdminJobSubmission(submissionId),
        enabled: Boolean(submissionId),
    });
}

function useInvalidateJobSubmissionQueries() {
    const queryClient = useQueryClient();

    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "job-submissions"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "companies"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["public-job"] }),
        ]);
    };
}

export function useMarkAdminJobSubmissionContacted(submissionId: string) {
    const invalidate = useInvalidateJobSubmissionQueries();

    return useMutation({
        mutationFn: (input: MarkJobSubmissionContactedRequest) =>
            markAdminJobSubmissionContacted(submissionId, input),
        onSuccess: invalidate,
    });
}

export function useRejectAdminJobSubmission(submissionId: string) {
    const invalidate = useInvalidateJobSubmissionQueries();

    return useMutation({
        mutationFn: (input: RejectJobSubmissionRequest) =>
            rejectAdminJobSubmission(submissionId, input),
        onSuccess: invalidate,
    });
}

export function usePublishAdminJobSubmission(submissionId: string) {
    const invalidate = useInvalidateJobSubmissionQueries();

    return useMutation({
        mutationFn: (input: PublishJobSubmissionRequest) =>
            publishAdminJobSubmission(submissionId, input),
        onSuccess: invalidate,
    });
}
