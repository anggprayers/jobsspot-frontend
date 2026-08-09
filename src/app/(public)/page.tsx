import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

import Container from "@/components/layout/Container";
import CommunitySection from "@/features/home/components/CommunitySection";
import ContactSection from "@/features/home/components/ContactSection";
import FinalCTA from "@/features/home/components/FinalCTA";
import HowItWorks from "@/features/home/components/HowItWorks";
import PricingSection from "@/features/home/components/PricingSection";
import TrustedTeams from "@/features/home/components/TrustedTeams";
import JobSearchForm from "@/features/jobs/components/JobSearchForm";
import LatestJobs from "@/features/jobs/components/LatestJobs";
import PopularSearchLinks from "@/features/popular-searches/components/PopularSearchLinks";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    absoluteUrl,
    serializeJsonLd,
} from "@/lib/seo/site";

export const metadata: Metadata = {
    title: {
        absolute: "JobsSpot | Find Jobs and Connect with Employers",
    },
    description: SITE_DESCRIPTION,
    alternates: {
        canonical: absoluteUrl("/"),
    },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        url: absoluteUrl("/"),
        title: "JobsSpot | Find Jobs and Connect with Employers",
        description: SITE_DESCRIPTION,
        images: [
            {
                url: absoluteUrl("/logo.png"),
                width: 1125,
                height: 1175,
                alt: "JobsSpot logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "JobsSpot | Find Jobs and Connect with Employers",
        description: SITE_DESCRIPTION,
        images: [absoluteUrl("/logo.png")],
    },
};

const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${absoluteUrl("/")}#organization`,
            name: SITE_NAME,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/logo.png"),
            description: SITE_DESCRIPTION,
        },
        {
            "@type": "WebSite",
            "@id": `${absoluteUrl("/")}#website`,
            name: SITE_NAME,
            url: absoluteUrl("/"),
            description: SITE_DESCRIPTION,
            publisher: {
                "@id": `${absoluteUrl("/")}#organization`,
            },
        },
    ],
};

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(homeStructuredData),
                }}
            />

            <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-blue-50 to-transparent" />

                <Container className="relative">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                            <CheckCircle2 size={16} />
                            Opportunities for every next step
                        </div>

                        <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Find work that moves your career forward.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                            Search meaningful job opportunities and connect with employers looking
                            for skills like yours.
                        </p>

                        <Suspense
                            fallback={
                                <div
                                    aria-hidden="true"
                                    className="mx-auto mt-10 h-22 max-w-5xl animate-pulse rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40"
                                />
                            }
                        >
                            <JobSearchForm />
                        </Suspense>

                        <PopularSearchLinks />
                    </div>
                </Container>
            </section>

            <LatestJobs />

            <TrustedTeams />

            <HowItWorks />

            <CommunitySection />

            <PricingSection />

            <FinalCTA />

            <ContactSection />
        </>
    );
}
