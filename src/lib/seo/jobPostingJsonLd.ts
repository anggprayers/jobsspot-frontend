import type { PublicJobDetails } from "@/features/jobs/types/publicJobDetails";
import { getUsStateName } from "@/lib/locations/usStates";

import { absoluteUrl } from "./site";

function getEmploymentType(value: string): string | undefined {
    switch (value) {
        case "FULL_TIME":
            return "FULL_TIME";
        case "PART_TIME":
            return "PART_TIME";
        case "CONTRACT":
            return "CONTRACTOR";
        case "TEMPORARY":
            return "TEMPORARY";
        case "INTERNSHIP":
            return "INTERN";
        default:
            return undefined;
    }
}

function getSalaryUnit(value: string): string | undefined {
    switch (value) {
        case "HOURLY":
            return "HOUR";
        case "DAILY":
            return "DAY";
        case "WEEKLY":
            return "WEEK";
        case "MONTHLY":
            return "MONTH";
        case "YEARLY":
            return "YEAR";
        default:
            return undefined;
    }
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function textBlockToHtml(value: string): string {
    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return "";
    }

    const bulletLines = lines.filter((line) => /^(?:•|-|\*)\s+/.test(line));

    if (bulletLines.length === lines.length) {
        const items = lines
            .map((line) => line.replace(/^(?:•|-|\*)\s+/, ""))
            .map((line) => `<li>${escapeHtml(line)}</li>`)
            .join("");

        return `<ul>${items}</ul>`;
    }

    return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function getEmploymentTypeLabel(value: string): string {
    switch (value) {
        case "FULL_TIME":
            return "Full-time";
        case "PART_TIME":
            return "Part-time";
        case "CONTRACT":
            return "Contract";
        case "TEMPORARY":
            return "Temporary";
        case "INTERNSHIP":
            return "Internship";
        default:
            return value;
    }
}

function getWorkplaceTypeLabel(value: string): string {
    switch (value) {
        case "ONSITE":
            return "On-site";
        case "REMOTE":
            return "Fully remote";
        case "HYBRID":
            return "Hybrid";
        default:
            return value;
    }
}

function getStructuredDescription(job: PublicJobDetails): string {
    const location = job.location?.trim() || "Location not specified";
    const details = `<p>Employment type: ${escapeHtml(getEmploymentTypeLabel(job.employmentType))}. Workplace type: ${escapeHtml(getWorkplaceTypeLabel(job.workplaceType))}. Location: ${escapeHtml(location)}.</p>`;
    const description = textBlockToHtml(job.description);
    const responsibilities = job.responsibilities?.trim()
        ? `<p>Responsibilities:</p>${textBlockToHtml(job.responsibilities)}`
        : "";
    const requirements = job.requirements?.trim()
        ? `<p>Requirements:</p>${textBlockToHtml(job.requirements)}`
        : "";

    return `${details}${description}${responsibilities}${requirements}`;
}

function getBaseSalary(job: PublicJobDetails) {
    if (!job.salaryCurrency || !job.salaryPeriod || (!job.salaryMin && !job.salaryMax)) {
        return undefined;
    }

    const unitText = getSalaryUnit(job.salaryPeriod);

    if (!unitText) {
        return undefined;
    }

    const minValue = job.salaryMin ? Number(job.salaryMin) : undefined;
    const maxValue = job.salaryMax ? Number(job.salaryMax) : undefined;

    if (
        (minValue !== undefined && !Number.isFinite(minValue)) ||
        (maxValue !== undefined && !Number.isFinite(maxValue))
    ) {
        return undefined;
    }

    const value =
        minValue !== undefined && maxValue !== undefined
            ? {
                  "@type": "QuantitativeValue",
                  minValue,
                  maxValue,
                  unitText,
              }
            : {
                  "@type": "QuantitativeValue",
                  value: minValue ?? maxValue,
                  unitText,
              };

    return {
        "@type": "MonetaryAmount",
        currency: job.salaryCurrency.toUpperCase(),
        value,
    };
}

function getValidThrough(job: PublicJobDetails): string | undefined {
    const candidates = [job.expiresAt, job.applicationDeadline]
        .filter((value): value is string => Boolean(value))
        .map((value) => new Date(value))
        .filter((value) => !Number.isNaN(value.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    return candidates[0]?.toISOString();
}

function getCountryName(countryCode: string): string {
    return countryCode.toUpperCase() === "US" ? "USA" : countryCode.toUpperCase();
}

function getPhysicalJobLocation(job: PublicJobDetails) {
    const city = job.city?.trim();
    const stateRegion = job.stateRegion?.trim();
    const countryCode = job.countryCode?.trim().toUpperCase();

    if (!city || !stateRegion || !countryCode) {
        return null;
    }

    if (countryCode === "US" && !getUsStateName(stateRegion)) {
        return null;
    }

    return {
        "@type": "Place",
        address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: stateRegion,
            addressCountry: countryCode,
        },
    };
}

function getRemoteApplicantLocationRequirement(job: PublicJobDetails) {
    const countryCode = job.countryCode?.trim().toUpperCase();

    if (!countryCode) {
        return null;
    }

    const stateRegion = job.stateRegion?.trim();

    if (stateRegion) {
        const stateName = getUsStateName(stateRegion);

        if (countryCode === "US" && !stateName) {
            return null;
        }

        return {
            "@type": "State",
            name: `${stateName ?? stateRegion}, ${getCountryName(countryCode)}`,
        };
    }

    return {
        "@type": "Country",
        name: getCountryName(countryCode),
    };
}

export function createJobPostingJsonLd(job: PublicJobDetails): Record<string, unknown> | null {
    if (!job.publishedAt) {
        return null;
    }

    const publishedAt = new Date(job.publishedAt);

    if (Number.isNaN(publishedAt.getTime())) {
        return null;
    }

    const isRemote = job.workplaceType === "REMOTE";
    const physicalJobLocation = isRemote ? null : getPhysicalJobLocation(job);
    const remoteApplicantLocation = isRemote ? getRemoteApplicantLocationRequirement(job) : null;

    if (!isRemote && !physicalJobLocation) {
        return null;
    }

    if (isRemote && !remoteApplicantLocation) {
        return null;
    }

    const employmentType = getEmploymentType(job.employmentType);
    const baseSalary = getBaseSalary(job);
    const validThrough = getValidThrough(job);
    const canonicalUrl = absoluteUrl(`/jobs/${job.slug}`);

    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: getStructuredDescription(job),
        datePosted: publishedAt.toISOString(),
        ...(validThrough ? { validThrough } : {}),
        ...(employmentType ? { employmentType } : {}),
        identifier: {
            "@type": "PropertyValue",
            name: job.company.name,
            value: job.id,
        },
        hiringOrganization: {
            "@type": "Organization",
            name: job.company.name,
            sameAs: job.company.websiteUrl ?? absoluteUrl(`/companies/${job.company.slug}`),
            ...(job.company.logoUrl ? { logo: job.company.logoUrl } : {}),
        },
        ...(physicalJobLocation ? { jobLocation: physicalJobLocation } : {}),
        ...(isRemote
            ? {
                  jobLocationType: "TELECOMMUTE",
                  applicantLocationRequirements: remoteApplicantLocation,
              }
            : {}),
        ...(baseSalary ? { baseSalary } : {}),
        occupationalCategory: job.category.name,
        url: canonicalUrl,
    };
}
