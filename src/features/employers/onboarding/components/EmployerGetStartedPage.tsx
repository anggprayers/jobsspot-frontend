"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Check,
    FileText,
    Globe2,
    LoaderCircle,
    MapPin,
    ShieldCheck,
    Users,
} from "lucide-react";
import {
    useRef,
    useState,
    type FormEvent,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { publishAuthTabEvent } from "@/features/auth/utils/authTabSync";

import { useCreateCompany } from "../hooks/useCreateCompany";
import type {
    CreateCompanyInput,
} from "../types/companyOnboarding";

type CompanyFormState = {
    name: string;
    industry: string;
    companySize: string;
    location: string;
    websiteUrl: string;
    description: string;
};

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

const INITIAL_FORM: CompanyFormState = {
    name: "",
    industry: "",
    companySize: "",
    location: "",
    websiteUrl: "",
    description: "",
};

const COMPANY_SIZE_OPTIONS = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1,000 employees",
    "1,001-5,000 employees",
    "5,001+ employees",
] as const;

const EMPLOYER_FEATURES = [
    {
        icon: BriefcaseBusiness,
        title: "Publish opportunities",
        description:
            "Create and manage clear job listings for your company.",
    },
    {
        icon: Users,
        title: "Review applicants",
        description:
            "Keep applications, candidates, and hiring progress organized.",
    },
    {
        icon: ShieldCheck,
        title: "Manage your team",
        description:
            "Invite trusted team members and control their workspace access.",
    },
] as const;

function normalizeOptionalValue(
    value: string,
): string | undefined {
    const normalized =
        value.trim().replace(/\s+/g, " ");

    return normalized || undefined;
}

function normalizeWebsiteUrl(
    value: string,
): string | undefined {
    const normalized = value.trim();

    if (!normalized) {
        return undefined;
    }

    const valueWithProtocol =
        /^https?:\/\//i.test(normalized)
            ? normalized
            : `https://${normalized}`;

    const parsedUrl =
        new URL(valueWithProtocol);

    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        throw new Error(
            "Website URL must use http or https.",
        );
    }

    return parsedUrl.toString();
}

function buildCompanyPayload(
    form: CompanyFormState,
): CreateCompanyInput {
    const name =
        form.name
            .trim()
            .replace(/\s+/g, " ");

    if (name.length < 2) {
        throw new Error(
            "Company name must contain at least 2 characters.",
        );
    }

    if (name.length > 100) {
        throw new Error(
            "Company name cannot exceed 100 characters.",
        );
    }

    const industry =
        normalizeOptionalValue(
            form.industry,
        );

    if (
        industry &&
        industry.length > 100
    ) {
        throw new Error(
            "Industry cannot exceed 100 characters.",
        );
    }

    const companySize =
        normalizeOptionalValue(
            form.companySize,
        );

    if (
        companySize &&
        companySize.length > 50
    ) {
        throw new Error(
            "Company size cannot exceed 50 characters.",
        );
    }

    const location =
        normalizeOptionalValue(
            form.location,
        );

    if (
        location &&
        location.length > 150
    ) {
        throw new Error(
            "Location cannot exceed 150 characters.",
        );
    }

    const description =
        form.description.trim();

    if (description.length > 2000) {
        throw new Error(
            "Description cannot exceed 2,000 characters.",
        );
    }

    const websiteUrl =
        normalizeWebsiteUrl(
            form.websiteUrl,
        );

    return {
        name,
        ...(industry && {
            industry,
        }),
        ...(companySize && {
            companySize,
        }),
        ...(location && {
            location,
        }),
        ...(description && {
            description,
        }),
        ...(websiteUrl && {
            websiteUrl,
        }),
    };
}

function getErrorMessage(
    error: unknown,
): string {
    if (
        axios.isAxiosError<ApiErrorResponse>(
            error,
        )
    ) {
        const validationMessage =
            Object.values(
                error.response?.data?.errors ??
                    {},
            )
                .flat()
                .find(Boolean);

        return (
            validationMessage ??
            error.response?.data?.message ??
            "Unable to create the company workspace."
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to create the company workspace.";
}

export default function EmployerGetStartedPage() {
    const router = useRouter();
    const formSectionRef =
        useRef<HTMLElement | null>(null);

    const {
        user,
        accessToken,
    } = useAuth();

    const setSession =
        useAuthStore(
            (state) => state.setSession,
        );

    const [
        form,
        setForm,
    ] = useState<CompanyFormState>(
        INITIAL_FORM,
    );
    const [
        validationError,
        setValidationError,
    ] = useState("");

    const createCompanyMutation =
        useCreateCompany(
            accessToken ?? "",
        );

    const fullName = user
        ? `${user.firstName} ${user.lastName}`
        : "Your JobsSpot account";

    function updateField(
        field: keyof CompanyFormState,
        value: string,
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setValidationError("");
        createCompanyMutation.reset();
    }

    function openCompanyForm() {
        formSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            createCompanyMutation.isPending
        ) {
            return;
        }

        if (
            !user ||
            !accessToken
        ) {
            setValidationError(
                "Your authenticated session is unavailable. Please sign in again.",
            );

            return;
        }

        let payload: CreateCompanyInput;

        try {
            payload =
                buildCompanyPayload(form);
        } catch (error) {
            setValidationError(
                getErrorMessage(error),
            );

            return;
        }

        setValidationError("");

        const toastId = toast.loading(
            "Creating your employer workspace...",
        );

        try {
            const response =
                await createCompanyMutation.mutateAsync(
                    payload,
                );

            toast.success(
                "Company workspace created.",
                {
                    id: toastId,
                    description:
                        `${response.company.name} is ready for hiring.`,
                },
            );

            try {
                const currentUser =
                    await getCurrentUser(
                        accessToken,
                    );

                setSession(
                    currentUser.user,
                    accessToken,
                );

                publishAuthTabEvent(
                    "session-updated",
                );

                router.replace(
                    "/employers",
                );
                router.refresh();
            } catch {
                window.location.assign(
                    "/employers",
                );
            }
        } catch (error) {
            const message =
                getErrorMessage(error);

            setValidationError(message);

            toast.error(message, {
                id: toastId,
                description:
                    "Review the company details and try again.",
            });
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3"
                    >
                        <Image
                            src="/logo.png"
                            alt="JobsSpot"
                            width={42}
                            height={42}
                            className="size-10 rounded-full object-cover"
                            priority
                        />

                        <span className="text-xl font-bold tracking-tight">
                            Jobs
                            <span className="text-blue-600">
                                Spot
                            </span>
                        </span>
                    </Link>

                    <Link
                        href="/jobs"
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    >
                        <ArrowLeft className="size-4" />
                        Browse jobs
                    </Link>
                </div>
            </header>

            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-blue-50 to-transparent" />
                <div className="absolute -right-32 top-16 size-96 rounded-full bg-blue-100/60 blur-3xl" />
                <div className="absolute -left-40 bottom-0 size-96 rounded-full bg-cyan-100/50 blur-3xl" />

                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-24">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <Building2 className="size-4" />
                            Employer setup
                        </div>

                        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Build your employer workspace.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                            Create your company profile to publish
                            opportunities, review applicants, and manage
                            hiring in one organized workspace.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                type="button"
                                size="lg"
                                onClick={openCompanyForm}
                                className="min-h-12 gap-2 px-6"
                            >
                                Create your company
                                <ArrowRight className="size-4" />
                            </Button>

                            <p className="text-sm leading-6 text-slate-500">
                                Setup takes only a few minutes.
                            </p>
                        </div>

                        <div className="mt-8 inline-flex max-w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                {user
                                    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                                    : "JS"}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    Signed in as {fullName}
                                </p>

                                <p className="truncate text-xs text-slate-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {EMPLOYER_FEATURES.map(
                            (feature) => {
                                const Icon =
                                    feature.icon;

                                return (
                                    <article
                                        key={
                                            feature.title
                                        }
                                        className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6"
                                    >
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Icon className="size-6" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold">
                                                {
                                                    feature.title
                                                }
                                            </h2>

                                            <p className="mt-1.5 leading-7 text-slate-600">
                                                {
                                                    feature.description
                                                }
                                            </p>
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </div>
                </div>
            </section>

            <section
                ref={formSectionRef}
                className="scroll-mt-6"
            >
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-20">
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                            Company profile
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Create the foundation of your hiring workspace.
                        </h2>

                        <p className="mt-4 leading-7 text-slate-600">
                            Start with the essential company information.
                            You can add branding, update details, and invite
                            your hiring team after setup.
                        </p>

                        <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            {[
                                "You initially become the company owner and can transfer ownership later.",
                                "Your workspace is private until you publish jobs.",
                                "Company details can be updated later.",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                        <Check className="size-3.5" />
                                    </span>

                                    <p className="text-sm leading-6 text-slate-600">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Building2 className="size-6" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Create your company
                                    </h2>

                                    <p className="mt-1.5 leading-7 text-slate-600">
                                        Required fields are marked with an
                                        asterisk.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 px-6 py-7 sm:px-8 sm:py-8"
                        >
                            {validationError && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                                >
                                    {validationError}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="company-name"
                                    className="text-sm font-semibold text-slate-800"
                                >
                                    Company name
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <div className="relative mt-2">
                                    <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                    <Input
                                        id="company-name"
                                        name="companyName"
                                        value={form.name}
                                        onChange={(event) =>
                                            updateField(
                                                "name",
                                                event.target.value,
                                            )
                                        }
                                        disabled={
                                            createCompanyMutation.isPending
                                        }
                                        minLength={2}
                                        maxLength={100}
                                        autoComplete="organization"
                                        placeholder="Example Company"
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="company-industry"
                                        className="text-sm font-semibold text-slate-800"
                                    >
                                        Industry
                                    </label>

                                    <div className="relative mt-2">
                                        <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            id="company-industry"
                                            value={
                                                form.industry
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "industry",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={
                                                createCompanyMutation.isPending
                                            }
                                            maxLength={
                                                100
                                            }
                                            placeholder="Technology"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="company-size"
                                        className="text-sm font-semibold text-slate-800"
                                    >
                                        Company size
                                    </label>

                                    <select
                                        id="company-size"
                                        value={
                                            form.companySize
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "companySize",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        disabled={
                                            createCompanyMutation.isPending
                                        }
                                        className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">
                                            Select a size
                                        </option>

                                        {COMPANY_SIZE_OPTIONS.map(
                                            (
                                                option,
                                            ) => (
                                                <option
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                >
                                                    {
                                                        option
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="company-location"
                                        className="text-sm font-semibold text-slate-800"
                                    >
                                        Location
                                    </label>

                                    <div className="relative mt-2">
                                        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            id="company-location"
                                            value={
                                                form.location
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "location",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={
                                                createCompanyMutation.isPending
                                            }
                                            maxLength={
                                                150
                                            }
                                            placeholder="New York, NY"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="company-website"
                                        className="text-sm font-semibold text-slate-800"
                                    >
                                        Website
                                    </label>

                                    <div className="relative mt-2">
                                        <Globe2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            id="company-website"
                                            type="text"
                                            inputMode="url"
                                            value={
                                                form.websiteUrl
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "websiteUrl",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={
                                                createCompanyMutation.isPending
                                            }
                                            maxLength={
                                                500
                                            }
                                            autoComplete="url"
                                            placeholder="company.com"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="company-description"
                                    className="text-sm font-semibold text-slate-800"
                                >
                                    Company description
                                </label>

                                <div className="relative mt-2">
                                    <FileText className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" />

                                    <textarea
                                        id="company-description"
                                        value={
                                            form.description
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "description",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        disabled={
                                            createCompanyMutation.isPending
                                        }
                                        maxLength={
                                            2000
                                        }
                                        rows={6}
                                        placeholder="Briefly describe your company, what it does, and the people you hope to hire."
                                        className="flex min-h-32 w-full resize-y rounded-md border border-input bg-transparent py-3 pl-9 pr-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <p className="mt-2 text-right text-xs text-slate-500">
                                    {
                                        form
                                            .description
                                            .length
                                    }
                                    /2,000
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <p className="max-w-md text-sm leading-6 text-slate-500">
                                    By creating the company, you
                                    become its owner and can manage
                                    workspace access.
                                </p>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={
                                        createCompanyMutation.isPending
                                    }
                                    className="min-h-12 gap-2 px-6"
                                >
                                    {createCompanyMutation.isPending ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <Building2 className="size-4" />
                                    )}

                                    {createCompanyMutation.isPending
                                        ? "Creating workspace..."
                                        : "Create company"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
