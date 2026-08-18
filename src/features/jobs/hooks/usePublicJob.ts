"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublicJobBySlug } from "../api/getPublicJobBySlug";
import type { PublicJobDetails } from "../types/publicJobDetails";

export function usePublicJob(slug: string, initialJob?: PublicJobDetails) {
    return useQuery({
        queryKey: ["public-job", slug],
        queryFn: () => getPublicJobBySlug(slug),
        enabled: Boolean(slug),
        initialData: initialJob
            ? {
                  success: true,
                  message: "Public job loaded.",
                  job: initialJob,
              }
            : undefined,
        staleTime: 1000 * 60 * 5,
    });
}
