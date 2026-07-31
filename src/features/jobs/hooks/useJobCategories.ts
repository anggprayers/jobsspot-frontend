"use client";

import { useQuery } from "@tanstack/react-query";

import { getJobCategories } from "../api/getJobCategories";

export function useJobCategories() {
    return useQuery({
        queryKey: ["job-categories"],
        queryFn: getJobCategories,
    });
}
