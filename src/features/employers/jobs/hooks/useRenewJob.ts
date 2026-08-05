"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { renewJob } from "../api/renewJob";

type UseRenewJobOptions = {
    companyId: string;
};

export function useRenewJob({
    companyId,
}: UseRenewJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobId: string) =>
            renewJob({
                companyId,
                jobId,
            }),

        onSuccess: async (_response, jobId) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [
                        "company-jobs",
                        companyId,
                    ],
                }),
                queryClient.invalidateQueries({
                    queryKey: [
                        "company-job",
                        companyId,
                        jobId,
                    ],
                }),
            ]);
        },
    });
}
