"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    FileText,
} from "lucide-react";

import Container from "@/components/layout/Container";

import { usePublicJob } from "../hooks/usePublicJob";
import JobDetailsHeader from "./JobDetailsHeader";
import JobDetailsSidebar from "./JobDetailsSidebar";
import SimilarJobs from "./SimilarJobs";

type JobDetailsProps = Readonly<{
    slug: string;
}>;

type ContentSectionProps = Readonly<{
    title: string;
    content: string;
    icon: ComponentType<{
        size?: number;
        className?: string;
    }>;
}>;

function ContentSection({ title, content, icon: Icon }: ContentSectionProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                </div>

                <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            </div>

            <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">
                {content}
            </div>
        </section>
    );
}

function JobDetailsSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-6 w-72 rounded-lg bg-slate-200" />

            <div className="mt-6 h-64 rounded-3xl bg-slate-200" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    <div className="h-64 rounded-3xl bg-slate-100" />
                    <div className="h-56 rounded-3xl bg-slate-100" />
                </div>

                <div className="space-y-5">
                    <div className="h-80 rounded-3xl bg-slate-100" />
                    <div className="h-48 rounded-3xl bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

export default function JobDetails({ slug }: JobDetailsProps) {
    const { data, isLoading, isError } = usePublicJob(slug);

    const job = data?.job;

    if (isLoading) {
        return (
            <section className="min-h-screen bg-slate-50 py-12 sm:py-16">
                <Container>
                    <JobDetailsSkeleton />
                </Container>
            </section>
        );
    }

    if (isError || !job) {
        return (
            <section className="min-h-screen bg-slate-50 py-20">
                <Container>
                    <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm">
                        <AlertCircle size={42} className="mx-auto text-red-500" />

                        <h1 className="mt-5 text-3xl font-bold text-slate-950">
                            Job not available
                        </h1>

                        <p className="mt-3 leading-7 text-slate-600">
                            This job may have expired, been removed, or the link may be incorrect.
                        </p>

                        <Link
                            href="/jobs"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            <ArrowLeft size={18} />
                            Browse Jobs
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 py-10 sm:py-14">
            <Container>
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <Link href="/" className="transition-colors hover:text-blue-600">
                        Home
                    </Link>

                    <ChevronRight size={15} />

                    <Link href="/jobs" className="transition-colors hover:text-blue-600">
                        Jobs
                    </Link>

                    <ChevronRight size={15} />

                    <span
                        aria-current="page"
                        className="max-w-xs truncate font-medium text-slate-700"
                    >
                        {job.title}
                    </span>
                </nav>

                <JobDetailsHeader job={job} />

                <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <main className="space-y-6">
                        <ContentSection
                            title="About the Role"
                            content={job.description}
                            icon={FileText}
                        />

                        {job.responsibilities?.trim() && (
                            <ContentSection
                                title="Responsibilities"
                                content={job.responsibilities}
                                icon={ClipboardList}
                            />
                        )}

                        {job.requirements?.trim() && (
                            <ContentSection
                                title="Requirements"
                                content={job.requirements}
                                icon={CheckCircle2}
                            />
                        )}
                    </main>

                    <JobDetailsSidebar job={job} />
                </div>

                <div className="mt-14 border-t border-slate-200 pt-12">
                    <SimilarJobs currentJobId={job.id} categorySlug={job.category.slug} />
                </div>
            </Container>
        </section>
    );
}
