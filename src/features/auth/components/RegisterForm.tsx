"use client";

import axios from "axios";
import Link from "next/link";
import {
    CheckCircle2,
    Circle,
    Eye,
    EyeOff,
    MailCheck,
} from "lucide-react";
import {
    useMemo,
    useState,
    type FormEvent,
} from "react";

import { register } from "../api/register";
import type { RegisterResponse } from "../types/auth";
import GoogleSignInButton from "./GoogleSignInButton";

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

type RegistrationFields = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialFields: RegistrationFields = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function getRegistrationErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        if (
            error.response?.status === 429
        ) {
            return "Too many registration attempts. Please wait a few minutes and try again.";
        }

        const fieldErrors =
            error.response?.data?.errors;

        if (fieldErrors) {
            const firstFieldMessage =
                Object.values(fieldErrors)
                    .flat()
                    .find(Boolean);

            if (firstFieldMessage) {
                return firstFieldMessage;
            }
        }

        return (
            error.response?.data?.message ??
            "Unable to create your account right now. Please try again."
        );
    }

    return "Unable to create your account right now. Please try again.";
}

function RequirementItem({
    passed,
    children,
}: Readonly<{
    passed: boolean;
    children: React.ReactNode;
}>) {
    const Icon = passed
        ? CheckCircle2
        : Circle;

    return (
        <li
            className={`flex items-center gap-2 text-sm ${
                passed
                    ? "text-emerald-700"
                    : "text-slate-500"
            }`}
        >
            <Icon className="size-4 shrink-0" />
            <span>{children}</span>
        </li>
    );
}

export default function RegisterForm() {
    const [
        fields,
        setFields,
    ] = useState(initialFields);
    const [
        showPassword,
        setShowPassword,
    ] = useState(false);
    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);
    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");
    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);
    const [
        registrationResult,
        setRegistrationResult,
    ] = useState<RegisterResponse | null>(
        null,
    );

    const passwordRequirements =
        useMemo(
            () => ({
                length:
                    fields.password.length >= 8,
                lowercase:
                    /[a-z]/.test(
                        fields.password,
                    ),
                uppercase:
                    /[A-Z]/.test(
                        fields.password,
                    ),
                number:
                    /[0-9]/.test(
                        fields.password,
                    ),
                special:
                    /[^A-Za-z0-9]/.test(
                        fields.password,
                    ),
                matches:
                    fields.confirmPassword
                        .length > 0 &&
                    fields.password ===
                        fields.confirmPassword,
            }),
            [
                fields.confirmPassword,
                fields.password,
            ],
        );

    const passwordIsValid =
        passwordRequirements.length &&
        passwordRequirements.lowercase &&
        passwordRequirements.uppercase &&
        passwordRequirements.number &&
        passwordRequirements.special &&
        passwordRequirements.matches;

    const formIsValid =
        fields.firstName.trim().length >= 2 &&
        fields.lastName.trim().length >= 2 &&
        fields.email.trim().length > 0 &&
        passwordIsValid;

    function updateField(
        field: keyof RegistrationFields,
        value: string,
    ) {
        setFields((currentFields) => ({
            ...currentFields,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            isSubmitting ||
            !formIsValid
        ) {
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response =
                await register({
                    firstName:
                        fields.firstName.trim(),
                    lastName:
                        fields.lastName.trim(),
                    email:
                        fields.email
                            .trim()
                            .toLowerCase(),
                    password:
                        fields.password,
                    confirmPassword:
                        fields.confirmPassword,
                });

            setRegistrationResult(response);
        } catch (error) {
            setErrorMessage(
                getRegistrationErrorMessage(
                    error,
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (registrationResult) {
        return (
            <div className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <MailCheck className="size-8" />
                </div>

                <p className="mt-6 text-sm font-semibold text-blue-600">
                    Account created
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Check your email
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                    {registrationResult.verificationEmailSent
                        ? "We sent a verification link to:"
                        : "Your account was created using:"}
                </p>

                <p className="mt-2 break-all font-semibold text-slate-950">
                    {
                        registrationResult.user
                            .email
                    }
                </p>

                <div
                    className={`mt-6 rounded-xl border px-4 py-4 text-left text-sm leading-6 ${
                        registrationResult.verificationEmailSent
                            ? "border-blue-200 bg-blue-50 text-blue-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                >
                    {registrationResult.verificationEmailSent
                        ? "Open the email and click “Verify email.” The single-use link expires after 30 minutes."
                        : "The verification email could not be sent. Sign in, open Account Settings, and request a new verification email."}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/login"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Continue to sign in
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Back to home
                    </Link>
                </div>

                <p className="mt-5 text-xs leading-5 text-slate-500">
                    Check your spam or promotions
                    folder when the email is not in
                    your inbox.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <GoogleSignInButton
                defaultRedirectPath="/jobs"
            />

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Or create an account with email
                </span>

                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                    {errorMessage}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="register-first-name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        First name
                    </label>

                    <input
                        id="register-first-name"
                        name="firstName"
                        type="text"
                        value={fields.firstName}
                        onChange={(event) =>
                            updateField(
                                "firstName",
                                event.target.value,
                            )
                        }
                        autoComplete="given-name"
                        required
                        minLength={2}
                        maxLength={50}
                        disabled={isSubmitting}
                        placeholder="Angelo"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="register-last-name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Last name
                    </label>

                    <input
                        id="register-last-name"
                        name="lastName"
                        type="text"
                        value={fields.lastName}
                        onChange={(event) =>
                            updateField(
                                "lastName",
                                event.target.value,
                            )
                        }
                        autoComplete="family-name"
                        required
                        minLength={2}
                        maxLength={50}
                        disabled={isSubmitting}
                        placeholder="Obrero"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Email address
                </label>

                <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={(event) =>
                        updateField(
                            "email",
                            event.target.value,
                        )
                    }
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    Use an inbox you can access.
                    JobsSpot will send a verification
                    link after registration.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="register-password"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            id="register-password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={fields.password}
                            onChange={(event) =>
                                updateField(
                                    "password",
                                    event.target.value,
                                )
                            }
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={100}
                            disabled={isSubmitting}
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (currentValue) =>
                                        !currentValue,
                                )
                            }
                            disabled={isSubmitting}
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed"
                        >
                            {showPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="register-confirm-password"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Confirm password
                    </label>

                    <div className="relative">
                        <input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={
                                fields.confirmPassword
                            }
                            onChange={(event) =>
                                updateField(
                                    "confirmPassword",
                                    event.target.value,
                                )
                            }
                            autoComplete="new-password"
                            required
                            maxLength={100}
                            disabled={isSubmitting}
                            placeholder="Repeat your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (currentValue) =>
                                        !currentValue,
                                )
                            }
                            disabled={isSubmitting}
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirmed password"
                                    : "Show confirmed password"
                            }
                            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                    Password requirements
                </p>

                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    <RequirementItem
                        passed={
                            passwordRequirements.length
                        }
                    >
                        At least 8 characters
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            passwordRequirements.lowercase
                        }
                    >
                        One lowercase letter
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            passwordRequirements.uppercase
                        }
                    >
                        One uppercase letter
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            passwordRequirements.number
                        }
                    >
                        One number
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            passwordRequirements.special
                        }
                    >
                        One special character
                    </RequirementItem>

                    <RequirementItem
                        passed={
                            passwordRequirements.matches
                        }
                    >
                        Passwords match
                    </RequirementItem>
                </ul>
            </div>

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    !formIsValid
                }
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isSubmitting
                    ? "Creating account..."
                    : "Create account"}
            </button>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                    Sign in
                </Link>
            </p>
            </form>
        </div>
    );
}
