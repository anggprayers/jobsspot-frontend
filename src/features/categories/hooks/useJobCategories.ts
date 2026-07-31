import { useQuery } from "@tanstack/react-query";

import { getJobCategories } from "../api/getJobCategories";

export const jobCategoriesQueryKey = ["job-categories"] as const;

export function useJobCategories() {
    return useQuery({
        queryKey: jobCategoriesQueryKey,
        queryFn: getJobCategories,
        staleTime: 5 * 60 * 1000,
    });
}
