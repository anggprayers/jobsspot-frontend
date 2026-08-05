import type {
    LucideIcon,
} from "lucide-react";
import {
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    ClipboardList,
    Search,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";
import type {
    ReactNode,
} from "react";

type AuthAudience =
    | "job-seeker"
    | "employer";

type AuthPageShellProps = Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
    size?: "compact" | "wide";
    mode?: "account" | "security";
    audience?: AuthAudience;
}>;

type FeatureItem = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const jobSeekerFeatures: FeatureItem[] = [
    {
        icon: Search,
        title: "Discover relevant opportunities",
        description:
            "Search roles by skill, location, workplace setup, and experience level.",
    },
    {
        icon: BriefcaseBusiness,
        title: "Keep your job search organized",
        description:
            "Manage resumes, saved jobs, searches, and applications in one account.",
    },
    {
        icon: CheckCircle2,
        title: "Move forward with confidence",
        description:
            "Use verified account security and clear application tracking.",
    },
];

const employerFeatures: FeatureItem[] = [
    {
        icon: Building2,
        title: "Build a trusted company presence",
        description:
            "Manage your company profile, branding, and hiring workspace.",
    },
    {
        icon: ClipboardList,
        title: "Publish and manage opportunities",
        description:
            "Create job posts, control their status, and monitor expiration dates.",
    },
    {
        icon: Users,
        title: "Review candidates in one place",
        description:
            "Track applicants, update hiring stages, and collaborate with your team.",
    },
];

const securityFeatures: FeatureItem[] = [
    {
        icon: ShieldCheck,
        title: "Secure, single-use account links",
        description:
            "Verification and password-reset links expire automatically.",
    },
    {
        icon: CheckCircle2,
        title: "Strong password protection",
        description:
            "JobsSpot applies the same password rules in the browser and API.",
    },
    {
        icon: BriefcaseBusiness,
        title: "Return to your account quickly",
        description:
            "Recover access without losing your profile, resumes, jobs, or applications.",
    },
];

export default function AuthPageShell({
    eyebrow,
    title,
    description,
    children,
    size = "compact",
    mode = "account",
    audience = "job-seeker",
}: AuthPageShellProps) {
    const isSecurity =
        mode === "security";
    const isEmployer =
        audience === "employer";

    const features = isSecurity
        ? securityFeatures
        : isEmployer
          ? employerFeatures
          : jobSeekerFeatures;

    const sideBadge = isSecurity
        ? "Secure account recovery"
        : isEmployer
          ? "Employer workspace"
          : "Your next opportunity";

    const sideTitle = isSecurity
        ? "Your JobsSpot account, protected at every step."
        : isEmployer
          ? "Hire with clarity. Build stronger teams."
          : "Find work that moves your career forward.";

    const sideDescription = isSecurity
        ? "Simple recovery flows, expiring links, and session protection help keep your account secure."
        : isEmployer
          ? "Manage your company, publish opportunities, and move candidates through a focused hiring workflow."
          : "Create one account to discover opportunities, prepare applications, and manage your progress.";

    const footerText = isSecurity
        ? "Recovery links use short expiration times, single-use tokens, and active-session protection."
        : isEmployer
          ? "Securely manage company activity, job posts, applicants, and hiring-team access."
          : "Keep your profile, resumes, saved opportunities, and applications together.";

    const formWidth =
        size === "wide"
            ? "max-w-2xl"
            : "max-w-md";

    return (
        <main className="relative flex min-h-[calc(100vh-4.25rem)] items-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-36 size-96 rounded-full bg-blue-200/60 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-28 size-96 rounded-full bg-slate-300/60 blur-3xl"
            />

            <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/45 lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr]">
                <aside className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-12 xl:py-14">
                    <div
                        aria-hidden="true"
                        className="absolute -left-24 top-10 size-72 rounded-full bg-blue-600/25 blur-3xl"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute -bottom-28 right-0 size-80 rounded-full bg-cyan-400/15 blur-3xl"
                    />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3.5 py-2 text-sm font-semibold text-blue-200">
                            <Sparkles className="size-4" />
                            {sideBadge}
                        </div>

                        <h2 className="mt-7 max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-[2.8rem]">
                            {sideTitle}
                        </h2>

                        <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-300">
                            {sideDescription}
                        </p>

                        <div className="mt-9 space-y-5">
                            {features.map(
                                ({
                                    icon: Icon,
                                    title: featureTitle,
                                    description:
                                        featureDescription,
                                }) => (
                                    <div
                                        key={featureTitle}
                                        className="flex gap-4"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-blue-300">
                                            <Icon className="size-[18px]" />
                                        </span>

                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                {featureTitle}
                                            </h3>

                                            <p className="mt-1 max-w-md text-[13px] leading-5 text-slate-400">
                                                {featureDescription}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <p className="relative mt-10 max-w-lg text-xs leading-5 text-slate-500">
                        {footerText}
                    </p>
                </aside>

                <div className="relative flex items-center justify-center bg-white px-5 py-9 sm:px-10 sm:py-12 lg:px-14 xl:px-16">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-blue-50 blur-3xl"
                    />

                    <section
                        className={`relative w-full ${formWidth}`}
                    >
                        <div className="mb-7">
                            <p className="text-sm font-semibold text-blue-600">
                                {eyebrow}
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.15rem]">
                                {title}
                            </h1>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {description}
                            </p>
                        </div>

                        {children}
                    </section>
                </div>
            </div>
        </main>
    );
}
