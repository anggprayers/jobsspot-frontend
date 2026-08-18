"use client";

import { Check, Copy, Link2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminErrorMessage } from "@/features/admin/shared/utils/adminFormatters";

import { useCreateAdminApplicationShareLink } from "../hooks/useAdminApplications";

type Props = {
    applicationId: string;
    hasResume: boolean;
    hasCoverLetter: boolean;
};

export default function CreateApplicationShareLinkDialog({ applicationId, hasResume, hasCoverLetter }: Props) {
    const [open, setOpen] = useState(false);
    const [includeResume, setIncludeResume] = useState(hasResume);
    const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
    const [expiresInHours, setExpiresInHours] = useState("24");
    const [createdUrl, setCreatedUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const createMutation = useCreateAdminApplicationShareLink(applicationId);

    function reset() {
        setIncludeResume(hasResume);
        setIncludeCoverLetter(false);
        setExpiresInHours("24");
        setCreatedUrl(null);
        setCopied(false);
    }

    async function handleCreate() {
        if (!includeResume && !includeCoverLetter) {
            toast.error("Select at least one document to share.");
            return;
        }
        try {
            const response = await createMutation.mutateAsync({
                expiresInHours: Number(expiresInHours),
                includeResume,
                includeCoverLetter,
            });
            setCreatedUrl(response.shareLink.shareUrl);
            toast.success("Secure application link created.");
        } catch (error) {
            toast.error(getAdminErrorMessage(error, "Unable to create the secure share link."));
        }
    }

    async function copyUrl() {
        if (!createdUrl) return;
        await navigator.clipboard.writeText(createdUrl);
        setCopied(true);
        toast.success("Secure link copied.");
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) reset(); }}>
            <DialogTrigger asChild>
                <Button type="button" disabled={!hasResume && !hasCoverLetter}><Link2 /> Create secure share link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Share application securely</DialogTitle>
                    <DialogDescription>
                        Create an expiring link for the employer. Files stay private in JobsSpot storage and the link can be revoked at any time.
                    </DialogDescription>
                </DialogHeader>

                {createdUrl ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                            Link created. Copy it now—the secret URL is shown only when it is created.
                        </div>
                        <div className="break-all rounded-xl border bg-muted/30 p-3 text-sm">{createdUrl}</div>
                        <Button type="button" className="w-full" onClick={() => void copyUrl()}>
                            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy secure link"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-5 py-2">
                        <div className="space-y-3">
                            <Label>Documents included</Label>
                            <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
                                <input type="checkbox" className="mt-1 size-4" checked={includeResume} disabled={!hasResume} onChange={(event) => setIncludeResume(event.target.checked)} />
                                <span><span className="font-medium">Submitted resume</span><span className="block text-muted-foreground">{hasResume ? "Exact resume attached to this application." : "No resume is available."}</span></span>
                            </label>
                            <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
                                <input type="checkbox" className="mt-1 size-4" checked={includeCoverLetter} disabled={!hasCoverLetter} onChange={(event) => setIncludeCoverLetter(event.target.checked)} />
                                <span><span className="font-medium">Cover letter</span><span className="block text-muted-foreground">{hasCoverLetter ? "Share the submitted cover letter text/file." : "No cover letter is available."}</span></span>
                            </label>
                        </div>
                        <div className="space-y-2">
                            <Label>Link expires after</Label>
                            <Select value={expiresInHours} onValueChange={setExpiresInHours}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="24">24 hours (recommended)</SelectItem>
                                    <SelectItem value="48">48 hours</SelectItem>
                                    <SelectItem value="72">3 days</SelectItem>
                                    <SelectItem value="168">7 days (maximum)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {createdUrl ? (
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Done</Button>
                    ) : (
                        <>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="button" disabled={createMutation.isPending || (!includeResume && !includeCoverLetter)} onClick={() => void handleCreate()}>
                                {createMutation.isPending && <LoaderCircle className="animate-spin" />} Create link
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
