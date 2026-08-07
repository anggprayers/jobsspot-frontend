import Image from "next/image";
import Link from "next/link";

type LogoProps = Readonly<{
    className?: string;
    imageClassName?: string;
    textClassName?: string;
    priority?: boolean;
}>;

export default function Logo({
    className = "",
    imageClassName = "",
    textClassName = "",
    priority = false,
}: LogoProps) {
    return (
        <Link
            href="/"
            aria-label="JobsSpot home"
            className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
        >
            <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                priority={priority}
                className={`size-10 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-slate-200/70 ${imageClassName}`}
            />

            <span
                className={`text-2xl font-bold tracking-tight text-slate-950 ${textClassName}`}
            >
                Jobs<span className="text-blue-600">Spot</span>
            </span>
        </Link>
    );
}
