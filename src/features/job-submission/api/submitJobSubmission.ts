import { authClient } from "@/lib/apiClient";

import type {
    PublicJobSubmissionRequest,
    PublicJobSubmissionResponse,
} from "../types/jobSubmission";

export async function submitJobSubmission(
    input: PublicJobSubmissionRequest,
): Promise<PublicJobSubmissionResponse> {
    const response = await authClient.post<PublicJobSubmissionResponse>(
        "/job-submissions",
        input,
    );

    return response.data;
}
