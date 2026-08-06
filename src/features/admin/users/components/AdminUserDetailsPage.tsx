"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    FileText,
    Mail,
    Phone,
    RotateCcw,
    SearchCheck,
    ShieldBan,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

import {
    formatAdminDate,
    formatAdminLabel,
    getAdminErrorMessage,
    getAdminInitials,
} from "../../shared/utils/adminFormatters";
import { useAdminUser } from "../hooks/useAdminUsers";
import UserSuspensionDialog from "./UserSuspensionDialog";

type AdminUserDetailsPageProps = {
    userId: string;
};

export default function AdminUserDetailsPage({ userId }: AdminUserDetailsPageProps) {
    const { user: currentAdmin } = useAuth();
    const userQuery = useAdminUser(userId);
    const [isModerationOpen, setIsModerationOpen] = useState(false);
    const user = userQuery.data?.user;

    if (userQuery.isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="h-10 w-40 animate-pulse rounded bg-muted" />
                <div className="h-56 animate-pulse rounded-2xl bg-card" />
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="h-64 animate-pulse rounded-2xl bg-card" />
                    <div className="h-64 animate-pulse rounded-2xl bg-card" />
                </div>
            </div>
        );
    }

    if (userQuery.isError || !user) {
        return (
            <div className="mx-auto w-full max-w-3xl space-y-5">
                <Button asChild variant="ghost" className="px-0">
                    <Link href="/admin/users">
                        <ArrowLeft />
                        Back to users
                    </Link>
                </Button>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {getAdminErrorMessage(userQuery.error, "Unable to load this user account.")}
                </div>
            </div>
        );
    }

    const canModerate =
        !user.isAdmin && user.id !== currentAdmin?.id && user.status !== "DELETED";

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <Button asChild variant="ghost" className="px-0 text-muted-foreground">
                <Link href="/admin/users">
                    <ArrowLeft />
                    Back to users
                </Link>
            </Button>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                    <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                        <Avatar className="size-20 shrink-0 border-4 border-muted">
                            <AvatarImage
                                src={user.avatarUrl ?? undefined}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="text-xl">
                                {getAdminInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {user.firstName} {user.lastName}
                                </h1>
                                {user.isAdmin && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        <ShieldCheck className="size-3.5" />
                                        Platform admin
                                    </span>
                                )}
                                <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                        user.status === "ACTIVE"
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : user.status === "SUSPENDED"
                                              ? "border-red-200 bg-red-50 text-red-700"
                                              : "border-border bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                                <span className="flex items-center gap-2">
                                    <Mail className="size-4" />
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="size-4" />
                                    Joined {formatAdminDate(user.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {canModerate && (
                        <Button
                            type="button"
                            variant={user.status === "SUSPENDED" ? "default" : "destructive"}
                            onClick={() => setIsModerationOpen(true)}
                        >
                            {user.status === "SUSPENDED" ? (
                                <RotateCcw />
                            ) : (
                                <ShieldBan />
                            )}
                            {user.status === "SUSPENDED" ? "Restore account" : "Suspend account"}
                        </Button>
                    )}
                </div>
            </section>

            {user.status === "SUSPENDED" && (
                <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
                    <div className="flex items-start gap-3">
                        <ShieldBan className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-semibold">This account is suspended</p>
                            <p className="mt-1 leading-6">
                                {user.suspensionReason ?? "No suspension reason was recorded."}
                            </p>
                            <p className="mt-2 text-xs text-red-700">
                                Suspended {formatAdminDate(user.suspendedAt)}
                                {user.suspendedBy
                                    ? ` by ${user.suspendedBy.firstName} ${user.suspendedBy.lastName}`
                                    : ""}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account details</CardTitle>
                            <CardDescription>Identity and verification information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">Email status</span>
                                <span className="flex items-center gap-1.5 font-medium text-foreground">
                                    {user.isEmailVerified ? (
                                        <CheckCircle2 className="size-4 text-emerald-600" />
                                    ) : (
                                        <ShieldBan className="size-4 text-amber-500" />
                                    )}
                                    {user.isEmailVerified ? "Verified" : "Unverified"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">Phone</span>
                                <span className="flex items-center gap-1.5 font-medium text-foreground">
                                    <Phone className="size-4 text-muted-foreground" />
                                    {user.phone ?? "Not provided"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">Last updated</span>
                                <span className="font-medium text-foreground">
                                    {formatAdminDate(user.updatedAt)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-muted-foreground">User ID</span>
                                <code className="max-w-52 truncate rounded bg-muted px-2 py-1 text-xs text-foreground">
                                    {user.id}
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Platform usage</CardTitle>
                            <CardDescription>Counts linked to this account.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {([
                                ["Applications", user.counts.applications, FileText],
                                ["Resumes", user.counts.resumes, UserRound],
                                ["Saved jobs", user.counts.savedJobs, BriefcaseBusiness],
                                ["Saved searches", user.counts.savedSearches, SearchCheck],
                                ["Created jobs", user.counts.createdJobs, BriefcaseBusiness],
                            ] satisfies Array<[string, number, LucideIcon]>).map(([label, value, Icon]) => (
                                <div key={String(label)} className="rounded-xl border bg-muted/30 p-4">
                                    <Icon className="size-4 text-primary" />
                                    <p className="mt-3 text-2xl font-bold text-foreground">{String(value)}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{String(label)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Company memberships</CardTitle>
                        <CardDescription>
                            Active employer workspaces connected to this user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.companyMemberships.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                This account is not an active member of any company.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {user.companyMemberships.map((membership) => (
                                    <div
                                        key={membership.id}
                                        className="flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate font-semibold text-foreground">
                                                    {membership.company.name}
                                                </p>
                                                {membership.company.isVerified && (
                                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        Verified
                                                    </span>
                                                )}
                                                {membership.company.suspendedAt && (
                                                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                                        Suspended
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {formatAdminLabel(membership.role)} · Joined {formatAdminDate(membership.joinedAt)}
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/companies/${membership.company.slug}`}>
                                                View public profile
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {isModerationOpen && (
                <UserSuspensionDialog
                    user={user}
                    open={isModerationOpen}
                    onOpenChange={setIsModerationOpen}
                />
            )}
        </div>
    );
}
