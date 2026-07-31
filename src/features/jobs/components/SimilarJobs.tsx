"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { usePublicJobs } from "../hooks/usePublicJobs";
import JobListItem from "./JobListItem";

type SimilarJobsProps = Readonly<{
    currentJobId: string;
    categorySlug: string;
}>;

export default function SimilarJobs({ currentJobId, categorySlug }: SimilarJobsProps) {
    const { data, isLoading, isError } = usePublicJobs({
        category: categorySlug,
        page: 1,
        limit: 4,
        sort: "newest",
    });

    const jobs = (data?.jobs ?? []).filter((job) => job.id !== currentJobId).slice(0, 3);

    if (isLoading) {
        return (
            <section className="mt-12">
                <div className="h-9 w-52 animate-pulse rounded bg-slate-200" />

                <div className="mt-6 h-80 animate-pulse rounded-3xl bg-slate-100" />
            </section>
        );
    }

    if (isError || jobs.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">
            <div className="flex items-end justify-between gap-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                        Similar Jobs
                    </h2>

                    <p className="mt-2 text-slate-600">
                        More opportunities in {jobs[0]?.category.name}.
                    </p>
                </div>

                <Link
                    href={`/jobs?category=${encodeURIComponent(categorySlug)}`}
                    className="hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
                >
                    View all
                    <ArrowRight size={18} />
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {jobs.map((job) => (
                    <JobListItem key={job.id} job={job} />
                ))}
            </div>
        </section>
    );
}
