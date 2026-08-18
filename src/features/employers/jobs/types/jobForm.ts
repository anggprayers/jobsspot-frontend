import type { JobFormValues } from "../validations/jobFormSchema";

export const defaultJobFormValues: JobFormValues = {
    categoryId: "",
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    employmentType: "FULL_TIME",
    workplaceType: "ONSITE",
    experienceLevel: "ENTRY_LEVEL",
    city: "",
    stateRegion: "",
    countryCode: "US",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "",
    applicationDeadline: "",
};
