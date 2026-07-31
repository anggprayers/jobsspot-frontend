"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicCompanyBySlug } from "../api/getPublicCompanyBySlug";

export function usePublicCompany(slug: string) {
    return useQuery({
        queryKey: ["public-company", slug],
        queryFn: () => getPublicCompanyBySlug(slug),
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5,
    });
}
