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

export type ResumeProfilePreview = {
    parser: {
        sourceFormat: "PDF" | "DOCX";
        parserVersion: "LOCAL_HEURISTIC_V1";
        warnings: string[];
    };
    personal: {
        firstName: string | null;
        lastName: string | null;
        detectedEmail: string | null;
        phone: string | null;
        location: string | null;
    };
    professional: {
        headline: string | null;
        summary: string | null;
        websiteUrl: string | null;
        linkedInUrl: string | null;
        yearsOfExperience: number | null;
    };
    skills: string[];
    workExperiences: Array<{
        jobTitle: string;
        companyName: string;
        location: string | null;
        startDate: string;
        endDate: string | null;
        isCurrent: boolean;
        description: string | null;
    }>;
    education: Array<{
        institutionName: string;
        degree: string | null;
        fieldOfStudy: string | null;
        startDate: string | null;
        endDate: string | null;
        isCurrent: boolean;
        description: string | null;
    }>;
    certifications: Array<{
        name: string;
        issuingOrganization: string | null;
        issueDate: string | null;
        expirationDate: string | null;
        credentialId: string | null;
        credentialUrl: string | null;
    }>;
};

export type ResumeProfilePreviewResponse = {
    success: true;
    message: string;
    resume: Pick<ResumeRecord, "id" | "name" | "mimeType">;
    preview: ResumeProfilePreview;
};

export type ImportResumeProfileRequest = {
    personal?: {
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        location?: string | null;
    };
    professional?: {
        headline?: string | null;
        summary?: string | null;
        websiteUrl?: string | null;
        linkedInUrl?: string | null;
        yearsOfExperience?: number | null;
    };
    skills?: string[];
    workExperiences?: ResumeProfilePreview["workExperiences"];
    education?: ResumeProfilePreview["education"];
    certifications?: ResumeProfilePreview["certifications"];
};

export type ImportResumeProfileResponse = {
    success: true;
    message: string;
    imported: {
        skillsAdded: number;
        workExperiencesAdded: number;
        educationAdded: number;
        certificationsAdded: number;
    };
};
