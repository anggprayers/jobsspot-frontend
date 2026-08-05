"use client";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    jobsSortOptions,
    type JobsSortOption,
} from "../types/jobFilters";

type JobsToolbarProps = Readonly<{
    totalItems: number;
    isLoading: boolean;
}>;

export default function JobsToolbar({
    totalItems,
    isLoading,
}: JobsToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort =
        (searchParams.get(
            "sort",
        ) as JobsSortOption | null) ?? "newest";

    function handleSortChange(
        value: JobsSortOption,
    ) {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        params.set("sort", value);
        params.set("page", "1");

        router.push(
            `${pathname}?${params.toString()}`,
        );
    }

    return (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-xl font-semibold text-slate-950">
                    Job Opportunities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {isLoading
                        ? "Loading available positions..."
                        : `${totalItems.toLocaleString(
                              "en-US",
                          )} ${
                              totalItems === 1
                                  ? "job"
                                  : "jobs"
                          } found`}
                </p>
            </div>

            <label className="flex items-center gap-2">
                <span className="hidden text-sm font-medium text-slate-500 sm:inline">
                    Sort by
                </span>

                <select
                    value={currentSort}
                    onChange={(event) =>
                        handleSortChange(
                            event.target
                                .value as JobsSortOption,
                        )
                    }
                    className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    {jobsSortOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
