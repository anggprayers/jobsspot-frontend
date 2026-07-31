import { useQuery } from "@tanstack/react-query";

import { getManagedCompany } from "../api/getManagedCompany";

export const managedCompanyQueryKey = (companyId: string) =>
    ["companies", "managed", companyId] as const;

type UseManagedCompanyParameters = {
    companyId: string | null | undefined;
    accessToken: string | null | undefined;
    enabled?: boolean;
};

export function useManagedCompany({
    companyId,
    accessToken,
    enabled = true,
}: UseManagedCompanyParameters) {
    return useQuery({
        queryKey: managedCompanyQueryKey(companyId ?? ""),

        queryFn: () =>
            getManagedCompany({
                companyId: companyId as string,
                accessToken: accessToken as string,
            }),

        enabled: enabled && Boolean(companyId && accessToken),

        select: (response) => response.company,
    });
}
