"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toJobsSpotDateInput } from "@/lib/jobsSpotDateTime";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories";
import { useAdminCompanies } from "@/features/admin/companies/hooks/useAdminCompanies";
import JobForm from "@/features/employers/jobs/components/JobForm";
import { defaultJobFormValues } from "@/features/employers/jobs/types/jobForm";
import { mapJobFormToPayload } from "@/features/employers/jobs/types/companyJob";
import type { JobFormValues } from "@/features/employers/jobs/validations/jobFormSchema";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminJob, useCreateAdminJob, useUpdateAdminJob } from "../hooks/useAdminJobs";

type AdminJobFormPageProps = {
    mode: "create" | "edit";
    jobId?: string;
};

function toDateInput(value: string | null | undefined) {
    if (!value) return "";
    return toJobsSpotDateInput(value);
}

export default function AdminJobFormPage({ mode, jobId = "" }: AdminJobFormPageProps) {
    const router = useRouter();
    const isEdit = mode === "edit";
    const [companyId, setCompanyId] = useState("");
    const jobQuery = useAdminJob(isEdit ? jobId : "");
    const createMutation = useCreateAdminJob();
    const updateMutation = useUpdateAdminJob(jobId);

    const companiesQuery = useAdminCompanies({ page: 1, limit: 100, status: "ACTIVE", verification: "ALL", sort: "NAME_ASC" });
    const categoriesQuery = useAdminCategories({ page: 1, limit: 100, status: "ACTIVE", sort: "ORDER_ASC" });

    const job = jobQuery.data?.job;
    const initialValues = useMemo<JobFormValues>(() => {
        if (!isEdit || !job) return defaultJobFormValues;

        return {
            categoryId: job.categoryId,
            title: job.title,
            description: job.description,
            requirements: job.requirements ?? "",
            responsibilities: job.responsibilities ?? "",
            employmentType: job.employmentType as JobFormValues["employmentType"],
            workplaceType: job.workplaceType as JobFormValues["workplaceType"],
            experienceLevel: job.experienceLevel as JobFormValues["experienceLevel"],
            city: job.city ?? "",
            stateRegion: job.stateRegion ?? "",
            countryCode: "US",
            salaryMin: job.salaryMin ?? "",
            salaryMax: job.salaryMax ?? "",
            salaryCurrency: job.salaryCurrency ?? "USD",
            salaryPeriod: (job.salaryPeriod ?? "") as JobFormValues["salaryPeriod"],
            applicationDeadline: toDateInput(job.applicationDeadline),
        };
    }, [isEdit, job]);

    const categories = (categoriesQuery.data?.categories ?? []).map((category) => ({ id: category.id, name: category.name }));
    const companies = companiesQuery.data?.companies ?? [];

    async function handleSubmit(values: JobFormValues) {
        const payload = mapJobFormToPayload(values);
        const toastId = toast.loading(isEdit ? "Saving job..." : "Creating job draft...");

        try {
            const response = isEdit
                ? await updateMutation.mutateAsync(payload)
                : await createMutation.mutateAsync({ companyId, job: payload });

            toast.success(response.message, { id: toastId });
            router.push(`/admin/jobs/${response.job.id}`);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, isEdit ? "Unable to update job." : "Unable to create job."), { id: toastId });
        }
    }

    if (isEdit && jobQuery.isLoading) {
        return <div className="mx-auto h-96 w-full max-w-5xl animate-pulse rounded-2xl bg-muted" />;
    }

    if (isEdit && (jobQuery.isError || !job)) {
        return (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="font-semibold">Unable to load job</p>
                <p className="mt-2 text-sm">{getAdminErrorMessage(jobQuery.error, "This job could not be retrieved.")}</p>
                <Button asChild variant="outline" className="mt-5"><Link href="/admin/jobs"><ArrowLeft /> Back to jobs</Link></Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Button asChild variant="ghost" className="px-0"><Link href={isEdit ? `/admin/jobs/${jobId}` : "/admin/jobs"}><ArrowLeft /> Back</Link></Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl"><BriefcaseBusiness className="size-6 text-primary" />{isEdit ? "Edit job" : "Create job"}</CardTitle>
                    <CardDescription>
                        Jobs are managed by Platform Admin. New jobs are created as drafts and can be published after review.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isEdit && (
                        <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
                            <Label htmlFor="admin-job-company">Company *</Label>
                            <Select value={companyId || undefined} onValueChange={setCompanyId}>
                                <SelectTrigger id="admin-job-company" className="w-full"><SelectValue placeholder={companiesQuery.isLoading ? "Loading companies..." : "Select company"} /></SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {companies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}{company.location ? ` · ${company.location}` : ""}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {!companiesQuery.isLoading && companies.length === 0 && <p className="text-sm text-muted-foreground">No active companies exist. Create a company first.</p>}
                        </div>
                    )}

                    {isEdit && job && (
                        <div className="rounded-xl border bg-muted/20 p-4 text-sm">
                            <span className="font-semibold">Company:</span> {job.company.name}
                        </div>
                    )}

                    {categoriesQuery.isError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load active categories.</div>
                    ) : (
                        <JobForm
                            key={isEdit ? `${jobId}-${job?.updatedAt ?? "loading"}` : "create-admin-job"}
                            categories={categories}
                            defaultValues={initialValues}
                            submitLabel={isEdit ? "Save Job" : "Create Draft"}
                            isPending={createMutation.isPending || updateMutation.isPending}
                            onSubmit={async (values) => {
                                if (!isEdit && !companyId) {
                                    toast.error("Select a company before creating the job.");
                                    return;
                                }
                                await handleSubmit(values);
                            }}
                            onCancel={() => router.push(isEdit ? `/admin/jobs/${jobId}` : "/admin/jobs")}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
