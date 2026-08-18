"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createAdminApplicationShareLink,
    getAdminApplication,
    getAdminApplicationCoverLetterDownload,
    getAdminApplicationResumeDownload,
    getAdminApplications,
    revokeAdminApplicationShareLink,
    updateAdminApplicationStatus,
} from "../api/adminApplicationsApi";
import type {
    AdminApplicationListParams,
    AdminApplicationStatusRequest,
    CreateAdminApplicationShareLinkRequest,
} from "../types/adminApplication";

export function useAdminApplications(params: AdminApplicationListParams) {
    return useQuery({
        queryKey: ["platform-admin", "applications", params],
        queryFn: () => getAdminApplications(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminApplication(applicationId: string) {
    return useQuery({
        queryKey: ["platform-admin", "applications", applicationId],
        queryFn: () => getAdminApplication(applicationId),
        enabled: Boolean(applicationId),
    });
}

function useInvalidateAdminApplicationQueries() {
    const queryClient = useQueryClient();
    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "applications"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "companies"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
        ]);
    };
}

export function useUpdateAdminApplicationStatus(applicationId: string) {
    const invalidate = useInvalidateAdminApplicationQueries();
    return useMutation({
        mutationFn: (input: AdminApplicationStatusRequest) =>
            updateAdminApplicationStatus(applicationId, input),
        onSuccess: invalidate,
    });
}

export function useAdminApplicationResumeDownload(applicationId: string) {
    return useMutation({ mutationFn: () => getAdminApplicationResumeDownload(applicationId) });
}

export function useAdminApplicationCoverLetterDownload(applicationId: string) {
    return useMutation({ mutationFn: () => getAdminApplicationCoverLetterDownload(applicationId) });
}

export function useCreateAdminApplicationShareLink(applicationId: string) {
    const invalidate = useInvalidateAdminApplicationQueries();
    return useMutation({
        mutationFn: (input: CreateAdminApplicationShareLinkRequest) =>
            createAdminApplicationShareLink(applicationId, input),
        onSuccess: invalidate,
    });
}

export function useRevokeAdminApplicationShareLink(applicationId: string) {
    const invalidate = useInvalidateAdminApplicationQueries();
    return useMutation({
        mutationFn: (shareLinkId: string) => revokeAdminApplicationShareLink(applicationId, shareLinkId),
        onSuccess: invalidate,
    });
}
