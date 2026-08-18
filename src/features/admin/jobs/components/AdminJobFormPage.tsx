"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toJobsSpotDateInput } from "@/lib/jobsSpotDateTime";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories";
import { useAdminCompanies, useCreateAdminCompany } from "@/features/admin/companies/hooks/useAdminCompanies";
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
    const [companyMode, setCompanyMode] = useState<"EXISTING" | "NEW">("EXISTING");
    const [companyId, setCompanyId] = useState("");
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyWebsite, setNewCompanyWebsite] = useState("");
    const [newCompanyLocation, setNewCompanyLocation] = useState("");
    const [newCompanyIndustry, setNewCompanyIndustry] = useState("");
    const [newCompanyDescription, setNewCompanyDescription] = useState("");
    const jobQuery = useAdminJob(isEdit ? jobId : "");
    const createMutation = useCreateAdminJob();
    const updateMutation = useUpdateAdminJob(jobId);
    const createCompanyMutation = useCreateAdminCompany();

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
            preferredQualifications: job.preferredQualifications ?? "",
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
            publicContactEmail: job.publicContactEmail ?? "",
        };
    }, [isEdit, job]);

    const categories = (categoriesQuery.data?.categories ?? []).map((category) => ({ id: category.id, name: category.name }));
    const companies = companiesQuery.data?.companies ?? [];

    async function handleSubmit(values: JobFormValues) {
        const payload = mapJobFormToPayload(values);
        const toastId = toast.loading(isEdit ? "Saving job..." : "Creating job draft...");

        try {
            let resolvedCompanyId = companyId;

            if (!isEdit && companyMode === "NEW") {
                if (newCompanyName.trim().length < 2) {
                    toast.error("Enter a company name containing at least 2 characters.", { id: toastId });
                    return;
                }

                const companyResponse = await createCompanyMutation.mutateAsync({
                    name: newCompanyName.trim(),
                    ...(newCompanyWebsite.trim() && { websiteUrl: newCompanyWebsite.trim() }),
                    ...(newCompanyLocation.trim() && { location: newCompanyLocation.trim() }),
                    ...(newCompanyIndustry.trim() && { industry: newCompanyIndustry.trim() }),
                    ...(newCompanyDescription.trim() && { description: newCompanyDescription.trim() }),
                });

                resolvedCompanyId = companyResponse.company.id;
            }

            if (!isEdit && !resolvedCompanyId) {
                toast.error("Select an existing company or create a new one.", { id: toastId });
                return;
            }

            const response = isEdit
                ? await updateMutation.mutateAsync(payload)
                : await createMutation.mutateAsync({ companyId: resolvedCompanyId, job: payload });

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
                        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                            <div className="space-y-2">
                                <Label>Company *</Label>
                                <Select value={companyMode} onValueChange={(value) => setCompanyMode(value as "EXISTING" | "NEW")}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EXISTING">Use an existing company</SelectItem>
                                        <SelectItem value="NEW">Create a new company here</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    The final job still belongs to a company record. Create one here when the employer is new or confidential.
                                </p>
                            </div>

                            {companyMode === "EXISTING" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="admin-job-company">Existing company</Label>
                                    <Select value={companyId || undefined} onValueChange={setCompanyId}>
                                        <SelectTrigger id="admin-job-company" className="w-full"><SelectValue placeholder={companiesQuery.isLoading ? "Loading companies..." : "Select company"} /></SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {companies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}{company.location ? ` · ${company.location}` : ""}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {!companiesQuery.isLoading && companies.length === 0 && <p className="text-sm text-muted-foreground">No active companies exist. Switch to Create a new company here.</p>}
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="admin-job-new-company-name">Company name *</Label>
                                        <Input id="admin-job-new-company-name" value={newCompanyName} onChange={(event) => setNewCompanyName(event.target.value)} maxLength={100} placeholder="e.g. Confidential Healthcare Organization" />
                                        <p className="text-xs text-muted-foreground">Normal punctuation and symbols in company names are supported; the public slug is generated separately.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-job-new-company-website">Website</Label>
                                        <Input id="admin-job-new-company-website" value={newCompanyWebsite} onChange={(event) => setNewCompanyWebsite(event.target.value)} placeholder="https://company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-job-new-company-location">Company location</Label>
                                        <Input id="admin-job-new-company-location" value={newCompanyLocation} onChange={(event) => setNewCompanyLocation(event.target.value)} maxLength={150} placeholder="New York, NY" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="admin-job-new-company-industry">Industry</Label>
                                        <Input id="admin-job-new-company-industry" value={newCompanyIndustry} onChange={(event) => setNewCompanyIndustry(event.target.value)} maxLength={100} placeholder="Healthcare" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="admin-job-new-company-description">Company description</Label>
                                        <Textarea id="admin-job-new-company-description" value={newCompanyDescription} onChange={(event) => setNewCompanyDescription(event.target.value)} rows={4} maxLength={2000} placeholder="Short public description of the organization." />
                                    </div>
                                </div>
                            )}
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
                            isPending={createMutation.isPending || updateMutation.isPending || createCompanyMutation.isPending}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push(isEdit ? `/admin/jobs/${jobId}` : "/admin/jobs")}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
