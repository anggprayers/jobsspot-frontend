import { z } from "zod";

export const employmentTypeValues = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "TEMPORARY",
    "INTERNSHIP",
] as const;

export const workplaceTypeValues = ["ONSITE", "REMOTE", "HYBRID"] as const;

export const experienceLevelValues = [
    "ENTRY_LEVEL",
    "JUNIOR",
    "MID_LEVEL",
    "SENIOR",
    "LEAD",
    "EXECUTIVE",
] as const;

export const salaryPeriodValues = ["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const;

const optionalSalarySchema = z
    .string()
    .trim()
    .refine(
        (value) => value === "" || !Number.isNaN(Number(value)),
        "Salary must be a valid number.",
    )
    .refine((value) => value === "" || Number(value) >= 0, "Salary cannot be negative.");

export const jobFormSchema = z
    .object({
        categoryId: z.string().uuid("Please select a valid job category."),

        title: z
            .string()
            .trim()
            .min(3, "Job title must contain at least 3 characters.")
            .max(120, "Job title cannot exceed 120 characters."),

        description: z
            .string()
            .trim()
            .min(50, "Job description must contain at least 50 characters.")
            .max(10000, "Job description cannot exceed 10,000 characters."),

        requirements: z
            .string()
            .trim()
            .max(5000, "Job requirements cannot exceed 5,000 characters."),

        responsibilities: z
            .string()
            .trim()
            .max(5000, "Job responsibilities cannot exceed 5,000 characters."),

        employmentType: z.enum(employmentTypeValues),

        workplaceType: z.enum(workplaceTypeValues),

        experienceLevel: z.enum(experienceLevelValues),

        location: z
            .string()
            .trim()
            .refine(
                (value) => value === "" || value.length >= 2,
                "Location must contain at least 2 characters.",
            )
            .refine((value) => value.length <= 150, "Location cannot exceed 150 characters."),

        salaryMin: optionalSalarySchema,

        salaryMax: optionalSalarySchema,

        salaryCurrency: z
            .string()
            .trim()
            .length(3, "Currency must use a 3-letter code.")
            .transform((value) => value.toUpperCase()),

        salaryPeriod: z.union([z.enum(salaryPeriodValues), z.literal("")]),

        applicationDeadline: z
            .string()
            .refine(
                (value) => value === "" || !Number.isNaN(new Date(value).getTime()),
                "Application deadline must be a valid date.",
            ),
    })
    .superRefine((data, context) => {
        const salaryMin = data.salaryMin === "" ? undefined : Number(data.salaryMin);

        const salaryMax = data.salaryMax === "" ? undefined : Number(data.salaryMax);

        if (salaryMin !== undefined && salaryMax !== undefined && salaryMax < salaryMin) {
            context.addIssue({
                code: "custom",
                message: "Maximum salary must be greater than or equal to minimum salary.",
                path: ["salaryMax"],
            });
        }

        if (data.applicationDeadline) {
            const deadline = new Date(`${data.applicationDeadline}T23:59:59`);

            if (deadline <= new Date()) {
                context.addIssue({
                    code: "custom",
                    message: "Application deadline must be in the future.",
                    path: ["applicationDeadline"],
                });
            }
        }

        const hasSalary = salaryMin !== undefined || salaryMax !== undefined;

        if (hasSalary && data.salaryPeriod === "") {
            context.addIssue({
                code: "custom",
                message: "Please select a salary period when providing a salary.",
                path: ["salaryPeriod"],
            });
        }
    });

export type JobFormValues = z.input<typeof jobFormSchema>;
