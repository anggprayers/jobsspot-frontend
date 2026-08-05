import { authClient } from "@/lib/apiClient";

import type {
    VerifyEmailRequest,
    VerifyEmailResponse,
} from "../types/auth";

export async function verifyEmail(
    data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
    const response =
        await authClient.post<VerifyEmailResponse>(
            "/auth/email-verification/verify",
            data,
        );

    return response.data;
}
