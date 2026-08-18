import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CompanyProfile from "@/features/companies/components/CompanyProfile";
import { getPublicCompanyForSeo } from "@/lib/seo/publicSeoApi";
import {
    SITE_NAME,
    absoluteUrl,
    createMetaDescription,
    createPublicPageMetadata,
    serializeJsonLd,
} from "@/lib/seo/site";

type CompanyPageProps = Readonly<{
    params: Promise<{
        slug: string;
    }>;
}>;

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getPublicCompanyForSeo(slug);

    if (result.status === "not-found") {
        return {
            title: "Company not available",
            description: "This JobsSpot company profile is no longer available.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    if (result.status === "unavailable") {
        return createPublicPageMetadata({
            title: "Company Profile",
            description: "View company information and explore available job opportunities.",
            path: `/companies/${slug}`,
        });
    }

    const company = result.data;
    const description = createMetaDescription(
        company.description?.trim() ||
            `Explore ${company.name}, company information, and current job opportunities on JobsSpot.`,
    );
    const canonicalUrl = absoluteUrl(`/companies/${company.slug}`);
    const imageUrl = company.bannerUrl ?? company.logoUrl ?? absoluteUrl("/logo.png");

    return {
        title: company.name,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: "en_US",
            url: canonicalUrl,
            title: `${company.name} | ${SITE_NAME}`,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: company.bannerUrl
                        ? `${company.name} company banner`
                        : company.logoUrl
                          ? `${company.name} logo`
                          : `${SITE_NAME} logo`,
                },
            ],
        },
        twitter: {
            card: company.bannerUrl ? "summary_large_image" : "summary",
            title: `${company.name} | ${SITE_NAME}`,
            description,
            images: [imageUrl],
        },
    };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
    const { slug } = await params;
    const result = await getPublicCompanyForSeo(slug);

    if (result.status === "not-found") {
        notFound();
    }

    const company = result.status === "ok" ? result.data : undefined;

    const structuredData = company
        ? {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: company.name,
              url: absoluteUrl(`/companies/${company.slug}`),
              ...(company.description ? { description: company.description } : {}),
              ...(company.logoUrl ? { logo: company.logoUrl } : {}),
              ...(company.websiteUrl ? { sameAs: [company.websiteUrl] } : {}),
          }
        : null;

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

            <CompanyProfile slug={slug} initialCompany={company} />
        </>
    );
}
