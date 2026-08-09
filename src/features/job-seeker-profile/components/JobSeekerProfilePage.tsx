"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    BriefcaseBusiness,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Globe2,
    Link2,
    Mail,
    MapPin,
    RotateCcw,
    Save,
    Sparkles,
    UserRound,
} from "lucide-react";
import { useMemo, useState, type SubmitEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import ImportProfileFromResumeDialog from "@/features/resumes/components/ImportProfileFromResumeDialog";

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
import type { AuthUser } from "@/features/auth/types/auth";

const optionalUrlSchema = z
    .string()
    .trim()
    .max(500, "URL must not exceed 500 characters.")
    .refine(
        (value) => value === "" || z.url().safeParse(value).success,
        "Enter a valid URL beginning with http:// or https://.",
    );

const professionalProfileSchema = z.object({
    headline: z.string().trim().max(120, "Headline must not exceed 120 characters."),
    summary: z.string().trim().max(2000, "Summary must not exceed 2,000 characters."),
    websiteUrl: optionalUrlSchema,
    linkedInUrl: optionalUrlSchema,
    yearsOfExperience: z
        .number()
        .int("Years of experience must be a whole number.")
        .min(0, "Years of experience cannot be negative.")
        .max(60, "Years of experience must not exceed 60.")
        .nullable(),
});

type ProfessionalProfileValues = z.infer<typeof professionalProfileSchema>;

type ProfileSectionCompletion = {
    hasWorkExperience: boolean;
    hasEducation: boolean;
    hasCertification: boolean;
    hasSkill: boolean;
};

function normalizeOptionalText(value: string): string | null {
    const normalizedValue = value.trim();
    return normalizedValue === "" ? null : normalizedValue;
}

function getProfessionalDefaults(profile: JobSeekerProfile | null): ProfessionalProfileValues {
    return {
        headline: profile?.headline ?? "",
        summary: profile?.summary ?? "",
        websiteUrl: profile?.websiteUrl ?? "",
        linkedInUrl: profile?.linkedInUrl ?? "",
        yearsOfExperience: profile?.yearsOfExperience ?? null,
    };
}

function getProfileCompletion(
    user: AuthUser | null,
    profile: JobSeekerProfile | null,
    sections: ProfileSectionCompletion,
): number {
    if (!user) {
        return 0;
    }

    const fields = [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        profile?.location,
        profile?.headline,
        profile?.summary,
        profile?.websiteUrl,
        profile?.linkedInUrl,
        profile?.yearsOfExperience,
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

function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
        const responseData = error.response?.data;
        const firstFieldError = responseData?.errors
            ? Object.values(responseData.errors).flat().find(Boolean)
            : undefined;

        return firstFieldError ?? responseData?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

type PersonalInformationSectionProps = Readonly<{
    user: AuthUser;
    profile: JobSeekerProfile | null;
}>;

function PersonalInformationSection({ user, profile }: PersonalInformationSectionProps) {
    const accountMutation = useUpdateProfile();
    const jobSeekerMutation = useUpdateJobSeekerProfile();
    const [isExpanded, setIsExpanded] = useState(true);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [phone, setPhone] = useState(user.phone ?? "");
    const [location, setLocation] = useState(profile?.location ?? "");

    const normalized = useMemo(
        () => ({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: normalizeOptionalText(phone),
            location: normalizeOptionalText(location),
        }),
        [firstName, lastName, location, phone],
    );

    const accountChanged =
        normalized.firstName !== user.firstName ||
        normalized.lastName !== user.lastName ||
        normalized.phone !== user.phone;
    const locationChanged = normalized.location !== (profile?.location ?? null);
    const isDirty = accountChanged || locationChanged;
    const isPending = accountMutation.isPending || jobSeekerMutation.isPending;

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isPending || !isDirty) {
            return;
        }

        if (normalized.firstName.length < 2 || normalized.lastName.length < 2) {
            toast.error("First and last names must contain at least 2 characters.");
            return;
        }

        if (location.trim().length > 120) {
            toast.error("Location must not exceed 120 characters.");
            return;
        }

        const toastId = toast.loading("Saving personal information...");

        try {
            if (locationChanged) {
                await jobSeekerMutation.mutateAsync({
                    location: normalized.location,
                });
            }

            if (accountChanged) {
                await accountMutation.mutateAsync({
                    firstName: normalized.firstName,
                    lastName: normalized.lastName,
                    phone: normalized.phone,
                });
            }

            toast.success("Personal information updated.", {
                id: toastId,
                description: "Your candidate identity and contact details are now up to date.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update your personal information."), {
                id: toastId,
            });
        }
    }

    function handleReset() {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhone(user.phone ?? "");
        setLocation(profile?.location ?? "");
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <UserRound className="size-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <CardTitle>Personal information</CardTitle>
                            <CardDescription className="mt-1">
                                Keep your name, contact details, and location accurate for employers.
                            </CardDescription>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        aria-expanded={isExpanded}
                        onClick={() => setIsExpanded((value) => !value)}
                        className="w-full sm:w-auto"
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        {isExpanded ? "Hide" : "Show"}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="profile-first-name" className="text-sm font-semibold">
                                    First name
                                </label>
                                <Input
                                    id="profile-first-name"
                                    value={firstName}
                                    minLength={2}
                                    maxLength={50}
                                    autoComplete="given-name"
                                    disabled={isPending}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="profile-last-name" className="text-sm font-semibold">
                                    Last name
                                </label>
                                <Input
                                    id="profile-last-name"
                                    value={lastName}
                                    minLength={2}
                                    maxLength={50}
                                    autoComplete="family-name"
                                    disabled={isPending}
                                    onChange={(event) => setLastName(event.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="profile-email" className="text-sm font-semibold">
                                    Email address
                                </label>
                                <div className="relative mt-2">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="profile-email"
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        aria-readonly="true"
                                        className="bg-slate-50 pl-9 text-slate-600"
                                    />
                                </div>
                                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                                    {user.isEmailVerified ? "Verified email" : "Email verification pending"}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="profile-phone" className="text-sm font-semibold">
                                    Phone number <span className="font-normal text-slate-400">(optional)</span>
                                </label>
                                <Input
                                    id="profile-phone"
                                    type="tel"
                                    value={phone}
                                    maxLength={30}
                                    autoComplete="tel"
                                    placeholder="+1 212 555 0123"
                                    disabled={isPending}
                                    onChange={(event) => setPhone(event.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="profile-location" className="text-sm font-semibold">
                                Location <span className="font-normal text-slate-400">(optional)</span>
                            </label>
                            <div className="relative mt-2">
                                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="profile-location"
                                    value={location}
                                    maxLength={120}
                                    placeholder="New York, NY"
                                    disabled={isPending}
                                    onChange={(event) => setLocation(event.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!isDirty || isPending}
                                onClick={handleReset}
                            >
                                <RotateCcw />
                                Reset
                            </Button>
                            <Button type="submit" disabled={!isDirty || isPending}>
                                <Save />
                                {isPending ? "Saving..." : "Save personal information"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            )}
        </Card>
    );
}

type ProfessionalProfileSectionProps = Readonly<{
    profile: JobSeekerProfile | null;
}>;

function ProfessionalProfileSection({ profile }: ProfessionalProfileSectionProps) {
    const updateMutation = useUpdateJobSeekerProfile();
    const [isExpanded, setIsExpanded] = useState(true);

    const form = useForm<ProfessionalProfileValues>({
        resolver: zodResolver(professionalProfileSchema),
        defaultValues: getProfessionalDefaults(profile),
        mode: "onBlur",
    });

    const headline = useWatch({ control: form.control, name: "headline" });
    const summary = useWatch({ control: form.control, name: "summary" });

    async function handleSubmit(values: ProfessionalProfileValues) {
        const request: UpdateJobSeekerProfileRequest = {
            headline: normalizeOptionalText(values.headline),
            summary: normalizeOptionalText(values.summary),
            websiteUrl: normalizeOptionalText(values.websiteUrl),
            linkedInUrl: normalizeOptionalText(values.linkedInUrl),
            yearsOfExperience: values.yearsOfExperience,
        };

        const toastId = toast.loading("Saving professional profile...");

        try {
            const response = await updateMutation.mutateAsync(request);
            form.reset(getProfessionalDefaults(response.profile));
            toast.success(response.message, {
                id: toastId,
                description: "Your professional details are now up to date.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update your professional profile."), {
                id: toastId,
            });
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BriefcaseBusiness className="size-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle>Professional profile</CardTitle>
                            <CardDescription className="mt-1">
                                Present your headline, summary, experience level, portfolio, and LinkedIn profile.
                            </CardDescription>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        aria-expanded={isExpanded}
                        onClick={() => setIsExpanded((value) => !value)}
                        className="w-full sm:w-auto"
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        {isExpanded ? "Hide" : "Show"}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <label htmlFor="profile-headline" className="text-sm font-semibold">
                                    Professional headline
                                </label>
                                <span className="text-xs text-muted-foreground">{headline.length}/120</span>
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
                                <p className="mt-2 text-sm text-red-600">{form.formState.errors.headline.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <label htmlFor="profile-summary" className="text-sm font-semibold">
                                    Professional summary
                                </label>
                                <span className="text-xs text-muted-foreground">{summary.length}/2000</span>
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
                                <p className="mt-2 text-sm text-red-600">{form.formState.errors.summary.message}</p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
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
                                    <p className="mt-2 text-sm text-red-600">{form.formState.errors.websiteUrl.message}</p>
                                )}
                            </div>
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
                                <p className="mt-2 text-sm text-red-600">{form.formState.errors.linkedInUrl.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!form.formState.isDirty || updateMutation.isPending}
                                onClick={() => form.reset(getProfessionalDefaults(profile))}
                            >
                                <RotateCcw />
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || updateMutation.isPending}
                            >
                                <Save />
                                {updateMutation.isPending ? "Saving..." : "Save professional profile"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            )}
        </Card>
    );
}

export default function JobSeekerProfilePage() {
    const { user } = useAuth();
    const profileQuery = useJobSeekerProfile();
    const workExperiencesQuery = useWorkExperiences();
    const educationQuery = useEducation();
    const certificationsQuery = useCertifications();
    const skillsQuery = useJobSeekerSkills();

    if (!user) {
        return null;
    }

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
                <p className="font-semibold text-red-700">Unable to load your job seeker profile.</p>
                <Button type="button" variant="outline" className="mt-4" onClick={() => void profileQuery.refetch()}>
                    Try again
                </Button>
            </div>
        );
    }

    const profile = profileQuery.data.profile;
    const completion = getProfileCompletion(user, profile, {
        hasWorkExperience: (workExperiencesQuery.data?.workExperiences.length ?? 0) > 0,
        hasEducation: (educationQuery.data?.education.length ?? 0) > 0,
        hasCertification: (certificationsQuery.data?.certifications.length ?? 0) > 0,
        hasSkill: (skillsQuery.data?.skills.length ?? 0) > 0,
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Job seeker account</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Profile</h1>
                    <p className="mt-2 text-slate-600">
                        Manage your candidate information in focused sections. Open only what you need to edit.
                    </p>
                </div>
                <ImportProfileFromResumeDialog user={user} profile={profile} />
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
                                    <p className="font-semibold text-slate-950">Profile completion</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Complete your personal and professional details so employers can review your background more quickly.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t bg-slate-50/70 p-6 lg:border-t-0 lg:border-l">
                            <div className="flex items-end justify-between gap-4">
                                <span className="text-sm font-semibold text-slate-600">Completed</span>
                                <span className="text-2xl font-bold text-slate-950">{completion}%</span>
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

            <PersonalInformationSection
                key={`${user.firstName}|${user.lastName}|${user.phone ?? ""}|${profile?.location ?? ""}`}
                user={user}
                profile={profile}
            />
            <ProfessionalProfileSection
                key={profile?.updatedAt ?? "new-profile"}
                profile={profile}
            />
            <JobSeekerWorkExperienceCard />
            <JobSeekerEducationCard />
            <JobSeekerCertificationCard />
            <JobSeekerSkillsCard />
        </div>
    );
}
