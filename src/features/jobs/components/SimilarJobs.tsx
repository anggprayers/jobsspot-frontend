"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { usePublicJobs } from "../hooks/usePublicJobs";
import type { PublicJob } from "../types/publicJob";
import type { PublicJobDetails } from "../types/publicJobDetails";
import JobListItem from "./JobListItem";

type SimilarJobsProps = Readonly<{
    job: PublicJobDetails;
}>;

function normalize(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? "";
}

function getSimilarityScore(candidate: PublicJob, currentJob: PublicJobDetails) {
    let score = 0;

    if (candidate.workplaceType === currentJob.workplaceType) {
        score += 4;
    }

    if (candidate.employmentType === currentJob.employmentType) {
        score += 4;
    }

    if (candidate.experienceLevel === currentJob.experienceLevel) {
        score += 1;
    }

    const candidateLocation = normalize(candidate.location);
    const currentLocation = normalize(currentJob.location);

    if (candidateLocation && currentLocation && candidateLocation === currentLocation) {
        score += 3;
    } else {
        const candidateCity = normalize(candidate.city);
        const currentCity = normalize(currentJob.city);
        const candidateRegion = normalize(candidate.stateRegion);
        const currentRegion = normalize(currentJob.stateRegion);

        if (candidateCity && currentCity && candidateCity === currentCity) {
            score += 2;
        }

        if (candidateRegion && currentRegion && candidateRegion === currentRegion) {
            score += 1;
        }
    }

    return score;
}

function getPublishedTime(job: PublicJob) {
    if (!job.publishedAt) {
        return 0;
    }

    const publishedAt = new Date(job.publishedAt).getTime();
    return Number.isNaN(publishedAt) ? 0 : publishedAt;
}

export default function SimilarJobs({ job }: SimilarJobsProps) {
    const { data, isLoading, isError } = usePublicJobs({
        page: 1,
        limit: 12,
        sort: "newest",
    });

    const jobs = (data?.jobs ?? [])
        .filter((candidate) => candidate.id !== job.id)
        .sort((left, right) => {
            const scoreDifference =
                getSimilarityScore(right, job) - getSimilarityScore(left, job);

            if (scoreDifference !== 0) {
                return scoreDifference;
            }

            return getPublishedTime(right) - getPublishedTime(left);
        })
        .slice(0, 3);

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
                        More opportunities with a similar work setup, job type, or location.
                    </p>
                </div>

                <Link
                    href="/jobs"
                    className="hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
                >
                    View all jobs
                    <ArrowRight size={18} />
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {jobs.map((candidate) => (
                    <JobListItem key={candidate.id} job={candidate} />
                ))}
            </div>
        </section>
    );
}
