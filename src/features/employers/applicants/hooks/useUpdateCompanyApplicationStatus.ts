"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCompanyApplicationStatus } from "../api/updateCompanyApplicationStatus";
import type { UpdateCompanyApplicationStatusPayload } from "../types/employerApplication";

type UseUpdateCompanyApplicationStatusParameters = {
    companyId: string;
    applicationId: string;
};

export function useUpdateCompanyApplicationStatus({
    companyId,
    applicationId,
}: UseUpdateCompanyApplicationStatusParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCompanyApplicationStatusPayload) =>
            updateCompanyApplicationStatus({
                companyId,
                applicationId,
                payload,
            }),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["company-applications", companyId],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["company-application", companyId, applicationId],
                }),
            ]);
        },
    });
}
