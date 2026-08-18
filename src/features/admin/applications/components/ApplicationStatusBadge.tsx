import type { AdminApplicationStatus } from "../types/adminApplication";

const labels: Record<AdminApplicationStatus, string> = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    SHORTLISTED: "Legacy: Shortlisted",
    INTERVIEW: "Interview",
    OFFERED: "Offered",
    HIRED: "Hired",
    REJECTED: "Not Selected",
    WITHDRAWN: "Withdrawn",
};

const classes: Record<AdminApplicationStatus, string> = {
    SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",
    UNDER_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
    SHORTLISTED: "border-violet-200 bg-violet-50 text-violet-700",
    INTERVIEW: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OFFERED: "border-cyan-200 bg-cyan-50 text-cyan-700",
    HIRED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-slate-200 bg-slate-100 text-slate-700",
    WITHDRAWN: "border-rose-200 bg-rose-50 text-rose-700",
};

export function formatAdminApplicationStatus(status: AdminApplicationStatus): string {
    return labels[status];
}

export default function ApplicationStatusBadge({ status }: { status: AdminApplicationStatus }) {
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>
            {labels[status]}
        </span>
    );
}
