"use client";

import axios from "axios";
import {
    BellRing,
    ChevronDown,
    ChevronUp,
    LoaderCircle,
    Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    useNotificationPreferences,
    useUpdateNotificationPreferences,
} from "../hooks/useNotifications";
import type {
    NotificationPreferences,
    UpdateNotificationPreferencesInput,
} from "../types/notification";

type PreferenceKey = keyof UpdateNotificationPreferencesInput;

type NotificationPreferencesContext = "JOB_SEEKER" | "EMPLOYER";

type NotificationPreferencesSectionProps = {
    isEmailVerified: boolean;
    context?: NotificationPreferencesContext;
};

type ApiErrorResponse = {
    message?: string;
};

const jobSeekerPreferenceRows: Array<{
    key: PreferenceKey;
    title: string;
    description: string;
}> = [
    {
        key: "jobSeekerApplicationUpdatesEmail",
        title: "Application updates",
        description:
            "Submission confirmations and meaningful status changes for your applications.",
    },
    {
        key: "systemEmail",
        title: "JobsSpot account & system notices",
        description:
            "Important account, security, moderation, and JobsSpot service notices.",
    },
];

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? "Unable to update notification preferences.";
    }

    return error instanceof Error
        ? error.message
        : "Unable to update notification preferences.";
}

export default function NotificationPreferencesSection({
    isEmailVerified,
    context = "JOB_SEEKER",
}: NotificationPreferencesSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isEmployerContext = context === "EMPLOYER";
    const preferencesQuery = useNotificationPreferences(
        isEmailVerified && !isEmployerContext,
    );
    const updateMutation = useUpdateNotificationPreferences();

    const preferences = preferencesQuery.data?.preferences;
    const sectionTitle = isEmployerContext
        ? "Employer email preferences"
        : "Email preferences";
    const sectionDescription = isEmployerContext
        ? "Employer-workspace alerts are being retired as JobsSpot moves hiring coordination to Platform Admin."
        : "Choose which candidate and account updates should also be delivered by email.";

    async function togglePreference(
        key: PreferenceKey,
        currentValue: boolean,
    ) {
        if (updateMutation.isPending) {
            return;
        }

        try {
            await updateMutation.mutateAsync({
                [key]: !currentValue,
            });

            toast.success("Notification preference updated.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                aria-expanded={isExpanded}
                className="flex w-full items-start gap-3 px-5 py-5 text-left sm:px-6"
            >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BellRing className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-bold text-slate-950">{sectionTitle}</h2>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                            {isExpanded ? "Hide" : "Show"}
                            {isExpanded ? (
                                <ChevronUp className="size-4" />
                            ) : (
                                <ChevronDown className="size-4" />
                            )}
                        </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        {sectionDescription}
                        {!isEmployerContext && " In-app notifications stay available."}
                    </p>
                </div>
            </button>

            {isExpanded && (
                <div className="border-t border-slate-200 p-5 sm:p-6">
                    {isEmployerContext ? (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                            New applications and withdrawals now notify JobsSpot Platform Admin instead of company members. Employer-specific application, team, and job-expiration email switches are no longer part of the admin-managed hiring model.
                        </div>
                    ) : !isEmailVerified ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                            Verify your email address before enabling notification emails.
                        </div>
                    ) : preferencesQuery.isLoading ? (
                        <div className="flex min-h-24 items-center justify-center gap-2 text-sm font-medium text-slate-500">
                            <LoaderCircle className="size-4 animate-spin" />
                            Loading notification preferences...
                        </div>
                    ) : preferencesQuery.isError || !preferences ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                            Unable to load notification preferences. Try refreshing this page.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                                <Mail className="mt-0.5 size-4 shrink-0" />
                                <p>
                                    These switches control email copies only. In-app notifications remain available even when an email category is off.
                                </p>
                            </div>

                            {jobSeekerPreferenceRows.map((row) => {
                                const isEnabled = preferences[
                                    row.key as keyof NotificationPreferences
                                ] as boolean;

                                return (
                                    <div
                                        key={row.key}
                                        className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 p-4"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {row.title}
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                {row.description}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={isEnabled}
                                            aria-label={`${row.title} email ${isEnabled ? "enabled" : "disabled"}`}
                                            disabled={updateMutation.isPending}
                                            onClick={() =>
                                                void togglePreference(
                                                    row.key,
                                                    isEnabled,
                                                )
                                            }
                                            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                                isEnabled
                                                    ? "bg-blue-600"
                                                    : "bg-slate-300"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
                                                    isEnabled
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
