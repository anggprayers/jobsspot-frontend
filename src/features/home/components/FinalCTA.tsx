import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import Container from "@/components/layout/Container";

export default function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

            <Container className="relative">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-14">
                    <div>
                        <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Ready to find the right person for your team?
                        </h2>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                            Create your company profile, publish an opportunity, and start
                            connecting with candidates.
                        </p>
                    </div>

                    <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                        <Link
                            href="/employers"
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-500 sm:flex-none"
                        >
                            <Building2 size={18} />
                            For employers
                        </Link>

                        <Link
                            href="/#pricing"
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/50 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-900 sm:flex-none"
                        >
                            View pricing
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
