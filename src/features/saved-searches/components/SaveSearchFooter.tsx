"use client";

import { Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import SignInModal from "@/features/auth/components/SignInModal";
import { useAuth } from "@/features/auth/hooks/useAuth";

import type {
    SavedSearchEmploymentType,
    SavedSearchExperienceLevel,
    SavedSearchFiltersInput,
    SavedSearchSalaryPeriod,
    SavedSearchWorkplaceType,
} from "../types/savedSearch";
import SaveSearchDialog from "./SaveSearchDialog";

function getCommaSeparatedValues<T extends string>(
    searchParams: ReturnType<
        typeof useSearchParams
    >,
    name: string,
): T[] {
    return [
        ...new Set(
            searchParams
                .getAll(name)
                .flatMap((value) =>
                    value.split(","),
                )
                .map((value) => value.trim())
                .filter(Boolean),
        ),
    ] as T[];
}

function getNullableNumber(
    value: string | null,
): number | null {
    if (!value) {
        return null;
    }

    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
        ? parsedValue
        : null;
}

function getCurrentSavedSearchFilters(
    searchParams: ReturnType<
        typeof useSearchParams
    >,
): SavedSearchFiltersInput {
    return {
        keyword:
            searchParams.get("search") || null,
        location:
            searchParams.get("location") || null,

        categorySlugs:
            getCommaSeparatedValues<string>(
                searchParams,
                "category",
            ),
        employmentTypes:
            getCommaSeparatedValues<SavedSearchEmploymentType>(
                searchParams,
                "employmentType",
            ),
        workplaceTypes:
            getCommaSeparatedValues<SavedSearchWorkplaceType>(
                searchParams,
                "workplaceType",
            ),
        experienceLevels:
            getCommaSeparatedValues<SavedSearchExperienceLevel>(
                searchParams,
                "experienceLevel",
            ),

        salaryMin: getNullableNumber(
            searchParams.get("salaryMin"),
        ),
        salaryMax: getNullableNumber(
            searchParams.get("salaryMax"),
        ),
        salaryCurrency:
            searchParams.get("salaryCurrency") ||
            null,
        salaryPeriod:
            (searchParams.get(
                "salaryPeriod",
            ) as SavedSearchSalaryPeriod | null) ??
            null,
        publishedWithinDays: getNullableNumber(
            searchParams.get(
                "publishedWithinDays",
            ),
        ),
    };
}

function hasSavedSearchFilters(
    filters: SavedSearchFiltersInput,
): boolean {
    return Boolean(
        filters.keyword ||
            filters.location ||
            (filters.categorySlugs?.length ?? 0) >
                0 ||
            (filters.employmentTypes?.length ?? 0) >
                0 ||
            (filters.workplaceTypes?.length ?? 0) >
                0 ||
            (filters.experienceLevels?.length ?? 0) >
                0 ||
            (filters.salaryMin !== null &&
                filters.salaryMin !== undefined) ||
            (filters.salaryMax !== null &&
                filters.salaryMax !== undefined) ||
            filters.publishedWithinDays,
    );
}

export default function SaveSearchFooter() {
    const searchParams = useSearchParams();

    const {
        isAuthenticated,
        isInitializing,
    } = useAuth();

    const [isSignInOpen, setIsSignInOpen] =
        useState(false);
    const [isSaveSearchOpen, setIsSaveSearchOpen] =
        useState(false);

    const savedSearchFilters =
        getCurrentSavedSearchFilters(searchParams);

    if (!hasSavedSearchFilters(savedSearchFilters)) {
        return null;
    }

    function handleSaveSearchClick() {
        if (isInitializing) {
            return;
        }

        if (!isAuthenticated) {
            setIsSignInOpen(true);
            return;
        }

        setIsSaveSearchOpen(true);
    }

    return (
        <>
            <div className="flex justify-center py-8">
                <button
                    type="button"
                    disabled={isInitializing}
                    onClick={handleSaveSearchClick}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Heart className="size-5" />
                    Save this search
                </button>
            </div>

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() =>
                    setIsSignInOpen(false)
                }
            />

            {isSaveSearchOpen && (
                <SaveSearchDialog
                    filters={savedSearchFilters}
                    onClose={() =>
                        setIsSaveSearchOpen(false)
                    }
                />
            )}
        </>
    );
}
