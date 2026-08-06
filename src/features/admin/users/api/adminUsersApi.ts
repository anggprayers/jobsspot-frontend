import apiClient from "@/lib/apiClient";

import type {
    AdminUserListParams,
    AdminUserResponse,
    AdminUsersResponse,
    UpdateAdminUserSuspensionRequest,
    UpdateAdminUserSuspensionResponse,
} from "../types/adminUser";

export async function getAdminUsers(params: AdminUserListParams): Promise<AdminUsersResponse> {
    const response = await apiClient.get<AdminUsersResponse>("/admin/users", { params });

    return response.data;
}

export async function getAdminUser(userId: string): Promise<AdminUserResponse> {
    const response = await apiClient.get<AdminUserResponse>(`/admin/users/${userId}`);

    return response.data;
}

export async function updateAdminUserSuspension(
    userId: string,
    input: UpdateAdminUserSuspensionRequest,
): Promise<UpdateAdminUserSuspensionResponse> {
    const response = await apiClient.patch<UpdateAdminUserSuspensionResponse>(
        `/admin/users/${userId}/suspension`,
        input,
    );

    return response.data;
}
