"use client";

import Link from "next/link";
import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarCheck,
    FileText,
    Plus,
    UserCheck,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCompanyApplications } from "@/features/employers/applicants/hooks/useCompanyApplications";
import {
    formatApplicationDate,
    formatApplicationStatus,
    getApplicantInitials,
    getApplicationStatusBadgeClasses,
} from "@/features/employers/applicants/utils/applicationFormatters";
import { useCompanyJobs } from "@/features/employers/jobs/hooks/useCompanyJobs";
import {
    formatJobDate,
    formatJobStatus,
    getJobStatusBadgeClasses,
} from "@/features/employers/jobs/utils/jobFormatters";
import { canManageCompany, canManageJobs } from "@/features/employers/utils/employerPermissions";

function formatStatValue({
    isLoading,
    isError,
    value,
}: {
    isLoading: boolean;
    isError: boolean;
    value: number | undefined;
}): string {
    if (isLoading) {
        return "...";
    }

    if (isError) {
        return "—";
    }

    return String(value ?? 0);
}

export default function EmployerDashboardPage() {
    const { user, accessToken, activeCompanyId, activeCompanyRole } = useAuth();

    const hasCompanyManagementAccess = canManageCompany(activeCompanyRole);

    const hasJobManagementAccess = canManageJobs(activeCompanyRole);

    const companyId = activeCompanyId ?? "";

    const jobsQuery = useCompanyJobs({
        companyId,
        accessToken: accessToken ?? "",
        params: {
            page: 1,
            limit: 4,
        },
    });

    const applicationsQuery = useCompanyApplications({
        companyId,
        params: {
            page: 1,
            limit: 4,
        },
    });

    const jobs = jobsQuery.data?.jobs ?? [];
    const jobSummary = jobsQuery.data?.summary;

    const applications = applicationsQuery.data?.applications ?? [];

    const applicationSummary = applicationsQuery.data?.summary;

    const recentJobs = [...jobs]
        .sort(
            (firstJob, secondJob) =>
                new Date(secondJob.updatedAt).getTime() - new Date(firstJob.updatedAt).getTime(),
        )
        .slice(0, 4);

    const recentApplications = applications.slice(0, 4);

    const firstName = user?.firstName ?? "Employer";

    const dashboardStats = [
        {
            title: "Active jobs",
            value: formatStatValue({
                isLoading: jobsQuery.isLoading,
                isError: jobsQuery.isError,
                value: jobSummary?.publishedJobs,
            }),
            description: "Currently visible to job seekers",
            icon: BriefcaseBusiness,
        },
        {
            title: "Total applicants",
            value: formatStatValue({
                isLoading: applicationsQuery.isLoading,
                isError: applicationsQuery.isError,
                value: applicationSummary?.totalApplications,
            }),
            description: "Applications received across all jobs",
            icon: Users,
        },
        {
            title: "New submissions",
            value: formatStatValue({
                isLoading: applicationsQuery.isLoading,
                isError: applicationsQuery.isError,
                value: applicationSummary?.submitted,
            }),
            description: "Applications waiting for review",
            icon: FileText,
        },
        {
            title: "Interviews",
            value: formatStatValue({
                isLoading: applicationsQuery.isLoading,
                isError: applicationsQuery.isError,
                value: applicationSummary?.interviews,
            }),
            description: "Applicants currently in interview",
            icon: CalendarCheck,
        },
        {
            title: "Hired",
            value: formatStatValue({
                isLoading: applicationsQuery.isLoading,
                isError: applicationsQuery.isError,
                value: applicationSummary?.hired,
            }),
            description: "Applicants marked as hired",
            icon: UserCheck,
        },
    ];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-8">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-primary">Employer overview</p>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                            Welcome back, {firstName}
                        </h1>

                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            {hasCompanyManagementAccess
                                ? "Manage your company, publish job opportunities, and review applicants from your employer workspace."
                                : hasJobManagementAccess
                                  ? "Manage job opportunities and review applicants from your employer workspace."
                                  : "View your company’s job opportunities, applicants, and employer activity overview."}
                        </p>
                    </div>

                    <Button
                        asChild
                        size="lg"
                        variant={hasJobManagementAccess ? "default" : "outline"}
                    >
                        <Link href="/employers/jobs">
                            {hasJobManagementAccess ? (
                                <>
                                    <Plus />
                                    Manage jobs
                                </>
                            ) : (
                                <>
                                    <BriefcaseBusiness />
                                    View jobs
                                </>
                            )}
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {dashboardStats.map((stat) => (
                    <Card key={stat.title} className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-2">
                                <CardDescription>{stat.title}</CardDescription>

                                <CardTitle className="text-3xl">{stat.value}</CardTitle>
                            </div>

                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                <stat.icon className="size-5" />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-xs leading-5 text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Recent jobs</CardTitle>

                            <CardDescription>
                                Your most recently updated job postings.
                            </CardDescription>
                        </div>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/employers/jobs">
                                View all
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {jobsQuery.isLoading && (
                            <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                                Loading recent jobs...
                            </div>
                        )}

                        {jobsQuery.isError && (
                            <div className="flex min-h-52 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                                {jobsQuery.error instanceof Error
                                    ? jobsQuery.error.message
                                    : "Unable to load recent jobs."}
                            </div>
                        )}

                        {!jobsQuery.isLoading && !jobsQuery.isError && recentJobs.length === 0 && (
                            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <BriefcaseBusiness className="size-6 text-muted-foreground" />
                                </div>

                                <h3 className="font-semibold">
                                    {hasJobManagementAccess
                                        ? "No jobs posted yet"
                                        : "No jobs available yet"}
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    {hasJobManagementAccess
                                        ? "Create your first job posting to start receiving applications."
                                        : "New company job postings will appear here once they are created."}
                                </p>

                                {hasJobManagementAccess && (
                                    <Button className="mt-5" size="sm" asChild>
                                        <Link href="/employers/jobs">
                                            <Plus />
                                            Go to jobs
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}

                        {!jobsQuery.isLoading && !jobsQuery.isError && recentJobs.length > 0 && (
                            <div className="divide-y overflow-hidden rounded-xl border">
                                {recentJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={`/employers/jobs/${job.id}`}
                                        className="flex flex-col justify-between gap-3 p-4 transition hover:bg-muted/40 sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold">{job.title}</p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {job.category.name}
                                                {" · "}
                                                Updated {formatJobDate(job.updatedAt)}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${getJobStatusBadgeClasses(
                                                job.status,
                                            )}`}
                                        >
                                            {formatJobStatus(job.status)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle>Recent applicants</CardTitle>

                                <CardDescription>
                                    Latest applications submitted to your jobs.
                                </CardDescription>
                            </div>

                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/employers/applicants">
                                    View all
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>

                        <CardContent>
                            {applicationsQuery.isLoading && (
                                <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                                    Loading applicants...
                                </div>
                            )}

                            {applicationsQuery.isError && (
                                <div className="flex min-h-44 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
                                    {applicationsQuery.error instanceof Error
                                        ? applicationsQuery.error.message
                                        : "Unable to load recent applicants."}
                                </div>
                            )}

                            {!applicationsQuery.isLoading &&
                                !applicationsQuery.isError &&
                                recentApplications.length === 0 && (
                                    <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
                                        <div className="mb-3 rounded-full bg-muted p-3">
                                            <Users className="size-5 text-muted-foreground" />
                                        </div>

                                        <p className="font-semibold">No applicants yet</p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            New applications will appear here.
                                        </p>
                                    </div>
                                )}

                            {!applicationsQuery.isLoading &&
                                !applicationsQuery.isError &&
                                recentApplications.length > 0 && (
                                    <div className="divide-y overflow-hidden rounded-xl border">
                                        {recentApplications.map((application) => (
                                            <Link
                                                key={application.id}
                                                href={`/employers/applicants/${application.id}`}
                                                className="flex items-center gap-3 p-4 transition hover:bg-muted/40"
                                            >
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                    {getApplicantInitials(
                                                        application.applicant.firstName,
                                                        application.applicant.lastName,
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold">
                                                        {application.applicant.firstName}{" "}
                                                        {application.applicant.lastName}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {application.job.title}
                                                        {" · "}
                                                        {formatApplicationDate(
                                                            application.appliedAt,
                                                        )}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold sm:inline-flex ${getApplicationStatusBadgeClasses(
                                                        application.status,
                                                    )}`}
                                                >
                                                    {formatApplicationStatus(application.status)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {hasCompanyManagementAccess && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Company profile</CardTitle>

                                <CardDescription>
                                    Keep your employer information accurate and complete.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Building2 className="size-6" />
                                    </div>

                                    <div>
                                        <p className="font-medium">Company details</p>

                                        <p className="text-sm text-muted-foreground">
                                            Branding, company information, and public profile
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm leading-6 text-muted-foreground">
                                    Keep your company profile complete so candidates can learn more
                                    about your organization.
                                </p>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/employers/company">Manage company profile</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
}
