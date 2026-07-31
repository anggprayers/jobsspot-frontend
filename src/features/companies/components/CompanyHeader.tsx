import Image from "next/image";
import { BadgeCheck, BriefcaseBusiness, Building2, ExternalLink, MapPin } from "lucide-react";

import type { PublicCompany } from "../types/publicCompany";

type CompanyHeaderProps = Readonly<{
    company: PublicCompany;
}>;

function getCompanyInitials(companyName: string) {
    const words = companyName.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "CO";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

function getWebsiteLabel(websiteUrl: string) {
    try {
        const url = new URL(websiteUrl);

        return url.hostname.replace(/^www\./, "");
    } catch {
        return websiteUrl;
    }
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div
                className="relative h-52 overflow-hidden bg-slate-900 bg-cover bg-center sm:h-64"
                style={
                    company.bannerUrl
                        ? {
                              backgroundImage: `url("${company.bannerUrl}")`,
                          }
                        : undefined
                }
            >
                {!company.bannerUrl && (
                    <>
                        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950" />

                        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

                        <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[32px_32px]" />
                    </>
                )}

                {company.bannerUrl && (
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                )}
            </div>

            <div className="px-6 pb-9 sm:px-10 sm:pb-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                    <div className="relative z-10 -mt-14 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-blue-50 text-3xl font-bold text-blue-600 shadow-lg sm:-mt-16 sm:h-36 sm:w-36 sm:text-4xl">
                        {company.logoUrl ? (
                            <Image
                                src={company.logoUrl}
                                alt={`${company.name} logo`}
                                width={144}
                                height={144}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            getCompanyInitials(company.name)
                        )}
                    </div>

                    <div className="min-w-0 flex-1 sm:pt-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                {company.name}
                            </h1>

                            {company.isVerified && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700">
                                    <BadgeCheck size={17} />
                                    Verified
                                </span>
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4 text-base font-medium text-slate-600 sm:text-lg">
                            {company.industry && (
                                <span className="inline-flex items-center gap-2.5">
                                    <Building2 size={19} className="shrink-0 text-slate-400" />

                                    {company.industry}
                                </span>
                            )}

                            {company.location && (
                                <span className="inline-flex items-center gap-2.5">
                                    <MapPin size={19} className="shrink-0 text-slate-400" />

                                    {company.location}
                                </span>
                            )}

                            <span className="inline-flex items-center gap-2.5">
                                <BriefcaseBusiness size={19} className="shrink-0 text-slate-400" />
                                {company.openJobsCount}{" "}
                                {company.openJobsCount === 1 ? "open position" : "open positions"}
                            </span>

                            {company.websiteUrl && (
                                <a
                                    href={company.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    <ExternalLink size={18} />

                                    {getWebsiteLabel(company.websiteUrl)}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
