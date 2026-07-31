import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadCompanyBanner } from "../api/uploadCompanyBanner";
import { managedCompanyQueryKey } from "./useManagedCompany";

type UseUploadCompanyBannerParameters = {
    companyId: string;
    accessToken: string;
};

export function useUploadCompanyBanner({
    companyId,
    accessToken,
}: UseUploadCompanyBannerParameters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) =>
            uploadCompanyBanner({
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
