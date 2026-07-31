import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCompanyLogo } from "../api/deleteCompanyLogo";
import { managedCompanyQueryKey } from "./useManagedCompany";

type UseDeleteCompanyLogoParameters = {
    companyId: string;
    accessToken: string;
};

export function useDeleteCompanyLogo({ companyId, accessToken }: UseDeleteCompanyLogoParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            deleteCompanyLogo({
                companyId,
                accessToken,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: managedCompanyQueryKey(companyId),
            });
        },
    });
}
