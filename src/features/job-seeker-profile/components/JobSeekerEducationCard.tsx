"use client";

import axios from "axios";
import { BookOpenText, CalendarDays, ChevronDown, ChevronUp, GraduationCap, LoaderCircle, Pencil, Plus, School, Trash2 } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useCreateEducation, useDeleteEducation, useEducation, useUpdateEducation } from "../hooks/useJobSeekerProfile";
import type { Education, SaveEducationRequest } from "../types/jobSeekerProfile";

function normalizeOptionalText(value: string): string | null {
    const normalized = value.trim();
    return normalized === "" ? null : normalized;
}
function monthToIsoDate(value: string): string | null { return value ? `${value}-01` : null; }
function toMonthInputValue(value: string | null): string { return value?.slice(0, 7) ?? ""; }
function formatMonthYear(value: string): string {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
function formatDateRange(item: Education): string | null {
    if (!item.startDate && !item.endDate && !item.isCurrent) return null;
    const start = item.startDate ? formatMonthYear(item.startDate) : null;
    if (item.isCurrent) return start ? `${start} – Present` : "Currently studying";
    const end = item.endDate ? formatMonthYear(item.endDate) : null;
    return start && end ? `${start} – ${end}` : start ?? end;
}
function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data?.message ?? fallback;
    return fallback;
}

type FormState = {
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
};
function initialForm(item: Education | null): FormState {
    return {
        institutionName: item?.institutionName ?? "",
        degree: item?.degree ?? "",
        fieldOfStudy: item?.fieldOfStudy ?? "",
        startDate: toMonthInputValue(item?.startDate ?? null),
        endDate: toMonthInputValue(item?.endDate ?? null),
        isCurrent: item?.isCurrent ?? false,
        description: item?.description ?? "",
    };
}

type FormDialogProps = Readonly<{ education: Education | null; open: boolean; onOpenChange: (open: boolean) => void; }>;
function EducationFormDialog({ education, open, onOpenChange }: FormDialogProps) {
    const createMutation = useCreateEducation();
    const updateMutation = useUpdateEducation();
    const [form, setForm] = useState<FormState>(() => initialForm(education));
    const [formError, setFormError] = useState("");
    const isEditing = education !== null;
    const isPending = createMutation.isPending || updateMutation.isPending;

    function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
        if (formError) setFormError("");
    }
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!form.institutionName.trim()) { setFormError("Institution name is required."); return; }
        if (!form.isCurrent && form.startDate && form.endDate && form.endDate < form.startDate) {
            setFormError("End date cannot be earlier than start date."); return;
        }
        const data: SaveEducationRequest = {
            institutionName: form.institutionName.trim(),
            degree: normalizeOptionalText(form.degree),
            fieldOfStudy: normalizeOptionalText(form.fieldOfStudy),
            startDate: monthToIsoDate(form.startDate),
            endDate: form.isCurrent ? null : monthToIsoDate(form.endDate),
            isCurrent: form.isCurrent,
            description: normalizeOptionalText(form.description),
        };
        const toastId = toast.loading(isEditing ? "Updating education..." : "Adding education...");
        try {
            const response = isEditing
                ? await updateMutation.mutateAsync({ educationId: education.id, data })
                : await createMutation.mutateAsync(data);
            toast.success(response.message, { id: toastId });
            onOpenChange(false);
        } catch (error) {
            toast.error(getApiErrorMessage(error, isEditing ? "Unable to update this education record." : "Unable to add this education record."), { id: toastId });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" onPointerDownOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => { if (isPending) event.preventDefault(); }}>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit education" : "Add education"}</DialogTitle>
                    <DialogDescription>Add your university, college, training, or other relevant educational background.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="education-institution" className="text-sm font-semibold">Institution</label>
                        <Input id="education-institution" value={form.institutionName} maxLength={150} placeholder="e.g. Arellano University" disabled={isPending} onChange={(event) => updateField("institutionName", event.target.value)} className="mt-2" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="education-degree" className="text-sm font-semibold">Degree</label>
                            <Input id="education-degree" value={form.degree} maxLength={150} placeholder="e.g. Bachelor of Science" disabled={isPending} onChange={(event) => updateField("degree", event.target.value)} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="education-field" className="text-sm font-semibold">Field of study</label>
                            <Input id="education-field" value={form.fieldOfStudy} maxLength={150} placeholder="e.g. Information Technology" disabled={isPending} onChange={(event) => updateField("fieldOfStudy", event.target.value)} className="mt-2" />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="education-start-date" className="text-sm font-semibold">Start date <span className="font-normal text-slate-500">(optional)</span></label>
                            <Input id="education-start-date" type="month" value={form.startDate} disabled={isPending} onChange={(event) => updateField("startDate", event.target.value)} className="mt-2" />
                        </div>
                        <div>
                            <label htmlFor="education-end-date" className="text-sm font-semibold">End date <span className="font-normal text-slate-500">(optional)</span></label>
                            <Input id="education-end-date" type="month" value={form.endDate} disabled={isPending || form.isCurrent} onChange={(event) => updateField("endDate", event.target.value)} className="mt-2" />
                        </div>
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                        <input type="checkbox" checked={form.isCurrent} disabled={isPending} onChange={(event) => { const isCurrent = event.target.checked; setForm((current) => ({ ...current, isCurrent, ...(isCurrent && { endDate: "" }) })); if (formError) setFormError(""); }} className="mt-1 size-4 rounded border-slate-300" />
                        <span><span className="block text-sm font-semibold text-slate-950">I currently study here</span><span className="mt-1 block text-sm leading-6 text-slate-600">The education record will be displayed as ongoing and no end date will be stored.</span></span>
                    </label>
                    <div>
                        <div className="flex items-center justify-between gap-4"><label htmlFor="education-description" className="text-sm font-semibold">Description</label><span className="text-xs text-slate-500">{form.description.length}/3000</span></div>
                        <textarea id="education-description" rows={6} value={form.description} maxLength={3000} placeholder="Add relevant coursework, projects, awards, or academic achievements." disabled={isPending} onChange={(event) => updateField("description", event.target.value)} className="mt-2 flex min-h-32 w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>
                    {formError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
                    <DialogFooter>
                        <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" /> : isEditing ? <Pencil /> : <Plus />}{isPending ? "Saving..." : isEditing ? "Save changes" : "Add education"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type DeleteDialogProps = Readonly<{ education: Education; open: boolean; onOpenChange: (open: boolean) => void; }>;
function DeleteEducationDialog({ education, open, onOpenChange }: DeleteDialogProps) {
    const mutation = useDeleteEducation();
    async function handleDelete() {
        const toastId = toast.loading("Removing education...");
        try { const response = await mutation.mutateAsync(education.id); toast.success(response.message, { id: toastId }); onOpenChange(false); }
        catch (error) { toast.error(getApiErrorMessage(error, "Unable to remove this education record."), { id: toastId }); }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onPointerDownOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => { if (mutation.isPending) event.preventDefault(); }}>
                <DialogHeader><DialogTitle>Remove education?</DialogTitle><DialogDescription>Your education at <strong>{education.institutionName}</strong> will be permanently removed from your profile.</DialogDescription></DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" disabled={mutation.isPending} onClick={() => void handleDelete()} className="bg-red-600 text-white hover:bg-red-700">{mutation.isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}{mutation.isPending ? "Removing..." : "Remove education"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type ItemProps = Readonly<{ education: Education; onEdit: (item: Education) => void; onDelete: (item: Education) => void; }>;
function EducationItem({ education, onEdit, onDelete }: ItemProps) {
    const dateRange = formatDateRange(education);
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><GraduationCap className="size-5" /></span>
                        <div className="min-w-0"><h3 className="font-semibold text-slate-950">{education.degree ?? education.fieldOfStudy ?? "Education"}</h3><p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><School className="size-4 shrink-0" />{education.institutionName}</p></div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        {dateRange && <span className="flex items-center gap-2"><CalendarDays className="size-4" />{dateRange}</span>}
                        {education.degree && education.fieldOfStudy && <span className="flex items-center gap-2"><BookOpenText className="size-4" />{education.fieldOfStudy}</span>}
                    </div>
                    {education.isCurrent && <div className="mt-3"><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Currently studying</span></div>}
                    {education.description && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{education.description}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" onClick={() => onEdit(education)}><Pencil />Edit</Button>
                    <Button type="button" variant="outline" onClick={() => onDelete(education)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 />Remove</Button>
                </div>
            </div>
        </article>
    );
}

export default function JobSeekerEducationCard() {
    const query = useEducation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editing, setEditing] = useState<Education | null>(null);
    const [deleting, setDeleting] = useState<Education | null>(null);
    const education = query.data?.education ?? [];
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><GraduationCap className="size-6" /></div><div><CardTitle>Education</CardTitle><CardDescription className="mt-1">Add your academic background, training, and relevant areas of study.</CardDescription></div></div>
                        <div className="flex w-full gap-2 sm:w-auto"><Button type="button" variant="outline" aria-expanded={isExpanded} onClick={() => setIsExpanded((value) => !value)} className="flex-1 sm:flex-none">{isExpanded ? <ChevronUp /> : <ChevronDown />}{isExpanded ? "Hide" : "Show"}</Button><Button type="button" onClick={() => setIsAddOpen(true)} className="flex-1 sm:flex-none"><Plus />Add education</Button></div>
                    </div>
                </CardHeader>
                {isExpanded && <CardContent>
                    {query.isPending && <div className="space-y-3"><div className="h-40 animate-pulse rounded-2xl bg-slate-100" /><div className="h-40 animate-pulse rounded-2xl bg-slate-100" /></div>}
                    {query.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center"><p className="font-semibold text-red-700">Unable to load your education.</p><Button type="button" variant="outline" className="mt-3" onClick={() => void query.refetch()}>Try again</Button></div>}
                    {!query.isPending && !query.isError && education.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center"><p className="font-semibold text-slate-900">No education added yet</p><p className="mt-2 text-sm text-slate-600">Add your school, degree, training, or academic background.</p></div>}
                    {!query.isPending && !query.isError && education.length > 0 && <div className="space-y-4">{education.map((item) => <EducationItem key={item.id} education={item} onEdit={setEditing} onDelete={setDeleting} />)}</div>}
                </CardContent>}
            </Card>
            {isAddOpen && <EducationFormDialog key="add-education" education={null} open onOpenChange={setIsAddOpen} />}
            {editing && <EducationFormDialog key={editing.id} education={editing} open onOpenChange={(open) => { if (!open) setEditing(null); }} />}
            {deleting && <DeleteEducationDialog key={deleting.id} education={deleting} open onOpenChange={(open) => { if (!open) setDeleting(null); }} />}
        </>
    );
}
