import { useMutation } from "@tanstack/react-query";

import { getCompanyApplicationResumeDownload } from "../api/getCompanyApplicationResumeDownload";

export function useCompanyApplicationResumeDownload({
    companyId,
    applicationId,
}: {
    companyId: string;
    applicationId: string;
}) {
    return useMutation({
        mutationFn: () =>
            getCompanyApplicationResumeDownload({
                companyId,
                applicationId,
            }),
    });
}
