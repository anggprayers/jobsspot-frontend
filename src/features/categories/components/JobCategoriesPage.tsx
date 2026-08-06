"use client";

import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    Code2,
    GraduationCap,
    HeartPulse,
    Landmark,
    Megaphone,
    Palette,
    RefreshCw,
    ShoppingBag,
    Users,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { useJobCategories } from "@/features/categories/hooks/useJobCategories";

const categoryIcons = {
    education: GraduationCap,
    technology: Code2,
    healthcare: HeartPulse,
    marketing: Megaphone,
    design: Palette,
    finance: Landmark,
    sales: ShoppingBag,
    "human-resources": Users,
} as const;

function getCategoryIcon(slug: string) {
    return categoryIcons[slug as keyof typeof categoryIcons] ?? BriefcaseBusiness;
}

function formatJobCount(jobCount: number) {
    return `${jobCount} ${jobCount === 1 ? "open position" : "open positions"}`;
}

function CategoriesSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
            ))}
        </div>
    );
}

export default function JobCategoriesPage() {
    const { data, isLoading, isError, isFetching, refetch } = useJobCategories();
    const categories = data?.categories ?? [];

    return (
        <main className="bg-slate-50">
            <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                            Job categories
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Browse opportunities by field
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Explore active JobsSpot listings by category, then refine the results by
                            location, workplace type, experience level, and salary.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="py-14 sm:py-18">
                <Container>
                    {isLoading && <CategoriesSkeleton />}

                    {isError && (
                        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                            <p className="text-lg font-bold text-red-900">
                                Categories are temporarily unavailable
                            </p>
                            <p className="mt-2 leading-7 text-red-700">
                                We could not load the category list. Please try again.
                            </p>
                            <button
                                type="button"
                                disabled={isFetching}
                                onClick={() => void refetch()}
                                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    className={isFetching ? "size-4 animate-spin" : "size-4"}
                                />
                                {isFetching ? "Trying again..." : "Try again"}
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && categories.length === 0 && (
                        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <BookOpen className="mx-auto size-9 text-slate-400" />
                            <h2 className="mt-4 text-xl font-bold text-slate-950">
                                No categories are available yet
                            </h2>
                            <p className="mt-2 leading-7 text-slate-600">
                                Categories will appear here when they are added to JobsSpot.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && categories.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category.slug);

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/jobs?category=${encodeURIComponent(category.slug)}`}
                                        className="group flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                            <Icon className="size-6" />
                                        </div>
                                        <h2 className="mt-5 text-lg font-bold text-slate-950">
                                            {category.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {formatJobCount(category.jobCount)}
                                        </p>
                                        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-blue-600">
                                            View jobs
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}
