"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Building2,
    CalendarDays,
    KeyRound,
    LoaderCircle,
    LogOut,
    Mail,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { logout } from "@/features/auth/api/logout";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { AuthUser } from "@/features/auth/types/auth";
import NotificationPreferencesSection from "@/features/notifications/components/NotificationPreferencesSection";

type ProfileFormProps = {
    user: AuthUser;
};

type PasswordFormState = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
}

function formatJoinedDate(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function ProfileSettingsForm({ user }: ProfileFormProps) {
    const [firstName, setFirstName] = useState(user.firstName);

    const [lastName, setLastName] = useState(user.lastName);

    const [phone, setPhone] = useState(user.phone ?? "");

    const [validationError, setValidationError] = useState("");

    const updateProfileMutation = useUpdateProfile();

    const hasChanges =
        firstName.trim() !== user.firstName ||
        lastName.trim() !== user.lastName ||
        phone.trim() !== (user.phone ?? "");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedFirstName = firstName.trim();

        const normalizedLastName = lastName.trim();

        if (normalizedFirstName.length < 2) {
            setValidationError("First name must be at least 2 characters.");

            return;
        }

        if (normalizedLastName.length < 2) {
            setValidationError("Last name must be at least 2 characters.");

            return;
        }

        setValidationError("");

        const toastId = toast.loading("Updating profile...");

        try {
            await updateProfileMutation.mutateAsync({
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                phone: phone.trim() || null,
            });

            toast.success("Profile updated successfully.", {
                id: toastId,
                description: "Your personal information has been saved.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update your profile."), {
                id: toastId,
            });
        }
    }

    return (
        <Card id="profile" className="scroll-mt-24">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserRound className="size-6" />
                    </div>

                    <div>
                        <CardTitle>Personal profile</CardTitle>

                        <CardDescription className="mt-1">
                            Update your name and contact information.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {validationError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {validationError}
                        </div>
                    )}

                    <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                            {getInitials(user.firstName, user.lastName)}
                        </div>

                        <div>
                            <p className="font-semibold">Profile photo</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Avatar uploads will be added later. Your initials are currently
                                used.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="settings-first-name" className="text-sm font-semibold">
                                First name
                            </label>

                            <Input
                                id="settings-first-name"
                                value={firstName}
                                onChange={(event) => {
                                    setFirstName(event.target.value);

                                    setValidationError("");
                                }}
                                disabled={updateProfileMutation.isPending}
                                maxLength={50}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="settings-last-name" className="text-sm font-semibold">
                                Last name
                            </label>

                            <Input
                                id="settings-last-name"
                                value={lastName}
                                onChange={(event) => {
                                    setLastName(event.target.value);

                                    setValidationError("");
                                }}
                                disabled={updateProfileMutation.isPending}
                                maxLength={50}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="settings-email" className="text-sm font-semibold">
                            Email address
                        </label>

                        <div className="relative mt-2">
                            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="settings-email"
                                value={user.email}
                                readOnly
                                disabled
                                className="pl-9"
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Email changes are not currently supported.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="settings-phone" className="text-sm font-semibold">
                            Phone number
                            <span className="ml-1 font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </label>

                        <div className="relative mt-2">
                            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="settings-phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => {
                                    setPhone(event.target.value);

                                    setValidationError("");
                                }}
                                disabled={updateProfileMutation.isPending}
                                maxLength={30}
                                placeholder="+63 912 345 6789"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end border-t pt-5">
                        <Button
                            type="submit"
                            disabled={!hasChanges || updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Save />
                            )}

                            {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function PasswordSettingsForm() {
    const router = useRouter();

    const clearSession = useAuthStore((state) => state.clearSession);

    const [form, setForm] = useState<PasswordFormState>({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [validationError, setValidationError] = useState("");

    const changePasswordMutation = useChangePassword();

    function updateField(field: keyof PasswordFormState, value: string) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));

        setValidationError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.currentPassword) {
            setValidationError("Current password is required.");

            return;
        }

        if (form.newPassword.length < 8) {
            setValidationError("New password must be at least 8 characters.");

            return;
        }

        if (form.newPassword !== form.confirmNewPassword) {
            setValidationError("New passwords do not match.");

            return;
        }

        if (form.currentPassword === form.newPassword) {
            setValidationError("New password must be different from the current password.");

            return;
        }

        setValidationError("");

        const toastId = toast.loading("Changing password...");

        try {
            const response = await changePasswordMutation.mutateAsync(form);

            toast.success(response.message, {
                id: toastId,
                description: "All active sessions have been signed out.",
            });

            clearSession();
            router.replace("/login");
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to change your password."), {
                id: toastId,
            });
        }
    }

    return (
        <Card id="security" className="scroll-mt-24">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="size-6" />
                    </div>

                    <div>
                        <CardTitle>Security</CardTitle>

                        <CardDescription className="mt-1">
                            Change your account password.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {validationError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {validationError}
                        </div>
                    )}

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                        Changing your password signs you out of every active JobsSpot session,
                        including this device.
                    </div>

                    <div>
                        <label
                            htmlFor="settings-current-password"
                            className="text-sm font-semibold"
                        >
                            Current password
                        </label>

                        <div className="relative mt-2">
                            <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="settings-current-password"
                                type="password"
                                autoComplete="current-password"
                                value={form.currentPassword}
                                onChange={(event) =>
                                    updateField("currentPassword", event.target.value)
                                }
                                disabled={changePasswordMutation.isPending}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="settings-new-password" className="text-sm font-semibold">
                            New password
                        </label>

                        <Input
                            id="settings-new-password"
                            type="password"
                            autoComplete="new-password"
                            value={form.newPassword}
                            onChange={(event) => updateField("newPassword", event.target.value)}
                            disabled={changePasswordMutation.isPending}
                            minLength={8}
                            maxLength={100}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="settings-confirm-password"
                            className="text-sm font-semibold"
                        >
                            Confirm new password
                        </label>

                        <Input
                            id="settings-confirm-password"
                            type="password"
                            autoComplete="new-password"
                            value={form.confirmNewPassword}
                            onChange={(event) =>
                                updateField("confirmNewPassword", event.target.value)
                            }
                            disabled={changePasswordMutation.isPending}
                            minLength={8}
                            maxLength={100}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end border-t pt-5">
                        <Button type="submit" disabled={changePasswordMutation.isPending}>
                            {changePasswordMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <KeyRound />
                            )}

                            {changePasswordMutation.isPending ? "Changing..." : "Change password"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function EmployerSettingsPage() {
    const router = useRouter();

    const { user, activeMembership, activeCompanyRole } = useAuth();

    const clearSession = useAuthStore((state) => state.clearSession);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!user) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                Unable to load your account settings.
            </div>
        );
    }

    async function handleLogout() {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        const toastId = toast.loading("Signing out...");

        try {
            await logout();

            toast.success("Signed out successfully.", {
                id: toastId,
            });
        } catch {
            toast.error("The server could not complete the logout request.", {
                id: toastId,
                description: "Your local session has still been cleared.",
            });
        } finally {
            clearSession();
            router.replace("/");
            router.refresh();
        }
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <div>
                <p className="text-sm font-semibold text-primary">Account management</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>

                <p className="mt-2 text-muted-foreground">
                    Manage your personal profile, password, and employer account.
                </p>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-6">
                    <ProfileSettingsForm
                        key={`${user.id}-${user.firstName}-${user.lastName}-${user.phone ?? ""}`}
                        user={user}
                    />

                    <PasswordSettingsForm />

                    <NotificationPreferencesSection
                        isEmailVerified={user.isEmailVerified}
                        context="EMPLOYER"
                    />
                </div>

                <aside className="space-y-6 xl:sticky xl:top-24">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account overview</CardTitle>

                            <CardDescription>
                                Your current employer workspace information.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                    {getInitials(user.firstName, user.lastName)}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {user.firstName} {user.lastName}
                                    </p>

                                    <p className="truncate text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-5">
                                <div className="flex gap-3">
                                    <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Active company
                                        </p>

                                        <p className="mt-1 text-sm font-semibold">
                                            {activeMembership?.companyName ?? "No active company"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Company role
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize">
                                            {activeCompanyRole
                                                ?.toLowerCase()
                                                .replaceAll("_", " ") ?? "Not assigned"}
                                        </p>
                                    </div>
                                </div>

                                {activeMembership && (
                                    <div className="flex gap-3">
                                        <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Member since
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                {formatJoinedDate(activeMembership.joinedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/employers/company">
                                    <Building2 />
                                    Manage company
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sign out</CardTitle>

                            <CardDescription>End your current JobsSpot session.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                disabled={isLoggingOut}
                                onClick={() => void handleLogout()}
                            >
                                {isLoggingOut ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <LogOut />
                                )}

                                {isLoggingOut ? "Signing out..." : "Sign out"}
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
