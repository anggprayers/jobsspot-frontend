"use client";

import { useState } from "react";
import { BriefcaseBusiness, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";

import JobsFilters from "./JobFilters";
import JobListItem from "./JobListItem";
import JobsPagination from "./JobsPagination";
import JobsToolbar from "./JobsToolbar";

import { usePublicJobs } from "../hooks/usePublicJobs";
import type { JobsSortOption } from "../types/jobFilters";

function JobsResultsSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="border-b border-slate-200 px-5 py-8 last:border-b-0 sm:px-7"
                >
                    <div className="flex animate-pulse gap-5">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200" />

                        <div className="flex-1">
                            <div className="h-6 w-2/5 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-1/4 rounded bg-slate-100" />

                            <div className="mt-5 flex flex-wrap gap-2">
                                <div className="h-7 w-20 rounded-full bg-slate-100" />
                                <div className="h-7 w-24 rounded-full bg-slate-100" />
                                <div className="h-7 w-20 rounded-full bg-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getPositiveInteger(value: string | null, fallback: number) {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        return fallback;
    }

    return parsedValue;
}

export default function JobsResults() {
    const searchParams = useSearchParams();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const page = getPositiveInteger(searchParams.get("page"), 1);
    const limit = 10;

    const sort = (searchParams.get("sort") as JobsSortOption | null) ?? "newest";

    const { data, isLoading, isError } = usePublicJobs({
        page,
        limit,
        sort,
        search: searchParams.get("search") || undefined,
        location: searchParams.get("location") || undefined,
        category: searchParams.get("category") || undefined,
        employmentType: searchParams.get("employmentType") || undefined,
        workplaceType: searchParams.get("workplaceType") || undefined,
        experienceLevel: searchParams.get("experienceLevel") || undefined,
    });

    const jobs = data?.jobs ?? [];
    const pagination = data?.pagination;

    return (
        <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <JobsFilters
                isMobileOpen={isMobileFiltersOpen}
                onMobileClose={() => setIsMobileFiltersOpen(false)}
            />

            <section className="min-w-0">
                <JobsToolbar
                    totalItems={pagination?.totalItems ?? 0}
                    isLoading={isLoading}
                    onOpenFilters={() => setIsMobileFiltersOpen(true)}
                />

                <div className="mt-6">
                    {isLoading && <JobsResultsSkeleton />}

                    {isError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
                            <BriefcaseBusiness size={38} className="mx-auto text-red-400" />

                            <h3 className="mt-4 text-xl font-semibold text-red-800">
                                Unable to load jobs
                            </h3>

                            <p className="mx-auto mt-2 max-w-md leading-7 text-red-600">
                                We could not retrieve the available positions. Please verify that
                                the JobsSpot backend is running and try again.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && jobs.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                            <SearchX size={42} className="mx-auto text-slate-400" />

                            <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                                No matching jobs found
                            </h3>

                            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                                Try changing your search terms, using a broader United States
                                location, or clearing some filters.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && jobs.length > 0 && (
                        <>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                {jobs.map((job) => (
                                    <JobListItem key={job.id} job={job} />
                                ))}
                            </div>

                            {pagination && (
                                <JobsPagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    hasNextPage={pagination.hasNextPage}
                                    hasPreviousPage={pagination.hasPreviousPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
