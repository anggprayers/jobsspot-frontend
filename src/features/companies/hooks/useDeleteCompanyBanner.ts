import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCompanyBanner } from "../api/deleteCompanyBanner";
import { managedCompanyQueryKey } from "./useManagedCompany";

type UseDeleteCompanyBannerParameters = {
    companyId: string;
    accessToken: string;
};

export function useDeleteCompanyBanner({
    companyId,
    accessToken,
}: UseDeleteCompanyBannerParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            deleteCompanyBanner({
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
