import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import Container from "@/components/layout/Container";
import CommunitySection from "@/features/home/components/CommunitySection";
import ContactSection from "@/features/home/components/ContactSection";
import FinalCTA from "@/features/home/components/FinalCTA";
import HowItWorks from "@/features/home/components/HowItWorks";
import PricingSection from "@/features/home/components/PricingSection";
import TrustedTeams from "@/features/home/components/TrustedTeams";
import JobSearchForm from "@/features/jobs/components/JobSearchForm";
import LatestJobs from "@/features/jobs/components/LatestJobs";

const popularSearches = [
    "Developer",
    "Virtual Assistant",
    "Marketing",
    "Customer Support",
] as const;

export default function HomePage() {
    return (
        <>
            <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">
                <div className="absolute inset-x-0 top-0 z-0 h-72 bg-linear-to-b from-blue-50 to-transparent" />

                <Container className="relative z-10">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <CheckCircle2 size={16} />
                            Opportunities for every next step
                        </div>

                        <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Find work that moves your career forward.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Search meaningful job opportunities and connect with employers looking
                            for skills like yours.
                        </p>

                        <JobSearchForm />

                        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500">
                            <span>Popular searches:</span>

                            {popularSearches.map((search) => (
                                <Link
                                    key={search}
                                    href={`/jobs?search=${encodeURIComponent(
                                        search.toLowerCase(),
                                    )}`}
                                    className="font-semibold text-slate-700 transition-colors hover:text-blue-600"
                                >
                                    {search}
                                </Link>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <LatestJobs />

            <HowItWorks />

            <PricingSection />

            <CommunitySection />

            <TrustedTeams />

            <FinalCTA />

            <ContactSection />
        </>
    );
}
