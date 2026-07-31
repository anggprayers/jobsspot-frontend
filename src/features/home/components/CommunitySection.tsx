import Link from "next/link";
import { ArrowRight, Bell, MessageCircleMore, UsersRound } from "lucide-react";

import Container from "@/components/layout/Container";

const benefits = [
    {
        icon: Bell,
        title: "Opportunity Updates",
        description: "Stay informed when employers publish relevant job openings.",
    },
    {
        icon: UsersRound,
        title: "Professional Connections",
        description: "Connect with job seekers and professionals from different industries.",
    },
    {
        icon: MessageCircleMore,
        title: "Career Discussions",
        description: "Exchange useful information and learn from the wider community.",
    },
] as const;

export default function CommunitySection() {
    return (
        <section
            id="community"
            className="relative scroll-mt-24 overflow-hidden bg-slate-950 py-20 text-white sm:py-28"
        >
            <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl" />

            <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

            <Container className="relative">
                <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400 sm:text-base">
                            JobsSpot Community
                        </p>

                        <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Grow your network and discover opportunities together.
                        </h2>

                        <p className="mt-6 max-w-xl text-lg leading-9 text-slate-300 sm:text-xl">
                            Join a growing community where job seekers can stay connected, exchange
                            useful information, and discover new opportunities.
                        </p>

                        <Link
                            href="#"
                            className="mt-9 inline-flex min-h-13 items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/30"
                        >
                            Join the Community
                            <ArrowRight size={19} />
                        </Link>
                    </div>

                    <div className="grid gap-5">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <article
                                    key={benefit.title}
                                    className="flex items-start gap-5 rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-slate-900 sm:p-7"
                                >
                                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-400">
                                        <Icon size={23} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-xl font-bold text-white">
                                            {benefit.title}
                                        </h3>

                                        <p className="mt-2 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
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
