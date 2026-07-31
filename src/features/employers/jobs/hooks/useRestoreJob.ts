"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreJob } from "../api/restoreJob";

type UseRestoreJobOptions = {
    companyId: string;
};

export function useRestoreJob({ companyId }: UseRestoreJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            restoreJob({
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
