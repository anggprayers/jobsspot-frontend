import { Building2 } from "lucide-react";

import type { PublicCompany } from "../types/publicCompany";

type CompanyOverviewProps = Readonly<{
    company: PublicCompany;
}>;

export default function CompanyOverview({ company }: CompanyOverviewProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Building2 size={23} />
                </div>

                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Company Overview
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        About the Company
                    </h2>
                </div>
            </div>

            {company.description ? (
                <p className="mt-7 whitespace-pre-line text-lg leading-9 text-slate-700">
                    {company.description}
                </p>
            ) : (
                <p className="mt-7 text-lg leading-9 text-slate-500">
                    This company has not added a description yet.
                </p>
            )}
        </section>
    );
}
