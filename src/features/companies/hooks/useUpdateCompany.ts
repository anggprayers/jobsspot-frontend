import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCompany } from "../api/updateCompany";
import type { UpdateCompanyInput } from "../types/managedCompany";
import { managedCompanyQueryKey } from "./useManagedCompany";

type UseUpdateCompanyParameters = {
    companyId: string;
    accessToken: string;
};

export function useUpdateCompany({ companyId, accessToken }: UseUpdateCompanyParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCompanyInput) =>
            updateCompany({
                companyId,
                accessToken,
                data,
            }),

        onSuccess: async (response) => {
            queryClient.setQueryData(managedCompanyQueryKey(companyId), response);

            await queryClient.invalidateQueries({
                queryKey: managedCompanyQueryKey(companyId),
            });
        },
    });
}
