"use client";

import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useJobCategories } from "../hooks/useJobCategories";
import {
    employmentTypeOptions,
    experienceLevelOptions,
    workplaceTypeOptions,
} from "../types/jobFilters";

type JobsFiltersProps = Readonly<{
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}>;

type FilterSectionProps = Readonly<{
    title: string;
    children: React.ReactNode;
}>;

function FilterSection({ title, children }: FilterSectionProps) {
    return (
        <fieldset className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
            <legend className="text-base font-semibold text-slate-950">{title}</legend>

            <div className="mt-4 space-y-3">{children}</div>
        </fieldset>
    );
}

export default function JobsFilters({ isMobileOpen = false, onMobileClose }: JobsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { data: categoriesData, isLoading: isCategoriesLoading } = useJobCategories();

    const categories = categoriesData?.categories ?? [];

    function updateFilter(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    }

    function clearFilters() {
        const params = new URLSearchParams();

        const search = searchParams.get("search");
        const location = searchParams.get("location");
        const sort = searchParams.get("sort");

        if (search) {
            params.set("search", search);
        }

        if (location) {
            params.set("location", location);
        }

        if (sort) {
            params.set("sort", sort);
        }

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

            <FilterSection title="Category">
                {isCategoriesLoading && (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-5 animate-pulse rounded bg-slate-100" />
                        ))}
                    </div>
                )}

                {!isCategoriesLoading && categories.length === 0 && (
                    <p className="text-sm text-slate-500">No categories available.</p>
                )}

                {categories.map((category) => (
                    <label
                        key={category.id}
                        className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700"
                    >
                        <span className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="category"
                                value={category.slug}
                                checked={searchParams.get("category") === category.slug}
                                onChange={() => updateFilter("category", category.slug)}
                                className="h-4 w-4 border-slate-300 text-blue-600 accent-blue-600"
                            />

                            <span>{category.name}</span>
                        </span>

                        <span className="text-xs text-slate-400">{category.jobCount}</span>
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Employment Type">
                {employmentTypeOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                    >
                        <input
                            type="radio"
                            name="employmentType"
                            value={option.value}
                            checked={searchParams.get("employmentType") === option.value}
                            onChange={() => updateFilter("employmentType", option.value)}
                            className="h-4 w-4 border-slate-300 accent-blue-600"
                        />

                        {option.label}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Workplace Type">
                {workplaceTypeOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                    >
                        <input
                            type="radio"
                            name="workplaceType"
                            value={option.value}
                            checked={searchParams.get("workplaceType") === option.value}
                            onChange={() => updateFilter("workplaceType", option.value)}
                            className="h-4 w-4 border-slate-300 accent-blue-600"
                        />

                        {option.label}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Experience Level">
                {experienceLevelOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                    >
                        <input
                            type="radio"
                            name="experienceLevel"
                            value={option.value}
                            checked={searchParams.get("experienceLevel") === option.value}
                            onChange={() => updateFilter("experienceLevel", option.value)}
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
