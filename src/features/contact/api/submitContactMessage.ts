import { authClient } from "@/lib/apiClient";

import type {
    ContactSubmissionRequest,
    ContactSubmissionResponse,
} from "../types/contact";

export async function submitContactMessage(
    input: ContactSubmissionRequest,
): Promise<ContactSubmissionResponse> {
    const response =
        await authClient.post<ContactSubmissionResponse>(
            "/contact",
            input,
        );

    return response.data;
}
