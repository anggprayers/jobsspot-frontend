import type { CompanyJob } from "../types/companyJob";

type JobAvailabilityFields = Pick<
    CompanyJob,
    "status" | "isExpired"
>;

export function formatJobStatus(
    job: JobAvailabilityFields,
) {
    if (job.isExpired) {
        return "Expired";
    }

    const labels: Record<
        CompanyJob["status"],
        string
    > = {
        DRAFT: "Draft",
        PUBLISHED: "Published",
        PAUSED: "Paused",
        CLOSED: "Closed",
        ARCHIVED: "Archived",
    };

    return labels[job.status];
}

export function formatEmploymentType(
    employmentType: CompanyJob["employmentType"],
) {
    const labels: Record<
        CompanyJob["employmentType"],
        string
    > = {
        FULL_TIME: "Full-time",
        PART_TIME: "Part-time",
        CONTRACT: "Contract",
        TEMPORARY: "Temporary",
        INTERNSHIP: "Internship",
    };

    return labels[employmentType];
}

export function formatWorkplaceType(
    workplaceType: CompanyJob["workplaceType"],
) {
    const labels: Record<
        CompanyJob["workplaceType"],
        string
    > = {
        ONSITE: "On-site",
        REMOTE: "Remote",
        HYBRID: "Hybrid",
    };

    return labels[workplaceType];
}

export function formatJobDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function formatJobExpiration(
    job: Pick<
        CompanyJob,
        | "status"
        | "expiresAt"
        | "isExpired"
        | "daysUntilExpiration"
    >,
) {
    if (
        job.status !== "PUBLISHED" ||
        !job.expiresAt
    ) {
        return {
            dateLabel: "Not published",
            detailLabel: null,
        };
    }

    if (job.isExpired) {
        return {
            dateLabel: formatJobDate(job.expiresAt),
            detailLabel: "Expired",
        };
    }

    if (job.daysUntilExpiration === 0) {
        return {
            dateLabel: formatJobDate(job.expiresAt),
            detailLabel: "Expires today",
        };
    }

    if (job.daysUntilExpiration === 1) {
        return {
            dateLabel: formatJobDate(job.expiresAt),
            detailLabel: "1 day left",
        };
    }

    return {
        dateLabel: formatJobDate(job.expiresAt),
        detailLabel:
            job.daysUntilExpiration === null
                ? null
                : `${job.daysUntilExpiration} days left`,
    };
}

export function getJobStatusBadgeClasses(
    job: JobAvailabilityFields,
) {
    if (job.isExpired) {
        return "border-red-200 bg-red-50 text-red-700";
    }

    const classes: Record<
        CompanyJob["status"],
        string
    > = {
        PUBLISHED:
            "border-green-200 bg-green-50 text-green-700",
        DRAFT:
            "border-slate-200 bg-slate-100 text-slate-700",
        PAUSED:
            "border-amber-200 bg-amber-50 text-amber-700",
        CLOSED:
            "border-red-200 bg-red-50 text-red-700",
        ARCHIVED:
            "border-purple-200 bg-purple-50 text-purple-700",
    };

    return classes[job.status];
}
