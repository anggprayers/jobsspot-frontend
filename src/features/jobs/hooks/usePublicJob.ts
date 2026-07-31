"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicJobBySlug } from "../api/getPublicJobBySlug";

export function usePublicJob(slug: string) {
    return useQuery({
        queryKey: ["public-job", slug],
        queryFn: () => getPublicJobBySlug(slug),
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5,
    });
}
