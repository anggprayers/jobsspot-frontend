"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Building2,
    Eye,
    Filter,
    MapPin,
    Plus,
    RefreshCcw,
    Search,
    ShieldBan,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import {
    formatAdminDate,
    getAdminErrorMessage,
    getAdminInitials,
} from "../../shared/utils/adminFormatters";
import { useAdminCompanies } from "../hooks/useAdminCompanies";
import type {
    AdminCompanyListItem,
    AdminCompanyListStatus,
    AdminCompanySort,
    AdminCompanyVerification,
} from "../types/adminCompany";
import CompanySuspensionDialog from "./CompanySuspensionDialog";
import CompanyVerificationDialog from "./CompanyVerificationDialog";

function getStatusClasses(status: AdminCompanyListItem["status"]): string {
    if (status === "SUSPENDED") {
        return "border-red-200 bg-red-50 text-red-700";
    }

    if (status === "DELETED") {
        return "border-border bg-muted text-muted-foreground";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function AdminCompaniesPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AdminCompanyListStatus>("ALL");
    const [verification, setVerification] = useState<AdminCompanyVerification>("ALL");
    const [sort, setSort] = useState<AdminCompanySort>("NEWEST");
    const [page, setPage] = useState(1);
    const [suspensionCompany, setSuspensionCompany] = useState<AdminCompanyListItem | null>(null);
    const [verificationCompany, setVerificationCompany] = useState<AdminCompanyListItem | null>(null);
    const debouncedSearch = useDebouncedValue(search, 350);

    const companiesQuery = useAdminCompanies({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        verification,
        sort,
    });

    const companies = companiesQuery.data?.companies ?? [];
    const pagination = companiesQuery.data?.pagination;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Organization moderation</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Companies</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Review company workspaces, verification, public visibility, and platform access.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/admin/companies/new"><Plus /> New company</Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void companiesQuery.refetch()}
                        disabled={companiesQuery.isFetching}
                    >
                        <RefreshCcw className={companiesQuery.isFetching ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5 text-primary" />
                        Filters
                    </CardTitle>
                    <CardDescription>
                        Find companies by name, owner, industry, location, status, or verification.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin-company-search">Search</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="admin-company-search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Company, owner, industry"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value as AdminCompanyListStatus);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                <SelectItem value="DELETED">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Verification</Label>
                        <Select
                            value={verification}
                            onValueChange={(value) => {
                                setVerification(value as AdminCompanyVerification);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All companies</SelectItem>
                                <SelectItem value="VERIFIED">Verified</SelectItem>
                                <SelectItem value="UNVERIFIED">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sort</Label>
                        <Select
                            value={sort}
                            onValueChange={(value) => {
                                setSort(value as AdminCompanySort);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEWEST">Newest first</SelectItem>
                                <SelectItem value="OLDEST">Oldest first</SelectItem>
                                <SelectItem value="NAME_ASC">Name A–Z</SelectItem>
                                <SelectItem value="NAME_DESC">Name Z–A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="size-5 text-primary" />
                        Platform companies
                    </CardTitle>
                    <CardDescription>
                        {pagination
                            ? `${pagination.totalItems} compan${pagination.totalItems === 1 ? "y" : "ies"} found.`
                            : "Loading companies..."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {companiesQuery.isLoading && (
                        <div className="space-y-3 p-6">
                            {Array.from({ length: 5 }, (_, index) => (
                                <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    )}

                    {companiesQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            {getAdminErrorMessage(companiesQuery.error, "Unable to load companies.")}
                        </div>
                    )}

                    {!companiesQuery.isLoading && !companiesQuery.isError && companies.length === 0 && (
                        <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-4 text-muted-foreground">
                                <Building2 className="size-7" />
                            </div>
                            <h2 className="mt-4 font-semibold text-foreground">No companies found</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Adjust the search or moderation filters.
                            </p>
                        </div>
                    )}

                    {companies.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1080px] text-left text-sm">
                                <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Company</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Owner</th>
                                        <th className="px-5 py-3 font-semibold">Usage</th>
                                        <th className="px-5 py-3 font-semibold">Created</th>
                                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {companies.map((company) => (
                                        <tr key={company.id} className="align-middle hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
                                                        {company.logoUrl ? (
                                                            <Image
                                                                src={company.logoUrl}
                                                                alt=""
                                                                width={44}
                                                                height={44}
                                                                className="size-11 object-cover"
                                                            />
                                                        ) : (
                                                            <Building2 className="size-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="max-w-64 truncate font-semibold text-foreground">
                                                                {company.name}
                                                            </p>
                                                            {company.isVerified && (
                                                                <BadgeCheck className="size-4 text-blue-600" aria-label="Verified" />
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex max-w-72 items-center gap-1.5 truncate text-xs text-muted-foreground">
                                                            <MapPin className="size-3.5 shrink-0" />
                                                            {company.location ?? company.industry ?? "No location provided"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(company.status)}`}>
                                                    {company.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {company.owner ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="size-8">
                                                            <AvatarImage src={company.owner.avatarUrl ?? undefined} alt="" />
                                                            <AvatarFallback>
                                                                {getAdminInitials(company.owner.firstName, company.owner.lastName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">
                                                                {company.owner.firstName} {company.owner.lastName}
                                                            </p>
                                                            <p className="max-w-52 truncate text-xs text-muted-foreground">
                                                                {company.owner.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No active owner</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">
                                                <p>{company.counts.activeMembers} members · {company.counts.jobs} jobs</p>
                                                <p className="mt-1">{company.counts.publishedJobs} published · {company.counts.invitations} invitations</p>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">
                                                {formatAdminDate(company.createdAt)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/admin/companies/${company.id}`}>
                                                            <Eye /> View
                                                        </Link>
                                                    </Button>
                                                    {company.status !== "DELETED" && (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setVerificationCompany(company)}
                                                            >
                                                                <BadgeCheck />
                                                                {company.isVerified ? "Unverify" : "Verify"}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant={company.status === "SUSPENDED" ? "outline" : "destructive"}
                                                                size="sm"
                                                                onClick={() => setSuspensionCompany(company)}
                                                            >
                                                                <ShieldBan />
                                                                {company.status === "SUSPENDED" ? "Restore" : "Suspend"}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t p-5 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasPreviousPage || companiesQuery.isFetching}
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                >
                                    <ArrowLeft /> Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasNextPage || companiesQuery.isFetching}
                                    onClick={() => setPage((current) => current + 1)}
                                >
                                    Next <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {suspensionCompany && (
                <CompanySuspensionDialog
                    company={suspensionCompany}
                    open={Boolean(suspensionCompany)}
                    onOpenChange={(open) => {
                        if (!open) setSuspensionCompany(null);
                    }}
                />
            )}

            {verificationCompany && (
                <CompanyVerificationDialog
                    company={verificationCompany}
                    open={Boolean(verificationCompany)}
                    onOpenChange={(open) => {
                        if (!open) setVerificationCompany(null);
                    }}
                />
            )}
        </div>
    );
}
