"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unpublishJob } from "../api/unpublishJob";

type UseUnpublishJobOptions = {
    companyId: string;
};

export function useUnpublishJob({ companyId }: UseUnpublishJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            unpublishJob({
                companyId,
                jobId,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["company-jobs", companyId],
            });
        },
    });
}
