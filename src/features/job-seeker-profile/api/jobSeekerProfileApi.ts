import apiClient from "@/lib/apiClient";

import type {
    AddJobSeekerSkillRequest,
    AddJobSeekerSkillResponse,
    CreateCertificationResponse,
    CreateEducationResponse,
    CreateWorkExperienceResponse,
    DeleteCertificationResponse,
    DeleteEducationResponse,
    DeleteJobSeekerSkillResponse,
    DeleteWorkExperienceResponse,
    GetCertificationsResponse,
    GetEducationResponse,
    GetJobSeekerProfileResponse,
    GetJobSeekerSkillsResponse,
    GetWorkExperiencesResponse,
    SaveCertificationRequest,
    SaveEducationRequest,
    SaveWorkExperienceRequest,
    UpdateCertificationResponse,
    UpdateEducationResponse,
    UpdateJobSeekerProfileRequest,
    UpdateJobSeekerProfileResponse,
    UpdateJobSeekerSkillRequest,
    UpdateJobSeekerSkillResponse,
    UpdateWorkExperienceResponse,
} from "../types/jobSeekerProfile";

export async function getJobSeekerProfile(): Promise<GetJobSeekerProfileResponse> {
    const response = await apiClient.get<GetJobSeekerProfileResponse>("/job-seeker-profile");

    return response.data;
}

export async function updateJobSeekerProfile(
    data: UpdateJobSeekerProfileRequest,
): Promise<UpdateJobSeekerProfileResponse> {
    const response = await apiClient.patch<UpdateJobSeekerProfileResponse>(
        "/job-seeker-profile",
        data,
    );

    return response.data;
}

export async function getJobSeekerSkills(): Promise<GetJobSeekerSkillsResponse> {
    const response = await apiClient.get<GetJobSeekerSkillsResponse>("/job-seeker-profile/skills");

    return response.data;
}

export async function addJobSeekerSkill(
    data: AddJobSeekerSkillRequest,
): Promise<AddJobSeekerSkillResponse> {
    const response = await apiClient.post<AddJobSeekerSkillResponse>(
        "/job-seeker-profile/skills",
        data,
    );

    return response.data;
}

export async function updateJobSeekerSkill({
    skillId,
    data,
}: {
    skillId: string;
    data: UpdateJobSeekerSkillRequest;
}): Promise<UpdateJobSeekerSkillResponse> {
    const response = await apiClient.patch<UpdateJobSeekerSkillResponse>(
        `/job-seeker-profile/skills/${skillId}`,
        data,
    );

    return response.data;
}

export async function deleteJobSeekerSkill(skillId: string): Promise<DeleteJobSeekerSkillResponse> {
    const response = await apiClient.delete<DeleteJobSeekerSkillResponse>(
        `/job-seeker-profile/skills/${skillId}`,
    );

    return response.data;
}

export async function getWorkExperiences(): Promise<GetWorkExperiencesResponse> {
    const response = await apiClient.get<GetWorkExperiencesResponse>(
        "/job-seeker-profile/work-experiences",
    );

    return response.data;
}

export async function createWorkExperience(
    data: SaveWorkExperienceRequest,
): Promise<CreateWorkExperienceResponse> {
    const response = await apiClient.post<CreateWorkExperienceResponse>(
        "/job-seeker-profile/work-experiences",
        data,
    );

    return response.data;
}

export async function updateWorkExperience({
    experienceId,
    data,
}: {
    experienceId: string;
    data: SaveWorkExperienceRequest;
}): Promise<UpdateWorkExperienceResponse> {
    const response = await apiClient.patch<UpdateWorkExperienceResponse>(
        `/job-seeker-profile/work-experiences/${experienceId}`,
        data,
    );

    return response.data;
}

export async function deleteWorkExperience(
    experienceId: string,
): Promise<DeleteWorkExperienceResponse> {
    const response = await apiClient.delete<DeleteWorkExperienceResponse>(
        `/job-seeker-profile/work-experiences/${experienceId}`,
    );

    return response.data;
}

export async function getEducation(): Promise<GetEducationResponse> {
    const response = await apiClient.get<GetEducationResponse>("/job-seeker-profile/education");

    return response.data;
}

export async function createEducation(
    data: SaveEducationRequest,
): Promise<CreateEducationResponse> {
    const response = await apiClient.post<CreateEducationResponse>(
        "/job-seeker-profile/education",
        data,
    );

    return response.data;
}

export async function updateEducation({
    educationId,
    data,
}: {
    educationId: string;
    data: SaveEducationRequest;
}): Promise<UpdateEducationResponse> {
    const response = await apiClient.patch<UpdateEducationResponse>(
        `/job-seeker-profile/education/${educationId}`,
        data,
    );

    return response.data;
}

export async function deleteEducation(educationId: string): Promise<DeleteEducationResponse> {
    const response = await apiClient.delete<DeleteEducationResponse>(
        `/job-seeker-profile/education/${educationId}`,
    );

    return response.data;
}

export async function getCertifications(): Promise<GetCertificationsResponse> {
    const response = await apiClient.get<GetCertificationsResponse>(
        "/job-seeker-profile/certifications",
    );

    return response.data;
}

export async function createCertification(
    data: SaveCertificationRequest,
): Promise<CreateCertificationResponse> {
    const response = await apiClient.post<CreateCertificationResponse>(
        "/job-seeker-profile/certifications",
        data,
    );

    return response.data;
}

export async function updateCertification({
    certificationId,
    data,
}: {
    certificationId: string;
    data: SaveCertificationRequest;
}): Promise<UpdateCertificationResponse> {
    const response = await apiClient.patch<UpdateCertificationResponse>(
        `/job-seeker-profile/certifications/${certificationId}`,
        data,
    );

    return response.data;
}

export async function deleteCertification(
    certificationId: string,
): Promise<DeleteCertificationResponse> {
    const response = await apiClient.delete<DeleteCertificationResponse>(
        `/job-seeker-profile/certifications/${certificationId}`,
    );

    return response.data;
}
