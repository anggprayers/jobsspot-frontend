export type SharedApplicationResponse = {
    success: true;
    message: string;
    application: {
        applicantName: string;
        jobTitle: string;
        companyName: string;
        coverLetter: string | null;
        resume: { name: string; mimeType: string; fileSize: number } | null;
        coverLetterFile: { name: string | null; mimeType: string | null; fileSize: number | null } | null;
    };
    expiresAt: string;
};

export type SharedApplicationDownloadResponse = {
    success: true;
    message: string;
    downloadUrl: string;
    expiresInSeconds: number;
};
