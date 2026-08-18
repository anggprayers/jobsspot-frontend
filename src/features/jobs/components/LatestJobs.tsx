"use client";

import Link from "next/link";
import {
    AlertCircle,
    ArrowRight,
    BriefcaseBusiness,
    RefreshCw,
} from "lucide-react";

import Container from "@/components/layout/Container";

import { usePublicJobs } from "../hooks/usePublicJobs";
import JobListItem from "./JobListItem";

function LatestJobsSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="border-b border-slate-200 px-5 py-8 last:border-b-0 sm:px-7"
                >
                    <div className="flex animate-pulse items-start gap-5">
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-200" />

                        <div className="min-w-0 flex-1">
                            <div className="h-7 w-2/5 rounded-lg bg-slate-200" />
                            <div className="mt-4 h-5 w-1/4 rounded-lg bg-slate-100" />

                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="h-8 w-24 rounded-full bg-slate-100" />
                                <div className="h-8 w-28 rounded-full bg-slate-100" />
                                <div className="h-8 w-24 rounded-full bg-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function LatestJobs() {
    const { data, isLoading, isError, refetch } =
        usePublicJobs({
            page: 1,
            limit: 6,
            sort: "newest",
        });

    const jobs = data?.jobs ?? [];

    return (
        <section
            id="latest-jobs"
            className="scroll-mt-24 bg-white py-16 sm:py-20"
        >
            <Container>
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                New Opportunities
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                Recently Posted Jobs
                            </h2>

                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                Explore recently published opportunities reviewed and managed
                                through JobsSpot.
                            </p>
                        </div>

                        <Link
                            href="/jobs"
                            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                        >
                            Explore all jobs
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="mt-10">
                        {isLoading && <LatestJobsSkeleton />}

                        {isError && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-7 py-12 text-center">
                                <AlertCircle
                                    size={40}
                                    className="mx-auto text-red-500"
                                />

                                <h3 className="mt-5 text-2xl font-bold text-red-900">
                                    Unable to load jobs
                                </h3>

                                <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-red-700">
                                    We could not retrieve recently posted opportunities. Please
                                    check your connection and try again.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => void refetch()}
                                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                                >
                                    <RefreshCw size={17} />
                                    Try again
                                </button>
                            </div>
                        )}

                        {!isLoading &&
                            !isError &&
                            jobs.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-7 py-14 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <BriefcaseBusiness size={27} />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-bold text-slate-950">
                                        No jobs have been published yet
                                    </h3>

                                    <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-slate-600">
                                        New opportunities will appear here as soon as JobsSpot
                                        publishes approved job listings.
                                    </p>
                                </div>
                            )}

                        {!isLoading &&
                            !isError &&
                            jobs.length > 0 && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    {jobs.map((job) => (
                                        <JobListItem
                                            key={job.id}
                                            job={job}
                                        />
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
