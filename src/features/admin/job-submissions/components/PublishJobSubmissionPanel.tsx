"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addDaysToDateInput, getJobsSpotTodayDateInput } from "@/lib/jobsSpotDateTime";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories";
import { useAdminCompanies } from "@/features/admin/companies/hooks/useAdminCompanies";
import JobForm from "@/features/employers/jobs/components/JobForm";
import { defaultJobFormValues } from "@/features/employers/jobs/types/jobForm";
import { mapJobFormToPayload } from "@/features/employers/jobs/types/companyJob";
import type { JobFormValues } from "@/features/employers/jobs/validations/jobFormSchema";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { usePublishAdminJobSubmission } from "../hooks/useAdminJobSubmissions";
import type { AdminJobSubmissionDetails } from "../types/adminJobSubmission";

function getDefaultApplicationDeadline() {
    return addDaysToDateInput(getJobsSpotTodayDateInput(), 30);
}

function getInitialLocation(locationText: string, workplaceType: JobFormValues["workplaceType"]) {
    if (workplaceType === "REMOTE") {
        return { city: "", stateRegion: "" };
    }

    const parts = locationText.split(",").map((part) => part.trim()).filter(Boolean);
    const city = parts[0] ?? "";
    const stateRegion = parts[1]?.toUpperCase().slice(0, 2) ?? "";

    return { city, stateRegion };
}

export default function PublishJobSubmissionPanel({ submission }: { submission: AdminJobSubmissionDetails }) {
    const [companyMode, setCompanyMode] = useState<"NEW" | "EXISTING">("NEW");
    const [existingCompanyId, setExistingCompanyId] = useState("");
    const [companyName, setCompanyName] = useState(submission.companyName);
    const [companyWebsite, setCompanyWebsite] = useState(submission.companyWebsite ?? "");
    const [companyLocation, setCompanyLocation] = useState(submission.locationText);
    const [companyDescription, setCompanyDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [internalNotes, setInternalNotes] = useState(submission.internalNotes ?? "");

    const publishMutation = usePublishAdminJobSubmission(submission.id);
    const companiesQuery = useAdminCompanies({
        page: 1,
        limit: 100,
        status: "ACTIVE",
        verification: "ALL",
        sort: "NAME_ASC",
    });
    const categoriesQuery = useAdminCategories({
        page: 1,
        limit: 100,
        status: "ACTIVE",
        sort: "ORDER_ASC",
    });

    const initialJobValues = useMemo<JobFormValues>(() => {
        const location = getInitialLocation(submission.locationText, submission.workplaceType);

        return {
            ...defaultJobFormValues,
            title: submission.jobTitle,
            description: submission.description,
            employmentType: submission.employmentType,
            workplaceType: submission.workplaceType,
            city: location.city,
            stateRegion: location.stateRegion,
            applicationDeadline: getDefaultApplicationDeadline(),
        };
    }, [submission]);

    const categories = (categoriesQuery.data?.categories ?? []).map((category) => ({
        id: category.id,
        name: category.name,
    }));
    const companies = companiesQuery.data?.companies ?? [];

    async function handlePublish(values: JobFormValues) {
        if (publishMutation.isPending) return;

        if (companyMode === "EXISTING" && !existingCompanyId) {
            toast.error("Select an existing company before publishing.");
            return;
        }

        if (companyMode === "NEW" && companyName.trim().length < 2) {
            toast.error("Enter a company name before publishing.");
            return;
        }

        const toastId = toast.loading("Publishing approved job...");

        try {
            const job = mapJobFormToPayload(values);
            const response = await publishMutation.mutateAsync({
                company:
                    companyMode === "EXISTING"
                        ? { mode: "EXISTING", companyId: existingCompanyId }
                        : {
                              mode: "NEW",
                              name: companyName.trim(),
                              ...(companyDescription.trim() && { description: companyDescription.trim() }),
                              ...(companyWebsite.trim() && { websiteUrl: companyWebsite.trim() }),
                              ...(industry.trim() && { industry: industry.trim() }),
                              ...(companySize.trim() && { companySize: companySize.trim() }),
                              ...(companyLocation.trim() && { location: companyLocation.trim() }),
                          },
                job,
                ...(internalNotes.trim() && { internalNotes: internalNotes.trim() }),
            });

            toast.success(response.message, {
                id: toastId,
                description: `${response.job.title} is now published for ${response.company.name}.`,
            });
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to publish this job submission."), {
                id: toastId,
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Approve & publish</CardTitle>
                <CardDescription>
                    Convert this staging submission into a real JobsSpot company/job. The public submission stays preserved for audit history.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="space-y-2">
                        <Label>Company handling</Label>
                        <Select value={companyMode} onValueChange={(value) => setCompanyMode(value as typeof companyMode)}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEW">Create a new company from this submission</SelectItem>
                                <SelectItem value="EXISTING">Use an existing JobsSpot company</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {companyMode === "EXISTING" ? (
                        <div className="mt-4 space-y-2">
                            <Label htmlFor="existing-company">Existing company</Label>
                            <Select value={existingCompanyId || undefined} onValueChange={setExistingCompanyId}>
                                <SelectTrigger id="existing-company" className="w-full">
                                    <SelectValue placeholder={companiesQuery.isLoading ? "Loading companies..." : "Select company"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {companies.map((company) => (
                                        <SelectItem key={company.id} value={company.id}>
                                            {company.name}{company.location ? ` · ${company.location}` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!companiesQuery.isLoading && companies.length === 0 && (
                                <p className="text-sm text-muted-foreground">No active companies exist yet. Create a new one instead.</p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="new-company-name">Company name</Label>
                                <Input id="new-company-name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={100} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-company-website">Website</Label>
                                <Input id="new-company-website" value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} placeholder="https://company.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-company-location">Company location</Label>
                                <Input id="new-company-location" value={companyLocation} onChange={(event) => setCompanyLocation(event.target.value)} maxLength={150} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-company-industry">Industry (optional)</Label>
                                <Input id="new-company-industry" value={industry} onChange={(event) => setIndustry(event.target.value)} maxLength={100} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-company-size">Company size (optional)</Label>
                                <Input id="new-company-size" value={companySize} onChange={(event) => setCompanySize(event.target.value)} maxLength={50} placeholder="e.g. 11-50 employees" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="new-company-description">Company description (optional)</Label>
                                <Textarea id="new-company-description" value={companyDescription} onChange={(event) => setCompanyDescription(event.target.value)} rows={4} maxLength={2000} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900">
                    <p className="font-semibold">Original submission context</p>
                    <p className="mt-1">Location: {submission.locationText || "Not provided"}</p>
                    {submission.salaryText && <p>Submitted pay: {submission.salaryText}</p>}
                    <p className="mt-1 text-blue-800">Confirm the structured job fields below before publishing.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="submission-internal-notes">Internal admin notes (optional)</Label>
                    <Textarea
                        id="submission-internal-notes"
                        value={internalNotes}
                        onChange={(event) => setInternalNotes(event.target.value)}
                        rows={4}
                        maxLength={2000}
                        placeholder="Agreement details, verification notes, or context for other platform admins..."
                    />
                </div>

                {categoriesQuery.isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Unable to load active job categories. Refresh before publishing.
                    </div>
                ) : (
                    <JobForm
                        categories={categories}
                        defaultValues={initialJobValues}
                        submitLabel="Approve & Publish"
                        isPending={publishMutation.isPending}
                        onSubmit={handlePublish}
                        onCancel={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    />
                )}
            </CardContent>
        </Card>
    );
}
