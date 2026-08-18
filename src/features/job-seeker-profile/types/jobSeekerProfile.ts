export type JobSeekerProfile = {
    id: string;
    userId: string;
    headline: string | null;
    summary: string | null;
    location: string | null;
    websiteUrl: string | null;
    linkedInUrl: string | null;
    yearsOfExperience: number | null;
    createdAt: string;
    updatedAt: string;
};

export type JobSeekerSkill = {
    id: string;
    name: string;
    slug: string;
    yearsOfExperience: number | null;
    createdAt: string;
};

export type GetJobSeekerProfileResponse = {
    success: boolean;
    profile: JobSeekerProfile | null;
};

export type UpdateJobSeekerProfileRequest = {
    headline?: string | null;
    summary?: string | null;
    location?: string | null;
    websiteUrl?: string | null;
    linkedInUrl?: string | null;
    yearsOfExperience?: number | null;
};

export type UpdateJobSeekerProfileResponse = {
    success: boolean;
    message: string;
    profile: JobSeekerProfile;
};

export type GetJobSeekerSkillsResponse = {
    success: boolean;
    skills: JobSeekerSkill[];
};

export type AddJobSeekerSkillRequest = {
    name: string;
    yearsOfExperience?: number | null;
};

export type AddJobSeekerSkillResponse = {
    success: boolean;
    message: string;
    skill: JobSeekerSkill;
};

export type UpdateJobSeekerSkillRequest = {
    yearsOfExperience: number | null;
};

export type UpdateJobSeekerSkillResponse = {
    success: boolean;
    message: string;
    skill: JobSeekerSkill;
};

export type DeleteJobSeekerSkillResponse = {
    success: boolean;
    message: string;
    id: string;
};

export type WorkExperienceEmploymentType =
    "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";

export type WorkExperience = {
    id: string;
    jobTitle: string;
    companyName: string;
    employmentType: WorkExperienceEmploymentType | null;
    location: string | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
};

export type GetWorkExperiencesResponse = {
    success: boolean;
    workExperiences: WorkExperience[];
};

export type SaveWorkExperienceRequest = {
    jobTitle: string;
    companyName: string;
    employmentType: WorkExperienceEmploymentType | null;
    location: string | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
};

export type CreateWorkExperienceResponse = {
    success: boolean;
    message: string;
    workExperience: WorkExperience;
};

export type UpdateWorkExperienceResponse = {
    success: boolean;
    message: string;
    workExperience: WorkExperience;
};

export type DeleteWorkExperienceResponse = {
    success: boolean;
    message: string;
    id: string;
};

export type Education = {
    id: string;
    institutionName: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
};

export type GetEducationResponse = {
    success: boolean;
    education: Education[];
};

export type SaveEducationRequest = {
    institutionName: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
};

export type CreateEducationResponse = {
    success: boolean;
    message: string;
    education: Education;
};

export type UpdateEducationResponse = {
    success: boolean;
    message: string;
    education: Education;
};

export type DeleteEducationResponse = {
    success: boolean;
    message: string;
    id: string;
};

export type Certification = {
    id: string;
    name: string;
    issuingOrganization: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
    credentialUrl: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
};

export type GetCertificationsResponse = {
    success: boolean;
    certifications: Certification[];
};

export type SaveCertificationRequest = {
    name: string;
    issuingOrganization: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
    credentialUrl: string | null;
};

export type CreateCertificationResponse = {
    success: boolean;
    message: string;
    certification: Certification;
};

export type UpdateCertificationResponse = {
    success: boolean;
    message: string;
    certification: Certification;
};

export type DeleteCertificationResponse = {
    success: boolean;
    message: string;
    id: string;
};
