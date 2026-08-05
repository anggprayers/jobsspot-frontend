import { authClient } from "@/lib/apiClient";

import type {
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "../types/auth";

export async function resetPassword(
    data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
    const response =
        await authClient.post<ResetPasswordResponse>(
            "/auth/reset-password",
            data,
        );

    return response.data;
}
