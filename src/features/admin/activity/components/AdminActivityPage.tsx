"use client";

import { useState } from "react";
import { Activity, ArrowLeft, ArrowRight, RefreshCcw, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    formatAdminDate,
    formatAdminLabel,
    getAdminErrorMessage,
    getAdminInitials,
} from "../../shared/utils/adminFormatters";
import { usePlatformActivity } from "../hooks/usePlatformActivity";

type ActivityDetail = {
    label: string;
    value: string;
};

const activityMetadataLabels: Record<string, string> = {
    companyName: "Company",
    targetDisplayName: "User",
    targetEmail: "Email",
    reason: "Reason",
    previousSuspensionReason: "Previous suspension reason",
    revokedSessions: "Sessions signed out",
    activeMembers: "Members affected",
    jobs: "Jobs affected",
    jobStatusesPreserved: "Existing job records preserved",
    verified: "Verification status",
};

const hiddenActivityMetadataKeys = new Set([
    "companyId",
    "companySlug",
    "userId",
    "targetUserId",
]);

function isMetadataRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatMetadataLabel(key: string) {
    return (
        activityMetadataLabels[key] ??
        key
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/[_-]+/g, " ")
            .replace(/^./, (character) => character.toUpperCase())
    );
}

function formatMetadataValue(key: string, value: unknown): string | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (key === "verified" && typeof value === "boolean") {
        return value ? "Verified" : "Unverified";
    }

    if (key === "jobStatusesPreserved" && typeof value === "boolean") {
        return value ? "Yes — jobs and their statuses were kept" : "No";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        const simpleValues = value.filter(
            (item): item is string | number =>
                typeof item === "string" || typeof item === "number",
        );

        return simpleValues.length === value.length
            ? simpleValues.join(", ")
            : `${value.length} recorded item${value.length === 1 ? "" : "s"}`;
    }

    return null;
}

function getActivityDetails(metadata: unknown): ActivityDetail[] {
    if (!isMetadataRecord(metadata)) {
        return [];
    }

    const preferredKeys = [
        "companyName",
        "targetDisplayName",
        "targetEmail",
        "reason",
        "previousSuspensionReason",
        "revokedSessions",
        "activeMembers",
        "jobs",
        "jobStatusesPreserved",
        "verified",
    ];

    const orderedKeys = [
        ...preferredKeys.filter((key) => key in metadata),
        ...Object.keys(metadata).filter(
            (key) => !preferredKeys.includes(key) && !hiddenActivityMetadataKeys.has(key),
        ),
    ];

    return orderedKeys.flatMap((key) => {
        const value = formatMetadataValue(key, metadata[key]);

        return value === null
            ? []
            : [{ label: formatMetadataLabel(key), value }];
    });
}

export default function AdminActivityPage() {
    const [page, setPage] = useState(1);
    const [action, setAction] = useState("ALL");
    const [entityType, setEntityType] = useState("ALL");

    const activityQuery = usePlatformActivity({
        page,
        limit: 20,
        ...(action !== "ALL" && { action }),
        ...(entityType !== "ALL" && { entityType }),
    });

    const activity = activityQuery.data?.activity ?? [];
    const pagination = activityQuery.data?.pagination;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Audit trail</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                        Platform activity
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Review immutable records of moderation actions performed by platform administrators.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void activityQuery.refetch()}
                    disabled={activityQuery.isFetching}
                >
                    <RefreshCcw className={activityQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Activity filters</CardTitle>
                    <CardDescription>Filter the audit trail by action or target type.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Action</Label>
                        <Select
                            value={action}
                            onValueChange={(value) => {
                                setAction(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All actions</SelectItem>
                                <SelectItem value="USER_SUSPENDED">User suspended</SelectItem>
                                <SelectItem value="USER_RESTORED">User restored</SelectItem>
                                <SelectItem value="COMPANY_VERIFIED">Company verified</SelectItem>
                                <SelectItem value="COMPANY_UNVERIFIED">Company unverified</SelectItem>
                                <SelectItem value="COMPANY_SUSPENDED">Company suspended</SelectItem>
                                <SelectItem value="COMPANY_RESTORED">Company restored</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Entity type</Label>
                        <Select
                            value={entityType}
                            onValueChange={(value) => {
                                setEntityType(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All entity types</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="COMPANY">Company</SelectItem>
                                <SelectItem value="JOB">Job</SelectItem>
                                <SelectItem value="JOB_CATEGORY">Job category</SelectItem>
                                <SelectItem value="JOB_REPORT">Job report</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="size-5 text-primary" />
                        Moderation records
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `${pagination.totalItems} record${pagination.totalItems === 1 ? "" : "s"} found.` : "Loading records..."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {activityQuery.isLoading && (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }, (_, index) => (
                                <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    )}

                    {activityQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            {getAdminErrorMessage(activityQuery.error, "Unable to load platform activity.")}
                        </div>
                    )}

                    {!activityQuery.isLoading && !activityQuery.isError && activity.length === 0 && (
                        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                            No activity matches the selected filters.
                        </div>
                    )}

                    <div className="space-y-3">
                        {activity.map((item) => {
                            const details = getActivityDetails(item.metadata);
                            const hasActionDetails = details.length > 0;

                            return (
                                <article key={item.id} className="rounded-2xl border p-4 sm:p-5">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <Avatar className="size-10 shrink-0">
                                                <AvatarImage src={item.actorUser.avatarUrl ?? undefined} alt={item.actorDisplayName} />
                                                <AvatarFallback>
                                                    {getAdminInitials(
                                                        item.actorDisplayName.split(" ")[0] ?? "A",
                                                        item.actorDisplayName.split(" ").slice(1).join(" ") || "D",
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-foreground">
                                                        {formatAdminLabel(item.action)}
                                                    </p>
                                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                        {formatAdminLabel(item.entityType)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                                    Performed by {item.actorDisplayName} · {item.actorEmail}
                                                </p>
                                            </div>
                                        </div>

                                        <time className="shrink-0 text-xs text-muted-foreground">
                                            {formatAdminDate(item.createdAt)}
                                        </time>
                                    </div>

                                    {hasActionDetails && (
                                        <details className="mt-4 rounded-xl bg-muted/30 p-3 text-sm">
                                            <summary className="cursor-pointer font-medium text-foreground">
                                                View action details
                                            </summary>
                                            <dl className="mt-3 grid gap-3 border-t pt-3 sm:grid-cols-2">
                                                {details.map((detail) => (
                                                    <div key={`${item.id}-${detail.label}`} className="min-w-0">
                                                        <dt className="text-xs font-medium text-muted-foreground">
                                                            {detail.label}
                                                        </dt>
                                                        <dd className="mt-1 break-words text-sm text-foreground">
                                                            {detail.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </details>
                                    )}
                                </article>
                            );
                        })}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasPreviousPage || activityQuery.isFetching}
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                >
                                    <ArrowLeft />
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasNextPage || activityQuery.isFetching}
                                    onClick={() => setPage((current) => current + 1)}
                                >
                                    Next
                                    <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Platform audit records are created by backend moderation transactions.
            </div>
        </div>
    );
}
