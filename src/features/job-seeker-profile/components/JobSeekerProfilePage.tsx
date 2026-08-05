"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    BriefcaseBusiness,
    CheckCircle2,
    Globe2,
    Link2,
    LoaderCircle,
    MapPin,
    RotateCcw,
    Save,
    Sparkles,
    UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    useCertifications,
    useEducation,
    useJobSeekerProfile,
    useJobSeekerSkills,
    useUpdateJobSeekerProfile,
    useWorkExperiences,
} from "../hooks/useJobSeekerProfile";

import JobSeekerCertificationCard from "./JobSeekerCertificationCard";
import JobSeekerEducationCard from "./JobSeekerEducationCard";
import JobSeekerSkillsCard from "./JobSeekerSkillsCard";
import JobSeekerWorkExperienceCard from "./JobSeekerWorkExperienceCard";

import type { JobSeekerProfile, UpdateJobSeekerProfileRequest } from "../types/jobSeekerProfile";

const PROFILE_FORM_ID = "job-seeker-profile-form";

const optionalUrlSchema = z
    .string()
    .trim()
    .max(500, "URL must not exceed 500 characters.")
    .refine(
        (value) => value === "" || z.url().safeParse(value).success,
        "Enter a valid URL beginning with http:// or https://.",
    );

const profileFormSchema = z.object({
    headline: z.string().trim().max(120, "Headline must not exceed 120 characters."),

    summary: z.string().trim().max(2000, "Summary must not exceed 2,000 characters."),

    location: z.string().trim().max(120, "Location must not exceed 120 characters."),

    websiteUrl: optionalUrlSchema,
    linkedInUrl: optionalUrlSchema,

    yearsOfExperience: z
        .number()
        .int("Years of experience must be a whole number.")
        .min(0, "Years of experience cannot be negative.")
        .max(60, "Years of experience must not exceed 60.")
        .nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function getDefaultValues(profile: JobSeekerProfile | null): ProfileFormValues {
    return {
        headline: profile?.headline ?? "",
        summary: profile?.summary ?? "",
        location: profile?.location ?? "",
        websiteUrl: profile?.websiteUrl ?? "",
        linkedInUrl: profile?.linkedInUrl ?? "",
        yearsOfExperience: profile?.yearsOfExperience ?? null,
    };
}

function normalizeOptionalText(value: string): string | null {
    const normalizedValue = value.trim();

    return normalizedValue === "" ? null : normalizedValue;
}

function createUpdateRequest(values: ProfileFormValues): UpdateJobSeekerProfileRequest {
    return {
        headline: normalizeOptionalText(values.headline),
        summary: normalizeOptionalText(values.summary),
        location: normalizeOptionalText(values.location),
        websiteUrl: normalizeOptionalText(values.websiteUrl),
        linkedInUrl: normalizeOptionalText(values.linkedInUrl),
        yearsOfExperience: values.yearsOfExperience,
    };
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? "Unable to update your job seeker profile.";
    }

    return "Unable to update your job seeker profile.";
}

type ProfileSectionCompletion = {
    hasWorkExperience: boolean;
    hasEducation: boolean;
    hasCertification: boolean;
    hasSkill: boolean;
};

function getProfileCompletion(
    profile: JobSeekerProfile | null,
    sections: ProfileSectionCompletion,
): number {
    if (!profile) {
        return 0;
    }

    const fields = [
        profile.headline,
        profile.summary,
        profile.location,
        profile.websiteUrl,
        profile.linkedInUrl,
        profile.yearsOfExperience,
        sections.hasWorkExperience,
        sections.hasEducation,
        sections.hasCertification,
        sections.hasSkill,
    ];

    const completedFields = fields.filter((value) => {
        if (typeof value === "number") {
            return true;
        }

        return Boolean(value);
    }).length;

    return Math.round((completedFields / fields.length) * 100);
}

type ProfileFormStatus = {
    isDirty: boolean;
    isPending: boolean;
};

type ProfileFormProps = Readonly<{
    profile: JobSeekerProfile | null;
    onStatusChange: (status: ProfileFormStatus) => void;
}>;

function ProfileForm({ profile, onStatusChange }: ProfileFormProps) {
    const updateMutation = useUpdateJobSeekerProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: getDefaultValues(profile),
        mode: "onBlur",
    });

    const headline = useWatch({
        control: form.control,
        name: "headline",
    });

    const summary = useWatch({
        control: form.control,
        name: "summary",
    });

    const isDirty = form.formState.isDirty;
    const isPending = updateMutation.isPending;

    useEffect(() => {
        onStatusChange({
            isDirty,
            isPending,
        });
    }, [isDirty, isPending, onStatusChange]);

    async function handleSubmit(values: ProfileFormValues) {
        const toastId = toast.loading("Saving your profile...");

        try {
            const response = await updateMutation.mutateAsync(createUpdateRequest(values));

            form.reset(getDefaultValues(response.profile));

            toast.success(response.message, {
                id: toastId,
                description: "Your job seeker details are now up to date.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error), {
                id: toastId,
            });
        }
    }

    function handleReset() {
        form.reset(getDefaultValues(profile));
    }

    return (
        <form
            id={PROFILE_FORM_ID}
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={(event) => {
                event.preventDefault();
                handleReset();
            }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BriefcaseBusiness className="size-6" />
                        </div>

                        <div>
                            <CardTitle>Professional introduction</CardTitle>

                            <CardDescription className="mt-1">
                                Tell employers what you do and what kind of opportunities you are
                                looking for.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <label htmlFor="profile-headline" className="text-sm font-semibold">
                                Professional headline
                            </label>

                            <span className="text-xs text-muted-foreground">
                                {headline.length}/120
                            </span>
                        </div>

                        <Input
                            id="profile-headline"
                            placeholder="e.g. Junior Web Developer"
                            maxLength={120}
                            disabled={updateMutation.isPending}
                            className="mt-2"
                            {...form.register("headline")}
                        />

                        {form.formState.errors.headline && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.formState.errors.headline.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <label htmlFor="profile-summary" className="text-sm font-semibold">
                                Professional summary
                            </label>

                            <span className="text-xs text-muted-foreground">
                                {summary.length}/2000
                            </span>
                        </div>

                        <textarea
                            id="profile-summary"
                            rows={7}
                            maxLength={2000}
                            placeholder="Describe your background, strengths, and career goals."
                            disabled={updateMutation.isPending}
                            className="mt-2 flex min-h-36 w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("summary")}
                        />

                        {form.formState.errors.summary && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.formState.errors.summary.message}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <UserRound className="size-6" />
                        </div>

                        <div>
                            <CardTitle>Career details</CardTitle>

                            <CardDescription className="mt-1">
                                Add information employers commonly use when reviewing a candidate.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="profile-location" className="text-sm font-semibold">
                                Location
                            </label>

                            <div className="relative mt-2">
                                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="profile-location"
                                    placeholder="Pasay City, Metro Manila"
                                    maxLength={120}
                                    disabled={updateMutation.isPending}
                                    className="pl-9"
                                    {...form.register("location")}
                                />
                            </div>

                            {form.formState.errors.location && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.formState.errors.location.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="profile-experience" className="text-sm font-semibold">
                                Years of experience
                            </label>

                            <Input
                                id="profile-experience"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={60}
                                step={1}
                                placeholder="0"
                                disabled={updateMutation.isPending}
                                className="mt-2"
                                {...form.register("yearsOfExperience", {
                                    setValueAs: (value) =>
                                        value === "" || value === null ? null : Number(value),
                                })}
                            />

                            {form.formState.errors.yearsOfExperience && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.formState.errors.yearsOfExperience.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="profile-website" className="text-sm font-semibold">
                                Portfolio or website
                            </label>

                            <div className="relative mt-2">
                                <Globe2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="profile-website"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    maxLength={500}
                                    disabled={updateMutation.isPending}
                                    className="pl-9"
                                    {...form.register("websiteUrl")}
                                />
                            </div>

                            {form.formState.errors.websiteUrl && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.formState.errors.websiteUrl.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="profile-linkedin" className="text-sm font-semibold">
                                LinkedIn profile
                            </label>

                            <div className="relative mt-2">
                                <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="profile-linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/your-name"
                                    maxLength={500}
                                    disabled={updateMutation.isPending}
                                    className="pl-9"
                                    {...form.register("linkedInUrl")}
                                />
                            </div>

                            {form.formState.errors.linkedInUrl && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.formState.errors.linkedInUrl.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

export default function JobSeekerProfilePage() {
    const profileQuery = useJobSeekerProfile();
    const workExperiencesQuery = useWorkExperiences();
    const educationQuery = useEducation();
    const certificationsQuery = useCertifications();
    const skillsQuery = useJobSeekerSkills();

    const [profileFormStatus, setProfileFormStatus] = useState<ProfileFormStatus>({
        isDirty: false,
        isPending: false,
    });

    const handleProfileFormStatusChange = useCallback((status: ProfileFormStatus) => {
        setProfileFormStatus((currentStatus) => {
            if (
                currentStatus.isDirty === status.isDirty &&
                currentStatus.isPending === status.isPending
            ) {
                return currentStatus;
            }

            return status;
        });
    }, []);

    if (profileQuery.isPending) {
        return (
            <div className="space-y-6">
                <div className="h-24 animate-pulse rounded-2xl border bg-white" />
                <div className="h-80 animate-pulse rounded-2xl border bg-white" />
                <div className="h-72 animate-pulse rounded-2xl border bg-white" />
            </div>
        );
    }

    if (profileQuery.isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="font-semibold text-red-700">
                    Unable to load your job seeker profile.
                </p>

                <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => void profileQuery.refetch()}
                >
                    Try again
                </Button>
            </div>
        );
    }

    const profile = profileQuery.data.profile;

    const completion = getProfileCompletion(profile, {
        hasWorkExperience: (workExperiencesQuery.data?.workExperiences.length ?? 0) > 0,
        hasEducation: (educationQuery.data?.education.length ?? 0) > 0,
        hasCertification: (certificationsQuery.data?.certifications.length ?? 0) > 0,
        hasSkill: (skillsQuery.data?.skills.length ?? 0) > 0,
    });

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold text-blue-600">Job seeker account</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Profile</h1>

                <p className="mt-2 text-slate-600">
                    Build a professional profile that can support your job applications.
                </p>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Sparkles className="size-6" />
                                </div>

                                <div>
                                    <p className="font-semibold text-slate-950">
                                        Profile completion
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Complete your professional details so employers can
                                        understand your background more quickly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t bg-slate-50/70 p-6 lg:border-t-0 lg:border-l">
                            <div className="flex items-end justify-between gap-4">
                                <span className="text-sm font-semibold text-slate-600">
                                    Completed
                                </span>

                                <span className="text-2xl font-bold text-slate-950">
                                    {completion}%
                                </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-[width]"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>

                            {completion === 100 && (
                                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                                    <CheckCircle2 className="size-4" />
                                    Profile complete
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ProfileForm
                key={profile?.updatedAt ?? "new-profile"}
                profile={profile}
                onStatusChange={handleProfileFormStatusChange}
            />

            <JobSeekerWorkExperienceCard />

            <JobSeekerEducationCard />

            <JobSeekerCertificationCard />

            <JobSeekerSkillsCard />

            <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-600">
                    Save any changes made to your professional introduction or career details.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                    <Button
                        type="reset"
                        form={PROFILE_FORM_ID}
                        variant="outline"
                        disabled={!profileFormStatus.isDirty || profileFormStatus.isPending}
                    >
                        <RotateCcw />
                        Reset changes
                    </Button>

                    <Button
                        type="submit"
                        form={PROFILE_FORM_ID}
                        disabled={!profileFormStatus.isDirty || profileFormStatus.isPending}
                    >
                        {profileFormStatus.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Save />
                        )}

                        {profileFormStatus.isPending ? "Saving..." : "Save profile"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
