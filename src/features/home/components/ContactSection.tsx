import Link from "next/link";
import { Mail, MessageCircleMore } from "lucide-react";

import Container from "@/components/layout/Container";

export default function ContactSection() {
    return (
        <section id="contact" className="scroll-mt-24 bg-white py-20 sm:py-28">
            <Container>
                <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 px-7 py-14 text-center shadow-sm sm:px-14 sm:py-16">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-base">
                        Contact JobsSpot
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        Have a question?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-slate-600 sm:text-xl">
                        Contact JobsSpot for questions about finding work, publishing opportunities,
                        or joining the community.
                    </p>

                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                        <Link
                            href="mailto:contact@jobsspot.net"
                            className="inline-flex min-h-13 items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                            <Mail size={19} />
                            Send an Email
                        </Link>

                        <Link
                            href="#community"
                            className="inline-flex min-h-13 items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                        >
                            <MessageCircleMore size={19} />
                            Community
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
