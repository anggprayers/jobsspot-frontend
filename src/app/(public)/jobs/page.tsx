import type { Metadata } from "next";
import { Suspense } from "react";

import Container from "@/components/layout/Container";
import JobsResults from "@/features/jobs/components/JobsResults";
import JobsSearchBar from "@/features/jobs/components/JobsSearchBar";
import { createPublicPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPublicPageMetadata({
    title: "Find Jobs",
    description:
        "Search JobsSpot opportunities by keyword, location, work arrangement, job type, and experience level.",
    path: "/jobs",
});

function JobsPageLoading() {
    return (
        <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden h-150 animate-pulse rounded-2xl bg-slate-100 lg:block" />

            <div>
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />

                <div className="mt-6 h-125 animate-pulse rounded-2xl bg-slate-100" />
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <>
            <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Find Your Next Opportunity
                        </h1>

                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            Search current openings with simple filters for location, work setup, job type, and experience.
                        </p>
                    </div>

                    <div className="mx-auto mt-9 max-w-6xl">
                        <Suspense
                            fallback={
                                <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
                            }
                        >
                            <JobsSearchBar />
                        </Suspense>
                    </div>
                </Container>
            </section>

            <section className="bg-slate-50/60 py-12 sm:py-16">
                <Container>
                    <Suspense fallback={<JobsPageLoading />}>
                        <JobsResults />
                    </Suspense>
                </Container>
            </section>
        </>
    );
}
