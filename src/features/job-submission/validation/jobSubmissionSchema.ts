import { z } from "zod";

import { employmentTypes, workplaceTypes } from "../types/jobSubmission";

const optionalText = (maximum: number) =>
    z
        .string()
        .trim()
        .max(maximum, `Must not exceed ${maximum} characters.`)
        .optional()
        .or(z.literal(""));

export const jobSubmissionSchema = z.object({
    jobTitle: z
        .string()
        .trim()
        .min(2, "Enter a job title.")
        .max(120, "Job title must not exceed 120 characters."),
    companyName: z
        .string()
        .trim()
        .max(120, "Company name must not exceed 120 characters."),
    companyWebsite: z
        .string()
        .trim()
        .refine(
            (value) =>
                value.length === 0 ||
                /^https?:\/\//i.test(value),
            "Website must start with http:// or https://.",
        )
        .refine((value) => value.length <= 500, "Website URL is too long."),
    location: z
        .string()
        .trim()
        .max(160, "Location must not exceed 160 characters."),
    workplaceType: z.enum(workplaceTypes, {
        error: "Select a work arrangement.",
    }),
    employmentType: z.enum(employmentTypes, {
        error: "Select a job type.",
    }),
    salaryText: optionalText(120),
    description: z
        .string()
        .trim()
        .min(20, "Add at least 20 characters about the role.")
        .max(5_000, "Job description must not exceed 5,000 characters."),
    contactEmail: z
        .string()
        .trim()
        .email("Enter a valid contact email address.")
        .max(254, "Email address is too long."),
    contactPhone: z
        .string()
        .trim()
        .refine(
            (value) => value.length === 0 || value.length >= 7,
            "Phone number is too short.",
        )
        .refine((value) => value.length <= 30, "Phone number is too long.")
        .refine(
            (value) =>
                value.length === 0 || /^[0-9+().\-\s]+$/.test(value),
            "Phone number contains unsupported characters.",
        ),
    website: z.string().max(200),
});

export type JobSubmissionFormValues = z.infer<typeof jobSubmissionSchema>;
