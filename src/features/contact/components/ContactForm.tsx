"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    CheckCircle2,
    LoaderCircle,
    Send,
} from "lucide-react";
import { useState } from "react";
import {
    useForm,
    useWatch,
    type FieldPath,
} from "react-hook-form";

import { useSubmitContactMessage } from "../hooks/useSubmitContactMessage";
import type {
    ContactApiErrorResponse,
    ContactInquiryType,
    ContactSubmissionResponse,
} from "../types/contact";
import {
    contactFormSchema,
    type ContactFormValues,
} from "../validation/contactSchema";

const inquiryOptions: Array<{
    value: ContactInquiryType;
    label: string;
}> = [
    {
        value: "GENERAL",
        label: "General inquiry",
    },
    {
        value: "JOB_SEEKER",
        label: "Job seeker support",
    },
    {
        value: "EMPLOYER",
        label: "Employer support",
    },
    {
        value: "PARTNERSHIP",
        label: "Partnership",
    },
    {
        value: "TECHNICAL_SUPPORT",
        label: "Technical support",
    },
    {
        value: "FEEDBACK",
        label: "Feedback",
    },
];

const contactFieldNames = new Set<FieldPath<ContactFormValues>>([
    "name",
    "email",
    "inquiryType",
    "subject",
    "message",
    "website",
]);

function isContactFieldName(
    value: string,
): value is FieldPath<ContactFormValues> {
    return contactFieldNames.has(
        value as FieldPath<ContactFormValues>,
    );
}

function getContactErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ContactApiErrorResponse>(
            error,
        )
    ) {
        if (error.response?.status === 429) {
            return "Too many contact requests were submitted from this connection. Please wait and try again later.";
        }

        return (
            error.response?.data?.message ??
            "We could not send your message right now. Please try again."
        );
    }

    return "We could not send your message right now. Please try again.";
}

function formatReceivedAt(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default function ContactForm() {
    const mutation = useSubmitContactMessage();
    const [submission, setSubmission] =
        useState<ContactSubmissionResponse | null>(null);
    const [formError, setFormError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            inquiryType: "GENERAL",
            subject: "",
            message: "",
            website: "",
        },
    });

    const messageValue =
        useWatch({
            control,
            name: "message",
        }) ?? "";

    const isBusy =
        isSubmitting || mutation.isPending;

    async function onSubmit(
        values: ContactFormValues,
    ): Promise<void> {
        setFormError("");

        try {
            const response =
                await mutation.mutateAsync({
                    ...values,
                    email: values.email
                        .trim()
                        .toLowerCase(),
                });

            setSubmission(response);
            reset();
        } catch (error) {
            if (
                axios.isAxiosError<ContactApiErrorResponse>(
                    error,
                )
            ) {
                const validationErrors =
                    error.response?.data?.errors ?? {};

                for (const [
                    field,
                    messages,
                ] of Object.entries(
                    validationErrors,
                )) {
                    const message =
                        messages.find(Boolean);

                    if (
                        message &&
                        isContactFieldName(field)
                    ) {
                        setError(field, {
                            type: "server",
                            message,
                        });
                    }
                }
            }

            setFormError(
                getContactErrorMessage(error),
            );
        }
    }

    if (submission) {
        return (
            <div
                role="status"
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8"
            >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="size-6" />
                </div>

                <p className="mt-5 text-sm font-semibold text-emerald-700">
                    Message received
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                    Thanks for contacting JobsSpot.
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                    A confirmation was sent to your email address. Keep the reference below when following up with our team.
                </p>

                <dl className="mt-6 grid gap-4 rounded-2xl border border-emerald-200 bg-white p-4 text-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <div>
                        <dt className="text-slate-500">
                            Reference
                        </dt>
                        <dd className="mt-1 break-words font-mono text-xs font-semibold leading-5 text-slate-950">
                            {submission.referenceId}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-slate-500">
                            Received
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                            {formatReceivedAt(
                                submission.receivedAt,
                            )}
                        </dd>
                    </div>
                </dl>

                <button
                    type="button"
                    onClick={() => {
                        setSubmission(null);
                        setFormError("");
                    }}
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7"
        >
            {formError && (
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                    {formError}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                        Name
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        disabled={isBusy}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                            errors.name
                                ? "contact-name-error"
                                : undefined
                        }
                        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p
                            id="contact-name-error"
                            className="mt-2 text-sm font-medium text-red-600"
                        >
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                        Email address
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={isBusy}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email
                                ? "contact-email-error"
                                : undefined
                        }
                        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p
                            id="contact-email-error"
                            className="mt-2 text-sm font-medium text-red-600"
                        >
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-5">
                <label
                    htmlFor="contact-inquiry-type"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Inquiry type
                </label>
                <select
                    id="contact-inquiry-type"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.inquiryType)}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    {...register("inquiryType")}
                >
                    {inquiryOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.inquiryType && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.inquiryType.message}
                    </p>
                )}
            </div>

            <div className="mt-5">
                <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Subject
                </label>
                <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can we help?"
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                        errors.subject
                            ? "contact-subject-error"
                            : undefined
                    }
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    {...register("subject")}
                />
                {errors.subject && (
                    <p
                        id="contact-subject-error"
                        className="mt-2 text-sm font-medium text-red-600"
                    >
                        {errors.subject.message}
                    </p>
                )}
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-slate-800"
                    >
                        Message
                    </label>
                    <span className="text-xs text-slate-500">
                        {messageValue.length.toLocaleString()}/5,000
                    </span>
                </div>
                <textarea
                    id="contact-message"
                    rows={7}
                    placeholder="Share the details of your question or request."
                    disabled={isBusy}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                        errors.message
                            ? "contact-message-error"
                            : "contact-message-help"
                    }
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    {...register("message")}
                />
                {errors.message ? (
                    <p
                        id="contact-message-error"
                        className="mt-2 text-sm font-medium text-red-600"
                    >
                        {errors.message.message}
                    </p>
                ) : (
                    <p
                        id="contact-message-help"
                        className="mt-2 text-sm text-slate-500"
                    >
                        Do not include passwords, payment details, or other sensitive information.
                    </p>
                )}
            </div>

            <div
                aria-hidden="true"
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            >
                <label htmlFor="contact-website">
                    Website
                </label>
                <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                />
            </div>

            <button
                type="submit"
                disabled={isBusy}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isBusy ? (
                    <LoaderCircle className="size-4 animate-spin" />
                ) : (
                    <Send className="size-4" />
                )}
                {isBusy
                    ? "Sending message..."
                    : "Send message"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                We use your details only to respond to this request. Contact submissions are rate-limited to reduce spam.
            </p>
        </form>
    );
}
