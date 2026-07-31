"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteJob } from "../api/deleteJob";

type UseDeleteJobOptions = {
    companyId: string;
};

export function useDeleteJob({ companyId }: UseDeleteJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            deleteJob({
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
