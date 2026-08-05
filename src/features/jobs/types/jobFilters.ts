export type JobsSortOption =
    | "newest"
    | "oldest"
    | "salary_high"
    | "salary_low";

export type EmploymentTypeFilter =
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "TEMPORARY"
    | "INTERNSHIP";

export type WorkplaceTypeFilter =
    | "ONSITE"
    | "REMOTE"
    | "HYBRID";

export type ExperienceLevelFilter =
    | "ENTRY_LEVEL"
    | "JUNIOR"
    | "MID_LEVEL"
    | "SENIOR"
    | "LEAD"
    | "EXECUTIVE";

export type SalaryPeriodFilter =
    | "HOURLY"
    | "MONTHLY"
    | "YEARLY";

export type JobFilters = {
    search: string;
    location: string;
    category: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
    salaryPeriod: string;
    salaryMin: string;
    salaryMax: string;
    salaryCurrency: string;
    publishedWithinDays: string;
    sort: JobsSortOption;
    page: number;
    limit: number;
};

export const employmentTypeOptions = [
    {
        label: "Full Time",
        value: "FULL_TIME",
    },
    {
        label: "Part Time",
        value: "PART_TIME",
    },
    {
        label: "Contract",
        value: "CONTRACT",
    },
    {
        label: "Temporary",
        value: "TEMPORARY",
    },
    {
        label: "Internship",
        value: "INTERNSHIP",
    },
] as const satisfies ReadonlyArray<{
    label: string;
    value: EmploymentTypeFilter;
}>;

export const employmentTypeFilterGroups = [
    {
        label: "Full time",
        values: ["FULL_TIME"],
    },
    {
        label: "Part time",
        values: ["PART_TIME"],
    },
    {
        label: "Contract/Temporary",
        values: ["CONTRACT", "TEMPORARY"],
    },
    {
        label: "Internship",
        values: ["INTERNSHIP"],
    },
] as const satisfies ReadonlyArray<{
    label: string;
    values: readonly EmploymentTypeFilter[];
}>;

export const workplaceTypeOptions = [
    {
        label: "On-site",
        value: "ONSITE",
    },
    {
        label: "Hybrid",
        value: "HYBRID",
    },
    {
        label: "Remote",
        value: "REMOTE",
    },
] as const satisfies ReadonlyArray<{
    label: string;
    value: WorkplaceTypeFilter;
}>;

export const experienceLevelOptions = [
    {
        label: "Entry Level",
        value: "ENTRY_LEVEL",
    },
    {
        label: "Junior",
        value: "JUNIOR",
    },
    {
        label: "Mid Level",
        value: "MID_LEVEL",
    },
    {
        label: "Senior",
        value: "SENIOR",
    },
    {
        label: "Lead",
        value: "LEAD",
    },
    {
        label: "Executive",
        value: "EXECUTIVE",
    },
] as const satisfies ReadonlyArray<{
    label: string;
    value: ExperienceLevelFilter;
}>;

export const salaryPeriodOptions = [
    {
        label: "Yearly",
        value: "YEARLY",
    },
    {
        label: "Monthly",
        value: "MONTHLY",
    },
    {
        label: "Hourly",
        value: "HOURLY",
    },
] as const satisfies ReadonlyArray<{
    label: string;
    value: SalaryPeriodFilter;
}>;

export const listingTimeOptions = [
    {
        label: "Any time",
        value: "",
    },
    {
        label: "Today",
        value: "1",
    },
    {
        label: "Last 3 days",
        value: "3",
    },
    {
        label: "Last 7 days",
        value: "7",
    },
    {
        label: "Last 14 days",
        value: "14",
    },
    {
        label: "Last 30 days",
        value: "30",
    },
] as const;

export const jobsSortOptions: ReadonlyArray<{
    label: string;
    value: JobsSortOption;
}> = [
    {
        label: "Newest first",
        value: "newest",
    },
    {
        label: "Oldest first",
        value: "oldest",
    },
    {
        label: "Highest salary",
        value: "salary_high",
    },
    {
        label: "Lowest salary",
        value: "salary_low",
    },
];
