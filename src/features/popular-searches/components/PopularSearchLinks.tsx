"use client";

import Link from "next/link";

import { trackPopularSearch } from "../api/popularSearchApi";
import { usePopularSearches } from "../hooks/usePopularSearches";

const fallbackPopularSearches = [
    "Developer",
    "Virtual Assistant",
    "Marketing",
    "Customer Support",
] as const;

export default function PopularSearchLinks() {
    const popularSearchesQuery = usePopularSearches({
        limit: 4,
        days: 30,
    });

    const dynamicSearches =
        popularSearchesQuery.data?.popularSearches ?? [];

    const isInitialLoading =
        popularSearchesQuery.isLoading &&
        !popularSearchesQuery.data;

    const searches =
        dynamicSearches.length > 0
            ? dynamicSearches.map((search) => ({
                  id: search.id,
                  label: search.keyword,
                  query: search.normalizedTerm,
              }))
            : fallbackPopularSearches.map((search) => ({
                  id: search,
                  label: search,
                  query: search.toLowerCase(),
              }));

    function handlePopularSearchClick(
        keyword: string,
    ) {
        void trackPopularSearch(keyword).catch(
            () => undefined,
        );
    }

    if (isInitialLoading) {
        return (
            <div
                aria-label="Loading popular searches"
                className="mt-7 flex min-h-6 flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500"
            >
                <span>Popular searches:</span>

                {Array.from({ length: 4 }).map(
                    (_, index) => (
                        <span
                            key={index}
                            aria-hidden="true"
                            className="h-4 w-20 animate-pulse rounded-full bg-slate-200"
                        />
                    ),
                )}
            </div>
        );
    }

    return (
        <div className="mt-7 flex min-h-6 flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500">
            <span>Popular searches:</span>

            {searches.map((search) => (
                <Link
                    key={search.id}
                    href={`/jobs?search=${encodeURIComponent(
                        search.query,
                    )}&page=1`}
                    onClick={() =>
                        handlePopularSearchClick(
                            search.label,
                        )
                    }
                    className="font-semibold text-slate-700 transition-colors hover:text-blue-600"
                >
                    {search.label}
                </Link>
            ))}
        </div>
    );
}
