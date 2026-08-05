export type SavedSearchEmploymentType =
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "TEMPORARY"
    | "INTERNSHIP";

export type SavedSearchWorkplaceType =
    | "ONSITE"
    | "REMOTE"
    | "HYBRID";

export type SavedSearchExperienceLevel =
    | "ENTRY_LEVEL"
    | "JUNIOR"
    | "MID_LEVEL"
    | "SENIOR"
    | "LEAD"
    | "EXECUTIVE";

export type SavedSearchSalaryPeriod =
    | "HOURLY"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY";

export type SavedSearchCategory = {
    id: string;
    name: string;
    slug: string;
};

export type SavedSearch = {
    id: string;
    name: string;
    keyword: string | null;
    location: string | null;

    category: SavedSearchCategory | null;
    categorySlugs: string[];
    categories: SavedSearchCategory[];

    employmentType: SavedSearchEmploymentType | null;
    employmentTypes: SavedSearchEmploymentType[];
    workplaceType: SavedSearchWorkplaceType | null;
    workplaceTypes: SavedSearchWorkplaceType[];
    experienceLevel: SavedSearchExperienceLevel | null;
    experienceLevels: SavedSearchExperienceLevel[];

    salaryMin: string | null;
    salaryMax: string | null;
    salaryCurrency: string | null;
    salaryPeriod: SavedSearchSalaryPeriod | null;
    publishedWithinDays: number | null;

    emailAlertsEnabled: boolean;
    alertFrequency: "DAILY" | "WEEKLY" | null;
    lastAlertSentAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SavedSearchFiltersInput = {
    keyword?: string | null;
    location?: string | null;

    categorySlugs?: string[] | null;
    employmentTypes?:
        | SavedSearchEmploymentType[]
        | null;
    workplaceTypes?:
        | SavedSearchWorkplaceType[]
        | null;
    experienceLevels?:
        | SavedSearchExperienceLevel[]
        | null;

    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    salaryPeriod?: SavedSearchSalaryPeriod | null;
    publishedWithinDays?: number | null;
};

export type CreateSavedSearchRequest =
    SavedSearchFiltersInput & {
        name: string;
    };

export type UpdateSavedSearchRequest = Partial<
    CreateSavedSearchRequest
>;

export type SavedSearchPagination = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetSavedSearchesParams = {
    page?: number;
    limit?: number;
};

export type GetSavedSearchesResponse = {
    success: true;
    message: string;
    savedSearches: SavedSearch[];
    pagination: SavedSearchPagination;
};

export type CreateSavedSearchResponse = {
    success: true;
    message: string;
    savedSearch: SavedSearch;
};

export type UpdateSavedSearchResponse = {
    success: true;
    message: string;
    savedSearch: SavedSearch;
};

export type DeleteSavedSearchResponse = {
    success: true;
    message: string;
    id: string;
};
