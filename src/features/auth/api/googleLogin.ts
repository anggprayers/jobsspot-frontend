import { authClient } from "@/lib/apiClient";

import type {
    GoogleLoginRequest,
    GoogleLoginResponse,
} from "../types/auth";

export async function googleLogin(
    data: GoogleLoginRequest,
): Promise<GoogleLoginResponse> {
    const response =
        await authClient.post<GoogleLoginResponse>(
            "/auth/google",
            data,
        );

    return response.data;
}
