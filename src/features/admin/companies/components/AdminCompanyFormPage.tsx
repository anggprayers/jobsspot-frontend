"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getAdminErrorMessage } from "../../shared/utils/adminFormatters";
import { useAdminCompany, useCreateAdminCompany, useUpdateAdminCompany } from "../hooks/useAdminCompanies";

type AdminCompanyFormPageProps = {
    mode: "create" | "edit";
    companyId?: string;
};

type CompanyFormState = {
    name: string;
    description: string;
    websiteUrl: string;
    industry: string;
    companySize: string;
    location: string;
};

const emptyForm: CompanyFormState = {
    name: "",
    description: "",
    websiteUrl: "",
    industry: "",
    companySize: "",
    location: "",
};

export default function AdminCompanyFormPage({ mode, companyId = "" }: AdminCompanyFormPageProps) {
    const isEdit = mode === "edit";
    const companyQuery = useAdminCompany(isEdit ? companyId : "");

    if (isEdit && companyQuery.isLoading) {
        return <div className="mx-auto h-72 w-full max-w-4xl animate-pulse rounded-2xl bg-muted" />;
    }

    if (isEdit && (companyQuery.isError || !companyQuery.data?.company)) {
        return (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="font-semibold">Unable to load company</p>
                <p className="mt-2 text-sm">{getAdminErrorMessage(companyQuery.error, "This company could not be retrieved.")}</p>
                <Button asChild variant="outline" className="mt-5"><Link href="/admin/companies"><ArrowLeft /> Back to companies</Link></Button>
            </div>
        );
    }

    const company = companyQuery.data?.company;
    const initialForm: CompanyFormState = company
        ? {
              name: company.name,
              description: company.description ?? "",
              websiteUrl: company.websiteUrl ?? "",
              industry: company.industry ?? "",
              companySize: company.companySize ?? "",
              location: company.location ?? "",
          }
        : emptyForm;

    return (
        <AdminCompanyFormContent
            key={isEdit ? companyId : "create-company"}
            mode={mode}
            companyId={companyId}
            initialForm={initialForm}
        />
    );
}

type AdminCompanyFormContentProps = AdminCompanyFormPageProps & {
    initialForm: CompanyFormState;
};

function AdminCompanyFormContent({ mode, companyId = "", initialForm }: AdminCompanyFormContentProps) {
    const router = useRouter();
    const isEdit = mode === "edit";
    const createMutation = useCreateAdminCompany();
    const updateMutation = useUpdateAdminCompany(companyId);
    const [form, setForm] = useState<CompanyFormState>(() => initialForm);

    const pending = createMutation.isPending || updateMutation.isPending;

    function setField<K extends keyof CompanyFormState>(key: K, value: CompanyFormState[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (form.name.trim().length < 2) {
            toast.error("Company name must contain at least 2 characters.");
            return;
        }

        const payload = isEdit
            ? {
                  name: form.name.trim(),
                  description: form.description.trim(),
                  websiteUrl: form.websiteUrl.trim(),
                  industry: form.industry.trim(),
                  companySize: form.companySize.trim(),
                  location: form.location.trim(),
              }
            : {
                  name: form.name.trim(),
                  ...(form.description.trim() && { description: form.description.trim() }),
                  ...(form.websiteUrl.trim() && { websiteUrl: form.websiteUrl.trim() }),
                  ...(form.industry.trim() && { industry: form.industry.trim() }),
                  ...(form.companySize.trim() && { companySize: form.companySize.trim() }),
                  ...(form.location.trim() && { location: form.location.trim() }),
              };

        const toastId = toast.loading(isEdit ? "Saving company..." : "Creating company...");

        try {
            const response = isEdit
                ? await updateMutation.mutateAsync(payload)
                : await createMutation.mutateAsync(payload);

            toast.success(response.message, { id: toastId });
            router.push(`/admin/companies/${response.company.id}`);
        } catch (error) {
            toast.error(getAdminErrorMessage(error, isEdit ? "Unable to update company." : "Unable to create company."), { id: toastId });
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <Button asChild variant="ghost" className="px-0">
                <Link href={isEdit ? `/admin/companies/${companyId}` : "/admin/companies"}><ArrowLeft /> Back</Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl"><Building2 className="size-6 text-primary" />{isEdit ? "Edit company" : "Create company"}</CardTitle>
                    <CardDescription>
                        Platform admins manage company records directly. No employer membership is created by this form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="admin-company-name">Company name *</Label>
                            <Input id="admin-company-name" value={form.name} onChange={(event) => setField("name", event.target.value)} maxLength={100} placeholder="e.g. ABC Logistics" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="admin-company-website">Website</Label>
                                <Input id="admin-company-website" value={form.websiteUrl} onChange={(event) => setField("websiteUrl", event.target.value)} placeholder="https://company.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-company-location">Location</Label>
                                <Input id="admin-company-location" value={form.location} onChange={(event) => setField("location", event.target.value)} maxLength={150} placeholder="New York, NY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-company-industry">Industry</Label>
                                <Input id="admin-company-industry" value={form.industry} onChange={(event) => setField("industry", event.target.value)} maxLength={100} placeholder="Technology" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-company-size">Company size</Label>
                                <Input id="admin-company-size" value={form.companySize} onChange={(event) => setField("companySize", event.target.value)} maxLength={50} placeholder="11-50 employees" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admin-company-description">Company description</Label>
                            <Textarea id="admin-company-description" value={form.description} onChange={(event) => setField("description", event.target.value)} rows={7} maxLength={2000} placeholder="Describe the organization, what it does, and the people it hires." />
                            <p className="text-xs text-muted-foreground">A description, industry, and location are required before jobs for this company can be published.</p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                            <Button asChild type="button" variant="outline"><Link href={isEdit ? `/admin/companies/${companyId}` : "/admin/companies"}>Cancel</Link></Button>
                            <Button type="submit" disabled={pending}><Save />{pending ? "Saving..." : isEdit ? "Save changes" : "Create company"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
