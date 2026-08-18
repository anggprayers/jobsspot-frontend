"use client";

import Link from "next/link";
import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    CheckCircle2,
    FileText,
    Search,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    useApplications,
    useApplicationsSummary,
} from "@/features/applications/hooks/useApplications";
import {
    formatApplicationDate,
    formatApplicationStatus,
    getApplicationStatusClasses,
} from "@/features/applications/utils/applicationFormatters";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useResumes } from "@/features/resumes/hooks/useResumes";
import { useSavedJobs } from "@/features/saved-jobs/hooks/useSavedJobs";

function DashboardStat({
    label,
    value,
    description,
    icon: Icon,
}: Readonly<{
    label: string;
    value: string;
    description: string;
    icon: typeof BriefcaseBusiness;
}>) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription>{label}</CardDescription>
                        <CardTitle className="mt-1 text-3xl">{value}</CardTitle>
                    </div>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="size-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-6 text-slate-500">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function JobSeekerDashboardPage() {
    const { user } = useAuth();
    const summaryQuery = useApplicationsSummary();
    const recentApplicationsQuery = useApplications({ page: 1, limit: 3 });
    const resumesQuery = useResumes();
    const savedJobsQuery = useSavedJobs({ page: 1, limit: 1 });

    const summary = summaryQuery.data?.summary;
    const recentApplications = recentApplicationsQuery.data?.applications ?? [];
    const resumes = resumesQuery.data?.resumes ?? [];
    const savedJobsCount = savedJobsQuery.data?.pagination.totalItems ?? 0;
    const defaultResume = resumes.find((resume) => resume.isDefault) ?? null;

    const activeApplications = summary
        ? summary.submitted +
          summary.underReview +
          summary.shortlisted +
          summary.interviews +
          summary.offered
        : 0;

    function formatValue(value: number | undefined, loading: boolean) {
        return loading ? "..." : String(value ?? 0);
    }

    return (
        <div className="space-y-6">
            <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                            My JobsSpot
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                            Keep your resume ready, track applications, and continue finding roles that match what you are looking for.
                        </p>
                    </div>

                    <Button asChild size="lg" className="w-full lg:w-auto">
                        <Link href="/jobs">
                            <Search />
                            Browse jobs
                        </Link>
                    </Button>
                </div>
            </header>

            <section aria-label="Job seeker overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStat
                    label="Applications"
                    value={formatValue(summary?.totalApplications, summaryQuery.isLoading)}
                    description={`${formatValue(activeApplications, summaryQuery.isLoading)} currently active.`}
                    icon={BriefcaseBusiness}
                />
                <DashboardStat
                    label="Saved jobs"
                    value={formatValue(savedJobsCount, savedJobsQuery.isLoading)}
                    description="Roles you saved to review again later."
                    icon={Bookmark}
                />
                <DashboardStat
                    label="Resumes"
                    value={formatValue(resumes.length, resumesQuery.isLoading)}
                    description={defaultResume ? "A default resume is ready for applications." : "Add a resume before your next application."}
                    icon={FileText}
                />
                <DashboardStat
                    label="Profile"
                    value={user?.isEmailVerified ? "Ready" : "Check"}
                    description={user?.isEmailVerified ? "Your account email is verified." : "Verify your email to keep your account ready."}
                    icon={UserRound}
                />
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
                <Card>
                    <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Recent applications</CardTitle>
                            <CardDescription className="mt-1.5">
                                Your latest application activity and current status.
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/account/applications">
                                View all
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {recentApplicationsQuery.isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
                                ))}
                            </div>
                        ) : recentApplicationsQuery.isError ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm leading-6 text-amber-800">
                                Application activity could not be loaded right now. Your data is still available from the Applications page.
                            </div>
                        ) : recentApplications.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                                <BriefcaseBusiness className="mx-auto size-9 text-slate-400" />
                                <h2 className="mt-3 font-semibold text-slate-950">No applications yet</h2>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    Browse available jobs and submit your first application when you find the right opportunity.
                                </p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/jobs">Find jobs</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200">
                                {recentApplications.map((application) => (
                                    <div key={application.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <Link
                                                href={`/jobs/${application.job.slug}`}
                                                className="font-semibold text-slate-950 hover:text-blue-600"
                                            >
                                                {application.job.title}
                                            </Link>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {application.job.company.name} · Applied {formatApplicationDate(application.appliedAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusClasses(application.status)}`}
                                        >
                                            {formatApplicationStatus(application.status)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ready for your next application?</CardTitle>
                            <CardDescription className="mt-1.5">
                                A few quick checks keep the process simple when you find a role you want.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <CheckCircle2 className={`mt-0.5 size-5 shrink-0 ${defaultResume ? "text-emerald-600" : "text-slate-300"}`} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-950">
                                        {defaultResume ? "Default resume ready" : "Add a default resume"}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {defaultResume ? defaultResume.name : "Upload a resume so it is ready to select when you apply."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                <Button asChild variant="outline" className="justify-between">
                                    <Link href="/account/resumes">
                                        Manage resumes
                                        <ArrowRight />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-between">
                                    <Link href="/account/profile">
                                        Update profile
                                        <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Keep exploring</CardTitle>
                            <CardDescription className="mt-1.5">
                                Return to saved opportunities or start a fresh search.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button asChild variant="outline" className="justify-between">
                                <Link href="/account/saved-jobs">
                                    Saved jobs
                                    <ArrowRight />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="justify-between">
                                <Link href="/account/saved-searches">
                                    Saved searches
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
