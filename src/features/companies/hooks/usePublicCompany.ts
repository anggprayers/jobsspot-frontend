"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicCompanyBySlug } from "../api/getPublicCompanyBySlug";
import type { PublicCompany } from "../types/publicCompany";

export function usePublicCompany(slug: string, initialCompany?: PublicCompany) {
    return useQuery({
        queryKey: ["public-company", slug],
        queryFn: () => getPublicCompanyBySlug(slug),
        enabled: Boolean(slug),
        initialData: initialCompany
            ? {
                  success: true,
                  message: "Public company loaded.",
                  company: initialCompany,
              }
            : undefined,
        staleTime: 1000 * 60 * 5,
    });
}
