"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ChevronRight } from "lucide-react";

import Container from "@/components/layout/Container";

import { usePublicCompany } from "../hooks/usePublicCompany";
import CompanyHeader from "./CompanyHeader";
import CompanyJobs from "./CompanyJobs";
import CompanyOverview from "./CompanyOverview";
import CompanyStats from "./CompanyStats";

type CompanyProfileProps = Readonly<{
    slug: string;
}>;

function CompanyProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-5 w-72 rounded-lg bg-slate-200" />

            <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-48 bg-slate-200 sm:h-56" />

                <div className="px-6 pb-9 sm:px-10">
                    <div className="-mt-16 h-28 w-28 rounded-3xl bg-slate-300 sm:-mt-20 sm:h-36 sm:w-36" />

                    <div className="mt-6 h-10 w-3/5 rounded-lg bg-slate-200" />

                    <div className="mt-5 h-6 w-2/5 rounded-lg bg-slate-100" />
                </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-8">
                    <div className="h-72 rounded-3xl bg-slate-100" />
                    <div className="h-96 rounded-3xl bg-slate-100" />
                </div>

                <div className="h-96 rounded-3xl bg-slate-100" />
            </div>
        </div>
    );
}

export default function CompanyProfile({ slug }: CompanyProfileProps) {
    const { data, isLoading, isError } = usePublicCompany(slug);

    const company = data?.company;

    if (isLoading) {
        return (
            <section className="min-h-screen bg-slate-50 py-10 sm:py-16">
                <Container>
                    <CompanyProfileSkeleton />
                </Container>
            </section>
        );
    }

    if (isError || !company) {
        return (
            <section className="min-h-screen bg-slate-50 py-20">
                <Container>
                    <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white px-7 py-16 text-center shadow-sm sm:px-10">
                        <AlertCircle size={48} className="mx-auto text-red-500" />

                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Company not available
                        </h1>

                        <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-slate-600">
                            This company may have been removed, or the link may be incorrect.
                        </p>

                        <Link
                            href="/jobs"
                            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                        >
                            <ArrowLeft size={19} />
                            Browse Jobs
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 py-10 sm:py-16">
            <Container>
                <nav
                    aria-label="Breadcrumb"
                    className="mb-7 flex flex-wrap items-center gap-2 text-base text-slate-500"
                >
                    <Link href="/" className="transition-colors hover:text-blue-600">
                        Home
                    </Link>

                    <ChevronRight size={17} />

                    <Link href="/jobs" className="transition-colors hover:text-blue-600">
                        Jobs
                    </Link>

                    <ChevronRight size={17} />

                    <span
                        aria-current="page"
                        className="max-w-xs truncate font-medium text-slate-700 sm:max-w-md"
                    >
                        {company.name}
                    </span>
                </nav>

                <CompanyHeader company={company} />

                <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <main className="space-y-8">
                        <CompanyOverview company={company} />

                        <CompanyJobs company={company} />
                    </main>

                    <CompanyStats company={company} />
                </div>
            </Container>
        </section>
    );
}
