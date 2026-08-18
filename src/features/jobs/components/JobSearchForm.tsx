"use client";

import {
    type FormEvent,
    useState,
} from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    BriefcaseBusiness,
    MapPin,
    Search,
} from "lucide-react";

import { trackPopularSearch } from "@/features/popular-searches/api/popularSearchApi";

import AdvancedJobFilters from "./AdvancedJobFilters";

export default function JobSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? "",
    );
    const [location, setLocation] = useState(
        searchParams.get("location") ?? "",
    );

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const normalizedSearch = search.trim();
        const normalizedLocation = location.trim();
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        // Category browsing has been retired from the public search experience.
        params.delete("category");

        if (normalizedSearch) {
            params.set("search", normalizedSearch);

            void trackPopularSearch(
                normalizedSearch,
            ).catch(() => undefined);
        } else {
            params.delete("search");
        }

        if (normalizedLocation) {
            params.set(
                "location",
                normalizedLocation,
            );
        } else {
            params.delete("location");
        }

        params.set("page", "1");

        router.push(`/jobs?${params.toString()}`);
    }

    return (
        <div className="mx-auto mt-10 max-w-5xl text-left">
            <form
                onSubmit={handleSubmit}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 md:grid-cols-[1fr_1fr_auto]"
            >
                <label className="flex min-h-16 items-center gap-3 rounded-xl px-5">
                    <Search
                        className="shrink-0 text-slate-400"
                        size={21}
                    />

                    <span className="sr-only">
                        Job title or keyword
                    </span>

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Job title, skill, or keyword"
                        className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                    />
                </label>

                <label className="flex min-h-16 items-center gap-3 border-t border-slate-200 px-5 md:border-l md:border-t-0">
                    <MapPin
                        className="shrink-0 text-slate-400"
                        size={21}
                    />

                    <span className="sr-only">
                        Location
                    </span>

                    <input
                        type="search"
                        value={location}
                        onChange={(event) =>
                            setLocation(
                                event.target.value,
                            )
                        }
                        placeholder="City, state, or remote"
                        className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                    />
                </label>

                <button
                    type="submit"
                    className="inline-flex min-h-16 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                    <BriefcaseBusiness size={19} />
                    Find Jobs
                </button>
            </form>

            <AdvancedJobFilters />
        </div>
    );
}
