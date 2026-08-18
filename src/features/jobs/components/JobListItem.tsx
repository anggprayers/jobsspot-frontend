"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Banknote,
    Bookmark,
    Building2,
    Clock3,
    LoaderCircle,
    MapPin,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SignInModal from "@/features/auth/components/SignInModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    useRemoveSavedJob,
    useSaveJob,
    useSavedJobStatus,
} from "@/features/saved-jobs/hooks/useSavedJobs";
import { getSavedJobErrorMessage } from "@/features/saved-jobs/utils/savedJobFormatters";

import type { PublicJob } from "../types/publicJob";

type JobListItemProps = Readonly<{
    job: PublicJob;
}>;

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ");
}

function formatSalary(job: PublicJob) {
    const salaryMin = job.salaryMin
        ? Number(job.salaryMin)
        : null;
    const salaryMax = job.salaryMax
        ? Number(job.salaryMax)
        : null;
    const currency = job.salaryCurrency ?? "USD";

    if (salaryMin === null && salaryMax === null) {
        return "Salary not specified";
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    });

    let salaryText = "";

    if (salaryMin !== null && salaryMax !== null) {
        salaryText = `${formatter.format(
            salaryMin,
        )} – ${formatter.format(salaryMax)}`;
    } else if (salaryMin !== null) {
        salaryText = `From ${formatter.format(
            salaryMin,
        )}`;
    } else {
        salaryText = `Up to ${formatter.format(
            salaryMax ?? 0,
        )}`;
    }

    if (job.salaryPeriod) {
        return `${salaryText} / ${formatLabel(
            job.salaryPeriod,
        ).toLowerCase()}`;
    }

    return salaryText;
}

function formatPublishedDate(
    publishedAt: string | null,
) {
    if (!publishedAt) {
        return "Recently posted";
    }

    const publishedDate = new Date(publishedAt);

    if (Number.isNaN(publishedDate.getTime())) {
        return "Recently posted";
    }

    const differenceInDays = Math.max(
        0,
        Math.floor(
            (Date.now() - publishedDate.getTime()) /
                (1000 * 60 * 60 * 24),
        ),
    );

    if (differenceInDays === 0) {
        return "Posted today";
    }

    if (differenceInDays === 1) {
        return "Posted yesterday";
    }

    if (differenceInDays < 7) {
        return `Posted ${differenceInDays} days ago`;
    }

    return publishedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getCompanyInitials(companyName: string) {
    const words = companyName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

export default function JobListItem({
    job,
}: JobListItemProps) {
    const jobUrl = `/jobs/${job.slug}`;
    const companyUrl = `/companies/${job.company.slug}`;

    const [isSignInOpen, setIsSignInOpen] =
        useState(false);

    const { isAuthenticated, isInitializing } = useAuth();

    const savedJobStatusQuery = useSavedJobStatus(
        job.id,
        isAuthenticated && !isInitializing,
    );

    const saveJobMutation = useSaveJob();
    const removeSavedJobMutation = useRemoveSavedJob();

    const isSaved =
        savedJobStatusQuery.data?.isSaved ?? false;

    const isUpdating =
        saveJobMutation.isPending ||
        removeSavedJobMutation.isPending;

    async function handleBookmarkClick() {
        if (isInitializing) {
            return;
        }

        if (!isAuthenticated) {
            setIsSignInOpen(true);
            return;
        }

        if (savedJobStatusQuery.isError) {
            void savedJobStatusQuery.refetch();
            return;
        }

        const toastId = toast.loading(
            isSaved
                ? "Removing job from saved jobs..."
                : "Saving job...",
        );

        try {
            if (isSaved) {
                await removeSavedJobMutation.mutateAsync(
                    job.id,
                );

                toast.success(
                    "Job removed from saved jobs.",
                    {
                        id: toastId,
                    },
                );
            } else {
                await saveJobMutation.mutateAsync(job.id);

                toast.success("Job saved successfully.", {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error(
                getSavedJobErrorMessage(
                    error,
                    isSaved
                        ? "Unable to remove this saved job."
                        : "Unable to save this job.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    const isCheckingStatus =
        isAuthenticated &&
        (savedJobStatusQuery.isLoading ||
            savedJobStatusQuery.isFetching);

    return (
        <>
            <article className="group relative border-b border-slate-200 last:border-b-0">
                <div className="grid gap-7 px-5 py-9 transition-all duration-200 hover:bg-slate-50 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
                    <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                        <Link
                            href={companyUrl}
                            aria-label={`View ${job.company.name} company profile`}
                            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 text-xl font-bold text-blue-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                            {job.company.logoUrl ? (
                                <Image
                                    src={
                                        job.company.logoUrl
                                    }
                                    alt={`${job.company.name} logo`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                getCompanyInitials(
                                    job.company.name,
                                )
                            )}
                        </Link>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <Link href={jobUrl}>
                                        <h3 className="text-2xl font-bold leading-tight text-slate-950 transition-colors hover:text-blue-600 sm:text-3xl">
                                            {job.title}
                                        </h3>
                                    </Link>

                                    <Link
                                        href={companyUrl}
                                        className="mt-3 inline-flex max-w-full items-center gap-2 text-lg font-medium text-slate-600 transition-colors hover:text-blue-600"
                                    >
                                        <Building2
                                            size={19}
                                            className="shrink-0 text-slate-400"
                                        />

                                        <span className="truncate">
                                            {
                                                job.company
                                                    .name
                                            }
                                        </span>
                                    </Link>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 text-base font-medium text-slate-500 sm:pt-1">
                                    <Clock3 size={17} />
                                    {formatPublishedDate(
                                        job.publishedAt,
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-slate-600">
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={19}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span>
                                        {job.location ?? "Location not specified"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 lg:hidden">
                                    <Banknote
                                        size={19}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span>
                                        {formatSalary(job)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2.5">
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-base font-semibold text-blue-700">
                                    {formatLabel(
                                        job.workplaceType,
                                    )}
                                </span>

                                <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-base font-semibold text-slate-700">
                                    {formatLabel(
                                        job.employmentType,
                                    )}
                                </span>

                                <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-base font-semibold text-slate-700">
                                    {formatLabel(
                                        job.experienceLevel,
                                    )}
                                </span>

                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 pl-20 lg:flex-col lg:items-end lg:justify-center lg:pl-0">
                        <div className="hidden text-right lg:block">
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                Compensation
                            </p>

                            <p className="mt-2 max-w-60 text-lg font-semibold leading-7 text-slate-900">
                                {formatSalary(job)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label={
                                    isSaved
                                        ? `Remove ${job.title} from saved jobs`
                                        : `Save ${job.title}`
                                }
                                title={
                                    isSaved
                                        ? "Remove from saved jobs"
                                        : "Save job"
                                }
                                disabled={
                                    isInitializing ||
                                    isCheckingStatus ||
                                    isUpdating
                                }
                                onClick={() =>
                                    void handleBookmarkClick()
                                }
                                className={`inline-flex size-13 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${
                                    isSaved
                                        ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                {isCheckingStatus ||
                                isUpdating ? (
                                    <LoaderCircle className="size-5 animate-spin" />
                                ) : savedJobStatusQuery.isError &&
                                  isAuthenticated ? (
                                    <RefreshCw className="size-5" />
                                ) : (
                                    <Bookmark
                                        className="size-5"
                                        fill={
                                            isSaved
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                )}
                            </button>

                            <Link
                                href={jobUrl}
                                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                            >
                                View Job
                                <ArrowRight size={19} />
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() =>
                    setIsSignInOpen(false)
                }
            />
        </>
    );
}
