"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    ClipboardCheck,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import Container from "@/components/layout/Container";

import { useSubmitJobSubmission } from "../hooks/useSubmitJobSubmission";
import type {
    EmploymentType,
    PublicJobSubmissionErrorResponse,
    PublicJobSubmissionRequest,
    PublicJobSubmissionResponse,
    WorkplaceType,
} from "../types/jobSubmission";
import {
    jobSubmissionSchema,
    type JobSubmissionFormValues,
} from "../validation/jobSubmissionSchema";

const workplaceOptions: Array<{ value: WorkplaceType; label: string }> = [
    { value: "ONSITE", label: "On-site" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "REMOTE", label: "Remote" },
];

const employmentOptions: Array<{ value: EmploymentType; label: string }> = [
    { value: "FULL_TIME", label: "Full time" },
    { value: "PART_TIME", label: "Part time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "INTERNSHIP", label: "Internship" },
];

const fieldNames = new Set<FieldPath<JobSubmissionFormValues>>([
    "jobTitle",
    "companyName",
    "companyWebsite",
    "location",
    "workplaceType",
    "employmentType",
    "salaryText",
    "description",
    "contactEmail",
    "contactPhone",
    "website",
]);

function isFieldName(value: string): value is FieldPath<JobSubmissionFormValues> {
    return fieldNames.has(value as FieldPath<JobSubmissionFormValues>);
}

function formatEnumLabel<T extends string>(
    value: T,
    options: Array<{ value: T; label: string }>,
): string {
    return options.find((option) => option.value === value)?.label ?? value;
}

function getSubmissionError(error: unknown): string {
    if (axios.isAxiosError<PublicJobSubmissionErrorResponse>(error)) {
        if (error.response?.status === 409) {
            const reference = error.response.data.referenceCode;
            return reference
                ? `This job was submitted recently. Existing reference: ${reference}.`
                : "This job appears to have been submitted recently.";
        }

        if (error.response?.status === 429) {
            return "Too many job submissions were sent recently. Please wait and try again later.";
        }

        return (
            error.response?.data?.message ??
            "We could not submit this job right now. Please try again."
        );
    }

    return "We could not submit this job right now. Please try again.";
}

function toRequest(values: JobSubmissionFormValues): PublicJobSubmissionRequest {
    return {
        jobTitle: values.jobTitle.trim(),
        companyName: values.companyName.trim(),
        ...(values.companyWebsite.trim()
            ? { companyWebsite: values.companyWebsite.trim() }
            : {}),
        location: values.location.trim(),
        workplaceType: values.workplaceType,
        employmentType: values.employmentType,
        ...(values.salaryText?.trim()
            ? { salaryText: values.salaryText.trim() }
            : {}),
        description: values.description.trim(),
        contactEmail: values.contactEmail.trim().toLowerCase(),
        ...(values.contactPhone.trim()
            ? { contactPhone: values.contactPhone.trim() }
            : {}),
        website: values.website,
    };
}

function StepPill({
    number,
    label,
    active,
    complete,
}: Readonly<{
    number: number;
    label: string;
    active: boolean;
    complete: boolean;
}>) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    complete
                        ? "border-blue-600 bg-blue-600 text-white"
                        : active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white text-slate-500"
                }`}
            >
                {complete ? <CheckCircle2 className="size-4" /> : number}
            </span>
            <span
                className={`hidden text-sm font-semibold sm:inline ${
                    active || complete ? "text-slate-950" : "text-slate-500"
                }`}
            >
                {label}
            </span>
        </div>
    );
}

function FieldError({ message }: Readonly<{ message?: string }>) {
    if (!message) return null;
    return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

function PreviewItem({
    label,
    value,
    wide = false,
}: Readonly<{ label: string; value: string; wide?: boolean }>) {
    return (
        <div className={wide ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {label}
            </dt>
            <dd className="mt-1.5 whitespace-pre-wrap text-base leading-7 text-slate-900">
                {value || "—"}
            </dd>
        </div>
    );
}

export default function PublicJobSubmissionPage() {
    const mutation = useSubmitJobSubmission();
    const [step, setStep] = useState<1 | 2>(1);
    const [submission, setSubmission] =
        useState<PublicJobSubmissionResponse | null>(null);
    const [formError, setFormError] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<JobSubmissionFormValues>({
        resolver: zodResolver(jobSubmissionSchema),
        defaultValues: {
            jobTitle: "",
            companyName: "",
            companyWebsite: "",
            location: "",
            workplaceType: "ONSITE",
            employmentType: "FULL_TIME",
            salaryText: "",
            description: "",
            contactEmail: "",
            contactPhone: "",
            website: "",
        },
    });

    const previewValues = getValues();

    function moveToPreview() {
        setFormError("");
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function submit(values: JobSubmissionFormValues) {
        setFormError("");

        try {
            const result = await mutation.mutateAsync(toRequest(values));
            setSubmission(result);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            if (axios.isAxiosError<PublicJobSubmissionErrorResponse>(error)) {
                const backendErrors = error.response?.data?.errors;

                if (backendErrors) {
                    for (const [field, messages] of Object.entries(backendErrors)) {
                        if (isFieldName(field) && messages[0]) {
                            setError(field, {
                                type: "server",
                                message: messages[0],
                            });
                        }
                    }

                    setStep(1);
                }
            }

            setFormError(getSubmissionError(error));
        }
    }

    if (submission) {
        return (
            <main className="bg-slate-50 py-12 sm:py-16 lg:py-20">
                <Container>
                    <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-10 lg:p-12">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="size-7" />
                        </div>

                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
                            Submission received
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            JobsSpot will review your job.
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                            We sent a confirmation to your contact email. Our team will review the details and contact you about the next steps before anything is published.
                        </p>

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                            <p className="text-sm font-semibold text-slate-600">Reference number</p>
                            <p className="mt-1 break-all text-xl font-bold text-slate-950">
                                {submission.submission.referenceCode}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Keep this reference if you need to contact JobsSpot about the submission.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/jobs"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                Browse jobs
                            </Link>
                            <Link
                                href="/#contact"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                            >
                                Contact JobsSpot
                            </Link>
                        </div>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className="bg-slate-50 py-10 sm:py-14 lg:py-18">
            <Container>
                <div className="mx-auto max-w-5xl">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">
                            Post a job
                        </p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Send us the job. We&apos;ll handle the rest.
                        </h1>
                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            Send us the essential job details and JobsSpot will review them, confirm the posting arrangement with you, and guide the next steps before publication.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:gap-5 sm:px-6">
                        <StepPill number={1} label="Job details" active={step === 1} complete={step === 2} />
                        <span className="h-px min-w-8 flex-1 bg-slate-200" />
                        <StepPill number={2} label="Preview" active={step === 2} complete={false} />
                        <span className="h-px min-w-8 flex-1 bg-slate-200" />
                        <StepPill number={3} label="Submit to JobsSpot" active={false} complete={false} />
                    </div>

                    {formError && (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                            {formError}
                        </div>
                    )}

                    {step === 1 ? (
                        <form
                            className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-9"
                            onSubmit={handleSubmit(moveToPreview)}
                            noValidate
                        >
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <BriefcaseBusiness className="size-5" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">Job details</h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Keep it simple. JobsSpot can complete structured publishing details during review.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-5 sm:grid-cols-2">
                                <label className="sm:col-span-2">
                                    <span className="text-sm font-semibold text-slate-800">Job title *</span>
                                    <input
                                        {...register("jobTitle")}
                                        placeholder="e.g. Warehouse Associate"
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <FieldError message={errors.jobTitle?.message} />
                                </label>

                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Company name *</span>
                                    <input
                                        {...register("companyName")}
                                        placeholder="e.g. ABC Logistics"
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <FieldError message={errors.companyName?.message} />
                                </label>

                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Company website</span>
                                    <input
                                        {...register("companyWebsite")}
                                        placeholder="https://company.com"
                                        inputMode="url"
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <FieldError message={errors.companyWebsite?.message} />
                                </label>

                                <label className="sm:col-span-2">
                                    <span className="text-sm font-semibold text-slate-800">Location *</span>
                                    <div className="relative mt-2">
                                        <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            {...register("location")}
                                            placeholder="e.g. Brooklyn, NY or Remote"
                                            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                    <FieldError message={errors.location?.message} />
                                </label>

                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Work arrangement *</span>
                                    <select
                                        {...register("workplaceType")}
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    >
                                        {workplaceOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError message={errors.workplaceType?.message} />
                                </label>

                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Job type *</span>
                                    <select
                                        {...register("employmentType")}
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    >
                                        {employmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError message={errors.employmentType?.message} />
                                </label>

                                <label className="sm:col-span-2">
                                    <span className="text-sm font-semibold text-slate-800">Salary / pay rate</span>
                                    <input
                                        {...register("salaryText")}
                                        placeholder="e.g. $25/hour or $55,000 - $70,000 yearly"
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                        Examples: $25/hour, $55,000 - $70,000 yearly, ₱18,000 monthly, or Commission-based.
                                    </p>
                                    <FieldError message={errors.salaryText?.message} />
                                </label>

                                <label className="sm:col-span-2">
                                    <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
                                        <span>Job description *</span>
                                        <span className="font-normal text-slate-500">Up to 5,000 characters</span>
                                    </span>
                                    <textarea
                                        {...register("description")}
                                        rows={8}
                                        placeholder="Describe the role, responsibilities, requirements, schedule, and anything applicants should know."
                                        className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <FieldError message={errors.description?.message} />
                                </label>
                            </div>

                            <div className="my-8 border-t border-slate-200" />

                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Mail className="size-5" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">Contact details</h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        JobsSpot will use these details to follow up about review, arrangements, and publication.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Contact email *</span>
                                    <input
                                        {...register("contactEmail")}
                                        type="email"
                                        autoComplete="email"
                                        placeholder="recruiter@company.com"
                                        className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <FieldError message={errors.contactEmail?.message} />
                                </label>

                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Contact phone</span>
                                    <div className="relative mt-2">
                                        <Phone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            {...register("contactPhone")}
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="+1 917-555-0100"
                                            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                    <FieldError message={errors.contactPhone?.message} />
                                </label>
                            </div>

                            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                                <label>
                                    Website
                                    <input {...register("website")} tabIndex={-1} autoComplete="off" />
                                </label>
                            </div>

                            <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                                <button
                                    type="submit"
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                                >
                                    Preview job
                                    <ArrowRight className="size-4" />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <ClipboardCheck className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-950">Preview your submission</h2>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Check the details before they are sent to JobsSpot.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    <ArrowLeft className="size-4" />
                                    Edit details
                                </button>
                            </div>

                            <dl className="mt-7 grid gap-x-8 gap-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 sm:p-6">
                                <PreviewItem label="Job title" value={previewValues.jobTitle} />
                                <PreviewItem label="Company" value={previewValues.companyName} />
                                <PreviewItem label="Location" value={previewValues.location} />
                                <PreviewItem
                                    label="Work arrangement"
                                    value={formatEnumLabel(previewValues.workplaceType, workplaceOptions)}
                                />
                                <PreviewItem
                                    label="Job type"
                                    value={formatEnumLabel(previewValues.employmentType, employmentOptions)}
                                />
                                <PreviewItem label="Salary / pay rate" value={previewValues.salaryText ?? ""} />
                                <PreviewItem label="Company website" value={previewValues.companyWebsite} />
                                <PreviewItem label="Contact email" value={previewValues.contactEmail} />
                                <PreviewItem label="Contact phone" value={previewValues.contactPhone} />
                                <PreviewItem label="Job description" value={previewValues.description} wide />
                            </dl>

                            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
                                <p className="font-semibold">What happens next?</p>
                                <p className="mt-1">
                                    JobsSpot reviews the submission, contacts you when needed, and only publishes the job after the details and arrangement are confirmed.
                                </p>
                            </div>

                            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={mutation.isPending}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                                >
                                    <ArrowLeft className="size-4" />
                                    Back
                                </button>
                                <button
                                    type="button"
                                    disabled={mutation.isPending}
                                    onClick={() => void handleSubmit(submit)()}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {mutation.isPending ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <Send className="size-4" />
                                    )}
                                    {mutation.isPending ? "Submitting..." : "Submit to JobsSpot"}
                                </button>
                            </div>
                        </section>
                    )}

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness className="size-5" />
                            </div>
                            <p className="mt-4 font-bold text-slate-950">Simple submission</p>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                Share the essential job details in just a few minutes.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <ClipboardCheck className="size-5" />
                            </div>
                            <p className="mt-4 font-bold text-slate-950">Reviewed by JobsSpot</p>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                Our team checks the submission and contacts you if anything needs clarification.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <p className="mt-4 font-bold text-slate-950">Published after confirmation</p>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                Once the arrangement is confirmed, JobsSpot prepares and publishes the listing.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
