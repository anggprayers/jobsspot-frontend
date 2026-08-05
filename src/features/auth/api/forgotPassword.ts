import { authClient } from "@/lib/apiClient";

import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
} from "../types/auth";

export async function forgotPassword(
    data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
    const response =
        await authClient.post<ForgotPasswordResponse>(
            "/auth/forgot-password",
            data,
        );

    return response.data;
}
