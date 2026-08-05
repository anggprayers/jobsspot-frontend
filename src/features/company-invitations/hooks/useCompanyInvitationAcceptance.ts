"use client";

import {
    useMutation,
    useQuery,
} from "@tanstack/react-query";

import {
    acceptCompanyInvitation,
    resolveCompanyInvitation,
} from "../api/companyInvitationApi";

export function useResolvedCompanyInvitation(
    token: string,
) {
    return useQuery({
        queryKey: [
            "company-invitation",
            "resolve",
            token,
        ],
        queryFn: () =>
            resolveCompanyInvitation(token),
        enabled: Boolean(token),
        retry: false,
        staleTime: 30_000,
    });
}

export function useAcceptCompanyInvitation() {
    return useMutation({
        mutationFn: (
            token: string,
        ) =>
            acceptCompanyInvitation({
                token,
            }),
    });
}
