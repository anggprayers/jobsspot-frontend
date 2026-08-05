"use client";

import Link from "next/link";
import {
    ArrowRight,
    Search,
    SearchCheck,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";

import { useSavedSearches } from "../hooks/useSavedSearches";
import type { SavedSearch } from "../types/savedSearch";
import {
    buildSavedSearchUrl,
    getSavedSearchFilterLabels,
} from "../utils/savedSearchFormatters";

const QUICK_ACCESS_LIMIT = 3;

function SavedSearchQuickAccessSkeleton() {
    return (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex animate-pulse items-center justify-between gap-4">
                <div>
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-56 rounded bg-slate-100" />
                </div>

                <div className="h-5 w-20 rounded bg-slate-100" />
            </div>

            <div className="mt-5 flex gap-3 overflow-hidden lg:grid lg:grid-cols-3">
                {Array.from({
                    length: QUICK_ACCESS_LIMIT,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="h-28 min-w-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 lg:min-w-0"
                    />
                ))}
            </div>
        </section>
    );
}

function getSavedSearchSummary(
    savedSearch: SavedSearch,
): {
    summary: string;
    remainingFilters: number;
} {
    const labels =
        getSavedSearchFilterLabels(savedSearch);

    if (labels.length === 0) {
        return {
            summary: `Keyword: ${savedSearch.name}`,
            remainingFilters: 0,
        };
    }

    const visibleLabels = labels.slice(0, 2);

    return {
        summary: visibleLabels.join(" • "),
        remainingFilters: Math.max(
            0,
            labels.length - visibleLabels.length,
        ),
    };
}

export default function SavedSearchQuickAccess() {
    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const isReady =
        isAuthenticated && !isInitializing;

    const savedSearchesQuery = useSavedSearches(
        {
            page: 1,
            limit: QUICK_ACCESS_LIMIT,
        },
        isReady,
    );

    if (!isAuthenticated || isInitializing) {
        return null;
    }

    if (savedSearchesQuery.isLoading) {
        return <SavedSearchQuickAccessSkeleton />;
    }

    if (
        savedSearchesQuery.isError ||
        !savedSearchesQuery.data ||
        savedSearchesQuery.data.savedSearches.length ===
            0
    ) {
        return null;
    }

    const {
        savedSearches,
        pagination,
    } = savedSearchesQuery.data;

    return (
        <section
            aria-labelledby="saved-searches-quick-access-title"
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <SearchCheck className="size-5 text-blue-600" />

                        <h2
                            id="saved-searches-quick-access-title"
                            className="text-lg font-bold text-slate-950 sm:text-xl"
                        >
                            Your saved searches
                        </h2>
                    </div>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        Run a previous search with one click.
                    </p>
                </div>

                <Link
                    href="/account/saved-searches"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                    View all
                    {pagination.totalItems > 0 && (
                        <span>
                            ({pagination.totalItems})
                        </span>
                    )}
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            <div className="-mx-1 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
                {savedSearches.map((savedSearch) => {
                    const {
                        summary,
                        remainingFilters,
                    } = getSavedSearchSummary(
                        savedSearch,
                    );

                    return (
                        <Link
                            key={savedSearch.id}
                            href={buildSavedSearchUrl(
                                savedSearch,
                            )}
                            aria-label={`Run saved search: ${savedSearch.name}`}
                            className="group flex min-h-28 min-w-[270px] snap-start items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 lg:min-w-0"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <Search className="size-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-bold text-slate-950 transition-colors group-hover:text-blue-700">
                                    {savedSearch.name}
                                </h3>

                                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
                                    {summary}
                                    {remainingFilters > 0 &&
                                        ` • +${remainingFilters} more`}
                                </p>
                            </div>

                            <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
