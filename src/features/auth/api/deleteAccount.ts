import apiClient from "@/lib/apiClient";

export type DeleteAccountRequest = {
    confirmationEmail: string;
    confirmationText: "DELETE MY ACCOUNT";
    currentPassword?: string;
};

export type DeleteAccountResponse = {
    success: true;
    message: string;
    deletedAt: string;
    revokedSessions: number;
    files: {
        resumeFilesRemoved: number;
        resumeFileCleanupFailures: number;
        coverLetterFilesProcessed: number;
    };
};

export async function deleteAccount(
    data: DeleteAccountRequest,
): Promise<DeleteAccountResponse> {
    const response = await apiClient.post<DeleteAccountResponse>(
        "/auth/account-deletion",
        data,
    );

    return response.data;
}
