"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type ControllerRenderProps, useForm } from "react-hook-form";
import { type KeyboardEvent, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { defaultJobFormValues } from "../types/jobForm";
import type { JobFormValues } from "../validations/jobFormSchema";
import { jobFormSchema } from "../validations/jobFormSchema";

export type JobCategoryOption = {
    id: string;
    name: string;
};

type JobFormProps = {
    categories: JobCategoryOption[];
    defaultValues?: JobFormValues;
    submitLabel?: string;
    isPending?: boolean;
    onSubmit: (values: JobFormValues) => Promise<void> | void;
    onCancel: () => void;
    onDirtyChange?: (isDirty: boolean) => void;
};

type BulletFieldName = "responsibilities" | "requirements";

type BulletField = ControllerRenderProps<JobFormValues, BulletFieldName>;

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor}>
            {children}
            <span className="ml-1 text-red-600" aria-hidden="true">
                *
            </span>
        </Label>
    );
}

function OptionalLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor}>
            {children}

            <span className="ml-1 font-normal text-slate-500">(Optional)</span>
        </Label>
    );
}

function formatBulletValue(value: string) {
    if (!value) {
        return "";
    }

    return value
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                return "";
            }

            if (trimmedLine.startsWith("• ") || trimmedLine.startsWith("- ")) {
                return trimmedLine;
            }

            return `• ${trimmedLine}`;
        })
        .join("\n");
}

function handleBulletKeyDown(event: KeyboardEvent<HTMLTextAreaElement>, field: BulletField) {
    if (event.key !== "Enter" || event.shiftKey) {
        return;
    }

    event.preventDefault();

    const textarea = event.currentTarget;
    const value = field.value ?? "";
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const nextValue = value.slice(0, selectionStart) + "\n• " + value.slice(selectionEnd);

    field.onChange(nextValue);

    requestAnimationFrame(() => {
        const nextCursorPosition = selectionStart + 3;

        textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
}

export default function JobForm({
    categories,
    defaultValues = defaultJobFormValues,
    submitLabel = "Create Job",
    isPending = false,
    onSubmit,
    onCancel,
    onDirtyChange,
}: JobFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<JobFormValues>({
        resolver: zodResolver(jobFormSchema),
        defaultValues,
    });

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    const submitting = isSubmitting || isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                Fields marked with <span className="font-semibold text-red-600">*</span> are
                required.
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <RequiredLabel htmlFor="title">Job title</RequiredLabel>

                    <Input
                        id="title"
                        placeholder="e.g. Frontend Developer"
                        aria-invalid={Boolean(errors.title)}
                        {...register("title")}
                    />

                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <RequiredLabel htmlFor="categoryId">Category</RequiredLabel>

                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || undefined} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="categoryId"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.categoryId)}
                                >
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>

                                <SelectContent className="max-h-72">
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.categoryId && (
                        <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <OptionalLabel htmlFor="location">Location</OptionalLabel>

                    <Input
                        id="location"
                        placeholder="e.g. New York, NY"
                        aria-invalid={Boolean(errors.location)}
                        {...register("location")}
                    />

                    {errors.location && (
                        <p className="text-sm text-red-600">{errors.location.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <RequiredLabel htmlFor="employmentType">Employment type</RequiredLabel>

                    <Controller
                        name="employmentType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="employmentType"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.employmentType)}
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="FULL_TIME">Full-time</SelectItem>

                                    <SelectItem value="PART_TIME">Part-time</SelectItem>

                                    <SelectItem value="CONTRACT">Contract</SelectItem>

                                    <SelectItem value="TEMPORARY">Temporary</SelectItem>

                                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.employmentType && (
                        <p className="text-sm text-red-600">{errors.employmentType.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <RequiredLabel htmlFor="workplaceType">Workplace type</RequiredLabel>

                    <Controller
                        name="workplaceType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="workplaceType"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.workplaceType)}
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="ONSITE">On-site</SelectItem>

                                    <SelectItem value="REMOTE">Remote</SelectItem>

                                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.workplaceType && (
                        <p className="text-sm text-red-600">{errors.workplaceType.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <RequiredLabel htmlFor="experienceLevel">Experience level</RequiredLabel>

                    <Controller
                        name="experienceLevel"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="experienceLevel"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.experienceLevel)}
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="ENTRY_LEVEL">Entry level</SelectItem>

                                    <SelectItem value="JUNIOR">Junior</SelectItem>

                                    <SelectItem value="MID_LEVEL">Mid-level</SelectItem>

                                    <SelectItem value="SENIOR">Senior</SelectItem>

                                    <SelectItem value="LEAD">Lead</SelectItem>

                                    <SelectItem value="EXECUTIVE">Executive</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.experienceLevel && (
                        <p className="text-sm text-red-600">{errors.experienceLevel.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <OptionalLabel htmlFor="applicationDeadline">
                        Application deadline
                    </OptionalLabel>

                    <Input
                        id="applicationDeadline"
                        type="date"
                        aria-invalid={Boolean(errors.applicationDeadline)}
                        {...register("applicationDeadline")}
                    />

                    {errors.applicationDeadline && (
                        <p className="text-sm text-red-600">{errors.applicationDeadline.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <RequiredLabel htmlFor="description">Job description</RequiredLabel>

                <Textarea
                    id="description"
                    rows={7}
                    placeholder="Describe the position, its purpose, and what candidates can expect..."
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                />

                {errors.description ? (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                ) : (
                    <p className="text-sm text-slate-500">Minimum of 50 characters.</p>
                )}
            </div>

            <div className="space-y-2">
                <OptionalLabel htmlFor="responsibilities">Responsibilities</OptionalLabel>

                <Controller
                    name="responsibilities"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="responsibilities"
                            rows={6}
                            placeholder={
                                "• Respond to customer inquiries\n• Resolve technical issues\n• Document customer interactions"
                            }
                            value={field.value ?? ""}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            onChange={(event) => {
                                field.onChange(formatBulletValue(event.target.value));
                            }}
                            onKeyDown={(event) => handleBulletKeyDown(event, field)}
                            aria-invalid={Boolean(errors.responsibilities)}
                        />
                    )}
                />

                {errors.responsibilities ? (
                    <p className="text-sm text-red-600">{errors.responsibilities.message}</p>
                ) : (
                    <p className="text-sm text-slate-500">
                        Press Enter to automatically add another bullet. Use Shift + Enter for a
                        normal line break.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <OptionalLabel htmlFor="requirements">Requirements</OptionalLabel>

                <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="requirements"
                            rows={6}
                            placeholder={
                                "• Excellent communication skills\n• Basic technical knowledge\n• Ability to work independently"
                            }
                            value={field.value ?? ""}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            onChange={(event) => {
                                field.onChange(formatBulletValue(event.target.value));
                            }}
                            onKeyDown={(event) => handleBulletKeyDown(event, field)}
                            aria-invalid={Boolean(errors.requirements)}
                        />
                    )}
                />

                {errors.requirements ? (
                    <p className="text-sm text-red-600">{errors.requirements.message}</p>
                ) : (
                    <p className="text-sm text-slate-500">
                        Press Enter to automatically add another bullet. Use Shift + Enter for a
                        normal line break.
                    </p>
                )}
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                    <h3 className="font-semibold text-slate-900">Salary information</h3>

                    <p className="mt-1 text-sm text-slate-600">Salary information is optional.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0 space-y-2">
                        <OptionalLabel htmlFor="salaryMin">Minimum salary</OptionalLabel>

                        <Input
                            id="salaryMin"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="30000"
                            className="w-full"
                            aria-invalid={Boolean(errors.salaryMin)}
                            {...register("salaryMin")}
                        />

                        {errors.salaryMin && (
                            <p className="text-sm text-red-600">{errors.salaryMin.message}</p>
                        )}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <OptionalLabel htmlFor="salaryMax">Maximum salary</OptionalLabel>

                        <Input
                            id="salaryMax"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="50000"
                            className="w-full"
                            aria-invalid={Boolean(errors.salaryMax)}
                            {...register("salaryMax")}
                        />

                        {errors.salaryMax && (
                            <p className="text-sm text-red-600">{errors.salaryMax.message}</p>
                        )}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <OptionalLabel htmlFor="salaryCurrency">Currency</OptionalLabel>

                        <Input
                            id="salaryCurrency"
                            maxLength={3}
                            placeholder="USD"
                            className="w-full"
                            aria-invalid={Boolean(errors.salaryCurrency)}
                            {...register("salaryCurrency")}
                        />

                        {errors.salaryCurrency && (
                            <p className="text-sm text-red-600">{errors.salaryCurrency.message}</p>
                        )}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <OptionalLabel htmlFor="salaryPeriod">Salary period</OptionalLabel>

                        <Controller
                            name="salaryPeriod"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value || "NONE"}
                                    onValueChange={(value) => {
                                        field.onChange(value === "NONE" ? "" : value);
                                    }}
                                >
                                    <SelectTrigger
                                        id="salaryPeriod"
                                        className="w-full"
                                        aria-invalid={Boolean(errors.salaryPeriod)}
                                    >
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="NONE">No salary period</SelectItem>
                                        <SelectItem value="HOURLY">Hourly</SelectItem>
                                        <SelectItem value="DAILY">Daily</SelectItem>
                                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                                        <SelectItem value="YEARLY">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.salaryPeriod && (
                            <p className="text-sm text-red-600">{errors.salaryPeriod.message}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
