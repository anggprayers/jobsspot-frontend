import type { Metadata } from "next";

import JobCategoriesPage from "@/features/categories/components/JobCategoriesPage";
import { createPublicPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPublicPageMetadata({
    title: "Job Categories",
    description:
        "Browse active JobsSpot opportunities by job category and continue to filtered job results.",
    path: "/categories",
});

export default function CategoriesPage() {
    return <JobCategoriesPage />;
}
