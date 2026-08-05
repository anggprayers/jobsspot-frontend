import Link from "next/link";
import {
    Bell,
    MessageCircleMore,
    UsersRound,
} from "lucide-react";

import Container from "@/components/layout/Container";

const WHATSAPP_COMMUNITY_URL =
    "https://chat.whatsapp.com/LU31uYaL1IaHkHSFNR9XYp?s=cl&p=i&mlu=0&ilr=2";

const benefits = [
    {
        icon: Bell,
        title: "Opportunity Updates",
        description:
            "Stay informed about job opportunities and important community updates.",
    },
    {
        icon: UsersRound,
        title: "Professional Connections",
        description:
            "Connect with job seekers and professionals from different industries.",
    },
    {
        icon: MessageCircleMore,
        title: "Career Discussions",
        description:
            "Exchange useful information, experiences, and practical career advice.",
    },
] as const;

export default function CommunitySection() {
    return (
        <section
            id="community"
            className="relative scroll-mt-24 overflow-hidden bg-emerald-950 py-16 text-white sm:py-20"
        >
            <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#25D366]/15 blur-3xl" />

            <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.03),transparent_55%)]" />

            <Container className="relative">
                <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-900/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                            <MessageCircleMore size={17} />
                            JobsSpot Community
                        </div>

                        <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Grow your network and discover opportunities together.
                        </h2>

                        <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-100/80">
                            Join the JobsSpot WhatsApp community to connect with other job seekers,
                            exchange useful information, and stay updated on new opportunities.
                        </p>

                        <Link
                            href={WHATSAPP_COMMUNITY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Join the JobsSpot WhatsApp community"
                            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-bold text-emerald-950 shadow-sm transition-colors hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
                        >
                            <MessageCircleMore size={19} />
                            Join on WhatsApp
                        </Link>

                        <p className="mt-3 text-sm leading-6 text-emerald-100/60">
                            The invitation opens WhatsApp in a new tab.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <article
                                    key={benefit.title}
                                    className="flex items-start gap-4 rounded-2xl border border-emerald-700/50 bg-emerald-900/65 p-5 backdrop-blur transition-colors hover:border-emerald-400/60 hover:bg-emerald-900/85 sm:p-6"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366]">
                                        <Icon size={21} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-white sm:text-xl">
                                            {benefit.title}
                                        </h3>

                                        <p className="mt-2 text-base leading-7 text-emerald-100/75">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
