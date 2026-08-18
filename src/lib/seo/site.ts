import type { Metadata } from "next";

export const SITE_NAME = "JobsSpot";
export const SITE_DESCRIPTION =
    "Search job opportunities across New York and the United States, apply through JobsSpot, and track your applications in one place.";

const FALLBACK_SITE_URL = "https://jobsspot.net";

export function getSiteUrl(): string {
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

    if (!configuredSiteUrl) {
        return FALLBACK_SITE_URL;
    }

    try {
        const url = new URL(configuredSiteUrl);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return FALLBACK_SITE_URL;
        }

        return url.origin;
    } catch {
        return FALLBACK_SITE_URL;
    }
}

export function absoluteUrl(pathname: string): string {
    return new URL(pathname, `${getSiteUrl()}/`).toString();
}

export function compactText(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

export function createMetaDescription(value: string, maxLength = 160): string {
    const compacted = compactText(value);

    if (compacted.length <= maxLength) {
        return compacted;
    }

    const shortened = compacted.slice(0, Math.max(0, maxLength - 1));
    const lastSpaceIndex = shortened.lastIndexOf(" ");
    const safeCut = lastSpaceIndex >= Math.floor(maxLength * 0.65) ? lastSpaceIndex : shortened.length;

    return `${shortened.slice(0, safeCut).trimEnd()}…`;
}

export function createPublicPageMetadata({
    title,
    description,
    path,
    image,
}: {
    title: string;
    description: string;
    path: string;
    image?: string | null;
}): Metadata {
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = image || absoluteUrl("/logo.png");
    const socialTitle = `${title} | ${SITE_NAME}`;

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
            title: socialTitle,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: `${SITE_NAME} logo`,
                },
            ],
        },
        twitter: {
            card: "summary",
            title: socialTitle,
            description,
            images: [imageUrl],
        },
    };
}

export function serializeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}
