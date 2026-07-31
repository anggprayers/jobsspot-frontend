export type JobsSortOption = "newest" | "oldest" | "salary_high" | "salary_low";

export type JobFilters = {
    search: string;
    location: string;
    category: string;
    employmentType: string;
    workplaceType: string;
    experienceLevel: string;
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
] as const;

export const workplaceTypeOptions = [
    {
        label: "On-site",
        value: "ONSITE",
    },
    {
        label: "Remote",
        value: "REMOTE",
    },
    {
        label: "Hybrid",
        value: "HYBRID",
    },
] as const;

export const experienceLevelOptions = [
    {
        label: "Entry Level",
        value: "ENTRY_LEVEL",
    },
    {
        label: "Mid Level",
        value: "MID_LEVEL",
    },
    {
        label: "Senior Level",
        value: "SENIOR_LEVEL",
    },
    {
        label: "Lead",
        value: "LEAD",
    },
    {
        label: "Manager",
        value: "MANAGER",
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
