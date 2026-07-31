"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishJob } from "../api/publishJob";

type UsePublishJobOptions = {
    companyId: string;
};

export function usePublishJob({ companyId }: UsePublishJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            publishJob({
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
