import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import Container from "@/components/layout/Container";

export default function JobNotFound() {
    return (
        <section className="bg-slate-50 py-16 sm:py-24">
            <Container>
                <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <SearchX className="size-8" aria-hidden="true" />
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">
                        Job unavailable
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        This job is no longer available.
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600">
                        The job may have expired, been removed by the employer, or the link may no
                        longer be valid. You can continue browsing other opportunities on JobsSpot.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/jobs"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            <ArrowLeft className="size-5" aria-hidden="true" />
                            Browse Jobs
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <Home className="size-5" aria-hidden="true" />
                            Return Home
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
