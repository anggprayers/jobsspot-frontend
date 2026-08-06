import { z } from "zod";

import { contactInquiryTypes } from "../types/contact";

export const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Enter at least 2 characters.")
        .max(80, "Name must not exceed 80 characters."),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .max(254, "Email address is too long."),

    inquiryType: z.enum(contactInquiryTypes),

    subject: z
        .string()
        .trim()
        .min(3, "Enter at least 3 characters.")
        .max(120, "Subject must not exceed 120 characters."),

    message: z
        .string()
        .trim()
        .min(20, "Enter at least 20 characters.")
        .max(5_000, "Message must not exceed 5,000 characters."),

    // Hidden spam-trap field. Real visitors leave this empty.
    website: z.string().max(200),
});

export type ContactFormValues = z.infer<
    typeof contactFormSchema
>;
