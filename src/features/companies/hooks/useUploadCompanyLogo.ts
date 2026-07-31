import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadCompanyLogo } from "../api/uploadCompanyLogo";
import { managedCompanyQueryKey } from "./useManagedCompany";

type UseUploadCompanyLogoParameters = {
    companyId: string;
    accessToken: string;
};

export function useUploadCompanyLogo({ companyId, accessToken }: UseUploadCompanyLogoParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) =>
            uploadCompanyLogo({
                companyId,
                accessToken,
                file,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: managedCompanyQueryKey(companyId),
            });
        },
    });
}
