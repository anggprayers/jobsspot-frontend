import apiClient from "@/lib/apiClient";

import type { SendVerificationEmailResponse } from "../types/auth";

export async function sendVerificationEmail(): Promise<SendVerificationEmailResponse> {
    const response =
        await apiClient.post<SendVerificationEmailResponse>(
            "/auth/email-verification/send",
        );

    return response.data;
}
