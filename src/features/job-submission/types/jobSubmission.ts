export const workplaceTypes = ["ONSITE", "HYBRID", "REMOTE"] as const;
export type WorkplaceType = (typeof workplaceTypes)[number];

export const employmentTypes = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "TEMPORARY",
    "INTERNSHIP",
] as const;
export type EmploymentType = (typeof employmentTypes)[number];

export type PublicJobSubmissionRequest = {
    jobTitle: string;
    companyName: string;
    companyWebsite?: string;
    location: string;
    workplaceType: WorkplaceType;
    employmentType: EmploymentType;
    salaryText?: string;
    description: string;
    contactEmail: string;
    contactPhone?: string;
    website: string;
};

export type PublicJobSubmissionResponse = {
    success: true;
    message: string;
    submission: {
        referenceCode: string;
        status: "SUBMITTED" | "CONTACTED" | "PUBLISHED" | "REJECTED";
        receivedAt: string;
    };
};

export type PublicJobSubmissionErrorResponse = {
    success: false;
    message?: string;
    code?: string;
    referenceCode?: string;
    submittedAt?: string;
    errors?: Record<string, string[]>;
};
