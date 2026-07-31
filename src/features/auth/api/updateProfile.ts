import apiClient from "@/lib/apiClient";

import type { UpdateProfileRequest, UpdateProfileResponse } from "../types/auth";

export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch<UpdateProfileResponse>("/auth/profile", data);

    return response.data;
}
