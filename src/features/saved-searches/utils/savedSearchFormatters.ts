import axios from "axios";

import type {
    SavedSearch,
    SavedSearchFiltersInput,
} from "../types/savedSearch";

type ApiErrorPayload = {
    message?: string;
    errors?: Record<string, string[]>;
};

const listingTimeLabels: Record<number, string> = {
    1: "Posted today",
    3: "Posted in the last 3 days",
    7: "Posted in the last 7 days",
    14: "Posted in the last 14 days",
    30: "Posted in the last 30 days",
};

export function formatSavedSearchLabel(
    value: string,
): string {
    const specialLabels: Record<string, string> = {
        ONSITE: "On-site",
        FULL_TIME: "Full Time",
        PART_TIME: "Part Time",
        ENTRY_LEVEL: "Entry Level",
        MID_LEVEL: "Mid Level",
    };

    if (specialLabels[value]) {
        return specialLabels[value];
    }

    return value
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(" ");
}

export function formatSavedSearchDate(
    value: string,
): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function formatSalaryValue(
    value: string | number,
    currency: string,
): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function getSavedCategories(
    savedSearch: SavedSearch,
) {
    if ((savedSearch.categories?.length ?? 0) > 0) {
        return savedSearch.categories;
    }

    return savedSearch.category
        ? [savedSearch.category]
        : [];
}

function getSavedEmploymentTypes(
    savedSearch: SavedSearch,
) {
    if (
        (savedSearch.employmentTypes?.length ?? 0) >
        0
    ) {
        return savedSearch.employmentTypes;
    }

    return savedSearch.employmentType
        ? [savedSearch.employmentType]
        : [];
}

function getSavedWorkplaceTypes(
    savedSearch: SavedSearch,
) {
    if (
        (savedSearch.workplaceTypes?.length ?? 0) >
        0
    ) {
        return savedSearch.workplaceTypes;
    }

    return savedSearch.workplaceType
        ? [savedSearch.workplaceType]
        : [];
}

function getSavedExperienceLevels(
    savedSearch: SavedSearch,
) {
    if (
        (savedSearch.experienceLevels?.length ?? 0) >
        0
    ) {
        return savedSearch.experienceLevels;
    }

    return savedSearch.experienceLevel
        ? [savedSearch.experienceLevel]
        : [];
}

function formatValueList(values: string[]): string {
    return values
        .map(formatSavedSearchLabel)
        .join(", ");
}

function formatSalaryLabel({
    minimum,
    maximum,
    currency,
    period,
}: {
    minimum: string | number | null | undefined;
    maximum: string | number | null | undefined;
    currency: string;
    period: string | null | undefined;
}): string | null {
    if (!period || (!minimum && !maximum)) {
        return null;
    }

    const periodLabel =
        formatSavedSearchLabel(period);

    if (minimum && maximum) {
        return `${periodLabel}: ${formatSalaryValue(
            minimum,
            currency,
        )} – ${formatSalaryValue(
            maximum,
            currency,
        )}`;
    }

    if (minimum) {
        return `${periodLabel}: from ${formatSalaryValue(
            minimum,
            currency,
        )}`;
    }

    return `${periodLabel}: up to ${formatSalaryValue(
        maximum ?? 0,
        currency,
    )}`;
}

export function getSavedSearchFilterLabels(
    savedSearch: SavedSearch,
): string[] {
    const labels: string[] = [];

    if (savedSearch.keyword) {
        labels.push(`Keyword: ${savedSearch.keyword}`);
    }

    if (savedSearch.location) {
        labels.push(`Location: ${savedSearch.location}`);
    }

    const categories =
        getSavedCategories(savedSearch);
    if (categories.length > 0) {
        labels.push(
            `Classification: ${categories
                .map((category) => category.name)
                .join(", ")}`,
        );
    }

    const employmentTypes =
        getSavedEmploymentTypes(savedSearch);
    if (employmentTypes.length > 0) {
        labels.push(
            `Type: ${formatValueList(
                employmentTypes,
            )}`,
        );
    }

    const workplaceTypes =
        getSavedWorkplaceTypes(savedSearch);
    if (workplaceTypes.length > 0) {
        labels.push(
            `Workplace: ${formatValueList(
                workplaceTypes,
            )}`,
        );
    }

    const experienceLevels =
        getSavedExperienceLevels(savedSearch);
    if (experienceLevels.length > 0) {
        labels.push(
            `Experience: ${formatValueList(
                experienceLevels,
            )}`,
        );
    }

    const salaryLabel = formatSalaryLabel({
        minimum: savedSearch.salaryMin,
        maximum: savedSearch.salaryMax,
        currency:
            savedSearch.salaryCurrency ?? "USD",
        period: savedSearch.salaryPeriod,
    });
    if (salaryLabel) {
        labels.push(salaryLabel);
    }

    if (savedSearch.publishedWithinDays) {
        labels.push(
            listingTimeLabels[
                savedSearch.publishedWithinDays
            ] ??
                `Posted in the last ${savedSearch.publishedWithinDays} days`,
        );
    }

    return labels;
}

export function getDraftSavedSearchFilterLabels(
    filters: SavedSearchFiltersInput,
): string[] {
    const labels: string[] = [];

    if (filters.keyword) {
        labels.push(`Keyword: ${filters.keyword}`);
    }

    if (filters.location) {
        labels.push(`Location: ${filters.location}`);
    }

    if ((filters.categorySlugs?.length ?? 0) > 0) {
        labels.push(
            `Classification: ${filters.categorySlugs
                ?.map((slug) =>
                    formatSavedSearchLabel(
                        slug.replaceAll("-", "_"),
                    ),
                )
                .join(", ")}`,
        );
    }

    if (
        (filters.employmentTypes?.length ?? 0) > 0
    ) {
        labels.push(
            `Type: ${formatValueList(
                filters.employmentTypes ?? [],
            )}`,
        );
    }

    if (
        (filters.workplaceTypes?.length ?? 0) > 0
    ) {
        labels.push(
            `Workplace: ${formatValueList(
                filters.workplaceTypes ?? [],
            )}`,
        );
    }

    if (
        (filters.experienceLevels?.length ?? 0) > 0
    ) {
        labels.push(
            `Experience: ${formatValueList(
                filters.experienceLevels ?? [],
            )}`,
        );
    }

    const salaryLabel = formatSalaryLabel({
        minimum: filters.salaryMin,
        maximum: filters.salaryMax,
        currency:
            filters.salaryCurrency ?? "USD",
        period: filters.salaryPeriod,
    });
    if (salaryLabel) {
        labels.push(salaryLabel);
    }

    if (filters.publishedWithinDays) {
        labels.push(
            listingTimeLabels[
                filters.publishedWithinDays
            ] ??
                `Posted in the last ${filters.publishedWithinDays} days`,
        );
    }

    return labels;
}

export function buildSavedSearchUrl(
    savedSearch: SavedSearch,
): string {
    const params = new URLSearchParams();

    const categories =
        getSavedCategories(savedSearch);
    const employmentTypes =
        getSavedEmploymentTypes(savedSearch);
    const workplaceTypes =
        getSavedWorkplaceTypes(savedSearch);
    const experienceLevels =
        getSavedExperienceLevels(savedSearch);

    const hasStoredFilters = Boolean(
        savedSearch.keyword ||
            savedSearch.location ||
            categories.length > 0 ||
            employmentTypes.length > 0 ||
            workplaceTypes.length > 0 ||
            experienceLevels.length > 0 ||
            (savedSearch.salaryPeriod &&
                (savedSearch.salaryMin ||
                    savedSearch.salaryMax)) ||
            savedSearch.publishedWithinDays,
    );

    if (savedSearch.keyword) {
        params.set("search", savedSearch.keyword);
    }

    if (savedSearch.location) {
        params.set("location", savedSearch.location);
    }

    if (categories.length > 0) {
        params.set(
            "category",
            categories
                .map((category) => category.slug)
                .join(","),
        );
    }

    if (employmentTypes.length > 0) {
        params.set(
            "employmentType",
            employmentTypes.join(","),
        );
    }

    if (workplaceTypes.length > 0) {
        params.set(
            "workplaceType",
            workplaceTypes.join(","),
        );
    }

    if (experienceLevels.length > 0) {
        params.set(
            "experienceLevel",
            experienceLevels.join(","),
        );
    }

    if (
        savedSearch.salaryPeriod &&
        (savedSearch.salaryMin ||
            savedSearch.salaryMax)
    ) {
        params.set(
            "salaryPeriod",
            savedSearch.salaryPeriod,
        );
        params.set(
            "salaryCurrency",
            savedSearch.salaryCurrency ?? "USD",
        );

        if (savedSearch.salaryMin) {
            params.set(
                "salaryMin",
                savedSearch.salaryMin,
            );
        }

        if (savedSearch.salaryMax) {
            params.set(
                "salaryMax",
                savedSearch.salaryMax,
            );
        }
    }

    if (savedSearch.publishedWithinDays) {
        params.set(
            "publishedWithinDays",
            String(savedSearch.publishedWithinDays),
        );
    }

    if (!hasStoredFilters) {
        params.set("search", savedSearch.name);
    }

    params.set("page", "1");

    return `/jobs?${params.toString()}`;
}

export function getSavedSearchErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (axios.isAxiosError<ApiErrorPayload>(error)) {
        const validationMessage = Object.values(
            error.response?.data?.errors ?? {},
        ).flat()[0];

        return (
            validationMessage ??
            error.response?.data?.message ??
            fallback
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
