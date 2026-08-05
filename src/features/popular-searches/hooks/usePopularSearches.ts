"use client";

import { useQuery } from "@tanstack/react-query";

import { getPopularSearches } from "../api/popularSearchApi";
import type { GetPopularSearchesParams } from "../types/popularSearch";

export function popularSearchesQueryKey(
    params: GetPopularSearchesParams = {},
) {
    return [
        "popular-searches",
        {
            limit: params.limit ?? 4,
            days: params.days ?? 30,
        },
    ] as const;
}

export function usePopularSearches(
    params: GetPopularSearchesParams = {},
) {
    return useQuery({
        queryKey: popularSearchesQueryKey(params),
        queryFn: () => getPopularSearches(params),
        staleTime: 1000 * 60 * 5,
    });
}
