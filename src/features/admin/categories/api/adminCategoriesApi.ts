import apiClient from "@/lib/apiClient";

import type {
    AdminCategoriesResponse,
    AdminCategoryListParams,
    AdminCategoryResponse,
    CreateAdminCategoryRequest,
    UpdateAdminCategoryRequest,
    UpdateAdminCategoryStatusRequest,
} from "../types/adminCategory";

export async function getAdminCategories(params: AdminCategoryListParams): Promise<AdminCategoriesResponse> {
    const response = await apiClient.get<AdminCategoriesResponse>("/admin/categories", { params });
    return response.data;
}

export async function createAdminCategory(input: CreateAdminCategoryRequest): Promise<AdminCategoryResponse> {
    const response = await apiClient.post<AdminCategoryResponse>("/admin/categories", input);
    return response.data;
}

export async function updateAdminCategory(categoryId: string, input: UpdateAdminCategoryRequest): Promise<AdminCategoryResponse> {
    const response = await apiClient.patch<AdminCategoryResponse>(`/admin/categories/${categoryId}`, input);
    return response.data;
}

export async function updateAdminCategoryStatus(categoryId: string, input: UpdateAdminCategoryStatusRequest): Promise<AdminCategoryResponse> {
    const response = await apiClient.patch<AdminCategoryResponse>(`/admin/categories/${categoryId}/status`, input);
    return response.data;
}
