"use client";

import Link from "next/link";
import {
    Activity,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    FileCheck2,
    FolderKanban,
    UserRoundCheck,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { usePlatformActivity } from "../../activity/hooks/usePlatformActivity";
import { formatAdminDate, formatAdminLabel, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { usePlatformDashboard } from "../hooks/usePlatformDashboard";

function StatSkeleton() {
    return <div className="h-9 w-20 animate-pulse rounded bg-muted" />;
}

export default function AdminDashboardPage() {
    const dashboardQuery = usePlatformDashboard();
    const activityQuery = usePlatformActivity({ page: 1, limit: 5 });
    const dashboard = dashboardQuery.data?.dashboard;

    const cards = [
        {
            label: "Users",
            value: dashboard?.users.total,
            detail: `${dashboard?.users.suspended ?? 0} suspended · ${dashboard?.users.newLast30Days ?? 0} new in 30 days`,
            icon: Users,
            href: "/admin/users",
        },
        {
            label: "Active users",
            value: dashboard?.users.active,
            detail: "Accounts currently allowed to use JobsSpot",
            icon: UserRoundCheck,
            href: "/admin/users",
        },
        {
            label: "Companies",
            value: dashboard?.companies.total,
            detail: `${dashboard?.companies.verified ?? 0} verified · ${dashboard?.companies.suspended ?? 0} suspended`,
            icon: Building2,
            href: "/admin/companies",
        },
        {
            label: "Jobs",
            value: dashboard?.jobs.total,
            detail: `${dashboard?.jobs.published ?? 0} currently published`,
            icon: BriefcaseBusiness,
            href: "/admin",
        },
        {
            label: "Applications",
            value: dashboard?.applications.total,
            detail: `${dashboard?.applications.newLast30Days ?? 0} submitted in 30 days`,
            icon: FileCheck2,
            href: "/admin",
        },
        {
            label: "Categories",
            value: dashboard?.categories.total,
            detail: `${dashboard?.categories.active ?? 0} active categories`,
            icon: FolderKanban,
            href: "/admin",
        },
    ];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-8">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-primary">Platform overview</p>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                            JobsSpot administration
                        </h1>

                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            Review platform health, manage user access, and keep an auditable record
                            of moderation actions.
                        </p>
                    </div>

                    <Button asChild variant="outline">
                        <Link href="/admin/activity">
                            <Activity />
                            View activity
                        </Link>
                    </Button>
                </div>
            </section>

            {dashboardQuery.isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {getAdminErrorMessage(dashboardQuery.error, "Unable to load the platform dashboard.")}
                </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <Card key={card.label} className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                            <div>
                                <CardDescription>{card.label}</CardDescription>
                                <CardTitle className="mt-2 text-3xl">
                                    {dashboardQuery.isLoading ? <StatSkeleton /> : (card.value ?? 0)}
                                </CardTitle>
                            </div>

                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                <card.icon className="size-5" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="min-h-10 text-sm leading-5 text-muted-foreground">
                                {card.detail}
                            </p>

                            {card.href !== "/admin" && (
                                <Button asChild variant="ghost" size="sm" className="px-0 text-primary hover:bg-transparent hover:text-primary">
                                    <Link href={card.href}>
                                        Review
                                        <ArrowRight />
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section>
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Recent moderation activity</CardTitle>
                            <CardDescription>
                                The newest actions recorded in the platform audit log.
                            </CardDescription>
                        </div>

                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/activity">
                                View all
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {activityQuery.isLoading && (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }, (_, index) => (
                                    <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
                                ))}
                            </div>
                        )}

                        {activityQuery.isError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {getAdminErrorMessage(activityQuery.error, "Unable to load platform activity.")}
                            </div>
                        )}

                        {!activityQuery.isLoading && !activityQuery.isError && (activityQuery.data?.activity.length ?? 0) === 0 && (
                            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                No platform moderation activity has been recorded yet.
                            </div>
                        )}

                        <div className="divide-y">
                            {activityQuery.data?.activity.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-foreground">
                                            {formatAdminLabel(item.action)}
                                        </p>
                                        <p className="mt-1 truncate text-sm text-muted-foreground">
                                            {item.actorDisplayName} · {item.actorEmail}
                                        </p>
                                    </div>
                                    <time className="shrink-0 text-xs text-muted-foreground">
                                        {formatAdminDate(item.createdAt)}
                                    </time>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </section>

            {dashboard?.generatedAt && (
                <p className="text-right text-xs text-muted-foreground">
                    Dashboard generated {formatAdminDate(dashboard.generatedAt)}
                </p>
            )}
        </div>
    );
}
