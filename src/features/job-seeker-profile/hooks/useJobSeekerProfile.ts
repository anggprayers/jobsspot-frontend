import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    addJobSeekerSkill,
    createCertification,
    createEducation,
    createWorkExperience,
    deleteCertification,
    deleteEducation,
    deleteJobSeekerSkill,
    deleteWorkExperience,
    getCertifications,
    getEducation,
    getJobSeekerProfile,
    getJobSeekerSkills,
    getWorkExperiences,
    updateCertification,
    updateEducation,
    updateJobSeekerProfile,
    updateJobSeekerSkill,
    updateWorkExperience,
} from "../api/jobSeekerProfileApi";

import type {
    AddJobSeekerSkillRequest,
    SaveCertificationRequest,
    SaveEducationRequest,
    SaveWorkExperienceRequest,
    UpdateJobSeekerProfileRequest,
    UpdateJobSeekerSkillRequest,
} from "../types/jobSeekerProfile";

export const jobSeekerProfileQueryKey = ["job-seeker-profile"] as const;
export const jobSeekerSkillsQueryKey = ["job-seeker-profile", "skills"] as const;
export const workExperiencesQueryKey = ["job-seeker-profile", "work-experiences"] as const;
export const educationQueryKey = ["job-seeker-profile", "education"] as const;
export const certificationsQueryKey = ["job-seeker-profile", "certifications"] as const;

export function useJobSeekerProfile() {
    return useQuery({
        queryKey: jobSeekerProfileQueryKey,
        queryFn: getJobSeekerProfile,
    });
}

export function useUpdateJobSeekerProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateJobSeekerProfileRequest) => updateJobSeekerProfile(data),

        onSuccess: (response) => {
            queryClient.setQueryData(jobSeekerProfileQueryKey, {
                success: true,
                profile: response.profile,
            });
        },
    });
}

export function useJobSeekerSkills() {
    return useQuery({
        queryKey: jobSeekerSkillsQueryKey,
        queryFn: getJobSeekerSkills,
    });
}

export function useAddJobSeekerSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddJobSeekerSkillRequest) => addJobSeekerSkill(data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: jobSeekerSkillsQueryKey,
            });
        },
    });
}

export function useUpdateJobSeekerSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ skillId, data }: { skillId: string; data: UpdateJobSeekerSkillRequest }) =>
            updateJobSeekerSkill({
                skillId,
                data,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: jobSeekerSkillsQueryKey,
            });
        },
    });
}

export function useDeleteJobSeekerSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (skillId: string) => deleteJobSeekerSkill(skillId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: jobSeekerSkillsQueryKey,
            });
        },
    });
}

export function useWorkExperiences() {
    return useQuery({
        queryKey: workExperiencesQueryKey,
        queryFn: getWorkExperiences,
    });
}

export function useCreateWorkExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SaveWorkExperienceRequest) => createWorkExperience(data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: workExperiencesQueryKey,
            });
        },
    });
}

export function useUpdateWorkExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            experienceId,
            data,
        }: {
            experienceId: string;
            data: SaveWorkExperienceRequest;
        }) =>
            updateWorkExperience({
                experienceId,
                data,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: workExperiencesQueryKey,
            });
        },
    });
}

export function useDeleteWorkExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (experienceId: string) => deleteWorkExperience(experienceId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: workExperiencesQueryKey,
            });
        },
    });
}

export function useEducation() {
    return useQuery({
        queryKey: educationQueryKey,
        queryFn: getEducation,
    });
}

export function useCreateEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SaveEducationRequest) => createEducation(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: educationQueryKey,
            });
        },
    });
}

export function useUpdateEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ educationId, data }: { educationId: string; data: SaveEducationRequest }) =>
            updateEducation({ educationId, data }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: educationQueryKey,
            });
        },
    });
}

export function useDeleteEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (educationId: string) => deleteEducation(educationId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: educationQueryKey,
            });
        },
    });
}

export function useCertifications() {
    return useQuery({
        queryKey: certificationsQueryKey,
        queryFn: getCertifications,
    });
}

export function useCreateCertification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SaveCertificationRequest) => createCertification(data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: certificationsQueryKey,
            });
        },
    });
}

export function useUpdateCertification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            certificationId,
            data,
        }: {
            certificationId: string;
            data: SaveCertificationRequest;
        }) =>
            updateCertification({
                certificationId,
                data,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: certificationsQueryKey,
            });
        },
    });
}

export function useDeleteCertification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (certificationId: string) => deleteCertification(certificationId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: certificationsQueryKey,
            });
        },
    });
}
