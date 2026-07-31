import type { ComponentType } from "react";

import { BriefcaseBusiness, Building2, ExternalLink, MapPin, Users } from "lucide-react";

import type { PublicCompany } from "../types/publicCompany";

type CompanyStatsProps = Readonly<{
    company: PublicCompany;
}>;

type CompanyInfoRowProps = Readonly<{
    label: string;
    value: string;
    icon: ComponentType<{
        size?: number;
        className?: string;
    }>;
    href?: string;
}>;

function CompanyInfoRow({ label, value, icon: Icon, href }: CompanyInfoRowProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={20} />
            </div>

            <div className="min-w-0 pt-0.5">
                <dt className="text-sm font-medium text-slate-500">{label}</dt>

                <dd className="mt-1 text-base font-semibold leading-7 text-slate-900">
                    {href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 break-all text-blue-600 transition-colors hover:text-blue-700"
                        >
                            {value}

                            <ExternalLink size={15} className="shrink-0" />
                        </a>
                    ) : (
                        value
                    )}
                </dd>
            </div>
        </div>
    );
}

function getWebsiteLabel(websiteUrl: string) {
    try {
        const url = new URL(websiteUrl);

        return url.hostname.replace(/^www\./, "");
    } catch {
        return websiteUrl;
    }
}

export default function CompanyStats({ company }: CompanyStatsProps) {
    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Overview</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Company Information
            </h2>

            <dl className="mt-8 space-y-6">
                <CompanyInfoRow
                    label="Industry"
                    value={company.industry ?? "Not specified"}
                    icon={Building2}
                />

                <CompanyInfoRow
                    label="Company Size"
                    value={
                        company.companySize ? `${company.companySize} employees` : "Not specified"
                    }
                    icon={Users}
                />

                <CompanyInfoRow
                    label="Location"
                    value={company.location ?? "Not specified"}
                    icon={MapPin}
                />

                <CompanyInfoRow
                    label="Open Positions"
                    value={String(company.openJobsCount)}
                    icon={BriefcaseBusiness}
                />

                {company.websiteUrl && (
                    <CompanyInfoRow
                        label="Website"
                        value={getWebsiteLabel(company.websiteUrl)}
                        icon={ExternalLink}
                        href={company.websiteUrl}
                    />
                )}
            </dl>
        </aside>
    );
}
