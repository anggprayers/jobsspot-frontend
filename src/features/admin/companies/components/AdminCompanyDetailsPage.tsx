"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Activity,
    ArrowLeft,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ExternalLink,
    FileCheck2,
    Mail,
    MapPin,
    RefreshCcw,
    ShieldBan,
    UserRound,
    Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
    formatAdminDate,
    formatAdminLabel,
    getAdminErrorMessage,
    getAdminInitials,
} from "../../shared/utils/adminFormatters";
import { useAdminCompany } from "../hooks/useAdminCompanies";
import CompanySuspensionDialog from "./CompanySuspensionDialog";
import CompanyVerificationDialog from "./CompanyVerificationDialog";

type AdminCompanyDetailsPageProps = {
    companyId: string;
};

export default function AdminCompanyDetailsPage({ companyId }: AdminCompanyDetailsPageProps) {
    const companyQuery = useAdminCompany(companyId);
    const company = companyQuery.data?.company;
    const [isSuspensionOpen, setIsSuspensionOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);

    if (companyQuery.isLoading) {
        return (
            <div className="mx-auto w-full max-w-7xl space-y-5">
                <div className="h-36 animate-pulse rounded-2xl bg-muted" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (companyQuery.isError || !company) {
        return (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="font-semibold">Unable to load company details</p>
                <p className="mt-2 text-sm">
                    {getAdminErrorMessage(companyQuery.error, "This company could not be retrieved.")}
                </p>
                <Button asChild variant="outline" className="mt-5">
                    <Link href="/admin/companies"><ArrowLeft /> Back to companies</Link>
                </Button>
            </div>
        );
    }

    const deleted = company.status === "DELETED";

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <Button asChild variant="ghost" className="px-0">
                <Link href="/admin/companies"><ArrowLeft /> Back to companies</Link>
            </Button>

            {company.status === "SUSPENDED" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                    <div className="flex gap-3">
                        <ShieldBan className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-semibold">Company access is suspended</p>
                            <p className="mt-1 text-sm leading-6">
                                {company.suspensionReason ?? "No suspension reason was recorded."}
                            </p>
                            {company.suspendedBy && (
                                <p className="mt-2 text-xs">
                                    Suspended by {company.suspendedBy.firstName} {company.suspendedBy.lastName}
                                    {company.suspendedAt ? ` on ${formatAdminDate(company.suspendedAt)}` : ""}.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                {company.bannerUrl && (
                    <div className="relative h-36 w-full bg-muted sm:h-48">
                        <Image src={company.bannerUrl} alt="" fill className="object-cover" />
                    </div>
                )}
                <div className="flex flex-col justify-between gap-6 p-6 lg:flex-row lg:items-start lg:p-8">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background shadow-sm">
                            {company.logoUrl ? (
                                <Image src={company.logoUrl} alt="" width={80} height={80} className="size-20 object-cover" />
                            ) : (
                                <Building2 className="size-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">{company.name}</h1>
                                {company.isVerified && <BadgeCheck className="size-6 text-blue-600" />}
                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                    company.status === "SUSPENDED"
                                        ? "border-red-200 bg-red-50 text-red-700"
                                        : company.status === "DELETED"
                                          ? "border-border bg-muted text-muted-foreground"
                                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                }`}>
                                    {company.status}
                                </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                {company.industry && <span>{company.industry}</span>}
                                {company.location && <span className="flex items-center gap-1.5"><MapPin className="size-4" />{company.location}</span>}
                                <span className="flex items-center gap-1.5"><CalendarDays className="size-4" />Joined {formatAdminDate(company.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {company.websiteUrl && (
                            <Button asChild variant="outline">
                                <a href={company.websiteUrl} target="_blank" rel="noreferrer"><ExternalLink /> Website</a>
                            </Button>
                        )}
                        {company.status === "ACTIVE" && (
                            <Button asChild variant="outline">
                                <Link href={`/companies/${company.slug}`}><ExternalLink /> Public profile</Link>
                            </Button>
                        )}
                        {!deleted && (
                            <>
                                <Button type="button" variant="outline" onClick={() => setIsVerificationOpen(true)}>
                                    <BadgeCheck /> {company.isVerified ? "Remove verification" : "Verify company"}
                                </Button>
                                <Button
                                    type="button"
                                    variant={company.status === "SUSPENDED" ? "default" : "destructive"}
                                    onClick={() => setIsSuspensionOpen(true)}
                                >
                                    {company.status === "SUSPENDED" ? <RefreshCcw /> : <ShieldBan />}
                                    {company.status === "SUSPENDED" ? "Restore company" : "Suspend company"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Active members", value: company.counts.activeMembers, icon: Users },
                    { label: "Jobs", value: company.counts.jobs.total, icon: BriefcaseBusiness },
                    { label: "Applications", value: company.counts.applications, icon: FileCheck2 },
                    { label: "Pending invitations", value: company.counts.pendingInvitations, icon: Mail },
                ].map((item) => (
                    <Card key={item.label}>
                        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                            <div>
                                <CardDescription>{item.label}</CardDescription>
                                <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                            </div>
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><item.icon className="size-5" /></div>
                        </CardHeader>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Company overview</CardTitle>
                        <CardDescription>Public profile and moderation context.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 text-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                            <p className="mt-2 whitespace-pre-wrap leading-6 text-foreground">
                                {company.description || "No company description provided."}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Company size</p><p className="mt-1">{company.companySize ?? "Not provided"}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Verification</p><p className="mt-1">{company.isVerified ? "Verified" : "Unverified"}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Company audit records</p><p className="mt-1">{company.counts.companyActivity}</p></div>
                            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Platform moderation records</p><p className="mt-1">{company.counts.platformActivity}</p></div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Job status distribution</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {Object.entries(company.counts.jobs).filter(([key]) => key !== "total").map(([key, value]) => (
                                    <div key={key} className="rounded-xl bg-muted/40 p-3">
                                        <p className="text-xs text-muted-foreground">{formatAdminLabel(key)}</p>
                                        <p className="mt-1 text-lg font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="size-5 text-primary" /> Active members</CardTitle>
                        <CardDescription>Current company roles and account state.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {company.memberships.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No active members.</div>
                        ) : (
                            <div className="space-y-3">
                                {company.memberships.map((membership) => (
                                    <div key={membership.id} className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={membership.user.avatarUrl ?? undefined} alt="" />
                                                <AvatarFallback>{getAdminInitials(membership.user.firstName, membership.user.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate font-semibold">{membership.user.firstName} {membership.user.lastName}</p>
                                                    <span className="rounded-full border bg-muted px-2 py-0.5 text-xs font-medium">{formatAdminLabel(membership.role)}</span>
                                                    {membership.user.isAdmin && <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Platform admin</span>}
                                                </div>
                                                <p className="mt-1 truncate text-sm text-muted-foreground">{membership.user.email}</p>
                                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    {!membership.user.isEmailVerified && <span>Email unverified</span>}
                                                    {membership.user.suspendedAt && <span className="text-red-600">User suspended</span>}
                                                    {membership.user.deletedAt && <span>User deleted</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/users/${membership.user.id}`}><UserRound /> View user</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /> Recent jobs</CardTitle>
                        <CardDescription>Most recently updated jobs in this company workspace.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {company.recentJobs.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No jobs have been created.</div>
                    ) : (
                        <div className="divide-y rounded-xl border">
                            {company.recentJobs.map((job) => (
                                <div key={job.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">{job.title}</p>
                                            <span className="rounded-full border bg-muted px-2 py-0.5 text-xs font-medium">{formatAdminLabel(job.status)}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{job.category.name} · {job.applicationsCount} applications · Updated {formatAdminDate(job.updatedAt)}</p>
                                    </div>
                                    {job.status === "PUBLISHED" && company.status === "ACTIVE" && (
                                        <Button asChild variant="outline" size="sm"><Link href={`/jobs/${job.slug}`}><ExternalLink /> View public job</Link></Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="size-4 text-primary" />
                Verification and suspension changes are recorded in the platform audit log.
            </div>

            {isSuspensionOpen && (
                <CompanySuspensionDialog company={company} open={isSuspensionOpen} onOpenChange={setIsSuspensionOpen} />
            )}
            {isVerificationOpen && (
                <CompanyVerificationDialog company={company} open={isVerificationOpen} onOpenChange={setIsVerificationOpen} />
            )}
        </div>
    );
}
