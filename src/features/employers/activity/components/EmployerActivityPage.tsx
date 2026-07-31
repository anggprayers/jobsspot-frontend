"use client";

import axios from "axios";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
    Archive,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    ChevronLeft,
    ChevronRight,
    CirclePause,
    FilePlus2,
    History,
    Image as ImageIcon,
    ImageOff,
    LoaderCircle,
    PencilLine,
    RefreshCw,
    RotateCcw,
    Send,
    ShieldCheck,
    Trash2,
    UserCog,
    UserMinus,
    UserPlus,
    UserRound,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useCompanyActivity } from "../hooks/useCompanyActivity";
import type { ActivityFilterValue, CompanyActivityItem } from "../types/activity";

import { canViewActivity } from "@/features/employers/utils/employerPermissions";

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "U";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

function getMetadataString(metadata: Record<string, unknown> | null, key: string): string | null {
    const value = metadata?.[key];

    return typeof value === "string" ? value : null;
}

function getMetadataStringArray(metadata: Record<string, unknown> | null, key: string): string[] {
    const value = metadata?.[key];

    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is string => typeof item === "string");
}

function getMetadataBoolean(metadata: Record<string, unknown> | null, key: string): boolean | null {
    const value = metadata?.[key];

    return typeof value === "boolean" ? value : null;
}

function formatFieldLabel(field: string): string {
    return field
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatEnumLabel(value: string | null): string {
    if (!value) {
        return "Unknown";
    }

    return value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatActivityDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(date);
}

function getErrorMessage(error: unknown): string {
    if (
        axios.isAxiosError<{
            message?: string;
        }>(error)
    ) {
        return error.response?.data?.message ?? "Unable to load company activity.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to load company activity.";
}

function ApplicationStatusDescription({ activity }: { activity: CompanyActivityItem }) {
    const applicantName = getMetadataString(activity.metadata, "applicantName") ?? "an applicant";

    const jobTitle = getMetadataString(activity.metadata, "jobTitle") ?? "a company job";

    const previousStatus = getMetadataString(activity.metadata, "previousStatus");

    const newStatus = getMetadataString(activity.metadata, "newStatus");

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                    <BriefcaseBusiness className="size-4" />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    changed <span className="font-semibold text-foreground">{applicantName}</span>
                    &apos;s application status.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full border bg-muted px-2.5 py-1 font-medium">
                    {formatEnumLabel(previousStatus)}
                </span>

                <ArrowRight className="size-4 text-muted-foreground" />

                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                    {formatEnumLabel(newStatus)}
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BriefcaseBusiness className="size-4 shrink-0" />

                <span className="truncate">{jobTitle}</span>
            </div>
        </div>
    );
}

function MemberAddedDescription({ activity }: { activity: CompanyActivityItem }) {
    const targetDisplayName = getMetadataString(activity.metadata, "targetDisplayName") ?? "a user";

    const targetEmail = getMetadataString(activity.metadata, "targetEmail");

    const assignedRole = getMetadataString(activity.metadata, "assignedRole");

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <UserPlus className="size-4" />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    added <span className="font-semibold text-foreground">{targetDisplayName}</span>{" "}
                    to the company.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Assigned role</span>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {formatEnumLabel(assignedRole)}
                </span>
            </div>

            {targetEmail && (
                <p className="truncate text-xs text-muted-foreground">Member: {targetEmail}</p>
            )}
        </div>
    );
}

function MemberRoleChangedDescription({ activity }: { activity: CompanyActivityItem }) {
    const targetDisplayName =
        getMetadataString(activity.metadata, "targetDisplayName") ?? "a team member";

    const targetEmail = getMetadataString(activity.metadata, "targetEmail");

    const previousRole = getMetadataString(activity.metadata, "previousRole");

    const newRole = getMetadataString(activity.metadata, "newRole");

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-purple-50 p-2 text-purple-700">
                    <UserCog className="size-4" />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    changed{" "}
                    <span className="font-semibold text-foreground">{targetDisplayName}</span>
                    &apos;s company role.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full border bg-muted px-2.5 py-1 font-medium">
                    {formatEnumLabel(previousRole)}
                </span>

                <ArrowRight className="size-4 text-muted-foreground" />

                <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 font-semibold text-purple-700">
                    {formatEnumLabel(newRole)}
                </span>
            </div>

            {targetEmail && (
                <p className="truncate text-xs text-muted-foreground">Member: {targetEmail}</p>
            )}
        </div>
    );
}

function MemberRemovedDescription({ activity }: { activity: CompanyActivityItem }) {
    const targetDisplayName =
        getMetadataString(activity.metadata, "targetDisplayName") ?? "a team member";

    const targetEmail = getMetadataString(activity.metadata, "targetEmail");

    const removedRole = getMetadataString(activity.metadata, "removedRole");

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-red-50 p-2 text-red-700">
                    <UserMinus className="size-4" />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    removed{" "}
                    <span className="font-semibold text-foreground">{targetDisplayName}</span> from
                    the company.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Previous role</span>

                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    {formatEnumLabel(removedRole)}
                </span>
            </div>

            {targetEmail && (
                <p className="truncate text-xs text-muted-foreground">Member: {targetEmail}</p>
            )}
        </div>
    );
}

const jobStatusActionConfiguration: Partial<
    Record<
        string,
        {
            verb: string;
            Icon: LucideIcon;
            iconClassName: string;
        }
    >
> = {
    JOB_PUBLISHED: {
        verb: "published",
        Icon: Send,
        iconClassName: "bg-emerald-50 text-emerald-700",
    },

    JOB_PAUSED: {
        verb: "paused",
        Icon: CirclePause,
        iconClassName: "bg-amber-50 text-amber-700",
    },

    JOB_ARCHIVED: {
        verb: "archived",
        Icon: Archive,
        iconClassName: "bg-slate-100 text-slate-700",
    },

    JOB_RESTORED: {
        verb: "restored",
        Icon: RotateCcw,
        iconClassName: "bg-cyan-50 text-cyan-700",
    },
};

function JobActivityDescription({ activity }: { activity: CompanyActivityItem }) {
    const jobTitle = getMetadataString(activity.metadata, "jobTitle") ?? "a company job";

    const status = getMetadataString(activity.metadata, "status");

    const previousStatus = getMetadataString(activity.metadata, "previousStatus");

    const newStatus = getMetadataString(activity.metadata, "newStatus");

    if (activity.action === "JOB_CREATED") {
        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <FilePlus2 className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        created the job{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{jobTitle}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        Initial status
                    </span>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {formatEnumLabel(status)}
                    </span>
                </div>
            </div>
        );
    }

    if (activity.action === "JOB_UPDATED") {
        const previousTitle = getMetadataString(activity.metadata, "previousTitle");

        const changedFields = getMetadataStringArray(activity.metadata, "changedFields");

        const titleChanged = previousTitle && previousTitle !== jobTitle;

        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                        <PencilLine className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        updated the job{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{jobTitle}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                {titleChanged && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full border bg-muted px-2.5 py-1 font-medium">
                            {previousTitle}
                        </span>

                        <ArrowRight className="size-4 text-muted-foreground" />

                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                            {jobTitle}
                        </span>
                    </div>
                )}

                {changedFields.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Updated fields
                        </span>

                        {changedFields.map((field) => (
                            <span
                                key={field}
                                className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                            >
                                {formatFieldLabel(field)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (activity.action === "JOB_DELETED") {
        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-red-50 p-2 text-red-700">
                        <Trash2 className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        deleted the job{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{jobTitle}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        Previous status
                    </span>

                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {formatEnumLabel(previousStatus)}
                    </span>
                </div>

                <p className="text-xs text-muted-foreground">
                    This job is no longer available in the company workspace.
                </p>
            </div>
        );
    }

    const configuration = jobStatusActionConfiguration[activity.action];

    if (configuration) {
        const { verb, Icon, iconClassName } = configuration;

        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-2 ${iconClassName}`}>
                        <Icon className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        {verb} the job{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{jobTitle}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full border bg-muted px-2.5 py-1 font-medium">
                        {formatEnumLabel(previousStatus)}
                    </span>

                    <ArrowRight className="size-4 text-muted-foreground" />

                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                        {formatEnumLabel(newStatus)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-muted p-2 text-muted-foreground">
                <BriefcaseBusiness className="size-4" />
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">{activity.actorDisplayName}</span>{" "}
                performed an action on{" "}
                <span className="font-semibold text-foreground">&ldquo;{jobTitle}&rdquo;</span>.
            </p>
        </div>
    );
}

type ActivityDescriptionProps = {
    activity: CompanyActivityItem;
};

function CompanyActivityDescription({ activity }: { activity: CompanyActivityItem }) {
    const companyName = getMetadataString(activity.metadata, "companyName") ?? "the company";

    if (activity.action === "COMPANY_CREATED") {
        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <Building2 className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        created the company{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{companyName}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Company created
                    </span>
                </div>
            </div>
        );
    }

    if (activity.action === "COMPANY_PROFILE_UPDATED") {
        const previousCompanyName = getMetadataString(activity.metadata, "previousCompanyName");

        const changedFields = getMetadataStringArray(activity.metadata, "changedFields");

        const companyNameChanged = previousCompanyName && previousCompanyName !== companyName;

        return (
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                        <PencilLine className="size-4" />
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {activity.actorDisplayName}
                        </span>{" "}
                        updated the company profile for{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{companyName}&rdquo;
                        </span>
                        .
                    </p>
                </div>

                {companyNameChanged && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full border bg-muted px-2.5 py-1 font-medium">
                            {previousCompanyName}
                        </span>

                        <ArrowRight className="size-4 text-muted-foreground" />

                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                            {companyName}
                        </span>
                    </div>
                )}

                {changedFields.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Updated fields
                        </span>

                        {changedFields.map((field) => (
                            <span
                                key={field}
                                className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                            >
                                {formatFieldLabel(field)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const isLogoAction =
        activity.action === "COMPANY_LOGO_UPDATED" || activity.action === "COMPANY_LOGO_REMOVED";

    const isRemovedAction =
        activity.action === "COMPANY_LOGO_REMOVED" || activity.action === "COMPANY_BANNER_REMOVED";

    const imageLabel = isLogoAction ? "logo" : "banner";

    const replacedExistingImage = getMetadataBoolean(activity.metadata, "replacedExistingImage");

    const Icon = isRemovedAction ? ImageOff : ImageIcon;

    const iconClassName = isRemovedAction
        ? "bg-red-50 text-red-700"
        : isLogoAction
          ? "bg-purple-50 text-purple-700"
          : "bg-cyan-50 text-cyan-700";

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-2 ${iconClassName}`}>
                    <Icon className="size-4" />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    {isRemovedAction ? "removed" : "updated"} the company {imageLabel} for{" "}
                    <span className="font-semibold text-foreground">
                        &ldquo;{companyName}&rdquo;
                    </span>
                    .
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {isRemovedAction ? (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {formatEnumLabel(imageLabel)} removed
                    </span>
                ) : (
                    <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            isLogoAction
                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                : "border-cyan-200 bg-cyan-50 text-cyan-700"
                        }`}
                    >
                        {replacedExistingImage
                            ? `Existing ${imageLabel} replaced`
                            : `New ${imageLabel} added`}
                    </span>
                )}
            </div>
        </div>
    );
}

function ActivityDescription({ activity }: ActivityDescriptionProps) {
    switch (activity.action) {
        case "APPLICATION_STATUS_CHANGED":
            return <ApplicationStatusDescription activity={activity} />;

        case "COMPANY_MEMBER_ADDED":
            return <MemberAddedDescription activity={activity} />;

        case "COMPANY_MEMBER_ROLE_CHANGED":
            return <MemberRoleChangedDescription activity={activity} />;

        case "COMPANY_MEMBER_REMOVED":
            return <MemberRemovedDescription activity={activity} />;

        case "JOB_CREATED":
        case "JOB_UPDATED":
        case "JOB_PUBLISHED":
        case "JOB_PAUSED":
        case "JOB_ARCHIVED":
        case "JOB_RESTORED":
        case "JOB_DELETED":
            return <JobActivityDescription activity={activity} />;

        case "COMPANY_CREATED":
        case "COMPANY_PROFILE_UPDATED":
        case "COMPANY_LOGO_UPDATED":
        case "COMPANY_LOGO_REMOVED":
        case "COMPANY_BANNER_UPDATED":
        case "COMPANY_BANNER_REMOVED":
            return <CompanyActivityDescription activity={activity} />;

        default:
            return (
                <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activity.actorDisplayName}
                    </span>{" "}
                    performed{" "}
                    <span className="font-medium">
                        {activity.action.toLowerCase().replaceAll("_", " ")}
                    </span>
                    .
                </p>
            );
    }
}

type ActivityItemProps = {
    activity: CompanyActivityItem;
};

function getActivityDestination(activity: CompanyActivityItem): {
    href: string;
    label: string;
} | null {
    if (activity.entityType === "APPLICATION" && activity.entityId) {
        return {
            href: `/employers/applicants/${activity.entityId}`,
            label: "View applicant",
        };
    }

    if (activity.entityType === "COMPANY") {
        return {
            href: "/employers/company",
            label: "View company",
        };
    }

    return null;
}

function ActivityItem({ activity }: ActivityItemProps) {
    const destination = getActivityDestination(activity);
    const content = (
        <div className="flex gap-4 p-5 transition hover:bg-muted/30">
            <Avatar className="size-11 shrink-0">
                <AvatarImage
                    src={activity.actorUser?.avatarUrl ?? undefined}
                    alt={activity.actorDisplayName}
                />

                <AvatarFallback>{getInitials(activity.actorDisplayName)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <ActivityDescription activity={activity} />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs text-muted-foreground">
                            {activity.actorEmail}
                        </p>

                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {formatActivityDate(activity.createdAt)}
                        </p>
                    </div>

                    {destination && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            {destination.label}
                            <ArrowRight className="size-3.5" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (destination) {
        return (
            <Link href={destination.href} className="block">
                {content}
            </Link>
        );
    }

    return content;
}

type ActivityFilterOption = {
    value: ActivityFilterValue;
    label: string;
    Icon: LucideIcon;
};

const activityFilterOptions: ActivityFilterOption[] = [
    {
        value: "ALL",
        label: "All activity",
        Icon: History,
    },
    {
        value: "APPLICATION",
        label: "Applications",
        Icon: UserRound,
    },
    {
        value: "JOB",
        label: "Jobs",
        Icon: BriefcaseBusiness,
    },
    {
        value: "COMPANY_MEMBERSHIP",
        label: "Team",
        Icon: UserCog,
    },
    {
        value: "COMPANY",
        label: "Company",
        Icon: Building2,
    },
];

type ActivityViewState = {
    companyId: string;
    filter: ActivityFilterValue;
    page: number;
};

export default function EmployerActivityPage() {
    const { activeCompanyId, activeMembership, activeCompanyRole, isInitializing } = useAuth();

    const companyId = activeCompanyId ?? "";

    const [viewState, setViewState] = useState<ActivityViewState>({
        companyId: "",
        filter: "ALL",
        page: 1,
    });

    /*
     * When the active company changes, use a clean
     * All Activity/page-one view without requiring
     * a synchronous state update inside an effect.
     */
    const activityFilter = viewState.companyId === companyId ? viewState.filter : "ALL";

    const page = viewState.companyId === companyId ? viewState.page : 1;

    const selectedEntityType = activityFilter === "ALL" ? undefined : activityFilter;

    const hasActivityAccess = canViewActivity(activeCompanyRole);

    const activityQuery = useCompanyActivity({
        companyId,
        page,
        limit: 20,

        ...(selectedEntityType && {
            entityType: selectedEntityType,
        }),

        enabled: !isInitializing && hasActivityAccess,
    });

    function handleFilterChange(filter: ActivityFilterValue) {
        setViewState({
            companyId,
            filter,
            page: 1,
        });
    }

    function handlePageChange(nextPage: number) {
        setViewState({
            companyId,
            filter: activityFilter,
            page: nextPage,
        });
    }

    const activity = activityQuery.data?.activity ?? [];

    const pagination = activityQuery.data?.pagination;

    if (isInitializing) {
        return (
            <div className="flex min-h-96 items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Loading activity...
            </div>
        );
    }

    if (!hasActivityAccess) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <Card>
                    <CardContent className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
                        <div className="mb-5 rounded-full bg-muted p-4">
                            <ShieldCheck className="size-8 text-muted-foreground" />
                        </div>

                        <h1 className="text-2xl font-bold">Company activity is restricted</h1>

                        <p className="mt-3 max-w-lg text-muted-foreground">
                            Only company owners and administrators can view the company audit trail.
                        </p>

                        <Button variant="outline" className="mt-6" asChild>
                            <Link href="/employers">Return to dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Company administration</p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight">Activity</h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Review important changes made within{" "}
                        {activeMembership?.companyName ?? "the active company"}.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void activityQuery.refetch()}
                    disabled={activityQuery.isFetching}
                >
                    <RefreshCw className={activityQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </section>

            <Card>
                <CardHeader className="flex items-start justify-between gap-4 sm:flex-row">
                    <div className="min-w-0 flex-1">
                        <CardTitle>Audit trail</CardTitle>

                        <CardDescription className="mt-1">
                            Important company actions are recorded with the responsible user and
                            timestamp.
                        </CardDescription>
                    </div>

                    <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
                        <History className="size-5" />
                    </div>
                </CardHeader>

                <CardContent>
                    <div
                        className="mb-5 flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filter company activity"
                    >
                        {activityFilterOptions.map(({ value, label, Icon }) => {
                            const isActive = activityFilter === value;

                            return (
                                <Button
                                    key={value}
                                    type="button"
                                    size="sm"
                                    variant={isActive ? "default" : "outline"}
                                    aria-pressed={isActive}
                                    onClick={() => handleFilterChange(value)}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </Button>
                            );
                        })}
                    </div>

                    {activityQuery.isLoading && (
                        <div className="flex min-h-72 items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground">
                            <LoaderCircle className="size-5 animate-spin" />
                            Loading company activity...
                        </div>
                    )}

                    {activityQuery.isError && (
                        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                            <History className="size-8 text-red-600" />

                            <h3 className="mt-4 font-semibold text-red-900">
                                Unable to load activity
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-red-700">
                                {getErrorMessage(activityQuery.error)}
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5"
                                onClick={() => void activityQuery.refetch()}
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {!activityQuery.isLoading &&
                        !activityQuery.isError &&
                        activity.length === 0 && (
                            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <div className="rounded-full bg-muted p-4">
                                    <UserRound className="size-7 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 font-semibold">
                                    {activityFilter === "ALL"
                                        ? "No activity recorded yet"
                                        : "No matching activity found"}
                                </h3>

                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                    {activityFilter === "ALL"
                                        ? "Important actions made within this company will appear here."
                                        : "No events have been recorded for this activity category."}
                                </p>
                            </div>
                        )}

                    {!activityQuery.isLoading && !activityQuery.isError && activity.length > 0 && (
                        <div className="divide-y overflow-hidden rounded-xl border">
                            {activity.map((activityItem) => (
                                <ActivityItem key={activityItem.id} activity={activityItem} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.totalItems > 0 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-5 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Page{" "}
                                <span className="font-semibold text-foreground">
                                    {pagination.page}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-foreground">
                                    {pagination.totalPages}
                                </span>
                                {" · "}
                                {pagination.totalItems} total{" "}
                                {pagination.totalItems === 1 ? "entry" : "entries"}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        !pagination.hasPreviousPage || activityQuery.isFetching
                                    }
                                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                                >
                                    <ChevronLeft />
                                    Previous
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasNextPage || activityQuery.isFetching}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Next
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
