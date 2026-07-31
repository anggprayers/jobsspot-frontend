"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

import Container from "@/components/layout/Container";
import { usePublicJobs } from "@/features/jobs/hooks/usePublicJobs";

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

export default function TrustedTeams() {
    const { data, isLoading } = usePublicJobs({
        page: 1,
        limit: 12,
        sort: "newest",
    });

    const companies = Array.from(
        new Map((data?.jobs ?? []).map((job) => [job.company.id, job.company])).values(),
    ).slice(0, 6);

    if (!isLoading && companies.length === 0) {
        return null;
    }

    return (
        <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-base">
                        Growing Companies
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        Trusted by Growing Teams
                    </h2>

                    <p className="mt-5 text-lg leading-9 text-slate-600 sm:text-xl">
                        Companies are using JobsSpot to connect with the right candidates.
                    </p>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="h-20 w-64 animate-pulse rounded-2xl bg-slate-100"
                              />
                          ))
                        : companies.map((company) => (
                              <Link
                                  key={company.id}
                                  href={`/companies/${company.slug}`}
                                  className="group flex min-h-20 min-w-64 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                              >
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                      {getCompanyInitials(company.name)}
                                  </div>

                                  <div className="min-w-0">
                                      <span className="block truncate text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                                          {company.name}
                                      </span>

                                      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                          <Building2 size={15} />
                                          View company
                                      </span>
                                  </div>
                              </Link>
                          ))}
                </div>
            </Container>
        </section>
    );
}
