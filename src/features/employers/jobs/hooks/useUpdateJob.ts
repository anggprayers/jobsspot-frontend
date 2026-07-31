"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateJob } from "../api/updateJob";
import type { JobFormValues } from "../validations/jobFormSchema";

type UseUpdateJobOptions = {
    companyId: string;
};

type UpdateJobVariables = {
    jobId: string;
    values: JobFormValues;
};

export function useUpdateJob({ companyId }: UseUpdateJobOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ jobId, values }: UpdateJobVariables) =>
            updateJob({
                companyId,
                jobId,
                values,
            }),

        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["company-jobs", companyId],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["company-job", companyId, variables.jobId],
                }),
            ]);
        },
    });
}
