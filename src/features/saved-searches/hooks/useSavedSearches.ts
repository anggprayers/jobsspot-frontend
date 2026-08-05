"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createSavedSearch,
    deleteSavedSearch,
    getSavedSearches,
    updateSavedSearch,
} from "../api/savedSearchApi";
import type { GetSavedSearchesParams } from "../types/savedSearch";

export const savedSearchesQueryKey = [
    "account",
    "saved-searches",
] as const;

export function useSavedSearches(
    params: GetSavedSearchesParams = {},
    enabled = true,
) {
    return useQuery({
        queryKey: [
            ...savedSearchesQueryKey,
            {
                page: params.page ?? 1,
                limit: params.limit ?? 10,
            },
        ],
        queryFn: () => getSavedSearches(params),
        enabled,
    });
}

export function useCreateSavedSearch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSavedSearch,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: savedSearchesQueryKey,
            });
        },
    });
}

export function useUpdateSavedSearch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSavedSearch,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: savedSearchesQueryKey,
            });
        },
    });
}

export function useDeleteSavedSearch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSavedSearch,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: savedSearchesQueryKey,
            });
        },
    });
}
