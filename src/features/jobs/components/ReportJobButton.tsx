"use client";

import axios from "axios";
import { Flag, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import SignInModal from "@/features/auth/components/SignInModal";
import { useAuth } from "@/features/auth/hooks/useAuth";

import type { JobReportReason } from "../api/reportJob";
import { useReportJob } from "../hooks/useReportJob";

const reportReasons: ReadonlyArray<{ value: JobReportReason; label: string }> = [
    { value: "SCAM_FRAUD", label: "Possible scam or fraud" },
    { value: "MISLEADING", label: "Misleading or incorrect information" },
    { value: "DISCRIMINATION", label: "Discriminatory content" },
    { value: "SPAM_DUPLICATE", label: "Spam or duplicate posting" },
    { value: "INAPPROPRIATE", label: "Inappropriate content" },
    { value: "OTHER", label: "Other concern" },
];

type ReportJobButtonProps = Readonly<{
    jobId: string;
    jobTitle: string;
}>;

function getReportErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? "Unable to submit this report right now.";
    }

    return "Unable to submit this report right now.";
}

export default function ReportJobButton({ jobId, jobTitle }: ReportJobButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<JobReportReason | "">("");
    const [details, setDetails] = useState("");

    const { isAuthenticated, isInitializing } = useAuth();
    const reportMutation = useReportJob();

    function openReportDialog() {
        if (isInitializing) return;

        if (!isAuthenticated) {
            setIsSignInOpen(true);
            return;
        }

        setIsOpen(true);
    }

    function closeReportDialog() {
        if (reportMutation.isPending) return;
        setIsOpen(false);
        setSelectedReason("");
        setDetails("");
    }

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !reportMutation.isPending) {
                setIsOpen(false);
                setSelectedReason("");
                setDetails("");
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, reportMutation.isPending]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedReason || reportMutation.isPending) return;

        if (selectedReason === "OTHER" && details.trim().length < 10) {
            toast.error("Please add a short description of the concern.");
            return;
        }

        const toastId = toast.loading("Sending report to JobsSpot...");

        try {
            const response = await reportMutation.mutateAsync({
                jobId,
                reason: selectedReason,
                ...(details.trim() && { details: details.trim() }),
            });

            toast.success("Report submitted.", {
                id: toastId,
                description: response.message,
            });
            closeReportDialog();
        } catch (error) {
            toast.error(getReportErrorMessage(error), { id: toastId });
        }
    }

    const reportDialog =
        isOpen && typeof document !== "undefined"
            ? createPortal(
                  <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">
                      <div className="flex min-h-full items-center justify-center">
                          <div
                              role="dialog"
                              aria-modal="true"
                              aria-labelledby="report-job-title"
                              className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
                          >
                              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5">
                                  <div className="min-w-0">
                                      <h2
                                          id="report-job-title"
                                          className="text-xl font-bold text-slate-950"
                                      >
                                          Report this job
                                      </h2>
                                      <p className="mt-1 text-sm leading-5 text-slate-600">
                                          Tell JobsSpot what may be wrong with “{jobTitle}”. Reports are reviewed by the moderation team.
                                      </p>
                                  </div>

                                  <button
                                      type="button"
                                      aria-label="Close report dialog"
                                      onClick={closeReportDialog}
                                      disabled={reportMutation.isPending}
                                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
                                  >
                                      <X size={19} />
                                  </button>
                              </div>

                              <form
                                  onSubmit={handleSubmit}
                                  className="flex min-h-0 flex-1 flex-col"
                              >
                                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                                      <fieldset disabled={reportMutation.isPending}>
                                          <legend className="text-sm font-semibold text-slate-900">
                                              Select a reason
                                          </legend>

                                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                              {reportReasons.map((reason) => (
                                                  <label
                                                      key={reason.value}
                                                      className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                                  >
                                                      <input
                                                          type="radio"
                                                          name="reportReason"
                                                          value={reason.value}
                                                          checked={selectedReason === reason.value}
                                                          onChange={() => setSelectedReason(reason.value)}
                                                          className="h-4 w-4 shrink-0 accent-blue-600"
                                                      />
                                                      <span>{reason.label}</span>
                                                  </label>
                                              ))}
                                          </div>
                                      </fieldset>

                                      <label
                                          className="mt-3 block text-sm font-semibold text-slate-900"
                                          htmlFor="report-details"
                                      >
                                          Additional details {selectedReason === "OTHER" ? "(required)" : "(optional)"}
                                      </label>
                                      <textarea
                                          id="report-details"
                                          value={details}
                                          onChange={(event) => setDetails(event.target.value.slice(0, 1500))}
                                          rows={2}
                                          disabled={reportMutation.isPending}
                                          placeholder="Add details that can help the moderation team review this job."
                                          className="mt-2 min-h-20 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      />
                                      <p className="mt-1 text-right text-xs text-slate-400">
                                          {details.length}/1,500
                                      </p>
                                  </div>

                                  <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-5">
                                      <button
                                          type="submit"
                                          disabled={!selectedReason || reportMutation.isPending}
                                          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
                                      >
                                          {reportMutation.isPending && <LoaderCircle className="size-4 animate-spin" />}
                                          {reportMutation.isPending ? "Submitting report..." : "Submit report"}
                                      </button>

                                      <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
                                          Your account helps prevent duplicate and abusive reports. Employers do not see who submitted the report.
                                      </p>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            <button
                type="button"
                onClick={openReportDialog}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-red-600"
            >
                <Flag size={16} />
                Report this job
            </button>

            {reportDialog}

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
            />
        </>
    );
}
