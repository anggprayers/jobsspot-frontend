import { authClient } from "@/lib/apiClient";

import type { LogoutResponse } from "../types/auth";

export async function logout(): Promise<LogoutResponse> {
    const response = await authClient.post<LogoutResponse>("/auth/logout");

    return response.data;
}
