"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Banknote,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";

import {
    useRemoveSavedJob,
    useSavedJobs,
} from "../hooks/useSavedJobs";
import type { SavedJobRecord } from "../types/savedJob";
import {
    formatSavedDate,
    formatSavedJobLabel,
    formatSavedJobSalary,
    getSavedJobCompanyInitials,
    getSavedJobErrorMessage,
} from "../utils/savedJobFormatters";

const SAVED_JOBS_PAGE_SIZE = 10;

function SavedJobsSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex gap-4">
                        <div className="size-14 shrink-0 rounded-2xl bg-slate-200" />

                        <div className="flex-1">
                            <div className="h-5 w-2/5 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-1/4 rounded bg-slate-100" />
                            <div className="mt-5 h-4 w-3/5 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

type SavedJobCardProps = Readonly<{
    savedJob: SavedJobRecord;
    isRemoving: boolean;
    onRemove: (jobId: string) => void;
}>;

function SavedJobCard({
    savedJob,
    isRemoving,
    onRemove,
}: SavedJobCardProps) {
    const { job, savedAt } = savedJob;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="flex flex-col gap-5">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 font-bold text-blue-600">
                        {job.company.logoUrl ? (
                            <Image
                                src={job.company.logoUrl}
                                alt={`${job.company.name} logo`}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        ) : (
                            getSavedJobCompanyInitials(
                                job.company.name,
                            )
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                                    job.isAvailable
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                            >
                                {job.isAvailable
                                    ? "Available"
                                    : "No longer available"}
                            </span>

                            <span className="text-sm text-slate-500">
                                Saved {formatSavedDate(savedAt)}
                            </span>
                        </div>

                        <h2 className="mt-3 wrap-break-word text-xl font-bold text-slate-950 sm:text-2xl">
                            {job.title}
                        </h2>

                        <Link
                            href={`/companies/${job.company.slug}`}
                            className="mt-2 inline-flex max-w-full items-center gap-2 font-medium text-slate-600 transition-colors hover:text-blue-600"
                        >
                            <Building2 className="size-4 shrink-0 text-slate-400" />
                            <span className="truncate">
                                {job.company.name}
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-slate-400" />
                        <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="size-4 shrink-0 text-slate-400" />
                        <span>
                            {formatSavedJobLabel(
                                job.employmentType,
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Banknote className="size-4 shrink-0 text-slate-400" />
                        <span>{formatSavedJobSalary(job)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        {formatSavedJobLabel(job.workplaceType)}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                        {formatSavedJobLabel(
                            job.experienceLevel,
                        )}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                        {job.category.name}
                    </span>
                </div>

                {!job.isAvailable && (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                        This job may have been unpublished, removed,
                        closed, or expired. You can remove it from your
                        saved jobs.
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() => onRemove(job.id)}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {isRemoving ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Trash2 className="size-4" />
                        )}

                        {isRemoving ? "Removing..." : "Remove"}
                    </button>

                    {job.isAvailable && (
                        <Link
                            href={`/jobs/${job.slug}`}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                        >
                            View job
                            <ArrowRight className="size-4" />
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

type SavedJobsPaginationProps = Readonly<{
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onPageChange: (page: number) => void;
}>;

function SavedJobsPagination({
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
}: SavedJobsPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    ).filter(
        (pageNumber) =>
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(pageNumber - page) <= 1,
    );

    return (
        <nav
            aria-label="Saved jobs pagination"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={!hasPreviousPage}
                onClick={() => onPageChange(page - 1)}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-40"
            >
                <ChevronLeft className="size-4" />
                Previous
            </button>

            {visiblePages.map((pageNumber) => (
                <button
                    key={pageNumber}
                    type="button"
                    aria-current={
                        pageNumber === page ? "page" : undefined
                    }
                    onClick={() => onPageChange(pageNumber)}
                    className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${
                        pageNumber === page
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => onPageChange(page + 1)}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-40"
            >
                Next
                <ChevronRight className="size-4" />
            </button>
        </nav>
    );
}

export default function SavedJobsPage() {
    const { isAuthenticated, isInitializing } = useAuth();

    const [page, setPage] = useState(1);

    const savedJobsQuery = useSavedJobs(
        {
            page,
            limit: SAVED_JOBS_PAGE_SIZE,
        },
        isAuthenticated && !isInitializing,
    );

    const removeMutation = useRemoveSavedJob();

    const savedJobs = savedJobsQuery.data?.savedJobs ?? [];
    const pagination = savedJobsQuery.data?.pagination;

    async function handleRemove(jobId: string) {
        const toastId = toast.loading(
            "Removing job from your saved jobs...",
        );

        try {
            await removeMutation.mutateAsync(jobId);

            toast.success("Job removed from saved jobs.", {
                id: toastId,
            });

            if (savedJobs.length === 1 && page > 1) {
                setPage((current) => Math.max(1, current - 1));
            }
        } catch (error) {
            toast.error(
                getSavedJobErrorMessage(
                    error,
                    "Unable to remove this saved job.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    return (
        <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                            Job seeker
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                            Saved jobs
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Keep interesting opportunities in one
                            place and return when you are ready to
                            apply.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
                        <Bookmark className="size-4" />
                        {pagination?.totalItems ?? 0} saved
                    </div>
                </div>
            </div>

            {savedJobsQuery.isLoading ? (
                <SavedJobsSkeleton />
            ) : savedJobsQuery.isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-semibold text-red-700">
                        {getSavedJobErrorMessage(
                            savedJobsQuery.error,
                            "Unable to load your saved jobs.",
                        )}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            void savedJobsQuery.refetch()
                        }
                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                        <RefreshCw className="size-4" />
                        Try again
                    </button>
                </div>
            ) : savedJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Bookmark className="size-7" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-950">
                        No saved jobs yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                        Save jobs that interest you and they will
                        appear here for easy access.
                    </p>

                    <Link
                        href="/jobs"
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Browse jobs
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {savedJobs.map((savedJob) => (
                            <SavedJobCard
                                key={savedJob.job.id}
                                savedJob={savedJob}
                                isRemoving={
                                    removeMutation.isPending &&
                                    removeMutation.variables ===
                                        savedJob.job.id
                                }
                                onRemove={(jobId) =>
                                    void handleRemove(jobId)
                                }
                            />
                        ))}
                    </div>

                    {pagination && (
                        <SavedJobsPagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            hasNextPage={
                                pagination.hasNextPage
                            }
                            hasPreviousPage={
                                pagination.hasPreviousPage
                            }
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            {savedJobsQuery.isFetching &&
                !savedJobsQuery.isLoading && (
                    <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <Clock3 className="size-4" />
                        Refreshing saved jobs...
                    </p>
                )}
        </section>
    );
}
