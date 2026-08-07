"use client";

import axios from "axios";
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    KeyRound,
    LoaderCircle,
    Mail,
    MailCheck,
    ShieldCheck,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { useSendVerificationEmail } from "@/features/auth/hooks/useEmailVerification";
import { useDeleteAccount } from "@/features/auth/hooks/useDeleteAccount";
import NotificationPreferencesSection from "@/features/notifications/components/NotificationPreferencesSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseData = error.response?.data;
        const firstFieldError = responseData?.errors
            ? Object.values(responseData.errors).flat().find(Boolean)
            : undefined;

        return firstFieldError ?? responseData?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

function formatMemberSince(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
    { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
    { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
    { label: "One number", test: (value: string) => /[0-9]/.test(value) },
    { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export default function JobSeekerSettingsPage() {
    const router = useRouter();
    const { user, clearSession } = useAuth();
    const changePasswordMutation = useChangePassword();
    const sendVerificationMutation = useSendVerificationEmail();
    const deleteAccountMutation = useDeleteAccount();

    const [isEmailExpanded, setIsEmailExpanded] = useState(true);
    const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);
    const [isAccountManagementExpanded, setIsAccountManagementExpanded] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState("");
    const [deletePhrase, setDeletePhrase] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    if (!user) {
        return null;
    }

    const isPasswordSubmitting = changePasswordMutation.isPending;
    const passwordRequirements = PASSWORD_REQUIREMENTS.map((requirement) => ({
        label: requirement.label,
        isMet: requirement.test(newPassword),
    }));
    const isNewPasswordStrong = passwordRequirements.every((requirement) => requirement.isMet);
    const doNewPasswordsMatch =
        confirmNewPassword.length > 0 && newPassword === confirmNewPassword;

    async function handlePasswordSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isPasswordSubmitting) {
            return;
        }

        if (!isNewPasswordStrong) {
            const firstUnmetRequirement = passwordRequirements.find(
                (requirement) => !requirement.isMet,
            );

            toast.error("Your new password does not meet all requirements.", {
                description: firstUnmetRequirement?.label,
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("The new password must be different from your current password.");
            return;
        }

        const toastId = toast.loading("Changing your password...");

        try {
            await changePasswordMutation.mutateAsync({
                currentPassword,
                newPassword,
                confirmNewPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            toast.success("Password changed successfully.", {
                id: toastId,
                description: "For your security, sign in again using your new password.",
            });

            clearSession();
            router.replace("/login?returnUrl=%2Faccount%2Fsettings");
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to change your password."), {
                id: toastId,
            });
        }
    }

    async function handleSendVerificationEmail() {
        if (!user || user.isEmailVerified || sendVerificationMutation.isPending) {
            return;
        }

        const toastId = toast.loading("Sending verification email...");

        try {
            const response = await sendVerificationMutation.mutateAsync();

            toast.success(response.alreadyVerified ? "Email already verified." : "Verification email sent.", {
                id: toastId,
                description: response.alreadyVerified
                    ? "Your account already has a verified email address."
                    : "Check your inbox. The single-use link expires in 30 minutes.",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to send the verification email."), {
                id: toastId,
            });
        }
    }

    const canOpenDeleteDialog =
        deleteEmail.trim().toLowerCase() === user.email.toLowerCase() &&
        deletePhrase === "DELETE MY ACCOUNT";
    const canConfirmDeletion =
        canOpenDeleteDialog && (!user.hasPassword || deletePassword.length > 0);

    async function handleDeleteAccount() {
        if (!user || !canConfirmDeletion || deleteAccountMutation.isPending) return;

        const toastId = toast.loading("Deleting your JobsSpot account...");

        try {
            await deleteAccountMutation.mutateAsync({
                confirmationEmail: deleteEmail.trim().toLowerCase(),
                confirmationText: "DELETE MY ACCOUNT",
                ...(user.hasPassword && { currentPassword: deletePassword }),
            });

            clearSession();
            toast.success("Your JobsSpot account has been deleted.", {
                id: toastId,
                description: "Personal account data was anonymized and private candidate files were removed.",
            });
            router.replace("/");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to delete your account."), { id: toastId });
            setIsDeleteDialogOpen(false);
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-sm font-semibold text-blue-600">Your account</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                    Manage your sign-in, security, notification preferences, and JobsSpot account. Personal and professional information lives in your Profile.
                </p>
            </header>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setIsEmailExpanded((value) => !value)}
                    aria-expanded={isEmailExpanded}
                    className="flex w-full items-start gap-3 px-5 py-5 text-left sm:px-6"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <MailCheck className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-slate-950">Email & verification</h2>
                            {isEmailExpanded ? (
                                <ChevronUp className="size-4 text-slate-400" />
                            ) : (
                                <ChevronDown className="size-4 text-slate-400" />
                            )}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Review your sign-in email and verification status.
                        </p>
                    </div>
                </button>

                {isEmailExpanded && (
                    <div className="border-t border-slate-200 p-5 sm:p-6">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email address</p>
                                <p className="mt-2 break-all font-semibold text-slate-950">{user.email}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Email changes are not available from account settings.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                                            user.isEmailVerified
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {user.isEmailVerified ? (
                                            <CheckCircle2 className="size-4.5" />
                                        ) : (
                                            <Mail className="size-4.5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Email status</p>
                                        <p
                                            className={`mt-1 text-sm font-semibold ${
                                                user.isEmailVerified ? "text-emerald-700" : "text-amber-700"
                                            }`}
                                        >
                                            {user.isEmailVerified ? "Verified" : "Not verified"}
                                        </p>
                                        {!user.isEmailVerified && (
                                            <button
                                                type="button"
                                                disabled={sendVerificationMutation.isPending}
                                                onClick={() => void handleSendVerificationEmail()}
                                                className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {sendVerificationMutation.isPending && (
                                                    <LoaderCircle className="size-4 animate-spin" />
                                                )}
                                                {sendVerificationMutation.isPending
                                                    ? "Sending..."
                                                    : "Send verification email"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member since</p>
                                <p className="mt-1 font-semibold text-slate-900">{formatMemberSince(user.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sign-in method</p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {user.hasPassword ? "Email and password" : "External provider"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setIsSecurityExpanded((value) => !value)}
                    aria-expanded={isSecurityExpanded}
                    className="flex w-full items-start gap-3 px-5 py-5 text-left sm:px-6"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ShieldCheck className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-slate-950">Password & security</h2>
                            {isSecurityExpanded ? (
                                <ChevronUp className="size-4 text-slate-400" />
                            ) : (
                                <ChevronDown className="size-4 text-slate-400" />
                            )}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Update your password and protect access to your JobsSpot account.
                        </p>
                    </div>
                </button>

                {isSecurityExpanded && (
                    <div className="border-t border-slate-200">
                        {user.hasPassword ? (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6 p-5 sm:p-6">
                                <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
                                    <KeyRound className="mt-0.5 size-5 shrink-0" />
                                    <p className="text-sm leading-6">
                                        Changing your password revokes active sessions and asks you to sign in again.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="settings-current-password" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Current password
                                    </label>
                                    <input
                                        id="settings-current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                        autoComplete="current-password"
                                        maxLength={100}
                                        required
                                        disabled={isPasswordSubmitting}
                                        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="settings-new-password" className="mb-2 block text-sm font-semibold text-slate-700">
                                            New password
                                        </label>
                                        <input
                                            id="settings-new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(event) => setNewPassword(event.target.value)}
                                            autoComplete="new-password"
                                            aria-describedby="settings-password-requirements"
                                            minLength={8}
                                            maxLength={100}
                                            required
                                            disabled={isPasswordSubmitting}
                                            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="settings-confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
                                            Confirm new password
                                        </label>
                                        <input
                                            id="settings-confirm-password"
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(event) => setConfirmNewPassword(event.target.value)}
                                            autoComplete="new-password"
                                            minLength={8}
                                            maxLength={100}
                                            required
                                            disabled={isPasswordSubmitting}
                                            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        />
                                    </div>
                                </div>

                                <div id="settings-password-requirements" className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-bold text-slate-900">Password requirements</p>
                                    <ul aria-live="polite" className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                        {passwordRequirements.map((requirement) => (
                                            <li
                                                key={requirement.label}
                                                className={`flex items-center gap-2 ${
                                                    requirement.isMet ? "text-emerald-700" : "text-slate-500"
                                                }`}
                                            >
                                                {requirement.isMet ? (
                                                    <CheckCircle2 className="size-4 shrink-0" />
                                                ) : (
                                                    <Circle className="size-4 shrink-0" />
                                                )}
                                                <span>{requirement.label}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {confirmNewPassword.length > 0 && (
                                        <p
                                            className={`mt-3 flex items-center gap-2 border-t border-slate-200 pt-3 text-sm font-semibold ${
                                                doNewPasswordsMatch ? "text-emerald-700" : "text-red-600"
                                            }`}
                                        >
                                            {doNewPasswordsMatch ? (
                                                <CheckCircle2 className="size-4 shrink-0" />
                                            ) : (
                                                <Circle className="size-4 shrink-0" />
                                            )}
                                            {doNewPasswordsMatch
                                                ? "New passwords match."
                                                : "New passwords do not match."}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isPasswordSubmitting}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isPasswordSubmitting && <LoaderCircle className="size-4.5 animate-spin" />}
                                        {isPasswordSubmitting ? "Changing..." : "Change password"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-5 sm:p-6">
                                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                                    This account signs in through an external provider. Password changes are not available from JobsSpot.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <NotificationPreferencesSection
                isEmailVerified={user.isEmailVerified}
                context="JOB_SEEKER"
            />

            <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => setIsAccountManagementExpanded((value) => !value)}
                    aria-expanded={isAccountManagementExpanded}
                    className="flex w-full items-start gap-3 px-5 py-5 text-left sm:px-6"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <Trash2 className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-slate-950">Account management</h2>
                            {isAccountManagementExpanded ? (
                                <ChevronUp className="size-4 text-slate-400" />
                            ) : (
                                <ChevronDown className="size-4 text-slate-400" />
                            )}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Permanently delete and anonymize your JobsSpot account.
                        </p>
                    </div>
                </button>

                {isAccountManagementExpanded && (
                    <div className="space-y-5 border-t border-red-100 p-5 sm:p-6">
                        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
                            <TriangleAlert className="mt-0.5 size-5 shrink-0" />
                            <div className="text-sm leading-6">
                                <p className="font-bold">Account deletion cannot be undone.</p>
                                <p className="mt-1">
                                    Your profile, private resumes and cover letters, saved jobs and searches, notifications, and sign-in access will be removed. Applications you already submitted may be kept in anonymized form for hiring records.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <label htmlFor="delete-account-email" className="text-sm font-semibold text-slate-800">Confirm account email</label>
                                <Input id="delete-account-email" name="jobsspot-delete-confirm-email" type="text" inputMode="email" value={deleteEmail} disabled={deleteAccountMutation.isPending} placeholder={user.email} autoComplete="off" spellCheck={false} className="mt-2" onChange={(event) => setDeleteEmail(event.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="delete-account-phrase" className="text-sm font-semibold text-slate-800">Type DELETE MY ACCOUNT</label>
                                <Input id="delete-account-phrase" name="jobsspot-delete-confirm-phrase" value={deletePhrase} disabled={deleteAccountMutation.isPending} autoComplete="off" className="mt-2" onChange={(event) => setDeletePhrase(event.target.value)} />
                            </div>
                        </div>

                        <Button type="button" variant="destructive" disabled={!canOpenDeleteDialog || deleteAccountMutation.isPending} onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash2 />
                            Delete account permanently
                        </Button>
                    </div>
                )}
            </section>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={(nextOpen) => {
                    setIsDeleteDialogOpen(nextOpen);
                    if (!nextOpen) setDeletePassword("");
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete your JobsSpot account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This removes your private candidate data and anonymizes the account. Historical records retained by JobsSpot will no longer expose your personal profile information. If you use this account in company workspaces, that access will also be removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {user.hasPassword && (
                        <div>
                            <label htmlFor="delete-account-password" className="text-sm font-semibold text-slate-800">
                                Enter your current password to confirm
                            </label>
                            <Input
                                id="delete-account-password"
                                name="jobsspot-delete-confirm-password"
                                type="password"
                                value={deletePassword}
                                disabled={deleteAccountMutation.isPending}
                                autoComplete="off"
                                className="mt-2"
                                onChange={(event) => setDeletePassword(event.target.value)}
                            />
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteAccountMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" disabled={!canConfirmDeletion || deleteAccountMutation.isPending} onClick={(event) => { event.preventDefault(); void handleDeleteAccount(); }}>
                            {deleteAccountMutation.isPending ? "Deleting..." : "Delete account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
