import { useMutation } from "@tanstack/react-query";

import { getCompanyApplicationCoverLetterDownload } from "../api/getCompanyApplicationCoverLetterDownload";

export function useCompanyApplicationCoverLetterDownload({
    companyId,
    applicationId,
}: {
    companyId: string;
    applicationId: string;
}) {
    return useMutation({
        mutationFn: () =>
            getCompanyApplicationCoverLetterDownload({
                companyId,
                applicationId,
            }),
    });
}
