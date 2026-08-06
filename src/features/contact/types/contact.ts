export const contactInquiryTypes = [
    "GENERAL",
    "JOB_SEEKER",
    "EMPLOYER",
    "PARTNERSHIP",
    "TECHNICAL_SUPPORT",
    "FEEDBACK",
] as const;

export type ContactInquiryType =
    (typeof contactInquiryTypes)[number];

export type ContactSubmissionRequest = {
    name: string;
    email: string;
    inquiryType: ContactInquiryType;
    subject: string;
    message: string;
    website: string;
};

export type ContactSubmissionResponse = {
    success: true;
    message: string;
    referenceId: string;
    receivedAt: string;
};

export type ContactApiErrorResponse = {
    success?: false;
    message?: string;
    errors?: Record<string, string[]>;
};
