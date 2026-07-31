"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveJob } from "../api/archiveJob";

type UseArchiveJobOptions = {
    companyId: string;
};

export function useArchiveJob({ companyId }: UseArchiveJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            archiveJob({
                companyId,
                jobId,
            }),

        onSuccess: async (_, jobId) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["company-jobs", companyId],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["company-job", companyId, jobId],
                }),
            ]);
        },
    });
}
