"use client";

import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    employmentTypeOptions,
    experienceLevelOptions,
    listingTimeOptions,
    workplaceTypeOptions,
} from "../types/jobFilters";

type JobsFiltersProps = Readonly<{
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}>;

type FilterSectionProps = Readonly<{
    title: string;
    description?: string;
    children: React.ReactNode;
}>;

function FilterSection({ title, description, children }: FilterSectionProps) {
    return (
        <fieldset className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
            <legend className="text-base font-semibold text-slate-950">{title}</legend>

            {description && (
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
            )}

            <div className="mt-4 space-y-3">{children}</div>
        </fieldset>
    );
}

function getQueryValues(searchParams: ReturnType<typeof useSearchParams>, name: string) {
    return [
        ...new Set(
            searchParams
                .getAll(name)
                .flatMap((value) => value.split(","))
                .map((value) => value.trim())
                .filter(Boolean),
        ),
    ];
}

export default function JobsFilters({ isMobileOpen = false, onMobileClose }: JobsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedEmploymentTypes = getQueryValues(searchParams, "employmentType");
    const selectedWorkplaceTypes = getQueryValues(searchParams, "workplaceType");
    const selectedExperienceLevels = getQueryValues(searchParams, "experienceLevel");
    const publishedWithinDays = searchParams.get("publishedWithinDays") ?? "";

    function pushParams(params: URLSearchParams) {
        params.set("page", "1");
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    function toggleFilter(name: string, currentValues: string[], value: string) {
        const params = new URLSearchParams(searchParams.toString());
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        if (nextValues.length > 0) {
            params.set(name, nextValues.join(","));
        } else {
            params.delete(name);
        }

        pushParams(params);
    }

    function updateSingleFilter(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        pushParams(params);
    }

    function clearFilters() {
        const params = new URLSearchParams();
        const search = searchParams.get("search");
        const location = searchParams.get("location");
        const sort = searchParams.get("sort");

        if (search) params.set("search", search);
        if (location) params.set("location", location);
        if (sort) params.set("sort", sort);

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    const content = (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={19} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                    >
                        <RotateCcw size={15} />
                        Clear
                    </button>

                    {onMobileClose && (
                        <button
                            type="button"
                            onClick={onMobileClose}
                            aria-label="Close filters"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <FilterSection title="Work arrangement">
                {workplaceTypeOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedWorkplaceTypes.includes(option.value)}
                            onChange={() => toggleFilter("workplaceType", selectedWorkplaceTypes, option.value)}
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                        {option.label}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Job type">
                {employmentTypeOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedEmploymentTypes.includes(option.value)}
                            onChange={() => toggleFilter("employmentType", selectedEmploymentTypes, option.value)}
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                        {option.label}
                    </label>
                ))}
            </FilterSection>

            <FilterSection
                title="Experience"
                description="Choose one or more levels that fit your search."
            >
                {experienceLevelOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedExperienceLevels.includes(option.value)}
                            onChange={() => toggleFilter("experienceLevel", selectedExperienceLevels, option.value)}
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                        {option.label}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Date posted">
                {listingTimeOptions.map((option) => (
                    <label key={option.label} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                        <input
                            type="radio"
                            name="publishedWithinDays"
                            value={option.value}
                            checked={publishedWithinDays === option.value}
                            onChange={() => updateSingleFilter("publishedWithinDays", option.value)}
                            className="h-4 w-4 border-slate-300 accent-blue-600"
                        />
                        {option.label}
                    </label>
                ))}
            </FilterSection>
        </div>
    );

    return (
        <>
            <aside className="hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
                {content}
            </aside>

            {isMobileOpen && (
                <div className="fixed inset-0 z-60 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={onMobileClose}
                        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                    />

                    <aside className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
                        {content}
                    </aside>
                </div>
            )}
        </>
    );
}
