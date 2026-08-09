"use client";

import { Edit3, Filter, FolderKanban, Plus, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import { formatAdminDate, getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { AdminCategoryListParams, AdminJobCategory } from "../types/adminCategory";

import CategoryFormDialog from "./CategoryFormDialog";
import CategoryStatusDialog from "./CategoryStatusDialog";

type StatusFilter = NonNullable<AdminCategoryListParams["status"]>;
type SortFilter = NonNullable<AdminCategoryListParams["sort"]>;

export default function AdminCategoriesPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("ALL");
    const [sort, setSort] = useState<SortFilter>("ORDER_ASC");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminJobCategory | null>(null);
    const [statusCategory, setStatusCategory] = useState<AdminJobCategory | null>(null);
    const debouncedSearch = useDebouncedValue(search, 300);

    const params = useMemo<AdminCategoryListParams>(() => ({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        sort,
    }), [debouncedSearch, page, sort, status]);

    const categoriesQuery = useAdminCategories(params);
    const categories = categoriesQuery.data?.categories ?? [];
    const pagination = categoriesQuery.data?.pagination;

    function openCreate() {
        setEditingCategory(null);
        setFormOpen(true);
    }

    function openEdit(category: AdminJobCategory) {
        setEditingCategory(category);
        setFormOpen(true);
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-1 text-sm font-semibold text-primary">Platform taxonomy</p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Job categories</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Manage the categories employers use for job postings and job seekers use for discovery.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => void categoriesQuery.refetch()} disabled={categoriesQuery.isFetching}>
                        <RefreshCcw className={categoriesQuery.isFetching ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button type="button" onClick={openCreate}>
                        <Plus />
                        Add category
                    </Button>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Filter className="size-4 text-primary" />
                        Filters
                    </CardTitle>
                    <CardDescription>Search by category name and filter active or inactive categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
                        <div className="space-y-2">
                            <Label htmlFor="category-search" className="sr-only">Search categories</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="category-search"
                                    value={search}
                                    onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                                    placeholder="Search categories..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Select value={status} onValueChange={(value) => { setStatus(value as StatusFilter); setPage(1); }}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sort} onValueChange={(value) => { setSort(value as SortFilter); setPage(1); }}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ORDER_ASC">Display order</SelectItem>
                                <SelectItem value="NAME_ASC">Name A–Z</SelectItem>
                                <SelectItem value="NAME_DESC">Name Z–A</SelectItem>
                                <SelectItem value="NEWEST">Newest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderKanban className="size-5 text-primary" />
                        Platform categories
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `${pagination.totalItems} categor${pagination.totalItems === 1 ? "y" : "ies"} found.` : "Loading categories..."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    {categoriesQuery.isLoading && (
                        <div className="space-y-3 p-6">
                            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />)}
                        </div>
                    )}

                    {categoriesQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            {getAdminErrorMessage(categoriesQuery.error, "Unable to load job categories.")}
                        </div>
                    )}

                    {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 && (
                        <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-4 text-muted-foreground"><FolderKanban className="size-7" /></div>
                            <h2 className="mt-4 font-semibold">No categories found</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Adjust the filters or create a new category.</p>
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] text-left text-sm">
                                <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Category</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Order</th>
                                        <th className="px-5 py-3 font-semibold">Usage</th>
                                        <th className="px-5 py-3 font-semibold">Updated</th>
                                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-muted/20">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-foreground">{category.name}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">Public key: {category.slug}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${category.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                                                    {category.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium">{category.displayOrder}</td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">
                                                <p>{category.counts.jobs} job{category.counts.jobs === 1 ? "" : "s"}</p>
                                                <p className="mt-1">{category.counts.savedSearches} saved search{category.counts.savedSearches === 1 ? "" : "es"}</p>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-muted-foreground">{formatAdminDate(category.updatedAt)}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(category)}>
                                                        <Edit3 /> Edit
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={category.isActive ? "destructive" : "default"}
                                                        size="sm"
                                                        onClick={() => setStatusCategory(category)}
                                                    >
                                                        {category.isActive ? "Deactivate" : "Activate"}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between rounded-2xl border bg-card px-5 py-4 text-sm">
                    <span className="text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" disabled={!pagination.hasPreviousPage} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
                        <Button type="button" variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage((value) => value + 1)}>Next</Button>
                    </div>
                </div>
            )}

            <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editingCategory} />
            {statusCategory && (
                <CategoryStatusDialog category={statusCategory} open={Boolean(statusCategory)} onOpenChange={(open) => { if (!open) setStatusCategory(null); }} />
            )}
        </div>
    );
}
