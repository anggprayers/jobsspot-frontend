import { authClient } from "@/lib/apiClient";

import type { LoginRequest, LoginResponse } from "../types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await authClient.post<LoginResponse>("/auth/login", data);

    return response.data;
}
