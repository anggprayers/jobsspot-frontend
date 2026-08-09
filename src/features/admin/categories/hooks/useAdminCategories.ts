import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createAdminCategory,
    getAdminCategories,
    updateAdminCategory,
    updateAdminCategoryStatus,
} from "../api/adminCategoriesApi";
import type {
    AdminCategoryListParams,
    CreateAdminCategoryRequest,
    UpdateAdminCategoryRequest,
    UpdateAdminCategoryStatusRequest,
} from "../types/adminCategory";

export function useAdminCategories(params: AdminCategoryListParams) {
    return useQuery({
        queryKey: ["platform-admin", "categories", params],
        queryFn: () => getAdminCategories(params),
        placeholderData: (previousData) => previousData,
    });
}

function useInvalidateCategoryQueries() {
    const queryClient = useQueryClient();

    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "categories"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "activity"] }),
            queryClient.invalidateQueries({ queryKey: ["job-categories"] }),
            queryClient.invalidateQueries({ queryKey: ["jobs"] }),
            queryClient.invalidateQueries({ queryKey: ["company-jobs"] }),
        ]);
    };
}

export function useCreateAdminCategory() {
    const invalidate = useInvalidateCategoryQueries();
    return useMutation({
        mutationFn: (input: CreateAdminCategoryRequest) => createAdminCategory(input),
        onSuccess: invalidate,
    });
}

export function useUpdateAdminCategory(categoryId: string) {
    const invalidate = useInvalidateCategoryQueries();
    return useMutation({
        mutationFn: (input: UpdateAdminCategoryRequest) => updateAdminCategory(categoryId, input),
        onSuccess: invalidate,
    });
}

export function useUpdateAdminCategoryStatus(categoryId: string) {
    const invalidate = useInvalidateCategoryQueries();
    return useMutation({
        mutationFn: (input: UpdateAdminCategoryStatusRequest) => updateAdminCategoryStatus(categoryId, input),
        onSuccess: invalidate,
    });
}
