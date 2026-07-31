import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

type LogoProps = Readonly<{
    className?: string;
}>;

export default function Logo({ className = "" }: LogoProps) {
    return (
        <Link
            href="/"
            aria-label="JobsSpot home"
            className={`group inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-90 ${className}`}
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
                <BriefcaseBusiness size={21} />
            </span>

            <span>
                Jobs<span className="text-blue-600">Spot</span>
            </span>
        </Link>
    );
}
