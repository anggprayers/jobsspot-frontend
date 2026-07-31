import apiClient from "@/lib/apiClient";

import type { CurrentUserResponse } from "../types/auth";

export async function getCurrentUser(accessToken?: string): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>(
        "/auth/me",
        accessToken
            ? {
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
              }
            : undefined,
    );

    return response.data;
}
