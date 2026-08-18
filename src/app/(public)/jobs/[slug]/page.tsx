import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JobDetails from "@/features/jobs/components/JobDetails";
import { createJobPostingJsonLd } from "@/lib/seo/jobPostingJsonLd";
import { getPublicJobForSeo } from "@/lib/seo/publicSeoApi";
import {
    SITE_NAME,
    absoluteUrl,
    createMetaDescription,
    createPublicPageMetadata,
    serializeJsonLd,
} from "@/lib/seo/site";

type JobDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getPublicJobForSeo(slug);

    if (result.status === "not-found") {
        return {
            title: "Job not available",
            description: "This JobsSpot job is no longer available.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    if (result.status === "unavailable") {
        return createPublicPageMetadata({
            title: "Job Details",
            description: "View job responsibilities, requirements, salary, and employer information.",
            path: `/jobs/${slug}`,
        });
    }

    const job = result.data;
    const title = `${job.title} at ${job.company.name}`;
    const locationLabel = job.location?.trim() || "an available location";
    const description = createMetaDescription(
        `${job.title} at ${job.company.name} in ${locationLabel}. ${job.description}`,
    );
    const canonicalUrl = absoluteUrl(`/jobs/${job.slug}`);
    const imageUrl = job.company.logoUrl ?? absoluteUrl("/logo.png");

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: "en_US",
            url: canonicalUrl,
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: job.company.logoUrl ? `${job.company.name} logo` : `${SITE_NAME} logo`,
                },
            ],
        },
        twitter: {
            card: "summary",
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [imageUrl],
        },
    };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
    const { slug } = await params;
    const result = await getPublicJobForSeo(slug);

    if (result.status === "not-found") {
        notFound();
    }

    const job = result.status === "ok" ? result.data : undefined;
    const structuredData = job ? createJobPostingJsonLd(job) : null;

    return (
        <>
            {structuredData ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(structuredData),
                    }}
                />
            ) : null}

            <JobDetails slug={slug} initialJob={job} />
        </>
    );
}
