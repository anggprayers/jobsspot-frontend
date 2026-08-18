import type { JobSubmissionStatus } from "../types/adminJobSubmission";

const statusStyles: Record<JobSubmissionStatus, string> = {
    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",
    CONTACTED: "border-amber-200 bg-amber-50 text-amber-700",
    APPROVED: "border-violet-200 bg-violet-50 text-violet-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
    PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<JobSubmissionStatus, string> = {
    SUBMITTED: "Submitted",
    CONTACTED: "Contacted",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PUBLISHED: "Published",
};

export default function JobSubmissionStatusBadge({ status }: { status: JobSubmissionStatus }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
}
