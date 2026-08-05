import Link from "next/link";
import { Mail, MessageCircleMore } from "lucide-react";

import Container from "@/components/layout/Container";

export default function ContactSection() {
    return (
        <section id="contact" className="scroll-mt-24 bg-white py-16 sm:py-20">
            <Container>
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Have a question?
                        </h2>

                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            Contact JobsSpot about finding work, publishing opportunities, or using
                            the platform.
                        </p>

                        <Link
                            href="mailto:contact@jobsspot.net"
                            className="mt-3 inline-block text-base font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 transition-colors hover:text-blue-700 hover:decoration-blue-500"
                        >
                            jeff@jobsspot.net
                        </Link>
                    </div>

                    <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                        <Link
                            href="mailto:contact@jobsspot.net"
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-none"
                        >
                            <Mail size={18} />
                            Send an email
                        </Link>

                        <Link
                            href="#community"
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 sm:flex-none"
                        >
                            <MessageCircleMore size={18} />
                            Community
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
