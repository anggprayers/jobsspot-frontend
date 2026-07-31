"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompanyApplication } from "../api/getCompanyApplication";

export const companyApplicationQueryKey = (companyId: string, applicationId: string) =>
    ["company-application", companyId, applicationId] as const;

type UseCompanyApplicationParameters = {
    companyId: string;
    applicationId: string;
};

export function useCompanyApplication({
    companyId,
    applicationId,
}: UseCompanyApplicationParameters) {
    return useQuery({
        queryKey: companyApplicationQueryKey(companyId, applicationId),

        queryFn: () =>
            getCompanyApplication({
                companyId,
                applicationId,
            }),

        enabled: Boolean(companyId && applicationId),
    });
}
