import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import Container from "@/components/layout/Container";

export default function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <Container className="relative">
                <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center lg:gap-16">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400 sm:text-base">
                            Start Hiring
                        </p>

                        <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                            Ready to find the right person for your team?
                        </h2>

                        <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-300 sm:text-xl">
                            Create your company profile, publish an opportunity, and start
                            connecting with candidates.
                        </p>
                    </div>

                    <div className="flex w-full flex-wrap gap-4 sm:w-auto">
                        <Link
                            href="/employers"
                            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md sm:flex-none"
                        >
                            <Building2 size={19} />
                            For Employers
                        </Link>

                        <Link
                            href="/#pricing"
                            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/50 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-900 sm:flex-none"
                        >
                            View Pricing
                            <ArrowRight size={19} />
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
