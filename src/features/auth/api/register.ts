import { authClient } from "@/lib/apiClient";

import type {
    RegisterRequest,
    RegisterResponse,
} from "../types/auth";

export async function register(
    data: RegisterRequest,
): Promise<RegisterResponse> {
    const response =
        await authClient.post<RegisterResponse>(
            "/auth/register",
            data,
        );

    return response.data;
}
