import type { MetadataRoute } from "next";

import { getPublicJobsForSitemap } from "@/lib/seo/publicSeoApi";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const jobs = await getPublicJobsForSitemap();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl("/"),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: absoluteUrl("/jobs"),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: absoluteUrl("/categories"),
            changeFrequency: "daily",
            priority: 0.7,
        },
        {
            url: absoluteUrl("/privacy"),
            changeFrequency: "monthly",
            priority: 0.2,
        },
        {
            url: absoluteUrl("/terms"),
            changeFrequency: "monthly",
            priority: 0.2,
        },
    ];

    const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
        url: absoluteUrl(`/jobs/${job.slug}`),
        ...(job.updatedAt ? { lastModified: job.updatedAt } : {}),
        changeFrequency: "daily",
        priority: 0.8,
    }));

    const companies = Array.from(
        new Map(jobs.map((job) => [job.company.slug, job.company])).values(),
    );

    const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
        url: absoluteUrl(`/companies/${company.slug}`),
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    return [...staticPages, ...jobPages, ...companyPages];
}
