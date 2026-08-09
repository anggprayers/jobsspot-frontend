import { cache } from "react";

import type { PublicJob, GetPublicJobsResponse } from "@/features/jobs/types/publicJob";
import type {
    GetPublicJobBySlugResponse,
    PublicJobDetails,
} from "@/features/jobs/types/publicJobDetails";
import type {
    GetPublicCompanyBySlugResponse,
    PublicCompany,
} from "@/features/companies/types/publicCompany";

export type PublicSeoResult<T> =
    | {
          status: "ok";
          data: T;
      }
    | {
          status: "not-found";
      }
    | {
          status: "unavailable";
      };

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const configuredTimeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "75000");
const requestTimeout =
    Number.isFinite(configuredTimeout) && configuredTimeout >= 5_000 && configuredTimeout <= 120_000
        ? configuredTimeout
        : 75_000;

function getApiUrl(): string | null {
    if (!rawApiUrl) {
        return null;
    }

    try {
        const url = new URL(rawApiUrl);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return null;
        }

        return rawApiUrl.replace(/\/+$/, "");
    } catch {
        return null;
    }
}

async function fetchPublicResource<T>(
    path: string,
    revalidateSeconds: number,
): Promise<PublicSeoResult<T>> {
    const apiUrl = getApiUrl();

    if (!apiUrl) {
        return { status: "unavailable" };
    }

    try {
        const response = await fetch(`${apiUrl}${path}`, {
            headers: {
                Accept: "application/json",
            },
            next: {
                revalidate: revalidateSeconds,
            },
            signal: AbortSignal.timeout(requestTimeout),
        });

        if (response.status === 404 || response.status === 410) {
            return { status: "not-found" };
        }

        if (!response.ok) {
            return { status: "unavailable" };
        }

        return {
            status: "ok",
            data: (await response.json()) as T,
        };
    } catch {
        return { status: "unavailable" };
    }
}

export const getPublicJobForSeo = cache(async function getPublicJobForSeo(
    slug: string,
): Promise<PublicSeoResult<PublicJobDetails>> {
    const result = await fetchPublicResource<GetPublicJobBySlugResponse>(
        `/jobs/${encodeURIComponent(slug)}`,
        300,
    );

    if (result.status !== "ok") {
        return result;
    }

    return {
        status: "ok",
        data: result.data.job,
    };
});

export const getPublicCompanyForSeo = cache(async function getPublicCompanyForSeo(
    slug: string,
): Promise<PublicSeoResult<PublicCompany>> {
    const result = await fetchPublicResource<GetPublicCompanyBySlugResponse>(
        `/companies/${encodeURIComponent(slug)}`,
        300,
    );

    if (result.status !== "ok") {
        return result;
    }

    return {
        status: "ok",
        data: result.data.company,
    };
});

export async function getPublicJobsForSitemap(): Promise<PublicJob[]> {
    const allJobs: PublicJob[] = [];
    const limit = 100;
    const maximumPages = 200;

    for (let page = 1; page <= maximumPages; page += 1) {
        const result = await fetchPublicResource<GetPublicJobsResponse>(
            `/jobs?page=${page}&limit=${limit}&sort=newest`,
            900,
        );

        if (result.status !== "ok") {
            break;
        }

        allJobs.push(...result.data.jobs);

        if (!result.data.pagination.hasNextPage) {
            break;
        }
    }

    return allJobs;
}
