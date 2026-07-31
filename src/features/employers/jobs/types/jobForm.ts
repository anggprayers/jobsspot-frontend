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
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "",
    applicationDeadline: "",
};
