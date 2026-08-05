"use client";

import axios from "axios";
import {
    CheckCircle2,
    Circle,
    KeyRound,
    LoaderCircle,
    Mail,
    MailCheck,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { useSendVerificationEmail } from "@/features/auth/hooks/useEmailVerification";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseData = error.response?.data;
        const firstFieldError = responseData?.errors
            ? Object.values(responseData.errors)
                  .flat()
                  .find(Boolean)
            : undefined;

        return (
            firstFieldError ??
            responseData?.message ??
            fallback
        );
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
    {
        label: "At least 8 characters",
        test: (value: string) => value.length >= 8,
    },
    {
        label: "One uppercase letter",
        test: (value: string) => /[A-Z]/.test(value),
    },
    {
        label: "One lowercase letter",
        test: (value: string) => /[a-z]/.test(value),
    },
    {
        label: "One number",
        test: (value: string) => /[0-9]/.test(value),
    },
    {
        label: "One special character",
        test: (value: string) =>
            /[^A-Za-z0-9]/.test(value),
    },
] as const;

export default function JobSeekerSettingsPage() {
    const router = useRouter();

    const {
        user,
        clearSession,
    } = useAuth();

    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();
    const sendVerificationMutation =
        useSendVerificationEmail();

    const [firstName, setFirstName] = useState(
        () => user?.firstName ?? "",
    );
    const [lastName, setLastName] = useState(
        () => user?.lastName ?? "",
    );
    const [phone, setPhone] = useState(
        () => user?.phone ?? "",
    );

    const [currentPassword, setCurrentPassword] =
        useState("");
    const [newPassword, setNewPassword] = useState("");
    const [
        confirmNewPassword,
        setConfirmNewPassword,
    ] = useState("");

    if (!user) {
        return null;
    }

    const isProfileSubmitting =
        updateProfileMutation.isPending;
    const isPasswordSubmitting =
        changePasswordMutation.isPending;

    const passwordRequirements =
        PASSWORD_REQUIREMENTS.map((requirement) => ({
            label: requirement.label,
            isMet: requirement.test(newPassword),
        }));

    const isNewPasswordStrong =
        passwordRequirements.every(
            (requirement) => requirement.isMet,
        );

    const doNewPasswordsMatch =
        confirmNewPassword.length > 0 &&
        newPassword === confirmNewPassword;

    async function handleProfileSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (isProfileSubmitting) {
            return;
        }

        const normalizedFirstName = firstName.trim();
        const normalizedLastName = lastName.trim();
        const normalizedPhone = phone.trim();

        if (
            normalizedFirstName.length < 2 ||
            normalizedLastName.length < 2
        ) {
            toast.error(
                "First and last names must contain at least 2 characters.",
            );
            return;
        }

        const toastId = toast.loading(
            "Saving account details...",
        );

        try {
            await updateProfileMutation.mutateAsync({
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                phone:
                    normalizedPhone.length > 0
                        ? normalizedPhone
                        : null,
            });

            toast.success(
                "Account details updated.",
                {
                    id: toastId,
                    description:
                        "Your name and contact information are now up to date.",
                },
            );
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to update your account details.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    async function handlePasswordSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (isPasswordSubmitting) {
            return;
        }

        if (!isNewPasswordStrong) {
            const firstUnmetRequirement =
                passwordRequirements.find(
                    (requirement) =>
                        !requirement.isMet,
                );

            toast.error(
                "Your new password does not meet all requirements.",
                {
                    description:
                        firstUnmetRequirement?.label,
                },
            );
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error(
                "The new password must be different from your current password.",
            );
            return;
        }

        const toastId = toast.loading(
            "Changing your password...",
        );

        try {
            await changePasswordMutation.mutateAsync({
                currentPassword,
                newPassword,
                confirmNewPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            toast.success(
                "Password changed successfully.",
                {
                    id: toastId,
                    description:
                        "For your security, sign in again using your new password.",
                },
            );

            clearSession();
            router.replace(
                "/login?returnUrl=%2Faccount%2Fsettings",
            );
            router.refresh();
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to change your password.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }


    async function handleSendVerificationEmail() {
        if (
            !user ||
            user.isEmailVerified ||
            sendVerificationMutation.isPending
        ) {
            return;
        }

        const toastId = toast.loading(
            "Sending verification email...",
        );

        try {
            const response =
                await sendVerificationMutation.mutateAsync();

            toast.success(
                response.alreadyVerified
                    ? "Email already verified."
                    : "Verification email sent.",
                {
                    id: toastId,
                    description:
                        response.alreadyVerified
                            ? "Your account already has a verified email address."
                            : "Check your inbox. The single-use link expires in 30 minutes.",
                },
            );
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to send the verification email.",
                ),
                {
                    id: toastId,
                },
            );
        }
    }

    function handlePhoneChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setPhone(event.target.value);
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-sm font-semibold text-blue-600">
                    Job seeker account
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                    Settings
                </h1>

                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                    Manage your account information and
                    password.
                </p>
            </header>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <UserRound className="size-5" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-950">
                            Account information
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Keep your personal and contact
                            details accurate.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleProfileSubmit}
                    className="space-y-6 p-5 sm:p-6"
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="settings-first-name"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                First name
                            </label>

                            <input
                                id="settings-first-name"
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value,
                                    )
                                }
                                minLength={2}
                                maxLength={50}
                                autoComplete="given-name"
                                required
                                disabled={
                                    isProfileSubmitting
                                }
                                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="settings-last-name"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Last name
                            </label>

                            <input
                                id="settings-last-name"
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value,
                                    )
                                }
                                minLength={2}
                                maxLength={50}
                                autoComplete="family-name"
                                required
                                disabled={
                                    isProfileSubmitting
                                }
                                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="settings-email"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />

                                <input
                                    id="settings-email"
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    aria-readonly="true"
                                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-base text-slate-600 outline-none"
                                />
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Email changes are not available
                                from account settings.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="settings-phone"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Phone number
                                <span className="ml-1 font-normal text-slate-400">
                                    Optional
                                </span>
                            </label>

                            <input
                                id="settings-phone"
                                type="tel"
                                value={phone}
                                onChange={
                                    handlePhoneChange
                                }
                                maxLength={30}
                                autoComplete="tel"
                                placeholder="+1 555 123 4567"
                                disabled={
                                    isProfileSubmitting
                                }
                                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
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
                                <p className="text-sm font-bold text-slate-900">
                                    Email status
                                </p>

                                <p
                                    className={`mt-1 text-sm font-semibold ${
                                        user.isEmailVerified
                                            ? "text-emerald-700"
                                            : "text-amber-700"
                                    }`}
                                >
                                    {user.isEmailVerified
                                        ? "Verified"
                                        : "Not verified"}
                                </p>

                                {!user.isEmailVerified && (
                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            disabled={
                                                sendVerificationMutation.isPending
                                            }
                                            onClick={() =>
                                                void handleSendVerificationEmail()
                                            }
                                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {sendVerificationMutation.isPending ? (
                                                <LoaderCircle className="size-4 animate-spin" />
                                            ) : (
                                                <MailCheck className="size-4" />
                                            )}

                                            {sendVerificationMutation.isPending
                                                ? "Sending..."
                                                : "Send verification email"}
                                        </button>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            The newest link replaces any
                                            previous verification link and
                                            expires after 30 minutes.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <ShieldCheck className="size-4.5" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    Member since
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    {formatMemberSince(
                                        user.createdAt,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isProfileSubmitting}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isProfileSubmitting && (
                                <LoaderCircle className="size-4.5 animate-spin" />
                            )}

                            {isProfileSubmitting
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <KeyRound className="size-5" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-950">
                            Password and security
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Changing your password signs you
                            out of all active sessions.
                        </p>
                    </div>
                </div>

                {user.hasPassword ? (
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-5 p-5 sm:p-6"
                    >
                        <div>
                            <label
                                htmlFor="settings-current-password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Current password
                            </label>

                            <input
                                id="settings-current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value,
                                    )
                                }
                                autoComplete="current-password"
                                maxLength={100}
                                required
                                disabled={
                                    isPasswordSubmitting
                                }
                                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="settings-new-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    New password
                                </label>

                                <input
                                    id="settings-new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target
                                                .value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    aria-describedby="settings-password-requirements"
                                    minLength={8}
                                    maxLength={100}
                                    required
                                    disabled={
                                        isPasswordSubmitting
                                    }
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="settings-confirm-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Confirm new password
                                </label>

                                <input
                                    id="settings-confirm-password"
                                    type="password"
                                    value={
                                        confirmNewPassword
                                    }
                                    onChange={(event) =>
                                        setConfirmNewPassword(
                                            event.target
                                                .value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={100}
                                    required
                                    disabled={
                                        isPasswordSubmitting
                                    }
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                            </div>
                        </div>

                        <div
                            id="settings-password-requirements"
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                Password requirements
                            </p>

                            <ul
                                aria-live="polite"
                                className="mt-3 grid gap-2 text-sm sm:grid-cols-2"
                            >
                                {passwordRequirements.map(
                                    (requirement) => (
                                        <li
                                            key={
                                                requirement.label
                                            }
                                            className={`flex items-center gap-2 ${
                                                requirement.isMet
                                                    ? "text-emerald-700"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {requirement.isMet ? (
                                                <CheckCircle2 className="size-4 shrink-0" />
                                            ) : (
                                                <Circle className="size-4 shrink-0" />
                                            )}

                                            <span>
                                                {
                                                    requirement.label
                                                }
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>

                            {confirmNewPassword.length > 0 && (
                                <p
                                    className={`mt-3 flex items-center gap-2 border-t border-slate-200 pt-3 text-sm font-semibold ${
                                        doNewPasswordsMatch
                                            ? "text-emerald-700"
                                            : "text-red-600"
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

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Changing your password signs you
                                out of all active sessions and
                                returns you to the sign-in page.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={
                                    isPasswordSubmitting
                                }
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPasswordSubmitting && (
                                    <LoaderCircle className="size-4.5 animate-spin" />
                                )}

                                {isPasswordSubmitting
                                    ? "Changing..."
                                    : "Change password"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-5 sm:p-6">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                            This account signs in through an
                            external provider. Password changes
                            are not available from JobsSpot.
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
