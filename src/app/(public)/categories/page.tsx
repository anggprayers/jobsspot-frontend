import type { Metadata } from "next";

import JobCategoriesPage from "@/features/categories/components/JobCategoriesPage";

export const metadata: Metadata = {
    title: "Job Categories | JobsSpot",
    description:
        "Browse active JobsSpot opportunities by job category and continue to filtered job results.",
};

export default function CategoriesPage() {
    return <JobCategoriesPage />;
}
