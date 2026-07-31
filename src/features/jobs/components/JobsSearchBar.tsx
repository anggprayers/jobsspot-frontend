"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function JobsSearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchParam = searchParams.get("search") ?? "";
    const locationParam = searchParams.get("location") ?? "";

    const [search, setSearch] = useState(() => searchParam);
    const [location, setLocation] = useState(() => locationParam);

    const debouncedSearch = useDebouncedValue(search, 500);
    const debouncedLocation = useDebouncedValue(location, 500);

    const hasMounted = useRef(false);

    function updateSearchParams(searchValue: string, locationValue: string) {
        const params = new URLSearchParams(searchParams.toString());

        const normalizedSearch = searchValue.trim();
        const normalizedLocation = locationValue.trim();

        if (normalizedSearch) {
            params.set("search", normalizedSearch);
        } else {
            params.delete("search");
        }

        if (normalizedLocation) {
            params.set("location", normalizedLocation);
        } else {
            params.delete("location");
        }

        params.set("page", "1");

        const nextQuery = params.toString();
        const currentQuery = searchParams.toString();

        if (nextQuery === currentQuery) {
            return;
        }

        router.replace(`${pathname}?${nextQuery}`, {
            scroll: false,
        });
    }

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        updateSearchParams(debouncedSearch, debouncedLocation);

        // updateSearchParams intentionally uses the latest URL parameters.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, debouncedLocation]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        updateSearchParams(search, location);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 lg:grid-cols-[1.1fr_0.9fr_auto]"
        >
            <label className="flex min-h-15 items-center gap-3 rounded-xl px-4 sm:px-5">
                <Search size={21} className="shrink-0 text-blue-600" aria-hidden="true" />

                <span className="sr-only">Search by job title, skill, or company</span>

                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Job title, skill, or company"
                    autoComplete="off"
                    className="w-full bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                />
            </label>

            <label className="flex min-h-15 items-center gap-3 border-t border-slate-200 px-4 sm:px-5 lg:border-l lg:border-t-0">
                <MapPin size={21} className="shrink-0 text-blue-600" aria-hidden="true" />

                <span className="sr-only">Search by location</span>

                <input
                    type="search"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="New York, NY or remote"
                    autoComplete="off"
                    className="w-full bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                />
            </label>

            <button
                type="submit"
                className="inline-flex min-h-15 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
                Search Jobs
            </button>
        </form>
    );
}
