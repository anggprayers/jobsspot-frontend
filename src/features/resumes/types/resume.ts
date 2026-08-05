export type ResumeRecord = {
    id: string;
    name: string;
    mimeType: string;
    fileSize: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
};

export type ResumeListResponse = {
    success: true;
    resumes: ResumeRecord[];
};

export type ResumeMutationResponse = {
    success: true;
    message: string;
    resume: ResumeRecord;
};

export type ResumeDownloadResponse = {
    success: true;
    resume: Pick<ResumeRecord, "id" | "name" | "mimeType">;
    downloadUrl: string;
    expiresInSeconds: number;
};

export type DeleteResumeResponse = {
    success: true;
    message: string;
    id: string;
    retainedForApplications: boolean;
};

export type UploadResumeInput = {
    file: File;
    name?: string;
    isDefault: boolean;
    onProgress?: (percentage: number) => void;
};

export type RenameResumeInput = {
    resumeId: string;
    name: string;
};
