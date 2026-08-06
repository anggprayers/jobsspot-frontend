"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    Download,
    ExternalLink,
    FileText,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useCompanyApplication } from "../hooks/useCompanyApplication";
import { useCompanyApplicationResumeDownload } from "../hooks/useCompanyApplicationResumeDownload";
import { useUpdateCompanyApplicationStatus } from "../hooks/useUpdateCompanyApplicationStatus";
import type { ManageableEmployerApplicationStatus } from "../types/employerApplication";
import {
    formatApplicationDateTime,
    formatApplicationStatus,
    formatFileSize,
    getApplicantInitials,
    getApplicationStatusBadgeClasses,
} from "../utils/applicationFormatters";

import { canUpdateApplications } from "@/features/employers/utils/employerPermissions";

const manageableStatuses: {
    value: ManageableEmployerApplicationStatus;
    label: string;
}[] = [
    {
        value: "UNDER_REVIEW",
        label: "Under review",
    },
    {
        value: "SHORTLISTED",
        label: "Shortlisted",
    },
    {
        value: "INTERVIEW",
        label: "Interview",
    },
    {
        value: "OFFERED",
        label: "Offered",
    },
    {
        value: "HIRED",
        label: "Hired",
    },
    {
        value: "REJECTED",
        label: "Rejected",
    },
];

function formatEnumValue(value: string): string {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getErrorMessage(error: unknown, fallback = "Unable to load this application."): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
}

function openSecureResume(downloadUrl: string) {
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default function EmployerApplicantDetailsPage() {
    const params = useParams<{
        applicationId: string;
    }>();

    const { activeCompanyId, activeCompanyRole } = useAuth();

    const companyId = activeCompanyId ?? "";
    const applicationId = params.applicationId;

    const [selectedStatus, setSelectedStatus] = useState<ManageableEmployerApplicationStatus | "">(
        "",
    );

    const applicationQuery = useCompanyApplication({
        companyId,
        applicationId,
    });

    const updateStatusMutation = useUpdateCompanyApplicationStatus({
        companyId,
        applicationId,
    });

    const resumeDownloadMutation = useCompanyApplicationResumeDownload({
        companyId,
        applicationId,
    });

    const hasApplicationManagementAccess = canUpdateApplications(activeCompanyRole);

    function handleUpdateStatus() {
        if (!hasApplicationManagementAccess || !selectedStatus) {
            return;
        }

        const toastId = toast.loading("Updating application status...");

        updateStatusMutation.mutate(
            {
                status: selectedStatus,
            },
            {
                onSuccess: () => {
                    toast.success("Application status updated.", {
                        id: toastId,
                        description: `The application is now marked as ${formatApplicationStatus(
                            selectedStatus,
                        ).toLowerCase()}.`,
                    });

                    setSelectedStatus("");
                },

                onError: (error) => {
                    const message = axios.isAxiosError<{
                        message?: string;
                    }>(error)
                        ? (error.response?.data?.message ??
                          "Unable to update the application status.")
                        : "Unable to update the application status.";

                    toast.error(message, {
                        id: toastId,
                    });
                },
            },
        );
    }

    async function handleOpenResume() {
        if (!applicationQuery.data?.application.resume || resumeDownloadMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Preparing secure resume link...");

        try {
            const response = await resumeDownloadMutation.mutateAsync();

            openSecureResume(response.downloadUrl);

            toast.success("Resume opened securely.", {
                id: toastId,
                description: "The private link expires in five minutes.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to open the submitted resume."), {
                id: toastId,
                description: "Confirm your account is verified and still has access to this company.",
            });
        }
    }

    if (applicationQuery.isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
                    Loading applicant details...
                </div>
            </div>
        );
    }

    if (applicationQuery.isError || !applicationQuery.data?.application) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <Button variant="outline" asChild>
                    <Link href="/employers/applicants">
                        <ArrowLeft className="size-4" />
                        Back to applicants
                    </Link>
                </Button>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                    {getErrorMessage(applicationQuery.error)}
                </div>
            </div>
        );
    }

    const application = applicationQuery.data.application;

    const applicant = application.applicant;
    const profile = applicant.jobSeekerProfile;

    const availableStatuses = manageableStatuses.filter(
        (option) => option.value !== application.status,
    );

    const canUpdateStatus = hasApplicationManagementAccess && application.status !== "WITHDRAWN";

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <Button variant="outline" size="sm" asChild>
                <Link href="/employers/applicants">
                    <ArrowLeft className="size-4" />
                    Back to applicants
                </Link>
            </Button>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                            {getApplicantInitials(applicant.firstName, applicant.lastName)}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                    {applicant.firstName} {applicant.lastName}
                                </h1>

                                <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusBadgeClasses(
                                        application.status,
                                    )}`}
                                >
                                    {formatApplicationStatus(application.status)}
                                </span>
                            </div>

                            <p className="mt-2 text-slate-600">
                                {profile?.headline ?? "Job applicant"}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Applied {formatApplicationDateTime(application.appliedAt)}
                            </p>
                        </div>
                    </div>

                    {canUpdateStatus ? (
                        <div className="w-full space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:max-w-sm">
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Update application status
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    The applicant&apos;s hiring stage will be updated immediately.
                                </p>
                            </div>

                            <Select
                                value={selectedStatus}
                                onValueChange={(value) =>
                                    setSelectedStatus(value as ManageableEmployerApplicationStatus)
                                }
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select a new status" />
                                </SelectTrigger>

                                <SelectContent>
                                    {availableStatuses.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                type="button"
                                className="w-full"
                                disabled={!selectedStatus || updateStatusMutation.isPending}
                                onClick={handleUpdateStatus}
                            >
                                {updateStatusMutation.isPending ? "Updating..." : "Update status"}
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            {application.status === "WITHDRAWN"
                                ? "This application was withdrawn and can no longer be updated."
                                : "Your company role has view-only access."}
                        </div>
                    )}
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant profile</CardTitle>

                            <CardDescription>
                                Contact information and professional background.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex gap-3">
                                    <Mail className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-500">Email</p>

                                        <a
                                            href={`mailto:${applicant.email}`}
                                            className="mt-1 block truncate text-sm font-medium text-blue-700 hover:underline"
                                        >
                                            {applicant.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-medium text-slate-500">Phone</p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {applicant.phone ?? "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            Location
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {profile?.location ?? "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <UserRound className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-medium text-slate-500">
                                            Experience
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {profile?.yearsOfExperience !== null &&
                                            profile?.yearsOfExperience !== undefined
                                                ? `${profile.yearsOfExperience} year${
                                                      profile.yearsOfExperience === 1 ? "" : "s"
                                                  }`
                                                : "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {profile?.summary ? (
                                <div className="border-t border-slate-100 pt-5">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Professional summary
                                    </p>

                                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                                        {profile.summary}
                                    </p>
                                </div>
                            ) : (
                                <p className="border-t border-slate-100 pt-5 text-sm text-slate-500">
                                    No professional summary was provided.
                                </p>
                            )}

                            {(profile?.websiteUrl || profile?.linkedInUrl) && (
                                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                                    {profile.linkedInUrl && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a
                                                href={profile.linkedInUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                LinkedIn
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        </Button>
                                    )}

                                    {profile.websiteUrl && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a
                                                href={profile.websiteUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Website
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cover letter</CardTitle>

                            <CardDescription>
                                Message submitted with this application.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {application.coverLetter ? (
                                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                                    {application.coverLetter}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    The applicant did not provide a cover letter.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applied job</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-lg font-semibold text-slate-950">
                                    {application.job.title}
                                </p>

                                <p className="mt-1 text-sm text-blue-700">
                                    {application.job.category.name}
                                </p>
                            </div>

                            <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <BriefcaseBusiness className="size-4 text-slate-400" />
                                    <span className="text-slate-700">
                                        {formatEnumValue(application.job.employmentType)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <UserRound className="size-4 text-slate-400" />
                                    <span className="text-slate-700">
                                        {formatEnumValue(application.job.experienceLevel)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="size-4 text-slate-400" />
                                    <span className="text-slate-700">
                                        {application.job.location ??
                                            formatEnumValue(application.job.workplaceType)}
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/employers/jobs/${application.job.id}`}>
                                    View job details
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resume</CardTitle>

                            <CardDescription>Resume selected for this application.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {application.resume ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                        <FileText className="mt-0.5 size-5 shrink-0 text-blue-700" />

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">
                                                {application.resume.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {formatFileSize(application.resume.fileSize)}
                                                {" · "}
                                                {application.resume.mimeType}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        disabled={resumeDownloadMutation.isPending}
                                        onClick={() => void handleOpenResume()}
                                    >
                                        {resumeDownloadMutation.isPending ? (
                                            <>
                                                <LoaderCircle className="size-4 animate-spin" />
                                                Preparing resume...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="size-4" />
                                                Open submitted resume
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs leading-5 text-slate-500">
                                        Access is private and the secure link expires after five minutes.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No resume was attached to this application.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application timeline</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        Application submitted
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatApplicationDateTime(application.appliedAt)}
                                    </p>
                                </div>
                            </div>

                            {application.reviewedAt && (
                                <div className="flex gap-3">
                                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            First reviewed
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {formatApplicationDateTime(application.reviewedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {application.withdrawnAt && (
                                <div className="flex gap-3">
                                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Withdrawn
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {formatApplicationDateTime(application.withdrawnAt)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <p className="border-t border-slate-100 pt-4 text-xs text-slate-500">
                                Current status:{" "}
                                <span className="font-semibold text-slate-700">
                                    {formatApplicationStatus(application.status)}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
