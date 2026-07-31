import { authClient } from "@/lib/apiClient";

import type { AuthenticatedRefreshSessionResponse, RefreshSessionResponse } from "../types/auth";

export async function refreshSession(): Promise<AuthenticatedRefreshSessionResponse | null> {
    const response = await authClient.post<RefreshSessionResponse>("/auth/refresh");

    if (!response.data.authenticated) {
        return null;
    }

    return response.data;
}
