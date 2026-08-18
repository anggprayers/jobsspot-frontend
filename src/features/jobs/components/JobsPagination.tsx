"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type JobsPaginationProps = Readonly<{
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}>;

function getVisiblePages(currentPage: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    return Array.from({ length: 5 }, (_, index) => startPage + index);
}

export default function JobsPagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
}: JobsPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages(currentPage, totalPages);

    function getPageHref(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `${pathname}?${params.toString()}`;
    }

    const navigationClassName =
        "inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700";

    return (
        <nav
            aria-label="Jobs pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
            {hasPreviousPage ? (
                <Link href={getPageHref(currentPage - 1)} className={navigationClassName}>
                    <ChevronLeft size={17} />
                    <span className="hidden sm:inline">Previous</span>
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={`${navigationClassName} pointer-events-none opacity-40`}
                >
                    <ChevronLeft size={17} />
                    <span className="hidden sm:inline">Previous</span>
                </span>
            )}

            {visiblePages.map((page) => (
                <Link
                    key={page}
                    href={getPageHref(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${
                        page === currentPage
                            ? "pointer-events-none border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                    {page}
                </Link>
            ))}

            {hasNextPage ? (
                <Link href={getPageHref(currentPage + 1)} className={navigationClassName}>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={17} />
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={`${navigationClassName} pointer-events-none opacity-40`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={17} />
                </span>
            )}
        </nav>
    );
}
