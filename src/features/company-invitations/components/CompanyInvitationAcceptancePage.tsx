"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    AlertCircle,
    ArrowRight,
    BadgeCheck,
    Building2,
    CalendarClock,
    CheckCircle2,
    LoaderCircle,
    LogOut,
    Mail,
    ShieldCheck,
    UserRoundPlus,
    XCircle,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";

import { logout } from "@/features/auth/api/logout";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { publishAuthTabEvent } from "@/features/auth/utils/authTabSync";
import {
    clearRememberedAuthReturnUrl,
    rememberAuthReturnUrl,
} from "@/features/auth/utils/authReturnUrl";

import {
    useAcceptCompanyInvitation,
    useResolvedCompanyInvitation,
} from "../hooks/useCompanyInvitationAcceptance";
import type {
    CompanyInvitationApiError,
    CompanyInvitationStatus,
    ResolvedCompanyInvitation,
} from "../types/companyInvitation";

const ROLE_LABELS = {
    OWNER: "Owner",
    ADMIN: "Administrator",
    RECRUITER: "Recruiter",
    VIEWER: "Viewer",
} as const;

const ROLE_DESCRIPTIONS = {
    OWNER: "Full company ownership and team control.",
    ADMIN: "Manage the company, jobs, applicants, and team members.",
    RECRUITER: "Manage job postings and applicants for the company.",
    VIEWER: "View employer information without making changes.",
} as const;

function formatInvitationDate(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return new Intl.DateTimeFormat(
        "en-PH",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(date);
}

function getInvitationErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<CompanyInvitationApiError>(
            error,
        )
    ) {
        if (error.response?.status === 429) {
            return "Too many invitation attempts. Please wait a few minutes and try again.";
        }

        const fieldMessage = Object.values(
            error.response?.data?.errors ?? {},
        )
            .flat()
            .find(Boolean);

        return (
            fieldMessage ??
            error.response?.data?.message ??
            "The company invitation could not be loaded."
        );
    }

    return "The company invitation could not be loaded.";
}

function getInvitationStatusContent(
    status: Exclude<
        CompanyInvitationStatus,
        "PENDING"
    >,
) {
    if (status === "ACCEPTED") {
        return {
            icon: CheckCircle2,
            iconClasses:
                "bg-emerald-100 text-emerald-700",
            eyebrow: "Invitation completed",
            title: "This invitation was already accepted",
            description:
                "The company membership connected to this link has already been processed. Sign in to open your employer workspace.",
        };
    }

    if (status === "CANCELLED") {
        return {
            icon: XCircle,
            iconClasses:
                "bg-amber-100 text-amber-700",
            eyebrow: "Invitation unavailable",
            title: "This invitation was cancelled",
            description:
                "The company withdrew this invitation. Contact the company owner or administrator when you still need access.",
        };
    }

    return {
        icon: CalendarClock,
        iconClasses:
            "bg-amber-100 text-amber-700",
        eyebrow: "Invitation expired",
        title: "This invitation has expired",
        description:
            "Invitation links are time-limited for security. Ask the company to send you a new invitation.",
    };
}

function CompanyLogo({
    invitation,
}: Readonly<{
    invitation: ResolvedCompanyInvitation;
}>) {
    if (invitation.company.logoUrl) {
        return (
            <Image
                src={
                    invitation.company.logoUrl
                }
                alt={`${invitation.company.name} logo`}
                width={72}
                height={72}
                className="size-18 rounded-2xl border border-slate-200 bg-white object-cover shadow-sm"
            />
        );
    }

    return (
        <div className="flex size-18 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 ring-1 ring-blue-200">
            <Building2 className="size-9" />
        </div>
    );
}

function InvitationPageSkeleton() {
    return (
        <div className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
            <div className="mx-auto grid w-full max-w-5xl animate-pulse gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="min-h-128 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
                    <div className="size-18 rounded-2xl bg-slate-100" />
                    <div className="mt-8 h-4 w-40 rounded bg-blue-100" />
                    <div className="mt-4 h-12 w-4/5 rounded-xl bg-slate-200" />
                    <div className="mt-4 h-5 w-full rounded bg-slate-100" />
                    <div className="mt-10 h-28 rounded-2xl bg-slate-100" />
                </div>

                <div className="min-h-96 rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 sm:p-8">
                    <div className="h-6 w-40 rounded bg-slate-200" />
                    <div className="mt-6 space-y-4">
                        <div className="h-16 rounded-xl bg-slate-100" />
                        <div className="h-16 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-blue-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InvitationUnavailable({
    title,
    description,
    variant = "error",
}: Readonly<{
    title: string;
    description: string;
    variant?: "error" | "warning";
}>) {
    const Icon =
        variant === "warning"
            ? CalendarClock
            : AlertCircle;

    const iconClasses =
        variant === "warning"
            ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700";

    return (
        <div className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <section className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                <div className="border-t-4 border-blue-600 px-6 py-9 sm:px-9 sm:py-11">
                    <div
                        className={`flex size-14 items-center justify-center rounded-2xl ${iconClasses}`}
                    >
                        <Icon className="size-7" />
                    </div>

                    <p className="mt-7 text-sm font-semibold text-blue-600">
                        Company invitation
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {title}
                    </h1>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        {description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/jobs"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Browse jobs
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function CompanyInvitationAcceptancePage() {
    const router = useRouter();
    const searchParams =
        useSearchParams();

    const token =
        searchParams.get("token")?.trim() ??
        "";

    const invitationPath = useMemo(
        () =>
            token
                ? `/invitations/accept?token=${encodeURIComponent(token)}`
                : "/invitations/accept",
        [token],
    );

    const loginHref = `/login?returnUrl=${encodeURIComponent(invitationPath)}`;
    const registerHref = `/register?returnUrl=${encodeURIComponent(invitationPath)}`;

    const {
        user,
        isAuthenticated,
        isInitializing,
        clearSession,
    } = useAuth();

    const setUser = useAuthStore(
        (state) => state.setUser,
    );
    const setActiveCompany = useAuthStore(
        (state) => state.setActiveCompany,
    );

    const invitationQuery =
        useResolvedCompanyInvitation(token);
    const acceptInvitationMutation =
        useAcceptCompanyInvitation();

    const [isSwitchingAccount, setIsSwitchingAccount] =
        useState(false);
    const [acceptanceError, setAcceptanceError] =
        useState("");
    const [invitedEmailMasked, setInvitedEmailMasked] =
        useState<string | null>(null);

    useEffect(() => {
        const invitationStatus =
            invitationQuery.data?.invitation.status;

        if (
            token &&
            invitationStatus === "PENDING"
        ) {
            rememberAuthReturnUrl(
                invitationPath,
            );

            return;
        }

        if (
            invitationStatus &&
            invitationStatus !== "PENDING"
        ) {
            clearRememberedAuthReturnUrl();
        }
    }, [
        invitationPath,
        invitationQuery.data?.invitation.status,
        token,
    ]);

    async function handleAcceptInvitation() {
        if (
            !token ||
            acceptInvitationMutation.isPending
        ) {
            return;
        }

        setAcceptanceError("");
        setInvitedEmailMasked(null);

        try {
            const response =
                await acceptInvitationMutation.mutateAsync(
                    token,
                );

            clearRememberedAuthReturnUrl();

            try {
                const currentUserResponse =
                    await getCurrentUser();

                setUser(
                    currentUserResponse.user,
                );
                setActiveCompany(
                    response.invitation.company.id,
                );

                toast.success(response.message, {
                    description: `${response.invitation.company.name} is now available in your employer workspace.`,
                });

                router.replace("/employers");
                router.refresh();
            } catch {
                toast.success(response.message, {
                    description:
                        "Refreshing your employer access now.",
                });

                window.location.assign(
                    "/employers",
                );
            }
        } catch (error) {
            if (
                axios.isAxiosError<CompanyInvitationApiError>(
                    error,
                )
            ) {
                const responseData =
                    error.response?.data;

                setInvitedEmailMasked(
                    responseData?.invitedEmailMasked ??
                        null,
                );

                setAcceptanceError(
                    getInvitationErrorMessage(
                        error,
                    ),
                );

                if (
                    responseData?.invitationStatus &&
                    responseData.invitationStatus !==
                        "PENDING"
                ) {
                    await invitationQuery.refetch();
                }

                return;
            }

            setAcceptanceError(
                "The invitation could not be accepted. Please try again.",
            );
        }
    }

    async function handleSwitchAccount() {
        if (isSwitchingAccount) {
            return;
        }

        setIsSwitchingAccount(true);
        rememberAuthReturnUrl(
            invitationPath,
        );

        try {
            await logout();
        } catch {
            // Clear the local session even when the server logout request fails.
        } finally {
            clearSession();
            publishAuthTabEvent(
                "session-cleared",
            );
            router.replace(loginHref);
            router.refresh();
        }
    }

    if (!token) {
        return (
            <InvitationUnavailable
                title="Invitation link unavailable"
                description="This page needs a valid invitation token. Open the newest invitation email from the company and use its Accept invitation button."
            />
        );
    }

    if (
        invitationQuery.isLoading ||
        isInitializing
    ) {
        return <InvitationPageSkeleton />;
    }

    if (
        invitationQuery.isError ||
        !invitationQuery.data
    ) {
        return (
            <InvitationUnavailable
                title="Unable to open this invitation"
                description={getInvitationErrorMessage(
                    invitationQuery.error,
                )}
            />
        );
    }

    const invitation =
        invitationQuery.data.invitation;

    const hasCompanyMembership =
        user?.memberships.some(
            (membership) =>
                membership.companyId ===
                invitation.company.id,
        ) ?? false;

    if (
        invitation.status !== "PENDING" ||
        !invitation.canAccept
    ) {
        const statusContent =
            getInvitationStatusContent(
                invitation.status ===
                    "PENDING"
                    ? "EXPIRED"
                    : invitation.status,
            );
        const StatusIcon =
            statusContent.icon;

        return (
            <div className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                    <div className="border-t-4 border-blue-600 px-6 py-9 sm:px-10 sm:py-12">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                            <CompanyLogo
                                invitation={
                                    invitation
                                }
                            />

                            <div className="min-w-0 flex-1">
                                <div
                                    className={`flex size-12 items-center justify-center rounded-2xl ${statusContent.iconClasses}`}
                                >
                                    <StatusIcon className="size-6" />
                                </div>

                                <p className="mt-6 text-sm font-semibold text-blue-600">
                                    {
                                        statusContent.eyebrow
                                    }
                                </p>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                                    {
                                        statusContent.title
                                    }
                                </h1>

                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    {
                                        statusContent.description
                                    }
                                </p>

                                <p className="mt-4 text-sm font-semibold text-slate-900">
                                    {
                                        invitation.company
                                            .name
                                    }
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {invitation.status ===
                                        "ACCEPTED" &&
                                    isAuthenticated &&
                                    hasCompanyMembership ? (
                                        <Link
                                            href="/employers"
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                        >
                                            Employer workspace
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/jobs"
                                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                        >
                                            Browse jobs
                                        </Link>
                                    )}

                                    <Link
                                        href="/"
                                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        Back to home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    const roleLabel =
        ROLE_LABELS[invitation.role];
    const roleDescription =
        ROLE_DESCRIPTIONS[invitation.role];

    return (
        <div className="relative overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.14),_transparent_55%)]"
            />

            <div className="relative mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/65">
                    <div className="border-t-4 border-blue-600 p-7 sm:p-10">
                        <CompanyLogo
                            invitation={invitation}
                        />

                        <p className="mt-8 text-sm font-semibold text-blue-600">
                            Company invitation
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Join {invitation.company.name}
                            on JobsSpot
                        </h1>

                        <p className="mt-5 text-base leading-8 text-slate-600">
                            {invitation.invitedBy.displayName}{" "}
                            invited you to collaborate as a{" "}
                            <span className="font-semibold text-slate-950">
                                {roleLabel}
                            </span>
                            .
                        </p>

                        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/80 p-5">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <BadgeCheck className="size-5" />
                                </span>

                                <div>
                                    <p className="font-semibold text-blue-950">
                                        {roleLabel} access
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-blue-800">
                                        {roleDescription}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <Mail className="size-4" />
                                    Invited email
                                </dt>

                                <dd className="mt-2 break-all text-sm font-semibold text-slate-950">
                                    {
                                        invitation.invitedEmailMasked
                                    }
                                </dd>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <CalendarClock className="size-4" />
                                    Expires
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-950">
                                    {formatInvitationDate(
                                        invitation.expiresAt,
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/55 sm:p-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        {isAuthenticated ? (
                            <ShieldCheck className="size-6" />
                        ) : (
                            <UserRoundPlus className="size-6" />
                        )}
                    </div>

                    <p className="mt-6 text-sm font-semibold text-blue-600">
                        Secure acceptance
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                        {isAuthenticated
                            ? "Confirm your account"
                            : "Sign in or create an account"}
                    </h2>

                    {!isAuthenticated ? (
                        <>
                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                Use the exact email address that received this invitation. JobsSpot will verify the account before adding it to the company.
                            </p>

                            <div className="mt-7 grid gap-3">
                                <Link
                                    href={loginHref}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    Sign in to continue
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href={registerHref}
                                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </>
                    ) : user ? (
                        <>
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Signed in as
                                </p>

                                <p className="mt-2 break-all font-semibold text-slate-950">
                                    {user.email}
                                </p>

                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    {user.isEmailVerified ? (
                                        <>
                                            <CheckCircle2 className="size-4 text-emerald-600" />
                                            <span className="font-medium text-emerald-700">
                                                Email verified
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="size-4 text-amber-600" />
                                            <span className="font-medium text-amber-700">
                                                Email verification required
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {!user.isEmailVerified && (
                                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                                    Verify this email address first. Use the verification banner above to send a new verification email when needed.
                                </div>
                            )}

                            {acceptanceError && (
                                <div
                                    role="alert"
                                    className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                                >
                                    <p className="font-semibold">
                                        Unable to accept invitation
                                    </p>

                                    <p className="mt-1">
                                        {acceptanceError}
                                    </p>

                                    {invitedEmailMasked && (
                                        <p className="mt-2">
                                            Invited account:{" "}
                                            <span className="font-semibold">
                                                {invitedEmailMasked}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 grid gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleAcceptInvitation()
                                    }
                                    disabled={
                                        !user.isEmailVerified ||
                                        acceptInvitationMutation.isPending ||
                                        isSwitchingAccount
                                    }
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                >
                                    {acceptInvitationMutation.isPending ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <ShieldCheck className="size-4" />
                                    )}

                                    {acceptInvitationMutation.isPending
                                        ? "Accepting invitation..."
                                        : "Accept invitation"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleSwitchAccount()
                                    }
                                    disabled={
                                        acceptInvitationMutation.isPending ||
                                        isSwitchingAccount
                                    }
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSwitchingAccount ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4" />
                                    )}

                                    {isSwitchingAccount
                                        ? "Switching account..."
                                        : "Use a different account"}
                                </button>
                            </div>
                        </>
                    ) : null}

                    <p className="mt-6 text-xs leading-5 text-slate-500">
                        Accepting creates or restores a company membership with the role shown in this invitation. Invitation links are private and single-use.
                    </p>
                </aside>
            </div>
        </div>
    );
}
