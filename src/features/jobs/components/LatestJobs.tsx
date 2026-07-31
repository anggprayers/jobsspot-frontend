"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, BriefcaseBusiness, RefreshCw } from "lucide-react";

import Container from "@/components/layout/Container";

import { usePublicJobs } from "../hooks/usePublicJobs";
import JobListItem from "./JobListItem";

function LatestJobsSkeleton() {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="border-b border-slate-200 px-5 py-9 last:border-b-0 sm:px-7 lg:px-8"
                >
                    <div className="flex animate-pulse items-start gap-5">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200" />

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
    const { data, isLoading, isError, refetch } = usePublicJobs({
        page: 1,
        limit: 6,
        sort: "newest",
    });

    const jobs = data?.jobs ?? [];

    return (
        <section id="latest-jobs" className="scroll-mt-24 bg-white py-20 sm:py-28">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-base">
                        New Opportunities
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        Recently Posted Jobs
                    </h2>

                    <p className="mt-5 text-lg leading-9 text-slate-600 sm:text-xl">
                        Explore recently published opportunities from employers actively looking for
                        new talent.
                    </p>
                </div>

                <div className="mx-auto mt-14 max-w-6xl">
                    {isLoading && <LatestJobsSkeleton />}

                    {isError && (
                        <div className="rounded-3xl border border-red-200 bg-red-50 px-7 py-14 text-center">
                            <AlertCircle size={42} className="mx-auto text-red-500" />

                            <h3 className="mt-5 text-2xl font-bold text-red-900">
                                Unable to load jobs
                            </h3>

                            <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-red-700">
                                We could not retrieve recently posted opportunities. Please check
                                your connection and try again.
                            </p>

                            <button
                                type="button"
                                onClick={() => void refetch()}
                                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-6 py-3 text-base font-semibold text-red-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-100"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && jobs.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-7 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness size={30} />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-slate-950">
                                No jobs have been published yet
                            </h3>

                            <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-slate-600">
                                New opportunities will appear here as soon as employers begin
                                publishing job listings.
                            </p>

                            <Link
                                href="/jobs"
                                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
                            >
                                Browse Jobs
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    {!isLoading && !isError && jobs.length > 0 && (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            {jobs.map((job) => (
                                <JobListItem key={job.id} job={job} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isError && jobs.length > 0 && (
                        <div className="mt-10 text-center">
                            <Link
                                href="/jobs"
                                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                            >
                                Explore All Jobs
                                <ArrowRight size={19} />
                            </Link>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
