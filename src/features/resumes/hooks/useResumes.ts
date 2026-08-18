import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    deleteResume,
    getResumeDownload,
    getResumeProfilePreview,
    getResumes,
    importResumeProfile,
    renameResume,
    setDefaultResume,
    uploadResume,
 } from "../api/resumeApi";
import type { ImportResumeProfileRequest } from "../types/resume";

export const resumesQueryKey = ["account", "resumes"] as const;

export function useResumes(enabled = true) {
    return useQuery({
        queryKey: resumesQueryKey,
        queryFn: getResumes,
        enabled,
    });
}

export function useUploadResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadResume,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: resumesQueryKey,
            });
        },
    });
}

export function useRenameResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: renameResume,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: resumesQueryKey,
            });
        },
    });
}

export function useSetDefaultResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setDefaultResume,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: resumesQueryKey,
            });
        },
    });
}

export function useResumeDownload() {
    return useMutation({
        mutationFn: getResumeDownload,
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteResume,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: resumesQueryKey,
            });
        },
    });
}


export function useResumeProfilePreview() {
    return useMutation({
        mutationFn: getResumeProfilePreview,
    });
}

export function useImportResumeProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ resumeId, data }: { resumeId: string; data: ImportResumeProfileRequest }) =>
            importResumeProfile(resumeId, data),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["job-seeker-profile"] }),
                queryClient.invalidateQueries({ queryKey: resumesQueryKey }),
            ]);
        },
    });
}
