"use client";

import Link from "next/link";
import {
    ArrowRight,
    BellRing,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Pencil,
    RefreshCw,
    Search,
    SearchCheck,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";

import {
    useSavedSearches,
    useUpdateSavedSearch,
} from "../hooks/useSavedSearches";
import type { SavedSearch } from "../types/savedSearch";
import {
    buildSavedSearchUrl,
    formatSavedSearchDate,
    getSavedSearchErrorMessage,
    getSavedSearchFilterLabels,
} from "../utils/savedSearchFormatters";
import DeleteSavedSearchDialog from "./DeleteSavedSearchDialog";
import RenameSavedSearchDialog from "./RenameSavedSearchDialog";

const PAGE_SIZE = 10;

function SavedSearchesSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="h-6 w-2/5 rounded bg-slate-200" />
                        <div className="mt-4 h-4 w-1/4 rounded bg-slate-100" />

                        <div className="mt-5 flex gap-2">
                            <div className="h-8 w-28 rounded-full bg-slate-100" />
                            <div className="h-8 w-24 rounded-full bg-slate-100" />
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}

type SavedSearchCardProps = Readonly<{
    savedSearch: SavedSearch;
    onRename: (savedSearch: SavedSearch) => void;
    onDelete: (savedSearch: SavedSearch) => void;
}>;

function SavedSearchCard({
    savedSearch,
    onRename,
    onDelete,
}: SavedSearchCardProps) {
    const filterLabels =
        getSavedSearchFilterLabels(savedSearch);
    const updateMutation = useUpdateSavedSearch();

    const alertValue = savedSearch.emailAlertsEnabled
        ? (savedSearch.alertFrequency ?? "DAILY")
        : "OFF";

    async function handleAlertChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        const value = event.target.value;
        const toastId = toast.loading(
            value === "OFF"
                ? "Turning off job alerts..."
                : "Updating job alerts...",
        );

        try {
            await updateMutation.mutateAsync({
                savedSearchId: savedSearch.id,
                data:
                    value === "OFF"
                        ? {
                              emailAlertsEnabled: false,
                              alertFrequency: null,
                          }
                        : {
                              emailAlertsEnabled: true,
                              alertFrequency: value as
                                  | "DAILY"
                                  | "WEEKLY",
                          },
            });

            toast.success(
                value === "OFF"
                    ? "Job alerts turned off."
                    : `${
                          value === "DAILY"
                              ? "Daily"
                              : "Weekly"
                      } job alerts enabled.`,
                { id: toastId },
            );
        } catch (error) {
            toast.error(
                getSavedSearchErrorMessage(
                    error,
                    "Unable to update job alerts.",
                ),
                { id: toastId },
            );
        }
    }

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="flex flex-col gap-5">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <SearchCheck className="size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="wrap-break-word text-xl font-bold text-slate-950 sm:text-2xl">
                            {savedSearch.name}
                        </h2>

                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="size-4 shrink-0" />
                            Updated{" "}
                            {formatSavedSearchDate(
                                savedSearch.updatedAt,
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {filterLabels.length > 0 ? (
                        filterLabels.map((label, index) => (
                            <span
                                key={`${label}-${index}`}
                                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"
                            >
                                {label}
                            </span>
                        ))
                    ) : (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
                            All active jobs
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <BellRing className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900">
                                Email job alerts
                            </p>
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                                Get newly published jobs that match this saved search.
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-40">
                        <select
                            aria-label={`Email alert frequency for ${savedSearch.name}`}
                            value={alertValue}
                            disabled={updateMutation.isPending}
                            onChange={(event) =>
                                void handleAlertChange(event)
                            }
                            className="min-h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="OFF">Off</option>
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                        </select>

                        {updateMutation.isPending && (
                            <LoaderCircle className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-blue-600" />
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                onRename(savedSearch)
                            }
                            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:flex-none"
                        >
                            <Pencil className="size-4" />
                            Rename
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onDelete(savedSearch)
                            }
                            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 sm:flex-none"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </button>
                    </div>

                    <Link
                        href={buildSavedSearchUrl(
                            savedSearch,
                        )}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        Run search
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

type PaginationProps = Readonly<{
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onPageChange: (page: number) => void;
}>;

function Pagination({
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = Array.from(
        {
            length: totalPages,
        },
        (_, index) => index + 1,
    ).filter(
        (pageNumber) =>
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(pageNumber - page) <= 1,
    );

    return (
        <nav
            aria-label="Saved searches pagination"
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
                        pageNumber === page
                            ? "page"
                            : undefined
                    }
                    onClick={() =>
                        onPageChange(pageNumber)
                    }
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

export default function SavedSearchesPage() {
    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const [page, setPage] = useState(1);
    const [searchToRename, setSearchToRename] =
        useState<SavedSearch | null>(null);
    const [searchToDelete, setSearchToDelete] =
        useState<SavedSearch | null>(null);

    const savedSearchesQuery = useSavedSearches(
        {
            page,
            limit: PAGE_SIZE,
        },
        isAuthenticated && !isInitializing,
    );

    const savedSearches =
        savedSearchesQuery.data?.savedSearches ?? [];
    const pagination =
        savedSearchesQuery.data?.pagination;

    function handleDeleted() {
        setSearchToDelete(null);

        if (savedSearches.length === 1 && page > 1) {
            setPage((current) =>
                Math.max(1, current - 1),
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
                            Saved searches
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Reopen your preferred job filters
                            without rebuilding the same search
                            each time.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
                        <SearchCheck className="size-4" />
                        {pagination?.totalItems ?? 0} saved
                    </div>
                </div>
            </div>

            {savedSearchesQuery.isLoading ? (
                <SavedSearchesSkeleton />
            ) : savedSearchesQuery.isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-semibold text-red-700">
                        {getSavedSearchErrorMessage(
                            savedSearchesQuery.error,
                            "Unable to load your saved searches.",
                        )}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            void savedSearchesQuery.refetch()
                        }
                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                        <RefreshCw className="size-4" />
                        Try again
                    </button>
                </div>
            ) : savedSearches.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Search className="size-7" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-950">
                        No saved searches yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                        Search for jobs, choose your filters,
                        and use the Save search button above
                        the results.
                    </p>

                    <Link
                        href="/jobs"
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Search jobs
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {savedSearches.map(
                            (savedSearch) => (
                                <SavedSearchCard
                                    key={savedSearch.id}
                                    savedSearch={
                                        savedSearch
                                    }
                                    onRename={
                                        setSearchToRename
                                    }
                                    onDelete={
                                        setSearchToDelete
                                    }
                                />
                            ),
                        )}
                    </div>

                    {pagination && (
                        <Pagination
                            page={pagination.page}
                            totalPages={
                                pagination.totalPages
                            }
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

            {searchToRename && (
                <RenameSavedSearchDialog
                    key={searchToRename.id}
                    savedSearch={searchToRename}
                    onClose={() =>
                        setSearchToRename(null)
                    }
                />
            )}

            {searchToDelete && (
                <DeleteSavedSearchDialog
                    savedSearch={searchToDelete}
                    onClose={() =>
                        setSearchToDelete(null)
                    }
                    onDeleted={handleDeleted}
                />
            )}
        </section>
    );
}
