import apiClient from "@/lib/apiClient";

import type { ChangePasswordRequest, ChangePasswordResponse } from "../types/auth";

export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await apiClient.patch<ChangePasswordResponse>("/auth/change-password", data);

    return response.data;
}
