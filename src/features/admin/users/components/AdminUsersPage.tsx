"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    Filter,
    RefreshCcw,
    Search,
    ShieldBan,
    ShieldCheck,
    UserRoundX,
    Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import {
    formatAdminDate,
    getAdminErrorMessage,
    getAdminInitials,
} from "../../shared/utils/adminFormatters";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type {
    AdminUserAccountType,
    AdminUserListItem,
    AdminUserListStatus,
    AdminUserSort,
} from "../types/adminUser";
import UserSuspensionDialog from "./UserSuspensionDialog";

function getStatusClasses(status: AdminUserListItem["status"]): string {
    if (status === "SUSPENDED") {
        return "border-red-200 bg-red-50 text-red-700";
    }

    if (status === "DELETED") {
        return "border-border bg-muted text-muted-foreground";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function AdminUsersPage() {
    const { user: currentAdmin } = useAuth();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AdminUserListStatus>("ALL");
    const [accountType, setAccountType] = useState<AdminUserAccountType>("ALL");
    const [sort, setSort] = useState<AdminUserSort>("NEWEST");
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

    const debouncedSearch = useDebouncedValue(search, 350);

    const usersQuery = useAdminUsers({
        page,
        limit: 20,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        status,
        accountType,
        sort,
    });

    const users = usersQuery.data?.users ?? [];
    const pagination = usersQuery.data?.pagination;

    function resetPage() {
        setPage(1);
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-primary">Account moderation</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Users</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Search platform accounts, review their activity, and suspend or restore access.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void usersQuery.refetch()}
                    disabled={usersQuery.isFetching}
                >
                    <RefreshCcw className={usersQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5 text-primary" />
                        Filters
                    </CardTitle>
                    <CardDescription>
                        Narrow the user list by account state and platform role.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2 md:col-span-2 xl:col-span-1">
                        <Label htmlFor="admin-user-search">Search</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="admin-user-search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    resetPage();
                                }}
                                placeholder="Name or email"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value as AdminUserListStatus);
                                resetPage();
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                <SelectItem value="DELETED">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Account type</Label>
                        <Select
                            value={accountType}
                            onValueChange={(value) => {
                                setAccountType(value as AdminUserAccountType);
                                resetPage();
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All accounts</SelectItem>
                                <SelectItem value="ADMIN">Platform admins</SelectItem>
                                <SelectItem value="STANDARD">Standard users</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sort</Label>
                        <Select
                            value={sort}
                            onValueChange={(value) => {
                                setSort(value as AdminUserSort);
                                resetPage();
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEWEST">Newest first</SelectItem>
                                <SelectItem value="OLDEST">Oldest first</SelectItem>
                                <SelectItem value="NAME_ASC">Name A–Z</SelectItem>
                                <SelectItem value="NAME_DESC">Name Z–A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            Platform users
                        </CardTitle>
                        <CardDescription>
                            {pagination ? `${pagination.totalItems} account${pagination.totalItems === 1 ? "" : "s"} found.` : "Loading user accounts..."}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {usersQuery.isLoading && (
                        <div className="space-y-3 p-6">
                            {Array.from({ length: 6 }, (_, index) => (
                                <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    )}

                    {usersQuery.isError && (
                        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            {getAdminErrorMessage(usersQuery.error, "Unable to load platform users.")}
                        </div>
                    )}

                    {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 && (
                        <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-4 text-muted-foreground">
                                <UserRoundX className="size-7" />
                            </div>
                            <h2 className="mt-4 font-semibold text-foreground">No users found</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Adjust the search or filters and try again.
                            </p>
                        </div>
                    )}

                    {users.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] text-left text-sm">
                                <thead className="border-y bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">User</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Account</th>
                                        <th className="px-4 py-3 font-semibold">Usage</th>
                                        <th className="px-4 py-3 font-semibold">Joined</th>
                                        <th className="px-6 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => {
                                        const canModerate =
                                            !user.isAdmin &&
                                            user.id !== currentAdmin?.id &&
                                            user.status !== "DELETED";

                                        return (
                                            <tr key={user.id} className="hover:bg-muted/40">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-10">
                                                            <AvatarImage src={user.avatarUrl ?? undefined} alt={`${user.firstName} ${user.lastName}`} />
                                                            <AvatarFallback>{getAdminInitials(user.firstName, user.lastName)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-foreground">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                                            {user.isAdmin ? <ShieldCheck className="size-3.5 text-primary" /> : <Users className="size-3.5 text-muted-foreground" />}
                                                            {user.isAdmin ? "Platform admin" : "Standard user"}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            {user.isEmailVerified ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <ShieldBan className="size-3.5 text-amber-500" />}
                                                            {user.isEmailVerified ? "Email verified" : "Email unverified"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs text-muted-foreground">
                                                    <p>{user.counts.companyMemberships} companies</p>
                                                    <p>{user.counts.applications} applications · {user.counts.resumes} resumes</p>
                                                </td>
                                                <td className="px-4 py-4 text-xs text-muted-foreground">
                                                    {formatAdminDate(user.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/admin/users/${user.id}`}>
                                                                <Eye />
                                                                View
                                                            </Link>
                                                        </Button>
                                                        {canModerate && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant={user.status === "SUSPENDED" ? "default" : "destructive"}
                                                                onClick={() => setSelectedUser(user)}
                                                            >
                                                                {user.status === "SUSPENDED" ? "Restore" : "Suspend"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasPreviousPage || usersQuery.isFetching}
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                >
                                    <ArrowLeft />
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={!pagination.hasNextPage || usersQuery.isFetching}
                                    onClick={() => setPage((current) => current + 1)}
                                >
                                    Next
                                    <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedUser && (
                <UserSuspensionDialog
                    user={selectedUser}
                    open={Boolean(selectedUser)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedUser(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
