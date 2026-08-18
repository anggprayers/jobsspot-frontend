import axios from "axios";

import { JOBS_SPOT_TIME_ZONE } from "@/lib/jobsSpotDateTime";

import type { SavedJobRecord } from "../types/savedJob";

export function formatSavedJobLabel(value: string): string {
    return value
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ");
}

export function formatSavedJobSalary(
    job: SavedJobRecord["job"],
): string {
    const salaryMin = job.salaryMin
        ? Number(job.salaryMin)
        : null;
    const salaryMax = job.salaryMax
        ? Number(job.salaryMax)
        : null;

    if (salaryMin === null && salaryMax === null) {
        return "Salary not specified";
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: job.salaryCurrency ?? "USD",
        maximumFractionDigits: 0,
    });

    let salary = "";

    if (salaryMin !== null && salaryMax !== null) {
        salary = `${formatter.format(
            salaryMin,
        )} – ${formatter.format(salaryMax)}`;
    } else if (salaryMin !== null) {
        salary = `From ${formatter.format(salaryMin)}`;
    } else {
        salary = `Up to ${formatter.format(
            salaryMax ?? 0,
        )}`;
    }

    if (!job.salaryPeriod) {
        return salary;
    }

    return `${salary} / ${formatSavedJobLabel(
        job.salaryPeriod,
    ).toLowerCase()}`;
}

export function formatSavedDate(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: JOBS_SPOT_TIME_ZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function getSavedJobCompanyInitials(
    companyName: string,
): string {
    const words = companyName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

export function getSavedJobErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
