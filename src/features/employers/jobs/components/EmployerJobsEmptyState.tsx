import { BriefcaseBusiness } from "lucide-react";

export default function EmployerJobsEmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <BriefcaseBusiness size={52} className="mx-auto text-slate-400" />

            <h2 className="mt-6 text-2xl font-bold text-slate-900">No jobs yet</h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
                Create your first job posting and start receiving applications from candidates.
            </p>
        </div>
    );
}
