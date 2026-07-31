import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "../api/createJob";
import type { CreateJobPayload } from "../types/companyJob";
import { companyJobsQueryKey } from "./useCompanyJobs";

type UseCreateJobParameters = {
    companyId: string;
};

export function useCreateJob({ companyId }: UseCreateJobParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateJobPayload) =>
            createJob({
                companyId,
                payload,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: companyJobsQueryKey(companyId),
            });
        },
    });
}
