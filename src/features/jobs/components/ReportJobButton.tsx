"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";

const reportReasons = [
    "Possible scam or fraud",
    "Incorrect job information",
    "Expired or unavailable position",
    "Discriminatory content",
    "Other concern",
] as const;

type ReportJobButtonProps = Readonly<{
    jobId: string;
    jobTitle: string;
}>;

export default function ReportJobButton({ jobTitle }: ReportJobButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsOpen(false);
        setSelectedReason("");
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-red-600"
            >
                <Flag size={16} />
                Report this job
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                    <button
                        type="button"
                        aria-label="Close report dialog"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="report-job-title"
                        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <button
                            type="button"
                            aria-label="Close report dialog"
                            onClick={() => setIsOpen(false)}
                            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        >
                            <X size={20} />
                        </button>

                        <h2
                            id="report-job-title"
                            className="pr-12 text-2xl font-bold text-slate-950"
                        >
                            Report this job
                        </h2>

                        <p className="mt-2 leading-7 text-slate-600">
                            Tell us what may be wrong with “{jobTitle}”.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6">
                            <fieldset>
                                <legend className="text-sm font-semibold text-slate-900">
                                    Select a reason
                                </legend>

                                <div className="mt-4 space-y-3">
                                    {reportReasons.map((reason) => (
                                        <label
                                            key={reason}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                        >
                                            <input
                                                type="radio"
                                                name="reportReason"
                                                value={reason}
                                                checked={selectedReason === reason}
                                                onChange={(event) =>
                                                    setSelectedReason(event.target.value)
                                                }
                                                className="h-4 w-4 accent-blue-600"
                                            />

                                            {reason}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <button
                                type="submit"
                                disabled={!selectedReason}
                                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Submit Report
                            </button>

                            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                                Report submission will be connected to the backend moderation system
                                later.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
