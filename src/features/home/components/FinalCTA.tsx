import Link from "next/link";
import { Building2 } from "lucide-react";

import Container from "@/components/layout/Container";

export default function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

            <Container className="relative">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-14">
                    <div className="min-w-0">
                        <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Ready to find the right person for your team?
                        </h2>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                            Create your company profile, publish an opportunity, and start
                            connecting with candidates.
                        </p>
                    </div>

                    <div className="w-full shrink-0 sm:w-auto">
                        <Link
                            href="/employers"
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-500 sm:w-auto"
                        >
                            <Building2 size={18} />
                            For employers
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
