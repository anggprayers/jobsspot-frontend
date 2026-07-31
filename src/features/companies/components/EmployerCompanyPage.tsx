"use client";

import Link from "next/link";
import { useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    Building2,
    Globe,
    MapPin,
    Pencil,
    ShieldCheck,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { canManageCompany } from "@/features/employers/utils/employerPermissions";
import { useManagedCompany } from "../hooks/useManagedCompany";
import CompanyBannerUploader from "./CompanyBannerUploader";
import CompanyLogoUploader from "./CompanyLogoUploader";
import EditCompanyDialog from "./EditCompanyDialog";

function CompanyPageSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-52 rounded-lg bg-slate-200" />
                    <div className="mt-3 h-5 w-80 rounded-lg bg-slate-100" />
                </div>

                <div className="h-11 w-36 rounded-xl bg-slate-200" />
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-48 bg-slate-200" />

                <div className="px-6 pb-8 sm:px-8">
                    <div className="-mt-14 h-28 w-28 rounded-2xl bg-slate-300" />

                    <div className="mt-6 h-8 w-64 rounded-lg bg-slate-200" />
                    <div className="mt-3 h-5 w-40 rounded-lg bg-slate-100" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="h-72 rounded-3xl bg-slate-100" />
                <div className="h-72 rounded-3xl bg-slate-100" />
            </div>
        </div>
    );
}

function RestrictedCompanyPage() {
    return (
        <div className="mx-auto w-full max-w-4xl">
            <Card>
                <CardContent className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-5 rounded-full bg-muted p-4">
                        <ShieldCheck className="size-8 text-muted-foreground" />
                    </div>

                    <h1 className="text-2xl font-bold">Company management is restricted</h1>

                    <p className="mt-3 max-w-lg text-muted-foreground">
                        Only company owners and administrators can update company information,
                        branding, and public profile details.
                    </p>

                    <Button variant="outline" className="mt-6" asChild>
                        <Link href="/employers">Return to dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function EmployerCompanyPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { activeCompanyId, activeMembership, activeCompanyRole, accessToken, isInitializing } =
        useAuth();

    const hasCompanyManagementAccess = canManageCompany(activeCompanyRole);

    const {
        data: company,
        isLoading,
        isError,
        error,
    } = useManagedCompany({
        companyId: activeCompanyId,
        accessToken,
        enabled: !isInitializing && hasCompanyManagementAccess,
    });

    if (isInitializing) {
        return <CompanyPageSkeleton />;
    }

    if (!activeCompanyId || !activeMembership) {
        return (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
                <AlertCircle className="mx-auto text-amber-600" size={42} />

                <h1 className="mt-4 text-2xl font-semibold text-slate-950">No active company</h1>

                <p className="mt-2 text-slate-600">Select a company before managing its profile.</p>
            </div>
        );
    }

    if (!hasCompanyManagementAccess) {
        return <RestrictedCompanyPage />;
    }

    if (isLoading) {
        return <CompanyPageSkeleton />;
    }

    if (isError || !company) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <AlertCircle className="mx-auto text-red-600" size={42} />

                <h1 className="mt-4 text-2xl font-semibold text-slate-950">
                    Unable to load company
                </h1>

                <p className="mt-2 text-slate-600">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong while loading the company profile."}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                        Company Profile
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Manage how your company appears to job seekers.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    <Pencil size={18} />
                    Edit Company
                </button>
            </div>

            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {accessToken ? (
                    <CompanyBannerUploader
                        companyId={company.id}
                        companyName={company.name}
                        bannerUrl={company.bannerUrl}
                        accessToken={accessToken}
                        canEdit={hasCompanyManagementAccess}
                    />
                ) : (
                    <div className="h-44 bg-slate-200 sm:h-52">
                        {company.bannerUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={company.bannerUrl}
                                alt={`${company.name} banner`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                                No banner uploaded
                            </div>
                        )}
                    </div>
                )}

                <div className="px-6 pb-8 sm:px-8">
                    {accessToken ? (
                        <CompanyLogoUploader
                            companyId={company.id}
                            companyName={company.name}
                            logoUrl={company.logoUrl}
                            accessToken={accessToken}
                            canEdit={hasCompanyManagementAccess}
                        />
                    ) : (
                        <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-sm">
                            {company.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={company.logoUrl}
                                    alt={`${company.name} logo`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 size={42} className="text-slate-400" />
                            )}
                        </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-bold text-slate-950">{company.name}</h2>

                        {company.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                <BadgeCheck size={16} />
                                Verified
                            </span>
                        )}
                    </div>

                    {activeCompanyRole && (
                        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize text-slate-700">
                            {activeCompanyRole.toLowerCase()}
                        </span>
                    )}
                </div>
            </section>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-950">About the company</h2>

                    <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                        {company.description || "No company description added yet."}
                    </p>
                </section>

                <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">Company details</h2>

                    <div className="mt-6 space-y-5">
                        <div className="flex items-start gap-3">
                            <Globe className="mt-0.5 text-slate-400" size={20} />

                            <div>
                                <p className="text-sm text-slate-500">Website</p>

                                {company.websiteUrl ? (
                                    <a
                                        href={company.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block break-all font-medium text-blue-600 hover:underline"
                                    >
                                        {company.websiteUrl}
                                    </a>
                                ) : (
                                    <p className="mt-1 font-medium text-slate-800">Not provided</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Building2 className="mt-0.5 text-slate-400" size={20} />

                            <div>
                                <p className="text-sm text-slate-500">Industry</p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {company.industry || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Users className="mt-0.5 text-slate-400" size={20} />

                            <div>
                                <p className="text-sm text-slate-500">Company size</p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {company.companySize || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 text-slate-400" size={20} />

                            <div>
                                <p className="text-sm text-slate-500">Location</p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {company.location || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {accessToken && isEditDialogOpen && (
                <EditCompanyDialog
                    key={`${company.id}-${company.updatedAt}`}
                    isOpen
                    onClose={() => setIsEditDialogOpen(false)}
                    company={company}
                    accessToken={accessToken}
                />
            )}
        </div>
    );
}
